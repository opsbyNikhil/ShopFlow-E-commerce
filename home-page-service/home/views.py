from django.db.models import Q

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Category, Product


def product_data(product):
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": float(product.price),
        "stock": product.stock,
        "image": product.image,
        "rating": float(product.rating),
        "category": product.category.name,
        "category_id": product.category.id,
    }


@api_view(["GET"])
def home(request):

    categories = Category.objects.filter(
        is_active=True
    )

    featured_products = Product.objects.filter(
        is_active=True,
        is_featured=True
    ).select_related("category")[:8]

    latest_products = Product.objects.filter(
        is_active=True
    ).select_related("category")[:12]

    category_data = [
        {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "image": category.image,
        }
        for category in categories
    ]

    featured_data = [
        product_data(product)
        for product in featured_products
    ]

    latest_data = [
        product_data(product)
        for product in latest_products
    ]

    return Response({
        "message": "Home page data",
        "categories": category_data,
        "featured_products": featured_data,
        "latest_products": latest_data,
    })


@api_view(["GET"])
def categories(request):

    categories = Category.objects.filter(
        is_active=True
    )

    data = [
        {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "image": category.image,
        }
        for category in categories
    ]

    return Response(data)


@api_view(["GET"])
def products(request):

    products = Product.objects.filter(
        is_active=True
    ).select_related("category")

    category_id = request.GET.get("category")
    search = request.GET.get("search")

    if category_id:
        products = products.filter(
            category_id=category_id
        )

    if search:
        products = products.filter(
            Q(name__icontains=search)
            | Q(description__icontains=search)
        )

    data = [
        product_data(product)
        for product in products
    ]

    return Response(data)


@api_view(["GET"])
def product_detail(request, product_id):

    try:
        product = Product.objects.select_related(
            "category"
        ).get(
            id=product_id,
            is_active=True
        )

    except Product.DoesNotExist:

        return Response(
            {
                "message": "Product not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(
        product_data(product)
    )