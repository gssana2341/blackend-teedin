# 🎨 Frontend Setup Guide - การเชื่อมต่อกับ Backend

## 📌 ปัญหา

ตอนนี้ Frontend ใช้ `localhost:3001` ซึ่งทำงานได้แค่บน local development เท่านั้น

เมื่อ deploy Frontend ขึ้น production จะเรียก Backend API ไม่ได้

---

## ✅ วิธีแก้ไข: ใช้ Environment Variables

### **ขั้นตอนที่ 1: ตั้งค่า Next.js Config**

**สำหรับ Frontend Project** สร้างหรือแก้ไข `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables ที่ frontend จะใช้
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  
  // Optional: ใช้ rewrites ถ้าต้องการ proxy API calls
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

---

### **ขั้นตอนที่ 2: สร้างไฟล์ Environment**

#### **2.1 สำหรับ Local Development**

สร้างไฟล์ `.env.local` ใน Frontend project:

```env
# Local Development
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### **2.2 สำหรับ Production**

สร้างไฟล์ `.env.production` ใน Frontend project:

```env
# Production - ใช้ IP ของ Backend Server
NEXT_PUBLIC_API_URL=http://34.158.61.147:3001

# หรือถ้ามี domain แล้ว
# NEXT_PUBLIC_API_URL=https://api.teedin.com
```

---

### **ขั้นตอนที่ 3: แก้ไข API Calls ใน Frontend**

แทนที่จะเขียน hardcode `localhost:3001` ให้ใช้ `NEXT_PUBLIC_API_URL`:

#### **❌ แบบเก่า (ไม่ดี):**

```typescript
// ❌ Hardcoded - ทำงานแค่ local
const response = await fetch('http://localhost:3001/api/properties');
```

#### **✅ แบบใหม่ (ดี):**

```typescript
// ✅ ใช้ environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const response = await fetch(`${API_URL}/api/properties`);
```

หรือสร้าง **API utility function**:

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiCall(endpoint: string, options?: RequestInit) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

// ใช้งาน:
// const data = await apiCall('/api/properties');
// const user = await apiCall('/api/auth/login', { method: 'POST', body: JSON.stringify({...}) });
```

---

### **ขั้นตอนที่ 4: ตัวอย่างการใช้งาน**

#### **Example 1: Fetch Properties**

```typescript
// app/properties/page.tsx
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch(`${API_URL}/api/properties`);
        const data = await response.json();
        setProperties(data.data);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      }
    }
    
    fetchProperties();
  }, []);

  return (
    <div>
      {properties.map(property => (
        <div key={property.id}>{property.title}</div>
      ))}
    </div>
  );
}
```

#### **Example 2: Login API Call**

```typescript
// app/auth/login/page.tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleLogin(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // บันทึก token
      localStorage.setItem('authToken', data.data.token);
      // Redirect ไปหน้าอื่น
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

---

## 🚀 การ Deploy Frontend

### **Option 1: Deploy บน Vercel (แนะนำสำหรับ Next.js)**

1. Push Frontend code ไป GitHub
2. ไปที่ [Vercel](https://vercel.com)
3. Import GitHub repository
4. ตั้งค่า **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL = http://34.158.61.147:3001
   ```
5. Deploy!

### **Option 2: Deploy บน Server เดียวกับ Backend**

สร้าง `docker-compose.prod.yml` ใหม่ที่รวมทั้ง Frontend และ Backend:

```yaml
version: "3.8"

services:
  # Backend API
  teedin-backend:
    build: ./backend
    container_name: teedin-backend
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    env_file:
      - ./backend/.env.production
    networks:
      - teedin-network

  # Frontend
  teedin-frontend:
    build: ./frontend
    container_name: teedin-frontend
    restart: unless-stopped
    environment:
      - NEXT_PUBLIC_API_URL=http://teedin-backend:3001
    networks:
      - teedin-network

  # Nginx (Reverse Proxy)
  nginx:
    image: nginx:alpine
    container_name: teedin-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-full.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - teedin-backend
      - teedin-frontend
    networks:
      - teedin-network

networks:
  teedin-network:
    driver: bridge
```

สร้าง `nginx-full.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server teedin-backend:3001;
    }

    upstream frontend {
        server teedin-frontend:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Backend API
        location /api {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### **Option 3: Deploy Frontend บน Netlify**

1. Push Frontend code ไป GitHub
2. ไปที่ [Netlify](https://netlify.com)
3. Import repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next` หรือ `out`
5. Environment variables:
   ```
   NEXT_PUBLIC_API_URL = http://34.158.61.147:3001
   ```

---

## 🔒 การใช้งานกับ HTTPS (SSL)

ถ้า Backend ใช้ HTTPS แล้ว Frontend **ต้อง** ใช้ HTTPS ด้วย (เพราะ browser จะ block mixed content)

```env
# Production with SSL
NEXT_PUBLIC_API_URL=https://api.teedin.com
```

---

## 📋 Checklist

- [ ] สร้าง `next.config.js` ใน Frontend project
- [ ] สร้าง `.env.local` สำหรับ local development
- [ ] สร้าง `.env.production` สำหรับ production
- [ ] แก้ไข API calls ให้ใช้ `process.env.NEXT_PUBLIC_API_URL`
- [ ] ทดสอบบน local ก่อน (`npm run dev`)
- [ ] ทดสอบ production build (`npm run build && npm start`)
- [ ] Deploy Frontend ขึ้น server หรือ hosting platform

---

## 🧪 การทดสอบ

### **Local Development:**
```bash
cd frontend
npm run dev
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### **Production Build:**
```bash
cd frontend
npm run build
npm start
# Test: http://localhost:3000
```

### **ทดสอบ API Call:**
```javascript
// เปิด Browser Console ที่ Frontend
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

// ทดสอบเรียก API
fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`)
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🎯 สรุป

### **Development (Local):**
```
Frontend:  http://localhost:3000
Backend:   http://localhost:3001
```

### **Production:**
```
Frontend:  https://your-frontend.vercel.app  (Vercel)
           หรือ http://34.158.61.147         (Same server)
Backend:   http://34.158.61.147:3001
```

### **Best Practice:**
- ✅ ใช้ environment variables
- ✅ ไม่ hardcode URLs
- ✅ สร้าง API utility function
- ✅ Handle errors ให้ดี
- ✅ ใช้ HTTPS ใน production

**Happy coding! 🚀**

