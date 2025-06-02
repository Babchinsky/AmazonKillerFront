import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import Search from "../../assets/icons/search.svg?react";
import ProductType from "../../types/products/product-type";
import ProductCard from "../cards/ProductCard";
import { getProducts } from "../../state/products/products-slice";
import accountDataStyles from "./AccountData.module.scss";
import wishlistStyles from "./Wishlist.module.scss";


function Wishlist() {
  const dispatch = useDispatch<AppDispatch>();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const products = useSelector((state: RootState) => state.products.products);
  const randomProducts = [...products]
  .sort(() => Math.random() - 0.5)
  .slice(0, 10);

  const productCards = randomProducts.map((product: ProductType) => (
    <ProductCard
      key={product.id}
      isBig={false}
      title={product.name}
      image={product.productPics[0]}
      link={`/product/${product.id}`}
      rating={product.rating}
      reviewsCount={product.reviewsCount}
      price={product.price}
      discount={product.discount}
      quantity={product.quantity}
    />
  ));

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  return (
    <div className="account-data-content-container">
      <div className="title-container">
        <h1>Wishlist</h1>

        <div className="search-bar-container">
          <input
            className="search-bar-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={changeSearch}
          />
          <button className="search-bar-button">
            <Search className="search-icon" />
          </button>
        </div>
      </div>

      <hr className="divider" />

      <div className="wishlist-container">
        <div className="product-card-list">
          {productCards}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;