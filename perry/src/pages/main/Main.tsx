import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { getCategories } from "../../state/categories/categories-slice";
import { getProducts } from "../../state/products/products-slice";
import { setAuthModalOpen, setAuthType } from "../../state/auth/auth-slice";
import { getCssVariable } from "../../utils/getCssVariable";
import { useBreakpoint } from "../../utils/useBreakpoint";
import Header from "../../components/Header";
import BackToTopButton from "../../components/buttons/BackToTopButton";
import BannerCarousel from "../../components/carousels/BannerCarousel";
import CategoryCard from "../../components/cards/CategoryCard";
import ProductCard from "../../components/cards/ProductCard";
import CardCarousel from "../../components/carousels/CardCarousel";
import Button from "../../components/buttons/Button";
import Footer from "../../components/Footer";
import Banner1MobileImage from "../../assets/images/banners/banner-1-mobile.png";
import Banner1DesktopImage from "../../assets/images/banners/banner-1-desktop.png";
import BannerAuthMobileImage from "../../assets/images/banners/banner-authentication-mobile.png";
import BannerAuthDesktopImage from "../../assets/images/banners/banner-authentication-desktop.png";
import DefaultImage from "../../assets/images/default.jpg";
import ArrowRightIcon from "../../assets/icons/arrow-right.svg?react";
import mainStyles from "./Main.module.scss";


function Main() {
  const dispatch = useDispatch<AppDispatch>();

  const breakpointTablet = parseInt(getCssVariable("--breakpoint-tablet"), 10);
  const isTablet = useBreakpoint(breakpointTablet);
  const bannerCarouselImages = isTablet ? [Banner1DesktopImage] : [Banner1MobileImage];
  const bannerAuth = isTablet ? BannerAuthDesktopImage : BannerAuthMobileImage;

  const categories = useSelector((state: RootState) => state.categories.categories);
  const categoryCards = [...categories].map((category) => (
    <CategoryCard
      key={category.id}
      link={`/products/${category.name.toLowerCase().replace(/\s+/g, "-")}?CategoryId=${category.id}`}
      name={category.name}
      imageUrl={category.imageUrl ? (category.imageUrl.trim().length !== 0 ? category.imageUrl : DefaultImage) : DefaultImage}
    />
  ));

  const products = useSelector((state: RootState) => state.products.products);
  const trendingProductCards = [...products].map((product) => (
    <ProductCard
      key={product.id}
      link={`/product/${product.id}`}
      imageUrl={product.imageUrl.trim().length !== 0 ? product.imageUrl : DefaultImage}
      name={product.name}
      rating={product.rating}
      reviewsCount={product.reviewsCount}
      quantity={product.quantity}
      price={product.price}
      discountPercent={product.discountPercent ?? 0}
    />
  ));
  const saleProductCards = [...products].map((product) => (
    <ProductCard
      key={product.id}
      link={`/product/${product.id}`}
      imageUrl={product.imageUrl.trim().length !== 0 ? product.imageUrl : DefaultImage}
      name={product.name}
      rating={product.rating}
      reviewsCount={product.reviewsCount}
      quantity={product.quantity}
      price={product.price}
      discountPercent={product.discountPercent ?? 0}
    />
  ));

  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.accessToken);

  const clickSignUp = () => {
    if (isAuthenticated) {
      navigate("/account?tab=0");
    } 
    else {
      dispatch(setAuthType("signUp"));
      dispatch(setAuthModalOpen(true));
    }
  }

  const clickLogIn = () => {
    if (isAuthenticated) {
      navigate("/account?tab=0");
    } 
    else {
      dispatch(setAuthType("logIn"));
      dispatch(setAuthModalOpen(true));
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <div className="page appear-transition">
      <Header searchBar={true} cart={true} />

      <main>
        <BackToTopButton />

        <section className={mainStyles.bannerSection}>
          <BannerCarousel images={bannerCarouselImages} />
        </section>
        
        <section className={mainStyles.dealsSection}>
          <CardCarousel cards={categoryCards} isWrapped={false} />
          
          <hr className="divider" />

          <div className={mainStyles.dealContainer}>
            <div className={mainStyles.titleContainer}>
              <h2>Trending deals</h2>
              <Link className={`${mainStyles.seeAllLink} link`} to="/">
                <span>See all</span>
                <ArrowRightIcon className={mainStyles.arrowRightIcon} />
              </Link>
            </div>

            <CardCarousel cards={trendingProductCards} isWrapped={true} />

            <div className={mainStyles.seeAllButtonContainer}>
              <Button
                type="secondary"
                content="See all"
                linkTo="/"
              />
            </div>
          </div>

          <hr className="divider" />
            
          <CardCarousel cards={categoryCards} isWrapped={false} />

          <hr className="divider" />
          
          <div className={mainStyles.dealContainer}>
            <div className={mainStyles.titleContainer}>
              <h2>Sale</h2>
              <Link className={`${mainStyles.seeAllLink} link`} to="/">
                <span>See all</span>
                <ArrowRightIcon className={mainStyles.arrowRightIcon} />
              </Link>
            </div>

            <CardCarousel cards={saleProductCards} isWrapped={true} />

            <div className={mainStyles.seeAllButtonContainer}>
              <Button
                type="secondary"
                content="See all"
                linkTo="/"
              />
            </div>
          </div>

          <hr className="divider" />
        </section>

        <section className={mainStyles.bannerSection}>
          <div className={mainStyles.authBannerContainer}>
            <div className={mainStyles.imageContainer}>
              <img alt="Banner" src={bannerAuth} />
            </div>

            <div className={mainStyles.contentContainer}>
              <div className={mainStyles.titleContainer}>
                <h3>Abundance of goods</h3>
                <p>Join, choose and buy with confidence!</p>
              </div>
              
              <div className={mainStyles.buttonsContainer}>
                <Button type="primary" content="Sign up" onClick={clickSignUp} />
                <Button className={mainStyles.logInButton} type="secondary" content="Log in" onClick={clickLogIn} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Main;