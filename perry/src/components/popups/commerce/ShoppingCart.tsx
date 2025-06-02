import TextButton from "../../buttons/Button";
import CartEmpty from "../../../assets/icons/cart-empty.svg?react";
import Close from "../../../assets/icons/close.svg?react";
import "./Commerce.scss";
import "./ShoppingCart.scss";


interface ShoppingCartProps {
  onClose: () => void;
}

function ShoppingCart(props: ShoppingCartProps) {
  return (
    <>
      <div className="commerce-overlay" onClick={() => props.onClose()}></div>

      <div className="commerce-container">
        <div className="commerce-content-container">
          <div className="commerce-content-top-container">
            <div className="title-container">
              <CartEmpty className="cart-empty-icon" />
              <h3 className="title">Shopping Cart</h3>

              <button className="close-button">
                <Close className="close-icon" />
              </button>
            </div>

            <hr className="divider" />

            {/* <div>
              <h3>No items added</h3>
              <p>Browse to find your perfect product :)</p>
            </div> */}
            {/* <div>
              <h3>Not logged in</h3>
              <p>Log in to enjoy the best experience on PERRY</p>
            </div> */}
          </div>

          <div className="commerce-content-bottom-container">
            <h3 className="title">Suggestions</h3>

            <div>

            </div>
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

export default ShoppingCart;