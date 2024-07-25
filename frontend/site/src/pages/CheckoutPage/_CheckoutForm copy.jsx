/* eslint-disable react/no-unescaped-entities */
import {useStripe, useElements, CardExpiryElement, CardNumberElement, CardCvcElement, CardElement} from '@stripe/react-stripe-js';
import styles from "./CheckoutPage.module.css";
import { useState } from 'react';
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const initData= {
    fullname: "",
    card:{
      label: '',
      number: null,
      cvc: null,
      expDate: null
    },
    savedCard:{
      label: 'Master card 123',
      number: '4242424242424242',
      cvc: null,
      expDate: null
    },
  };

  const [paymentData, setPayementData] = useState(initData);
  // const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayementData({
      ...paymentData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { clientSecret } = await fetch('http://localhost:9000/api/v1/order/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ email }),
    }).then((res) => res.json());

    console.log("clientSecret ", clientSecret);
    // const cardElement = elements.getElement(CardElement);
    const appearance = {
      theme: 'stripe',
    };
    const elements = stripe.elements({ appearance, clientSecret });

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:4242/checkout.html",
      },
    });

    // console.log("paymentIntent ", paymentIntent);

    // const paymentMethods = await stripe.paymentMethods.list({
    //   customer: customerId,
    //   type: 'card',
    // });
    
    // // Affichage des détails des cartes existantes sur votre interface utilisateur
    // paymentMethods.data.forEach(paymentMethod => {
    //   console.log('Carte existante:', paymentMethod.card);
    //   // Affichez les détails de la carte pour que le client puisse sélectionner celle qu'il souhaite utiliser
    // });

    if (error) {
      console.log("error.message ", error.message);
    } else if (paymentIntent.status === 'succeeded') {
      console.log("paymentIntent.status ", paymentIntent.status);
    }
  };
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   // dispatch(login(userData));
  //   console.log(paymentData);
  //   setPayementData(initData);
  //   if (!stripe || !elements) {
  //     return;
  //   }

  //   const cardNumberElement = elements.getElement(CardNumberElement);
  //   const cardExpiryElement = elements.getElement(CardExpiryElement);
  //   const cardCvcElement = elements.getElement(CardCvcElement);

  //   const { error, paymentMethod } = await stripe.createPaymentMethod({
  //     type: 'card',
  //     card: {
  //       number: cardNumberElement,
  //       expiry: cardExpiryElement,
  //       cvc: cardCvcElement,
  //     },
  //   });

  //   if (!error) {
  //     console.log("paymentMethod", paymentMethod);
  //   } else {
  //     console.log("error paymentMethod", error);
  //   }
  // };

  return (
    <form className={styles.form_container} onSubmit={handleSubmit}>
      <div className={styles.form_group}>
        <label htmlFor="paymentCard">
          Choisir une carte<span className="text-danger">*</span>
        </label>
        <select
          className={styles.form_input}
          name="paymentCard"
          onChange={handleChange}
        >
          <option value={paymentData.savedCard.label} key=''>
            {paymentData.savedCard.label}
          </option>
        </select>
      </div>
      {/* <div className={styles.form_group}>
        <label htmlFor="cardNumber">
          Numéro de carte<span className="text-danger">*</span>
        </label>
        <CardNumberElement  
          className={styles.cardNumber} 
          onChange={handleChange}
          value={paymentData.savedCard.number}
        />
      </div> */}
      <div className={styles.form_group}>
        <label htmlFor="fullname">
          Nom complet<span className="text-danger">*</span>
        </label>
        <input
          value={paymentData.fullname}
          className={styles.form_input}
          type="text"
          name="fullname"
          placeholder=""
          onChange={handleChange}
        />
      </div>
      {/* <div className='d-flex justify-content-between align-items-center mt-5'>
      <div className="mt-5">
        <label htmlFor="cardExpiry">
          Date d'expiration<span className="text-danger">*</span>
        </label>
        <CardExpiryElement className={`${styles.cardExpiry} flex-1`} />
      </div>
      <div className='mt-5'>
        <label htmlFor="cardCvc">
          CVC<span className="text-danger">*</span>
        </label>
        <CardCvcElement className={styles.cardCvc} />
      </div>
      </div> */}
      <CardElement value="4000 0000 0000 9995" className="my-10" options={{hidePostalCode: true}}/>
      <button type="submit" className={styles.button}>Payer</button>
    </form>
  )
};

export default CheckoutForm;