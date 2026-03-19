import { Navigate } from "react-router-dom";
import Home from "@/features/home/view/Home";
import AppLayout from "@/layout/AppLayout";
import AuthGuard from "@/app/routes/guards/AuthGuard";
import AffiliateWelcomePage from "@/features/affiliate/view/AffiliateWelcomePage";

const clientPage = {
    path: "/",
    children: [
        {
            index: true,
            element: <Navigate to="/home" replace />,
        },
        {
            path: "home",
            element: <Home />,
        },
        {
            path: "affiliate-welcome",
            element: (
                <AuthGuard>
                    <AffiliateWelcomePage />
                </AuthGuard>
            ),
        },
    ],
};

export const HomeRoutes: any[] = [
    {
        element: <AppLayout />,
        children: [clientPage],
    },
];
