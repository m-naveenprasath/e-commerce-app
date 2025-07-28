from rest_framework.test import APITestCase
from app.models import ShippingAddress
from django.contrib.auth import get_user_model

User = get_user_model()

class ShippingAddressTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="ship@example.com", password="12345")
        self.client.force_authenticate(user=self.user)

    def test_create_shipping_address(self):
        data = {
            "full_name": "John Doe",
            "phone_number": "9876543210",
            "address_line1": "123 Main Street",
            "address_line2": "Apt 101",
            "city": "Chennai",
            "state": "TN",
            "postal_code": "600001",
            "country": "India",
            "is_default": True
        }
        response = self.client.post('/api/addresses/', data)
        print("RESPONSE STATUS:", response.status_code)
        print("RESPONSE DATA:", response.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ShippingAddress.objects.count(), 1)
        address = ShippingAddress.objects.first()
        self.assertEqual(address.full_name, "John Doe")
        self.assertEqual(address.city, "Chennai")
