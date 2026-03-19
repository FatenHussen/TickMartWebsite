import AppLayout from"@/layout/AppLayout";
import { paths } from"../path/paths";
import BecomeVendor from"@/features/vendor/view/BecomeVendor";

export const VendorRoutes = [
 {
 path: paths.becomeVendor,
 element: <AppLayout />,
 children: [
 {
 index: true,
 element: <BecomeVendor />,
 },
 ],
 },
];
