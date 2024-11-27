from django.contrib.auth.models import Group, User
from django.contrib.auth import authenticate, login, logout
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from booking.permissions import IsSuperUser
from .serializers import (
    UserSerializer,
    GroupSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperUser]

    @action(
        detail=False,
        methods=['post'],
        permission_classes=[permissions.AllowAny],
    )
    def registerr(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'User registered successfully'},
                status=status.HTTP_201_CREATED,
            )
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    @action(
        detail=False,
        methods=['post'],
        permission_classes=[permissions.AllowAny],
    )
    def loginn(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                return Response(
                    {'message': 'User logined successfully'},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {'error': 'Wrong credentials.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=False,
        methods=['get'],
        permission_classes=[permissions.IsAuthenticated],
    )
    def logoutt(self, request):
        logout(request)
        return Response(
            {'message': 'User logout successfully'}, status=status.HTTP_200_OK
        )


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
