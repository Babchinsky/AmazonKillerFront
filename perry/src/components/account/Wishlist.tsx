import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { getProducts } from "../../state/products/products-slice";
import { getWishlist, removeFromWishlist } from "../../state/wishlist/wishlist-slice";
import ProductCard from "../cards/ProductCard";
import RemoveWishlistItem from "../popups/account/RemoveWishlistItem";
import DefaultImage from "../../assets/images/default.jpg";
import Search from "../../assets/icons/search.svg?react";
import accountDataStyles from "./AccountData.module.scss";
import wishlistStyles from "./Wishlist.module.scss";


function Wishlist() {
  const dispatch = useDispatch<AppDispatch>();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const [isRemoveWishlistItemOpen, setIsRemoveWishlistItemOpen] = useState<boolean>(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  
  const removeWishlistItem = async () => {
    if (removingItemId) {
      await dispatch(removeFromWishlist(removingItemId));
      await dispatch(getWishlist());
      setIsRemoveWishlistItemOpen(false);
      setRemovingItemId(null);
    }
  };

  useEffect(() => {
    const action = isRemoveWishlistItemOpen ? "add" : "remove";
    document.body.classList[action]("body-no-scroll");
    document.documentElement.classList[action]("html-no-scroll");

    return () => {
      document.body.classList.remove("body-no-scroll");
      document.documentElement.classList.remove("html-no-scroll");
    };
  }, [isRemoveWishlistItemOpen]);

  const productCards = wishlistItems
  .filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .map((product) => (
    <ProductCard
      key={product.id}
      link={`/product/${product.id}`}
      imageUrl={product.imageUrl.trim().length !== 0 ? product.imageUrl : DefaultImage}
      name={product.name}
      rating={product.rating}
      reviewsCount={product.reviewsCount}
      quantity={product.quantity}
      price={product.price}
      discountPercent={product.discountPercent ?? 0}
      onRemove={() => {
        setRemovingItemId(product.id);
        setIsRemoveWishlistItemOpen(true);
      }}
    />
  ));

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  return (
    <>
      <div className={accountDataStyles.accountDataContainer}>
        <div className={accountDataStyles.accountDataTopContainer}>
          <div className={wishlistStyles.titleСontainer}>
            <h1>Wishlist</h1>
    
            <div className={wishlistStyles.searchBarContainer}>
              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={changeSearch}
              />
              <button>
                <Search className={wishlistStyles.searchIcon} />
              </button>
            </div>
          </div>
    
          <hr className={`${accountDataStyles.accountDataDivider} divider`} />
        </div>
  
        <div className={accountDataStyles.accountDataBottomContainer}>
          <div className={wishlistStyles.wishlistContainer}>
            {wishlistItems.length === 0 ? (
              <p className={wishlistStyles.wishlistListMessage}>
                Looks like you haven’t added any products yet.
              </p>
            ) : productCards.length === 0 ? (
              <p className={wishlistStyles.wishlistListMessage}>
                No products match your search.
              </p>
            ) : (
              <div className={wishlistStyles.wishlistList}>
                {productCards}
              </div>
            )}
          </div>
        </div>
      </div>

      {isRemoveWishlistItemOpen && (
        <RemoveWishlistItem
          onRemove={removeWishlistItem}
          onClose={() => {
            setIsRemoveWishlistItemOpen(false);
            setRemovingItemId(null);
          }}
        />
      )}
    </>
  );
}

export default Wishlist;