from django.db import migrations


def seed_blogs(apps, schema_editor):
	BlogPost = apps.get_model('blog', 'BlogPost')
	if not BlogPost.objects.exists():
		BlogPost.objects.create(title='Welcome to Sanoria', slug='welcome-to-sanoria', content='Our journey to elegant beauty.')


def unseed(apps, schema_editor):
	BlogPost = apps.get_model('blog', 'BlogPost')
	BlogPost.objects.filter(slug='welcome-to-sanoria').delete()


class Migration(migrations.Migration):

	dependencies = [
		('blog', '0001_initial'),
	]

	operations = [
		migrations.RunPython(seed_blogs, reverse_code=unseed),
	]

