# 🔐 ตั้งค่า Git บน Server สำหรับ Private Repository

เนื่องจาก repository เป็น **private** ต้องตั้งค่า SSH key เพื่อให้ server สามารถ `git pull` ได้

---

## 📋 ขั้นตอนการตั้งค่า

### **1. SSH เข้า Server**

```bash
ssh teedineasy_team@34.158.61.147
```

---

### **2. สร้าง SSH Key สำหรับ GitHub**

```bash
# สร้าง SSH key ใหม่
ssh-keygen -t ed25519 -C "server@teedin-backend" -f ~/.ssh/github_deploy

# กด Enter 3 ครั้ง (ไม่ต้องใส่ passphrase)
```

---

### **3. แสดง Public Key**

```bash
cat ~/.ssh/github_deploy.pub
```

**Copy ทั้งหมด** (เริ่มจาก `ssh-ed25519 ...`)

---

### **4. เพิ่ม Deploy Key ใน GitHub**

**Option A: Deploy Key (แนะนำ - สามารถ read-only)**

1. ไปที่ GitHub Repository: `https://github.com/gssana2341/blackend-teedin`
2. ไปที่ **Settings** → **Deploy keys** → **Add deploy key**
3. Title: `Server Deploy Key`
4. Key: Paste public key ที่ copy มา
5. ✅ เลือก **"Allow write access"** (ถ้าต้องการให้ push ได้ด้วย)
6. คลิก **Add key**

**Option B: SSH Key ใน Account (มีสิทธิ์ทุก repo)**

1. ไปที่: `https://github.com/settings/keys`
2. คลิก **New SSH key**
3. Title: `Teedin Server`
4. Key: Paste public key ที่ copy มา
5. คลิก **Add SSH key**

---

### **5. ตั้งค่า SSH Config บน Server**

```bash
# สร้างหรือแก้ไข SSH config
nano ~/.ssh/config
```

เพิ่มเนื้อหา:

```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_deploy
    IdentitiesOnly yes
```

บันทึกและออก (Ctrl+X, Y, Enter)

```bash
# ตั้ง permission ให้ถูกต้อง
chmod 600 ~/.ssh/config
chmod 600 ~/.ssh/github_deploy
chmod 644 ~/.ssh/github_deploy.pub
```

---

### **6. ทดสอบการเชื่อมต่อ GitHub**

```bash
ssh -T git@github.com
```

ถ้าสำเร็จจะเห็น:
```
Hi gssana2341/blackend-teedin! You've successfully authenticated, but GitHub does not provide shell access.
```

---

### **7. Clone หรือ Update Remote URL**

#### **ถ้ายัง clone repository:**

```bash
cd ~
git clone git@github.com:gssana2341/blackend-teedin.git teedin-backend
cd teedin-backend
```

#### **ถ้ามี repository อยู่แล้ว แต่ใช้ HTTPS:**

```bash
cd ~/teedin-backend

# ตรวจสอบ remote URL
git remote -v

# เปลี่ยนจาก HTTPS เป็น SSH
git remote set-url origin git@github.com:gssana2341/blackend-teedin.git

# ตรวจสอบอีกครั้ง
git remote -v
```

---

### **8. ทดสอบ Git Pull**

```bash
cd ~/teedin-backend
git pull origin main
```

ถ้าสำเร็จจะเห็น:
```
Already up to date.
```
หรือจะเห็นการอัพเดทไฟล์

---

### **9. สร้างไฟล์ .env.production**

```bash
cd ~/teedin-backend

# สร้างจาก template
cp env.production.example .env.production

# แก้ไข
nano .env.production
```

ใส่ค่าที่จำเป็น:

```env
NODE_ENV=production
PORT=3001

# Supabase (ต้องกรอก!)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security (สำคัญ!)
JWT_SECRET=your-random-secret-key-at-least-32-chars
ENCRYPTION_KEY=another-32-char-encryption-key-here

# Optional
LOG_LEVEL=info
CORS_ORIGIN=*
```

---

### **10. ทดสอบ Docker Deployment**

```bash
cd ~/teedin-backend

# Build และ start
docker compose -f docker-compose.prod.yml up -d --build

# ดู logs
docker compose -f docker-compose.prod.yml logs -f

# ตรวจสอบ status
docker compose -f docker-compose.prod.yml ps
```

---

## 🎯 ทดสอบ CI/CD

หลังจากตั้งค่าเสร็จแล้ว:

1. **แก้ไข code บน local**
2. **Commit และ push:**
   ```bash
   git add .
   git commit -m "Test CI/CD"
   git push origin main
   ```
3. **ดู GitHub Actions:** `https://github.com/gssana2341/blackend-teedin/actions`
4. **ตรวจสอบ server:** Code จะถูก pull และ deploy อัตโนมัติ

---

## 🔧 คำสั่งที่มีประโยชน์

### **ดู logs แบบ real-time:**
```bash
docker compose -f docker-compose.prod.yml logs -f teedin-backend
```

### **Restart services:**
```bash
docker compose -f docker-compose.prod.yml restart
```

### **Stop services:**
```bash
docker compose -f docker-compose.prod.yml down
```

### **Pull code ใหม่และ rebuild:**
```bash
cd ~/teedin-backend
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

### **ดู container status:**
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml top
```

---

## 🚨 Troubleshooting

### **ปัญหา: Permission denied (publickey)**

```bash
# ตรวจสอบ SSH key
ls -la ~/.ssh/

# ตรวจสอบว่า key ถูกเพิ่มใน GitHub แล้ว
ssh -T git@github.com -v

# ตรวจสอบ SSH config
cat ~/.ssh/config

# แก้ไข permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/github_deploy
chmod 644 ~/.ssh/github_deploy.pub
chmod 600 ~/.ssh/config
```

---

### **ปัญหา: git pull ไม่ได้**

```bash
# ตรวจสอบ remote URL
git remote -v

# ต้องเป็น SSH format: git@github.com:username/repo.git
# ถ้าเป็น HTTPS: https://github.com/username/repo.git ให้เปลี่ยน:
git remote set-url origin git@github.com:gssana2341/blackend-teedin.git
```

---

### **ปัญหา: Docker build ไม่ได้**

```bash
# ตรวจสอบว่ามีไฟล์ครบ
ls -la ~/teedin-backend/

# ต้องมี:
# - Dockerfile
# - docker-compose.prod.yml
# - .env.production
# - package.json

# ถ้าไม่มี .env.production
cp env.production.example .env.production
nano .env.production
```

---

## ✅ Checklist

- [ ] สร้าง SSH key บน server (`ssh-keygen`)
- [ ] เพิ่ม public key ใน GitHub (Deploy key หรือ SSH key)
- [ ] สร้าง `~/.ssh/config` และตั้งค่า
- [ ] ทดสอบ SSH connection (`ssh -T git@github.com`)
- [ ] เปลี่ยน remote URL เป็น SSH format
- [ ] ทดสอบ `git pull origin main`
- [ ] สร้างไฟล์ `.env.production`
- [ ] ทดสอบ Docker build และ start
- [ ] Push code ใหม่และดู CI/CD ทำงาน

---

## 🎉 เสร็จแล้ว!

หลังจากตั้งค่าเสร็จ การ deploy จะเป็นแบบนี้:

1. **Local:** แก้ code → commit → push
2. **GitHub Actions:** Trigger workflow
3. **Server:** SSH เข้าไป → git pull → docker build → docker up
4. **Done!** 🚀

**Good luck!**

