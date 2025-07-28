from rest_framework.test import APITestCase
from app.models import User, Category, Product, ShippingAddress, CartItem, Cart
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

class OrderTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="buyer@example.com", password="buyer123", is_customer=True)
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        self.category = Category.objects.create(name="Shoes")
        self.product = Product.objects.create(
            name="Sneakers", description="Running shoes", price="3000", category=self.category, created_by=self.user
        )
        self.cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=self.cart, product=self.product, quantity=1)

        self.shipping = ShippingAddress.objects.create(
            user=self.user,
            full_name="John Doe",
            phone_number="9999999999",
            address_line1="Street 1",
            address_line2="",
            city="City",
            state="State",
            postal_code="123456",
            country="Country"
        )

    def test_place_order(self):
        url = reverse('order-list')  # from router -> 'orders'
        data = {"shipping_address_id": self.shipping.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
