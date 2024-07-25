import { getOrders, removeOrder, removeMultipleOrders, updateOrderService } from "@/api.services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await getOrders();
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);


export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      return await removeOrder(orderId);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      return await updateOrderService(orderId);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const deleteManyOrders = createAsyncThunk(
  "orders/deleteManyOrders",
  async (items, { rejectWithValue }) => {
    try {
      return await removeMultipleOrders(items);
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
    price : 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
        state.orders = [];
      })
      // 
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrder.fulfilled, (state) => {
        state.isLoading = false;
        // const index = state.orders.findIndex(c => c._id === action.payload._id);
        // if (index !== -1) state.orders.splice(index, 1, action.payload);
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.error = action.payload?.errorMessage;
      })
      // 
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.orders.findIndex(o => o._id === action.payload.orderId);
        if (index !== -1) state.orders.splice(index, 1);
        state.message = action.payload?.message;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
      })
      .addCase(deleteManyOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteManyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        const idsList = action.payload;
        state.message = `${idsList.length} order${idsList.length > 1 ? 's' : ''} deleted successfully`;
        state.orders = state.orders.filter(order => !idsList.includes(order._id));
      })
      .addCase(deleteManyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
      });
  },
});

export default orderSlice.reducer;
