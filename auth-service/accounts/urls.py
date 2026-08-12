from django.urls import path

from .views import (
    signup,
    verify_otp,
    request_login_otp,
    verify_login_otp,
    login_password,
    forgot_password,
    reset_password,
    resend_login_otp
)


urlpatterns = [

    # Signup
    path(
        "signup/",
        signup
    ),

    path(
        "verify-otp/",
        verify_otp
    ),

    # Login
    path(
        "request-login-otp/",
        request_login_otp
    ),

    path(
        "verify-login-otp/",
        verify_login_otp
    ),

    path(
        "login-password/",
        login_password
    ),

    # Forgot password
    path(
        "forgot-password/",
        forgot_password
    ),

    path(
        "reset-password/",
        reset_password
    ),

    path( 
        "resend-login-otp/", 
        resend_login_otp, 
        name="resend-login-otp" 
    )
]