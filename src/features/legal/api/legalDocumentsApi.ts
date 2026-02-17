import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { LegalDocumentData, LegalDocumentResponse } from "../types";

export const legalDocumentsApi = {
  getPrivacyPolicy: async (): Promise<LegalDocumentData | null> => {
    const res = await _axios.get<LegalDocumentResponse>(
      apiRoutes.legalDocuments.privacyPolicy,
    );
    return res.data.data ?? null;
  },

  getTermsConditions: async (): Promise<LegalDocumentData | null> => {
    const res = await _axios.get<LegalDocumentResponse>(
      apiRoutes.legalDocuments.termsConditions,
    );
    return res.data.data ?? null;
  },

  getMarketerTermsConditions: async (): Promise<LegalDocumentData | null> => {
    const res = await _axios.get<LegalDocumentResponse>(
      apiRoutes.legalDocuments.marketerTermsConditions,
    );
    return res.data.data ?? null;
  },
};
