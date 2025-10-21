# 🔐 GitHub Secrets Setup Guide

## **วิธีการตั้งค่า Repository Secrets**

### **1. ไปที่ GitHub Repository Settings**

1. เปิด repository ของคุณที่ GitHub
2. คลิก **"Settings"** (tab ด้านบน)
3. คลิก **"Secrets and variables"** → **"Actions"** (เมนูซ้าย)
4. คลิก **"New repository secret"**

---

## **🔑 Secrets ที่ต้องเพิ่ม**

### **Secret #1: SERVER_SSH_KEY**

**ชื่อ Secret:** `SERVER_SSH_KEY`

**วิธีการหา Value:**

#### **บน Local Machine:**

```bash
# 1. เข้า SSH ไปที่ server
ssh teedineasy_team@34.158.61.147

# 2. สร้าง SSH key ใหม่บน server (ถ้ายังไม่มี)
ssh-keygen -t rsa -b 4096 -C "github-actions@teedin"

# กด Enter 3 ครั้ง (ไม่ต้องใส่ passphrase)
# Key จะถูกสร้างที่ ~/.ssh/id_rsa

# 3. เพิ่ม public key ลงใน authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 4. แสดง PRIVATE KEY (เอาไปใส่ใน GitHub Secret)
cat ~/.ssh/id_rsa
```

**Copy ทั้งหมด** รวมถึง:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAACFw...
[ข้อมูลยาว ๆ]
-----END OPENSSH PRIVATE KEY-----
```

**⚠️ สิ่งที่ต้องระวัง:**
- ต้อง copy **ทั้งหมด** รวม header และ footer
- ต้องมี **newline** ที่บรรทัดสุดท้าย
- **อย่า** share private key กับใครเด็ดขาด!

---

## **📝 ขั้นตอนการเพิ่ม Secret ใน GitHub**

### **วิธีที่ 1: ผ่าน GitHub Web UI (แนะนำ)**

1. ไปที่: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`
2. คลิก **"New repository secret"**
3. Name: `SERVER_SSH_KEY`
4. Value: Paste **PRIVATE KEY** ทั้งหมด (จากคำสั่ง `cat ~/.ssh/id_rsa`)
5. คลิก **"Add secret"**

---

## **🧪 ทดสอบว่า SSH Key ใช้งานได้**

### **บน Local Machine:**

```bash
# 1. สร้างไฟล์ test_key (paste private key ที่ได้จากข้างบน)
nano test_key

# 2. ตั้งค่า permission
chmod 600 test_key

# 3. ทดสอบ SSH
ssh -i test_key teedineasy_team@34.158.61.147

# ถ้าเข้าได้โดยไม่ต้องใส่ password = ✅ สำเร็จ!
```

---

## **🔧 แก้ไขปัญหา**

### **ปัญหา: "Permission denied (publickey)"**

**วิธีแก้:**

```bash
# 1. SSH เข้า server
ssh teedineasy_team@34.158.61.147

# 2. ตรวจสอบ permissions
ls -la ~/.ssh/

# 3. แก้ไข permissions ที่ถูกต้อง
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

# 4. ตรวจสอบว่า public key อยู่ใน authorized_keys
cat ~/.ssh/authorized_keys

# 5. ถ้าไม่มี ให้เพิ่ม
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

---

### **ปัญหา: "ssh: handshake failed: ssh: unable to authenticate"**

**สาเหตุที่เป็นไปได้:**
1. ❌ Private key ใน GitHub Secret ไม่ถูกต้อง
2. ❌ Public key ไม่อยู่ใน `~/.ssh/authorized_keys` บน server
3. ❌ Permission ของ `.ssh` หรือ `authorized_keys` ผิด

**วิธีแก้:**
```bash
# บน Server:
# 1. ตรวจสอบว่า public key อยู่ใน authorized_keys
cat ~/.ssh/authorized_keys | grep github-actions

# 2. ถ้าไม่มี ให้เพิ่ม
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

# 3. ตรวจสอบ permission
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# 4. Copy private key ใหม่ไปใส่ใน GitHub Secret
cat ~/.ssh/id_rsa
```

---

## **✅ Checklist การตั้งค่า**

- [ ] สร้าง SSH key บน server แล้ว (`ssh-keygen`)
- [ ] เพิ่ม public key ลงใน `~/.ssh/authorized_keys`
- [ ] Permission ถูกต้อง (700 สำหรับ `.ssh`, 600 สำหรับ `authorized_keys`)
- [ ] Copy **PRIVATE KEY** ทั้งหมดไปใส่ใน GitHub Secret `SERVER_SSH_KEY`
- [ ] ทดสอบ SSH จาก local ได้แล้ว (ไม่ต้องใส่ password)
- [ ] Push code ไป GitHub และ Actions ทำงาน

---

## **🚀 ขั้นตอนสุดท้าย**

หลังจากเพิ่ม Secrets แล้ว:

1. ✅ Commit และ push code ใด ๆ ไป GitHub
2. ✅ ไปดู Actions tab: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`
3. ✅ ดูว่า Workflow ทำงานสำเร็จหรือไม่
4. ✅ ถ้าสำเร็จ API จะพร้อมใช้งานที่ `http://34.158.61.147:3001`

---

## **🔍 วิธีดู Logs**

### **บน GitHub Actions:**
```
GitHub → Your Repo → Actions → เลือก workflow run → คลิก job "deploy" → ดู logs
```

### **บน Server:**
```bash
# SSH เข้า server
ssh teedineasy_team@34.158.61.147

# ดู Docker logs
cd ~/teedin-backend
docker-compose -f docker-compose.prod.yml logs -f
```

---

## **📞 ติดปัญหา?**

1. ตรวจสอบว่า SSH key format ถูกต้อง (ต้องมี header/footer)
2. ตรวจสอบ permissions บน server
3. ทดสอบ SSH จาก local machine ก่อน
4. ดู logs ใน GitHub Actions
5. ดู logs บน server (`docker-compose logs`)

**Good luck! 🎉**
