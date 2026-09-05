import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router";
import AppLayout from "@/layout/AppLayout";
import { paths } from "../path/paths";
import { PremiumAppLoader } from "@/shared/component/loading";

const SchedulesCatalog = lazy(
    () => import("@/features/customBasket/view/SchedulesCatalog"),
);
const ScheduleCustomize = lazy(
    () => import("@/features/customBasket/view/ScheduleCustomize"),
);

const PageLoader = () => <PremiumAppLoader minHeight="min-h-[400px]" />;

export const ScheduleRoutes: RouteObject[] = [
    {
        path: paths.client.schedules,
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <SchedulesCatalog />
                    </Suspense>
                ),
            },
            {
                path: ":id",
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ScheduleCustomize />
                    </Suspense>
                ),
            },
        ],
    },
];
