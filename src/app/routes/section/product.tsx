import AppLayout from"@/layout/AppLayout";

import { ROOTS } from"../path/paths";

import ProductDetails from"@/features/product/view/ProductDetails";
import BrandProducts from"@/features/product/view/BrandProducts";
import ProductErrorFallback from"@/features/product/components/ProductErrorFallback";

export const ProductsRoutes: any[] = [
 {
 path: ROOTS.PRODUCT,
 element: <AppLayout />,
 children: [
 {
 path:":productId",
 element: <ProductDetails />,
 // Keeps the layout (navbar/footer) and shows a retry instead of the
 // blank root error screen when the product page throws.
 errorElement: <ProductErrorFallback />,
 },
 ],
 },
 {
 path:"/brand/:brandId/products",
 element: <AppLayout />,
 children: [
 {
 path:"",
 element: <BrandProducts />,
 },
 ],
 },
];
