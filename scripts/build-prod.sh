#!/bin/bash

# Production build script for CryptoTracker
# This script handles the Docker build with proper error handling

echo "🚀 Starting production build for CryptoTracker..."

# Clear Docker build cache to avoid stale context issues
echo "📦 Clearing Docker build cache..."
docker system prune -f

# Build and start the production environment
echo "🔨 Building and starting production containers..."
docker-compose -f docker-compose.prod.yml up --build -d

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "✅ Production build completed successfully!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:4000"
    echo "🗄️  Database Admin: http://localhost:8080"
    echo ""
    echo "📊 Container status:"
    docker-compose -f docker-compose.prod.yml ps
else
    echo "❌ Build failed. Check the error messages above."
    exit 1
fi
