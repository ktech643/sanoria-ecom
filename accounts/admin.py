from django.contrib import admin
from .models import VerificationCode


@admin.register(VerificationCode)
class VerificationCodeAdmin(admin.ModelAdmin):
	list_display = ("user", "purpose", "code", "is_used", "expires_at")
	list_filter = ("purpose", "is_used")
	search_fields = ("user__email", "code")
