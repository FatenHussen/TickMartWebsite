import type { RouteObject } from"react-router";

// import { Navigate } from"react-router";
import { authRoutes } from"./auth";

// import { authRoutes } from"./auth";
import { HomeRoutes } from"./home";
import { CategoriesRoutes } from"./categories";
import { ProductsRoutes } from"./product";
import { SectionsRoutes } from"./sections";
import { StoreRoutes } from"./store";
import { CartRoutes } from"./cart";
import { TrackOrderRoutes } from"./trackOrder";
import { CustomOrderRoutes } from"./customOrder";
import { AccountRoutes } from"./account";
import { MarketerRoutes } from"./marketer";
import { VendorRoutes } from"./vendor";
import { LegalRoutes } from"./legal";
import { CmsPageRoutes } from"./cmsPage";
import { ScheduleRoutes } from"./schedules";

// ----------------------------------------------------------------------

export const routesSection: RouteObject[] = [
 // Auth
 ...authRoutes,

 // // Client
 ...HomeRoutes,

 // Categories
 ...CategoriesRoutes,

 // Products
 ...ProductsRoutes,

 // Sections (Brands, Recipes, Products, Baskets)
 ...SectionsRoutes,

 // CMS Page Builder (`/pages/:slug`)
 ...CmsPageRoutes,

 // Store
 ...StoreRoutes,

 // Cart
 ...CartRoutes,

 // Track Order
 ...TrackOrderRoutes,

 // Custom / quick orders
 ...CustomOrderRoutes,

 // Custom scheduled baskets (`/schedules`, `/schedules/:id`)
 ...ScheduleRoutes,

 // Account
 ...AccountRoutes,

 // Marketer
 ...MarketerRoutes,

 // Vendor
 ...VendorRoutes,

 // Legal (Privacy, Terms)
 ...LegalRoutes,

 // No match
 { path:"*", element: <h2>error 404</h2> },
];
