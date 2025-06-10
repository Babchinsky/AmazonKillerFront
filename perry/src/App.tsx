import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Main from "./pages/main/Main";
import Account from "./pages/account/Account";
import ProductList from "./pages/products/ProductList";
import Product from "./pages/products/Product";
import Checkout from "./pages/checkout/Checkout";
import LegalNotice from "./pages/legal-notice/LegalNotice";
import PageNotFound from "./pages/error/PageNotFound";
import { LoginPage } from './pages/admin/LoginPage';
import { AdminLayout } from './layouts/AdminLayout';
import { CategoryPanel } from './components/admin/CategoryPanel';
import { UsersPanel } from './components/admin/UsersPanel';
import { ProductsPanel } from './components/admin/ProductsPanel';
import { OrdersPanel } from './components/admin/OrdersPanel';
import { ReviewsPanel } from './components/admin/ReviewsPanel';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { initializeApp } from './utils/appInit';

function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/account" element={<Account />} />
        <Route path="/products/:categoryName" element={<ProductList />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/legal-notice" element={<LegalNotice />} />
        <Route path="/admin/login" element={<LoginPage />} />
        
        {/* Защищенные маршруты админ-панели */}
        <Route path="/admin" element={
          <ProtectedRoute>
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;