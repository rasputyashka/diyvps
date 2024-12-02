from django.urls import include, path
from django.contrib import admin


urlpatterns = [
    path('', include('booking.urls')),
    path('accounts/', include('accounts.urls')),
    path('admin/', admin.site.urls),
]
