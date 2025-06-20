import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../state/store";
import { getCart, removeProductFromCart, updateProductQuantity } from "../../../state/cart/cart-slice";
import Button from "../../buttons/Button";
import DefaultImage from "../../../assets/images/default.jpg";
import CartEmpty from "../../../assets/icons/cart-empty.svg?react";
import CloseIcon from "../../../assets/icons/close.svg?react";
import TrashcanIcon from "../../../assets/icons/trashcan.svg?react";
import MinusIcon from "../../../assets/icons/minus.svg?react";
import PlusIcon from "../../../assets/icons/plus.svg?react";
import commerceStyles from "./Commerce.module.scss";
import shoppingCartStyles from "./ShoppingCart.module.scss";
import ProductCard from "@/components/cards/ProductCard";
import { getProducts } from "@/state/products/products-slice";


interface ShoppingCartProps {
  onClose: () => void;
}

function ShoppingCart(props: ShoppingCartProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const accessToken = localStorage.getItem("accessToken");

  const cartItems = useSelector((state: RootState) => state.cart.items ?? []);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  const [totalCurrencyMajor, totalCurrencyMinor] = totalPrice.split(".");

  const products = useSelector((state: RootState) => state.products.products);
  const productCards = [...products].slice(0, 10).map((product) => (
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
    />
  ));

  const removeItem = (productId: string) => {
    dispatch(removeProductFromCart(productId));
  };

  const decreaseQuantity = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateProductQuantity({ productId, quantity: currentQuantity - 1 })).then(() => {
        dispatch(getCart());
      });
    }
  };
  
  const increaseQuantity = (productId: string, currentQuantity: number) => {
    dispatch(updateProductQuantity({ productId, quantity: currentQuantity + 1 })).then(() => {
      dispatch(getCart());
    });
  };

  const checkout = () => {
    navigate("/checkout");
  };

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (accessToken) {
      dispatch(getCart());
    }
  }, [dispatch, accessToken]);

  return (
    <>
      <div className={commerceStyles.overlay} onClick={props.onClose}></div>

      <div className={commerceStyles.commerceContainer}>
        <div className={commerceStyles.commerce}>
          <div className={commerceStyles.contentContainer}>
            <div className={commerceStyles.contentTopContainer}>
              <div className={commerceStyles.titleBarContainer}>
                <div className={commerceStyles.titleContainer}>
                  <CartEmpty className={commerceStyles.cartIcon} />
                  <h3>Shopping Cart</h3>
                </div>
    
                <button onClick={props.onClose}>
                  <CloseIcon className={commerceStyles.closeIcon} />
                </button>
              </div>

              <hr className={`${commerceStyles.contentDivider} divider`} />
            </div>
  
            <div className={commerceStyles.contentScrollableContainer}>
              <div className={commerceStyles.contentMiddleContainer}>    
                {cartItems.length > 0 ? (
                  <div className={commerceStyles.itemListContainer}>
                    {cartItems.map((item, index) => (
                      <div key={index} className={commerceStyles.itemContainer}>
                        <div>
                          <img alt={item.name} src={item.imageUrl || DefaultImage} />
                        </div>
                        
                        <div className={commerceStyles.itemDataContainer}>
                          <div className={commerceStyles.itemDataTopContainer}>
                            <p>{item.name}</p>
                            <button onClick={() => removeItem(item.productId)}>
                              <TrashcanIcon className={commerceStyles.trashcanIcon} />
                            </button>
                          </div>
  
                          <div className={commerceStyles.itemDataBottomContainer}>
                            <div className={shoppingCartStyles.quantity}>
                              <button className={shoppingCartStyles.minusQuantityButton} onClick={() => decreaseQuantity(item.productId, item.quantity)}>
                                <MinusIcon className={shoppingCartStyles.minusIcon} />
                              </button>
                              <p>{item.quantity}</p>
                              <button className={shoppingCartStyles.plusQuantityButton} onClick={() => increaseQuantity(item.productId, item.quantity)}>
                                <PlusIcon className={shoppingCartStyles.plusIcon} />
                              </button>
                            </div>
  
                            <div className={commerceStyles.itemPriceContainer}>
                              {(() => {
                                const totalItemPrice = (item.price * item.quantity).toFixed(2);
                                const [currencyMajor, currencyMinor] = item.price.toFixed(2).split(".");
                                const [totalItemCurrencyMajor, totalItemCurrencyMinor] = totalItemPrice.split(".");
  
                                return (
                                  <>
                                    <div className={commerceStyles.totalItemPriceContainer}>
                                      <p className={commerceStyles.price}>
                                        <span className={commerceStyles.currency}>$</span>
                                        <span>{totalItemCurrencyMajor}</span>
                                        <span className={commerceStyles.currencyMinor}>{totalItemCurrencyMinor}</span>
                                      </p>
                                    </div>
  
                                    <div className={commerceStyles.itemQuantityPriceContainer}>
                                      <p className={commerceStyles.price}>
                                        <span className={commerceStyles.quantity}>{item.quantity}</span>
                                        <span className={commerceStyles.x}>x</span>
                                        <span className={commerceStyles.currency}>$</span>
                                        <span>{currencyMajor}</span>
                                        <span className={commerceStyles.currencyMinor}>{currencyMinor}</span>
                                      </p>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={commerceStyles.itemListMessageContainer}>
                    <h3>{accessToken ? "No items added" : "Not logged in"}</h3>
                    <p>{accessToken ? "Browse to find your perfect product :)" : "Log in to enjoy the best experience on PERRY"}</p>
                  </div>
                )}
              </div>
    
              <div className={`${commerceStyles.contentBottomContainer} ${shoppingCartStyles.contentBottomContainer}`}>
                {cartItems.length > 0 && (
                  <div>
                    <hr className="divider" />
    
                    <div className={commerceStyles.contentDataContainer}>
                      <Button type="secondary" content="Continue shopping" onClick={props.onClose} />
    
                      <div className={commerceStyles.totalContainer}>
                        <div className={commerceStyles.totalDataContainer}>
                          <p>Total:</p>
                          <div className={commerceStyles.totalPriceContainer}>
                            <p className={commerceStyles.price}>
                              <span className={commerceStyles.currency}>$</span>
                              <span>{totalCurrencyMajor}</span>
                              <span className={commerceStyles.currencyMinor}>{totalCurrencyMinor}</span>
                            </p>
                          </div>
                        </div>

                        <Button
                          className={shoppingCartStyles.shoppingCartButton}
                          type="primary"
                          content="Checkout"
                          onClick={checkout}
                        />
                      </div>                 
                    </div>
                    
                    <hr className="divider" />
                  </div>
                )}
                
                <h3>{cartItems.length > 0 ? "You might also like" : "Suggestions"}</h3>
    
                <div className={shoppingCartStyles.productCardList}>
                  {productCards}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShoppingCart;