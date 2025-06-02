import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../state/store";
import { getCategories } from "../../../state/categories/categories-slice";
import Button from "../../buttons/Button";
import MenuHeaderComboBox from "../../combo-boxes/MenuHeaderComboBox";
import DoubleLeft from "../../../assets/icons/double-left.svg?react";
import bubble from "../../../assets/images/authentication/bubble.png";
import CloseMenu from "../../../assets/icons/close-menu.svg?react";
import SettingsIcon from "../../../assets/icons/settings.svg?react";
import FaqIcon from "../../../assets/icons/faq.svg?react";
import ExitIcon from "../../../assets/icons/exit.svg?react";
import LogoIcon from "../../../assets/icons/logo.svg?react";
import menuHeaderStyles from "./MenuHeader.module.scss";
import { getCssVariable } from "../../../utils/getCssVariable";
import { useBreakpoint } from "../../../utils/useBreakpoint";
import { logout } from "../../../state/auth/auth-slice";


interface MenuHeaderProps {
  onClose: () => void;
  onLogIn: () => void;
  onSignUp: () => void;
}

function MenuHeader(props: MenuHeaderProps) {
  const breakpointTablet = parseInt(getCssVariable("--breakpoint-tablet"), 10);
  const isTablet = useBreakpoint(breakpointTablet);
  
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories.categories);
  
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.accessToken);

  const clickLogout = async () => {
    await dispatch(logout());
    props.onClose();
    navigate("/");
    // window.location.reload();
  };

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <>
      <div className={menuHeaderStyles.overlay} onClick={props.onClose}></div>

      <button className={menuHeaderStyles.closeButton} onClick={props.onClose}>
        <DoubleLeft className={menuHeaderStyles.doubleLeftIcon} />
      </button>

      <div className={menuHeaderStyles.menuContainer}>
        <div className={menuHeaderStyles.contentContainer}>
          <div className={menuHeaderStyles.contentTopContainer}>
            <div className={menuHeaderStyles.authContainer}>
              <div className={menuHeaderStyles.authTopContainer}>
                <div>
                  <img alt="Account" src={bubble} />
                  <p className={menuHeaderStyles.fullName}>Not signed in</p>
                  <p className={menuHeaderStyles.role}>Log in to enjoy a more pleasant experience</p>
                </div>
                
                <button className={menuHeaderStyles.contentCloseButton} onClick={props.onClose}>
                  <CloseMenu className={menuHeaderStyles.closeMenuIcon} />
                </button>
              </div>
              
              {!isAuthenticated && (
                <div className={menuHeaderStyles.authBottomContainer}>
                  <Button className={menuHeaderStyles.signUpButton} type="primary" content="Sign up" onClick={props.onSignUp} />
                  <Button className={menuHeaderStyles.logInButton} type="secondary" content="Log in" onClick={props.onLogIn} />
                </div>
              )}
            </div>

            <hr className={`${menuHeaderStyles.contentDivider} divider`}></hr>

            <MenuHeaderComboBox 
              isOpen={true}
              categories={categories}
            />

            <hr className={`${menuHeaderStyles.contentDivider} divider`}></hr>

            <div className={menuHeaderStyles.settingsFaqContainer}>
              {isAuthenticated && (
                <div className={menuHeaderStyles.settingsContainer}>
                  <Link className={`${menuHeaderStyles.settingsLink} link minor-color-text-icon-link`} to="/account?tab=2">
                    <SettingsIcon className={menuHeaderStyles.settingsIcon} />
                    <p>Settings</p>
                  </Link>
                </div>
              )}
              <div className={menuHeaderStyles.faqContainer}>
                <Link className={`${menuHeaderStyles.faqLink} link minor-color-text-icon-link`} to="/">
                  <FaqIcon className={menuHeaderStyles.faqIcon} />
                  <p>Help & FAQ</p>
                </Link>
              </div>
            </div>

            <hr className={`${menuHeaderStyles.contentDivider} divider`}></hr>

            <div className={menuHeaderStyles.exitContainer}>
              <button 
                className={`${menuHeaderStyles.exitButton} link minor-color-text-icon-link`}
                onClick={clickLogout}
              >
                <ExitIcon className={menuHeaderStyles.exitIcon} />
                <p>{isTablet ? "Log out" : "Exit"}</p>
              </button>
            </div>
          </div>

          <div className={menuHeaderStyles.contentBottomContainer}>
            <hr className={`${menuHeaderStyles.contentDivider} divider`}></hr>

            <div className={menuHeaderStyles.logoContainer}>
              <Link className="link" to="/" onClick={props.onClose}>
                <LogoIcon className={menuHeaderStyles.logoIcon} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuHeader;