import os
import random

import resend

from datetime import timedelta

from django.contrib.auth.models import User
from django.contrib.auth.hashers import (
    make_password,
    check_password
)
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode
)

from django.core.mail import send_mail
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import LoginOTP

from django.utils.encoding import force_bytes

from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    UserProfile,
    PendingRegistration,
    LoginOTP,
    LoginSession
)




# ============================================================
# RESEND CONFIGURATION
# ============================================================

resend.api_key = os.getenv("RESEND_API_KEY")



# ============================================================
# SIGNUP
# ============================================================

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def signup(request):

    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    email = request.data.get("email")
    mobile = request.data.get("mobile")
    password = request.data.get("password")

    # -----------------------------
    # Required fields
    # -----------------------------

    if not all([
        first_name,
        last_name,
        email,
        mobile,
        password
    ]):

        return Response(
            {
                "message": "All fields are required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # -----------------------------
    # Check email
    # -----------------------------

    if User.objects.filter(
        email=email
    ).exists():

        return Response(
            {
                "message": "Email already registered"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # -----------------------------
    # Check mobile
    # -----------------------------

    if UserProfile.objects.filter(
        mobile=mobile
    ).exists():

        return Response(
            {
                "message": "Mobile number already registered"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # -----------------------------
    # Username
    # -----------------------------

    username = (
        first_name + last_name
    ).lower().replace(" ", "")


    # If username already exists,
    # add random number

    if User.objects.filter(
        username=username
    ).exists():

        username = (
            username +
            str(random.randint(100, 999))
        )


    # -----------------------------
    # Generate OTP
    # -----------------------------

    otp = str(
        random.randint(
            100000,
            999999
        )
    )


    # -----------------------------
    # Delete previous registration
    # -----------------------------

    PendingRegistration.objects.filter(
        email=email
    ).delete()


    # -----------------------------
    # Save pending registration
    #
    # Password is stored hashed
    # -----------------------------

    pending = PendingRegistration.objects.create(

        first_name=first_name,

        last_name=last_name,

        email=email,

        mobile=mobile,

        password=make_password(password),

        otp=make_password(otp)
    )


    # -----------------------------
    # Send OTP using Resend
    # -----------------------------

    try:

        params = {

            "from": os.getenv(
                "RESEND_FROM_EMAIL"
            ),

            "to": [email],

            "subject": "ShopFlow Registration OTP",

            "html": f"""
                <h2>Welcome to ShopFlow</h2>

                <p>
                    Hello {first_name},
                </p>

                <p>
                    Your registration OTP is:
                </p>

                <h1>{otp}</h1>

                <p>
                    This OTP is valid for 10 minutes.
                </p>

                <p>
                    Do not share this OTP with anyone.
                </p>
            """
        }

        resend.Emails.send(params)


    except Exception as error:

        pending.delete()

        return Response(
            {
                "message": "Unable to send OTP",
                "error": str(error)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


    return Response(
        {
            "message": "OTP sent successfully",

            "email": email
        },
        status=status.HTTP_200_OK
    )



# ============================================================
# VERIFY SIGNUP OTP
# ============================================================

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def verify_otp(request):

    email = request.data.get("email")
    otp = request.data.get("otp")


    if not email or not otp:

        return Response(
            {
                "message": "Email and OTP are required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    try:

        pending = PendingRegistration.objects.get(
            email=email
        )

    except PendingRegistration.DoesNotExist:

        return Response(
            {
                "message": "Registration not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )


    # -----------------------------
    # OTP expiry
    # -----------------------------

    expiry_time = (
        pending.otp_created_at
        + timedelta(minutes=10)
    )


    if timezone.now() > expiry_time:

        pending.delete()

        return Response(
            {
                "message": "OTP expired"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # -----------------------------
    # Verify OTP
    # -----------------------------

    if not check_password(
        otp,
        pending.otp
    ):

        return Response(
            {
                "message": "Invalid OTP"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # -----------------------------
    # Create Django User
    # -----------------------------

    username = (
        pending.first_name +
        pending.last_name
    ).lower().replace(" ", "")


    if User.objects.filter(
        username=username
    ).exists():

        username = (
            username +
            str(random.randint(100, 999))
        )


    user = User.objects.create(

        username=username,

        email=pending.email,

        first_name=pending.first_name,

        last_name=pending.last_name,

        password=pending.password
    )


    # -----------------------------
    # Create User Profile
    # -----------------------------

    UserProfile.objects.create(

        user=user,

        first_name=pending.first_name,

        last_name=pending.last_name,

        mobile=pending.mobile
    )


    # -----------------------------
    # Delete pending registration
    # -----------------------------

    pending.delete()


    return Response(
        {
            "message": "Registration successful",

            "username": user.username,

            "email": user.email
        },
        status=status.HTTP_201_CREATED
    )



# ============================================================
# REQUEST LOGIN OTP
# ============================================================

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def request_login_otp(request):

    login_value = request.data.get("login")

    if not login_value:

        return Response(
            {
                "message": "Email or mobile number is required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find by email
    user = User.objects.filter(
        email=login_value
    ).first()

    # Find by mobile
    if user is None:

        profile = UserProfile.objects.filter(
            mobile=login_value
        ).first()

        if profile:
            user = profile.user

    if user is None:

        return Response(
            {
                "message":
                "No account found with this email or mobile number"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Generate OTP
    otp = str(
        random.randint(
            100000,
            999999
        )
    )

    # Delete previous OTP
    LoginOTP.objects.filter(
        user=user
    ).delete()

    # Save OTP
    LoginOTP.objects.create(
        user=user,
        otp=otp
    )

    # Send OTP
    try:

        params = {
            "from": os.getenv(
                "RESEND_FROM_EMAIL"
            ),

            "to": [user.email],

            "subject": "ShopFlow Login OTP",

            "html": f"""
                <h2>ShopFlow Login</h2>

                <p>
                    Hello {user.first_name},
                </p>

                <p>
                    Your login OTP is:
                </p>

                <h1>{otp}</h1>

                <p>
                    This OTP is valid for 10 minutes.
                </p>
            """
        }

        resend.Emails.send(params)

    except Exception as error:

        return Response(
            {
                "message": "Unable to send OTP",
                "error": str(error)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(
        {
            "message": "OTP sent successfully",

            "user_id": user.id
        },
        status=status.HTTP_200_OK
    )


# ============================================================
# VERIFY LOGIN OTP
# ============================================================

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def verify_login_otp(request):

    user_id = request.data.get("user_id")
    otp = request.data.get("otp")

    if not user_id or not otp:

        return Response(
            {
                "message":
                "User ID and OTP are required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        login_otp = LoginOTP.objects.get(
            user_id=user_id
        )

    except LoginOTP.DoesNotExist:

        return Response(
            {
                "message": "OTP not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # OTP expires after 10 minutes

    expiry_time = (
        login_otp.created_at
        + timedelta(minutes=10)
    )

    if timezone.now() > expiry_time:

        login_otp.delete()

        return Response(
            {
                "message": "OTP expired"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check OTP

    if otp != login_otp.otp:

        return Response(
            {
                "message": "Invalid OTP"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    user = login_otp.user

    # Delete old login sessions

    LoginSession.objects.filter(
        user=user
    ).delete()

    # Create temporary login session

    login_session = LoginSession.objects.create(

        user=user,

        otp_verified=True,

        expires_at=timezone.now()
        + timedelta(minutes=10)
    )

    # Delete OTP

    login_otp.delete()

    return Response(
        {
            "message":
            "OTP verified successfully",

            "session_token":
            str(login_session.session_token)
        },
        status=status.HTTP_200_OK
    )


# ============================================================
# RESEND OTP
# ============================================================


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def resend_login_otp(request):

    user_id = request.data.get("user_id")

    if not user_id:

        return Response(
            {
                "message": "User ID is required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        login_otp = LoginOTP.objects.get(
            user_id=user_id
        )

    except LoginOTP.DoesNotExist:

        return Response(
            {
                "message": "OTP not found. Please login again."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Generate new 6-digit OTP
    new_otp = str(
        random.randint(100000, 999999)
    )

    # Update OTP
    login_otp.otp = new_otp

    # Reset OTP expiry time
    login_otp.created_at = timezone.now()

    login_otp.save(
        update_fields=[
            "otp",
            "created_at"
        ]
    )

    try:

        # Send email using Resend API
        email = resend.Emails.send(
            {
                "from": settings.RESEND_FROM_EMAIL,
                "to": [login_otp.user.email],
                "subject": "Your Login OTP",
                "html": f"""
                    <h2>Login OTP</h2>

                    <p>
                        Your new login OTP is:
                    </p>

                    <h1>{new_otp}</h1>

                    <p>
                        This OTP is valid for 10 minutes.
                    </p>

                    <p>
                        If you did not request this OTP,
                        please ignore this email.
                    </p>
                """
            }
        )

    except Exception as e:

        # If email sending fails,
        # remove the newly generated OTP
        # so the old OTP is not accidentally used.
        login_otp.delete()

        print("Resend email error:", e)

        return Response(
            {
                "message": "Failed to send OTP"
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(
        {
            "message": "New OTP sent successfully"
        },
        status=status.HTTP_200_OK
    )



# ============================================================
# FORGOT PASSWORD
# ============================================================

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def forgot_password(request):

    email = request.data.get("email")


    if not email:

        return Response(
            {
                "message": "Email is required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    try:

        user = User.objects.get(
            email=email
        )

    except User.DoesNotExist:

        return Response(
            {
                "message":
                "No account found with this email"
            },
            status=status.HTTP_404_NOT_FOUND
        )


    # -----------------------------
    # Generate reset token
    # -----------------------------

    token = default_token_generator.make_token(
        user
    )


    uid = urlsafe_base64_encode(
        force_bytes(user.pk)
    )


    # -----------------------------
    # React reset password URL
    # -----------------------------

    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )


    reset_link = (
        f"{frontend_url}"
        f"/reset-password/"
        f"{uid}/"
        f"{token}"
    )


    # -----------------------------
    # Send email
    # -----------------------------

    try:

        params = {

            "from": os.getenv(
                "RESEND_FROM_EMAIL"
            ),

            "to": [user.email],

            "subject":
            "ShopFlow Reset Password",

            "html": f"""
                <h2>Reset Your ShopFlow Password</h2>

                <p>
                    Hello {user.first_name},
                </p>

                <p>
                    Click the button below to reset
                    your password.
                </p>

                <p>
                    <a href="{reset_link}"
                       style="
                       display:inline-block;
                       padding:12px 20px;
                       background:#1677ff;
                       color:white;
                       text-decoration:none;
                       border-radius:6px;
                       ">
                       Reset Password
                    </a>
                </p>

                <p>
                    This link will expire after use
                    or when the token becomes invalid.
                </p>
            """
        }

        resend.Emails.send(params)


    except Exception as error:

        return Response(
            {
                "message": "Unable to send reset email",
                "error": str(error)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


    return Response(
        {
            "message":
            "Password reset link sent successfully"
        },
        status=status.HTTP_200_OK
    )



# ============================================================
# RESET PASSWORD
# ============================================================

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def reset_password(request):

    uid = request.data.get("uid")
    token = request.data.get("token")

    old_password = request.data.get(
        "old_password"
    )

    new_password = request.data.get(
        "new_password"
    )


    if not uid or not token:

        return Response(
            {
                "message": "Invalid reset link"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    if not old_password or not new_password:

        return Response(
            {
                "message":
                "Old password and new password are required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # -----------------------------
    # Decode User ID
    # -----------------------------

    try:

        user_id = urlsafe_base64_decode(
            uid
        ).decode()

        user = User.objects.get(
            pk=user_id
        )

    except Exception:

        return Response(
            {
                "message": "Invalid reset link"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # -----------------------------
    # Validate reset token
    # -----------------------------

    if not default_token_generator.check_token(
        user,
        token
    ):

        return Response(
            {
                "message":
                "Reset link is invalid or expired"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # -----------------------------
    # Check old password
    # -----------------------------

    if not check_password(
        old_password,
        user.password
    ):

        return Response(
            {
                "message":
                "Old password is incorrect"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # -----------------------------
    # Set new password
    # -----------------------------

    user.set_password(
        new_password
    )

    user.save()


    return Response(
        {
            "message":
            "Password reset successfully"
        },
        status=status.HTTP_200_OK
    )

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def login_password(request):

    session_token = request.data.get(
        "session_token"
    )

    password = request.data.get(
        "password"
    )

    if not session_token or not password:

        return Response(
            {
                "message":
                "Session token and password are required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find login session

    try:

        login_session = LoginSession.objects.get(
            session_token=session_token,
            otp_verified=True
        )

    except LoginSession.DoesNotExist:

        return Response(
            {
                "message":
                "Invalid login session"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Check session expiry

    if timezone.now() > login_session.expires_at:

        login_session.delete()

        return Response(
            {
                "message":
                "Login session expired. Please request OTP again."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    user = login_session.user

    # Check password

    if not check_password(
        password,
        user.password
    ):

        return Response(
            {
                "message":
                "Incorrect password"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Password correct
    # Now generate JWT

    refresh = RefreshToken.for_user(
        user
    )

    # Session can no longer be reused

    login_session.delete()

    return Response(
        {
            "message":
            "Login successful",

            "access":
            str(refresh.access_token),

            "refresh":
            str(refresh),

            "user": {

                "id": user.id,

                "username": user.username,

                "email": user.email,

                "first_name": user.first_name,

                "last_name": user.last_name
            }
        },
        status=status.HTTP_200_OK
    )