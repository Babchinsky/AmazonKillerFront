import { Navigate, Outlet } from "react-router";


function AuthProvider() {
  const user = null;
  return user ? <Outlet/> : <Navigate to="/" />
}

export default AuthProvider;