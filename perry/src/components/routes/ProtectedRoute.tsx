import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ADMIN_TOKEN } from '../../utils/auth/authToken';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  if (!ADMIN_TOKEN) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 