import AppLayout from "@/layout/AppLayout";
import { ROOTS } from "../path/paths";
import Cart from "@/features/cart/view/Cart";
import MyOrders from "@/features/cart/view/MyOrders";
import OrderDetails from "@/features/cart/view/OrderDetails";
import Checkout from "@/features/cart/view/Checkout";

export const CartRoutes: any[] = [
  {
    path: ROOTS.CART,
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <Cart />,
      },
      {
        path: "orders",
        element: <MyOrders />,
      },
      {
        path: "orders/:orderId",
        element: <OrderDetails />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
    ],
  },
];
