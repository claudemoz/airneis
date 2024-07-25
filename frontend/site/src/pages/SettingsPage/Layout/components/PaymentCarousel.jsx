// src/components/PaymentCarousel.jsx
import React, { useState } from 'react';
import PaymentCard from './PaymentCard';
import styles from './PaymentCarousel.module.css';

const PaymentCarousel = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className={styles.carousel}>
      <button onClick={prevCard} disabled={currentIndex === 0}>
        Previous
      </button>
      <div className={styles.cardContainer}>
        {cards.length > 0 && <PaymentCard card={cards[currentIndex]} />}
      </div>
      <button onClick={nextCard} disabled={currentIndex === cards.length - 1}>
        Next
      </button>
    </div>
  );
};

export default PaymentCarousel;
