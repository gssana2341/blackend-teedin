# 🐳 Docker Deployment Guide

## ไฟล์ Docker ที่ใช้

### 1. **Dockerfile**
- Build Node.js application
- Multi-stage build สำหรับ optimization
- Security: non-root user
- Health checks

### 2. **docker-compose.prod.yml**
- **teedin-backend**: API service
- **nginx**: Reverse proxy + load balancer
- **Network**: Isolated network
- **Volumes**: Log persistence

### 3. **nginx.conf**
- Reverse proxy configuration
- Rate limiting
- Security headers
- Gzip compression

## 🚀 การ Deploy

### **Setup Server (ครั้งแรก):**
```bash
# 1. อัปโหลดและรัน setup script
scp -i ~/.ssh/server_key scripts/server-setup.sh teedineasy_team@34.158.61.147:~/setup.sh
ssh -i ~/.ssh/server_key teedineasy_team@34.158.61.147 "chmod +x ~/setup.sh && ~/setup.sh"

# 2. แก้ไข environment variables
ssh -i ~/.ssh/server_key teedineasy_team@34.158.61.147 "nano ~/teedin-backend/.env.production"
```

### **Manual Deployment:**
```bash
# เชื่อมต่อ server
ssh -i ~/.ssh/server_key teedineasy_team@34.158.61.147

# Navigate to project
cd ~/teedin-backend

# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 การ Monitor

### **ตรวจสอบ Status:**
```bash
# ดู containers ที่รันอยู่
docker-compose -f docker-compose.prod.yml ps

# ดู logs แบบ real-time
docker-compose -f docker-compose.prod.yml logs -f

# ดู logs ของ service เดียว
docker-compose -f docker-compose.prod.yml logs -f teedin-backend
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### **จัดการ Services:**
```bash
# Restart service
docker-compose -f docker-compose.prod.yml restart teedin-backend

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Rebuild specific service
docker-compose -f docker-compose.prod.yml build teedin-backend
```

## 🔧 การแก้ไขปัญหา

### **Container ไม่ Start:**
```bash
# ดู logs
docker-compose -f docker-compose.prod.yml logs teedin-backend

# ตรวจสอบ environment variables
docker-compose -f docker-compose.prod.yml config

# Test build
docker-compose -f docker-compose.prod.yml build --no-cache teedin-backend
```

### **Port Conflicts:**
```bash
# ตรวจสอบ port ที่ใช้
sudo netstat -tulpn | grep :3001
sudo netstat -tulpn | grep :80

# Kill process ที่ใช้ port
sudo kill -9 <PID>
```

### **Memory Issues:**
```bash
# ดู memory usage
docker stats

# Clean up unused containers
docker system prune -a
docker volume prune
```

## 🌐 URLs

- **API**: `http://34.158.61.147:3001`
- **Health Check**: `http://34.158.61.147:3001/health`
- **Through Nginx**: `http://34.158.61.147` (port 80)

## 🔒 Security Features

### **Docker Security:**
- Non-root user ใน container
- Health checks
- Resource limits
- Network isolation

### **Nginx Security:**
- Rate limiting
- Security headers
- CORS configuration
- Request size limits

## 📈 Scaling

### **Horizontal Scaling:**
```bash
# Scale backend service
docker-compose -f docker-compose.prod.yml up -d --scale teedin-backend=3

# Update nginx.conf สำหรับ load balancing
```

### **Resource Monitoring:**
```bash
# ดู resource usage
docker stats

# ดู disk usage
docker system df
```

## 🔄 CI/CD Integration

GitHub Actions จะทำ:
1. **Test** → Run tests
2. **Build** → Compile TypeScript
3. **Deploy** → SSH เข้า server
4. **Docker** → Build และ start containers
5. **Health Check** → ตรวจสอบ services

**ทุกครั้งที่ push ไป `main` branch = auto deploy! 🚀**
