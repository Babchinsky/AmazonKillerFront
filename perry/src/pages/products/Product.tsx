import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { setAuthModalOpen, setAuthType } from "../../state/auth/auth-slice";
import { getCategoryById } from "../../state/categories/categories-slice";
import { getProductById, getProductsByCategory } from "../../state/products/products-slice";
import { addProductToCart, getCart } from "../../state/cart/cart-slice";
import { getWishlist, toggleWishlist } from "../../state/wishlist/wishlist-slice";
import { getReviews } from "../../state/reviews/reviews-slice";
import CrumbType from "../../types/crumb-type";
import ComboBoxOptionType from "../../types/combo-box-option-type";
import ReviewType from "../../types/account/reviews/review-type";
import Header from "../../components/Header";
import BackToTopButton from "../../components/buttons/BackToTopButton";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import Stars from "../../components/stars/Stars";
import Button from "../../components/buttons/Button";
import AboutProductComboBox from "../../components/combo-boxes/AboutProductComboBox";
import SortComboBox from "../../components/combo-boxes/SortComboBox";
import CardCarousel from "../../components/carousels/CardCarousel";
import ProductCard from "../../components/cards/ProductCard";
import Footer from "../../components/Footer";
import DefaultImage from "../../assets/images/default.jpg";
import ArrowLeft from "../../assets/icons/arrow-left.svg?react";
import ArrowRightIcon from "../../assets/icons/arrow-right.svg?react";
import StarFullIcon from "../../assets/icons/star-full.svg?react";
import MinusIcon from "../../assets/icons/minus.svg?react";
import PlusIcon from "../../assets/icons/plus.svg?react";
import VerifiedIcon from "../../assets/icons/verified.svg?react";
import productStyles from "./Product.module.scss";


