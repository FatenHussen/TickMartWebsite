import React from "react";
import { Navigate, useLocation } from "react-router";
import { paths } from "@/app/routes/path/paths";
import { useAuthStore } from "@/store/auth";

const authRoutes = [
  paths.auth.jwt.signIn,
  paths.auth.jwt.signUp,
  paths.auth.jwt.otp,
  paths.auth.jwt.forgotPassword,
  paths.auth.jwt.changePassword,
];

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authenticated } = useAuthStore();
  const location = useLocation();

  const isAuthRoute = authRoutes.includes(location.pathname);

  // If authenticated and trying to access auth routes, redirect to home
  if (authenticated && isAuthRoute) {
    return <Navigate to={paths.client.home} replace />;
  }

  return <>{children}</>;
}
