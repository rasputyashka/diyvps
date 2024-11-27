from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class Machine(models.Model):
    class StatusEnum(models.TextChoices):
        ACTIVE = 'ACTIVE', _('Active')
        BOOKED = 'BOOKED', _('Booked')
        REINSTALLING = 'REINSTALLING', _('Reinstalling')

    name = models.CharField(max_length=50, unique=True)
    status = models.CharField(
        max_length=50, choices=StatusEnum.choices, default=StatusEnum.ACTIVE
    )
    ipv4 = models.GenericIPAddressField(max_length=50)
    ipv6 = models.GenericIPAddressField(max_length=50, blank=True, null=True)
    password = models.CharField(max_length=50)
    cpuCores = models.IntegerField()
    ram = models.IntegerField()
    ssd = models.IntegerField(blank=True, null=True)
    hdd = models.IntegerField(blank=True, null=True)
    operatingSystem = models.CharField(max_length=50)
    bandwidth = models.IntegerField()

    def __str__(self):
        return self.name


class Booking(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    bookedBy = models.ForeignKey(User, on_delete=models.CASCADE)
    bookedFrom = models.DateTimeField()
    bookedUntil = models.DateTimeField()
    booked = models.BooleanField(default=True)
