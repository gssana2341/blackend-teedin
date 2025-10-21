"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// สร้างเทมเพลตอีเมล HTML สวยๆ
const createEmailTemplate = (otpCode) => `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>รหัส OTP - TedIn Easy</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 10px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 10px;
    }
    .otp-code {
      background-color: #f0f4ff;
      border: 2px solid #2563eb;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #2563eb;
      margin: 30px 0;
      font-family: 'Courier New', monospace;
    }
    .warning {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 5px 5px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏠 TedIn Easy</div>
      <h1>รหัส OTP สำหรับรีเซ็ตรหัสผ่าน</h1>
    </div>
    
    <p>สวัสดีครับ/ค่ะ,</p>
    
    <p>คุณได้ขอรีเซ็ตรหัสผ่านสำหรับบัญชี TedIn Easy ของคุณ กรุณาใช้รหัส OTP ด้านล่างเพื่อดำเนินการต่อ:</p>
    
    <div class="otp-code">${otpCode}</div>
    
    <div class="warning">
      <strong>⚠️ คำเตือนด้านความปลอดภัย:</strong>
      <ul>
        <li>รหัสนี้จะหมดอายุใน 5 นาที</li>
        <li>ใช้งานได้เพียง 1 ครั้งเท่านั้น</li>
        <li>ห้ามแชร์รหัสนี้กับผู้อื่น</li>
      </ul>
    </div>
    
    <p>หากคุณไม่ได้ร้องขอการรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยต่ออีเมลนี้</p>
    
    <p>หากคุณมีปัญหาหรือข้อสงสัย กรุณาติดต่อทีมสนับสนุนของเรา</p>
    
    <div class="footer">
      <p>ขอบคุณที่ใช้บริการ TedIn Easy</p>
      <p>อีเมลนี้ส่งโดยอัตโนมัติ กรุณาอย่าตอบกลับ</p>
    </div>
  </div>
</body>
</html>
`;
// ส่ง OTP ผ่าน Ethereal Email (เพื่อการทดสอบ)
const sendOTPEmail = async (to, otpCode) => {
    try {
        console.log(`📧 กำลังส่งอีเมล OTP ผ่าน Ethereal Email...`);
        // สร้าง test account อัตโนมัติ
        const testAccount = await nodemailer_1.default.createTestAccount();
        console.log("📝 สร้าง Ethereal test account สำเร็จ");
        console.log(`📧 Test Email: ${testAccount.user}`);
        console.log(`🔑 Test Password: ${testAccount.pass}`);
        // สร้าง transporter ด้วย test account
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        const mailOptions = {
            from: {
                name: "TedIn Easy - ระบบอสังหาริมทรัพย์",
                address: testAccount.user,
            },
            to: to,
            subject: "🔐 รหัส OTP สำหรับการรีเซ็ตรหัสผ่าน - TedIn Easy",
            html: createEmailTemplate(otpCode),
            text: `
รหัส OTP สำหรับการรีเซ็ตรหัสผ่าน TedIn Easy

รหัส OTP ของคุณคือ: ${otpCode}

รหัสนี้จะหมดอายุใน 5 นาที และใช้งานได้เพียง 1 ครั้งเท่านั้น

หากคุณไม่ได้ทำการขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยต่ออีเมลนี้

ขอบคุณที่ใช้บริการ TedIn Easy
      `.trim(),
        };
        const info = await transporter.sendMail(mailOptions);
        // สร้าง preview URL
        const previewUrl = nodemailer_1.default.getTestMessageUrl(info);
        console.log("✅ ส่งอีเมล OTP ผ่าน Ethereal Email สำเร็จ");
        console.log("📧 Message ID:", info.messageId);
        console.log("🌐 Preview URL:", previewUrl);
        console.log(`📬 อีเมลถูกส่งไปยัง ${to} (ในโหมดทดสอบ)`);
        console.log("💡 คุณสามารถดูอีเมลได้ที่ URL ข้างต้น");
        return {
            success: true,
            provider: "ethereal",
            previewUrl: previewUrl,
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("❌ Ethereal Email Error:", message);
        return {
            success: false,
            error: message || "Failed to send email via Ethereal Email",
        };
    }
};
exports.sendOTPEmail = sendOTPEmail;
exports.default = exports.sendOTPEmail;
//# sourceMappingURL=email-ethereal.js.map