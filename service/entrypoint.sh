#!/bin/sh

set -e  # Exit immediately if a command exits with a non-zero status

echo "Applying database migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "Creating superuser if it doesn't exist..."
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
email = "${DJANGO_SUPERUSER_EMAIL}"
password = "${DJANGO_SUPERUSER_PASSWORD}"
if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(email=email, password=password)
END

# echo "Collecting static files..."
# python manage.py collectstatic --noinput

echo "Starting Gunicorn server..."
gunicorn service.wsgi:application --bind 0.0.0.0:8000
