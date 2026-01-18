import Home from "@/features/home/view/Home";
import AppLayout from "@/layout/AppLayout";

const clientPage = {
  path: "/",
  children: [
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
