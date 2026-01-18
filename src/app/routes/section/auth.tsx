import { Suspense } from "react";
import { Outlet } from "react-router";
import type { RouteObject } from "react-router";

import SignIn from "../../../features/auth/view/Sign-in";
import SignUp from "../../../features/auth/view/Sign-up";
import Otp from "../../../features/auth/view/Otp";
import ForgotPassword from "../../../features/auth/view/ForgotPassword";
import { ROOTS } from "../path/paths";

const SuspenseOutlet = function SuspenseOutlet() {
  return (
    <Suspense fallback={<div />}>
      <Outlet />
    </Suspense>
  );
};

export const authRoutes: RouteObject[] = [
  {
    path: ROOTS.AUTH,
    element: <SuspenseOutlet />,
    children: [
      {
        path: "",
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
        ],
      },
    ],
  },
];
