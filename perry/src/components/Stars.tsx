import StarFull from "../assets/icons/star-full.svg?react";
import StarEmpty from "../assets/icons/star-empty.svg?react";
import "./Stars.scss";


interface StarsProps {
  count: number;
}

function Stars(props: StarsProps) {
  const maxCount = 5;

  return (
    <div className="stars-container">
      {Array.from({length: maxCount}, (_, i) =>
        i < props.count ? <StarFull key={i} className="star-icon" /> : <StarEmpty key={i} className="star-icon" />
      )}
    </div>
  );
}

export default Stars;