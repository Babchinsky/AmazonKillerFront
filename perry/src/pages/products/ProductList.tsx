import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { getCategories } from "../../state/categories/categories-slice";
import { getProductsByCategory } from "../../state/products/products-slice";
import { getCssVariable } from "../../utils/getCssVariable";
import { useBreakpoint } from "../../utils/useBreakpoint";
import CategoryType from "../../types/category-type";
import CrumbType from "../../types/crumb-type";
import ProductType from "../../types/product-type";
import ComboBoxOptionType from "../../types/combo-box-option-type";
import Header from "../../components/Header";
import BackToTopButton from "../../components/buttons/BackToTopButton";
import Breadcrumb from "../../components/Breadcrumb";
import FilterComboBox from "../../components/combo-boxes/FilterComboBox";
import PriceComboBox from "../../components/combo-boxes/PriceComboBox";
import RatingComboBox from "../../components/combo-boxes/RatingComboBox";
import AppliedFiltersComboBox from "../../components/combo-boxes/AppliedFiltersComboBox";
import SortComboBox from "../../components/combo-boxes/SortComboBox";
import RowNumberToggle from "../../components/toggles/RowNumberToggle";
import ProductCard from "../../components/cards/ProductCard";
import Pagination from "../../components/pagination/Pagination";
import Footer from "../../components/Footer";
import FilterEmpty from "../../assets/icons/filter-empty.svg?react";
import "./ProductList.scss";


