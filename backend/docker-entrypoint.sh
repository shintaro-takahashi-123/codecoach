#!/bin/sh

cd /var/www

# Laravelの環境セットアップ
if [ ! -f ".env" ]; then
    cp .env.example .env
    php artisan key:generate
fi

php artisan migrate --force || true

php-fpm8.2
