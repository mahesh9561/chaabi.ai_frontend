import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    return token !== null;
};

const ProtectedRoute: React.FC = () => {
    const role = localStorage.getItem("role");

    if (!isAuthenticated()) {
        // If not authenticated, redirect to login page
        return <Navigate to="/login" />;
    }

    if (role !== "admin") {
        // If role is not admin, redirect to user page
        return <Navigate to="/user" />;
    }

    // If authenticated and is admin, show the protected component
    return <Outlet />;
};

export default ProtectedRoute;
