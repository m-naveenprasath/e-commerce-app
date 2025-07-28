from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from app.models import User, Category
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

class ProductTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="admin@example.com", password="admin123", is_admin=True)
        self.category = Category.objects.create(name="Electronics")
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def generate_test_image(self):
        img = Image.new('RGB', (100, 100), color=(255, 0, 0))  # red square
        img_bytes = BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        return SimpleUploadedFile("test.jpg", img_bytes.read(), content_type="image/jpeg")

    def test_create_product(self):
        url = reverse('product-list')
        image = self.generate_test_image()

        data = {
            "name": "Laptop",
            "description": "A gaming laptop",
            "price": "12000.00",
            "category": self.category.id,
            "image": image,
        }

        response = self.client.post(url, data, format='multipart')
        print("RESPONSE DATA:", response.data)
        self.assertEqual(response.status_code, 201)
