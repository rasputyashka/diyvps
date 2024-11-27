from django.contrib import admin

from .models import Machine, Booking

admin.site.register(
    [
        Machine,
        Booking,
    ]
)
