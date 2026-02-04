import type { RouteObject } from "react-router";

// import { Navigate } from "react-router";
import { authRoutes } from "./auth";

// import { authRoutes } from "./auth";
import { HomeRoutes } from "./home";
import { CategoriesRoutes } from "./categories";
import { ProductsRoutes } from "./product";
import { SectionsRoutes } from "./sections";
import { StoreRoutes } from "./store";
import { CartRoutes } from "./cart";
import { TrackOrderRoutes } from "./trackOrder";
import { AccountRoutes } from "./account";

// ----------------------------------------------------------------------

export const routesSection: RouteObject[] = [
  // Auth
  ...authRoutes,

  //   // Client
  ...HomeRoutes,

  // Categories
  ...CategoriesRoutes,

  // Products
  ...ProductsRoutes,

  // Sections (Brands, Recipes, Products, Baskets)
  ...SectionsRoutes,

  // Store
  ...StoreRoutes,

  // Cart
  ...CartRoutes,

  // Track Order
  ...TrackOrderRoutes,

  // Account
  ...AccountRoutes,

  // No match
  { path: "*", element: <h2>error 404</h2> },
];
