import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { getCssVariable } from "../../utils/getCssVariable";
import { useBreakpoint } from "../../utils/useBreakpoint";
import CrumbType from "../../types/crumb-type";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import TermsAndConditions from "../../components/legal-notice/TermsAndConditions";
import LicenseAgreement from "../../components/legal-notice/LicenseAgreement";
import PrivacyPolicy from "../../components/legal-notice/PrivacyPolicy";
import Footer from "../../components/Footer";
import ArrowLeft from "../../assets/icons/arrow-left.svg?react";
import "./LegalNotice.scss";


function LegalNotice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const initialTab = tab !== null ? parseInt(tab) : -1;
  const [currentTab, setCurrentTab] = useState<number>(initialTab);

  const content = useRef<HTMLDivElement>(null);

  const breakpointDesktop = parseInt(getCssVariable("--breakpoint-desktop"), 10);
  const isDesktop = useBreakpoint(breakpointDesktop);

  const [crumbs, setCrumbs] = useState<CrumbType[]>([
    { name: "Home", path: "/" },
    { name: "Legal notice", path: "/legal-notice" }
  ]);

  const selectTab = (index: number) => {
    setCurrentTab(index);
    setSearchParams({ tab: index.toString() });
  };

  const clickBack = () => {
    setCurrentTab(-1);
    setSearchParams();
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const tabIndex = tabParam !== null ? parseInt(tabParam, 10) : -1;

    if (tabIndex !== currentTab) {
      setCurrentTab(tabIndex);
    }
  }, [searchParams]);

  useEffect(() => {
    if (content.current) {
      content.current.scrollTop = 0;
    }
  }, [currentTab]);

  useEffect(() => {
    if (isDesktop) {
      if (currentTab === -1) {
        setCurrentTab(0);
        setSearchParams({ tab: "0" });
      }
    } 
    else {
      if (currentTab !== -1) {
        setCurrentTab(-1);
        setSearchParams({});
      }
    }
  }, [isDesktop]);

  return (
    <>
      <Header searchBar={true} cart={true}></Header>

      <section className="legal-notice-content-section">
        <div className="legal-notice-content-container">
          <div className="legal-notice-content-top-container">
            {currentTab === -1 ? (
              <Breadcrumb className="legal-notice-breadcrumb" crumbs={crumbs} />
            ) : (
              <div className="back-button-container">
                <button className="back-button" onClick={clickBack}>
                  <ArrowLeft className="arrow-left-icon" />
                  <span>Back</span>
                </button>
              </div>
            )}
          </div>

          <div className="legal-notice-content-bottom-container">
            <div className="content-container">
              {(isDesktop || currentTab === -1) && (
                <div className="content-left-container">
                  <h3>Legal notice</h3>
                  <div className="tabs-container">
                    <button className={`${currentTab === 0 ? "selected-tab" : "tab"}`} onClick={() => selectTab(0)}>Terms and conditions</button>
                    <button className={`${currentTab === 1 ? "selected-tab" : "tab"}`} onClick={() => selectTab(1)}>License agreement</button>
                    <button className={`${currentTab === 2 ? "selected-tab" : "tab"}`} onClick={() => selectTab(2)}>Privacy policy</button>
                  </div>
                </div>
              )}

              {isDesktop && (
                <div className="content-container-divider divider" />
              )}

              {currentTab !== -1 && (
                <div className="content-right-container" ref={content}>
                  {currentTab === 0 && <TermsAndConditions />}
                  {currentTab === 1 && <LicenseAgreement />}
                  {currentTab === 2 && <PrivacyPolicy />}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer></Footer>
    </>
  );
}

export default LegalNotice;