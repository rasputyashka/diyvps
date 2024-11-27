from rest_framework import serializers
from .models import Machine, Booking


class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = (
            'pk',
            'password',
            'status',
            'cpuCores',
            'ram',
            'ssd',
            'ipv4',
            'ipv6',
            'bandwidth',
            'operatingSystem',
            'status',
            'name',
        )


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'machine', 'bookedUntil', 'bookedFrom', 'booked']
