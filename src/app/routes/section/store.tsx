import AppLayout from "@/layout/AppLayout";
import { ROOTS } from "../path/paths";
import StoreDetails from "@/features/store/view/StoreDetails";
import SearchResults from "@/features/store/view/SearchResults";

export const StoreRoutes: any[] = [
  {
    path: ROOTS.STORE,
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <StoreDetails />,
      },
      {
        path: "search_results",
        element: <SearchResults />,
      },
    ],
  },
];
