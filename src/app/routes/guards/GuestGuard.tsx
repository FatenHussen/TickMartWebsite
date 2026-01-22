import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { paths } from "../path/paths";

/**
 * GuestGuard - Protects auth routes from authenticated users
 * If user is authenticated, redirect to home
 * If user is not authenticated, render the children (auth pages)
 */
export default function GuestGuard() {
  const { authenticated } = useAuthStore();

  if (authenticated) {
    return <Navigate to={paths.client.home} replace />;
  }

  return <Outlet />;
}
