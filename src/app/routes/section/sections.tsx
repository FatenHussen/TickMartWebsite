import AppLayout from "@/layout/AppLayout";
import { paths } from "../path/paths";
import Recipes from "@/features/recipes/view/Recipes";
import RecipeDetails from "@/features/recipes/view/RecipeDetails";

// Temporary simple pages for testing - replace with actual components later
const BrandsPage = () => <h1>Brands Page</h1>;
const ProductsPage = () => <h1>Products Page</h1>;
const BasketsPage = () => <h1>Baskets Page</h1>;
const BrandDetailsPage = () => <h1>Brand Details Page</h1>;
const BasketDetailsPage = () => <h1>Basket Details Page</h1>;

export const SectionsRoutes: any[] = [
  // Brands page
  {
    path: paths.client.brands,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <BrandsPage />,
      },
    ],
  },
  // Brand details
  {
    path: "/brand/:id",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <BrandDetailsPage />,
      },
    ],
  },
  // Recipes page
  {
    path: paths.client.recipes,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Recipes />,
      },
    ],
  },
  // Recipe details
  {
    path: "/recipe/:id",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <RecipeDetails />,
      },
    ],
  },
  // Products page (general listing)
  {
    path: paths.client.products,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <ProductsPage />,
      },
    ],
  },
  // Baskets page (general listing - not account/baskets)
  {
    path: paths.client.baskets,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <BasketsPage />,
      },
    ],
  },
  // Basket details
  {
    path: "/basket/:id",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <BasketDetailsPage />,
      },
    ],
  },
];
