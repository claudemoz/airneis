import { getProducts, getProduct } from "@/api.services";
// import axios from "@/configs/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ########### Call API ########### //

// export const fetchProductsToCard = createAsyncThunk(
//   //4
//   "products/fetchProductsToCard",
//   async (_, { rejectWithValue }) => {
//     try {
//       return await getProducts();
//     } catch (error) {
//       return rejectWithValue({ errorMessage: error.message });
//     }
//   }
// );
// export const addProductToCard = createAsyncThunk(
//   //4
//   "products/addToCard",
//   async (product, { rejectWithValue }) => {
//     try {
//       return await addToCard(product);
//     } catch (error) {
//       return rejectWithValue({ errorMessage: error.message });
//     }
//   }
// );
// export const removeToCard = createAsyncThunk(
//   //4
//   "products/addToCard",
//   async (product, { rejectWithValue }) => {
//     try {
//       return await removeToCard(product);
//     } catch (error) {
//       return rejectWithValue({ errorMessage: error.message });
//     }
//   }
// );

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    totalProductToCart: 0,
    totalPriceToCart: 0,
    isLoading: false,
    error: "",
  },
  reducers: {
    addToCart: (state, {payload}) => {
      const productInCart = state.cart.find((product) => product._id === payload._id);
      if(productInCart){
        productInCart.quantity++
      }else{
        // state.cart = [];
        state.cart.push({ ...payload, quantity: 1 });
      }
      state.totalPriceToCart = state.cart.reduce((acc, product) => acc + product.price * product.quantity, 0).toFixed(2);
      state.totalProductToCart = state.cart.length;
    },
    removeToCart: (state, {payload}) => {
      const index = state.cart.findIndex((product) => product._id === payload);
      if (index !== -1 && state.cart[index].quantity > 1) {
        state.cart[index].quantity--;
      } else {
        state.cart.splice(index, 1);
      }
      state.totalPriceToCart = state.cart.reduce((acc, product) => acc + product.price * product.quantity, 0).toFixed(2);
      state.totalProductToCart = state.cart.length;
    },
    clearCart : (state) => {
      state.cart = [];
      state.totalProductToCart = 0;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchProducts.pending, (state) => {
  //       state.isLoading = true;
  //     })
  //     .addCase(fetchProducts.fulfilled, (state, action) => {
  //       state.isLoading = false;
  //       state.error = "";
  //       state.products = action.payload;
  //     })
  //     .addCase(fetchProducts.rejected, (state, action) => {
  //       state.isLoading = true;
  //       state.error = action.payload?.errorMessage;
  //       state.products = [];
  //     })
  //     // 
  //     .addCase(fetchProduct.pending, (state) => {
  //       state.isLoading = true;
  //     })
  //     .addCase(fetchProduct.fulfilled, (state, action) => {
  //       state.isLoading = false;
  //       state.error = "";
  //       console.log("action.payload ", action.payload);
  //       state.product = action.payload;
  //     })
  //     .addCase(fetchProduct.rejected, (state, action) => {
  //       state.isLoading = true;
  //       state.error = action.payload?.errorMessage;
  //       state.product = null;
  //     });
  // },
});

export const { addToCart, removeToCart, clearCart, TotalPriceToCart, TotalProductToCart} = cartSlice.actions;
export default cartSlice.reducer;
