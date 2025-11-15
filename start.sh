#!/bin/bash

echo "🚀 Starting LMS Backend..."

# Navigate to backend directory
cd backend-lms

# Install dependencies if not installed
if [ ! -d "vendor" ]; then
    echo "📦 Installing dependencies..."
    # Remove old lock file to avoid compatibility issues
    rm -f composer.lock
    composer install --no-dev --optimize-autoloader --no-interaction
fi

# Create necessary directories
mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache

# Set permissions
chmod -R 775 storage bootstrap/cache

# Generate app key
php artisan key:generate --force

# Run migrations
php artisan migrate:fresh --seed --force

# Start the application
echo "🎉 Starting Laravel server..."
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
