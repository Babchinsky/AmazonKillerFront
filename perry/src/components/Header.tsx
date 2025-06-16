import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import { setAuthModalOpen, setAuthType } from "../state/auth/auth-slice";
import MenuHeader from "./popups/menu/MenuHeader";
import ShoppingCart from "./popups/commerce/ShoppingCart";
import MenuIcon from "../assets/icons/menu.svg?react";
import LogoIcon from "../assets/icons/logo.svg?react";
import SearchIcon from "../assets/icons/search.svg?react";
import UserIcon from "../assets/icons/user.svg?react";
import CartEmptyIcon from "../assets/icons/cart-empty.svg?react";
import headerStyles from "./Header.module.scss";


interface HeaderProps {
  searchBar: boolean;
  cart: boolean;
}
  
function Header(props: HeaderProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isShoppingCartOpen, setIsShoppingCartOpen] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const getFormattedCartCount = (count: number) => {
    return count > 9 ? "9+" : count.toString();
  }

  const userClick = () => {
    if (accessToken) {
      navigate("/account?tab=0");
    } 
    else {
      dispatch(setAuthType("logIn"));
      dispatch(setAuthModalOpen(true));
    }
  };

  const authClick = (type: "logIn" | "signUp") => {
    setIsMenuOpen(false);

    dispatch(setAuthType(type));
    dispatch(setAuthModalOpen(true));
  };

  useEffect(() => {
    const action = isMenuOpen || isShoppingCartOpen ? "add" : "remove";
    document.body.classList[action]("body-no-scroll");
    document.documentElement.classList[action]("html-no-scroll");

    return () => {
      document.body.classList.remove("body-no-scroll");
      document.documentElement.classList.remove("html-no-scroll");
    };
  }, [isMenuOpen, isShoppingCartOpen]);

  return (
    <>
      <header>
        <div className={headerStyles.headerContainer}>
          <div className={headerStyles.leftContainer}>
            <button className={headerStyles.menuButton} onClick={() => setIsMenuOpen(true)}>
              <MenuIcon className={`${headerStyles.menuIcon} main-color-text-icon`} />
            </button>

            <div className={headerStyles.logoContainer}>
              <Link className="link" to="/">
                <LogoIcon className={headerStyles.logoIcon} />
              </Link>
            </div>
          </div>

          <div className={`${headerStyles.searchBarContainer} ${!props.searchBar ? "hidden" : ""}`}>
            <input placeholder="Search..." />
            <button>
              <SearchIcon className={headerStyles.searchIcon} />
            </button>
          </div>

          <div className={headerStyles.rightContainer}>
            <button className={headerStyles.userButton} onClick={userClick}>
              <UserIcon className={`${headerStyles.userIcon} main-color-text-icon`} />
            </button>
            
            {props.cart && (
              <button className={headerStyles.cartButton} onClick={() => setIsShoppingCartOpen(true)}>
                <CartEmptyIcon className={`${headerStyles.cartIcon} main-color-text-icon`} />
                {cartItemCount > 0 && (
                  <div className={headerStyles.cartBadge}>
                    {getFormattedCartCount(cartItemCount)}
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </header>
      
      {isMenuOpen && (
        <MenuHeader 
          onClose={() => setIsMenuOpen(false)} 
          onLogIn={() => authClick("logIn")}
          onSignUp={() => authClick("signUp")}
        />
      )}

      {isShoppingCartOpen && (
        <ShoppingCart 
          onClose={() => setIsShoppingCartOpen(false)}
        />
      )}
    </>
  );
}

export default Header;