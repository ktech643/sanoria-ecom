from django.shortcuts import render
from .models import Product, Promotion
from blog.models import BlogPost


def homepage(request):
	# Homepage sections
	promotions = Promotion.objects.filter(is_active=True)
	new_arrivals = Product.objects.order_by('-created_at')[:8]
	most_viewed = Product.objects.order_by('-id')[:8]
	blogs = BlogPost.objects.filter(is_published=True).order_by('-created_at')[:4]
	context = {
		'promotions': promotions,
		'new_arrivals': new_arrivals,
		'most_viewed': most_viewed,
		'blogs': blogs,
	}
	return render(request, 'store/home.html', context)

# Create your views here.
