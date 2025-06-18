import { useEffect, useState } from "react";
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

  const [hasInitializedCategory, setHasInitializedCategory] = useState(false);
  const [hasInitializedProducts, setHasInitializedProducts] = useState(false);

  const [crumbs, setCrumbs] = useState<CrumbType[]>([]);

  const categories = useSelector((state: RootState) => state.categories.categories);
  const categoryProducts = useSelector((state: RootState) => state.products.categoryProducts);
  const currentCategory = useSelector((state: RootState) => state.categories.currentCategory);

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

  const [minAvailablePrice, setMinAvailablePrice] = useState<number>(0);
  const [maxAvailablePrice, setMaxAvailablePrice] = useState<number>(1000);
  const [minSelectedPrice, setMinSelectedPrice] = useState<number | null>(null);
  const [maxSelectedPrice, setMaxSelectedPrice] = useState<number | null>(null);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const sortOptions = [
    { id: "1", label: "By rating" },
    { id: "2", label: "Novelty" },
    { id: "3", label: "Cheap to expensive" },
    { id: "4", label: "Expensive to cheap" }
  ];
  const [sortOption, setSortOption] = useState<ComboBoxOptionType>(sortOptions[0]);

  const sortedFilteredProducts = [...categoryProducts]
  .sort((a, b) => {
    switch (sortOption.label) {
      case "By rating":
        return b.rating - a.rating;
      // case "Novelty":
      //   return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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

    dispatch(getCategories());
  }, []);

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
    if (currentCategory) {
      setHasInitializedCategory(true);
    }
  }, [currentCategory]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", currentPage.toString());
    setSearchParams(newParams, { replace: true });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    if (!hasInitializedCategory) return;

    const filterState: { [key: string]: string[] } = {};

    if (currentCategory?.filters) {
      Object.keys(currentCategory.filters).forEach((filterName) => {
        const values = searchParams.getAll(filterName);
        if (values.length > 0) {
          filterState[filterName] = values;
        }
      });
    }

    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");

    if (min) setMinSelectedPrice(Number(min));
    if (max) setMaxSelectedPrice(Number(max));

    const ratings = searchParams.getAll("rating").map(r => parseInt(r, 10));
    if (ratings.length > 0) setSelectedRatings(ratings);

    setSelectedFilters(filterState);
  }, [searchParams, currentCategory, hasInitializedCategory]);


  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    Object.keys(selectedFilters).forEach((key) => {
      newParams.delete(key);
    });
    newParams.delete("minPrice");
    newParams.delete("maxPrice");
    newParams.delete("rating");

    Object.entries(selectedFilters).forEach(([key, values]) => {
      values.forEach((val) => newParams.append(key, val));
    });

    if (minSelectedPrice !== null) {
      newParams.set("minPrice", String(minSelectedPrice));
    }
    if (maxSelectedPrice !== null) {
      newParams.set("maxPrice", String(maxSelectedPrice));
    }

    if (selectedRatings.length > 0) {
      selectedRatings.forEach(r => newParams.append("rating", String(r)));
    }

    newParams.set("page", "1");

    setSearchParams(newParams, { replace: true });
  }, [selectedFilters, minSelectedPrice, maxSelectedPrice, selectedRatings]);

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
    if (currentCategoryId && (!currentCategory || currentCategory.id !== currentCategoryId)) {
      dispatch(getCategoryById(currentCategoryId));
    }
  }, [dispatch, currentCategoryId, currentCategory?.id]); 

  useEffect(() => {
    if (currentCategoryId) {
      const extendedFilters: { [key: string]: string[] } = { ...selectedFilters };

      if (minSelectedPrice !== null && maxSelectedPrice !== null) {
        extendedFilters["minPrice"] = [String(minSelectedPrice)];
        extendedFilters["maxPrice"] = [String(maxSelectedPrice)];
      }

      if (selectedRatings.length > 0) {
        extendedFilters["rating"] = selectedRatings.map(r => String(r));
      }

      dispatch(getProductsByCategory({
        categoryId: currentCategoryId,
        filters: extendedFilters,
      }));
    }
  }, [dispatch, currentCategoryId, selectedFilters, minSelectedPrice, maxSelectedPrice, selectedRatings]);

  useEffect(() => {
    if (
      categoryProducts.length > 0 &&
      Object.keys(selectedFilters).length === 0 &&
      minSelectedPrice === null &&
      maxSelectedPrice === null &&
      selectedRatings.length === 0
    ) {
      const discountedPrices = categoryProducts.map((p) => {
        const discount = p.discountPercent ?? 0;
        return p.price * (1 - discount / 100);
      });

      const minPrice = Math.floor(Math.min(...discountedPrices));
      const maxPrice = Math.ceil(Math.max(...discountedPrices));

      setMinAvailablePrice(minPrice);
      setMaxAvailablePrice(maxPrice);

      if (!hasInitializedProducts) {
        setMinSelectedPrice(minPrice);
        setMaxSelectedPrice(maxPrice);
        setHasInitializedProducts(true);
      }
    }
  }, [categoryProducts, selectedFilters, minSelectedPrice, maxSelectedPrice, selectedRatings, hasInitializedProducts]);

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

            {hasInitializedCategory && (
              <div className={productListStyles.listContainer}>
                {hasInitializedProducts && (
                  <div className={productListStyles.listLeftContainer}>
                    {currentCategory && (
                      <>
                        {filterComboBoxes}

                        <PriceComboBox
                          title="Price"
                          isOpen={true}
                          minPrice={minAvailablePrice}
                          maxPrice={maxAvailablePrice}
                          onPriceChange={(min, max) => {
                            setMinSelectedPrice(min);
                            setMaxSelectedPrice(max);
                          }}
                        />

                        <RatingComboBox
                          title="Customer reviews"
                          isOpen={true}
                          onSelect={(ratings: number[]) => setSelectedRatings(ratings)}
                        />
                      </>
                    )}
                  </div>
                )}

                <div className={productListStyles.listRightContainer}>
                  <div className={productListStyles.comboBoxesContainer}>
                    <div className={productListStyles.appliedFiltersContainer}>
                      {isDesktop ? (
                        <AppliedFiltersComboBox isOpen={false} />
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

                  {categoryProducts.length > 0 ? (
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
                    <p className={productListStyles.productCardListMessage}>No products found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer></Footer>
    </div>
  );
}

export default ProductList;