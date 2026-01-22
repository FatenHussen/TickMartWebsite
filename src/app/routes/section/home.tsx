import { Navigate } from "react-router-dom";
import Home from "@/features/home/view/Home";
import AppLayout from "@/layout/AppLayout";

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
  ],
};

export const HomeRoutes: any[] = [
  {
    element: <AppLayout />,
    children: [clientPage],
  },
];
