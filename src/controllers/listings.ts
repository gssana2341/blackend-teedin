import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendSuccess, sendError } from '../lib/http-helpers';

// Get my listings
export async function getMyListings(req: Request, res: Response) {
  try {
    const { agentId, search } = req.query;

    if (!agentId) {
      return sendError(res, "Agent ID is required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from("properties")
      .select(`
        id,
        listing_type,
        property_category,
        in_project,
        rental_duration,
        location,
        created_at,
        property_details (
          project_name,
          address,
          usable_area,
          bedrooms,
          bathrooms,
          parking_spaces,
          house_condition,
          highlight,
          area_around,
          facilities,
          project_facilities,
          description,
          price,
          images,
          latitude,
          longitude,
          view_count
        )
      `)
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false });

    // Filter by search term if provided
    if (search) {
      query = query.or(
        `property_details.project_name.ilike.%${search}%,property_details.address.ilike.%${search}%`
      );
    }

    const { data: properties, error } = await query;

    if (error) {
      console.error("Error fetching properties:", error);
      return sendError(res, "Failed to fetch properties", 500);
    }

    // Transform data to match frontend expectations
    const transformedProperties = properties
      ?.map(property => {
        const details = property.property_details?.[0]; // Access first element of array
        if (!details) return null;

        return {
          id: property.id,
          listing_type: property.listing_type || [],
          property_category: property.property_category || "ไม่ระบุ",
          project_name: details.project_name || "ไม่ระบุชื่อโครงการ",
          address: details.address || "ไม่ระบุที่อยู่",
          usable_area: details.usable_area || 0,
          bedrooms: details.bedrooms || 0,
          bathrooms: details.bathrooms || 0,
          parking_spaces: details.parking_spaces || 0,
          price: details.price || 0,
          house_condition: details.house_condition || "",
          highlight: details.highlight || "",
          description: details.description || "",
          images: Array.isArray(details.images)
            ? details.images
            : details.images
              ? [details.images]
              : [],
          created_at: property.created_at,
          agent_id: (property as any).agent_id,
        };
      })
      .filter(Boolean);

    return sendSuccess(res, transformedProperties);
  } catch (error) {
    console.error("Error in getMyListings:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Delete listing
export async function deleteListing(req: Request, res: Response) {
  try {
    const { propertyId, agentId } = req.query;

    if (!propertyId || !agentId) {
      return sendError(res, "Property ID and Agent ID are required", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify that the property belongs to the agent
    const { data: property, error: fetchError } = await supabase
      .from("properties")
      .select("agent_id")
      .eq("id", propertyId)
      .single();

    if (fetchError || !property) {
      return sendError(res, "Property not found", 404);
    }

    if (property.agent_id !== agentId) {
      return sendError(res, "Unauthorized to delete this property", 403);
    }

    // Delete property (property_details will be deleted automatically due to foreign key constraint)
    const { error: deleteError } = await supabase
      .from("properties")
      .delete()
      .eq("id", propertyId);

    if (deleteError) {
      console.error("Error deleting property:", deleteError);
      return sendError(res, "Failed to delete property", 500);
    }

    return sendSuccess(res, {
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteListing:", error);
    return sendError(res, "Internal server error", 500);
  }
}
