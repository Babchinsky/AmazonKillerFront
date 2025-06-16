import Button from "../../buttons/Button";
import accountPopupStyles from "./AccountPopup.module.scss";


interface LogOutProps {
  onLogOut: () => void;
  onClose: () => void;
}

function LogOut(props: LogOutProps) {
  return (
    <>
      <div className={accountPopupStyles.overlay} onClick={() => props.onClose()}></div>

      <div className={accountPopupStyles.smallChangeSettingsContainer}>
        <div className={accountPopupStyles.contentContainer}>
          <div className={accountPopupStyles.titleCenterContainer}>
            <h3 className={accountPopupStyles.title}>Log out?</h3>
            <hr className={`${accountPopupStyles.divider} divider`} />
          </div>

          <p className={accountPopupStyles.descriptionCenter}>You will log out of your account on this device.</p>

          <div className={accountPopupStyles.buttonsContainer}>
            <Button type="secondary" content="Cancel" onClick={() => props.onClose()} />
            <Button type="primary" content="Log out" onClick={() => props.onLogOut()} />
          </div>
        </div>
      </div>
    </>
  );
}

export default LogOut;