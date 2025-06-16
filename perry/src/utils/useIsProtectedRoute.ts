import { useLocation } from "react-router";


const protectedPaths = ["/account", "/checkout"];

function useIsProtectedRoute() {
  const location = useLocation();
  return protectedPaths.some(path => location.pathname.startsWith(path));
}

export { useIsProtectedRoute };