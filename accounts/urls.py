from django.urls import path
from .views import request_code, verify_code, profile

urlpatterns = [
    path('request-code/', request_code, name='request_code'),
    path('verify-code/', verify_code, name='verify_code'),
    path('profile/', profile, name='profile'),
]
