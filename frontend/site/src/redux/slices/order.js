// Dans votre fichier redux/slices/order.js

import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderId: null,
    product: [], 
    addressDelivery: '',
    cityDelivery: '',
    totalPrice: 0,
    email : ''
  },
  reducers: {
    setOrderId(state, action) {
      state.orderId = action.payload;
    },
    setProduct(state, action) {
      state.product = action.payload;
    },
    setAdressDelivery(state, action) {
      state.addressDelivery = action.payload;
    },
    setCityDelivery(state, action) {
      state.cityDelivery = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setTotalPrice(state, action) {
      state.totalPrice = action.payload;
    },
  },
});

export const { setOrderId, setProduct, setAdressDelivery, setCityDelivery, setTotalPrice } = orderSlice.actions;
export default orderSlice.reducer;
