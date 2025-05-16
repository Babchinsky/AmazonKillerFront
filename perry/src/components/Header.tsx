import { useEffect, useState } from "react";
import { Link } from "react-router";
import Menu from "../assets/icons/menu.svg?react";
import Logo from "../assets/icons/logo.svg?react";
import Search from "../assets/icons/search.svg?react";
import User from "../assets/icons/user.svg?react";
import CartEmpty from "../assets/icons/cart-empty.svg?react";
import MenuHeader from "./menu/MenuHeader";
import Authentication from "./authentication/Authentication";
import "./Header.scss";


interface HeaderProps {
  searchBar: boolean;
  cart: boolean;
}
  
function Header(props: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authType, setAuthType] = useState<"logIn" | "signUp">("logIn");
  
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
      <header className="header-container">
        <div className="header-left-container">
          <button className="menu-button" onClick={() => setIsMenuOpen(true)}>
            <Menu className="menu-icon" />
          </button>

          <div className="logo-container">
            <Link className="link" to="/">
              <Logo className="logo-icon" />
            </Link>
          </div>
        </div>

        <div className={`search-bar-container ${!props.searchBar ? "hidden" : ""}`}>
          <input className="search-bar-input" placeholder="Search..." />
          <button className="search-bar-button">
            <Search className="search-icon" />
          </button>
        </div>

        <div className="header-right-container" onClick={() => setIsAuthOpen(true)}>
          <button className="user-button">
            <User className="user-icon" />
          </button>
          
          {props.cart && (
            <button className="cart-button">
              <CartEmpty className="cart-icon" />
            </button>
          )}
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