function Product() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const isAuthenticated = useSelector((state: RootState) => !!state.auth.accessToken);

  const [quantity, setQuantity] = useState<number>(1);

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    if (product?.quantity) {
      setQuantity((prev) => Math.min(product.quantity, prev + 1));
    }
  };

  const addToCart = async () => {
    if (isAuthenticated && product?.id) {
      await dispatch(addProductToCart({productId: product.id, quantity}));
      dispatch(getCart());
    } 
    else {
      dispatch(setAuthType("logIn"));
      dispatch(setAuthModalOpen(true));
    }
  };

  const addToWishList = async () => {
    if (isAuthenticated && product?.id) {
      await dispatch(toggleWishlist(product.id));
      dispatch(getWishlist());
    } 
    else {
      dispatch(setAuthType("logIn"));
      dispatch(setAuthModalOpen(true));
    }
  };

  const createReview = () => {
    if (isAuthenticated) {
      //
    } 
    else {
      dispatch(setAuthType("logIn"));
      dispatch(setAuthModalOpen(true));
    }
  };

  const product = useSelector((state: RootState) => state.products.productById);
  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);

  const currentCategory = useSelector((state: RootState) => state.categories.currentCategory);
  const categoryProducts = useSelector((state: RootState) => state.products.categoryProducts);

  const [crumbs, setCrumbs] = useState<CrumbType[]>([]);

  const [currencyMajor, currencyMinor] = product?.price?.toString().split(".") ?? [];
  
  const productImages = product?.imageUrls?.length ? product.imageUrls : [DefaultImage];
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const productReviews = useSelector((state: RootState) => state.reviews.reviews);

  useEffect(() => {
    if (product?.id) {
      dispatch(getReviews({ filters: { productId: product.id } }));
    }
  }, [dispatch, product?.id]);

  const getRatingDistribution = (reviews: ReviewType[]) => {
    const total = reviews.length;
    const distribution = [1, 2, 3, 4, 5].map((stars) => {
      const count = reviews.filter((review) => review.rating === stars).length;
      const percent = total > 0 ? Math.round((count / total) * 100) : 0;
      return { stars, percent };
    });

    return distribution.reverse();
  };

  const ratingDistribution = getRatingDistribution(productReviews);

  const [selectedCommentsFilter, setSelectedCommentsFilter] = useState<number | "all">("all");
  const filteredReviews = selectedCommentsFilter === "all" ? productReviews : productReviews.filter((r) => r.rating === selectedCommentsFilter);

  const sortOptions = [
    { id: "1", label: "Top reviews" },
    { id: "2", label: "Most recent" },
    { id: "3", label: "Older reviews" }
  ];

  const [sortOption, setSortOption] = useState<ComboBoxOptionType>(sortOptions[0]);

  const sameCategoryProductCards = categoryProducts.filter((p) => p.id !== product?.id).map((product) => (
    <ProductCard
      key={product.id}
      link={`/product/${product.id}`}
      imageUrl={product.imageUrl?.trim() ? product.imageUrl : DefaultImage}
      name={product.name}
      rating={product.rating}
      reviewsCount={product.reviewsCount}
      quantity={product.quantity}
      price={product.price}
      discountPercent={product.discountPercent ?? 0}
    />
  ));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (product?.categoryId) {
      dispatch(getCategoryById(product.categoryId));
      dispatch(getProductsByCategory({
        categoryId: product.categoryId,
        filters: {},
      }));
    }
  }, [dispatch, product?.categoryId]);

  return (
    <div className="page appear-transition">
      <Header searchBar={true} cart={true}></Header>
      
      <main className={productStyles.productMain}>
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
                      <Stars count={Math.floor(product?.rating || 0)} />
                      <p>{Math.floor(product?.rating || 0)}</p>
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
                  
                  {product && product.features?.length > 0 && (
                    <div className={productStyles.comboBoxesContainer}>
                      {product?.features.map((feature, index) => (
                        <AboutProductComboBox 
                          key={index} 
                          title={feature.name} 
                          description={feature.description} 
                          isOpen={true} 
                        />
                      ))}
                    </div>
                  )}
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
                    <button className={productStyles.minusQuantityButton} onClick={decreaseQuantity}>
                      <MinusIcon className={productStyles.minusIcon} />
                    </button>
                    <p>{quantity}</p>
                    <button className={productStyles.plusQuantityButton} onClick={increaseQuantity}>
                      <PlusIcon className={productStyles.plusIcon} />
                    </button>
                  </div>
                </div>

                <div className={productStyles.buttonsContainer}>
                  <Button type="primary" content="Buy now" />
                  <Button type="secondary" content="Add to cart" onClick={addToCart} />
                  <Button type="tertiary" content="Add to wish list" onClick={addToWishList} />
                </div>
              </div>
            </div>

            <div className={productStyles.bottomContainer}>
              <hr className={`${productStyles.productDivider} divider`} />

              <h3>Product details</h3>
              {product && product.attributes?.length > 0 && (
                <div className={productStyles.detailsContainer}>
                  {product?.attributes.map((attribute, index) => (
                    <div key={index} className={productStyles.detailContainer}>
                      <p className={productStyles.title}>{attribute.key}</p>
                      <p>{attribute.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <hr className={`${productStyles.productDivider} divider`} />

              <h3>Customer reviews</h3>
              <div className={productStyles.customerReviewsContainer}>
                <div className={productStyles.customerReviewsLeftContainer}>
                  <div className={productStyles.ratingReviewsContainer}>
                    <div className={productStyles.ratingReviewsLeftContainer}>
                      <p className={productStyles.rating}>
                        <span>{Math.floor(product?.rating || 0)}</span>/5
                      </p>
                      <Stars count={Math.floor(product?.rating || 0)} />
                      <p>0 reviews</p>
                    </div>

                    <div className={productStyles.ratingReviewsRightContainer}>
                      {ratingDistribution.map((rating) => (
                        <div key={rating.stars} className={productStyles.statisticsBarContainer}>
                          <p>{rating.stars}</p>
                          <div className={productStyles.statisticsBar}>
                            <div style={{ width: `${rating.percent}%` }}></div>
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

                  {/* <hr className={`${productStyles.customerReviewsDivider} divider`} />

                  <div className={productStyles.frequentTagsContainer}>
                    <p>Frequent tags</p>
                    <div className={productStyles.tagsContainer}>
                      <button>Tag</button>
                    </div>
                  </div> */}
                </div>

                <div className={productStyles.customerReviewsRightContainer}>
                  <div className={productStyles.filterSortReviewContainer}>
                    <div className={productStyles.filtersContainer}>
                      <button
                        className={
                          selectedCommentsFilter === "all"
                            ? productStyles.selectedfilterButton
                            : productStyles.filterButton
                        }
                        onClick={() => setSelectedCommentsFilter("all")}
                      >
                        <span>All</span>
                      </button>

                      {ratingDistribution.filter((r) => r.percent > 0).map(({ stars }) => (
                        <button
                          key={stars}
                          className={
                            selectedCommentsFilter === stars
                              ? productStyles.selectedfilterButton
                              : productStyles.filterButton
                          }
                          onClick={() => setSelectedCommentsFilter(stars)}
                        >
                          <span>{stars}</span>
                          <StarFullIcon className={productStyles.starFullIcon} />
                        </button>
                      ))}
                    </div>

                    <SortComboBox 
                      isOpen={false} 
                      options={sortOptions} 
                      selectedOption={sortOption} 
                    />
                  </div>

                  <hr className={`${productStyles.customerReviewsDivider} divider`} />

                  <button className={productStyles.createReviewButton} onClick={createReview}>
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
                  <h2>More {currentCategory?.name.toLowerCase() ?? "products"}</h2>
                  <Link className={`${productStyles.seeAllLink} link`} to={`/products/${currentCategory?.name.toLowerCase().replace(/\s+/g, "-")}?id=${currentCategory?.id}`}>
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