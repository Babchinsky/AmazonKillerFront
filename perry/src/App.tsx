import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./state/store";
import { setAuthModalOpen } from "./state/auth/auth-slice";
// import ProtectedRoutes from "./utils/ProtectedRoutes";
// import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Main from "./pages/main/Main";
import Account from "./pages/account/Account";
import ProductList from "./pages/products/ProductList";
import Product from "./pages/products/Product";
import Checkout from "./pages/checkout/Checkout";
import LegalNotice from "./pages/legal-notice/LegalNotice";
import PageNotFound from "./pages/error/PageNotFound";
import Authentication from "./components/popups/authentication/Authentication";
import { useEffect } from "react";
import { initializeApp } from "./utils/appInit";
import { LoginPage } from './pages/admin/LoginPage';
import { AdminLayout } from './layouts/AdminLayout';
import { CategoryPanel } from './components/admin/CategoryPanel';
import { UsersPanel } from './components/admin/UsersPanel';
import { ProductsPanel } from './components/admin/ProductsPanel';
import { OrdersPanel } from './components/admin/OrdersPanel';
import { ReviewsPanel } from './components/admin/ReviewsPanel';
import ProtectedRoute from "./routes/ProtectedRoute";


function App() {
  const dispatch = useDispatch();
  const isAuthModalOpen = useSelector((state: RootState) => state.auth.isAuthModalOpen);
  
  const closeAuthModal = () => {
    dispatch(setAuthModalOpen(false));
  };

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    const action = isAuthModalOpen ? "add" : "remove";
    document.body.classList[action]("body-no-scroll");
    document.documentElement.classList[action]("html-no-scroll");

    return () => {
      document.body.classList.remove("body-no-scroll");
      document.documentElement.classList.remove("html-no-scroll");
    };
  }, [isAuthModalOpen]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/users" replace />} />
            <Route path="users" element={<UsersPanel />} />
            <Route path="category" element={<CategoryPanel />} />
            <Route path="products" element={<ProductsPanel />} />
            <Route path="orders" element={<OrdersPanel />} />
            <Route path="reviews" element={<ReviewsPanel />} />
          </Route>
          
          <Route path="/products/:categoryName" element={<ProductList />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/legal-notice" element={<LegalNotice />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>

      {isAuthModalOpen && <Authentication onClose={closeAuthModal} />}
    </>
  );
}

export default App;