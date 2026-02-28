import type { RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/app/routes/guards/AuthGuard";

// Lazy load account components
const AccountLayout = lazy(
  () => import("@/features/account/layout/AccountLayout"),
);
const Profile = lazy(() => import("@/features/account/view/Profile"));
const Addresses = lazy(() => import("@/features/account/view/Addresses"));
const PaymentMethods = lazy(
  () => import("@/features/account/view/PaymentMethods"),
);
const MyOrders = lazy(() => import("@/features/account/view/MyOrders"));
const MyBaskets = lazy(() => import("@/features/account/view/MyBaskets"));
const ScheduledBasketDetails = lazy(
  () => import("@/features/account/view/ScheduledBasketDetails"),
);
const MyPackages = lazy(() => import("@/features/account/view/MyPackages"));
const Wishlist = lazy(() => import("@/features/account/view/Wishlist"));
const PointsRewards = lazy(
  () => import("@/features/account/view/PointsRewards"),
);
const MyReviews = lazy(() => import("@/features/account/view/MyReviews"));
const Settings = lazy(() => import("@/features/account/view/Settings"));
const Notifications = lazy(
  () => import("@/features/account/view/Notifications"),
);
const AddressForm = lazy(() => import("@/features/account/view/AddressForm"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Account page wrapper with auth guard
const AccountPageWrapper = () => (
  <AuthGuard>
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-custom-primary">
        <Suspense fallback={<PageLoader />}>
          <AccountLayout />
        </Suspense>
      </main>
      {/* <Footer /> */}
    </div>
  </AuthGuard>
);

export const AccountRoutes: RouteObject[] = [
  {
    path: "account",
    element: <AccountPageWrapper />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "addresses",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Addresses />
          </Suspense>
        ),
      },
      {
        path: "addresses/add",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AddressForm />
          </Suspense>
        ),
      },
      {
        path: "addresses/:id/edit",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AddressForm />
          </Suspense>
        ),
      },
      {
        path: "payment-methods",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PaymentMethods />
          </Suspense>
        ),
      },
      {
        path: "orders",
        element: (
          <Suspense fallback={<PageLoader />}>
            <MyOrders />
          </Suspense>
        ),
      },
      {
        path: "baskets",
        element: (
          <Suspense fallback={<PageLoader />}>
            <MyBaskets />
          </Suspense>
        ),
      },
      {
        path: "baskets/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ScheduledBasketDetails />
          </Suspense>
        ),
      },
      {
        path: "packages",
        element: (
          <Suspense fallback={<PageLoader />}>
            <MyPackages />
          </Suspense>
        ),
      },
      {
        path: "wishlist",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Wishlist />
          </Suspense>
        ),
      },
      {
        path: "points-rewards",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PointsRewards />
          </Suspense>
        ),
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Notifications />
          </Suspense>
        ),
      },
      {
        path: "reviews",
        element: (
          <Suspense fallback={<PageLoader />}>
            <MyReviews />
          </Suspense>
        ),
      },
      {
        path: "help-support",
        element: (
          <div className="p-6 text-center text-text-secondary">
            Help & Support - Coming soon
          </div>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "delete",
        element: (
          <div className="p-6 text-center text-text-secondary">
            Delete Account - Coming soon
          </div>
        ),
      },
    ],
  },
];
