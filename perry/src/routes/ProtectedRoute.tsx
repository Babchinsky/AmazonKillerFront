import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ADMIN_TOKEN } from "../utils/auth/authToken";


interface ProtectedRouteProps {
  children?: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const location = useLocation();

  const accessToken = localStorage.getItem("accessToken");

  const isAuthorized = adminOnly ? !!ADMIN_TOKEN : !!accessToken;

  if (!isAuthorized) {
    const redirectTo = adminOnly ? "/admin/login" : "/";
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return (
    <>
      {children ? children : <Outlet />}
    </>
  );
};

export default ProtectedRoute;