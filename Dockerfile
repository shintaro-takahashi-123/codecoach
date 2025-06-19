FROM ubuntu:22.04

# 環境変数と非対話モード設定
ENV DEBIAN_FRONTEND=noninteractive

# 必須パッケージをインストール（Node.js、PHP、MariaDBクライアントなど）
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    git \
    unzip \
    zip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libssl-dev \
    mariadb-client \
    ca-certificates \
    php \
    php-cli \
    php-fpm \
    php-mbstring \
    php-xml \
    php-curl \
    php-bcmath \
    php-zip \
    php-gd \
    php-mysql \
    php-tokenizer \
    php-dom \
    php-pcntl \
    php-opcache \
    php-readline \
    software-properties-common \
    && apt-get clean

# Node.js v18 をインストール
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Composer インストール
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# ---------- フロントエンド ----------

WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/. ./

EXPOSE 3000

# ---------- バックエンド ----------

WORKDIR /var/www

COPY backend/. ./

RUN composer install --no-dev --optimize-autoloader || true

RUN php artisan config:cache && php artisan route:cache && php artisan view:cache || true

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000

# ---------- 起動コマンド ----------
# supervisordなどで同時起動を制御するか、複数コンテナ推奨（下記は参考用）
CMD ["php-fpm"]
