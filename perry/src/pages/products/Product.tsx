import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import CrumbType from "../../types/crumb-type";
import CategoryType from "../../types/categories/category-type";
import ProductType from "../../types/products/product-type";
import ComboBoxOptionType from "../../types/combo-box-option-type";
import Header from "../../components/Header";
import BackToTopButton from "../../components/buttons/BackToTopButton";
import Breadcrumb from "../../components/Breadcrumb";
import Stars from "../../components/Stars";
import TextButton from "../../components/buttons/Button";
import AboutProductComboBox from "../../components/combo-boxes/AboutProductComboBox";
import SortComboBox from "../../components/combo-boxes/SortComboBox";
import CardCarousel from "../../components/carousels/CardCarousel";
import ProductCard from "../../components/cards/ProductCard";
import Footer from "../../components/Footer";
import DefaultImage from "../../assets/images/default.jpg";
import ArrowLeft from "../../assets/icons/arrow-left.svg?react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import ArrowRightIcon from "../../assets/icons/arrow-right.svg?react";
import StarFullIcon from "../../assets/icons/star-full.svg?react";
import MinusIcon from "../../assets/icons/minus.svg?react";
import PlusIcon from "../../assets/icons/plus.svg?react";
import VerifiedIcon from "../../assets/icons/verified.svg?react";
import productStyles from "./Product.module.scss";
import { getProductById, getProductsByCategory } from "../../state/products/products-slice";
import ProductCardType from "../../types/products/product-card-type";


