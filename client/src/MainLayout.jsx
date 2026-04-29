import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import Sidebar from "./components/extra/Sidebar";

const MainLayout = () => {
    const { user } = useSelector(store => store.auth);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };


    // Redirect to login if no user
    if (!user) {
        return <Navigate to="/" replace />;
    }


    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar toggleSidebar={toggleSidebar} />

            <div className="flex">
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

                <div className="pt-18 w-full transition-all md:ml-64">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
