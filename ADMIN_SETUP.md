# 🔧 Admin Setup Instructions for Google Cloud Server

## ปัญหา
User `teedineasy_team` ไม่มีสิทธิ์ `sudo` ทำให้ไม่สามารถติดตั้ง Git, Docker และ Docker Compose ได้

## วิธีแก้ไข

### Option 1: ให้ Admin ติดตั้ง Prerequisites

**Admin ต้องรันคำสั่งเหล่านี้:**

```bash
# 1. SSH เข้า server ด้วย user ที่มีสิทธิ์ sudo
ssh your-admin-user@34.158.61.147

# 2. Update system
sudo apt update && sudo apt upgrade -y

# 3. ติดตั้ง Git
sudo apt install -y git

# 4. ติดตั้ง Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 5. เพิ่ม teedineasy_team เข้า docker group
sudo usermod -aG docker teedineasy_team

# 6. ติดตั้ง Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 7. ตรวจสอบการติดตั้ง
git --version
docker --version
docker-compose --version

# 8. Test กับ user teedineasy_team
sudo -u teedineasy_team docker ps
```

### Option 2: เพิ่มสิทธิ์ sudo ให้ teedineasy_team

```bash
# SSH ด้วย admin user
ssh your-admin-user@34.158.61.147

# เพิ่ม teedineasy_team เข้า sudo group
sudo usermod -aG sudo teedineasy_team

# หรือเพิ่มใน sudoers
echo "teedineasy_team ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/teedineasy_team
```

### Option 3: ใช้ Google Cloud Console

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com)
2. เลือก VM instance `teedinbackend`
3. คลิก **SSH** (เข้า browser SSH)
4. รันคำสั่งติดตั้ง:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# ติดตั้ง Git
sudo apt install -y git

# ติดตั้ง Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# เพิ่ม user เข้า docker group
sudo usermod -aG docker teedineasy_team

# ติดตั้ง Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
git --version
docker --version
docker-compose --version

# Test docker กับ user teedineasy_team
sudo -u teedineasy_team docker ps
```

## ตรวจสอบการติดตั้ง

หลังจากติดตั้งเสร็จ ทดสอบด้วย:

```bash
# SSH กับ teedineasy_team
ssh -i ~/.ssh/server_key teedineasy_team@34.158.61.147

# ทดสอบคำสั่ง
git --version
docker ps
docker-compose --version

# ถ้าได้ error "permission denied" สำหรับ docker
# ให้ log out แล้ว log in ใหม่
exit
ssh -i ~/.ssh/server_key teedineasy_team@34.158.61.147
docker ps
```

## หลังจากติดตั้งเสร็จ

1. **ทดสอบ Docker:**
   ```bash
   ssh -i ~/.ssh/server_key teedineasy_team@34.158.61.147 "docker ps"
   ```

2. **Trigger GitHub Actions Deployment:**
   ```bash
   git commit --allow-empty -m "Trigger deployment after prerequisites installation"
   git push origin main
   ```

3. **ตรวจสอบ GitHub Actions:**
   - ไปที่ https://github.com/gssana2341/blackend-teedin/actions
   - ดู deployment logs

4. **ทดสอบ API:**
   ```bash
   curl http://34.158.61.147:3001/health
   ```

## สรุป Software ที่ต้องติดตั้ง

- ✅ **Git** - สำหรับ clone และ pull code
- ✅ **Docker** - สำหรับ containerization
- ✅ **Docker Compose** - สำหรับ orchestration
- ✅ **teedineasy_team ใน docker group** - สำหรับรัน docker โดยไม่ต้อง sudo

## Support

ถ้ามีปัญหาติดต่อ:
- Google Cloud Support
- Server Administrator
- DevOps Team
