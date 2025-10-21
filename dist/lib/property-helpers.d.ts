import type { ReactNode } from "react";
export type NullableString = string | null | undefined;
export type StringArrayInput = string[] | string | null | undefined;
export interface PropertyDetailRow {
    property_id: string;
    project_name: NullableString;
    address: NullableString;
    usable_area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    parking_spaces: number | null;
    latitude: number | null;
    longitude: number | null;
    house_condition: NullableString;
    highlight: NullableString;
    area_around: NullableString;
    description: NullableString;
    facilities: StringArrayInput;
    project_facilities: StringArrayInput;
    images: StringArrayInput;
    price: number | null;
    view_count: number | null;
    status: NullableString;
    created_at: NullableString;
    properties?: {
        listing_type: StringArrayInput;
    } | null;
}
export interface PropertyAgentRow {
    id: string;
    first_name?: NullableString;
    last_name?: NullableString;
    email?: NullableString;
    profile_picture?: NullableString;
}
export interface PropertyWithRelations {
    id: string;
    property_category: NullableString;
    rent_duration: NullableString;
    view_count: number | null;
    listing_type?: string[] | null;
    property_details: PropertyDetailRow[] | PropertyDetailRow | null;
    users?: PropertyAgentRow | PropertyAgentRow[] | null;
}
export interface PropertyDetails {
    area: number;
    bedrooms: number;
    bathrooms: number;
    parking: number;
}
export interface PropertyData {
    id: string;
    property_id: string;
    title: string;
    location: string;
    price: string;
    numericPrice: number;
    isPricePerMonth: boolean;
    details: PropertyDetails;
    image: string;
    images: string[];
    listingTypes: string[];
    isForRent: boolean;
    isForSale: boolean;
    isTopPick: boolean;
    description: string;
    highlight: string;
    facilities: string[];
    projectFacilities: string[];
    viewCount: number;
    houseCondition: string;
    createdAt?: string;
    status?: string;
    usable_area: number;
    parking_spaces: number;
    latitude?: number;
    longitude?: number;
    area_around: string;
    agent?: {
        id: string;
        first_name?: NullableString;
        last_name?: NullableString;
        profile_picture?: NullableString;
        email?: NullableString;
    } | null;
}
export declare const toCleanStringArray: (value: StringArrayInput) => string[];
export declare const getPrimaryDetail: (details: PropertyDetailRow[] | PropertyDetailRow | null | undefined) => PropertyDetailRow | undefined;
export declare const mapPropertyDetailRow: (row: PropertyDetailRow) => PropertyData;
export declare const transformPropertyWithRelations: (property: PropertyWithRelations) => PropertyData;
export type PropertyMapMarker = Pick<PropertyData, "id" | "title" | "location" | "price" | "isPricePerMonth" | "details" | "images" | "viewCount" | "isForRent" | "isForSale" | "listingTypes" | "latitude" | "longitude"> & {
    listing_type?: string[];
};
export interface MarkerEvent {
    latLng: {
        lat: () => number;
        lng: () => number;
    };
    domEvent?: Pick<Event, "stopPropagation" | "preventDefault"> & {
        stop?: () => void;
    };
}
export interface GoogleMapLike {
    setCenter: (latLng: {
        lat: number;
        lng: number;
    }) => void;
    setZoom: (zoom: number) => void;
    getZoom: () => number;
    addListener: (event: string, handler: (...args: unknown[]) => void) => void;
}
export type MarkerFactory = (options: {
    position: {
        lat: number;
        lng: number;
    };
    map: GoogleMapLike;
    icon?: unknown;
}) => unknown;
export type MapClickHandler = (property: PropertyData) => void;
export type PopupRenderer = (property: PropertyData) => ReactNode;
//# sourceMappingURL=property-helpers.d.ts.map