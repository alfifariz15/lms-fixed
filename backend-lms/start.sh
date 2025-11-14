#!/bin/bash

# Generate application key if not exists
php artisan key:generate --force

# Run migrations
php artisan migrate:fresh --seed --force

# Start the server
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
