from django.urls import path, include
from rest_framework import routers
from users.views import (
    UserViewSet,
    GroupViewSet,
)

router = routers.DefaultRouter()
router.register(r'', UserViewSet)
router.register(r'groups', GroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
