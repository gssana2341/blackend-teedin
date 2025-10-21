import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendSuccess, sendError } from '../lib/http-helpers';

// Get appointments
export async function getAppointments(req: Request, res: Response) {
  try {
    const { property_id, status, limit = '10' } = req.query;
    const limitNum = parseInt(limit as string);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from("appointments")
      .select(`
        *,
        properties(id, title, address),
        agens(user_id, company_name)
      `)
      .order("created_at", { ascending: false })
      .limit(limitNum);

    if (property_id) {
      query = query.eq("property_id", property_id);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get appointments error:", error);
      return sendError(res, "Failed to fetch appointments: " + error.message, 500);
    }

    return sendSuccess(res, data || []);
  } catch (error) {
    console.error("Error in getAppointments:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Create appointment
export async function createAppointment(req: Request, res: Response) {
  try {
    const { property_id, appointment_date, notes } = req.body;

    if (!property_id || !appointment_date) {
      return sendError(res, "Missing required fields: property_id, appointment_date", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // หาเอเจ้นท์ที่รับผิดชอบทรัพย์สินนี้ (หากมี)
    const { data: propertyData } = await supabase
      .from("properties")
      .select("agent_id")
      .eq("id", property_id)
      .single();

    // สร้างการนัดหมาย
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        property_id,
        agent_id: propertyData?.agent_id,
        appointment_date,
        customer_id: null, // ถ้าไม่มี customer_id ให้เป็น null
        notes,
      })
      .select()
      .single();

    if (error) {
      console.error("Appointment creation error:", error);
      return sendError(res, "Failed to create appointment: " + error.message, 500);
    }

    // ส่งการแจ้งเตือนไปยังเอเจ้นท์ (ถ้ามี)
    if (propertyData?.agent_id) {
      // TODO: ส่งอีเมลหรือ SMS แจ้งเตือนเอเจ้นท์
      console.log(`New appointment for agent ${propertyData.agent_id}:`, data);
    }

    return sendSuccess(res, {
      data: data,
      message: "นัดหมายได้รับการบันทึกเรียบร้อยแล้ว เอเจ้นท์จะติดต่อกลับในเร็วๆ นี้",
    });
  } catch (error) {
    console.error("Error in createAppointment:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Update appointment
export async function updateAppointment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { appointment_date, notes, status } = req.body;

    if (!id) {
      return sendError(res, "Appointment ID is required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("appointments")
      .update({
        appointment_date,
        notes,
        status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating appointment:", error);
      return sendError(res, "Failed to update appointment", 500);
    }

    return sendSuccess(res, data);
  } catch (error) {
    console.error("Error in updateAppointment:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Delete appointment
export async function deleteAppointment(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, "Appointment ID is required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting appointment:", error);
      return sendError(res, "Failed to delete appointment", 500);
    }

    return sendSuccess(res, { success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAppointment:", error);
    return sendError(res, "Internal server error", 500);
  }
}
