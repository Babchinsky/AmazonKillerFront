import { ReactElement, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { getCssVariable } from "../utils/getCssVariable";
import { useBreakpoint } from "../utils/useBreakpoint";
import CategoryCard from "./cards/CategoryCard";
import TextButton from "./buttons/TextButton";
import ArrowLeft from "../assets/icons/arrow-left.svg?react";
import ArrowRight from "../assets/icons/arrow-right.svg?react";
import "./CardCarousel.scss";


interface CardCarouselProps {
  cards: ReactElement<typeof CategoryCard>[];
  wrap: boolean;
  link?: string;
}

function CardCarousel(props: CardCarouselProps) {
  const breakpointDesktop = parseInt(getCssVariable("--breakpoint-desktop"), 10);
  const isDesktop = useBreakpoint(breakpointDesktop);
  
  const cardCarouselContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const cardCarouselContainerGap = 16;
  
  const updateCardsPerView = () => {
    if (cardCarouselContainerRef.current && cardRef.current) {
      const containerWidth = cardCarouselContainerRef.current.offsetWidth;
      const cardWidth = cardRef.current.offsetWidth + cardCarouselContainerGap;
      const count = Math.floor(containerWidth / cardWidth);
      setCardsPerView(Math.max(1, count));
    }
  };

  useEffect(() => {
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const showPrevCards = () => {
    setCardIndex((index: number) => {
      if (index === 0) {
        const remainder = props.cards.length % cardsPerView;
        if (remainder === 0) {
          return props.cards.length - cardsPerView;
        }
        
        return props.cards.length - remainder;
      }
  
      return Math.max(index - cardsPerView, 0);
    });
  };

  const showNextCards = () => {
    setCardIndex((index: number) => {
      if (index + cardsPerView >= props.cards.length) {
        return 0;
      }

      return index + cardsPerView;
    });
  };

  const visibleCards = props.cards.slice(cardIndex, cardIndex + cardsPerView);

  return (
    <div className="card-carousel-container" ref={cardCarouselContainerRef}>
      {(props.wrap && !isDesktop) ? (
        <>
          <div className="cards-wrap-container">
            {props.cards.slice(0, 8).map((card, index) => (
              <div key={index}>
                {card}
              </div>
            ))}
          </div>
          
          <div className="see-all-button-container">
            <Link to={props.link || "/"}>
              <TextButton type="secondary" content="See all"></TextButton>            
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="cards-container">
            {visibleCards.map((card: ReactElement<typeof CategoryCard>, index: number) => (
              <div key={index} className="card" ref={index === 0 ? cardRef : null}>
                {card}
              </div>
            ))}
          </div>

          <div className="arrows-container">
            <button onClick={showPrevCards} className="arrow-button">
              <ArrowLeft className="arrow-left-icon" />
            </button>

            <button onClick={showNextCards} className="arrow-button">
              <ArrowRight className="arrow-right-icon" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CardCarousel;