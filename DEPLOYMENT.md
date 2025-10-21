# 🚀 Teedin Backend Deployment Guide

## Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 10GB minimum
- **Network**: Public IP with ports 80, 443, 22 open

### Software Requirements
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Node.js**: 18+ (for development)
- **Git**: Latest version

## 🐳 Docker Deployment (Recommended)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/teedin-backend.git
cd teedin-backend
```

### 2. Environment Setup
```bash
# Copy environment template
cp env.production.example .env.production

# Edit environment variables
nano .env.production
```

### 3. Deploy with Docker
```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. Update Deployment
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## 🔄 CI/CD with GitHub Actions

### 1. Repository Secrets
Add these secrets in GitHub repository settings:

```
SERVER_HOST=your-server-ip
SERVER_USER=your-username
SERVER_SSH_KEY=your-private-ssh-key
```

### 2. Automatic Deployment
- Push to `main` branch triggers automatic deployment
- Pull requests run tests only
- Deployment includes:
  - Code testing
  - Type checking
  - Building
  - Deploying to server

## 🛠️ Manual Deployment

### Windows (PowerShell)
```powershell
# Run deployment script
npm run deploy

# Or manually
.\scripts\deploy.ps1 production
```

### Linux/macOS (Bash)
```bash
# Make script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh production
```

## 🔧 Production Configuration

### Environment Variables
```env
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Nginx Configuration
- Reverse proxy setup included
- Rate limiting configured
- Security headers added
- Gzip compression enabled

### SSL Setup (Optional)
```bash
# Place SSL certificates in ./ssl/ directory
# Update nginx.conf for HTTPS
```

## 📊 Monitoring & Health Checks

### Health Endpoints
- **Health Check**: `GET /health`
- **API Status**: `GET /`
- **Container Health**: Docker health checks enabled

### Logs
```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs -f teedin-backend

# Nginx logs
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Performance Monitoring
- PM2 process manager (if not using Docker)
- Nginx access logs
- Application metrics

## 🔒 Security Considerations

### Firewall Rules
```bash
# Allow only necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### SSL/TLS
- Use Let's Encrypt for free SSL certificates
- Configure HTTPS redirects
- Enable HSTS headers

### Environment Security
- Never commit `.env` files
- Use strong passwords and API keys
- Rotate secrets regularly
- Enable 2FA on server access

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001
# Kill process
kill -9 <PID>
```

#### Docker Issues
```bash
# Clean up Docker
docker system prune -a
docker volume prune
```

#### Database Connection
```bash
# Check environment variables
docker-compose -f docker-compose.prod.yml exec teedin-backend env | grep SUPABASE
```

### Log Analysis
```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs

# Filter by service
docker-compose -f docker-compose.prod.yml logs teedin-backend
```

## 📈 Scaling

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Multiple container instances
- Database connection pooling

### Vertical Scaling
- Increase server resources
- Optimize Docker container limits
- Monitor memory and CPU usage

## 🔄 Backup Strategy

### Database Backup
```bash
# Supabase automatic backups
# Or manual database dumps
```

### Application Backup
```bash
# Backup source code
git clone --mirror repository-url

# Backup environment files
cp .env.production backup/
```

## 📞 Support

For deployment issues:
1. Check logs first
2. Verify environment variables
3. Test health endpoints
4. Contact development team

---

**Happy Deploying! 🚀**
