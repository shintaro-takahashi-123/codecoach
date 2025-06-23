#!/bin/sh

set -e  # エラー時に即終了（デバッグ目的で必要ならコメントアウト）

cd /var/www

echo "[ENTRYPOINT] Starting Laravel setup..."

# 環境ファイルがなければコピー
if [ ! -f ".env" ]; then
    echo "[ENTRYPOINT] .env ファイルが存在しません。作成します..."
    cp .env.example .env
    php artisan key:generate
else
    echo "[ENTRYPOINT] .env ファイルは既に存在します。"
fi

# キャッシュクリアと構築（オプション）
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# マイグレーション実行
echo "[ENTRYPOINT] データベースマイグレーションを実行します..."
if php artisan migrate --force; then
    echo "[ENTRYPOINT] マイグレーション成功。"
else
    echo "[ENTRYPOINT] マイグレーションに失敗しましたが、処理は継続します。" >&2
fi

# 権限確認（実運用時のみ）
chown -R www-data:www-data storage bootstrap/cache

# PHP-FPM 起動
echo "[ENTRYPOINT] php-fpm8.2 起動"
exec php-fpm8.2
