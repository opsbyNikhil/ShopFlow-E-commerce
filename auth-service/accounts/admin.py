from django.contrib import admin

from .models import (
    UserProfile,
    PendingRegistration
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "first_name",
        "last_name",
        "mobile",
        "created_at",
    )

    search_fields = (
        "first_name",
        "last_name",
        "mobile",
        "user__email",
        "user__username",
    )


@admin.register(PendingRegistration)
class PendingRegistrationAdmin(admin.ModelAdmin):

    list_display = (
        "first_name",
        "last_name",
        "email",
        "mobile",
        "created_at",
    )

    search_fields = (
        "email",
        "mobile",
    )