import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../state/store";
import { getCurrentUser } from "../../../state/account/account-slice";
import { logout } from "../../../state/auth/auth-slice";
import { getRootCategories } from "../../../state/categories/categories-slice";
import { getCssVariable } from "../../../utils/getCssVariable";
import { useBreakpoint } from "../../../utils/useBreakpoint";
import { useIsProtectedRoute } from "../../../utils/useIsProtectedRoute";
import Button from "../../buttons/Button";
import MenuHeaderComboBox from "../../combo-boxes/MenuHeaderComboBox";
import LogOut from "../account/LogOut";
import BubbleImage from "../../../assets/images/authentication/bubble.png";
import CloseMenuIcon from "../../../assets/icons/close-menu.svg?react";
import DoubleLeftIcon from "../../../assets/icons/double-left.svg?react";
import SettingsIcon from "../../../assets/icons/settings.svg?react";
import FaqIcon from "../../../assets/icons/faq.svg?react";
import ExitIcon from "../../../assets/icons/exit.svg?react";
import LogoIcon from "../../../assets/icons/logo.svg?react";
import menuHeaderStyles from "./MenuHeader.module.scss";


interface MenuHeaderProps {
  onClose: () => void;
  onLogIn: () => void;
  onSignUp: () => void;
}

function MenuHeader(props: MenuHeaderProps) {
  const breakpointTablet = parseInt(getCssVariable("--breakpoint-tablet"), 10);
  const isTablet = useBreakpoint(breakpointTablet);
  
  const dispatch = useDispatch<AppDispatch>();
  const rootCategories = useSelector((state: RootState) => state.categories.rootCategories);
  const { user, loading } = useSelector((state: RootState) => state.account);
  
  const [isLogOutOpen, setIsLogOutOpen] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const isProtectedRoute = useIsProtectedRoute();

  const logOut = async () => {
    await dispatch(logout());
    props.onClose();
    
    if (isProtectedRoute) {
      navigate("/");
    }
  };

  useEffect(() => {
    dispatch(getRootCategories());
    dispatch(getCurrentUser());
  }, []);

  return (
    <>
      {!isLogOutOpen && (
        <>
          <div className={menuHeaderStyles.overlay} onClick={props.onClose}></div>

          <button className={menuHeaderStyles.closeButton} onClick={props.onClose}>
            <DoubleLeftIcon className={menuHeaderStyles.doubleLeftIcon} />
          </button>

          <div className={menuHeaderStyles.menuContainer}>
            <div className={menuHeaderStyles.contentContainer}>
              <div className={menuHeaderStyles.contentTopContainer}>
                <div className={menuHeaderStyles.authContainer}>
                  <div className={menuHeaderStyles.authTopContainer}>
                    <div>
                      <img alt="Account" src={BubbleImage} />
                      <p className={menuHeaderStyles.fullName}>{user ? `${user.firstName} ${user.lastName}` : "Not signed in"}</p>
                      <p className={menuHeaderStyles.role}>{user ? user.role : "Log in to enjoy a more pleasant experience"}</p>
                    </div>
                    
                    <button className={menuHeaderStyles.contentCloseButton} onClick={props.onClose}>
                      <CloseMenuIcon className={menuHeaderStyles.closeMenuIcon} />
                    </button>
                  </div>
                  
                  {!user && (
                    <div className={menuHeaderStyles.authBottomContainer}>
                      <Button type="primary" content="Sign up" onClick={props.onSignUp} />
                      <Button type="secondary" content="Log in" onClick={props.onLogIn} />
                    </div>
                  )}
                </div>

                <hr className="divider" />

                <MenuHeaderComboBox 
                  isOpen={true}
                  categories={rootCategories}
                />

                <hr className="divider" />

                <div className={menuHeaderStyles.settingsFaqContainer}>
                  {user && (
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

                {user && (
                  <>
                    <hr className="divider" />

                    <div className={menuHeaderStyles.exitContainer}>
                      <button 
                        className={`${menuHeaderStyles.exitButton} link minor-color-text-icon-link`}
                        onClick={() => setIsLogOutOpen(true)}
                      >
                        <ExitIcon className={menuHeaderStyles.exitIcon} />
                        <p>{isTablet ? "Log out" : "Exit"}</p>
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className={menuHeaderStyles.contentBottomContainer}>
                <hr className="divider" />

                <div className={menuHeaderStyles.logoContainer}>
                  <Link className="link" to="/" onClick={props.onClose}>
                    <LogoIcon className={menuHeaderStyles.logoIcon} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isLogOutOpen && <LogOut onLogOut={logOut} onClose={() => setIsLogOutOpen(false)} />}
    </>
  );
}

export default MenuHeader;