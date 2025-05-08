import { Link } from "react-router";
import ArrowRight from "../../assets/icons/arrow-right.svg?react";
import "./CategoryCard.scss";


interface CategoryCardProps {
	image: string;
	title: string;
  link: string;
}
  
function CategoryCard(props: CategoryCardProps) {
  return (
    <Link className="link" to={props.link}>
      <div className="category-card-container">
        <div className="category-card-top-container">
          <img className="category-image" alt="Category" src={props.image} />
          <p className="category-title">
            {props.title}
          </p>
        </div>

        <div className="category-card-bottom-container">
          <div className="see-all-link">
            <span>See all</span>
            <ArrowRight className="arrow-right-icon" />
          </div> 
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;