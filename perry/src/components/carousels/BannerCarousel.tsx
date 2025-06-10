import { useState } from "react";
import ArrowLeft from "../../assets/icons/arrow-left.svg?react";
import ArrowRight from "../../assets/icons/arrow-right.svg?react";
import "./BannerCarousel.scss";


interface BannerCarouselProps {
  images: string[];
}

function BannerCarousel(props: BannerCarouselProps) {
  const [imageIndex, setImageIndex] = useState<number>(0);

  const showPrevImage = () => {
    setImageIndex((index: number) => {
      if (index === 0) {
        return props.images.length - 1;
      }

      return index - 1;
    });
  };

  const showNextImage = () => {
    setImageIndex((index: number) => {
      if (index === props.images.length - 1) {
        return 0;
      }
      
      return index + 1;
    });
  };

  return (
    <div className="banner-carousel-container">
      <img className="banner-image" alt="Banner" src={props.images[imageIndex]} />

      {props.images.length > 1 && (
        <div className="arrows-container">
          <button onClick={showPrevImage} className="arrow-button">
            <ArrowLeft className="arrow-left-icon" />
          </button>

          <button onClick={showNextImage} className="arrow-button">
            <ArrowRight className="arrow-right-icon" />
          </button>
        </div>
      )}
    </div>
  );
}

export default BannerCarousel;