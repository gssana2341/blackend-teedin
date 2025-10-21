#!/bin/bash

# Server Prerequisites Installation Script
# Run this on Google Cloud server with sudo access

echo "🚀 Installing prerequisites for Teedin Backend..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Git
echo "📦 Installing Git..."
sudo apt install -y git

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
echo "👤 Adding user to docker group..."
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
echo ""
echo "✅ Verifying installations..."
echo "Git version: $(git --version)"
echo "Docker version: $(docker --version)"
echo "Docker Compose version: $(docker-compose --version)"

echo ""
echo "🎉 Prerequisites installed successfully!"
echo ""
echo "⚠️  IMPORTANT: Please log out and log back in for docker group changes to take effect!"
echo "   Or run: newgrp docker"
echo ""
echo "📝 Next steps:"
echo "1. Log out and log back in"
echo "2. Verify docker works without sudo: docker ps"
echo "3. Push code to trigger GitHub Actions deployment"
