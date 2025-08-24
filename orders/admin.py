from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "payment_method", "shipping_partner", "total_amount", "is_paid", "created_at")
    list_filter = ("status", "payment_method", "shipping_partner", "is_paid")
    inlines = [OrderItemInline]

# Register your models here.
