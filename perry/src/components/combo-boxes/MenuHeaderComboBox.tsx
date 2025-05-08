import { useState } from "react";
import { Link } from "react-router";
import CategoryType from "../../types/category-type";
import TextButton from "../buttons/TextButton";
import ArrowDown from "../../assets/icons/arrow-down.svg?react";
import Category from "../../assets/icons/category.svg?react";
import Hanger from "../../assets/icons/hanger.svg?react";
import "./ComboBox.scss";
import "./MenuHeaderComboBox.scss";


interface MenuHeaderComboBoxProps {
  isOpen: boolean;
  categories: CategoryType[];
}

function MenuHeaderComboBox(props: MenuHeaderComboBoxProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(props.isOpen);

  return (
    <div className="menu-header-combo-box-container">
      <div className="menu-header-combo-box-top-container">
        <div className="title-container" onClick={() => setIsFilterOpen(prev => !prev)}>
          <div className="product-catalog-container">
            <Category className="category-icon" />
            <p>Product catalog</p>
          </div>

          <button 
            className="menu-header-combo-box-button" 
            onClick={(e) => {
              e.stopPropagation();
              setIsFilterOpen(prev => !prev);
            }}
          >
            <ArrowDown className={`arrow-down-icon ${isFilterOpen ? "arrow-down-icon-open" : ""}`} />
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="menu-header-combo-box-bottom-container">
          {props.categories.length > 0 && (
            <div className="categories-container">
              {props.categories.slice(0, 5).map(category => (
                <Link key={category.id} className="category-link link" to={`/products/${category.name.toLowerCase().replace(/\s+/g, "-")}?id=${category.id}`}>
                  <div className="category">
                    <Hanger className="category-icon" />
                    {category.name}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <TextButton
            className="see-all-button"
            type="secondary"
            content="See all"
            onClick={() => {}}
          />
        </div>
      )}
    </div>
  );
}

export default MenuHeaderComboBox;