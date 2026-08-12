from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Product, Category
from .serializers import (
    ProductSerializer,
    CategorySerializer,
)


class ProductListView(APIView):

    def get(self, request):

        products = Product.objects.filter(
            is_active=True
        ).select_related("category")

        serializer = ProductSerializer(
            products,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class ProductDetailView(APIView):

    def get(self, request, pk):

        try:

            product = Product.objects.select_related(
                "category"
            ).get(
                pk=pk,
                is_active=True
            )

        except Product.DoesNotExist:

            return Response(
                {
                    "message": "Product not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProductSerializer(product)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class CategoryListView(APIView):

    def get(self, request):

        categories = Category.objects.filter(
            is_active=True
        )

        serializer = CategorySerializer(
            categories,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )