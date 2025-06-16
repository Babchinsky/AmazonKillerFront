import Button from "../../buttons/Button";
import accountPopupStyles from "./AccountPopup.module.scss";


interface RemoveWishlistItemProps {
  onRemove: () => void;
  onClose: () => void;
}

function RemoveWishlistItem(props: RemoveWishlistItemProps) {
  return (
    <>
      <div className={accountPopupStyles.overlay} onClick={() => props.onClose()}></div>

      <div className={accountPopupStyles.smallChangeSettingsContainer}>
        <div className={accountPopupStyles.contentContainer}>
          <div className={accountPopupStyles.titleCenterContainer}>
            <h3 className={accountPopupStyles.title}>Are you sure?</h3>
            <hr className={`${accountPopupStyles.divider} divider`} />
          </div>

          <p className={accountPopupStyles.descriptionCenter}>This action will remove this item from your wishlist.</p>

          <div className={accountPopupStyles.buttonsContainer}>
            <Button type="secondary" content="Cancel" onClick={() => props.onClose()} />
            <Button type="primary" content="Remove" onClick={() => props.onRemove()} />
          </div>
        </div>
      </div>
    </>
  );
}

export default RemoveWishlistItem;