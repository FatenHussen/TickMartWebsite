import AppLayout from "@/layout/AppLayout";

import { ROOTS } from "../path/paths";

import ProductDetails from "@/features/product/view/ProductDetails";
import BrandProducts from "@/features/product/view/BrandProducts";

export const ProductsRoutes: any[] = [
  {
    path: ROOTS.PRODUCT,
    element: <AppLayout />,
    children: [
      {
        path: ":productId",
        element: <ProductDetails />,
      },
    ],
  },
  {
    path: "/brand/:brandId/products",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <BrandProducts />,
      },
    ],
  },
];
