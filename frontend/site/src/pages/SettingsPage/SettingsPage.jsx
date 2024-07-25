import React, { useEffect, useState } from 'react';
import SettingsForm from './Layout/components/SettingsForm';
import {Elements, ElementsConsumer} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js'

const STRIPE_PUBLIC_KEY ='pk_test_51PHlm505JICd8VkdCphQaa6MSgMfkNF9usoeTp8vWJNApvM40IrJjnW7ii69As9mCrtQpyAPiYHdxIqSVkLJg0RM00vygqrsgV';
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);


const SettingsPage = () => {
  return (
  <Elements stripe={stripePromise}>
    <SettingsForm />
    </Elements>);
};

export default SettingsPage;
