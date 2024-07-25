import axios from "../configs/axios";

export const getPaymentByUser = async (userId) => {
  const { data } = await axios.get(`/payment_intent/get-payment-user/${userId}`);
  return data;
};

export const createPayment = async (paymentData) => {
  const { data } = await axios.post("/payment_intent/create-payment", paymentData);
  return data;
};

