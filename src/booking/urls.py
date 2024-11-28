from django.urls import path, include
from rest_framework import routers

from booking.views import (
    MachineViewSet,
    BookingViewSet,
)

router = routers.DefaultRouter()
router.register(r'machines', MachineViewSet, basename='machine')
router.register(r'booking', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
]
