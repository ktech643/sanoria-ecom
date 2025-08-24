from django.db import models
from django.contrib.auth import get_user_model
from catalog.models import Product


class Order(models.Model):
    PAYMENT_METHODS = [
        ('cod', 'Cash on Delivery'),
        ('jazzcash', 'JazzCash'),
        ('easypaisa', 'EasyPaisa'),
        ('bank', 'Bank Transfer'),
    ]

    SHIPPING_PARTNER = [
        ('leopard', 'Leopard Courier'),
        ('tcs', 'TCS'),
        ('pkdex', 'PkDex'),
    ]

    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    shipping_partner = models.CharField(max_length=20, choices=SHIPPING_PARTNER, default='tcs')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='cod')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_paid = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='pending')
    promo_code = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def line_total(self):
        return self.quantity * self.price

# Create your models here.
