# 🧪 Postman Testing Guide - Teedin Backend API

## 📥 การนำเข้าไฟล์ใน Postman

### 1. นำเข้า Collection
1. เปิด Postman
2. คลิก **Import** 
3. เลือกไฟล์ `postman-collection.json`
4. คลิก **Import**

### 2. นำเข้า Environment
1. คลิก **Environments** ในแถบซ้าย
2. คลิก **Import**
3. เลือกไฟล์ `postman-environment.json`
4. คลิก **Import**
5. เลือก Environment **"Teedin Backend Environment"**

## 🚀 วิธีการทดสอบ

### 1. ทดสอบ Server พื้นฐาน
```
GET {{baseUrl}}/health
GET {{baseUrl}}/
```

### 2. ทดสอบ Properties API
```
GET {{baseUrl}}/api/properties
GET {{baseUrl}}/api/properties/{{propertyId}}
GET {{baseUrl}}/api/properties/similar?location=Bangkok&limit=5
POST {{baseUrl}}/api/properties/create
```

### 3. ทดสอบ Authentication
```
GET {{baseUrl}}/api/auth/me
POST {{baseUrl}}/api/auth/logout
```

### 4. ทดสอบ Admin API (ต้องมี authToken)
```
GET {{baseUrl}}/api/admin/dashboard
GET {{baseUrl}}/api/admin/users
GET {{baseUrl}}/api/admin/properties
GET {{baseUrl}}/api/admin/agents
```

### 5. ทดสอบ Appointments
```
GET {{baseUrl}}/api/appointments
POST {{baseUrl}}/api/appointments
```

### 6. ทดสอบ Listings
```
GET {{baseUrl}}/api/listings/my-listings?agentId={{agentId}}
```

### 7. ทดสอบ Negotiations
```
GET {{baseUrl}}/api/negotiations/price-negotiations
POST {{baseUrl}}/api/negotiations/price-negotiations
```

### 8. ทดสอบ Notifications
```
GET {{baseUrl}}/api/notifications?user_id={{userId}}
POST {{baseUrl}}/api/notifications/read
```

### 9. ทดสอบ Users
```
GET {{baseUrl}}/api/users/{{userId}}
POST {{baseUrl}}/api/users/update-role
POST {{baseUrl}}/api/users/check-exists
```

### 10. ทดสอบ Database
```
GET {{baseUrl}}/api/database/test-connection
POST {{baseUrl}}/api/database/create-tables
POST {{baseUrl}}/api/database/create-otp-tables
```

### 11. ทดสอบ Testing & Diagnostics
```
POST {{baseUrl}}/api/testing/test-smtp
POST {{baseUrl}}/api/testing/test-twilio
POST {{baseUrl}}/api/testing/test-resend
GET {{baseUrl}}/api/testing/email-diagnostics
GET {{baseUrl}}/api/testing/sms-diagnostics
GET {{baseUrl}}/api/testing/debug-notifications
GET {{baseUrl}}/api/testing/debug-properties
```

### 12. ทดสอบ Utilities
```
POST {{baseUrl}}/api/send-otp
POST {{baseUrl}}/api/send-otp-sms
POST {{baseUrl}}/api/verify-otp
POST {{baseUrl}}/api/reset-password
POST {{baseUrl}}/api/track-view
POST {{baseUrl}}/api/check-duplicate
POST {{baseUrl}}/api/check-otp
GET {{baseUrl}}/api/get-ip
```

## 🔧 การตั้งค่า Environment Variables

### ตัวแปรที่สำคัญ:
- **baseUrl**: `http://localhost:3001` (หรือ URL ของ server)
- **authToken**: Token สำหรับ authentication (ถ้ามี)
- **userId**: ID ของ user สำหรับทดสอบ
- **agentId**: ID ของ agent สำหรับทดสอบ
- **propertyId**: ID ของ property สำหรับทดสอบ

## 📝 ตัวอย่างการทดสอบ

### 1. ทดสอบ Health Check
```bash
GET http://localhost:3001/health
Expected: 200 OK
Response: {"status":"OK","service":"Teedin Backend API","timestamp":"..."}
```

### 2. ทดสอบ Get Properties
```bash
GET http://localhost:3001/api/properties
Expected: 200 OK
Response: {"success":true,"data":[...]}
```

### 3. ทดสอบ Create Property
```bash
POST http://localhost:3001/api/properties/create
Body: {
  "agentId": "e73c79cf-251f-43c0-9f63-7070d168f47d",
  "propertyData": {...},
  "propertyDetails": {...}
}
Expected: 201 Created
Response: {"success":true,"data":{...}}
```

## ⚠️ หมายเหตุสำคัญ

### 1. Authentication
- API บางตัวต้องมี `Authorization: Bearer <token>`
- ตั้งค่า `authToken` ใน environment variables

### 2. Database Connection
- ต้องมี Supabase connection ที่ทำงาน
- ตรวจสอบ environment variables ใน `.env`

### 3. Error Handling
- ตรวจสอบ status code และ error messages
- บาง API อาจต้องการข้อมูลที่ถูกต้องใน database

### 4. Rate Limiting
- OTP APIs มี rate limiting
- รอสักครู่หากได้รับ 429 Too Many Requests

## 🎯 การทดสอบแบบ Batch

### 1. ทดสอบพื้นฐาน
1. Health Check
2. Get API Info
3. Get Properties
4. Test Database Connection

### 2. ทดสอบ Authentication
1. Get Current User (ถ้ามี token)
2. Logout

### 3. ทดสอบ CRUD Operations
1. Create Property
2. Get Property by ID
3. Update Property (ถ้ามี)
4. Delete Property (ถ้ามี)

### 4. ทดสอบ Admin Functions
1. Get Dashboard Stats
2. Get Users
3. Get Agents
4. Create Announcement

## 📊 Expected Results

### ✅ Success Responses
- **200 OK**: GET requests สำเร็จ
- **201 Created**: POST requests สำเร็จ
- **204 No Content**: DELETE requests สำเร็จ

### ❌ Error Responses
- **400 Bad Request**: ข้อมูลไม่ถูกต้อง
- **401 Unauthorized**: ไม่มี authentication
- **403 Forbidden**: ไม่มีสิทธิ์
- **404 Not Found**: ไม่พบข้อมูล
- **500 Internal Server Error**: Server error

## 🔍 Debugging Tips

1. **ตรวจสอบ Server**: `npm run dev` ทำงานอยู่หรือไม่
2. **ตรวจสอบ Database**: Supabase connection ทำงานหรือไม่
3. **ตรวจสอบ Environment**: Variables ถูกต้องหรือไม่
4. **ตรวจสอบ Logs**: ดู console logs ใน terminal
5. **ตรวจสอบ Network**: ใช้ browser dev tools

## 📚 Additional Resources

- **API Documentation**: ดูใน `README.md`
- **Server Logs**: ดูใน terminal ที่รัน `npm run dev`
- **Database**: ตรวจสอบใน Supabase Dashboard
