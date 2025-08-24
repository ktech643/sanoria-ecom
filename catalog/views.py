from django.shortcuts import render, get_object_or_404, redirect
from django.db.models import Q
from django.contrib import messages
from .models import Product, Category, Review
from django.contrib.auth.decorators import login_required


def shop(request):
    skin = request.GET.get('skin')
    q = request.GET.get('q', '').strip()
    category_slug = request.GET.get('category')
    products = Product.objects.all().order_by('-created_at')
    if skin:
        products = products.filter(skin_type=skin)
    if q:
        products = products.filter(Q(name__icontains=q) | Q(description__icontains=q))
    if category_slug:
        products = products.filter(category__slug=category_slug)
    categories = Category.objects.all()
    return render(request, 'catalog/shop.html', {
        'products': products,
        'categories': categories,
        'skin': skin,
        'q': q,
        'category_slug': category_slug,
    })


def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    Product.objects.filter(pk=product.pk).update(views=models.F('views') + 1)
    if request.method == 'POST':
        if not request.user.is_authenticated:
            messages.error(request, 'Please log in to leave a review.')
            return redirect('/accounts/login/?next=' + request.path)
        rating = int(request.POST.get('rating', '5'))
        comment = request.POST.get('comment', '').strip()
        Review.objects.create(product=product, user=request.user, rating=rating, comment=comment)
        messages.success(request, 'Thanks for your review!')
        return redirect(request.path)
    reviews = product.reviews.select_related('user').all()
    return render(request, 'catalog/product_detail.html', {
        'product': product,
        'reviews': reviews,
    })

# Create your views here.
