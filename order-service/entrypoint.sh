#!/bin/sh
set -e

echo "Running databsae migrations....."
python manage.py migrate --noinput

echo "Running static files....."
python manage.py collectstatic --noinput

echo "Running Django Server....."
exec python manage.py runserver 0.0.0.0:8004
