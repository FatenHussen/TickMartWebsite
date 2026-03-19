import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type {
 Complaint,
 ComplaintOrder,
 ComplaintsListResponse,
 ComplaintOrdersResponse,
} from"../types";

export interface ComplaintsListParams {
 status?: string;
 order_id?: number;
 from?: string;
 to?: string;
 page?: number;
 per_page?: number;
}

export const complaintsApi = {
 getComplaints: async (
 params?: ComplaintsListParams
 ): Promise<{ data: Complaint[]; meta?: { current_page: number; total: number } }> => {
 const res = await _axios.get<ComplaintsListResponse>(
 apiRoutes.complaints.list(params)
 );
 const raw = res.data;
 const data = Array.isArray((raw as ComplaintsListResponse).data)
 ? (raw as ComplaintsListResponse).data
 : [];
 const meta = (raw as ComplaintsListResponse).meta;
 return { data, meta };
 },

 getComplaintOrders: async (): Promise<ComplaintOrder[]> => {
 const res = await _axios.get<ComplaintOrdersResponse>(
 apiRoutes.complaints.orders
 );
 const data = (res.data as ComplaintOrdersResponse).data;
 return Array.isArray(data) ? data : [];
 },

 createComplaint: async (formData: FormData): Promise<{ success: boolean; message: string }> => {
 const res = await _axios.post<{ success: boolean; message: string; status?: boolean }>(
 apiRoutes.complaints.store,
 formData
 );
 const d = res.data;
 return {
 success: d.success ?? d.status ?? false,
 message: d.message ??"",
 };
 },
};
