import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ADMIN_TOKEN } from '../../utils/authToken';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  // Проверяем наличие токена
  if (!ADMIN_TOKEN) {
    // Редиректим на страницу логина, сохраняя текущий путь
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 