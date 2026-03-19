import AppLayout from"@/layout/AppLayout";
import AuthGuard from"@/app/routes/guards/AuthGuard";
import { ROOTS } from"../path/paths";
import Cart from"@/features/cart/view/Cart";
import MyOrders from"@/features/cart/view/MyOrders";
import OrderDetails from"@/features/cart/view/OrderDetails";
import Checkout from"@/features/cart/view/Checkout";
import ReviewConfirm from"@/features/cart/view/ReviewConfirm";

export const CartRoutes: any[] = [
 {
 path: ROOTS.CART,
 element: (
 <AuthGuard>
 <AppLayout />
 </AuthGuard>
 ),
 children: [
 {
 path:"",
 element: <Cart />,
 },
 {
 path:"orders",
 element: <MyOrders />,
 },
 {
 path:"orders/:orderId",
 element: <OrderDetails />,
 },
 {
 path:"checkout",
 element: <Checkout />,
 },
 {
 path:"review",
 element: <ReviewConfirm />,
 },
 ],
 },
];
