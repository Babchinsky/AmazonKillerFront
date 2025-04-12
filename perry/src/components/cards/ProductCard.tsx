import { Link } from "react-router";
import StarFull from "../../assets/icons/star-full.svg?react";
import Comments from "../../assets/icons/comments.svg?react";
import DiscountIcon from "../../assets/icons/discount-icon.svg?react";
import "./ProductCard.scss";


interface ProductCardProps {
	image: string;
	title: string;
  link: string;
  rating: number;
  reviews: number;
  price: number;
  discount: number;
  stockQuantity: number;
}
  
function ProductCard(props: ProductCardProps) {
  const discountedPrice = (props.price - (props.price * props.discount / 100)).toFixed(2);
  const [currencyMajor, currencyMinor] = discountedPrice.split(".");

  return (
    <Link to={props.link}>
      <div className="product-card-container">
        <div className="product-card-top-container">
          <img className="product-image" alt="Product" src={props.image} />

          {props.discount > 0 && (
            <div className="product-discount-container">
              <div className="discount-icon-container">
                <DiscountIcon className="discount-icon" />
                <p className="discount">-{props.discount}%</p>
              </div>
            </div>
          )}
        </div>

        <div className="product-card-bottom-container">
          <div className="product-content-container">
            <p className="product-title">
              {props.title}
            </p>

            <div className="product-rating-container">
              <div className="product-rating-stars">
                <StarFull className="star-icon" />
                <p>{props.rating}</p>
              </div>

              <div className="product-rating-reviews">
                <Comments className="comments-icon" />
                <p>{props.reviews}</p>
              </div>
            </div>
          </div>

          <div className="product-price-container">
            <div className="new-product-price-container">
              <p className="new-product-price">
                <span className="currency">$</span> 
                <span>{currencyMajor}</span>
                <span className="currency-minor">{currencyMinor}</span>
              </p>
            </div>

            {props.discount > 0 && (
              <p className="old-product-price">${props.price.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;