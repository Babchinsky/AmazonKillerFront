import ArrowUp from "../../assets/icons/arrow-up.svg?react";
import "./BackToTopButton.scss";

  
function BackToTopButton() {
  const handleScrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button className="back-to-top-button" onClick={handleScrollUp}>
      <ArrowUp className="arrow-up-icon" />
    </button>
  );
}

export default BackToTopButton;