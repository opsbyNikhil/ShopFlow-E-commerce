#!/bin/sh
set -e

echo "Waiting for database..."
until python manage.py shell -c "from django.db import connection; connection.ensure_connection()" 2>/dev/null; do
  echo "Database unavailable, waiting 2s..."
  sleep 2
done
echo "Database is up."

echo "Running database migrations....."
python manage.py migrate --noinput

echo "Running static files....."
python manage.py collectstatic --noinput

echo "Running Django Server....."
exec python manage.py runserver 0.0.0.0:8000