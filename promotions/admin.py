from django.contrib import admin
from .models import Promotion


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ("code", "title", "discount_percent", "active")
    list_filter = ("active",)
    search_fields = ("code", "title")

# Register your models here.
