import AppLayout from "@/layout/AppLayout";
import { ROOTS } from "../path/paths";
import TrackOrder from "@/features/trackOrder/view/TrackOrder";

export const TrackOrderRoutes: any[] = [
  {
    path: `${ROOTS.TRACK_ORDER}/:orderId`,
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <TrackOrder />,
      },
    ],
  },
];

