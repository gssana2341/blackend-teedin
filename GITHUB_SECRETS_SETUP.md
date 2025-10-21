# 🔐 GitHub Secrets Setup Guide

## ปัญหาที่พบ
```
ssh.ParsePrivateKey: ssh: no key found
ssh: handshake failed: ssh: unable to authenticate
```

## วิธีแก้ไข

### 1. ตรวจสอบ SSH Key ที่ถูกต้อง

Private key ที่ต้องใช้:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAACFwAAAAdzc2gtcn
NhAAAAAwEAAQAAAgEAzGgrJfIWwueDj2WFj/A4NLXT8DGldKjZ5CyQkPI3BrNE7TLtvATA
W8zP7aptcpdPyLHwstWHP3y3IQb2F0AEYrpjEitafgxHFvkXEsTtW1VC+U6fHxceTqupjK
TIaEFmaexujhdIWHvMx9gZGTCZBAURf0q2vPXzUJY2cryDZ6MKcJ/ePtFd9ZnCBluIEP3e
PyYBxpXD0PzT4s2Z++3HaIwK/EWWb/geyCV8wOh9e2HG2aKhdMCAvMvnx4o3MMgo+eipth
wp21HSlp+fgMay0jf75Tb+2B+b8k0+4L5QAJAgCrRNc81x3Xj56Hq9oOvRp9yN1C0jIQoT
vKwYmWgo/r/4xQAbie2uMMdmadEFHyxvoH70KaYg7s1ES/7km8Np0QrzLOmx7vrQcWQDtZ
kdYdfBZf9xzFMoIPx7EiY8EVAipJjsgLHcqs67/uulNLAjVmWp4NIrRor4ZymEiOh2vPGH
OoU7ss75h5bLb8dOO+7EOLAX+bAETEAqYFdZM6krdE1LGr3pCnoKCMcRbV8hKsr03k31yO
9dqHuX07CA4P6vu0qYvL4FPGbueE8K+ovH9ixU0fBPTCiWti8Fnq9XpjBmoSkQDB2vjeno
nrsjE9JL4mf92YwZXUa/mFT80udEdp99F0qziFhgoX0JSDsXt7cM0IhnvYtMZDJKUUfr1s
MAAAdQLMgDuSzIA7kAAAAHc3NoLXJzYQAAAgEAzGgrJfIWwueDj2WFj/A4NLXT8DGldKjZ
5CyQkPI3BrNE7TLtvATAW8zP7aptcpdPyLHwstWHP3y3IQb2F0AEYrpjEitafgxHFvkXEs
TtW1VC+U6fHxceTqupjKTIaEFmaexujhdIWHvMx9gZGTCZBAURf0q2vPXzUJY2cryDZ6MK
cJ/ePtFd9ZnCBluIEP3ePyYBxpXD0PzT4s2Z++3HaIwK/EWWb/geyCV8wOh9e2HG2aKhdM
CAvMvnx4o3MMgo+eipthwp21HSlp+fgMay0jf75Tb+2B+b8k0+4L5QAJAgCrRNc81x3Xj5
6Hq9oOvRp9yN1C0jIQoTvKwYmWgo/r/4xQAbie2uMMdmadEFHyxvoH70KaYg7s1ES/7km8
Np0QrzLOmx7vrQcWQDtZkdYdfBZf9xzFMoIPx7EiY8EVAipJjsgLHcqs67/uulNLAjVmWp
4NIrRor4ZymEiOh2vPGHOoU7ss75h5bLb8dOO+7EOLAX+bAETEAqYFdZM6krdE1LGr3pCn
oKCMcRbV8hKsr03k31yO9dqHuX07CA4P6vu0qYvL4FPGbueE8K+ovH9ixU0fBPTCiWti8F
nq9XpjBmoSkQDB2vjenonrsjE9JL4mf92YwZXUa/mFT80udEdp99F0qziFhgoX0JSDsXt7
cM0IhnvYtMZDJKUUfr1sMAAAADAQABAAACAQCW+3qjlKXrYUZz7PEy2KUrigL6MDGecfo/
6AsAhWjPsir/adbgQkIzjJ0pV/Fv6wQrogPAlKhJ5Lz/0DyF/+s9YZ88FHnLERaRiXvZiU
wpYlkN/VzbgiAIzBN4p17AY05afyFKIzh04zzngF9Jk/PyXCwIcg94k9Mde1bMeSI2st9L
QUrP66YTe3ctav6eTmaTDmfRX148SAPaSzOqOoBIYOjcXio4mnViMQ5tD01gjWBr8QyBSI
/O5G5XnWgWyEI8FfcFZNgl/9IlH9KZNCtxy5hsPqsOyIpP926yYuCFCfAg9/0dxGqOxIUT
i1X2PzmlW+wHBTAlf2QEwLmK1r0v3H0Im2liQDA28EzfqZCUM06LCfpV4Yd+qpWSgI7MQJ
l1xzIQ3jcyHz+HvP+sRnSDtFdffvAEkGId715LbbmtfqVwUiWq0NtXgHhNoIs1dbtePChq
kDcXr9C0HDb15fvR7tmTk9YXMnvrK3gOgnG9bLuCC+DeCv4a0Hr7BVzDcKnadsfIamOEP9
Q2PfRlhHvP9vRBmNjVCX0Sf1yV6iW6XpIXwYMcxdFAZkEPb9n+ldc1SPX7+Y2i3gkbJ0UW
m9ns+c3N1XaNaDDOmrw6KgfUyZCehImnspSpdKiZIEAt5QhflpQEtwndlFUiBuZCyi7rP7
fjZ8nGn+BFNb26922uwQAAAQEAj2eGdYsYmJkGsF0xJ2J91lK/wi06RZ5WNl1/XWkWMJFS
SH9sQ4x4tFbHtIAtf2/o0vsbFziQEHil7U0KZFIPdAXb6Gnuka4MIa21ioviGZ2UykQc5M
UOYnjKUxUxON9RaxLCejOuIZ8onaIotbYb+cKcK6Q1Dw+jj5cWcC53irnPzX1kqrei3pak
CRMkCRoAV0xDLoPzFk4yu/yapNLRhpYTQPL2q3RSuytjb/IKs9hPdiODjHYBboBrLbQCH1
K3dv5qP+j4Ky18kkNbh10Uak6HcwFJCI8DvkdTpw+i3vjZNkeKE8i5iHec+Nrpfri5sH92
ooQIJ0H7nyEG6qF3TQAAAQEA5P1hZW4fKv1xNGgGuih4XFhXVJwqggHufZwxn19+MycOaB
nsL2x67ofLHK5WTJqORKHaQUYMeCmIFo9MJMA4EIxFHmXbiE54hjwiRduUVdABJgdRRGA7
q30Az3vzW78dT0E3brVVX0Os8cvvoeJTNto6fmaepr4NVNtvBn7mAOC2UyIoZTiqGcLs6T
U20B15xNYMrwRIyYYItV0uj+xvEUz1pwSAATpSRMRVDUKzcFnsgoPuhvGCrSMWSM+p2oa3
IJ70Uo1ANKJDfY0Br7XlmTH312ZsPuyIrVDKeIBv5mivUldypB0Tsp1NqoVgDwFnpsKr71
nCqyyP29v1PfJPHQAAAQEA5IR6s5Xy8EjN9LPtRbyjEbysPus518VPKReuoH8qxDnXkxx6
easH4IeQw0EEDW1Ss+/uHZ5BkRdQP8JBZOuxAz306Mnt8DJjYaxWMPkwqEAwcaYp4v2kaT
tTf8FT8pVlyTg/2sdKT3+LUnCegmk+kUhi7jKX8B9AEaZ1GbpQoer8FKHdTvADc7yQPezy
xzDvwCocpYfJU6ZQuKdC+0m/yrZ22Bv3pSdHwvdL/mwDq6qQB5fqu6/3XbBUNb8rXDImrP
pyDmAW7WtC1OI1ZsyW100Qp/yEt5i8AxAMTU/Y4rPmnTcZO5nGA3Vy5Y1KR6mODPkbweVU
z8HhgXEbEgJ3XwAAABVnaXRodWItYWN0aW9uc0B0ZWVkaW4BAgME
-----END OPENSSH PRIVATE KEY-----
```

### 2. เพิ่ม Secret ใน GitHub

1. ไปที่ `https://github.com/gssana2341/blackend-teedin/settings/secrets/actions`
2. คลิก **New repository secret**
3. Name: `SERVER_SSH_KEY`
4. Value: **Copy private key ทั้งหมดจากด้านบน** (รวม `-----BEGIN` และ `-----END`)
5. คลิก **Add secret**

