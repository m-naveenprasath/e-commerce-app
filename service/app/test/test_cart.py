from rest_framework.test import APITestCase
from app.models import User, Category, Product, CartItem
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

class CartTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="user@example.com", password="user123", is_customer=True)
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        category = Category.objects.create(name="Books")
        self.product = Product.objects.create(
            name="Django Book", description="Learn Django", price="500.00", category=category, created_by=self.user
        )

    def test_add_to_cart(self):
        url = reverse('add-to-cart')
        data = {"product": self.product.id, "quantity": 2}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(CartItem.objects.first().quantity, 2)
