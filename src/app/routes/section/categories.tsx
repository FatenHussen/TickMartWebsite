import CategoriesView from"@/features/categories/view";
// import CategoryDetails from"@/features/categories/view/CategoryDetails";
import AppLayout from"@/layout/AppLayout";
import { ROOTS } from"../path/paths";

export const CategoriesRoutes: any[] = [
 {
 path: ROOTS.CATEGORIES,
 element: <AppLayout />,
 children: [
 {
 path:"",
 element: <CategoriesView />,
 },
 // {
 // path:":categoryId",
 // element: <CategoryDetails />,
 // },
 ],
 },
];