function Product() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const product = useSelector((state: RootState) => state.products.productById);
  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);

  const categoryProducts = useSelector((state: RootState) => state.products.categoryProducts);
  useEffect(() => {
    if (product?.categoryId) {
      dispatch(getProductsByCategory(product.categoryId));
    }
  }, [dispatch, product?.categoryId]);

  const [crumbs, setCrumbs] = useState<CrumbType[]>([]);

  const [currencyMajor, currencyMinor] = product?.price?.toString().split(".") ?? [];
  
  const productImages = product?.imageUrls?.length ? product.imageUrls : [DefaultImage];
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const ratingDistribution = [
    { stars: 5, percent: 65 },
    { stars: 4, percent: 16 },
    { stars: 3, percent: 10 },
    { stars: 2, percent: 4 },
    { stars: 1, percent: 5 },
  ];

  const sortOptions = [
    { id: "1", label: "Top reviews" },
    { id: "2", label: "Most recent" },
    { id: "3", label: "Older reviews" }
  ];

  const [sortOption, setSortOption] = useState<ComboBoxOptionType>(sortOptions[0]);

  const fillProducts = (products: any) => {
    if (!products.length) {
      return [];
    }
    
    const result = [...products];
    while (result.length < 12) {
      result.push(...products);
    }
    
    return result.slice(0, 12);
  };
  
  const filteredProducts =
  categoryProducts.length > 1
    ? categoryProducts.filter((p) => p.id !== product?.id)
    : product
    ? [product]
    : [];

  const filledProducts = fillProducts(filteredProducts);

  const sameCategoryProductCards = filledProducts.map((product) => (
    <ProductCard
      key={product.id}
      link={`/product/${product.id}`}
      imageUrl={product.imageUrl?.trim() ? product.imageUrl : DefaultImage}
      name={product.name}
      rating={product.rating}
      reviewsCount={product.reviewsCount}
      price={product.price}
      discountPercent={product.discountPercent ?? 0}
    />
  ));

  // const saleProductCards = saleProducts.map((product) => (
  //   <ProductCard
  //     key={product.id}
  //     title={product.name}
  //     image={product.productPics[0]}
  //     link={`/product/${product.id}`}
  //     rating={product.rating}
  //     reviewsCount={product.reviewsCount}
  //     price={product.price}
  //     discount={product.discount}
  //     quantity={product.quantity}
  //   />
  // ));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // useEffect(() => {
  //   fetch(`${apiUrl}/products?isTrending=true`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const shuffled = [...data].sort(() => Math.random() - 0.5);
  //       setSameCategoryProducts(shuffled.slice(0, 12));
  //     })
  //     .catch((error) => console.error("Error fetching trending products:", error));
  // }, []);

  // useEffect(() => {
  //   fetch(`${apiUrl}/products?discount_gte=1`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const shuffled = [...data].sort(() => Math.random() - 0.5);
  //       setSaleProducts(shuffled.slice(0, 12));
  //     })
  //     .catch((error) => console.error("Error fetching sale products:", error));
  // }, []);

  return (
    <div className="page appear-transition">
      <Header searchBar={true} cart={true}></Header>
      
      <main>
        <BackToTopButton />

        <section className={productStyles.productSection}>
          <div className={productStyles.productContainer}>
            <Breadcrumb crumbs={crumbs} />

            <div className={productStyles.topContainer}>
              <div className={productStyles.picsContainer}>
                <div className={productStyles.mainPicContainer}>
                  <img alt="Product" src={productImages[mainImageIndex]} />

                  {productImages.length > 1 && (
                    <div className={productStyles.arrowsContainer}>
                      <button 
                        className={productStyles.arrowButton}
                        onClick={() =>
                          setMainImageIndex((prev) =>
                            prev === 0 ? productImages.length - 1 : prev - 1
                          )
                        }
                      >
                        <ArrowLeft className={productStyles.arrowLeftIcon} />
                      </button>

                      <button
                        className={productStyles.arrowButton}
                        onClick={() =>
                          setMainImageIndex((prev) =>
                            prev === productImages.length - 1 ? 0 : prev + 1
                          )
                        }
                      >
                        <ArrowRightIcon className={productStyles.arrowRightIcon} />
                      </button>
                    </div>
                  )}
                </div>

                <div className={productStyles.otherPicsContainer}>
                  {productImages.length > 1 && (
                    productImages.map((pic, index) => (
                      <img
                        key={index}
                        alt="Product"
                        src={pic}
                        onClick={() => setMainImageIndex(index)}
                      />
                    ))
                  )}
                </div>
              </div>
              
              <div className={productStyles.dataContainer}>
                <h3>{product?.name}</h3>

                <div className={productStyles.ratingCodeContainer}>
                  <div className={productStyles.ratingContainer}>
                    <div className={productStyles.ratingStars}>
                      <Stars count={product?.rating || 0} />
                      <p>{product?.rating}</p>
                    </div>

                    <p className={productStyles.ratingReviews}>{product?.reviewsCount} reviews</p>
                  </div>

                  <div className={productStyles.codeContainer}>
                    <p>Code:</p>
                    <p>{product?.code}</p>
                  </div>
                </div>
                
                <div className={productStyles.aboutProductContainer}>
                  <h3>About product</h3>
                  
                  <div className={productStyles.comboBoxesContainer}>
                    <AboutProductComboBox title="Soft fabric" isOpen={true} />
                    <AboutProductComboBox title="Unique design" isOpen={true} />
                    <AboutProductComboBox title="Fashion matching" isOpen={true} />
                    <AboutProductComboBox title="Various occasions" isOpen={true} />
                  </div>
                </div>
              </div>

              <div className={productStyles.purchaseContainer}>
                <div className={productStyles.priceContainer}>
                  <p className={productStyles.price}>
                    <span className={productStyles.currency}>$</span> 
                    <span>{currencyMajor}</span>
                    <span className={productStyles.currencyMinor}>{currencyMinor}</span>
                  </p>
                </div>

                <hr className={`${productStyles.purchaseDivider} divider`} />
                
                <div className={productStyles.statusContainer}>
                  <p>Status</p>
                  <p className={productStyles.highlight}>{(product?.quantity || 0) > 0 ? "In stock" : "Out of stock"}</p>
                </div>
                <button className={productStyles.paymentButton}>
                  <p>Payment</p>
                  <ArrowRightIcon className={productStyles.arrowRightIcon} />
                </button>
                <button className={productStyles.securityButton}>
                  <p>Security</p>
                  <ArrowRightIcon className={productStyles.arrowRightIcon} />
                </button>
                
                <hr className={`${productStyles.purchaseDivider} divider`} />

                <div className={productStyles.quantityContainer}>
                  <p>Quantity</p>
                  <div className={productStyles.quantity}>
                    <button className={productStyles.minusQuantityButton}>
                      <MinusIcon className={productStyles.minusIcon} />
                    </button>
                    <p>1</p>
                    <button className={productStyles.plusQuantityButton}>
                      <PlusIcon className={productStyles.plusIcon} />
                    </button>
                  </div>
                </div>

                <div className={productStyles.buttonsContainer}>
                  <TextButton type="primary" content="Buy now" />
                  <TextButton type="secondary" content="Add to cart" />
                  <button>Add to wish list</button>
                </div>
              </div>
            </div>

            <div className={productStyles.bottomContainer}>
              <hr className={`${productStyles.productDivider} divider`} />

              <h3>Product details</h3>
              <div className={productStyles.detailsContainer}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum dignissim tellus quis porta. Curabitur pulvinar mollis enim, et aliquet magna ullamcorper vel. Etiam ante tortor, condimentum nec suscipit posuere, interdum sit amet libero.
              </div>

              <hr className={`${productStyles.productDivider} divider`} />

              <h3>Customer reviews</h3>
              <div className={productStyles.customerReviewsContainer}>
                <div className={productStyles.customerReviewsLeftContainer}>
                  <div className={productStyles.ratingReviewsContainer}>
                    <div className={productStyles.ratingReviewsLeftContainer}>
                      <p className={productStyles.rating}>
                        <span>4</span>/5
                      </p>
                      <Stars count={4} />
                      <p>0 reviews</p>
                    </div>

                    <div className={productStyles.ratingReviewsRightContainer}>
                      {ratingDistribution.map((rating) => (
                        <div key={rating.stars} className={productStyles.statisticsBarContainer}>
                          <p>{rating.stars}</p>

                          <div className={productStyles.statisticsBar}>
                            <div style={{width: `${rating.percent}%`}}></div>
                          </div>

                          <p className={productStyles.statisticsPercent}>{rating.percent}%</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={productStyles.opinionsContainer}>
                    <div className={productStyles.allOpinionsConfirmedContainer}>
                      <VerifiedIcon className={productStyles.verifiedIcon} />
                      <p>All opinions confirmed by purchase.</p>
                    </div>

                    <Link className={`${productStyles.learnMoreLink} link`} to="/">
                      <span>Learn more</span>
                      <ArrowRightIcon className={productStyles.arrowRightIcon} />
                    </Link>
                  </div>

                  <hr className={`${productStyles.customerReviewsDivider} divider`} />

                  <div className={productStyles.frequentTagsContainer}>
                    <p>Frequent tags</p>
                    <div className={productStyles.tagsContainer}>
                      <button>Tag</button>
                    </div>
                  </div>
                </div>

                <div className={productStyles.customerReviewsRightContainer}>
                  <div className={productStyles.filterSortReviewContainer}>
                    <div className={productStyles.filtersContainer}>
                      <button className={productStyles.selectedfilterButton}>
                        <span>All</span>
                      </button>

                      <button className={productStyles.filterButton}>
                        <span>5</span>
                        <StarFullIcon className={productStyles.starFullIcon} />
                      </button>
                    </div>

                    <SortComboBox 
                      isOpen={false} 
                      options={sortOptions} 
                      selectedOption={sortOption} 
                    />
                  </div>

                  <hr className={`${productStyles.customerReviewsDivider} divider`} />

                  <button className={productStyles.createReviewButton}>
                    <PlusIcon className={productStyles.plusIcon} />
                    <span>Create review</span>
                  </button>

                  <div className={productStyles.reviewsContainer}>

                  </div>
                </div>
              </div>

              <hr className={`${productStyles.productDivider} divider`} />

              <div className={productStyles.sameCategoryContainer}>
                <div className={productStyles.titleContainer}>
                  <h2>More casual women's dresses</h2>
                  <Link className={`${productStyles.seeAllLink} link`} to="/">
                    <span>See all</span>
                    <ArrowRightIcon className={productStyles.arrowRightIcon} />
                  </Link>
                </div>

                <CardCarousel cards={sameCategoryProductCards} isWrapped={true} />
              </div>

              <hr className={`${productStyles.productDivider} divider`} />

              <div className={productStyles.saleProductsContainer}>
                <div className={productStyles.titleContainer}>
                  <h2>Fashion: sale</h2>
                  <Link className={`${productStyles.seeAllLink} link`} to="/">
                    <span>See all</span>
                    <ArrowRightIcon className={productStyles.arrowRightIcon} />
                  </Link>
                </div>

                <CardCarousel cards={sameCategoryProductCards} isWrapped={true} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer></Footer>
    </div>
  );
}

export default Product;