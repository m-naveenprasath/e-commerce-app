from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CategoryViewSet, ProductViewSet, CartViewSet, OrderViewSet, RegisterView, CurrentUserView, UserViewSet
router = DefaultRouter()
router.register('categories', CategoryViewSet)
router.register('products', ProductViewSet)
router.register('carts', CartViewSet, basename='cart')
router.register('orders', OrderViewSet, basename='order')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('user/me/', CurrentUserView.as_view(), name='current_user'),
]