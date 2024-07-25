import React, { useEffect, useState } from "react";
import styles from "../../ProfilePage.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  registerPayment,
  fetchPaymentsByUser,
} from "@/redux/slices/payment_intents";
import { FaCreditCard } from "react-icons/fa";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import PaymentCarousel from "../components/PaymentCarousel";
import { toast } from "sonner";

const SettingsForm = () => {
  const [cards, setCards] = useState([]);
  const [email, setEmail] = useState("");
  const { user } = useSelector((state) => state.auth);
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const userId = user._id;
      dispatch(fetchPaymentsByUser(userId))
        .then((response) => {
          if (fetchPaymentsByUser.fulfilled.match(response)) {
            setCards(response.payload);
          }
        })
        .catch((error) =>
          console.error("Error fetching payment methods:", error)
        );
    }
  }, [dispatch, user]);

  const [formData, setFormData] = useState({
    entire_name: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe has not loaded yet");
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        name: formData.entire_name,
      },
    });

    if (error) {
      console.error("Error creating payment method:", error);
      return;
    }

    const paymentDataBdd = {
      paymentMethodId: paymentMethod.id,
      entire_name: formData.entire_name,
      userId: user._id,
    };

    const paymentData = {
      paymentMethodId: paymentMethod.id,
      last4: paymentMethod.card.last4,
      brand: paymentMethod.card.brand,
    };

    console.log("paymentData:", paymentData);
    console.log(
      "Stringified body:",
      JSON.stringify({ email: user.email, paymentData })
    );

    try {
      const registerResponse = await dispatch(registerPayment(paymentDataBdd));

      if (registerPayment.fulfilled.match(registerResponse)) {
        const response = await fetch(
          "http://localhost:9000/api/v1/payment_intent/add-method-payment-to-user",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, paymentData }),
          }
        );

        const result = await response.json();
        console.log("idStripe:", result.customer.id);

        toast.success("Paiement bien ajouté", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          window.location.reload();
        }, 3500);
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <FaCreditCard />
          <h2>Moyens de Paiment</h2>
        </div>
        {cards.length > 0 ? (
          <PaymentCarousel cards={cards} />
        ) : (
          <p>Aucun moyen de paiement enregistré</p>
        )}
      </div>
      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="entire_name">Nom Complet</label>
          <input
            type="text"
            id="entire_name"
            name="entire_name"
            placeholder="Entrez votre nom complet"
            value={formData.entire_name}
            onChange={handleInputChange}
            required
          />
          <CardElement options={{ hidePostalCode: true }} /> {/* Ajouté */}
          <div className={styles.buttonContainerRight}>
            <button type="submit">Ajouter une nouvelle carte</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
