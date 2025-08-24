from django.contrib import admin
from .models import (
	Category, SkinType, Product, ProductImage,
	CourierPartner, PaymentMethod, Promotion,
	Cart, CartItem, Wishlist, WishlistItem,
	Order, OrderItem, Review
)


class ProductImageInline(admin.TabularInline):
	model = ProductImage
	extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
	list_display = ("name", "category", "price", "is_active")
	list_filter = ("category", "is_active")
	search_fields = ("name", "slug")
	inlines = [ProductImageInline]
	prepopulated_fields = {"slug": ("name",)}


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	prepopulated_fields = {"slug": ("name",)}
	search_fields = ("name",)


@admin.register(SkinType)
class SkinTypeAdmin(admin.ModelAdmin):
	prepopulated_fields = {"slug": ("name",)}
	search_fields = ("name",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "status", "total_amount")
	list_filter = ("status",)


admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Wishlist)
admin.site.register(WishlistItem)
admin.site.register(OrderItem)
admin.site.register(Review)
admin.site.register(CourierPartner)
admin.site.register(PaymentMethod)
admin.site.register(Promotion)
