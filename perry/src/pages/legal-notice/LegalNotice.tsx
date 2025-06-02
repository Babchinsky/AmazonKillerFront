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
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg?react";
import legalNoticeStyles from "./LegalNotice.module.scss";


function LegalNotice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const initialTab = tab !== null ? parseInt(tab) : -1;
  const [currentTab, setCurrentTab] = useState<number>(initialTab);

  const breakpointDesktop = parseInt(getCssVariable("--breakpoint-desktop"), 10);
  const isDesktop = useBreakpoint(breakpointDesktop);

  const content = useRef<HTMLDivElement>(null);

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
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams]);

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
    if (isDesktop && currentTab === -1) {
      const tabParam = searchParams.get("tab");
      const tabIndex = tabParam !== null ? parseInt(tabParam, 10) : 0;
      
      setCurrentTab(tabIndex);
      setSearchParams({tab: tabIndex.toString()});
    }
  }, [isDesktop]);

  return (
    <div className="page appear-transition">
      <Header searchBar={true} cart={true}></Header>

      <main>
        <section className={legalNoticeStyles.legalNoticeSection}>
          <div className={legalNoticeStyles.legalNoticeContainer}>
            <div className={legalNoticeStyles.topContainer}>
              {currentTab === -1 ? (
                <Breadcrumb className={legalNoticeStyles.breadcrumb} crumbs={crumbs} />
              ) : (
                <div className={legalNoticeStyles.backButtonContainer}>
                  <button onClick={clickBack}>
                    <ArrowLeftIcon className={legalNoticeStyles.arrowLeftIcon} />
                    <span>Back</span>
                  </button>
                </div>
              )}
            </div>

            <div className={legalNoticeStyles.bottomContainer}>
              <div className={legalNoticeStyles.contentContainer}>
                {(isDesktop || currentTab === -1) && (
                  <div className={legalNoticeStyles.leftContainer}>
                    <h3>Legal notice</h3>
                    <div className={legalNoticeStyles.tabsContainer}>
                      <button className={`${currentTab === 0 ? legalNoticeStyles.selectedTab : legalNoticeStyles.tab}`} onClick={() => selectTab(0)}>Terms and conditions</button>
                      <button className={`${currentTab === 1 ? legalNoticeStyles.selectedTab : legalNoticeStyles.tab}`} onClick={() => selectTab(1)}>License agreement</button>
                      <button className={`${currentTab === 2 ? legalNoticeStyles.selectedTab : legalNoticeStyles.tab}`} onClick={() => selectTab(2)}>Privacy policy</button>
                    </div>
                  </div>
                )}

                {isDesktop && (
                  <div className={`${legalNoticeStyles.contentDivider} divider`} />
                )}

                {currentTab !== -1 && (
                  <div className={legalNoticeStyles.rightContainer} ref={content}>
                    {currentTab === 0 && <TermsAndConditions />}
                    {currentTab === 1 && <LicenseAgreement />}
                    {currentTab === 2 && <PrivacyPolicy />}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer></Footer>
    </div>
  );
}

export default LegalNotice;