import axios from "axios";
import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type {
    ActivePopupResponse,
    PopupActiveParams,
    PopupCampaign,
    PopupFormSubmitPayload,
    PopupTrackDismissPayload,
    PopupTrackPayload,
} from "../types";

// Public tracking client — deliberately skips the auth interceptor so
// analytics events never get blocked by a 401 on expired tokens.
const publicClient = axios.create({
    baseURL: _axios.defaults.baseURL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CLIENT": "web",
    },
});

export const _PopupApi = {
    /**
     * Fetch the highest-priority active campaign that matches the current
     * page context and entity scope. Returns null when no campaign qualifies.
     */
    getActive: async (params?: PopupActiveParams): Promise<PopupCampaign | null> => {
        const response = await _axios.get<ActivePopupResponse>(
            apiRoutes.popups.active(params)
        );
        return response.data.data ?? null;
    },

    trackView: async (id: number, payload?: PopupTrackPayload): Promise<void> => {
        await publicClient.post(apiRoutes.popups.trackView(id), payload ?? {});
    },

    trackClick: async (id: number, payload?: PopupTrackPayload): Promise<void> => {
        await publicClient.post(apiRoutes.popups.trackClick(id), payload ?? {});
    },

    trackDismiss: async (
        id: number,
        payload?: PopupTrackDismissPayload
    ): Promise<void> => {
        await publicClient.post(apiRoutes.popups.trackDismiss(id), payload ?? {});
    },

    submitForm: async (
        id: number,
        payload: PopupFormSubmitPayload
    ): Promise<void> => {
        await publicClient.post(apiRoutes.popups.submitForm(id), payload);
    },
};
