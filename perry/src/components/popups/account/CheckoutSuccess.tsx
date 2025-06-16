import { useNavigate } from "react-router";
import Button from "../../buttons/Button";
import accountPopupStyles from "./AccountPopup.module.scss";
import checkoutSuccessStyles from "./CheckoutSuccess.module.scss";


function CheckoutSuccess() {
  const navigate = useNavigate();
  
  return (
    <>
      <div className={accountPopupStyles.overlay}></div>

      <div className={accountPopupStyles.smallChangeSettingsContainer}>
        <div className={accountPopupStyles.contentContainer}>
          <div className={accountPopupStyles.titleCenterContainer}>
            <h3 className={accountPopupStyles.title}>Success!</h3>
            <hr className={`${accountPopupStyles.divider} divider`} />
          </div>

          <p className={accountPopupStyles.descriptionCenter}>Your order was placed successfully!</p>

          <div className={checkoutSuccessStyles.buttonsContainer}>
            <Button type="primary" content="To main page" onClick={() => navigate("/")} />
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckoutSuccess;