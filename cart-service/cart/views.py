from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Cart, CartItem
from .serializers import CartSerializer


@api_view(["GET"])
def get_cart(request, user_id):

    cart, created = Cart.objects.get_or_create(
        user_id=user_id
    )

    serializer = CartSerializer(cart)

    return Response(serializer.data)


@api_view(["POST"])
def add_to_cart(request, user_id):

    product_id = request.data.get("product_id")
    product_name = request.data.get("product_name")
    price = request.data.get("price")
    quantity = request.data.get("quantity", 1)

    if not product_id or not product_name or price is None:
        return Response(
            {"error": "product_id, product_name and price are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart, created = Cart.objects.get_or_create(
        user_id=user_id
    )

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product_id=product_id,
        defaults={
            "product_name": product_name,
            "price": price,
            "quantity": quantity,
        }
    )

    if not created:
        item.quantity += int(quantity)
        item.save()

    return Response(
        {
            "message": "Product added to cart",
            "cart": CartSerializer(cart).data,
        },
        status=status.HTTP_201_CREATED
    )


@api_view(["PUT"])
def update_cart_item(request, user_id, item_id):

    quantity = request.data.get("quantity")

    if quantity is None:
        return Response(
            {"error": "quantity is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        cart = Cart.objects.get(user_id=user_id)

        item = CartItem.objects.get(
            id=item_id,
            cart=cart
        )

    except (Cart.DoesNotExist, CartItem.DoesNotExist):

        return Response(
            {"error": "Cart item not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if int(quantity) <= 0:
        item.delete()

        return Response(
            {"message": "Item removed from cart"}
        )

    item.quantity = quantity
    item.save()

    return Response(
        CartSerializer(cart).data
    )


@api_view(["DELETE"])
def remove_from_cart(request, user_id, item_id):

    try:
        cart = Cart.objects.get(
            user_id=user_id
        )

        item = CartItem.objects.get(
            id=item_id,
            cart=cart
        )

    except (Cart.DoesNotExist, CartItem.DoesNotExist):

        return Response(
            {"error": "Cart item not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    item.delete()

    return Response(
        {"message": "Product removed from cart"}
    )


@api_view(["DELETE"])
def clear_cart(request, user_id):

    try:
        cart = Cart.objects.get(
            user_id=user_id
        )

    except Cart.DoesNotExist:

        return Response(
            {"error": "Cart not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    cart.items.all().delete()

    return Response(
        {"message": "Cart cleared successfully"}
    )