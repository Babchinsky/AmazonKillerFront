import { BrowserRouter, Routes, Route } from "react-router";
import Main from "./pages/main/Main";
import Account from "./pages/account/Account";
import ProductList from "./pages/products/ProductList";
import Product from "./pages/products/Product";
import Checkout from "./pages/checkout/Checkout";
import LegalNotice from "./pages/legal-notice/LegalNotice";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/account" element={<Account />} />
        <Route path="/products/:categoryName" element={<ProductList />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/legal-notice" element={<LegalNotice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;