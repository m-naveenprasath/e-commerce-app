#!/bin/sh

set -e

echo "Apply database migrations"
python manage.py makemigrations
python manage.py migrate

echo "Create superuser if not exists"
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email="${DJANGO_SUPERUSER_EMAIL}").exists():
    User.objects.create_superuser(email="${DJANGO_SUPERUSER_EMAIL}", password="${DJANGO_SUPERUSER_PASSWORD}")
END

echo "Start server"
gunicorn service.wsgi:application --bind 0.0.0.0:8000
