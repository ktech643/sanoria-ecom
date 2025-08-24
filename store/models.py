from django.db import models
from django.contrib.auth import get_user_model


class TimeStampedModel(models.Model):
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		abstract = True


class Category(TimeStampedModel):
	name = models.CharField(max_length=120, unique=True)
	slug = models.SlugField(max_length=140, unique=True)

	def __str__(self) -> str:
		return self.name


class SkinType(TimeStampedModel):
	name = models.CharField(max_length=100, unique=True)
	slug = models.SlugField(max_length=140, unique=True)

	def __str__(self) -> str:
		return self.name


class Product(TimeStampedModel):
	name = models.CharField(max_length=200)
	slug = models.SlugField(max_length=220, unique=True)
	category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
	skin_types = models.ManyToManyField(SkinType, blank=True, related_name='products')
	price = models.DecimalField(max_digits=10, decimal_places=2)
	sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	stock = models.PositiveIntegerField(default=0)
	description = models.TextField(blank=True)
	image = models.ImageField(upload_to='products/', null=True, blank=True)
	is_active = models.BooleanField(default=True)

	def __str__(self) -> str:
		return self.name


class ProductImage(TimeStampedModel):
	product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
	image = models.ImageField(upload_to='products/gallery/')

	def __str__(self) -> str:
		return f"Image of {self.product.name}"


class CourierPartner(TimeStampedModel):
	name = models.CharField(max_length=120, unique=True)
	code = models.SlugField(max_length=80, unique=True)

	def __str__(self) -> str:
		return self.name


class PaymentMethod(TimeStampedModel):
	name = models.CharField(max_length=120, unique=True)
	code = models.SlugField(max_length=80, unique=True)
	is_wallet = models.BooleanField(default=False)
	is_cod = models.BooleanField(default=False)

	def __str__(self) -> str:
		return self.name


class Promotion(TimeStampedModel):
	code = models.CharField(max_length=40, unique=True)
	title = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	discount_percent = models.PositiveIntegerField(null=True, blank=True)
	discount_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	is_active = models.BooleanField(default=True)
	qr_image = models.ImageField(upload_to='promotions/', null=True, blank=True)

	def __str__(self) -> str:
		return f"{self.title} ({self.code})"


User = get_user_model()


class Cart(TimeStampedModel):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts')
	is_active = models.BooleanField(default=True)

	def __str__(self) -> str:
		return f"Cart #{self.id} for {self.user}"


class CartItem(TimeStampedModel):
	cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
	product = models.ForeignKey(Product, on_delete=models.PROTECT)
	quantity = models.PositiveIntegerField(default=1)
	price_at_add = models.DecimalField(max_digits=10, decimal_places=2)

	def __str__(self) -> str:
		return f"{self.product.name} x{self.quantity}"


class Wishlist(TimeStampedModel):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlists')

	def __str__(self) -> str:
		return f"Wishlist #{self.id} for {self.user}"


class WishlistItem(TimeStampedModel):
	wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name='items')
	product = models.ForeignKey(Product, on_delete=models.PROTECT)

	def __str__(self) -> str:
		return f"{self.product.name}"


class Order(TimeStampedModel):
	STATUS_CHOICES = (
		('pending', 'Pending'),
		('paid', 'Paid'),
		('shipped', 'Shipped'),
		('delivered', 'Delivered'),
		('cancelled', 'Cancelled'),
	)
	user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='orders')
	courier = models.ForeignKey(CourierPartner, on_delete=models.SET_NULL, null=True, blank=True)
	payment_method = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True, blank=True)
	status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
	total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
	free_gift_note = models.CharField(max_length=200, blank=True)

	def __str__(self) -> str:
		return f"Order #{self.id} - {self.user}"


class OrderItem(TimeStampedModel):
	order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
	product = models.ForeignKey(Product, on_delete=models.PROTECT)
	quantity = models.PositiveIntegerField(default=1)
	price = models.DecimalField(max_digits=10, decimal_places=2)

	def __str__(self) -> str:
		return f"{self.product.name} x{self.quantity}"


class Review(TimeStampedModel):
	product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	rating = models.PositiveIntegerField(default=5)
	comment = models.TextField(blank=True)

	def __str__(self) -> str:
		return f"Review {self.rating}/5 by {self.user}"

