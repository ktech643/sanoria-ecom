from django.shortcuts import render


def promo_home(request):
    return render(request, 'promotions/home.html')


def scan_qr(request):
    return render(request, 'promotions/scan.html')

# Create your views here.
