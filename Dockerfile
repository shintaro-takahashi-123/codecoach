FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# 必須パッケージ
RUN apt-get update && apt-get install -y \
    software-properties-common \
    curl \
    git \
    unzip \
    zip \
    gnupg \
    ca-certificates \
    mariadb-client \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libssl-dev \
    && add-apt-repository ppa:ondrej/php -y \
    && apt-get update && apt-get install -y \
    php8.2 php8.2-cli php8.2-fpm php8.2-mbstring php8.2-xml php8.2-curl php8.2-bcmath php8.2-zip \
    php8.2-gd php8.2-mysql php8.2-tokenizer php8.2-dom php8.2-pcntl php8.2-readline php8.2-opcache \
    && apt-get clean

# Node.js v18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# ---------- フロントエンド ----------
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

EXPOSE 3000

# ---------- バックエンド ----------
WORKDIR /var/www

COPY backend/ ./

RUN composer install --no-dev --optimize-autoloader || true

# Laravel 初期化処理
RUN cp .env.example .env && \
    php artisan key:generate && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm8.2"]


COPY backend/docker-entrypoint.sh /var/www/docker-entrypoint.sh
RUN chmod +x /var/www/docker-entrypoint.sh
