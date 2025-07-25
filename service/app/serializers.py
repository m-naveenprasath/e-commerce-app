from rest_framework import serializers
from .models import User, Category, Product, Cart, CartItem, Order, OrderItem, ShippingAddress
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token

    def validate(self, attrs):
        # Accept email instead of username
        attrs['username'] = attrs.get('email')
        return super().validate(attrs)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'is_admin', 'is_customer']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'password2', 'is_customer', 'is_admin')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            is_customer=validated_data.get('is_customer', True),
            is_admin=validated_data.get('is_admin', False),
        )
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['created_by']  

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'quantity']
        read_only_fields = ['cart']
    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value


    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user

        # Get or create a Cart for the user
        cart, _ = Cart.objects.get_or_create(user=user)
        product = validated_data['product']
        quantity = validated_data.get('quantity', 1)

        # Update if product already in cart
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        else:
            cart_item.quantity = quantity
            cart_item.save()

        return cart_item

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = [
            'id', 'full_name', 'phone_number', 'address_line1', 'address_line2',
            'city', 'state', 'postal_code', 'country', 'is_default'
        ]

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    shipping_address = ShippingAddressSerializer(read_only=True)

    # Accept this field in POST requests
    shipping_address_id = serializers.PrimaryKeyRelatedField(
        queryset=ShippingAddress.objects.all(),
        write_only=True,
        source='shipping_address'  # this links it to model field
    )

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'created_at', 'status',
            'shipping_address', 'shipping_address_id', 'items'
        ]
