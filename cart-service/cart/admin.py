from django.contrib import admin

from .models import Cart, CartItem


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user_id",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "user_id",
    )


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "cart",
        "product_id",
        "product_name",
        "price",
        "quantity",
        "created_at",
    )

    search_fields = (
        "product_name",
        "product_id",
    )

    list_filter = (
        "created_at",
    )