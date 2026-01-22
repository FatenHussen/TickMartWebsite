import { Suspense } from "react";
import type { RouteObject } from "react-router";

import SignIn from "../../../features/auth/view/Sign-in";
import SignUp from "../../../features/auth/view/Sign-up";
import Otp from "../../../features/auth/view/Otp";
import ForgotPassword from "../../../features/auth/view/ForgotPassword";
import ChangePassword from "../../../features/auth/view/ChangePassword";
import { ROOTS } from "../path/paths";
import GuestGuard from "../guards/GuestGuard";

const SuspenseGuestGuard = function SuspenseGuestGuard() {
  return (
    <Suspense fallback={<div />}>
      <GuestGuard />
    </Suspense>
  );
};

export const authRoutes: RouteObject[] = [
  {
    path: ROOTS.AUTH,
    element: <SuspenseGuestGuard />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "otp",
        element: <Otp />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "change-password",
        element: <ChangePassword />,
      },
    ],
  },
];
