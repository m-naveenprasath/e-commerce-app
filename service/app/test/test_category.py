from rest_framework.test import APITestCase
from app.models import Category
from django.contrib.auth import get_user_model

User = get_user_model()

class CategoryTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(email="admin@example.com", password="admin123", is_admin=True)
        self.client.force_authenticate(user=self.admin)

    def test_create_category(self):
        response = self.client.post('/api/categories/', {"name": "Books"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Category.objects.count(), 1)

    def test_list_categories(self):
        Category.objects.create(name="Clothes")
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
