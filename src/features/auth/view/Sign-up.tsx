import { useState } from"react";
import type { UserRole } from"@/features/auth/types";
import SellerSignUp from"./SellerSignUp";
import CustomerSignUp from"./CustomerSignUp";

export default function SignUp() {
 const [role, setRole] = useState<UserRole>("customer");

 if (role ==="seller") {
 return <SellerSignUp role={role} setRole={setRole} />;
 }

 return <CustomerSignUp role={role} setRole={setRole} />;
}
