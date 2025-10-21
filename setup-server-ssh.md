# 🔐 Server SSH Setup

## 1. เพิ่ม Public Key เข้า Server

เชื่อมต่อ server และเพิ่ม public key:

```bash
# เชื่อมต่อ server
ssh -i ~/.ssh/server_key teedineasy_team@34.158.61.147

# เพิ่ม public key เข้า authorized_keys
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDMaCsl8hbC54OPZYWP8Dg0tdPwMaV0qNnkLJCQ8jcGs0TtMu28BMBbzM/tqm1yl0/IsfCy1Yc/fLchBvYXQARiumMSK1p+DEcW+RcSxO1bVUL5Tp8fFx5Oq6mMpMhoQWZp7G6OF0hYe8zH2BkZMJkEBRF/Sra89fNQljZyvINnowpwn94+0V31mcIGW4gQ/d4/JgHGlcPQ/NPizZn77cdojAr8RZZv+B7IJXzA6H17YcbZoqF0wIC8y+fHijcwyCj56Km2HCnbUdKWn5+AxrLSN/vlNv7YH5vyTT7gvlAAkCAKtE1zzXHdePnoer2g69Gn3I3ULSMhChO8rBiZaCj+v/jFABuJ7a4wx2Zp0QUfLG+gfvQppiDuzURL/uSbw2nRCvMs6bHu+tBxZAO1mR1h18Fl/3HMUygg/HsSJjwRUCKkmOyAsdyqzrv+66U0sCNWZang0itGivhnKYSI6Ha88Yc6hTuyzvmHlstvx0477sQ4sBf5sARMQCpgV1kzqSt0TUsavekKegoIxxFtXyEqyvTeTfXI712oe5fTsIDg/q+7Spi8vgU8Zu54Twr6i8f2LFTR8E9MKJa2LwWer1emMGahKRAMHa+N6eieuyMT0kviZ/3ZjBldRr+YVPzS50R2n30XSrOIWGChfQlIOxe3twzQiGe9i0xkMkpRR+vWww== github-actions@teedin" >> ~/.ssh/authorized_keys

# ตั้งค่า permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# ออกจาก server
exit
```

## 2. อัปเดต GitHub Secrets

1. ไปที่ GitHub Repository → Settings → Secrets and variables → Actions
2. ลบ `SERVER_SSH_KEY` เก่า (ถ้ามี)
3. เพิ่ม `SERVER_SSH_KEY` ใหม่ด้วย private key:

```
-----BEGIN OPENSSH PRIVATE KEY-----
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
-----END OPENSSH PRIVATE KEY-----
```

## 3. ทดสอบ SSH Connection

```bash
# ทดสอบ SSH connection
ssh -i ~/.ssh/github_actions_key teedineasy_team@34.158.61.147

# ถ้าสำเร็จ จะเห็น prompt ของ server
```

## 4. ทดสอบ CI/CD

```bash
# Commit และ push
git add .
git commit -m "Update SSH key for GitHub Actions"
git push origin main

# ตรวจสอบ GitHub Actions
# ไปที่ Actions tab ใน GitHub repository
```

## 5. ตรวจสอบ Deployment

```bash
# เชื่อมต่อ server
ssh -i ~/.ssh/github_actions_key teedineasy_team@34.158.61.147

# ตรวจสอบ Docker containers
docker-compose -f docker-compose.prod.yml ps

# ตรวจสอบ logs
docker-compose -f docker-compose.prod.yml logs -f
```
