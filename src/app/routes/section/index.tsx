import type { RouteObject } from "react-router";

// import { Navigate } from "react-router";
import { authRoutes } from "./auth";

// import { authRoutes } from "./auth";
import { HomeRoutes } from "./home";
import { CategoriesRoutes } from "./categories";
import { ProductsRoutes } from "./product";
import { StoreRoutes } from "./store";
import { CartRoutes } from "./cart";
import { TrackOrderRoutes } from "./trackOrder";
// import { storeRoutes } from "./store";
// import { profileRoutes } from "./profile";

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

  // Store
  ...StoreRoutes,

  // Cart
  ...CartRoutes,

  // Track Order
  ...TrackOrderRoutes,

  //   // Store
  //   ...storeRoutes,

  //   // Profile
  //   ...profileRoutes,

  // No match
  { path: "*", element: <h2>error 404</h2> },
];
