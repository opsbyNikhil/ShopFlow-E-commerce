from django.db import models
from django.contrib.auth.models import User
import uuid


class UserProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    first_name = models.CharField(max_length=100)

    last_name = models.CharField(max_length=100)

    mobile = models.CharField(
        max_length=15,
        unique=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class PendingRegistration(models.Model):

    first_name = models.CharField(max_length=100)

    last_name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    mobile = models.CharField(max_length=15)

    password = models.CharField(max_length=255)

    otp = models.CharField(max_length=128)

    otp_created_at = models.DateTimeField(auto_now=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class LoginOTP(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="login_otps"
    )

    otp = models.CharField(max_length=128)

    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username



class LoginSession(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    session_token = models.UUIDField(
        default=uuid.uuid4,
        unique=True
    )

    otp_verified = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    expires_at = models.DateTimeField()

    def __str__(self):
        return self.user.username