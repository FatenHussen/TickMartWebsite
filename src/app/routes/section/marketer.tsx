import AppLayout from"@/layout/AppLayout";
import { paths } from"../path/paths";
import BecomeMarketer from"@/features/marketer/view/BecomeMarketer";

export const MarketerRoutes = [
 {
 path: paths.becomeMarketer,
 element: <AppLayout />,
 children: [
 {
 index: true,
 element: <BecomeMarketer />,
 },
 ],
 },
];
