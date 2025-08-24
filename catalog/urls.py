from django.urls import path
from .views import shop, product_detail

urlpatterns = [
    path('', shop, name='shop'),
    path('<slug:slug>/', product_detail, name='product_detail'),
]
