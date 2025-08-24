from django.shortcuts import render


def orders_home(request):
    return render(request, 'orders/home.html')

# Create your views here.
