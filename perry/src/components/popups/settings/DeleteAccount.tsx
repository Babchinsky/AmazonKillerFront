import TextButton from "../../buttons/Button";
import "./ChangeSettings.scss";


interface DeleteAccountProps {
  onDelete: () => void;
  onClose: () => void;
}

function DeleteAccount(props: DeleteAccountProps) {
  return (
    <>
      <div className="change-settings-overlay" onClick={() => props.onClose()}></div>

      <div className="small-change-settings-container">
        <div className="change-settings-content-container">
          <div className="center-title-container">
            <h3 className="title">Delete account?</h3>
            <hr className="divider" />
          </div>

          <p className="center-description">
            This action will permanently remove your profile and correlated data.<br/><br/>
            Once clicked, all associated information, including orders, wishlisted items, and settings, is irreversibly erased from the system.<br/><br/>
            Do you wish to proceed?
          </p>

          <div className="change-settings-buttons-container">
            <TextButton className="change-settings-button" type="primary" content="Cancel" onClick={() => props.onClose()} />
            <TextButton className="change-settings-button" type="destructive" content="Delete account" />
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteAccount;