from rest_framework import serializers
from .models import Machine, Booking


class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = (
            'pk',
            'name',
            'status',
            'operating_system',
            'password',
            'cpu_cores',
            'ram',
            'ssd',
            'ipv4',
            'ipv6',
            'bandwidth',
        )


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['pk', 'machine', 'booked_until', 'booked_from']
