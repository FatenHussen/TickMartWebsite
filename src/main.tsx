import { StrictMode } from"react";
import { createRoot } from"react-dom/client";
import { Toaster } from"sonner";
import"./index.css";
import App from"./App.tsx";
import { createBrowserRouter, Outlet, RouterProvider } from"react-router-dom";
import { routesSection } from"./app/routes/section/index.tsx";
import { QueryClient, QueryClientProvider } from"@tanstack/react-query";
import RouteErrorFallback from"./shared/component/RouteErrorFallback";

const queryClient = new QueryClient({
 defaultOptions: {
 queries: {
 retry: 1,
 refetchOnWindowFocus: false,
 },
 },
});

const router = createBrowserRouter([
 {
 Component: () => (
 <QueryClientProvider client={queryClient}>
 <App>
 <Outlet />
 <Toaster richColors closeButton position="top-center"/>
 </App>
 </QueryClientProvider>
 ),
 errorElement: <RouteErrorFallback />,
 children: routesSection,
 },
]);

createRoot(document.getElementById("root")!).render(
 <StrictMode>
 <RouterProvider router={router} />
 </StrictMode>
);
