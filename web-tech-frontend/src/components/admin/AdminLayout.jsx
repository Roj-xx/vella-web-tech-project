    import Sidebar from "./Sidebar";
    import { Outlet } from "react-router-dom";

    const AdminLayout = () => {
    return (
        <div className="bg-gray-50 min-h-screen">

        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="ml-80 p-6">
            <Outlet />
        </div>

        </div>
    );
    };

    export default AdminLayout;