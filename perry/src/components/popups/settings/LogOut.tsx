import TextButton from "../../buttons/Button";
import "./ChangeSettings.scss";


interface LogOutProps {
  onLogOut: () => void;
  onClose: () => void;
}

function LogOut(props: LogOutProps) {
  return (
    <>
      <div className="change-settings-overlay" onClick={() => props.onClose()}></div>

      <div className="small-change-settings-container">
        <div className="change-settings-content-container">
          <div className="center-title-container">
            <h3 className="title">Log out?</h3>
            <hr className="divider" />
          </div>

          <p className="center-description">You will log out of your account on this device.</p>

          <div className="change-settings-buttons-container">
            <TextButton className="change-settings-button" type="secondary" content="Cancel" onClick={() => props.onClose()} />
            <TextButton className="change-settings-button" type="primary" content="Log out" />
          </div>
        </div>
      </div>
    </>
  );
}

export default LogOut;