import React from "react";
import { Navigate, useLocation } from "react-router";
import { paths } from "@/app/routes/path/paths";

const authRoutes = [
  paths.auth.jwt.signIn,
  paths.auth.jwt.signUp,
  paths.auth.jwt.otp,
  paths.auth.jwt.reset,
];
const protectedRoutes: string[] = [];

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: wire up real auth store when available.
  const isAuthenticated = false;
  const location = useLocation();

  const isAuthRoute = authRoutes.includes(location.pathname);
  const isProtectedRoute = protectedRoutes.includes(location.pathname);

  if (isAuthenticated && isAuthRoute) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated && isProtectedRoute) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
