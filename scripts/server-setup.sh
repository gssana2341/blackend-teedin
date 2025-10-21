#!/bin/bash

# Teedin Backend Server Setup Script
# Run this on your Google Cloud server

set -e

echo "🚀 Setting up Teedin Backend on Google Cloud Server..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git if not installed
echo "📦 Installing Git..."
sudo apt install -y git

# Create project directory
echo "📁 Creating project directory..."
mkdir -p ~/teedin-backend
cd ~/teedin-backend

# Clone repository if not exists
if [ ! -d ".git" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/gssana2341/blackend-teedin.git .
fi

# Create environment file
echo "⚙️ Creating environment file..."
if [ ! -f ".env.production" ]; then
    cp env.production.example .env.production
    echo "📝 Please edit .env.production with your actual values"
fi

# Build and start with Docker
echo "🐳 Building and starting with Docker..."
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Server setup complete!"
echo "🌐 Your API should be running on port 3001"
echo "📊 Check status with: docker-compose -f docker-compose.prod.yml ps"
echo "📋 View logs with: docker-compose -f docker-compose.prod.yml logs -f"
echo "🔄 Restart with: docker-compose -f docker-compose.prod.yml restart"
