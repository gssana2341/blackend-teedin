#!/bin/bash

# Firewall Setup for Teedin Backend
# Run this on your Google Cloud server

echo "🔥 Setting up firewall rules..."

# Install UFW if not installed
sudo apt update
sudo apt install -y ufw

# Reset UFW to defaults
sudo ufw --force reset

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (port 22)
sudo ufw allow 22

# Allow HTTP (port 80)
sudo ufw allow 80

# Allow HTTPS (port 443)
sudo ufw allow 443

# Allow your application port (3001)
sudo ufw allow 3001

# Enable UFW
sudo ufw --force enable

# Show status
sudo ufw status verbose

echo "✅ Firewall setup complete!"
echo "🌐 Your server is now accessible on ports 22, 80, 443, and 3001"
