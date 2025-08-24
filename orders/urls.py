from django.urls import path
from .views import orders_home

urlpatterns = [
    path('', orders_home, name='orders_home'),
]
