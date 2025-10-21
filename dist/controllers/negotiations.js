"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPriceNegotiations = getPriceNegotiations;
exports.createPriceNegotiation = createPriceNegotiation;
exports.updatePriceNegotiation = updatePriceNegotiation;
const supabase_js_1 = require("@supabase/supabase-js");
const http_helpers_1 = require("../lib/http-helpers");
// Get price negotiations
async function getPriceNegotiations(req, res) {
    try {
        const { property_id, status, limit = '10' } = req.query;
        const limitNum = parseInt(limit);
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        let query = supabase
            .from("price_negotiations")
            .select(`
        *,
        properties(id, title, address, price),
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
            console.error("Get price negotiations error:", error);
            return (0, http_helpers_1.sendError)(res, "Failed to fetch price negotiations: " + error.message, 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, data || []);
    }
    catch (error) {
        console.error("Error in getPriceNegotiations:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Create price negotiation
async function createPriceNegotiation(req, res) {
    try {
        const { property_id, original_price, offered_price, negotiation_reason, customer_name, customer_phone, customer_email, } = req.body;
        if (!property_id ||
            !original_price ||
            !offered_price ||
            !customer_name ||
            !customer_phone) {
            return (0, http_helpers_1.sendError)(res, "Missing required fields: property_id, original_price, offered_price, customer_name, customer_phone", 400);
        }
        // ตรวจสอบว่าราคาที่เสนอเป็นตัวเลขที่ถูกต้อง
        const originalPriceNum = parseFloat(original_price);
        const offeredPriceNum = parseFloat(offered_price);
        if (isNaN(originalPriceNum) || isNaN(offeredPriceNum)) {
            return (0, http_helpers_1.sendError)(res, "Invalid price values", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        // หาเอเจ้นท์ที่รับผิดชอบทรัพย์สินนี้
        const { data: propertyData } = await supabase
            .from("properties")
            .select("agent_id, title")
            .eq("id", property_id)
            .single();
        // สร้างการต่อรองราคา
        const { data, error } = await supabase
            .from("price_negotiations")
            .insert({
            property_id,
            agent_id: propertyData?.agent_id || null,
            original_price: originalPriceNum,
            offered_price: offeredPriceNum,
            negotiation_reason,
            customer_name,
            customer_phone,
            customer_email,
            status: "pending",
        })
            .select()
            .single();
        if (error) {
            console.error("Price negotiation creation error:", error);
            return (0, http_helpers_1.sendError)(res, "Failed to create price negotiation: " + error.message, 500);
        }
        // ส่งการแจ้งเตือนไปยังเอเจ้นท์
        if (propertyData?.agent_id) {
            // TODO: ส่งอีเมลหรือ SMS แจ้งเตือนเอเจ้นท์
            console.log(`New price negotiation for agent ${propertyData.agent_id}:`, {
                property: propertyData.title,
                original_price: originalPriceNum,
                offered_price: offeredPriceNum,
                customer: customer_name,
            });
        }
        return (0, http_helpers_1.sendSuccess)(res, {
            data: data,
            message: "คำขอต่อรองราคาได้รับการบันทึกเรียบร้อยแล้ว เอเจ้นท์จะพิจารณาและติดต่อกลับ",
        });
    }
    catch (error) {
        console.error("Error in createPriceNegotiation:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
// Update price negotiation
async function updatePriceNegotiation(req, res) {
    try {
        const { id } = req.params;
        const { status, admin_notes } = req.body;
        if (!id) {
            return (0, http_helpers_1.sendError)(res, "Negotiation ID is required", 400);
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data, error } = await supabase
            .from("price_negotiations")
            .update({
            status,
            admin_notes,
        })
            .eq("id", id)
            .select()
            .single();
        if (error) {
            console.error("Error updating price negotiation:", error);
            return (0, http_helpers_1.sendError)(res, "Failed to update price negotiation", 500);
        }
        return (0, http_helpers_1.sendSuccess)(res, data);
    }
    catch (error) {
        console.error("Error in updatePriceNegotiation:", error);
        return (0, http_helpers_1.sendError)(res, "Internal server error", 500);
    }
}
//# sourceMappingURL=negotiations.js.map