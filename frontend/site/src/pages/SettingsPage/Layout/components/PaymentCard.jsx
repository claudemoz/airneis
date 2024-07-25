// src/components/PaymentCard.jsx
import React from 'react';
import styles from './PaymentCard.module.css';

const PaymentCard = ({ card }) => {

  const formatExpirationDate = (expiration_date) => {
    if (!expiration_date) return '';

    const dateObj = new Date(expiration_date);
    const month = dateObj.getMonth() + 1; 
    const year = dateObj.getFullYear().toString().slice(-2); 

    return `${month}/${year}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardDetails}>
        <h3 className={styles.cardName}>{card.entire_name}</h3>
        <p className={styles.cardNumber}>**** **** **** {card.last4}</p>
        <div className={styles.cardBottom}>
          <p className={styles.expirationDate}>Exp: {formatExpirationDate(card.expiration_date)}</p>
          <p className={styles.cvc}>CVC: ***</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
