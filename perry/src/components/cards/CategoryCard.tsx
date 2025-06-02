import { Link } from "react-router";
import ArrowRightIcon from "../../assets/icons/arrow-right.svg?react";
import categoryCardStyles from "./CategoryCard.module.scss";


interface CategoryCardProps {
  link: string;
	imageUrl: string;
	name: string;
}
  
function CategoryCard(props: CategoryCardProps) {
  return (
    <div className={categoryCardStyles.categoryCardLinkContainer}>
      <div className={categoryCardStyles.categoryBorder}></div>

      <Link className={`${categoryCardStyles.categoryLink} link`} to={props.link}>
        <div className={categoryCardStyles.cardContainer}>
          <div className={categoryCardStyles.topContainer}>
            <img alt="Category" src={props.imageUrl} />
            <p>{props.name}</p>
          </div>
  
          <div className={categoryCardStyles.bottomContainer}>
            <div className={categoryCardStyles.seeAllLink}>
              <span>See all</span>
              <ArrowRightIcon className={categoryCardStyles.arrowRightIcon} />
            </div>
          </div>
        </div>
      </Link>
    </div>
   
  );
}

export default CategoryCard;