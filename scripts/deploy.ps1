# Teedin Backend Deployment Script for Windows
# Usage: .\scripts\deploy.ps1 [environment]

param(
    [string]$Environment = "production"
)

$ErrorActionPreference = "Stop"
$ProjectName = "teedin-backend"
$DockerComposeFile = "docker-compose.prod.yml"

Write-Host "🚀 Starting deployment for $Environment environment..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker first." -ForegroundColor Red
    exit 1
}

# Check if docker-compose file exists
if (-not (Test-Path $DockerComposeFile)) {
    Write-Host "❌ $DockerComposeFile not found!" -ForegroundColor Red
    exit 1
}

# Pull latest changes
Write-Host "📥 Pulling latest changes..." -ForegroundColor Yellow
git pull origin main

# Build and start services
Write-Host "🔨 Building and starting services..." -ForegroundColor Yellow
docker-compose -f $DockerComposeFile down
docker-compose -f $DockerComposeFile build --no-cache
docker-compose -f $DockerComposeFile up -d

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check if services are running
$RunningContainers = docker-compose -f $DockerComposeFile ps --services --filter "status=running"

if ($RunningContainers) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 API is available at: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "📊 Health check: http://localhost:3001/health" -ForegroundColor Cyan
    
    # Show running containers
    Write-Host "📋 Running containers:" -ForegroundColor Yellow
    docker-compose -f $DockerComposeFile ps
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "📋 Container logs:" -ForegroundColor Yellow
    docker-compose -f $DockerComposeFile logs
    exit 1
}
