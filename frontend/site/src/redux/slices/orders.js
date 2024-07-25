import {
  getOrdersByUserService,
  createPaymentIntentService,
} from "@/api.services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const createPaymentIntent = createAsyncThunk(
  "orders/createPaymentIntent",
  async (data, { rejectWithValue }) => {
    try {
      return await createPaymentIntentService(data);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);
export const fetchOrdersByUser = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersByUserService();
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    isLoading: false,
    error: "",
    message: "",
    price: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
        state.orders = [];
      })
      //
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPaymentIntent.fulfilled, (state) => {
        state.isLoading = false;
        state.error = "";
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
      });
  },
});

export default orderSlice.reducer;