### 3. ตรวจสอบ Format

**✅ ถูกต้อง:**
- มี `-----BEGIN OPENSSH PRIVATE KEY-----`
- มี `-----END OPENSSH PRIVATE KEY-----`
- **ไม่มี** space หรือ tab เพิ่มเติม
- **ไม่มี** newline เพิ่มเติมที่ท้าย

**❌ ผิด:**
- ไม่มี `-----BEGIN` หรือ `-----END`
- มี space หรือ tab ข้างหน้า
- มี newline เพิ่มเติม
- Copy ไม่ครบ

### 4. ทดสอบ SSH Connection

```bash
# ทดสอบ SSH
ssh -i ~/.ssh/github_actions_key teedineasy_team@34.158.61.147 "echo 'Success!'"
```

### 5. ตรวจสอบ GitHub Actions

หลังจากเพิ่ม secret:
1. ไปที่ **Actions** tab
2. คลิก workflow ล่าสุด
3. ดู logs ว่ามี error หรือไม่

### 6. Troubleshooting

#### ถ้ายังมี error:

**Option 1: ใช้ key_path แทน**
```yaml
- name: Setup SSH
  run: |
    mkdir -p ~/.ssh
    echo "${{ secrets.SERVER_SSH_KEY }}" > ~/.ssh/deploy_key
    chmod 600 ~/.ssh/deploy_key

- name: Deploy
  uses: appleboy/ssh-action@v1.0.0
  with:
    host: 34.158.61.147
    username: teedineasy_team
    key_path: ~/.ssh/deploy_key
```

**Option 2: ใช้ rsync deployment**
```yaml
- name: Deploy
  run: |
    echo "${{ secrets.SERVER_SSH_KEY }}" > ~/.ssh/deploy_key
    chmod 600 ~/.ssh/deploy_key
    ssh -i ~/.ssh/deploy_key teedineasy_team@34.158.61.147 "
      cd ~/teedin-backend &&
      git pull origin main &&
      sudo docker-compose -f docker-compose.prod.yml up -d --build
    "
```

## สรุป

1. ✅ SSH key มีอยู่ใน server แล้ว
2. ⚠️ GitHub Secret ต้องตั้งค่าให้ถูกต้อง
3. 🔧 ใช้ private key ที่แสดงด้านบน
4. 🚀 Deploy อัตโนมัติหลัง push

**หลังจากตั้งค่า secret แล้ว ให้ push code ใหม่เพื่อทดสอบ!**
