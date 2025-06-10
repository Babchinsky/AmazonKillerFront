import { useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { getCategories } from "../../state/categories/categories-slice";
import TextButton from "../buttons/TextButton";
import MenuHeaderComboBox from "../combo-boxes/MenuHeaderComboBox";
import DoubleLeft from "../../assets/icons/double-left.svg?react";
import bubble from "../../assets/images/authentication/bubble.png";
import CloseMenu from "../../assets/icons/close-menu.svg?react";
import Faq from "../../assets/icons/faq.svg?react";
import Logo from "../../assets/icons/logo.svg?react";
import "./MenuHeader.scss";


interface MenuHeaderProps {
  onClose: () => void;
  onLogIn: () => void;
  onSignUp: () => void;
}

function MenuHeader(props: MenuHeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories.categories);
  
  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <>
      <div className="menu-overlay" onClick={props.onClose}></div>

      <button className="menu-close-button" onClick={props.onClose}>
        <DoubleLeft className="double-left-icon" />
      </button>

      <div className="menu-container">
        <div className="menu-content-container">
          <div className="menu-content-top-container">
            <div className="menu-auth-container">
              <div className="menu-auth-top-container">
                <div>
                  <img className="menu-auth-image" alt="Profile" src={bubble} />
                  <p className="username">Not signed in</p>
                  <p className="user-role">Log in to enjoy a more pleasant experience</p>
                </div>
                
                <button className="close-button" onClick={props.onClose}>
                  <CloseMenu className="close-menu-icon" />
                </button>
              </div>
              
              <div className="menu-auth-bottom-container">
                <TextButton className="sign-up-button" type="primary" content="Sign up" onClick={props.onSignUp} />
                <TextButton className="log-in-button" type="secondary" content="Log in" onClick={props.onLogIn} />
              </div>
            </div>

            <hr className="divider"></hr>

            <MenuHeaderComboBox 
              isOpen={true}
              categories={categories}
            />

            <hr className="divider"></hr>

            <div className="faq-container">
              <Link className="faq-link" to="/">
                <Faq className="faq-icon" />
                <p>Help & FAQ</p>
              </Link>
            </div>
          </div>

          <div className="menu-content-bottom-container">
            <hr className="divider"></hr>

            <div className="logo-container">
              <Link className="link" to="/" onClick={props.onClose}>
                <Logo className="logo-icon" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuHeader;