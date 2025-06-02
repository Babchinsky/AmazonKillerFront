import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import MenuHeader from "./popups/menu/MenuHeader";
import Authentication from "./popups/authentication/Authentication";
import MenuIcon from "../assets/icons/menu.svg?react";
import LogoIcon from "../assets/icons/logo.svg?react";
import SearchIcon from "../assets/icons/search.svg?react";
import UserIcon from "../assets/icons/user.svg?react";
import CartEmptyIcon from "../assets/icons/cart-empty.svg?react";
import headerStyles from "./Header.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";


interface HeaderProps {
  searchBar: boolean;
  cart: boolean;
}
  
function Header(props: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authType, setAuthType] = useState<"logIn" | "signUp">("logIn");
  
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.accessToken);

  const userClick = () => {
    if (isAuthenticated) {
      navigate("/account");
    } 
    else {
      setIsAuthOpen(true);
    }
  };

  const authClick = (type: "logIn" | "signUp") => {
    setIsMenuOpen(false);

    setAuthType(type);
    setIsAuthOpen(true);
  };

  useEffect(() => {
    const action = isMenuOpen || isAuthOpen ? "add" : "remove";
    document.body.classList[action]("body-no-scroll");
    document.documentElement.classList[action]("html-no-scroll");

    return () => {
      document.body.classList.remove("body-no-scroll");
      document.documentElement.classList.remove("html-no-scroll");
    };
  }, [isMenuOpen, isAuthOpen]);

  useEffect(() => {
    if (!isAuthOpen) {
      setAuthType("logIn");
    }
  }, [isAuthOpen]);

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
              <button className={headerStyles.cartButton}>
                <CartEmptyIcon className={`${headerStyles.cartEmptyIcon} main-color-text-icon`} />
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
      {isAuthOpen && <Authentication type={authType} onClose={() => setIsAuthOpen(false)} />}
    </>
  );
}

export default Header;