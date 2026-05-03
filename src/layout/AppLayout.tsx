import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-custom-primary">
            <Navbar />
            <main className="flex min-h-0 flex-1 flex-col">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

