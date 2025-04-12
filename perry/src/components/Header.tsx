import { Link } from "react-router";
import Menu from "../assets/icons/menu.svg?react";
import Logo from "../assets/icons/logo.svg?react";
import Search from "../assets/icons/search.svg?react";
import User from "../assets/icons/user.svg?react";
import CartEmpty from "../assets/icons/cart-empty.svg?react";
import "./Header.scss";


interface HeaderProps {
  searchBar: boolean;
  cart: boolean;
}
  
function Header(props: HeaderProps) {
  return (
    <header className="header-container">
      <div className="header-left-container">
        <button className="menu-button">
          <Menu className="menu-icon" />
        </button>

        <div className="logo-container">
          <Link to="/">
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

      <div className="header-right-container">
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
  );
}

export default Header;