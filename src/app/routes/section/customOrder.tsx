import type { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import AppLayout from "@/layout/AppLayout";
import AuthGuard from "@/app/routes/guards/AuthGuard";
import { ROOTS } from "../path/paths";
import { PremiumAppLoader } from "@/shared/component/loading";

const CustomOrderList = lazy(
  () => import("@/features/customOrder/view/CustomOrderList")
);
const CustomOrderCreate = lazy(
  () => import("@/features/customOrder/view/CustomOrderCreate")
);
const CustomOrderDetail = lazy(
  () => import("@/features/customOrder/view/CustomOrderDetail")
);

const PageLoader = () => <PremiumAppLoader minHeight="min-h-[400px]" />;

export const CustomOrderRoutes: RouteObject[] = [
  {
    path: ROOTS.CUSTOM_ORDERS,
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <CustomOrderList />
          </Suspense>
        ),
      },
      {
        path: "new",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CustomOrderCreate />
          </Suspense>
        ),
      },
      {
        path: ":id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CustomOrderDetail />
          </Suspense>
        ),
      },
    ],
  },
];
