import type {
    CreateAddressPayload,
    NewAddressFormData,
    UpdateAddressPayload,
} from "@/features/account/types";

export function buildCreateAddressPayload(data: NewAddressFormData): CreateAddressPayload {
    const contactPhone = data.contactPhone?.trim() || undefined;
    return {
        label: data.label,
        area_id: Number(data.area),
        street_name: data.streetName?.trim() || "",
        nearest_landmark: data.nearestLandmark?.trim() || "",
        building_number: data.buildingNumber || undefined,
        floor_apartment: data.floorApartment || undefined,
        ...(contactPhone ? { contact_phone: contactPhone } : {}),
        lat: data.lat,
        lng: data.lng,
        is_default: data.isDefault,
    };
}

export function buildUpdateAddressPayload(data: NewAddressFormData): UpdateAddressPayload {
    const contactPhone = data.contactPhone?.trim() || undefined;
    return {
        label: data.label,
        governorate_id: Number(data.governorate),
        city_id: Number(data.city),
        area_id: Number(data.area),
        street_name: data.streetName?.trim() || "",
        nearest_landmark: data.nearestLandmark?.trim() || "",
        building_number: data.buildingNumber || undefined,
        floor_apartment: data.floorApartment || undefined,
        ...(contactPhone ? { contact_phone: contactPhone } : {}),
        lat: data.lat,
        lng: data.lng,
        is_default: data.isDefault,
    };
}
