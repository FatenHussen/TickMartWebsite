import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  type: string;
}

export interface FaqsListData {
  types: string[];
  faqs: FaqItem[];
}

export interface FaqsResponse {
  status: boolean;
  message: string;
  data: FaqsListData;
}

export const faqsApi = {
  getFaqs: async (type: string): Promise<FaqsListData> => {
    const res = await _axios.get<FaqsResponse>(apiRoutes.faqs.list(type));
    const data = res.data?.data;
    return {
      types: Array.isArray(data?.types) ? data.types : [],
      faqs: Array.isArray(data?.faqs) ? data.faqs : [],
    };
  },
};
