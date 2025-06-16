import Button from "./Button";
import ArrowUpIcon from "../../assets/icons/arrow-up.svg?react";
import buttonStyles from "./BackToTopButton.module.scss";


function BackToTopButton() {
  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      className={buttonStyles.button}
      type="primary"
      leftIcon={<ArrowUpIcon className={buttonStyles.arrowUpIcon} />}
      onClick={scrollUp}
    />
  );
}

export default BackToTopButton;