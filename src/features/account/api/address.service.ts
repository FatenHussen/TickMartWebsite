import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type {
  CreateAddressPayload,
  UpdateAddressPayload,
  AddressesResponse,
} from "../types";

export interface CreateAddressResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    label: string;
    area_id: number;
    street_name: string;
    nearest_landmark: string;
    building_number?: string;
    floor_apartment?: string;
    contact_phone: string;
    lat: number;
    lng: number;
    is_default: boolean;
  };
}

export const _AddressApi = {
  getAddresses: async (): Promise<AddressesResponse> => {
    const res = await _axios.get<AddressesResponse>(apiRoutes.addresses.list);
    return res.data;
  },
  createAddress: async (
    payload: CreateAddressPayload,
  ): Promise<CreateAddressResponse> => {
    const res = await _axios.post<CreateAddressResponse>(
      apiRoutes.addresses.create,
      payload,
    );
    return res.data;
  },
  updateAddress: async (
    id: number | string,
    payload: UpdateAddressPayload,
  ): Promise<CreateAddressResponse> => {
    const res = await _axios.patch<CreateAddressResponse>(
      apiRoutes.addresses.update(id),
      payload,
    );
    return res.data;
  },
  deleteAddress: async (id: number | string): Promise<void> => {
    await _axios.delete(apiRoutes.addresses.delete(id));
  },
  setDefault: async (id: number | string): Promise<void> => {
    await _axios.post(apiRoutes.addresses.setDefault(id));
  },
};
