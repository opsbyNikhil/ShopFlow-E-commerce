from rest_framework import serializers

from .models import Order, OrderItem, DeliveryAddress

class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_id",
            "product_name",
            "product_image",
            "price",
            "quantity",
        ]


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user_id",
            "total_amount",
            "status",
            "items",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):

        items_data = validated_data.pop("items")

        order = Order.objects.create(
            **validated_data
        )

        for item_data in items_data:
            OrderItem.objects.create(
                order=order,
                **item_data
            )

        return order

class DeliveryAddressSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = DeliveryAddress
        fields = [
            "id",
            "user_id",
            "full_name",
            "mobile_number",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "pincode",
            "landmark",
            "is_default",
            "created_at",
            "updated_at",
        ]


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_id",
            "product_name",
            "product_image",
            "price",
            "quantity",
        ]


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True)

    delivery_address = DeliveryAddressSerializer(
        read_only=True
    )

    delivery_address_id = serializers.PrimaryKeyRelatedField(
        source="delivery_address",
        queryset=DeliveryAddress.objects.all(),
        write_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "user_id",
            "delivery_address",
            "delivery_address_id",
            "total_amount",
            "status",
            "items",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):

        items_data = validated_data.pop("items")

        order = Order.objects.create(
            **validated_data
        )

        for item_data in items_data:
            OrderItem.objects.create(
                order=order,
                **item_data
            )

        return order
