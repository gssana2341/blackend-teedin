import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const email = (payload?.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "ต้องระบุ email" }, { status: 400 });
    }

    // ตรวจสอบเฉพาะอีเมลซ้ำเท่านั้น (อนุญาตให้ใช้เบอร์เดิมได้)
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .ilike("email", email); // case-insensitive exact match

    if (error) {
      console.error("Error checking email exists:", error);
      return NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการตรวจสอบอีเมล" },
        { status: 500 }
      );
    }

    const exists = !!(data && data.length > 0);

    if (exists) {
      return NextResponse.json({
        exists: true,
        message: "อีเมลนี้มีอยู่ในระบบแล้ว กรุณาเข้าสู่ระบบแทน",
      });
    }

    return NextResponse.json({
      exists: false,
      message: "สามารถสมัครสมาชิกได้",
    });
  } catch (error) {
    console.error("Error in check-user-exists:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการตรวจสอบข้อมูล" },
      { status: 500 }
    );
  }
}
