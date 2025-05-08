import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { getCategories } from "../../state/categories/categories-slice";
import { getCssVariable } from "../../utils/getCssVariable";
import { useBreakpoint } from "../../utils/useBreakpoint";
import CategoryType from "../../types/category-type";
import ProductType from "../../types/product-type";
import Header from "../../components/Header";
import BackToTopButton from "../../components/buttons/BackToTopButton";
import BannerCarousel from "../../components/carousels/BannerCarousel";
import CategoryCard from "../../components/cards/CategoryCard";
import ProductCard from "../../components/cards/ProductCard";
import CardCarousel from "../../components/carousels/CardCarousel";
import TextButton from "../../components/buttons/TextButton";
import Footer from "../../components/Footer";
import banner1Mobile from "../../assets/images/banners/banner-1-mobile.png";
import banner1Desktop from "../../assets/images/banners/banner-1-desktop.png";
import bannerAuthMobile from "../../assets/images/banners/banner-authentication-mobile.png";
import bannerAuthDesktop from "../../assets/images/banners/banner-authentication-desktop.png";
import defaultImage from "../../assets/images/default-image.jpg";
import ArrowRight from "../../assets/icons/arrow-right.svg?react";
import "./Main.scss";


function Main() {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const dispatch = useDispatch<AppDispatch>();

  const breakpointTablet = parseInt(getCssVariable("--breakpoint-tablet"), 10);
  const isTablet = useBreakpoint(breakpointTablet);
  const bannerCarouselImages = isTablet ? [banner1Desktop] : [banner1Mobile];
  const bannerAuth = isTablet ? bannerAuthDesktop : bannerAuthMobile;

  const [trendingProducts, setTrendingProducts] = useState<ProductType[]>([]);
  const [saleProducts, setSaleProducts] = useState<ProductType[]>([]);

  const categories = useSelector((state: RootState) => state.categories.categories);
  const dressesCategory = categories.find(
    (category: CategoryType) => category.name.toLowerCase() === "dresses"
  );
  const categoryCards = dressesCategory
  ? Array.from({length: 12}, (_, index) => (
      <CategoryCard
        key={`${dressesCategory.id}-${index}`}
        title={dressesCategory.name}
        image={dressesCategory.picture || defaultImage}
        link={`/products/${dressesCategory.name.toLowerCase().replace(/\s+/g, "-")}?id=${dressesCategory.id}`}
      />
    ))
  : [];

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    fetch(`${apiUrl}/products?isTrending=true`)
      .then((response) => response.json())
      .then((data) => {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setTrendingProducts(shuffled.slice(0, 12));
      })
      .catch((error) => console.error("Error fetching trending products:", error));
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/products?discount_gte=1`)
      .then((response) => response.json())
      .then((data) => {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setSaleProducts(shuffled.slice(0, 12));
      })
      .catch((error) => console.error("Error fetching sale products:", error));
  }, []);

  const trendingProductCards = trendingProducts.map((product) => (
    <ProductCard
      key={product.id}
      title={product.name}
      image={product.productPics[0]}
      link={`/product/${product.id}`}
      rating={product.rating}
      reviewsCount={product.reviewsCount}
      price={product.price}
      discount={product.discount}
      quantity={product.quantity}
    />
  ));

  const saleProductCards = saleProducts.map((product) => (
    <ProductCard
      key={product.id}
      title={product.name}
      image={product.productPics[0]}
      link={`/product/${product.id}`}
      rating={product.rating}
      reviewsCount={product.reviewsCount}
      price={product.price}
      discount={product.discount}
      quantity={product.quantity}
    />
  ));

  return (
    <>
      <Header searchBar={true} cart={true} />
      <BackToTopButton />

      <section className="main-content-section">
        <div className="main-content-container">
          <BannerCarousel images={bannerCarouselImages} />
          <CardCarousel cards={categoryCards} wrap={false} />

          <hr className="divider" />
          
          <div className="content-container">
            <div className="content-title-container">
              <h2>Trending deals</h2>
              <Link className="see-all-link link" to="/">
                <span>See all</span>
                <ArrowRight className="arrow-right-icon" />
              </Link> 
            </div>

            <CardCarousel cards={trendingProductCards} wrap={true} />
          </div>

          <hr className="divider" />
            
          <CardCarousel cards={categoryCards} wrap={false} />

          <hr className="divider" />
          
          <div className="content-container">
            <div className="content-title-container">
              <h2>Sale</h2>
              <Link className="see-all-link link" to="/">
                <span>See all</span>
                <ArrowRight className="arrow-right-icon" />
              </Link>
            </div>

            <CardCarousel cards={saleProductCards} wrap={true} link="/products" />
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
                <TextButton type="primary" content="Sign up" />
                <button className="log-in-button">Log in</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Main;