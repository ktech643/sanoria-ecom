from django.urls import path
from .views import orders_home, checkout, order_detail

urlpatterns = [
    path('', orders_home, name='orders_home'),
    path('checkout/', checkout, name='checkout'),
    path('<int:order_id>/', order_detail, name='order_detail'),
]
