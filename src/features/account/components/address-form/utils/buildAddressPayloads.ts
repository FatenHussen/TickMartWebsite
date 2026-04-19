import type {
    CreateAddressPayload,
    NewAddressFormData,
    UpdateAddressPayload,
} from "@/features/account/types";

export function buildCreateAddressPayload(data: NewAddressFormData): CreateAddressPayload {
    return {
        label: data.label,
        area_id: Number(data.area),
        street_name: data.streetName,
        nearest_landmark: data.nearestLandmark,
        building_number: data.buildingNumber || undefined,
        floor_apartment: data.floorApartment || undefined,
        contact_phone: data.contactPhone,
        lat: data.lat,
        lng: data.lng,
        is_default: data.isDefault,
    };
}

export function buildUpdateAddressPayload(data: NewAddressFormData): UpdateAddressPayload {
    return {
        label: data.label,
        governorate_id: Number(data.governorate),
        city_id: Number(data.city),
        area_id: Number(data.area),
        street_name: data.streetName,
        nearest_landmark: data.nearestLandmark,
        building_number: data.buildingNumber || undefined,
        floor_apartment: data.floorApartment || undefined,
        contact_phone: data.contactPhone,
        lat: data.lat,
        lng: data.lng,
        is_default: data.isDefault,
    };
}
