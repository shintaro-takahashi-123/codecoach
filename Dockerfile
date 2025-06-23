# =============================================================
#  ベース：Debian bookworm slim に PHP-FPM 8.2 が入った公式イメージ
# =============================================================
FROM php:8.2-fpm-bookworm

# タイムゾーンと非対話モード
ENV TZ=Asia/Tokyo
ENV DEBIAN_FRONTEND=noninteractive

# -------------------------------------------------------------
#   1) OS 依存ライブラリ＋PHP 拡張をビルド
# -------------------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl unzip zip gnupg mariadb-client \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev libzip-dev \
    # ── PHP 拡張をコンパイル ───────────────────────────
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
         pdo_mysql mbstring exif pcntl bcmath zip gd opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# -------------------------------------------------------------
#   2) Composer
# -------------------------------------------------------------
RUN curl -sS https://getcomposer.org/installer \
    | php -- --install-dir=/usr/local/bin --filename=composer

# -------------------------------------------------------------
#   3) Node.js 20  （Laravel Mix／vite 等を同じコンテナで動かす想定）
# -------------------------------------------------------------
# --- Node.js 20 LTS -------------------------------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g npm@latest      
# ← 20 なら問題なく 11.x が入る


# =============================================================
#  フロントエンド
# =============================================================
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci          # lockfile を尊重してインストール

COPY frontend/ ./
# 必要であればここで `npm run build` する
# RUN npm run build

EXPOSE 3000

# =============================================================
#  バックエンド（Laravel）
# =============================================================
WORKDIR /var/www

COPY backend/ ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Laravel 用エントリポイント
COPY backend/docker-entrypoint.sh /var/www/docker-entrypoint.sh
RUN chmod +x /var/www/docker-entrypoint.sh

# php-fpm は公式イメージのデフォルト Port 9000
EXPOSE 9000

ENTRYPOINT ["/var/www/docker-entrypoint.sh"]
CMD ["php-fpm"]
