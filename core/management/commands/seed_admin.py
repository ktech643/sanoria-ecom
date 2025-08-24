from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Create initial admin user abcd@gmail.com / 11223344 if not exists"

    def handle(self, *args, **options):
        User = get_user_model()
        username = 'admin'
        email = 'abcd@gmail.com'
        password = '11223344'
        if not User.objects.filter(email=email).exists():
            user = User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f"Created admin user {email}"))
        else:
            self.stdout.write(self.style.WARNING(f"Admin user {email} already exists"))
