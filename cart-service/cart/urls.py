from django.urls import path

from .views import (
    get_cart,
    add_to_cart,
    update_cart_item,
    remove_from_cart,
    clear_cart,
)


urlpatterns = [

    path(
        "<int:user_id>/",
        get_cart,
        name="get-cart"
    ),

    path(
        "<int:user_id>/add/",
        add_to_cart,
        name="add-to-cart"
    ),

    path(
        "<int:user_id>/item/<int:item_id>/",
        update_cart_item,
        name="update-cart-item"
    ),

    path(
        "<int:user_id>/item/<int:item_id>/remove/",
        remove_from_cart,
        name="remove-from-cart"
    ),

    path(
        "<int:user_id>/clear/",
        clear_cart,
        name="clear-cart"
    ),
]