import { getPaymentByUser, createPayment } from "@/api.services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchPaymentsByUser = createAsyncThunk(
  "payment_intents/fetchPaymentsByUser",

  async (userId, { rejectWithValue }) => {
    try {
      return await getPaymentByUser(userId);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const registerPayment = createAsyncThunk(
  "payment_intents/registerPayment",

  async (data, { rejectWithValue }) => {
    try {
      return await createPayment(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const paymentIntentSlice = createSlice({
  name: "payments",
  initialState: {
    payments: [],
    isLoading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(registerPayment.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(registerPayment.fulfilled,(state, { payload }) => {
       
      }
    )
    .addCase(registerPayment.rejected, (state, { payload }) => {
      state.isLoading = true;
      state.error = payload?.error;
    })
      .addCase(fetchPaymentsByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPaymentsByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.payments = action.payload;
      })
      .addCase(fetchPaymentsByUser.rejected, (state, action) => {
        state.isLoading = true;
        state.error = action.payload?.errorMessage;
        state.payments = [];
      });
  },
});

export default paymentIntentSlice.reducer;

