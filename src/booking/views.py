import datetime
import logging

from django.utils.timezone import now
from django.contrib.auth.models import User
from django.db.models import Q
from django.shortcuts import get_object_or_404, get_list_or_404
from django.db import transaction, IntegrityError
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Machine, Booking
from .serializers import (
    MachineSerializer,
    BookingSerializer,
)
from .permissions import IsOwner, IsSuperUser
from .states import BookingState
from .exceptions import IncorrectDateException


logger = logging.getLogger(__name__)


class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def check_availiable(self, machine_pk, start, end):
        bookings_in_interval = Booking.objects.filter(
            machine=machine_pk
        ).exclude(Q(bookedUntil__lte=start) | Q(bookedFrom__gte=end))
        if bookings_in_interval:
            return False
        return True

    @action(detail=True, methods=['get', 'post'])
    def book(self, request, pk):
        start = request.query_params.get('start', '')
        end = request.query_params.get('end', '')

        try:
            start_datetime, end_datetime = get_validated_datetime(start, end)
        except IncorrectDateException:
            return Response(
                {'message': 'Wrong data format'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if end_datetime < now():
            return Response(
                {'message': 'Wrong book end datetime'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not self.check_availiable(pk, start_datetime, end_datetime):
            return Response(
                {'message': 'This machine is not available'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        machine = get_object_or_404(Machine, pk=pk)
        try:
            with transaction.atomic():
                booking_state = BookingState(machine)
                booking_state.process(owner=request.user, start_datetime=start_datetime, end_datetime=end_datetime)
        except IntegrityError as e:
            logger.exception(e)
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=['get', 'post'])
    def reinstall(self, request, pk):
        machine = get_object_or_404(pk=pk)
        machine.os = None

        # os.system(f'sudo /tmp/reinstall.sh {machine.name}')

        machine.save()

        # TODO add reinstalling logic
        return Response(
            {'message': 'The machine will be updated'},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=['GET'], permission_classes=[])
    def available_at_interval(self, request):
        """Gets all machines that are not booked in specified time interval."""
        start = request.query_params.get('start', '')
        end = request.query_params.get('end', '')
        try:
            start_datetime, end_datetime = get_validated_datetime(start, end)
        except IncorrectDateException:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        busy_machines = Booking.objects.filter(
            Q(bookedFrom__lt=end_datetime) & Q(bookedUntil__gt=start_datetime)
        )
        machines = busy_machines.values_list('machine_id', flat=True)
        active_non_booked_machines = Machine.objects.exclude(id__in=machines).filter(status=Machine.StatusEnum.ACTIVE)
        serializer = self.get_serializer(active_non_booked_machines, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'])
    def my(self, request):
        self.update_machines()
        now = datetime.datetime.now()
        user_current_bookings = Booking.objects.filter(
            Q(bookedBy=request.user) & Q(bookedUntil__gt=now)
        )
        user_machines = user_current_bookings.values_list(
            'machine_id', flat=True
        )
        user_machines = Machine.objects.filter(Q(pk__in=user_machines))
        serializer = self.get_serializer(user_machines, many=True)
        return Response(serializer.data)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        machine = Machine.objects.get(pk=self.request.data['machine'][0])
        serializer.save(bookedBy=self.request.user, machine=machine)

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [
                IsSuperUser,
            ]
        elif self.action == 'retrieve':
            self.permission_classes = [IsOwner]
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def history(self, request):
        queryset = Booking.objects.filter(bookedBy=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


def get_validated_datetime(start: str, end: str):
    try:
        start_datetime = datetime.datetime.strptime(start, '%Y-%m-%d-%H:%M')
        end_datetime = datetime.datetime.strptime(end, '%Y-%m-%d-%H:%M')
    except ValueError as exc:
        raise IncorrectDateException from exc

    if start_datetime > end_datetime:
        raise IncorrectDateException('Invalid period')

    return start_datetime, end_datetime
