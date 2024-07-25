import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CheckoutPage.module.css";
// 
import {Elements, ElementsConsumer} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js'
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "sonner";
import CheckoutForm from "./CheckoutForm";

const STRIPE_PUBLIC_KEY ='pk_test_51PHlm505JICd8VkdCphQaa6MSgMfkNF9usoeTp8vWJNApvM40IrJjnW7ii69As9mCrtQpyAPiYHdxIqSVkLJg0RM00vygqrsgV';
// const 
export default function CheckoutPage() {
  // const navigate = useNavigate();
  const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  // const initData= {
  //   fullname: "",
  //   card:{
  //     label: '',
  //     number: null,
  //     cvc: null,
  //     expDate: null
  //   },
  //   savedCard:{
  //     label: 'Master card 123',
  //     number: null,
  //     cvc: null,
  //     expDate: null
  //   },
  // };

  // const [paymentData, setPayementData] = useState(initData);
  // const dispatch = useDispatch();
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setPayementData({
  //     ...paymentData,
  //     [name]: value,
  //   });
  // };
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // dispatch(login(userData));
  //   console.log(paymentData);
  //   setPayementData(initData);
  //   // navigate("/");
  // };
  return (
    <div className={styles.container}>
    <h1 className={styles.form_title}>Paiement</h1>
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  </div>

    // <div className={styles.container}>
    //     <h1 className={styles.form_title}>Paiement</h1>
    //     <form className={styles.form_container} onSubmit={handleSubmit}>
    //     <div className={styles.form_group}>
    //       <label htmlFor="paymentCard">
    //           Choisir une carte<span className="text-danger">*</span>
    //         </label>
    //       <select
    //         className={styles.form_input}
    //         name="paymentCard"
    //         onChange={handleChange}
    //       >
    //         <option value={paymentData.savedCard.label} key=''>{paymentData.savedCard.label}</option>
    //       </select>
    //     </div>
    //       <div className={styles.form_group}>
    //         <label htmlFor="fullname">
    //           Nom complet<span className="text-danger">*</span>
    //         </label>
    //         <input
    //           value={paymentData.fullname}
    //           className={styles.form_input}
    //           type="text"
    //           name="firstname"
    //           placeholder=""
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <Elements stripe={stripePromise}>
    //   <CheckoutForm />
    // </Elements>
    //     </form>
    //   </div>
  )
}


