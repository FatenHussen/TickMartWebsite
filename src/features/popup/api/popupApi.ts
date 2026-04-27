import axios from "axios";
import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type {
    ActivePopupResponse,
    PopupCampaign,
    PopupTrackPayload,
} from "../types";

const trackingClient = axios.create({
    baseURL: _axios.defaults.baseURL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CLIENT": "web",
    },
});

export const _PopupApi = {
    getActive: async (params?: {
        page_type?: string;
        current_url?: string;
    }): Promise<PopupCampaign | null> => {
        const response = await _axios.get<ActivePopupResponse>(
            apiRoutes.popups.active(params)
        );
        return response.data.data ?? null;
    },

    trackView: async (
        popupId: number,
        payload?: PopupTrackPayload
    ): Promise<void> => {
        await trackingClient.post(
            apiRoutes.popups.trackView(popupId),
            payload ?? {}
        );
    },

    trackClick: async (
        popupId: number,
        payload?: PopupTrackPayload
    ): Promise<void> => {
        await trackingClient.post(
            apiRoutes.popups.trackClick(popupId),
            payload ?? {}
        );
    },
};
