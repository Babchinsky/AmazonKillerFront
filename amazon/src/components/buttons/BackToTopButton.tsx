import "./BackToTopButton.scss";

  
function BackToTopButton() {
  return (
    <>
      <button className="back-to-top-button">
        <svg className="arrow-up-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.252 15.8702L12.936 7.89617C12.408 7.38617 11.568 7.38617 11.04 7.89617L2.74805 15.8702" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}

export default BackToTopButton;