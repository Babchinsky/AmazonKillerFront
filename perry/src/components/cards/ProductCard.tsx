import { Link } from "react-router";
import { getFormattedValue } from "../../utils/getFormattedValue";
import TextButton from "../buttons/TextButton";
import StarFull from "../../assets/icons/star-full.svg?react";
import Comments from "../../assets/icons/comments.svg?react";
import DiscountIcon from "../../assets/icons/discount-icon.svg?react";
import "./ProductCard.scss";


interface ProductCardProps {
  isBig?: boolean;
	image: string;
	title: string;
  link: string;
  rating: number;
  reviewsCount: number;
  price: number;
  discount: number;
  quantity: number;
}

function ProductCard(props: ProductCardProps) {
  const discountedPrice = (props.price - (props.price * props.discount / 100)).toFixed(2);
  const [currencyMajor, currencyMinor] = discountedPrice.split(".");

  return (
    <div className={`${props.isBig ? "big-product-card-link-container" : "product-card-link-container"}`}>
      {props.quantity === 0 && (
        <div className="out-of-stock-overlay-container">
          <div className="overlay"></div>

          <div className="content-container">
            <p className="title">Out of stock</p>
            <TextButton className="stock-alert-button" type="primary" content="Stock alert" />
          </div>
        </div>
      )}

      <Link className="product-link link" to={props.link}>
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
                  <p>{getFormattedValue(props.reviewsCount)}</p>
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
                <p className="old-product-price">
                  $&#8239;{props.price.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;