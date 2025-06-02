import StarFullIcon from "../assets/icons/star-full.svg?react";
import StarEmptyIcon from "../assets/icons/star-empty.svg?react";
import starsStyles from "./Stars.module.scss";


interface StarsProps {
  count: number;
}

function Stars(props: StarsProps) {
  const maxCount = 5;

  return (
    <div className={starsStyles.starsContainer}>
      {Array.from({length: maxCount}, (_, i) =>
        i < props.count ? <StarFullIcon key={i} className={starsStyles.starIcon} /> : <StarEmptyIcon key={i} className={starsStyles.starIcon} />
      )}
    </div>
  );
}

export default Stars;