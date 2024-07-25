import { getProducts, getProduct, getProductsByCategoryId } from "@/api.services";
// import axios from "@/configs/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ########### Call API ########### //

// export const fetchAllProducts = createAsyncThunk(
//   "products/fetchAllProducts",

//   async (_, { rejectWithValue }) => {
//     try {
//       return await getAllProducts();
//     } catch (error) {
//       return rejectWithValue({ errorMessage: error.message });
//     }
//   }
// );

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters, { rejectWithValue }) => {
    try {
      return await getProducts(filters);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const fetchProductByCategory = createAsyncThunk(
  "products/fetchProductByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      return await getProductsByCategoryId(categoryId);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (productId, { rejectWithValue }) => {
    try {
      return await getProduct(productId);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    productsListByCategory: [],
    product: {},
    isLoading: false,
    error: "",
  },
  reducers: {
    // getProductByCategory: (state, action) => {
    //   state.productsListByCategory = state.products.filter(p => p.categories.some(c => c._id === action.payload));
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.products = action.payload.map(product => ({...product, price: product.price % 1 !== 0 ? product.price.toFixed(2) : product.price}));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = true;
        state.error = action.payload?.errorMessage;
        state.products = [];
      })
      // 
      .addCase(fetchProductByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.products = action.payload?.map(product => ({...product, price: product.price % 1 !== 0 ? product.price.toFixed(2) : product.price}));
      })
      .addCase(fetchProductByCategory.rejected, (state, action) => {
        state.isLoading = true;
        state.error = action.payload?.errorMessage;
        state.products = [];
      })
      // 
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        console.log("action.payload ", action.payload);
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = true;
        state.error = action.payload?.errorMessage;
        state.product = null;
      });
  },
});

// export const { getProductByCategory } = productSlice.actions;
export default productSlice.reducer;
