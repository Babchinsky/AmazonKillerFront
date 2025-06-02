import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { getCssVariable } from "../../utils/getCssVariable";
import { useBreakpoint } from "../../utils/useBreakpoint";
import CrumbType from "../../types/crumb-type";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import MyOrders from "../../components/account/MyOrders";
import Wishlist from "../../components/account/Wishlist";
import AccountSettings from "../../components/account/AccountSettings";
import Footer from "../../components/Footer";
import BubbleImage from "../../assets/images/authentication/bubble.png";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg?react";
import accountStyles from "./Account.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { getCurrentUser } from "../../state/account/account-slice";


function Account() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const initialTab = tab !== null ? parseInt(tab) : -1;
  const [currentTab, setCurrentTab] = useState<number>(initialTab);

  const content = useRef<HTMLDivElement>(null);

  const breakpointDesktop = parseInt(getCssVariable("--breakpoint-desktop"), 10);
  const isDesktop = useBreakpoint(breakpointDesktop);

  const [crumbs, setCrumbs] = useState<CrumbType[]>([
    { name: "Home", path: "/" },
    { name: "Account", path: "/account" }
  ]);

  const selectTab = (index: number) => {
    setCurrentTab(index);
    setSearchParams({ tab: index.toString() });
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
        <section className={accountStyles.accountSection}>
          <div className={accountStyles.accountContainer}>
            <div className={accountStyles.topContainer}>
              <Breadcrumb className={accountStyles.breadcrumb} crumbs={crumbs} />
            </div>

            <div className={accountStyles.bottomContainer}>
              <div className={accountStyles.contentContainer}>
                {(isDesktop || currentTab === -1) && (
                  <div className={accountStyles.leftContainer}>
                    <div className={accountStyles.mainDataContainer}>
                      <img alt="Account" src={BubbleImage} />
                      <div>
                        <h3>{user ? `${user.firstName} ${user.lastName}` : ""}</h3>
                        <p>{user?.role || ""}</p>
                      </div>
                    </div>
                    <div className={accountStyles.tabsContainer}>
                      <button className={`${currentTab === 0 ? accountStyles.selectedTab : accountStyles.tab}`} onClick={() => selectTab(0)}>My orders</button>
                      <button className={`${currentTab === 1 ? accountStyles.selectedTab : accountStyles.tab}`} onClick={() => selectTab(1)}>Wishlist</button>
                      <button className={`${currentTab === 2 ? accountStyles.selectedTab : accountStyles.tab}`} onClick={() => selectTab(2)}>Account settings</button>
                    </div>
                  </div>
                )}

                {isDesktop && (
                  <div className={`${accountStyles.contentDivider} divider`} />
                )}

                {currentTab !== -1 && (
                  <div className={accountStyles.rightContainer} ref={content}>
                    {currentTab === 0 && <MyOrders />}
                    {currentTab === 1 && <Wishlist />}
                    {currentTab === 2 && <AccountSettings />}
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

export default Account;