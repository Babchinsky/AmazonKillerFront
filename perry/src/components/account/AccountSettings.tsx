import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AppDispatch, RootState } from "../../state/store";
import { logout } from "../../state/auth/auth-slice";
import { clearAccountState, deleteAccount } from "../../state/account/account-slice";
import Button from "../buttons/Button";
import ChangeName from "../popups/account/ChangeName";
import ChangeEmail from "../popups/account/ChangeEmail";
import ChangePassword from "../popups/account/ChangePassword";
import LogOut from "../popups/account/LogOut";
import DeleteAccount from "../popups/account/DeleteAccount";
import InfoIcon from "../../assets/icons/info.svg?react";
import accountDataStyles from "./AccountData.module.scss";
import accountSettingsStyles from "./AccountSettings.module.scss";


function AccountSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.account);
  
  const [isPhotoTooltipVisible, setIsPhotoTooltipVisible] = useState(false);
  
  const [isChangeNameOpen, setIsChangeNameOpen] = useState<boolean>(false);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [isLogOutOpen, setIsLogOutOpen] = useState<boolean>(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState<boolean>(false);

  const clickLogOut = async () => {
    await dispatch(logout());
    setIsLogOutOpen(false);
    navigate("/");
  };

  const clickDelete = async () => {
    await dispatch(deleteAccount());
    dispatch(clearAccountState());
    navigate("/");  
  }

  useEffect(() => {
    const isAnyPopupOpen =
      isChangeNameOpen ||
      isChangeEmailOpen ||
      isChangePasswordOpen ||
      isLogOutOpen ||
      isDeleteAccountOpen;

    const action = isAnyPopupOpen ? "add" : "remove";
    document.body.classList[action]("body-no-scroll");
    document.documentElement.classList[action]("html-no-scroll");

    return () => {
      document.body.classList.remove("body-no-scroll");
      document.documentElement.classList.remove("html-no-scroll");
    };
  }, [isChangeNameOpen ||
    isChangeEmailOpen ||
    isChangePasswordOpen ||
    isLogOutOpen ||
    isDeleteAccountOpen]);

  return (
    <>
      <div className={accountDataStyles.accountDataContainer}>
        <div className={accountDataStyles.accountDataTopContainer}>
          <h1>Account settings</h1>
          <hr className={`${accountDataStyles.accountDataDivider} divider`} />
        </div>

        <div className={accountDataStyles.accountDataBottomContainer}>
          <div className={accountSettingsStyles.settingsListContainer}>
            <div className={accountSettingsStyles.settingsContainer}>
              <div className={accountSettingsStyles.settingsLeftContainer}>
                <div>
                  <p>Profile photo</p>
                  <p className={accountSettingsStyles.description}>
                    Change your profile picture.
                  </p>
                </div>
              </div>
    
              <div className={accountSettingsStyles.settingsRightContainer}>
                <Button className={accountSettingsStyles.settingsButton} type="secondary" content="Change photo" />
                <button
                  className={accountSettingsStyles.infoButton}
                  onMouseEnter={() => setIsPhotoTooltipVisible(true)}
                  onMouseLeave={() => setIsPhotoTooltipVisible(false)}
                >
                  <InfoIcon className={accountSettingsStyles.infoIcon} />
                </button>

                {isPhotoTooltipVisible && (
                  <div className={accountSettingsStyles.imageRequirementsContainer}>
                    <p className={accountSettingsStyles.title}>Image requirements</p>
                    <div>
                      Please note that the uploaded image must meet the following requirements:
                      <ul className={accountSettingsStyles.requirementsList}>
                        <li className={accountSettingsStyles.requirement}>
                          Maximum file size: 5 MB
                        </li>
                        <li className={accountSettingsStyles.requirement}>
                          Acceptable formats: JPEG, PNG
                        </li>
                      </ul>
                      Images exceeding this size or in other formats will not be accepted. Please ensure your files are optimized and comply with the specified parameters.
                    </div>
                  </div>
                )}
              </div>
            </div>
    
            <div className={accountSettingsStyles.settingsContainer}>
              <div className={accountSettingsStyles.settingsLeftContainer}>
                <div>
                  <p>First name and last name</p>
                  <p className={accountSettingsStyles.description}>
                    Update your first and last name for your profile where it's displayed.
                  </p>
                </div>
                
                <p className={accountSettingsStyles.data}>{`${user?.firstName} ${user?.lastName}`}</p>
              </div>
    
              <div className={accountSettingsStyles.settingsRightContainer}>
                <Button className={`${accountSettingsStyles.settingsButton} ${accountSettingsStyles.changeNameButton}`} type="secondary" content="Change name" onClick={() => setIsChangeNameOpen(true)} />
              </div>
            </div>
    
            <div className={accountSettingsStyles.settingsContainer}>
              <div className={accountSettingsStyles.settingsLeftContainer}>
                <div>
                  <p>Email</p>
                  <p className={accountSettingsStyles.description}>
                    Update the email address associated with your account.
                  </p>
                </div>
                
                <p className={accountSettingsStyles.data}>{user?.email}</p>
              </div>
    
              <div className={accountSettingsStyles.settingsRightContainer}>
                <Button className={`${accountSettingsStyles.settingsButton} ${accountSettingsStyles.changeEmailButton}`} type="secondary" content="Change email" onClick={() => setIsChangeEmailOpen(true)} />
              </div>
            </div>
    
            <div className={accountSettingsStyles.settingsContainer}>
              <div className={accountSettingsStyles.settingsLeftContainer}>
                <div>
                  <p>Password</p>
                  <p className={accountSettingsStyles.description}>
                    Change your account's password.
                  </p>
                </div>
                
                <p className={accountSettingsStyles.data}>***************</p>
              </div>
    
              <div className={accountSettingsStyles.settingsRightContainer}>
                <Button className={`${accountSettingsStyles.settingsButton} ${accountSettingsStyles.changePasswordButton}`} type="secondary" content="Change password" onClick={() => setIsChangePasswordOpen(true)} />
              </div>
            </div>
    
            <div className={accountSettingsStyles.settingsContainer}>
              <div className={accountSettingsStyles.settingsLeftContainer}>
                <div>
                  <p>Log out</p>
                  <p className={accountSettingsStyles.description}>
                    Ends current session, disconnecting user from account or system.
                  </p>
                </div>
              </div>
    
              <div className={accountSettingsStyles.settingsRightContainer}>
                <Button className={accountSettingsStyles.settingsButton} type="secondary" content="Log out" onClick={() => setIsLogOutOpen(true)} />
              </div>
            </div>
    
            <div className={accountSettingsStyles.settingsContainer}>
              <div className={accountSettingsStyles.settingsLeftContainer}>
                <div>
                  <p>Delete account</p>
                  <p className={accountSettingsStyles.description}>
                    Permanently remove your account and associated data, disabling access and erasing personal InfoIconrmation.
                  </p>
                </div>
              </div>
    
              <div className={accountSettingsStyles.settingsRightContainer}>
                <Button className={accountSettingsStyles.settingsButton} type="destructive" content="Delete" onClick={() => setIsDeleteAccountOpen(true)} />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {user && (
        <>
          {isChangeNameOpen && <ChangeName onClose={() => setIsChangeNameOpen(false)} />}
          {isChangeEmailOpen && <ChangeEmail email={user.email} onChange={() => {}} onClose={() => setIsChangeEmailOpen(false)} />}
          {isChangePasswordOpen && <ChangePassword onClose={() => setIsChangePasswordOpen(false)} />}
          {isLogOutOpen && <LogOut onLogOut={clickLogOut} onClose={() => setIsLogOutOpen(false)} />}
          {isDeleteAccountOpen && <DeleteAccount onDelete={clickDelete} onClose={() => setIsDeleteAccountOpen(false)} />}
        </>
      )}
    </>
  );
}

export default AccountSettings;