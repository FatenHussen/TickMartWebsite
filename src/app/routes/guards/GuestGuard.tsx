import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { isApprovedMarketer } from "@/features/marketer/utils/isApprovedMarketer";
import { paths } from "../path/paths";

/**
 * GuestGuard - Protects auth routes from authenticated users.
 * Approved marketers land on the marketer welcome; everyone else goes home.
 */
export default function GuestGuard() {
    const { authenticated, user } = useAuthStore();

    if (authenticated) {
        const destination = isApprovedMarketer(user)
            ? paths.affiliateWelcome
            : paths.client.home;
        return <Navigate to={destination} replace />;
    }

    return <Outlet />;
}
