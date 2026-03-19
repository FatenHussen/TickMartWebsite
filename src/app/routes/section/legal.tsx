import type { RouteObject } from"react-router";
import AppLayout from"@/layout/AppLayout";
import PrivacyPolicyPage from"@/features/legal/view/PrivacyPolicyPage";
import TermsConditionsPage from"@/features/legal/view/TermsConditionsPage";

export const LegalRoutes: RouteObject[] = [
 {
 path:"privacy",
 element: <AppLayout />,
 children: [
 {
 index: true,
 element: <PrivacyPolicyPage />,
 },
 ],
 },
 {
 path:"terms",
 element: <AppLayout />,
 children: [
 {
 index: true,
 element: <TermsConditionsPage />,
 },
 ],
 },
];
