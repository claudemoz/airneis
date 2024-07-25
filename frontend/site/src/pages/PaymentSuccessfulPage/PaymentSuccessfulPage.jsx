/* eslint-disable react/no-unescaped-entities */
// import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './PaymentSuccessfulPage.module.css';
import generateInvoice from '@/services/invoice/generateInvoice'
import { NavLink, useLocation } from 'react-router-dom';

export default function PaymentSuccessfulPage() {
  const location = useLocation();
  const order = location?.state?.order;
  const { user } = useSelector((state) => state.auth);

  const generatePDF = async () => {
    return await generateInvoice(order, user)
  };

  return (
    <div className={styles.payment_successful_container}>
      <h1 className={styles.payment_successful_title}>Paiement Effectué</h1>
      {user && (
        <div className={styles.payment_successful_message}>
          <p>
            Merci <span>{user.firstname}</span> pour votre commande.
            <br />
            Votre numéro de suivi pour cette commande est <span>{order.reference}</span>.
            <br />
            Retrouvez toutes les étape de votre commande sur la page <NavLink to="/orders">Mes commandes</NavLink>.
            <br />
            Vous trouverez en pièce jointe votre facture ci-joint et elle vous sera envoyée en pièce jointe à l'adresse suivante <span>{user.email}</span>.
            <br />
            Si vous souhaitez faire une réclamation, vous trouverez nos coordonnées sur la page <strong>Contact</strong>.
            <br />
            A bientôt !
          </p>
          <button onClick={generatePDF} className={styles.download_button}>
            Télécharger la facture
          </button>
        </div>
      )}
    </div>
  );
}
