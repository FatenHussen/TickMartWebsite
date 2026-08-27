import AppLayout from "@/layout/AppLayout";
import { paths } from "../path/paths";
import CmsPage from "@/features/home/view/CmsPage";

export const CmsPageRoutes: any[] = [
    {
        path: paths.client.cmsPage,
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <CmsPage />,
            },
        ],
    },
];
