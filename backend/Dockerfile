# backend/Dockerfile  ─── Laravel 用コンテナ ─────────────────────
FROM php:8.2-fpm-bookworm

# ───────────────────────────────────────────────────────────────
# 1) OS パッケージ & PHP 拡張
# ───────────────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
        git curl unzip zip mariadb-client \
        libpng-dev libjpeg-dev libfreetype6-dev \
        libonig-dev libxml2-dev libzip-dev \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install -j"$(nproc)" pdo_mysql mbstring zip gd \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# ───────────────────────────────────────────────────────────────
# 2) Composer
# ───────────────────────────────────────────────────────────────
RUN curl -sS https://getcomposer.org/installer \
 | php -- --install-dir=/usr/local/bin --filename=composer

# ───────────────────────────────────────────────────────────────
# 3) アプリ作業ディレクトリ
# ───────────────────────────────────────────────────────────────
WORKDIR /var/www

# 3-A) 依存ファイル + artisan だけ先にコピー
COPY composer.json composer.lock artisan ./

# 3-B) vendor を生成（post スクリプトは無視）
RUN composer install \
        --no-dev --optimize-autoloader --no-interaction --no-progress --no-scripts

# 3-C) 残りのアプリをコピー
COPY . .

# 3-D) ここで post-autoload スクリプト実行（package:discover など）
RUN composer run-script post-autoload-dump --no-interaction

# ───────────────────────────────────────────────────────────────
# 4) エントリポイント
# ───────────────────────────────────────────────────────────────
COPY docker-entrypoint.sh /usr/local/bin/laravel-entrypoint
RUN chmod +x /usr/local/bin/laravel-entrypoint

EXPOSE 9000
ENTRYPOINT ["laravel-entrypoint"]
CMD ["php-fpm"]
