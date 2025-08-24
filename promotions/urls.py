from django.urls import path
from .views import promo_home, scan_qr

urlpatterns = [
    path('', promo_home, name='promotions_home'),
    path('scan/', scan_qr, name='scan_qr'),
]
