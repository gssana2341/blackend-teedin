import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendSuccess, sendError } from '../lib/http-helpers';

// Get dashboard stats
export async function getDashboardStats(req: Request, res: Response) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // เรียกใช้ function เพื่อดึงสถิติ
    const { data: stats, error: statsError } = await supabase.rpc(
      "get_dashboard_stats"
    );

    if (statsError) {
      throw statsError;
    }

    // ดึงข้อมูลล่าสุด
    const { data: recentUsers } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: pendingAgents } = await supabase
      .from("v_pending_approvals")
      .select("id, type, ref_id, created_at, status")
      .eq("type", "agent")
      .limit(5);

    const { data: pendingProperties } = await supabase
      .from("v_pending_approvals")
      .select("id, type, ref_id, created_at, status")
      .eq("type", "property")
      .limit(5);

    return sendSuccess(res, {
      stats,
      recent_users: recentUsers || [],
      pending_agents: pendingAgents || [],
      pending_properties: pendingProperties || [],
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return sendError(res, "Internal Server Error", 500);
  }
}

// Get all users
export async function getUsers(req: Request, res: Response) {
  try {
    const { role = 'all', page = '1', limit = '10', search = '' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from("users")
      .select(
        "id, email, first_name, last_name, role, phone, created_at, updated_at",
        { count: "exact" }
      );

    // Filter by role
    if (role !== "all") {
      query = query.eq("role", role);
    }

    // Search filter
    if (search) {
      query = query.or(
        `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`
      );
    }

    // Pagination
    query = query.range(offset, offset + limitNum - 1);

    // Order by created_at desc
    query = query.order("created_at", { ascending: false });

    const { data: users, error, count } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      return sendError(res, "Failed to fetch users", 500);
    }

    return sendSuccess(res, {
      users: users || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        pages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Get all properties (admin view)
export async function getAdminProperties(req: Request, res: Response) {
  try {
    const { status = 'all', page = '1', limit = '10', search = '' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from("properties")
      .select(
        `
        *,
        property_details (
          project_name,
          address,
          price,
          status
        ),
        users:users!properties_agent_id_fkey (
          id,
          first_name,
          last_name,
          email
        )
      `,
        { count: "exact" }
      );

    // Filter by status
    if (status !== "all") {
      query = query.eq("property_details.status", status);
    }

    // Search filter
    if (search) {
      query = query.or(
        `property_details.project_name.ilike.%${search}%,property_details.address.ilike.%${search}%`
      );
    }

    // Pagination
    query = query.range(offset, offset + limitNum - 1);

    // Order by created_at desc
    query = query.order("created_at", { ascending: false });

    const { data: properties, error, count } = await query;

    if (error) {
      console.error("Error fetching properties:", error);
      return sendError(res, "Failed to fetch properties", 500);
    }

    return sendSuccess(res, {
      properties: properties || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        pages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (error) {
    console.error("Error in getAdminProperties:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Get admin stats
export async function getAdminStats(req: Request, res: Response) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get recent properties
    const { data: recentProperties } = await supabase
      .from("properties")
      .select(`
        id,
        status,
        created_at,
        agent_id,
        users:users!properties_agent_id_fkey (
          first_name,
          last_name,
          email
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5);

    // Get recent agents
    const { data: recentAgents } = await supabase
      .from("users")
      .select("id, first_name, last_name, email, created_at")
      .eq("role", "agent")
      .order("created_at", { ascending: false })
      .limit(5);

    // Get recent activity (simplified)
    const { data: recentActivity } = await supabase
      .from("users")
      .select("id, first_name, last_name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    return sendSuccess(res, {
      recent_properties: recentProperties || [],
      recent_agents: recentAgents || [],
      recent_activity: recentActivity || [],
    });
  } catch (error) {
    console.error("Error in getAdminStats:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Get admin agents
export async function getAdminAgents(req: Request, res: Response) {
  try {
    const { status = 'all', page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from("agens")
      .select(`
        user_id,
        company_name,
        license_number,
        business_license_id,
        address,
        property_types,
        service_areas,
        status,
        created_at,
        updated_at,
        approved_by,
        approved_at,
        rejection_reason,
        users!inner(
          email,
          first_name,
          last_name,
          phone
        )
      `, { count: "exact" });

    // Filter by status
    if (status !== "all") {
      query = query.eq("status", status);
    }

    // Pagination
    query = query.range(offset, offset + limitNum - 1);
    query = query.order("created_at", { ascending: false });

    const { data: agents, error, count } = await query;

    if (error) {
      console.error("Error fetching agents:", error);
      return sendError(res, "Failed to fetch agents", 500);
    }

    return sendSuccess(res, {
      agents: agents || [],
      total: count || 0,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil((count || 0) / limitNum),
    });
  } catch (error) {
    console.error("Error in getAdminAgents:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Approve/reject agent
export async function updateAgentStatus(req: Request, res: Response) {
  try {
    const { agentUserId, status, rejectionReason } = req.body;

    if (!agentUserId || !status) {
      return sendError(res, "Agent ID and status are required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // เรียกใช้ function เพื่ออนุมัติเอเจนท์
    const { error } = await supabase.rpc("approve_agent", {
      agent_user_id: agentUserId,
      admin_user_id: req.user?.id,
      approval_status: status,
    });

    if (error) {
      console.error("Error approving agent:", error);
      return sendError(res, "Failed to update agent status", 500);
    }

    // อัปเดต rejection_reason ถ้ามี
    if (status === "rejected" && rejectionReason) {
      await supabase
        .from("agens")
        .update({ rejection_reason: rejectionReason })
        .eq("user_id", agentUserId);
    }

    return sendSuccess(res, { success: true });
  } catch (error) {
    console.error("Error in updateAgentStatus:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Get admin announcements
export async function getAdminAnnouncements(req: Request, res: Response) {
  try {
    const { status = 'all', page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from("system_announcements")
      .select("*", { count: "exact" });

    // Filter by status
    if (status !== "all") {
      query = query.eq("status", status);
    }

    // Pagination
    query = query.range(offset, offset + limitNum - 1);
    query = query.order("created_at", { ascending: false });

    const { data: announcements, error, count } = await query;

    if (error) {
      console.error("Error fetching announcements:", error);
      return sendError(res, "Failed to fetch announcements", 500);
    }

    return sendSuccess(res, {
      announcements: announcements || [],
      total: count || 0,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil((count || 0) / limitNum),
    });
  } catch (error) {
    console.error("Error in getAdminAnnouncements:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Create announcement
export async function createAnnouncement(req: Request, res: Response) {
  try {
    const {
      title,
      content,
      type,
      status,
      target_audience,
      start_date,
      end_date,
    } = req.body;

    if (!title || !content) {
      return sendError(res, "Title and content are required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("system_announcements")
      .insert({
        title,
        content,
        type: type || "general",
        status: status || "draft",
        target_audience: target_audience || "all",
        start_date,
        end_date,
        created_by: req.user?.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating announcement:", error);
      return sendError(res, "Failed to create announcement", 500);
    }

    // บันทึก log
    await supabase.from("admin_logs").insert({
      admin_id: req.user?.id,
      action: "CREATE_ANNOUNCEMENT",
      target_type: "announcement",
      target_id: data.id,
      details: { title, type, status },
    });

    return sendSuccess(res, data);
  } catch (error) {
    console.error("Error in createAnnouncement:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Update announcement
export async function updateAnnouncement(req: Request, res: Response) {
  try {
    const {
      id,
      title,
      content,
      type,
      status,
      target_audience,
      start_date,
      end_date,
    } = req.body;

    if (!id) {
      return sendError(res, "Announcement ID is required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("system_announcements")
      .update({
        title,
        content,
        type,
        status,
        target_audience,
        start_date,
        end_date,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating announcement:", error);
      return sendError(res, "Failed to update announcement", 500);
    }

    // บันทึก log
    await supabase.from("admin_logs").insert({
      admin_id: req.user?.id,
      action: "UPDATE_ANNOUNCEMENT",
      target_type: "announcement",
      target_id: id,
      details: { title, type, status },
    });

    return sendSuccess(res, data);
  } catch (error) {
    console.error("Error in updateAnnouncement:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Delete announcement
export async function deleteAnnouncement(req: Request, res: Response) {
  try {
    const { id } = req.body;

    if (!id) {
      return sendError(res, "Announcement ID is required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("system_announcements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting announcement:", error);
      return sendError(res, "Failed to delete announcement", 500);
    }

    // บันทึก log
    await supabase.from("admin_logs").insert({
      admin_id: req.user?.id,
      action: "DELETE_ANNOUNCEMENT",
      target_type: "announcement",
      target_id: id,
      details: { deleted_by: req.user?.id },
    });

    return sendSuccess(res, { success: true });
  } catch (error) {
    console.error("Error in deleteAnnouncement:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Get admin settings
export async function getAdminSettings(req: Request, res: Response) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: settings, error } = await supabase
      .from("system_settings")
      .select("*");

    if (error) {
      console.error("Error fetching settings:", error);
      return sendError(res, "Failed to fetch settings", 500);
    }

    return sendSuccess(res, settings || []);
  } catch (error) {
    console.error("Error in getAdminSettings:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Update admin settings
export async function updateAdminSettings(req: Request, res: Response) {
  try {
    const { settings } = req.body;

    if (!settings || !Array.isArray(settings)) {
      return sendError(res, "Settings array is required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update each setting
    for (const setting of settings) {
      const { error } = await supabase
        .from("system_settings")
        .upsert({
          key: setting.key,
          value: setting.value,
          updated_by: req.user?.id,
        });

      if (error) {
        console.error("Error updating setting:", error);
        return sendError(res, "Failed to update settings", 500);
      }
    }

    return sendSuccess(res, { success: true });
  } catch (error) {
    console.error("Error in updateAdminSettings:", error);
    return sendError(res, "Internal server error", 500);
  }
}
