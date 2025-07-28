from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from app.models import User

class AuthTests(APITestCase):
    def test_register_user(self):
        """Test successful user registration"""
        url = reverse('register')
        data = {
            "email": "testuser@example.com",
            "password": "TestPass123!",
            "password2": "TestPass123!",
            "is_customer": True,
            "is_admin": False
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="testuser@example.com").exists())

    def test_register_password_mismatch(self):
        """Test registration failure due to password mismatch"""
        url = reverse('register')
        data = {
            "email": "failuser@example.com",
            "password": "StrongPass123!",
            "password2": "Mismatch123!",
            "is_customer": True
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)  # <-- FIXED LINE
        self.assertIn("Passwords do not match", str(response.data["password"]))

    def test_login_user(self):
        """Test login with correct credentials"""
        user = User.objects.create_user(email="login@example.com", password="StrongPass123!", is_customer=True)
        url = reverse('token_obtain_pair')
        response = self.client.post(url, {"email": "login@example.com", "password": "StrongPass123!"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        url = reverse('token_obtain_pair')
        response = self.client.post(url, {"email": "wrong@example.com", "password": "wrongpass"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_current_user(self):
        """Test fetching current logged-in user info"""
        user = User.objects.create_user(email="me@example.com", password="StrongPass123!", is_customer=True)
        self.client.force_authenticate(user=user)
        url = reverse('current_user')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], "me@example.com")
