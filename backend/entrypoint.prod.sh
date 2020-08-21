#!/bin/sh

# if [ "$DATABASE" = "postgres" ]
# then
#     echo "Waiting for postgres..."

#     while ! nc -z $SQL_HOST $SQL_PORT; do
#       sleep 0.1
#     done

#     echo "PostgreSQL started"
# fi

# exec "$@"

# Collect static files
echo "[+] Collect static files"
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput

echo "Running command '$*'"
# exec /bin/sh -c "$*"
exec "$@"
