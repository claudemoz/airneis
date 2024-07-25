/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import {
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import styles from "./CheckoutPage.module.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { checkout } from '@/api.services';
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux/slices/cart";
import { v4 as uuidv4 } from "uuid";
import { createPaymentIntent } from "@/redux/slices/orders";
// import generateInvoice from "@/services/invoice/generateInvoice";

const CheckoutForm = () => {
  const initData = {
    fullname: "",
    card: {
      label: "",
      number: null,
      cvc: null,
      expDate: null,
    },
    savedCard: {
      label: "Master card 123",
      number: "4242424242424242",
      cvc: null,
      expDate: null,
    },
  };
  const { user } = useSelector((state) => state.auth);
  const { totalPriceToCart, cart } = useSelector((state) => state.cart);
  const [paymentData, setPayementData] = useState(initData);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const current_path = location.pathname;
  const orderData = location?.state?.orderData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayementData({
      ...paymentData,
      [name]: value,
    });
  };
  const generateUUID = () =>
    `p=${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}`;

  const order = {
    products: cart?.map((p) => ({ productId: p._id, quantity: p.quantity })),
    totalPrice: totalPriceToCart,
    delivery: {
      firstname: orderData?.firstname,
      lastname: orderData?.lastname,
      address: orderData?.address1,
      city: orderData?.city,
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      dispatch(createPaymentIntent(order)).then(async ({ payload }) => {
        if (payload?.clientSecret && payload?.order._id) {
          const clientSecret = payload.clientSecret;
          const order = payload.order;
          const cardElement = elements.getElement(CardElement);
          const { error, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: {
                card: cardElement,
              },
              return_url: "http://localhost:3000/payment-successful",
            }
          );

          if (paymentIntent.status === "succeeded") {
            navigate("/payment-successful", {state:{order:order}});
            setTimeout(() => {
              dispatch(clearCart());
            }, 1000);
          }

          if (error) {
            console.error("Payment error:", error.message);
            return;
          }
        } else {
          setMessage("An error occurred. Please try again.");
        }
      });
    }
  };
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!paymentData.fullname.trim()) {
      newErrors.fullname = "Ce champ est obligatoire";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    // console.log("orderData?.from_path ", orderData?.from_path);
    if (
      current_path === "/checkout" &&
      orderData?.from_path !== "/order-payment-detail"
    ) {
      navigate(`/order-payment-detail?${generateUUID()}`);
    }
  }, [current_path, orderData?.from_path]);

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
          <option value={paymentData.savedCard.label} key="">
            {paymentData.savedCard.label}
          </option>
        </select>
      </div>
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
        {errors.fullname && (
          <span className="text-danger mx-5 text-error">{errors.fullname}</span>
        )}
      </div>

      <CardElement
        value="4000 0000 0000 9995"
        className="my-10"
        options={{ hidePostalCode: true }}
      />
      <button type="submit" className={`${styles.button} cursor-pointer`}>
        Payer
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;
