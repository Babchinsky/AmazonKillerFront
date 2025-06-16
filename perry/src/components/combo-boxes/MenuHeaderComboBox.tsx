import { useState } from "react";
import { Link } from "react-router";
import { getCategoryIcon } from "../../utils/icons/categoryIconsMap";
import CategoryType from "../../types/categories/category-type";
import Button from "../buttons/Button";
import ArrowDownIcon from "../../assets/icons/arrow-down.svg?react";
import CategoryIcon from "../../assets/icons/category.svg?react";
import menuHeaderComboBoxStyles from "./MenuHeaderComboBox.module.scss";


interface MenuHeaderComboBoxProps {
  isOpen: boolean;
  categories: CategoryType[];
}

function MenuHeaderComboBox(props: MenuHeaderComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);

  const getFormattedCategoryName = (str: string) => {
    return str
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  };

  return (
    <div className={menuHeaderComboBoxStyles.comboBoxContainer}>
      <div className={menuHeaderComboBoxStyles.comboBoxTopContainer}>
        <div className={menuHeaderComboBoxStyles.titleContainer} onClick={() => setIsFilterOpen(prev => !prev)}>
          <div className={menuHeaderComboBoxStyles.productCatalogContainer}>
            <CategoryIcon className={menuHeaderComboBoxStyles.categoryIcon} />
            <p>Product catalog</p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFilterOpen(prev => !prev);
            }}
          >
            <ArrowDownIcon className={`${menuHeaderComboBoxStyles.arrowDownIcon} ${isFilterOpen ? menuHeaderComboBoxStyles["arrowDownIconOpen"] : ""}`} />
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className={menuHeaderComboBoxStyles.comboBoxBottomContainer}>
          {props.categories.length > 0 && (
            <div className={menuHeaderComboBoxStyles.categoriesContainer}>
              {props.categories.slice(0, 5).map(category => {
                const Icon = getCategoryIcon(getFormattedCategoryName(category.iconName ?? ""));

                return (
                  <Link
                    key={category.id}
                    className={`${menuHeaderComboBoxStyles.categoryLink} link minor-color-text-icon-link`}
                    to={`/products/${category.name.toLowerCase().replace(/\s+/g, "-")}?CategoryId=${category.id}`}
                  >
                    <Icon className={menuHeaderComboBoxStyles.categoryIcon} />
                    <p>{category.name}</p>
                  </Link>
                );
              })}
            </div>
          )}

          <Button type="secondary" content="See all" onClick={() => {}} />
        </div>
      )}
    </div>
  );
}

export default MenuHeaderComboBox;