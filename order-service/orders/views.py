from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, DeliveryAddress, OrderItem 
from .serializers import OrderSerializer, DeliveryAddressSerializer
from django.shortcuts import get_object_or_404
from decimal import Decimal


class OrderCreateView(APIView):

    def post(self, request):

        user_id = request.data.get("user_id")
        delivery_address_id = request.data.get("delivery_address_id")

        if not user_id:
            return Response(
                {
                    "success": False,
                    "message": "user_id is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not delivery_address_id:
            return Response(
                {
                    "success": False,
                    "message": "Please select a delivery address"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Make sure the selected address belongs to the user
        address = get_object_or_404(
            DeliveryAddress,
            id=delivery_address_id,
            user_id=user_id
        )

        # Copy request data so we can modify it safely
        data = request.data.copy()

        # Make sure the selected address is used
        data["delivery_address_id"] = address.id

        serializer = OrderSerializer(data=data)

        if serializer.is_valid():

            order = serializer.save(
                user_id=user_id
            )

            return Response(
                {
                    "success": True,
                    "message": "Order created successfully",
                    "order": OrderSerializer(order).data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class OrderListView(APIView):

    def get(self, request):

        user_id = request.query_params.get("user_id")

        if user_id:
            orders = Order.objects.filter(
                user_id=user_id
            )
        else:
            orders = Order.objects.all()

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(serializer.data)




class OrderDetailView(APIView):

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def delete(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        order.delete()
        return Response(
            {"message": "Order deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )

    def patch(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        serializer = OrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeliveryAddressView(APIView):

    def get(self, request):
        user_id = request.query_params.get("user_id")

        if not user_id:
            return Response(
                {
                    "success": False,
                    "message": "user_id is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            addresses = DeliveryAddress.objects.filter(
                user_id=user_id
            ).order_by("-is_default", "-created_at")

            serializer = DeliveryAddressSerializer(
                addresses,
                many=True
            )

            return Response(
                {
                    "success": True,
                    "addresses": serializer.data
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("Delivery Address Error:", str(e))

            return Response(
                {
                    "success": False,
                    "message": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        user_id = request.data.get("user_id")

        if not user_id:
            return Response(
                {"success": False, "message": "user_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        full_name = request.data.get("full_name")
        mobile_number = request.data.get("mobile_number")
        address_line1 = request.data.get("address_line1")
        address_line2 = request.data.get("address_line2")
        city = request.data.get("city")
        state = request.data.get("state")
        pincode = request.data.get("pincode")
        landmark = request.data.get("landmark")
        is_default = request.data.get("is_default", False)

        if not all([
            full_name,
            mobile_number,
            address_line1,
            city,
            state,
            pincode
        ]):
            return Response(
                {
                    "success": False,
                    "message": "Required address fields are missing"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # If this address is default,
        # remove default from existing addresses
        if is_default:
            DeliveryAddress.objects.filter(
                user_id=user_id
            ).update(is_default=False)

        address = DeliveryAddress.objects.create(
            user_id=user_id,
            full_name=full_name,
            mobile_number=mobile_number,
            address_line1=address_line1,
            address_line2=address_line2,
            city=city,
            state=state,
            pincode=pincode,
            landmark=landmark,
            is_default=is_default
        )

        return Response(
            {
                "success": True,
                "message": "Delivery address added successfully",
                "address": {
                    "id": address.id,
                    "full_name": address.full_name,
                    "mobile_number": address.mobile_number,
                    "address_line1": address.address_line1,
                    "address_line2": address.address_line2,
                    "city": address.city,
                    "state": address.state,
                    "pincode": address.pincode,
                    "landmark": address.landmark,
                    "is_default": address.is_default,
                }
            },
            status=status.HTTP_201_CREATED
        )

class CreateOrderView(APIView):

    def post(self, request):

        user_id = request.data.get("user_id")
        delivery_address_id = request.data.get("delivery_address_id")
        items = request.data.get("items")

        if not user_id:
            return Response(
                {
                    "success": False,
                    "message": "user_id is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not delivery_address_id:
            return Response(
                {
                    "success": False,
                    "message": "Please select a delivery address"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not items:
            return Response(
                {
                    "success": False,
                    "message": "Order items are required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Make sure the address belongs to the user
        address = get_object_or_404(
            DeliveryAddress,
            id=delivery_address_id,
            user_id=user_id
        )

        total_amount = Decimal("0.00")

        order_items = []

        for item in items:

            product_id = item.get("product_id")
            product_name = item.get("product_name")
            product_image = item.get("product_image")
            price = Decimal(str(item.get("price", 0)))
            quantity = int(item.get("quantity", 0))

            if quantity <= 0:
                return Response(
                    {
                        "success": False,
                        "message": "Quantity must be greater than 0"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            item_total = price * quantity

            total_amount += item_total

            order_items.append({
                "product_id": product_id,
                "product_name": product_name,
                "product_image": product_image,
                "price": price,
                "quantity": quantity
            })

        # Create order
        order = Order.objects.create(
            user_id=user_id,
            delivery_address=address,
            total_amount=total_amount,
            status="PENDING"
        )

        # Create order items
        for item in order_items:

            OrderItem.objects.create(
                order=order,
                product_id=item["product_id"],
                product_name=item["product_name"],
                product_image=item["product_image"],
                price=item["price"],
                quantity=item["quantity"]
            )

        return Response(
            {
                "success": True,
                "message": "Order created successfully",
                "order": {
                    "id": order.id,
                    "user_id": order.user_id,
                    "total_amount": str(order.total_amount),
                    "status": order.status,
                    "delivery_address": {
                        "id": address.id,
                        "full_name": address.full_name,
                        "mobile_number": address.mobile_number,
                        "address_line1": address.address_line1,
                        "address_line2": address.address_line2,
                        "city": address.city,
                        "state": address.state,
                        "pincode": address.pincode,
                        "landmark": address.landmark,
                    },
                    "items": [
                        {
                            "product_id": item["product_id"],
                            "product_name": item["product_name"],
                            "product_image": item["product_image"],
                            "price": str(item["price"]),
                            "quantity": item["quantity"]
                        }
                        for item in order_items
                    ]
                }
            },
            status=status.HTTP_201_CREATED
        )

    