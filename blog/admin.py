from django.contrib import admin
from .models import BlogPost


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
	list_display = ("title", "is_published", "created_at")
	list_filter = ("is_published",)
	search_fields = ("title", "slug")
	prepopulated_fields = {"slug": ("title",)}
