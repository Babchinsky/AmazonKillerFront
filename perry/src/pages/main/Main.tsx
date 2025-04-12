import { Link } from "react-router";
import { getCssVariable } from "../../utils/getCssVariable";
import { useBreakpoint } from "../../utils/useBreakpoint";
import Header from "../../components/Header";
import BackToTopButton from "../../components/buttons/BackToTopButton";
import BannerCarousel from "../../components/BannerCarousel";
import Footer from "../../components/Footer";
import CategoryCard from "../../components/cards/CategoryCard";
import ProductCard from "../../components/cards/ProductCard";
import CardCarousel from "../../components/CardCarousel";
import TextButton from "../../components/buttons/TextButton";
import banner1Mobile from "../../assets/images/banners/banner-1-mobile.png";
import banner1Desktop from "../../assets/images/banners/banner-1-desktop.png";
import bannerAuthMobile from "../../assets/images/banners/banner-authentication-mobile.png";
import bannerAuthDesktop from "../../assets/images/banners/banner-authentication-desktop.png";
import defaultImage from "../../assets/images/default-image.jpg";
import ArrowRight from "../../assets/icons/arrow-right.svg?react";
import "./Main.scss";


function Main() {
  const breakpointTablet = parseInt(getCssVariable("--breakpoint-tablet"), 10);
  const isTablet = useBreakpoint(breakpointTablet);
  const bannerCarouselImages = isTablet ? [banner1Desktop] : [banner1Mobile];
  const bannerAuth = isTablet ? bannerAuthDesktop : bannerAuthMobile;

  const categoryCards = Array.from({length: 12}).map((_, index) => (
    <CategoryCard
      key={index}
      title={`${index + 1} Lorem ipsum dolor sit amet, consectetur adipiscing elit`}
      image={defaultImage}
      link="/"
    />
  ));

  const trendingProductCards = Array.from({length: 12}).map((_, index) => (
    <ProductCard
      key={index}
      title={`${index + 1} Lorem ipsum dolor sit amet, consectetur adipiscing elit`}
      image={defaultImage}
      link="/"
      rating={4}
      reviews={100}
      price={20.50}
      discount={0}
      stockQuantity={1000}
    />
  ));

  const saleProductCards = Array.from({length: 12}).map((_, index) => (
    <ProductCard
      key={index}
      title={`${index + 1} Lorem ipsum dolor sit amet, consectetur adipiscing elit`}
      image={defaultImage}
      link="/"
      rating={4}
      reviews={200}
      price={20.50}
      discount={50}
      stockQuantity={500}
    />
  ));

  return (
    <>
      <Header searchBar={true} cart={true}></Header>
      <BackToTopButton></BackToTopButton>

      <section className="main-content-section">
        <div className="main-content-container">
          <BannerCarousel images={bannerCarouselImages}></BannerCarousel>
          <CardCarousel cards={categoryCards} wrap={false}></CardCarousel>

          <hr className="divider"></hr>
          
          <div className="content-container">
            <div className="content-title-container">
              <h2>Trending deals</h2>
              <Link className="see-all-link" to="/">
                <span>See all</span>
                <ArrowRight className="arrow-right-icon" />
              </Link> 
            </div>

            <CardCarousel cards={trendingProductCards} wrap={true}></CardCarousel>
          </div>

          <hr className="divider"></hr>
            
          <CardCarousel cards={categoryCards} wrap={false}></CardCarousel>

          <hr className="divider"></hr>
          
          <div className="content-container">
            <div className="content-title-container">
              <h2>Sale</h2>
              <Link className="see-all-link" to="/">
                <span>See all</span>
                <ArrowRight className="arrow-right-icon" />
              </Link>
            </div>

            <CardCarousel cards={saleProductCards} wrap={true} link="/products"></CardCarousel>
          </div>

          <hr className="divider"></hr>

          <div className="banner-container">
            <div className="banner-image-container">
              <img className="banner-image" alt="Banner" src={bannerAuth} />
            </div>

            <div className="banner-content-container">
              <div>
                <h3 className="banner-content-title">Abundance of goods</h3>
                <p className="banner-content-subtitle">Join, choose and buy with confidence!</p>
              </div>
              
              <div className="banner-content-buttons">
                <TextButton type="primary" content="Sign up"></TextButton>
                <button className="log-in-button">Log in</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer></Footer>
    </>
  );
}

export default Main;