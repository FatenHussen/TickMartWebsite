import AppLayout from"@/layout/AppLayout";
import { paths } from"../path/paths";
import Recipes from"@/features/recipes/view/Recipes";
import RecipeDetails from"@/features/recipes/view/RecipeDetails";
import AllBrands from"@/features/product/view/AllBrands";
import AllBaskets from"@/features/basket/view/AllBaskets";
import BasketDetailsPage from"@/features/basket/view/BasketDetailsPage";
import ProductsPage from"@/features/product/view/ProductsPage";

export const SectionsRoutes: any[] = [
 // Brands page
 {
 path: paths.client.brands,
 element: <AppLayout />,
 children: [
 {
 index: true,
 element: <AllBrands />,
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
 path:"/recipe/:id",
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
 element: <AllBaskets />,
 },
 ],
 },
 // Basket details
 {
 path:"/basket/:id",
 element: <AppLayout />,
 children: [
 {
 index: true,
 element: <BasketDetailsPage />,
 },
 ],
 },
];
