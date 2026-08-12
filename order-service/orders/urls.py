from django.urls import path

from .views import (
    OrderCreateView,
    OrderListView,
    OrderDetailView, 
    DeliveryAddressView, 
    CreateOrderView
)


urlpatterns = [

    path(
        "",
        OrderListView.as_view(),
        name="order-list"
    ),

    path(
        "create/",
        OrderCreateView.as_view(),
        name="order-create"
    ),

    path(
        "<int:order_id>/",
        OrderDetailView.as_view(),
        name="order-detail"
    ),

     path(
        "delivery-address/",
        DeliveryAddressView.as_view(),
        name="delivery-address"
    ),

    path(
        "create-order/",
        CreateOrderView.as_view(),
        name="create-order"
    ),

]