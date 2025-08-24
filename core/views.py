from django.shortcuts import render
from catalog.models import Product
from blog.models import Post


def home(request):
    most_viewed = Product.objects.order_by('-views')[:8]
    new_arrivals = Product.objects.order_by('-created_at')[:8]
    latest_posts = Post.objects.filter(published=True).order_by('-created_at')[:3]
    return render(request, 'core/home.html', {
        'most_viewed': most_viewed,
        'new_arrivals': new_arrivals,
        'latest_posts': latest_posts,
    })


def robots_txt(request):
    return render(request, 'core/robots.txt', content_type='text/plain')

# Create your views here.
