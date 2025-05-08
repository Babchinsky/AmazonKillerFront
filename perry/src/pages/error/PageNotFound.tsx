import { getCssVariable } from "../../utils/getCssVariable";
import { useBreakpoint } from "../../utils/useBreakpoint";
import TextButton from "../../components/buttons/TextButton";
import errorPageNotFoundMobile from "../../assets/images/error/error-page-not-found-mobile.png";
import errorPageNotFoundDesktop from "../../assets/images/error/error-page-not-found-desktop.png";
import "./PageNotFound.scss";


function PageNotFound() {
  const breakpointTablet = parseInt(getCssVariable("--breakpoint-tablet"), 10);
  const isTablet = useBreakpoint(breakpointTablet);
  const errorPageNotFound = isTablet ? errorPageNotFoundDesktop : errorPageNotFoundMobile;
  
  return (
    <div className="page-not-found-container">
      <div className="page-not-found-content-container">
        <img className="page-not-found-content-image" alt="Banner" src={errorPageNotFound} />

        <h3 className="page-not-found-content-title">This page has gone fishing...</h3>
        <TextButton className="return-to-main-page-button" type="primary" content="Return to main page" linkTo="/" />
      </div>
    </div>
  );
}

export default PageNotFound;