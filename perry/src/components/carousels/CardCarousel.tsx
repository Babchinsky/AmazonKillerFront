import { ReactElement, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState<number>(0);

  const isCategoryType = props.cards.length > 0 && props.cards[0].type === CategoryCard;
  const gapClass = isCategoryType ? `${cardCarouselStyles.categoryCardsGap}` : `${cardCarouselStyles.productCardsGap}`;
  const gapWidth = isCategoryType ? (isTablet ? 24 : 16) : 16;
  
  const [cardsPerView, setCardsPerView] = useState<number>(1);
  const [currentCards, setCurrentCards] = useState<ReactElement[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [nextCards, setNextCards] = useState<ReactElement[]>([]);
  const [prevCards, setPrevCards] = useState<ReactElement[]>([]);

  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);

  const [slideDistance, setSlideDistance] = useState(0);

  const updateCardsPerView = () => {
    if (cardCarouselContainerRef.current && carouselContainerRef.current && cardRef.current) {
      const containerRefWidth = cardCarouselContainerRef.current.offsetWidth;
      const cardRefWidth = cardRef.current.offsetWidth;

      const fullCardWidth = cardRefWidth + gapWidth;
      let maxCards = Math.floor((containerRefWidth + gapWidth) / fullCardWidth);

      if (!isTablet) {
        maxCards -= 1;
      }

      setCardsPerView(Math.max(1, maxCards));

      const carouselWidth = maxCards * cardRefWidth + (maxCards - 1) * gapWidth;
      carouselContainerRef.current.style.width = `${carouselWidth}px`;

      setSlideDistance(carouselWidth + gapWidth);
      setCardWidth(cardRefWidth);
    }
  };

  const getCurrentCardsIndexes = (startIndex: number, count: number, total: number) => {
    const indexes: number[] = [];
    for (let i = 0; i < count; i++) {
      indexes.push((startIndex + i) % total);
    }
    return indexes;
  };

  const getPreviousCardsIndexes = (startIndex: number, count: number, total: number) => {
    const indexes: number[] = [];
    for (let i = count - 1; i >= 0; i--) {
      indexes.unshift((startIndex - i + total) % total);
    }
    return indexes;
  };

  const showNextCards = () => {
    if (props.cards.length === 0) {
      return;
    }

    const total = props.cards.length;
    const nextStartIndex = (cardIndex + cardsPerView) % total;
    const nextIndexes = getCurrentCardsIndexes(nextStartIndex, cardsPerView + 1, total);
    setNextCards(nextIndexes.map(i => props.cards[i]));
    setSlideDirection("left");
  };

  const showPrevCards = () => {
    if (props.cards.length === 0) {
      return;
    }

    const total = props.cards.length;
    const prevIndexes = getPreviousCardsIndexes(cardIndex, cardsPerView + 1, total);
    setPrevCards(prevIndexes.map(i => props.cards[i]));
    setSlideDirection("right");
  };

  const onAnimationEnd = () => {
    if (!carouselRef.current) {
      return;
    }

    carouselRef.current.style.transition = "none";
    carouselRef.current.style.transform = "translateX(0%)";

    if (slideDirection === "left" && nextCards.length) {
      setCardIndex(i => (i + cardsPerView) % props.cards.length);
    } 
    else if (slideDirection === "right" && prevCards.length) {
      setCardIndex(i => (i - cardsPerView + props.cards.length) % props.cards.length);
    }

    setSlideDirection(null);
  };

  // useEffect(() => {
  //   updateCardsPerView();
  //   window.addEventListener("resize", updateCardsPerView);
  //   return () => window.removeEventListener("resize", updateCardsPerView);
  // }, []);
  useLayoutEffect(() => {
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  // useEffect(() => {
  //   updateCardsPerView();
  // }, [props.cards]);
  useLayoutEffect(() => {
    updateCardsPerView();
  }, [props.cards]);

  useEffect(() => {
    if (props.cards.length === 0) {
      return;
    }

    const total = props.cards.length;
    const current = getCurrentCardsIndexes(cardIndex, cardsPerView, total);

    const prevStart = (cardIndex - (cardsPerView + 1) + total) % total;
    const prevIndexes = getCurrentCardsIndexes(prevStart, cardsPerView + 1, total);
    setPrevCards(prevIndexes.map(i => props.cards[i]));

    setCurrentCards(current.map(i => props.cards[i]));

    const nextStart = (cardIndex + cardsPerView) % total;
    setNextCards(getCurrentCardsIndexes(nextStart, cardsPerView + 1, total).map(i => props.cards[i]));
  }, [cardIndex, cardsPerView, props.cards]);

  return (
    <div className={cardCarouselStyles.cardCarouselContainer} ref={cardCarouselContainerRef}>
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
          <div className={cardCarouselStyles.cardsContainer}>
            <div 
              className={cardCarouselStyles.carouselContainer} 
              ref={carouselContainerRef}
            >
              <div
                className={`${cardCarouselStyles.carousel} ${gapClass}`}
                ref={carouselRef}
                onTransitionEnd={onAnimationEnd}
                style={{
                  transform: slideDirection
                    ? `translateX(${slideDirection === "left" ? -slideDistance : slideDistance}px)`
                    : "translateX(0px)",
                  transition: slideDirection ? "transform 0.3s ease-out" : "none",
                }}
              >
                <div className={`${cardCarouselStyles.prevCardsContainer} ${gapClass}`}
                  style={{
                    transform: `translateX(-${slideDistance + cardWidth + gapWidth}px)`
                  }}
                >
                  {prevCards.map((card, index) => (
                    <div key={`prev-${index}`} ref={index === 0 ? cardRef : null}>
                      {card}
                    </div>
                  ))}
                </div>
                
                <div className={`${cardCarouselStyles.currentCardsContainer} ${gapClass}`}>
                  {currentCards.map((card, index) => (
                    <div key={`current-${index}`} ref={index === 0 ? cardRef : null}>
                      {card}
                    </div>
                  ))}
                </div>

                <div className={`${cardCarouselStyles.nextCardsContainer} ${gapClass}`}
                  style={{
                    transform: `translateX(${slideDistance}px)`
                  }}
                >
                  {nextCards.map((card, index) => (
                    <div key={`next-${index}`} ref={index === 0 ? cardRef : null}>
                      {card}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={cardCarouselStyles.arrowsContainer}>
            <Button
              className={cardCarouselStyles.arrowButton}
              type="secondary"
              leftIcon={<ArrowLeftIcon className={cardCarouselStyles.arrowLeftIcon} />}
              onClick={showPrevCards}
            />

            <Button
              className={cardCarouselStyles.arrowButton}
              type="secondary"
              leftIcon={<ArrowRightIcon className={cardCarouselStyles.arrowRightIcon} />}
              onClick={showNextCards}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default CardCarousel;