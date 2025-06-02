import { useState } from "react";
import Button from "../buttons/Button";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg?react";
import ArrowRightIcon from "../../assets/icons/arrow-right.svg?react";
import bannerCarouselStyles from "./BannerCarousel.module.scss";


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
    <div className={bannerCarouselStyles.bannerCarouselContainer}>
      <img alt="Banner" src={props.images[imageIndex]} />

      {props.images.length > 1 && (
        <div className={bannerCarouselStyles.arrowsContainer}>
          <Button
            className={bannerCarouselStyles.arrowButton}
            type="secondary"
            leftIcon={<ArrowLeftIcon className={bannerCarouselStyles.arrowLeftIcon} />}
            onClick={showPrevImage}
          />

          <Button
            className={bannerCarouselStyles.arrowButton}
            type="secondary"
            leftIcon={<ArrowRightIcon className={bannerCarouselStyles.arrowRightIcon} />}
            onClick={showNextImage}
          />
        </div>
      )}
    </div>
  );
}

export default BannerCarousel;