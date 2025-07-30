from rest_framework import viewsets, permissions, generics
from .models import Category, Product, Cart, CartItem, Order, User, OrderItem, ShippingAddress
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    CartSerializer,
    CartItemSerializer,
    OrderSerializer,
    ShippingAddressSerializer,
    MyTokenObtainPairSerializer,
    RegisterSerializer,
    UserSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework import serializers


class IsAppAdmin(BasePermission):
    """
    Custom permission to allow access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom token view using MyTokenObtainPairSerializer.
    """
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """
    API view to register a new user.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on products.
    Allows filtering by category.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        try:
            serializer.save(created_by=self.request.user)
        except Exception as e:
            raise ValidationError(str(e))


class CartViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user's cart.
    """
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            raise ValidationError(str(e))


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet to manage orders and generate OrderItems from the user's cart.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def perform_create(self, serializer):
        try:
            user = self.request.user
            shipping_address = serializer.validated_data['shipping_address']

            if shipping_address.user != user:
                raise serializers.ValidationError("Invalid shipping address.")

            order = serializer.save(user=user)

            cart = Cart.objects.filter(user=user).first()
            if cart:
                for item in cart.items.all():
                    OrderItem.objects.create(
                        order=order,
                        product=item.product,
                        quantity=item.quantity,
                    )
                cart.items.all().delete()
        except Exception as e:
            raise ValidationError(str(e))


class CurrentUserView(APIView):
    """
    Returns current authenticated user's data.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        except Exception as e:
            raise ValidationError(str(e))


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Admin-only ViewSet to list all users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAppAdmin]


class AddToCartView(generics.CreateAPIView):
    """
    API to add product to user's cart.
    """
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        if not self.request.user.is_customer:
            raise PermissionDenied("Only customers can add items to cart.")

        try:
            cart, _ = Cart.objects.get_or_create(user=self.request.user)
            serializer.save(cart=cart)
        except Exception as e:
            raise ValidationError(str(e))


class CartItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet to manage items in the user's cart.
    """
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.cart.user != self.request.user:
            raise PermissionDenied("You can only update your own cart items.")
        try:
            serializer.save()
        except Exception as e:
            raise ValidationError(str(e))


class ShippingAddressViewSet(viewsets.ModelViewSet):
    """
    ViewSet to manage shipping addresses for the authenticated user.
    """
    serializer_class = ShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ShippingAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            raise ValidationError(str(e))
