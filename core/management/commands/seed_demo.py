from django.core.management.base import BaseCommand
from django.utils.text import slugify
from catalog.models import Category, Product
from blog.models import Post


class Command(BaseCommand):
    def handle(self, *args, **options):
        skincare, _ = Category.objects.get_or_create(name='Skincare', slug='skincare')
        makeup, _ = Category.objects.get_or_create(name='Makeup', slug='makeup')

        demo_products = [
            {
                'name': 'Gold Glow Serum',
                'category': skincare,
                'price': '2999.00',
                'skin_type': 'normal',
                'description': 'Luxurious serum for radiant skin.'
            },
            {
                'name': 'Velvet Matte Lipstick',
                'category': makeup,
                'price': '1499.00',
                'skin_type': 'normal',
                'description': 'Rich pigment with comfortable wear.'
            }
        ]
        for d in demo_products:
            Product.objects.get_or_create(
                slug=slugify(d['name']),
                defaults={
                    'name': d['name'],
                    'category': d['category'],
                    'price': d['price'],
                    'skin_type': d['skin_type'],
                    'description': d['description'],
                }
            )
        Post.objects.get_or_create(
            slug='welcome-to-sanoria',
            defaults={'title': 'Welcome to Sanoria', 'excerpt': 'Discover luxury skincare', 'content': 'Hello world', 'published': True}
        )
        self.stdout.write(self.style.SUCCESS('Seeded demo data'))