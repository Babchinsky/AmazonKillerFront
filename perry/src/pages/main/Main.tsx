import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { getCategories } from "../../state/categories/categories-slice";
import { getProducts, getSaleProducts, getTrendingProducts } from "../../state/products/products-slice";
import { getCssVariable } from "../../utils/getCssVariable";
import { useBreakpoint } from "../../utils/useBreakpoint";
import CategoryType from "../../types/categories/category-type";
import ProductType from "../../types/products/product-type";
import ProductCardType from "../../types/products/product-card-type";
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
  
  const fillCategories = (categories: CategoryType[]) => {
    if (!categories.length) {
      return [];
    }
    
    const result = [...categories];
    while (result.length < 12) {
      result.push(...categories);
    }
    
    return result.slice(0, 12);
  };
  
  const categoriesFilled = fillCategories([...categories].sort(() => Math.random() - 0.5));

  const categoryCards = categoriesFilled.map((category, index) => (
    <CategoryCard
      key={category.id}
      link={`/products/${category.name.toLowerCase().replace(/\s+/g, "-")}?id=${category.id}`}
      name={`${category.name} #${index}`}
      imageUrl={DefaultImage}
    />
  ));

  const products = useSelector((state: RootState) => state.products.products);
  // const trendingProducts = useSelector((state: RootState) => state.products.trendingProducts);
  // const saleProducts = useSelector((state: RootState) => state.products.saleProducts);

  const fillProducts = (products: ProductCardType[]) => {
    if (!products.length) {
      return [];
    }
    
    const result = [...products];
    while (result.length < 12) {
      result.push(...products);
    }
    
    return result.slice(0, 12);
  };

  const trendingProductsFilled = fillProducts([...products].sort(() => Math.random() - 0.5));
  const saleProductsFilled = fillProducts([...products].sort(() => Math.random() - 0.5));

  const trendingProductCards = trendingProductsFilled.map((product) => (
    <ProductCard
      key={product.id}
      link={`/product/${product.id}`}
      imageUrl={product.imageUrl.trim().length !== 0 ? product.imageUrl : DefaultImage}
      name={product.name}
      rating={product.rating}
      reviewsCount={product.reviewsCount}
      price={product.price}
      discountPercent={product.discountPercent ?? 0}
    />
  ));

  const saleProductCards = saleProductsFilled.map((product) => (
    <ProductCard
      key={product.id}
      link={`/product/${product.id}`}
      imageUrl={product.imageUrl.trim().length !== 0 ? product.imageUrl : DefaultImage}
      name={product.name}
      rating={product.rating}
      reviewsCount={product.reviewsCount}
      price={product.price}
      discountPercent={product.discountPercent ?? 0}
    />
  ));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getProducts());
    // dispatch(getTrendingProducts());
    // dispatch(getSaleProducts());
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
          </div>

          <hr className="divider"></hr>
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
                <Button type="primary" content="Sign up" />
                <Button className={mainStyles.logInButton} type="secondary" content="Log in" />
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