import { ReactElement, useLayoutEffect, useRef, useState } from "react";
import { getCssVariable } from "../../utils/getCssVariable";
import { useBreakpoint } from "../../utils/useBreakpoint";
import Button from "../buttons/Button";
import CategoryCard from "../cards/CategoryCard";
import ProductCard from "../cards/ProductCard";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg?react";
import ArrowRightIcon from "../../assets/icons/arrow-right.svg?react";
import cardCarouselStyles from "./CardCarousel.module.scss";


interface CardCarouselProps {
  cards: ReactElement<typeof CategoryCard>[] | ReactElement<typeof ProductCard>[];
  isWrapped: boolean;
}

function CardCarousel(props: CardCarouselProps) {
  const breakpointTablet = parseInt(getCssVariable("--breakpoint-tablet"), 10);
  const isTablet = useBreakpoint(breakpointTablet);
  
  const cardCarouselContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const isCategoryType = props.cards.length > 0 && props.cards[0].type === CategoryCard;

  const gapWidth = isCategoryType ? (isTablet ? 2 : -6) : -6;

  const [isReady, setIsReady] = useState<boolean>(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useLayoutEffect(() => {
    checkScrollPosition();
  }, [props.cards, isReady]);

  useLayoutEffect(() => {
    const container = cardsContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkScrollPosition);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  const checkScrollPosition = () => {
    if (!cardsContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = cardsContainerRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const updateCardsPerView = () => {
    if (cardCarouselContainerRef.current && cardsContainerRef.current && cardRef.current) {
      const containerRefWidth = cardCarouselContainerRef.current.offsetWidth;
      const cardRefWidth = cardRef.current.offsetWidth;

      let maxCards = Math.floor(containerRefWidth / cardRefWidth);

      if (!isTablet) {
        maxCards -= 1;
      }
      
      const carouselWidth = (maxCards * cardRefWidth) + (maxCards - 1) * gapWidth;
      cardsContainerRef.current.style.width = `${carouselWidth}px`;

      setIsReady(true);
    }
  };

  useLayoutEffect(() => {
    updateCardsPerView();
  }, [props.cards]);

  useLayoutEffect(() => {
    if (!cardCarouselContainerRef.current) {
      return;
    }

    updateCardsPerView();

    const observer = new ResizeObserver(() => {
      updateCardsPerView();
    });
    observer.observe(cardCarouselContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isTablet, gapWidth]);

  const scrollLeft = () => {
    if (cardsContainerRef.current) {
      cardsContainerRef.current.scrollBy({
        top: 0,
        left: -(cardsContainerRef.current.offsetWidth + gapWidth),
        behavior: "smooth"
      });
    }
  };

  const scrollRight = () => {
    if (cardsContainerRef.current) {
      cardsContainerRef.current.scrollBy({
        top: 0,
        left: cardsContainerRef.current.offsetWidth + gapWidth,
        behavior: "smooth"
      });
    }
  };

  return (
    <div
      className={cardCarouselStyles.cardCarouselContainer}
      ref={cardCarouselContainerRef}
    >
      {(props.isWrapped && !isTablet) ? (
        <div className={cardCarouselStyles.cardsWrapContainer}>
          {props.cards.slice(0, 8).map((card, index) => (
            <div key={index}>
              {card}
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className={cardCarouselStyles.cardsContainer}
            ref={cardsContainerRef}
            style={{ visibility: isReady ? "visible" : "hidden" }}
          >
            {Array.isArray(props.cards) && 
              props.cards.map((card, index) => {
                return (
                  <div 
                    key={index} 
                    className={`${cardCarouselStyles.cardContainer} ${isCategoryType ? cardCarouselStyles.categoryCardContainer : cardCarouselStyles.productCardContainer}`} 
                    ref={index === 0 ? cardRef : null}
                  >
                    {card}
                  </div>
                );
              })
            }
          </div>

          <div className={cardCarouselStyles.arrowsContainer}>
            <Button
              className={cardCarouselStyles.arrowButton}
              type="secondary"
              disabled={!canScrollLeft}
              leftIcon={<ArrowLeftIcon className={cardCarouselStyles.arrowLeftIcon} />}
              onClick={scrollLeft}
            />

            <Button
              className={cardCarouselStyles.arrowButton}
              type="secondary"
              disabled={!canScrollRight}
              leftIcon={<ArrowRightIcon className={cardCarouselStyles.arrowRightIcon} />}
              onClick={scrollRight}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default CardCarousel;