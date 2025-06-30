# Laravel 専用 Dockerfile.laravel（backend/ 配下に置く）
FROM php:8.2-fpm-bookworm

ENV TZ=Asia/Tokyo
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl unzip zip gnupg mariadb-client \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
         pdo_mysql mbstring exif pcntl bcmath zip gd opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer \
    | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www

COPY . /var/www

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

COPY docker-entrypoint.sh /var/www/docker-entrypoint.sh
RUN chmod +x /var/www/docker-entrypoint.sh

# EXPOSE 9000

ENTRYPOINT ["/var/www/docker-entrypoint.sh"]
CMD ["php-fpm"]

# CMD ["php", "artisan", "serve", "--host", "0.0.0.0"]
