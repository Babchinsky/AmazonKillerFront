import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./state/store";
import { BrowserRouter, Routes, Route } from "react-router";
import { setAuthModalOpen } from "./state/auth/auth-slice";
import ProtectedRoutes from "./utils/ProtectedRoutes";
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          
          <Route element={<ProtectedRoutes />}>
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
          
          <Route path="/products/:categoryName" element={<ProductList />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/legal-notice" element={<LegalNotice />} />
          
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>

      {isAuthModalOpen && <Authentication onClose={closeAuthModal} />}
    </>
  );
}

export default App;