import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agentId");
    const search = searchParams.get("search");

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    let query = supabase
      .from("properties")
      .select(
        `
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
      `
      )
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
      return NextResponse.json(
        { error: "Failed to fetch properties" },
        { status: 500 }
      );
    } // Transform data to match frontend expectations
    const transformedProperties = properties
      ?.map(property => {
        const details = property.property_details;
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
          agent_id: property.agent_id,
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      data: transformedProperties,
    });
  } catch (error) {
    console.error("Error in my-listings API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const agentId = searchParams.get("agentId");

    if (!propertyId || !agentId) {
      return NextResponse.json(
        { error: "Property ID and Agent ID are required" },
        { status: 400 }
      );
    }

    // Verify that the property belongs to the agent
    const { data: property, error: fetchError } = await supabase
      .from("properties")
      .select("agent_id")
      .eq("id", propertyId)
      .single();

    if (fetchError || !property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (property.agent_id !== agentId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this property" },
        { status: 403 }
      );
    }

    // Delete property (property_details will be deleted automatically due to foreign key constraint)
    const { error: deleteError } = await supabase
      .from("properties")
      .delete()
      .eq("id", propertyId);

    if (deleteError) {
      console.error("Error deleting property:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete property" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE my-listings API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
