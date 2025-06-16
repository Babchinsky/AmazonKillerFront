import Button from "../../buttons/Button";
import accountPopupStyles from "./AccountPopup.module.scss";


interface DeleteAccountProps {
  onDelete: () => void;
  onClose: () => void;
}

function DeleteAccount(props: DeleteAccountProps) {
  return (
    <>
      <div className={accountPopupStyles.overlay} onClick={() => props.onClose()}></div>

      <div className={accountPopupStyles.smallChangeSettingsContainer}>
        <div className={accountPopupStyles.contentContainer}>
          <div className={accountPopupStyles.titleCenterContainer}>
            <h3 className={accountPopupStyles.title}>Delete account?</h3>
            <hr className={`${accountPopupStyles.divider} divider`} />
          </div>

          <p className={accountPopupStyles.descriptionCenter}>
            This action will permanently remove your profile and correlated data.<br/><br/>
            Once clicked, all associated information, including orders, wishlisted items, and settings, is irreversibly erased from the system.<br/><br/>
            Do you wish to proceed?
          </p>

          <div className={accountPopupStyles.buttonsContainer}>
            <Button type="primary" content="Cancel" onClick={() => props.onClose()} />
            <Button type="destructive" content="Delete account" onClick={() => props.onDelete()} />
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteAccount;