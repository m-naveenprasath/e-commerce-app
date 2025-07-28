#!/bin/sh

set -e

echo "Waiting for PostgreSQL to start..."
until nc -z postgres 5432; do
  sleep 1
done

if [ "$DJANGO_ROLE" = "backend" ]; then
  echo "PostgreSQL is up. Applying database migrations..."
  python manage.py migrate --noinput

  echo "Creating superuser if not exists..."
  python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
email = "${DJANGO_SUPERUSER_EMAIL}"
password = "${DJANGO_SUPERUSER_PASSWORD}"
if email and password and not User.objects.filter(email=email).exists():
    User.objects.create_superuser(email=email, password=password)
END

  # echo "Collecting static files..."
  # python manage.py collectstatic --noinput

  echo "Starting Gunicorn server..."
  gunicorn service.wsgi:application --bind 0.0.0.0:8000
else
  echo "Skipping DB setup and superuser creation for role: $DJANGO_ROLE"
  exec "$@"
fi
