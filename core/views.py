from django.shortcuts import render


def home(request):
    return render(request, 'core/home.html')


def robots_txt(request):
    return render(request, 'core/robots.txt', content_type='text/plain')

# Create your views here.
