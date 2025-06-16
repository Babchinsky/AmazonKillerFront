import { Link } from "react-router";
import { getFormattedValue } from "../../utils/getFormattedValue";
import Button from "../buttons/Button";
import StarFullIcon from "../../assets/icons/star-full.svg?react";
import CommentsIcon from "../../assets/icons/comments.svg?react";
import DiscountIcon from "../../assets/icons/discount.svg?react";
import productCardStyles from "./ProductCard.module.scss";


interface ProductCardProps {
  isBig?: boolean;
  link: string;
  imageUrl: string;
  name: string;
  rating: number;
  reviewsCount: number;
  quantity: number;
  price: number;
  discountPercent?: number | null;
  onRemove?: () => void;
}

function ProductCard(props: ProductCardProps) {
  const discount = props.discountPercent ?? 0;
  const discountedPrice = (props.price - (props.price * discount / 100)).toFixed(2);
  const [currencyMajor, currencyMinor] = discountedPrice.split(".");

  return (
    <div className={props.isBig ? productCardStyles.bigProductCardLinkContainer : productCardStyles.productCardLinkContainer}>
      {props.quantity === 0 && (
        <div className={productCardStyles.overlayContainer}>
          <div className={productCardStyles.overlay}></div>

          <div className={productCardStyles.titleContainer}>
            <p>Out of stock</p>
            <Button className={productCardStyles.stockAlertButton} type="primary" content="Stock alert" />
          </div>
        </div>
      )}
      {props.onRemove && (
        <div className={productCardStyles.removeButtonContainer}>
          <Button className={productCardStyles.removeButton} type="secondary" content="Remove" onClick={props.onRemove} />
        </div>
      )}

      <div className={productCardStyles.productBorder}></div>

      <Link className={`${productCardStyles.productLink} link`} to={props.link}>
        <div className={productCardStyles.productCardContainer}>
          <div className={productCardStyles.topContainer}>
            <img alt="Product" src={props.imageUrl} />

            {discount > 0 && (
              <div className={productCardStyles.discountContainer}>
                <div className={productCardStyles.discountIconContainer}>
                  <DiscountIcon className={productCardStyles.discountIcon} />
                  <p>-{props.discountPercent}%</p>
                </div>
              </div>
            )}
          </div>

          <div className={productCardStyles.bottomContainer}>
            <div className={productCardStyles.dataContainer}>
              <p className={productCardStyles.title}>
                {props.name}
              </p>

              <div className={productCardStyles.ratingReviewsContainer}>
                <div className={productCardStyles.ratingContainer}>
                  <StarFullIcon className={productCardStyles.starIcon} />
                  <p>{Math.floor(props.rating)}</p>
                </div>

                <div className={productCardStyles.reviewsContainer}>
                  <CommentsIcon className={productCardStyles.commentsIcon} />
                  <p>{getFormattedValue(props.reviewsCount)}</p>
                </div>
              </div>
            </div>

            <div className={productCardStyles.priceContainer}>
              <div className={productCardStyles.newPriceContainer}>
                <p className={productCardStyles.newPrice}>
                  <span className={productCardStyles.currency}>$</span> 
                  <span>{currencyMajor}</span>
                  <span className={productCardStyles.currencyMinor}>{currencyMinor}</span>
                </p>
              </div>

              {discount > 0 && (
                <p className={productCardStyles.oldPrice}>
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