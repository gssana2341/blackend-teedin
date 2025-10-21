import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

type TestStatus = "✅ SUCCESS" | "❌ FAILED";

interface SmsTestResult {
  status: TestStatus;
  messageSid?: string;
  status_detail?: string;
  error?: string;
  code?: string | number;
}

interface VerifyTestResult {
  status: TestStatus;
  verificationSid?: string;
  status_detail?: string;
  error?: string;
  code?: string | number;
}

interface TwilioTestResult {
  connection: TestStatus;
  balance: string;
  accountStatus: string | null | undefined;
  accountType: string | null | undefined;
  smsTest: SmsTestResult | null;
  verifyTest: VerifyTestResult | null;
}

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Unknown error";
};

const extractErrorCode = (error: unknown): string | number | undefined => {
  if (typeof error === "object" && error !== null && "code" in error) {
    return (error as { code?: string | number }).code;
  }
  return undefined;
};

export async function POST(request: NextRequest) {
  try {
    const { phone, message, testPhone } = await request.json();

    // ตรวจสอบค่า environment variables
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const twilioVerifySid = process.env.TWILIO_VERIFY_SID;

    console.log("🔍 Twilio Config Check:");
    console.log(
      "Account SID:",
      twilioAccountSid
        ? `${twilioAccountSid.substring(0, 10)}...`
        : "❌ Missing"
    );
    console.log(
      "Auth Token:",
      twilioAuthToken ? `${twilioAuthToken.substring(0, 10)}...` : "❌ Missing"
    );
    console.log("Phone Number:", twilioPhoneNumber || "❌ Missing");
    console.log(
      "Verify SID:",
      twilioVerifySid ? `${twilioVerifySid.substring(0, 10)}...` : "❌ Missing"
    );

    if (!twilioAccountSid || !twilioAuthToken) {
      return NextResponse.json(
        {
          error: "Twilio credentials not configured",
          details: "Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN",
        },
        { status: 500 }
      );
    }

    // ติดตั้ง Twilio client
    const client = twilio(twilioAccountSid, twilioAuthToken);

    // ทดสอบการเชื่อมต่อและตรวจสอบยอดเงิน
    try {
      console.log("🔍 Testing Twilio connection...");

      // ตรวจสอบ account balance
      const balance = await client.balance.fetch();
      console.log("💰 Account Balance:", balance.balance, balance.currency);

      // ตรวจสอบ account info
      const account = await client.api.accounts(twilioAccountSid).fetch();
      console.log("📋 Account Status:", account.status);
      console.log("📋 Account Type:", account.type);

      const testResult: TwilioTestResult = {
        connection: "✅ SUCCESS",
        balance: `${balance.balance} ${balance.currency}`,
        accountStatus: account.status,
        accountType: account.type,
        smsTest: null,
        verifyTest: null,
      };

      // ทดสอบส่ง SMS ธรรมดา (ถ้ามีเบอร์ทดสอบ)
      const phoneToTest = phone || testPhone;
      if (phoneToTest && twilioPhoneNumber) {
        try {
          console.log("📱 Testing SMS send to:", phoneToTest);
          const smsMessage =
            message || "🧪 Test SMS from TedIn Easy - Twilio is working!";
          const messageResponse = await client.messages.create({
            body: smsMessage,
            from: twilioPhoneNumber,
            to: phoneToTest,
          });

          testResult.smsTest = {
            status: "✅ SUCCESS",
            messageSid: messageResponse.sid,
            status_detail: messageResponse.status,
          };
          console.log("✅ SMS sent successfully:", messageResponse.sid);
        } catch (smsError: unknown) {
          console.error("❌ SMS test failed:", extractErrorMessage(smsError));
          testResult.smsTest = {
            status: "❌ FAILED",
            error: extractErrorMessage(smsError),
            code: extractErrorCode(smsError),
          };
        }
      }

      // ทดสอบ Verify Service (OTP)
      if (phoneToTest && twilioVerifySid) {
        try {
          console.log("🔐 Testing Verify Service (OTP) to:", phoneToTest);
          const verification = await client.verify.v2
            .services(twilioVerifySid)
            .verifications.create({
              to: phoneToTest,
              channel: "sms",
            });

          testResult.verifyTest = {
            status: "✅ SUCCESS",
            verificationSid: verification.sid,
            status_detail: verification.status,
          };
          console.log("✅ OTP sent successfully:", verification.sid);
        } catch (verifyError: unknown) {
          console.error(
            "❌ Verify test failed:",
            extractErrorMessage(verifyError)
          );
          testResult.verifyTest = {
            status: "❌ FAILED",
            error: extractErrorMessage(verifyError),
            code: extractErrorCode(verifyError),
          };
        }
      }

      return NextResponse.json({
        success: true,
        message: "Twilio test completed",
        results: testResult,
      });
    } catch (connectionError: unknown) {
      console.error(
        "❌ Twilio connection failed:",
        extractErrorMessage(connectionError)
      );

      return NextResponse.json(
        {
          success: false,
          error: "Twilio connection failed",
          details: {
            message: extractErrorMessage(connectionError),
            code: extractErrorCode(connectionError),
            status:
              typeof connectionError === "object" &&
              connectionError !== null &&
              "status" in connectionError
                ? (connectionError as { status?: string | number }).status
                : undefined,
          },
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("❌ Test Twilio API error:", extractErrorMessage(error));
    return NextResponse.json(
      {
        success: false,
        error: "API error",
        message: extractErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Twilio Test API - Use POST with { testPhone: '+66812345678' }",
  });
}
