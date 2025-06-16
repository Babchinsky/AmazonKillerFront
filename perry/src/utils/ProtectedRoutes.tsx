import { Navigate, Outlet } from "react-router";


function ProtectedRoutes() {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoutes;