#!/bin/bash

# Teedin Backend Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="teedin-backend"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose file exists
if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
    echo "❌ $DOCKER_COMPOSE_FILE not found!"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f $DOCKER_COMPOSE_FILE down
docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
docker-compose -f $DOCKER_COMPOSE_FILE up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check if services are running
if docker-compose -f $DOCKER_COMPOSE_FILE ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo "🌐 API is available at: http://localhost:3001"
    echo "📊 Health check: http://localhost:3001/health"
    
    # Show running containers
    echo "📋 Running containers:"
    docker-compose -f $DOCKER_COMPOSE_FILE ps
else
    echo "❌ Deployment failed!"
    echo "📋 Container logs:"
    docker-compose -f $DOCKER_COMPOSE_FILE logs
    exit 1
fi
