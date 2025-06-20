import { JSX, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { getCategories, getCategoryById } from "../../state/categories/categories-slice";
import { getProductsByCategory } from "../../state/products/products-slice";
import { getCssVariable } from "../../utils/getCssVariable";
import { useBreakpoint } from "../../utils/useBreakpoint";
import CategoryType from "../../types/categories/category-type";
import CrumbType from "../../types/crumb-type";
import ComboBoxOptionType from "../../types/combo-box-option-type";
import ProductCardType from "../../types/products/product-card-type";
import Header from "../../components/Header";
import BackToTopButton from "../../components/buttons/BackToTopButton";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import FilterComboBox from "../../components/combo-boxes/FilterComboBox";
import PriceComboBox from "../../components/combo-boxes/PriceComboBox";
import RatingComboBox from "../../components/combo-boxes/RatingComboBox";
import AppliedFiltersComboBox from "../../components/combo-boxes/AppliedFiltersComboBox";
import SortComboBox from "../../components/combo-boxes/SortComboBox";
import RowNumberToggle from "../../components/toggles/RowNumberToggle";
import ProductCard from "../../components/cards/ProductCard";
import Pagination from "../../components/pagination/Pagination";
import Footer from "../../components/Footer";
import DefaultImage from "../../assets/images/default.jpg";
import FilterEmptyIcon from "../../assets/icons/filter-empty.svg?react";
import productListStyles from "./ProductList.module.scss";


function ProductList() {
  const dispatch = useDispatch<AppDispatch>();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategoryId = searchParams.get("CategoryId");
  const currentPageNumber = parseInt(searchParams.get("page") || "1", 10);

  const breakpointDesktop = parseInt(getCssVariable("--breakpoint-desktop"), 10);
  const isDesktop = useBreakpoint(breakpointDesktop);

  const [crumbs, setCrumbs] = useState<CrumbType[]>([]);
  const categories = useSelector((state: RootState) => state.categories.categories);

  const [hasInitialized, setHasInitialized] = useState(false);

  const currentCategory = useSelector((state: RootState) => state.categories.currentCategory);

  const categoryProductsLoading = useSelector((state: RootState) => state.products.categoryProductsLoading);
  const categoryProducts = useSelector((state: RootState) => state.products.categoryProducts);

  const [selectedFilters, setSelectedFilters] = useState<{ [filterName: string]: string[] }>({});
  const selectFilter = (filterName: string, selectedValues: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: selectedValues,
    }));
  };

  const filterComboBoxes = currentCategory?.filters
  ? Object.entries(currentCategory.filters).map(([filterName, filterValues]) => (
      <FilterComboBox
        key={filterName}
        type="list"
        title={filterName}
        isOpen={true}
        onSelect={(selected: string[]) => selectFilter(filterName, selected)}
        options={filterValues.map((val: any) => ({ id: val, label: val }))}
        selectedOptions={selectedFilters[filterName] || []}
      />
    ))
  : null;

  const [initialMinPrice, setInitialMinPrice] = useState<number>(0);
  const [initialMaxPrice, setInitialMaxPrice] = useState<number>(100);
  const [pendingPriceRange, setPendingPriceRange] = useState<{min: number, max: number}>({min: initialMinPrice, max: initialMaxPrice});
  const [selectedPriceRange, setSelectedPriceRange] = useState<{min: number, max: number}>({min: initialMinPrice, max: initialMaxPrice});
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const sortOptions = [
    { id: "1", label: "By rating" },
    { id: "2", label: "Novelty" },
    { id: "3", label: "Cheap to expensive" },
    { id: "4", label: "Expensive to cheap" }
  ];
  const [sortOption, setSortOption] = useState<ComboBoxOptionType>(sortOptions[0]);

  const filteredProducts = categoryProducts.filter(product => {
    const discountedPrice = product.price * (1 - (product.discountPercent ?? 0) / 100);
    const inPriceRange = discountedPrice >= selectedPriceRange.min && discountedPrice <= selectedPriceRange.max;

    const inRating = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.rating));

    return inPriceRange && inRating;
  });
  const sortedFilteredProducts = [...filteredProducts]
  .sort((a, b) => {
    switch (sortOption.label) {
      case "By rating":
        return b.rating - a.rating;
      case "Cheap to expensive":
        return a.price - b.price;
      case "Expensive to cheap":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const productViewModeKey = "isBigProductCard";

  const [isBigProductCard, setIsBigProductCard] = useState<boolean>(() => {
    const saved = localStorage.getItem(productViewModeKey);
    return saved !== null ? saved === "true" : true;
  });

  const productsPerPage = isBigProductCard ? 12 : 30;
  const [currentPage, setCurrentPage] = useState<number>(currentPageNumber);
  const totalPages = Math.ceil(sortedFilteredProducts.length / productsPerPage);
  
  const displayedProducts = sortedFilteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const productCards = displayedProducts.map((product: ProductCardType) => (
    <ProductCard
      key={product.id}
      isBig={isBigProductCard}
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

  const getProducts = () => {
    const combinedFilters = {
      ...selectedFilters,
      MinPrice: [String(selectedPriceRange.min)],
      MaxPrice: [String(selectedPriceRange.max)],
      Rating: selectedRatings.map(String),
    };

    if (currentCategoryId) {
      dispatch(getProductsByCategory({categoryId: currentCategoryId, filters: combinedFilters}));
    }
  };

  const selectPrice = (range: { min: number; max: number }) => {
    setPendingPriceRange(range);
  };

  const savePriceRange = () => {
    setSelectedPriceRange(pendingPriceRange);
  };
  
  const changeSort = (option: ComboBoxOptionType) => {
    setSortOption(option);
  };

  const changeRowToggle = (side: "left" | "right") => {
    const isBig = side === "left";
    setIsBigProductCard(isBig);
    localStorage.setItem(productViewModeKey, String(isBig));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    if (currentCategoryId) {
      dispatch(getCategoryById(currentCategoryId));
      dispatch(getProductsByCategory({categoryId: currentCategoryId, filters: {}}));
      dispatch(getCategories());
    }
  }, []);

  useEffect(() => {
    if (categoryProducts.length > 0 && !categoryProductsLoading && !hasInitialized) {
      const discountedPrices = categoryProducts.map((p) => {
        const discount = p.discountPercent ?? 0;
        return p.price * (1 - discount / 100);
      });

      const minPrice = Math.floor(Math.min(...discountedPrices));
      const maxPrice = Math.ceil(Math.max(...discountedPrices));

      setInitialMinPrice(minPrice);
      setInitialMaxPrice(maxPrice);

      setSelectedPriceRange({min: minPrice, max: maxPrice});

      setHasInitialized(true);
    }
  }, [categoryProducts]);

  useEffect(() => {
    if (hasInitialized) {
      getProducts();
    }
  }, [selectedFilters, selectedRatings]);

  useEffect(() => {
    if (categories.length === 0 || !currentCategoryId) {
      return;
    }

    const categoryMap = new Map<string, CategoryType>();
    categories.forEach((category: CategoryType) => categoryMap.set(category.id, category));

    const currentCategory = categoryMap.get(currentCategoryId);
    if (!currentCategory) {
      return;
    }

    const crumbsArray: CrumbType[] = [{ name: "Home", path: "/" }];
    let parentId = currentCategory.parentId;

    while (parentId) {
      const parentCategory = categoryMap.get(parentId);

      if (parentCategory) {
        crumbsArray.splice(1, 0, {
          name: parentCategory.name,
          path: `/products/${parentCategory.name.toLowerCase().replace(/\s+/g, "-")}?CategoryId=${parentCategory.id}`,
        });
        parentId = parentCategory.parentId;
      } 
      else {
        break;
      }
    }

    setCrumbs(crumbsArray);
  }, [categories, currentCategoryId]);

  useEffect(() => {
    if (!isDesktop) {
      setIsBigProductCard(false);
    } 
    else {
      const saved = localStorage.getItem(productViewModeKey);

      if (saved !== null) {
        setIsBigProductCard(saved === "true");
      } 
      else {
        setIsBigProductCard(true);
        localStorage.setItem(productViewModeKey, "true");
      }
    }
  }, [isDesktop]);

  useEffect(() => {
    const total = Math.ceil(categoryProducts.length / productsPerPage);
    
    if (total > 0 && currentPage > total) {
      setCurrentPage(total);
    }
  }, [productsPerPage, categoryProducts.length, currentPage]);

  return (
    <div className="page appear-transition">
      <Header searchBar={true} cart={true}></Header>
      
      <main className={productListStyles.productListMain}>
        <BackToTopButton />

        <section className={productListStyles.productListSection}>
          <div className={productListStyles.productListContainer}>
            <Breadcrumb className={productListStyles.breadcrumb} crumbs={crumbs} />

            <h1>{currentCategory?.name}</h1>

            <div className={productListStyles.listContainer}>
              <div className={productListStyles.listLeftContainer}>
                <>
                  {filterComboBoxes}

                  {hasInitialized && (
                    <>
                      <PriceComboBox
                        title="Price"
                        isOpen={true}
                        initialMinPrice={initialMinPrice}
                        initialMaxPrice={initialMaxPrice}
                        selectedMinPrice={selectedPriceRange.min}
                        selectedMaxPrice={selectedPriceRange.max}
                        onPriceChange={selectPrice}
                        onSave={savePriceRange}
                      />

                      <RatingComboBox
                        title="Customer reviews"
                        isOpen={true}
                        onSelect={(ratings: number[]) => setSelectedRatings(ratings)}
                        selectedRatings={selectedRatings}
                      />
                    </>
                  )}
                </>
              </div>

              <div className={productListStyles.listRightContainer}>
                <div className={productListStyles.comboBoxesContainer}>
                  <div className={productListStyles.appliedFiltersContainer}>
                    {isDesktop ? (
                      <AppliedFiltersComboBox 
                        isOpen={false}
                        selectedFilters={selectedFilters}
                        onRemoveFilter={(filterName, value) => {
                          setSelectedFilters(prev => {
                            const updated = { ...prev };
                            updated[filterName] = updated[filterName].filter(v => v !== value);
                            if (updated[filterName].length === 0) {
                              delete updated[filterName];
                            }
                            return updated;
                          });
                        }}
                        onClearAll={() => setSelectedFilters({})}
                      />
                    ) : (
                      <button>
                        <FilterEmptyIcon className={productListStyles.filterIcon} />
                      </button>
                    )}
                  </div>

                  <SortComboBox 
                    isOpen={false} 
                    options={sortOptions}
                    selectedOption={sortOption}
                    onSortChange={changeSort} 
                  />
                  <RowNumberToggle 
                    className={productListStyles.rowNumberToggle} 
                    side={isBigProductCard ? "left" : "right"}
                    onToggleChange={changeRowToggle} 
                  />
                </div>

                <hr className={`${productListStyles.listDivider} divider`} />

                {(categoryProducts.length > 0 && productCards.length > 0) ? (
                  <>
                    <div className={`${isBigProductCard ? productListStyles.bigProductCardList : productListStyles.productCardList}`}>
                      {productCards}
                    </div>
                    <Pagination
                      className={productListStyles.pagination}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </>
                ) : (
                  categoryProductsLoading ? (
                    <p className={productListStyles.productCardListMessage}>Loading products...</p>
                  ) : (
                    <p className={productListStyles.productCardListMessage}>No products found.</p>
                  )
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

export default ProductList;