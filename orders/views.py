from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Order, OrderItem
from catalog.models import CartItem


def orders_home(request):
    return render(request, 'orders/home.html')


@login_required
def checkout(request):
    cart_items = CartItem.objects.filter(user=request.user).select_related('product')
    if request.method == 'POST':
        shipping_partner = request.POST.get('shipping_partner', 'tcs')
        payment_method = request.POST.get('payment_method', 'cod')
        order = Order.objects.create(user=request.user, shipping_partner=shipping_partner, payment_method=payment_method)
        total = 0
        for ci in cart_items:
            OrderItem.objects.create(order=order, product=ci.product, quantity=ci.quantity, price=ci.product.price)
            total += ci.quantity * ci.product.price
        order.total_amount = total
        order.status = 'placed'
        order.save()
        cart_items.delete()
        messages.success(request, 'Order placed successfully!')
        return redirect('order_detail', order_id=order.id)
    return render(request, 'orders/checkout.html', {
        'cart_items': cart_items,
    })


@login_required
def order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    return render(request, 'orders/detail.html', {
        'order': order,
    })

# Create your views here.
