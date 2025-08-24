import random
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from .models import VerificationCode
from orders.models import Order
from catalog.models import Wishlist, CartItem


def request_code(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        if not email:
            messages.error(request, 'Please enter your email.')
            return render(request, 'accounts/request_code.html')
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, 'No account found with that email. Please register or try again.')
            return render(request, 'accounts/request_code.html')
        code = f"{random.randint(0, 999999):06d}"
        VerificationCode.objects.create(user=user, code=code)
        send_mail(
            subject='Your Sanoria.pk verification code',
            message=f'Your verification code is {code}',
            from_email='no-reply@sanoria.pk',
            recipient_list=[email],
            fail_silently=True,
        )
        messages.success(request, 'Verification code sent. Please check your email.')
        return redirect('verify_code')
    return render(request, 'accounts/request_code.html')


def verify_code(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        code = request.POST.get('code', '').strip()
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, 'Account not found for provided email.')
            return render(request, 'accounts/verify_code.html')
        vc = VerificationCode.objects.filter(user=user, code=code, is_used=False).order_by('-created_at').first()
        if not vc:
            messages.error(request, 'Invalid code. Please try again or request a new code.')
            return render(request, 'accounts/verify_code.html')
        vc.is_used = True
        vc.save()
        user.email_verified = True
        user.save(update_fields=['email_verified'])
        messages.success(request, 'Email verified successfully. You can now sign in.')
        return redirect('/accounts/login/')
    return render(request, 'accounts/verify_code.html')


@login_required
def profile(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    wishlist = Wishlist.objects.filter(user=request.user).select_related('product')
    cart_items = CartItem.objects.filter(user=request.user).select_related('product')
    return render(request, 'accounts/profile.html', {
        'orders': orders,
        'wishlist': wishlist,
        'cart_items': cart_items,
    })