function ProductList() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const currentCategoryId = searchParams.get("id");

  const hasInitialized = useRef<boolean>(false);

  const breakpointDesktop = parseInt(getCssVariable("--breakpoint-desktop"), 10);
  const isDesktop = useBreakpoint(breakpointDesktop);

  const categories = useSelector((state: RootState) => state.categories.categories);
  const products = useSelector((state: RootState) => state.products.productsByCategory);

  const [currentCategory, setCurrentCategory] = useState<CategoryType>();
  const [crumbs, setCrumbs] = useState<CrumbType[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFabricTypes, setSelectedFabricTypes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minAvailablePrice, setMinAvailablePrice] = useState<number>(0);
  const [maxAvailablePrice, setMaxAvailablePrice] = useState<number>(100);
  const [minSelectedPrice, setMinSelectedPrice] = useState<number>(0);
  const [maxSelectedPrice, setMaxSelectedPrice] = useState<number>(100);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const sortOptions = [
    { id: "1", label: "By rating" },
    { id: "2", label: "Novelty" },
    { id: "3", label: "Cheap to expensive" },
    { id: "4", label: "Expensive to cheap" },
  ];

  const [sortOption, setSortOption] = useState<ComboBoxOptionType>(sortOptions[0]);

  const sortedFilteredProducts = [...products]
  .filter((product: ProductType) => {
    const priceRange = product.price >= minSelectedPrice && product.price <= maxSelectedPrice;
    const rating = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.rating));
    return priceRange && rating;
  })
  .sort((product1: ProductType, product2: ProductType) => {
    switch (sortOption.label) {
      case "By rating":
        return product2.rating - product1.rating;
      case "Novelty":
        return new Date(product2.createdAt).getTime() - new Date(product1.createdAt).getTime();
      case "Cheap to expensive":
        return product1.price - product2.price;
      case "Expensive to cheap":
        return product2.price - product1.price;
      default:
        return 0;
    }
  });

  const [isBigProductCard, setIsBigProductCard] = useState<boolean>(true);
  const productsPerPage = isBigProductCard ? 12 : 30;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(sortedFilteredProducts.length / productsPerPage);
  
  const displayedProducts = sortedFilteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const productCards = displayedProducts.map((product: ProductType) => (
    <ProductCard
      key={product.id}
      isBig={isBigProductCard}
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

  type FilterType = "Brand" | "Fabric type" | "Size" | "Color";
  const selectOptions = (selectedOptions: string[], filterType: FilterType) => {
    switch (filterType) {
      case "Brand":
        setSelectedBrands(selectedOptions);
        break;
      case "Fabric type":
        setSelectedFabricTypes(selectedOptions);
        break;
      case "Size":
        setSelectedSizes(selectedOptions);
        break;
      case "Color":
        setSelectedColors(selectedOptions);
        break;
    }
  };

  const selectPriceRange = (min: number, max: number) => {
    setMinSelectedPrice(min);
    setMaxSelectedPrice(max);
  };

  const selectRatingOptions = (selectedOptions: number[]) => {
    setSelectedRatings(selectedOptions);
  };

  const changeSort = (option: ComboBoxOptionType) => {
    setSortOption(option);
  };
  
  const changeRowToggle = (side: "left" | "right") => {
    setIsBigProductCard(side === "left");
  };
  
  useEffect(() => {
    dispatch(getCategories());
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const currentCategory = categories.find((category: CategoryType) => category.id === currentCategoryId);
      
      if (currentCategory) {
        setCurrentCategory(currentCategory);
        dispatch(getProductsByCategory(currentCategory.id));
      }
    }
  }, [categories, dispatch, currentCategoryId]);

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
          path: `/products/${parentCategory.name.toLowerCase().replace(/\s+/g, "-")}?id=${parentCategory.id}`,
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
    if (products.length === 0) {
      return;
    }
  
    const prices = products.map((product: ProductType) => product.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));

    setMinAvailablePrice(minPrice);
    setMaxAvailablePrice(maxPrice);

    if (!hasInitialized.current) {
      setMinSelectedPrice(minPrice);
      setMaxSelectedPrice(maxPrice);
      hasInitialized.current = true;
    }
  }, [products]);

  useEffect(() => {
    if (isDesktop) {
      setIsBigProductCard(true);
    } 
    else {
      setIsBigProductCard(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    const total = Math.ceil(products.length / productsPerPage);
    
    if (total > 0 && currentPage > total) {
      setCurrentPage(total);
    }
  }, [productsPerPage, products.length, currentPage]);
  
  return (
    <>
      <Header searchBar={true} cart={true}></Header>
      <BackToTopButton></BackToTopButton>

      <section className="product-list-content-section">
        <div className="product-list-content-container">
          <Breadcrumb className="product-list-breadcrumb" crumbs={crumbs} />

          <h1 className="category-name">{currentCategory?.name}</h1>

          {hasInitialized.current && (
            <div className="list-container">
              <div className="list-left-container">
                <FilterComboBox
                  type="list"
                  title="Brand"
                  isOpen={true}
                  onSelect={(options) => selectOptions(options, "Brand")}
                  options={[
                    { id: "1", label: "Option 1" },
                    { id: "2", label: "Option 2" },
                    { id: "3", label: "Option 3" },
                    { id: "4", label: "Option 4" },
                    { id: "5", label: "Option 5" },
                    { id: "6", label: "Option 6" },
                    { id: "7", label: "Option 7" },
                    { id: "8", label: "Option 8" },
                    { id: "9", label: "Option 9" },
                    { id: "10", label: "Option 10" }
                  ]}
                />

                <FilterComboBox
                  type="list"
                  title="Fabric type"
                  isOpen={true}
                  onSelect={(options) => selectOptions(options, "Fabric type")}
                  options={[
                    { id: "1", label: "Option 1" },
                    { id: "2", label: "Option 2" },
                    { id: "3", label: "Option 3" },
                    { id: "4", label: "Option 4" },
                    { id: "5", label: "Option 5" },
                    { id: "6", label: "Option 6" },
                    { id: "7", label: "Option 7" },
                    { id: "8", label: "Option 8" },
                    { id: "9", label: "Option 9" },
                    { id: "10", label: "Option 10" }
                  ]}
                />

                <FilterComboBox
                  type="grid"
                  title="Size"
                  isOpen={true}
                  onSelect={(options) => selectOptions(options, "Size")}
                  options={[
                    { id: "1", label: "1" },
                    { id: "2", label: "2" },
                    { id: "3", label: "3" },
                    { id: "4", label: "4" },
                    { id: "5", label: "5" },
                    { id: "6", label: "6" },
                    { id: "7", label: "7" },
                    { id: "8", label: "8" },
                    { id: "9", label: "9" },
                    { id: "10", label: "10" },
                    { id: "11", label: "11" },
                    { id: "12", label: "12" },
                    { id: "13", label: "13" },
                    { id: "14", label: "14" },
                    { id: "15", label: "15" },
                    { id: "16", label: "16" },
                    { id: "17", label: "17" },
                    { id: "18", label: "18" },
                    { id: "19", label: "19" },
                    { id: "20", label: "20" },
                    { id: "21", label: "21" },
                    { id: "22", label: "22" },
                    { id: "23", label: "23" },
                    { id: "24", label: "24" },
                    { id: "25", label: "25" }
                  ]}
                />

                <FilterComboBox
                  type="list"
                  title="Color"
                  isOpen={true}
                  onSelect={(options) => selectOptions(options, "Color")}
                  options={[
                    { id: "1", label: "Option 1" },
                    { id: "2", label: "Option 2" },
                    { id: "3", label: "Option 3" },
                    { id: "4", label: "Option 4" },
                    { id: "5", label: "Option 5" },
                    { id: "6", label: "Option 6" },
                    { id: "7", label: "Option 7" },
                    { id: "8", label: "Option 8" },
                    { id: "9", label: "Option 9" },
                    { id: "10", label: "Option 10" }
                  ]}
                />

                <PriceComboBox
                  title="Price"
                  isOpen={true}
                  minPrice={minAvailablePrice}
                  maxPrice={maxAvailablePrice}
                  onPriceChange={selectPriceRange}
                />

                <RatingComboBox
                  title="Customer reviews"
                  isOpen={true}
                  onSelect={selectRatingOptions}
                />
              </div>

              <div className="list-right-container">
                <div className="combo-boxes-container">
                  <div className="list-applied-filters-container">
                    {isDesktop ? (
                      <AppliedFiltersComboBox isOpen={false} />
                    ) : (
                      <button className="applied-filters-button">
                        <FilterEmpty className="filter-empty-icon" />
                      </button>
                    )}
                  </div>

                  <SortComboBox 
                    isOpen={false} 
                    options={sortOptions}
                    selectedOption={sortOption}
                    onSortChange={changeSort} 
                  />
                  <RowNumberToggle className="list-row-number-toggle" onToggleChange={changeRowToggle} />
                </div>

                <hr className="divider"></hr>

                {sortedFilteredProducts.length > 0 ? (
                  <>
                    <div className={`${isBigProductCard ? "big-product-card-list" : "product-card-list"}`}>
                      {productCards}
                    </div>
                    <Pagination
                      className="list-pagination"
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </>
                ) : (
                  <p className="product-card-list-message">No products found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer></Footer>
    </>
  );
}

export default ProductList;