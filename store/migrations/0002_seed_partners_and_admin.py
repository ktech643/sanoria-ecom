from django.db import migrations
from django.contrib.auth.hashers import make_password


def seed_partners_and_admin(apps, schema_editor):
	Courier = apps.get_model('store', 'CourierPartner')
	Payment = apps.get_model('store', 'PaymentMethod')
	User = apps.get_model('auth', 'User')

	for name, code in [
		('Leopard', 'leopard'),
		('TCS', 'tcs'),
		('PkDex', 'pkdex'),
	]:
		Courier.objects.get_or_create(code=code, defaults={'name': name})

	for name, code, is_wallet, is_cod in [
		('JazzCash', 'jazzcash', True, False),
		('EasyPaisa', 'easypaisa', True, False),
		('Bank Transfer', 'bank', False, False),
		('Cash on Delivery', 'cod', False, True),
	]:
		Payment.objects.get_or_create(code=code, defaults={'name': name, 'is_wallet': is_wallet, 'is_cod': is_cod})

	admin_email = 'abcd@gmail.com'
	admin_password = '11223344'
	if not User.objects.filter(email=admin_email).exists():
		User.objects.create(
			username=admin_email,
			email=admin_email,
			password=make_password(admin_password),
			is_staff=True,
			is_superuser=True,
		)


def unseed(apps, schema_editor):
	Courier = apps.get_model('store', 'CourierPartner')
	Payment = apps.get_model('store', 'PaymentMethod')
	User = apps.get_model('auth', 'User')

	Courier.objects.filter(code__in=['leopard','tcs','pkdex']).delete()
	Payment.objects.filter(code__in=['jazzcash','easypaisa','bank','cod']).delete()
	User.objects.filter(email='abcd@gmail.com').delete()


class Migration(migrations.Migration):

	dependencies = [
		('store', '0001_initial'),
	]

	operations = [
		migrations.RunPython(seed_partners_and_admin, reverse_code=unseed),
	]

