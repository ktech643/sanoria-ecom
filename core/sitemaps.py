from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from catalog.models import Product
from blog.models import Post


class StaticViewSitemap(Sitemap):
    priority = 0.5
    changefreq = 'weekly'

    def items(self):
        return ['home', 'shop', 'blog_home', 'promotions_home']

    def location(self, item):
        try:
            return reverse(item)
        except Exception:
            return '/'


class ProductSitemap(Sitemap):
    changefreq = 'daily'
    priority = 0.8

    def items(self):
        return Product.objects.all()

    def location(self, obj):
        return f"/shop/?p={obj.slug}"


class PostSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.6

    def items(self):
        return Post.objects.filter(published=True)

    def location(self, obj):
        return f"/blog/?p={obj.slug}"
