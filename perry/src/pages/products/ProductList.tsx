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

import {
  updateFilter,
  clearFilters,
  setMinPrice,
  setMaxPrice,
  setSelectedRatings,
  setSelectedFilters,
} from "../../state/filters/filters-slice";


function ProductList() {
  const dispatch = useDispatch<AppDispatch>();

  const [searchParams, setSearchParams] = useSearchParams();

  const categories = useSelector((state: RootState) => state.categories.categories);
  const categoryProducts = useSelector((state: RootState) => state.products.categoryProducts);
  const currentCategory = useSelector((state: RootState) => state.categories.currentCategory);

  const breakpointDesktop = parseInt(getCssVariable("--breakpoint-desktop"), 10);
  const isDesktop = useBreakpoint(breakpointDesktop);

  const selectedFilters = useSelector((state: RootState) => state.filters.selectedFilters);
  const minSelectedPrice = useSelector((state: RootState) => state.filters.minPrice);
  const maxSelectedPrice = useSelector((state: RootState) => state.filters.maxPrice);
  const selectedRatings = useSelector((state: RootState) => state.filters.selectedRatings);
  
  const [hasInitializedCategory, setHasInitializedCategory] = useState(false);
  const [hasInitializedProducts, setHasInitializedProducts] = useState(false);
  const [crumbs, setCrumbs] = useState<CrumbType[]>([]);
  const [minAvailablePrice, setMinAvailablePrice] = useState<number>(0);
  const [maxAvailablePrice, setMaxAvailablePrice] = useState<number>(1000);

  const sortOptions = [
    { id: "1", label: "By rating" },
    { id: "2", label: "Novelty" },
    { id: "3", label: "Cheap to expensive" },
    { id: "4", label: "Expensive to cheap" }
  ];
  const [sortOption, setSortOption] = useState<ComboBoxOptionType>(sortOptions[0]);

  const productViewModeKey = "isBigProductCard";
  const [isBigProductCard, setIsBigProductCard] = useState<boolean>(() => {
    const saved = localStorage.getItem(productViewModeKey);
    return saved !== null ? saved === "true" : true;
  }); 

  const productsPerPage = isBigProductCard ? 12 : 30;
  const currentPageNumber = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState<number>(currentPageNumber);

  const totalPages = Math.ceil(categoryProducts.length / productsPerPage);

  const sortedFilteredProducts = [...categoryProducts].sort((a, b) => {
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
  }, [dispatch]);

  useEffect(() => {
    if (categories.length === 0 || !currentCategory?.id) return;

    const categoryMap = new Map<string, CategoryType>();
    categories.forEach((category) => categoryMap.set(category.id, category));

    const crumbsArray: CrumbType[] = [{ name: "Home", path: "/" }];
    let parentId = currentCategory.parentId;

    while (parentId) {
      const parentCategory = categoryMap.get(parentId);
      if (!parentCategory) break;

      crumbsArray.splice(1, 0, {
        name: parentCategory.name,
        path: `/products/${parentCategory.name.toLowerCase().replace(/\s+/g, "-")}?CategoryId=${parentCategory.id}`,
      });
      parentId = parentCategory.parentId;
    }

    setCrumbs(crumbsArray);
  }, [categories, currentCategory]);

  useEffect(() => {
    if (currentCategory) {
      setHasInitializedCategory(true);
    }
  }, [currentCategory]);


  useEffect(() => {
    if (currentCategory?.id) {
      const extendedFilters: { [key: string]: string[] } = { ...selectedFilters };

      if (minSelectedPrice !== null) extendedFilters["minPrice"] = [String(minSelectedPrice)];
      if (maxSelectedPrice !== null) extendedFilters["maxPrice"] = [String(maxSelectedPrice)];
      if (selectedRatings.length > 0) extendedFilters["rating"] = selectedRatings.map(r => String(r));

      dispatch(getProductsByCategory({
        categoryId: currentCategory.id,
        filters: extendedFilters,
      }));
    }
  }, [dispatch, currentCategory?.id, selectedFilters, minSelectedPrice, maxSelectedPrice, selectedRatings]);

  useEffect(() => {
    if (
      categoryProducts.length > 0 &&
      Object.keys(selectedFilters).length === 0 &&
      minSelectedPrice === null &&
      maxSelectedPrice === null &&
      selectedRatings.length === 0
    ) {
      const discountedPrices = categoryProducts.map(p => {
        const discount = p.discountPercent ?? 0;
        return p.price * (1 - discount / 100);
      });

      const minPrice = Math.floor(Math.min(...discountedPrices));
      const maxPrice = Math.ceil(Math.max(...discountedPrices));

      setMinAvailablePrice(minPrice);
      setMaxAvailablePrice(maxPrice);

      if (!hasInitializedProducts) {
        dispatch(setMinPrice(minPrice));
        dispatch(setMaxPrice(maxPrice));
        setHasInitializedProducts(true);
      }
    }
  }, [categoryProducts, selectedFilters, minSelectedPrice, maxSelectedPrice, selectedRatings, hasInitializedProducts, dispatch]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    if (!isDesktop) {
      setIsBigProductCard(false);
    } else {
      const saved = localStorage.getItem(productViewModeKey);
      if (saved !== null) {
        setIsBigProductCard(saved === "true");
      } else {
        setIsBigProductCard(true);
        localStorage.setItem(productViewModeKey, "true");
      }
    }
  }, [isDesktop]);

  const currentCategoryId = searchParams.get("CategoryId");

  useEffect(() => {
    if (currentCategoryId && (!currentCategory || currentCategory.id !== currentCategoryId)) {
      dispatch(getCategoryById(currentCategoryId));
    }
  }, [dispatch, currentCategoryId, currentCategory?.id]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", currentPage.toString());
    setSearchParams(newParams, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  
  const selectFilter = (filterName: string, selectedValues: string[]) => {
    dispatch(updateFilter({ filterName, values: selectedValues }));
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
  };

  useEffect(() => {
    const newParams = new URLSearchParams();

    if (currentCategory?.id) {
      newParams.set("CategoryId", currentCategory.id);
    }

    Object.entries(selectedFilters).forEach(([key, values]) => {
      values.forEach(value => newParams.append(key, value));
    });

    if (minSelectedPrice !== null) newParams.set("minPrice", String(minSelectedPrice));
    if (maxSelectedPrice !== null) newParams.set("maxPrice", String(maxSelectedPrice));

    selectedRatings.forEach(r => newParams.append("rating", String(r)));

    newParams.set("page", currentPage.toString());

    setSearchParams(newParams, { replace: true });
  }, [selectedFilters, minSelectedPrice, maxSelectedPrice, selectedRatings, currentPage, currentCategory?.id]);

  useEffect(() => {
    if (!hasInitializedCategory || !currentCategory) return;

    const filterState: { [key: string]: string[] } = {};

    if (currentCategory.filters) {
      Object.keys(currentCategory.filters).forEach(filterName => {
        const values = searchParams.getAll(filterName);
        if (values.length > 0) {
          filterState[filterName] = values;
        }
      });
    }

    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");
    const ratings = searchParams.getAll("rating").map(r => parseInt(r, 10)).filter(r => !isNaN(r));

    dispatch(setSelectedFilters(filterState));
    dispatch(setMinPrice(min ? Number(min) : null));
    dispatch(setMaxPrice(max ? Number(max) : null));
    dispatch(setSelectedRatings(ratings));
  }, [searchParams, currentCategory, hasInitializedCategory, dispatch]);

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
                            dispatch(setMinPrice(min));
                            dispatch(setMaxPrice(max));
                          }}
                          minSelectedPrice={minSelectedPrice}
                          maxSelectedPrice={maxSelectedPrice}
                        />

                        <RatingComboBox
                          title="Customer reviews"
                          isOpen={true}
                          onSelect={(ratings: number[]) => dispatch(setSelectedRatings(ratings))}
                          // selectedRatings={selectedRatings}
                        />
                      </>
                    )}
                  </div>
                )}

                <div className={productListStyles.listRightContainer}>
                  <div className={productListStyles.comboBoxesContainer}>
                    <div className={productListStyles.appliedFiltersContainer}>
                      {isDesktop ? (
                        <AppliedFiltersComboBox
                          isOpen={false}
                          selectedFilters={selectedFilters}
                          onRemoveFilter={(filterName, val) => {
                            const updated = (selectedFilters[filterName] || []).filter(v => v !== val);
                            dispatch(updateFilter({ filterName, values: updated }));
                          }}
                          onClearAll={clearAllFilters}
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