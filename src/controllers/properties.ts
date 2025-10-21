import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendSuccess, sendError } from '../lib/http-helpers';

// Get all properties
export async function getProperties(req: Request, res: Response) {
  try {
    console.log('📋 Getting all properties...');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        *,
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
          view_count,
          status,
          created_at
        ),
        users:users!properties_agent_id_fkey (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      return sendError(res, 'Failed to fetch properties', 500);
    }

    return sendSuccess(res, properties || []);
  } catch (error) {
    console.error('Error in getProperties:', error);
    return sendError(res, 'Internal server error', 500);
  }
}

// Get property by ID
export async function getPropertyById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: property, error } = await supabase
      .from("properties")
      .select(`
        *,
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
          longitude
        ),
        users:users!properties_agent_id_fkey (
          id,
          first_name,
          last_name
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching property:", error);
      return sendError(res, "Failed to fetch property details", 500);
    }

    if (!property) {
      return sendError(res, "Property not found", 404);
    }

    // Transform the data to match the expected format
    const transformedProperty = {
      property_id: property.id,
      project_name: property.property_details?.project_name || property.property_category,
      address: property.property_details?.address || "",
      usable_area: property.property_details?.usable_area || 0,
      bedrooms: property.property_details?.bedrooms || 0,
      bathrooms: property.property_details?.bathrooms || 0,
      parking_spaces: property.property_details?.parking_spaces || 0,
      house_condition: property.property_details?.house_condition || "",
      highlight: property.property_details?.highlight || "",
      area_around: property.property_details?.area_around || "",
      facilities: property.property_details?.facilities || [],
      project_facilities: property.property_details?.project_facilities || [],
      description: property.property_details?.description || "",
      price: property.property_details?.price?.toString() || "0",
      images: property.property_details?.images || [],
      latitude: property.property_details?.latitude,
      longitude: property.property_details?.longitude,
      agent: property.users
        ? {
            id: property.users.id,
            first_name: property.users.first_name,
            last_name: property.users.last_name,
            profile_picture: undefined,
          }
        : null,
    };

    return sendSuccess(res, transformedProperty);
  } catch (error) {
    console.error("Error in getPropertyById:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Create new property
export async function createProperty(req: Request, res: Response) {
  try {
    const { agentId, propertyData, propertyDetails } = req.body;

    if (!agentId || !propertyData || !propertyDetails) {
      return sendError(res, "Missing required fields", 400);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Validate agent exists
    const { data: agent, error: agentError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", agentId)
      .eq("role", "agent")
      .single();

    if (agentError || !agent) {
      return sendError(res, "Invalid agent ID", 400);
    }

    // Start transaction by creating property first
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .insert({
        agent_id: agentId,
        listing_type: propertyData.listing_type,
        property_category: propertyData.property_category,
        in_project: propertyData.in_project || false,
        rental_duration: propertyData.rental_duration,
        location: propertyData.location || {},
      })
      .select()
      .single();

    if (propertyError) {
      console.error("Error creating property:", propertyError);
      return sendError(res, "Failed to create property: " + propertyError.message, 500);
    }

    // Create property details
    const { data: details, error: detailsError } = await supabase
      .from("property_details")
      .insert({
        property_id: property.id,
        project_name: propertyDetails.project_name,
        address: propertyDetails.address,
        usable_area: propertyDetails.usable_area,
        bedrooms: propertyDetails.bedrooms,
        bathrooms: propertyDetails.bathrooms,
        parking_spaces: propertyDetails.parking_spaces,
        house_condition: propertyDetails.house_condition,
        highlight: propertyDetails.highlight,
        area_around: propertyDetails.area_around,
        facilities: propertyDetails.facilities || [],
        project_facilities: propertyDetails.project_facilities || [],
        description: propertyDetails.description,
        price: propertyDetails.price,
        images: propertyDetails.images || [],
        latitude: propertyDetails.latitude,
        longitude: propertyDetails.longitude,
        view_count: 0,
      })
      .select()
      .single();

    if (detailsError) {
      console.error("Error creating property details:", detailsError);

      // Rollback - delete the property
      await supabase.from("properties").delete().eq("id", property.id);

      return sendError(res, "Failed to create property details: " + detailsError.message, 500);
    }

    // Return the created property with details in the new format
    const responseData = {
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

    return sendSuccess(res, responseData, 201);
  } catch (error) {
    console.error("Error in createProperty:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Get similar properties
export async function getSimilarProperties(req: Request, res: Response) {
  try {
    const { location, excludeId, limit = '5' } = req.query;
    const limitNum = parseInt(limit as string);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from("properties")
      .select(`
        id,
        property_category,
        rent_duration,
        view_count,
        listing_type,
        property_details (
          property_id,
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
          view_count,
          status,
          created_at
        ),
        users:users!properties_agent_id_fkey (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .limit(limitNum);

    // Exclude current property
    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    // Try to match by location first
    if (location && location.toString().trim() !== "") {
      const { data: locationData, error: locationError } = await query.eq(
        "property_details.address",
        location
      );

      if (!locationError && locationData && locationData.length > 0) {
        return sendSuccess(res, locationData);
      }

      // If no exact location match, try partial location match
      const { data: partialLocationData, error: partialError } =
        await query.ilike("property_details.address", `%${location}%`);

      if (
        !partialError &&
        partialLocationData &&
        partialLocationData.length > 0
      ) {
        return sendSuccess(res, partialLocationData);
      }
    }

    // Fallback: get any properties except the current one
    const { data: fallbackData, error: fallbackError } = await query;

    if (fallbackError) {
      console.error("Error fetching fallback properties:", fallbackError);
      return sendError(res, "Failed to fetch properties", 500);
    }

    return sendSuccess(res, fallbackData || []);
  } catch (error) {
    console.error("Error in getSimilarProperties:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Get properties (variant)
export async function getPropertiesVariant(req: Request, res: Response) {
  try {
    const { location, category, limit = '10' } = req.query;
    const limitNum = parseInt(limit as string);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from("properties")
      .select(`
        *,
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
          view_count,
          status,
          created_at
        ),
        users:users!properties_agent_id_fkey (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .limit(limitNum);

    if (location) {
      query = query.ilike("property_details.address", `%${location}%`);
    }

    if (category) {
      query = query.eq("property_category", category);
    }

    const { data: properties, error } = await query;

    if (error) {
      console.error("Error fetching properties:", error);
      return sendError(res, "Failed to fetch properties", 500);
    }

    return sendSuccess(res, properties || []);
  } catch (error) {
    console.error("Error in getPropertiesVariant:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Get property by ID (variant)
export async function getPropertyByIdVariant(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: property, error } = await supabase
      .from("properties")
      .select(`
        *,
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
          longitude
        ),
        users:users!properties_agent_id_fkey (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching property:", error);
      return sendError(res, "Failed to fetch property", 500);
    }

    if (!property) {
      return sendError(res, "Property not found", 404);
    }

    return sendSuccess(res, property);
  } catch (error) {
    console.error("Error in getPropertyByIdVariant:", error);
    return sendError(res, "Internal server error", 500);
  }
}

// Get static properties
export async function getStaticProperties(req: Request, res: Response) {
  try {
    // This would return static properties for build time
    // For now, return empty array as placeholder
    return sendSuccess(res, {
      properties: [],
      count: 0,
      source: "static",
    });
  } catch (error) {
    console.error("Error in getStaticProperties:", error);
    return sendError(res, "Internal server error", 500);
  }
}
