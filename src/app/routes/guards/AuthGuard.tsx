import { Navigate, useLocation } from"react-router-dom";
import { useAuthStore } from"@/store/auth";
import { paths } from"../path/paths";

interface AuthGuardProps {
 children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
 const { isAuthenticated } = useAuthStore();
 const location = useLocation();

 if (!isAuthenticated()) {
 // Redirect to sign-in page with return url
 return (
 <Navigate
 to={paths.auth.jwt.signIn}
 state={{ from: location.pathname }}
 replace
 />
 );
 }

 return <>{children}</>;
}
