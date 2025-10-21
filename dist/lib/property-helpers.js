"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPropertyWithRelations = exports.mapPropertyDetailRow = exports.getPrimaryDetail = exports.toCleanStringArray = void 0;
const PLACEHOLDER_IMAGE = "/placeholder.svg";
const toCleanStringArray = (value) => {
    if (!value) {
        return [];
    }
    if (Array.isArray(value)) {
        return value
            .filter((item) => typeof item === "string")
            .map(item => item.trim())
            .filter(Boolean);
    }
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) {
            return [];
        }
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return (0, exports.toCleanStringArray)(parsed);
            }
        }
        catch {
            // fall through to manual parsing
        }
        const stripped = trimmed.replace(/[\{\}\[\]"]/g, "");
        const parts = stripped
            .split(",")
            .map(part => part.trim())
            .filter(Boolean);
        if (parts.length > 0) {
            return parts;
        }
        return [trimmed];
    }
    return [];
};
exports.toCleanStringArray = toCleanStringArray;
const getPrimaryDetail = (details) => {
    if (!details) {
        return undefined;
    }
    if (Array.isArray(details)) {
        return details[0];
    }
    return details;
};
exports.getPrimaryDetail = getPrimaryDetail;
const deriveListingTypes = (listingTypeSource, status) => {
    const listingTypes = (0, exports.toCleanStringArray)(listingTypeSource).map(type => type.toLowerCase());
    const statusLower = (status ?? "").toLowerCase();
    const isForRent = listingTypes.some(type => type.includes("rent") || type.includes("เช่า")) ||
        ["for_rent", "rent", "เช่า"].includes(statusLower);
    const isForSale = listingTypes.some(type => type.includes("sale") || type.includes("ขาย")) ||
        ["for_sale", "sale", "ขาย"].includes(statusLower);
    return {
        listingTypes,
        isForRent,
        isForSale,
    };
};
const ensureImages = (images) => {
    const list = (0, exports.toCleanStringArray)(images);
    return list.length > 0 ? list : [PLACEHOLDER_IMAGE];
};
const formatPriceTHB = (value) => {
    if (!Number.isFinite(value)) {
        return "0 ฿";
    }
    return `${value.toLocaleString("th-TH")} ฿`;
};
const extractAgent = (agentInput) => {
    if (!agentInput) {
        return null;
    }
    if (Array.isArray(agentInput)) {
        return extractAgent(agentInput[0]);
    }
    return {
        id: agentInput.id,
        first_name: agentInput.first_name,
        last_name: agentInput.last_name,
        profile_picture: agentInput.profile_picture,
        email: agentInput.email,
    };
};
const buildPropertyData = (id, detail, listingSource, status, overrides) => {
    const listingMeta = deriveListingTypes(listingSource, status);
    const images = ensureImages(detail.images);
    const numericPrice = typeof detail.price === "number" ? detail.price : 0;
    return {
        id,
        property_id: detail.property_id || id,
        title: detail.project_name || detail.description || "ไม่ระบุชื่อโครงการ",
        location: detail.address || "ไม่ระบุที่อยู่",
        price: formatPriceTHB(numericPrice),
        numericPrice,
        isPricePerMonth: listingMeta.isForRent,
        details: {
            area: detail.usable_area ?? 0,
            bedrooms: detail.bedrooms ?? 0,
            bathrooms: detail.bathrooms ?? 0,
            parking: detail.parking_spaces ?? 0,
        },
        image: images[0] ?? PLACEHOLDER_IMAGE,
        images,
        listingTypes: listingMeta.listingTypes,
        isForRent: listingMeta.isForRent,
        isForSale: listingMeta.isForSale,
        isTopPick: false,
        description: detail.description || "ไม่มีคำอธิบาย",
        highlight: detail.highlight || "ไม่มีข้อมูลไฮไลท์",
        facilities: (0, exports.toCleanStringArray)(detail.facilities),
        projectFacilities: (0, exports.toCleanStringArray)(detail.project_facilities),
        viewCount: overrides?.viewCount ?? detail.view_count ?? 0,
        houseCondition: detail.house_condition || "ไม่ระบุ",
        createdAt: detail.created_at ?? undefined,
        status: status ?? undefined,
        usable_area: detail.usable_area ?? 0,
        parking_spaces: detail.parking_spaces ?? 0,
        latitude: detail.latitude ?? undefined,
        longitude: detail.longitude ?? undefined,
        area_around: detail.area_around || "ไม่มีข้อมูลพื้นที่ใกล้เคียง",
        agent: overrides?.agent ?? null,
    };
};
const mapPropertyDetailRow = (row) => {
    const detail = row;
    const propertiesListing = row.properties?.listing_type;
    return buildPropertyData(row.property_id, detail, propertiesListing, row.status);
};
exports.mapPropertyDetailRow = mapPropertyDetailRow;
const transformPropertyWithRelations = (property) => {
    const detail = (0, exports.getPrimaryDetail)(property.property_details) ??
        {
            property_id: property.id,
            project_name: property.property_category,
            address: null,
            usable_area: null,
            bedrooms: null,
            bathrooms: null,
            parking_spaces: null,
            latitude: null,
            longitude: null,
            house_condition: null,
            highlight: null,
            area_around: null,
            description: null,
            facilities: null,
            project_facilities: null,
            images: null,
            price: null,
            view_count: property.view_count,
            status: null,
            created_at: null,
            properties: null,
        };
    const listingSource = property.listing_type ?? detail.properties?.listing_type;
    return buildPropertyData(property.id, detail, listingSource, detail.status, {
        viewCount: property.view_count ?? detail.view_count ?? 0,
        agent: extractAgent(property.users),
    });
};
exports.transformPropertyWithRelations = transformPropertyWithRelations;
//# sourceMappingURL=property-helpers.js.map