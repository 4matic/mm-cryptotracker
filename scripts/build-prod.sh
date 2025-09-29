#!/bin/bash

# Production build script for CryptoTracker
# This script handles the Docker build with proper error handling

echo "🚀 Starting production build for CryptoTracker..."
echo ""
echo "⚠️  IMPORTANT WARNING:"
echo "   This script includes a Docker system purge command (docker system prune -f)"
echo "   that removes unused Docker images, containers, and build cache."
echo "   This will free up disk space but may require rebuilding other Docker"
echo "   images on your system."
echo ""
read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Build cancelled by user."
    exit 0
fi

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
