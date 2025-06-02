import { useEffect, useState } from "react";
import Button from "../buttons/Button";
import ChangeName from "../popups/settings/ChangeName";
import ChangeEmail from "../popups/settings/ChangeEmail";
import ChangePassword from "../popups/settings/ChangePassword";
import LogOut from "../popups/settings/LogOut";
import DeleteAccount from "../popups/settings/DeleteAccount";
import InfoIcon from "../../assets/icons/info.svg?react";
import accountDataStyles from "./AccountData.module.scss";
import accountSettingsStyles from "./AccountSettings.module.scss";


function AccountSettings() {
  const [isPhotoTooltipVisible, setIsPhotoTooltipVisible] = useState(false);
  
  const [isChangeNameOpen, setIsChangeNameOpen] = useState<boolean>(false);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [isLogOutOpen, setIsLogOutOpen] = useState<boolean>(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState<boolean>(false);

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
  }, [
    isChangeNameOpen,
    isChangeEmailOpen,
    isChangePasswordOpen,
    isLogOutOpen,
    isDeleteAccountOpen,
  ]);

  return (
    <>
      <div className={accountDataStyles.accountDataContainer}>
        <h1>Account settings</h1>
  
        <hr className={`${accountDataStyles.accountDataDivider} divider`} />

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
                  <p>
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
                  </p>
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
              
              <p className={accountSettingsStyles.data}>John Doe</p>
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
              
              <p className={accountSettingsStyles.data}>johndoe@gmail.com</p>
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
  
      {isChangeNameOpen && <ChangeName onChange={() => {}} onClose={() => setIsChangeNameOpen(false)} />}
      {isChangeEmailOpen && <ChangeEmail onChange={() => {}} onClose={() => setIsChangeEmailOpen(false)} />}
      {isChangePasswordOpen && <ChangePassword onChange={() => {}} onClose={() => setIsChangePasswordOpen(false)} />}
      {isLogOutOpen && <LogOut onLogOut={() => {}} onClose={() => setIsLogOutOpen(false)} />}
      {isDeleteAccountOpen && <DeleteAccount onDelete={() => {}} onClose={() => setIsDeleteAccountOpen(false)} />}
    </>
  );
}

export default AccountSettings;