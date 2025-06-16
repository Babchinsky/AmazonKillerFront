import { getCssVariable } from "../../utils/getCssVariable";
import { useBreakpoint } from "../../utils/useBreakpoint";
import Button from "../../components/buttons/Button";
import ErrorPageNotFoundMobileImage from "../../assets/images/error/error-page-not-found-mobile.png";
import ErrorPageNotFoundDesktopImage from "../../assets/images/error/error-page-not-found-desktop.png";
import pageNotFoundStyles from "./PageNotFound.module.scss";


function PageNotFound() {
  const breakpointTablet = parseInt(getCssVariable("--breakpoint-tablet"), 10);
  const isTablet = useBreakpoint(breakpointTablet);
  
  const errorPageNotFound = isTablet ? ErrorPageNotFoundDesktopImage : ErrorPageNotFoundMobileImage;
  
  return (
    <div className="page appear-transition">
      <main className={pageNotFoundStyles.pageNotFoundMain}>
        <div className={pageNotFoundStyles.pageNotFoundContainer}>
          <div className={pageNotFoundStyles.pageNotFoundContentContainer}>
            <img alt="Banner" src={errorPageNotFound} />

            <h3>This page has gone fishing...</h3>
            <Button className={pageNotFoundStyles.returnToMainPageButton} type="primary" content="Return to main page" linkTo="/" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default PageNotFound;