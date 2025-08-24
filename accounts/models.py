from django.db import models
from django.contrib.auth import get_user_model


class VerificationCode(models.Model):
	PURPOSE_CHOICES = (
		('signup', 'Signup'),
		('login', 'Login'),
		('password_reset', 'Password Reset'),
		('promotion', 'Promotion'),
	)
	user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='verification_codes')
	code = models.CharField(max_length=8)
	purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
	is_used = models.BooleanField(default=False)
	expires_at = models.DateTimeField()
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		indexes = [
			models.Index(fields=['code', 'purpose']),
		]

	def __str__(self) -> str:
		return f"{self.purpose} code for {self.user}"

