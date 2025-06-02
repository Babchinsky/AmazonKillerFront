import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { RootState } from "../state/store";


function ProtectedRoutes() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  return accessToken ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoutes;