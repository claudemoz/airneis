import { getCategories, createCategory, editCategory, removeCategory, removeMultipleCategories } from "@/api.services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",

  async (_, { rejectWithValue }) => {
    try {
      return await getCategories();
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);
export const addCategory = createAsyncThunk(
  "categories/addCategory",

  async (product, { rejectWithValue }) => {
    try {
      return await createCategory(product);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",

  async (item, { rejectWithValue }) => {
    try {
      return await editCategory(item);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",

  async (categoryId, { rejectWithValue }) => {
    try {
      return await removeCategory(categoryId);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);
export const deleteManyCategories = createAsyncThunk(
  "categories/deleteManyCategories",

  async (item, { rejectWithValue }) => {
    try {
      return await removeMultipleCategories(item);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);


const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    isLoading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
        state.categories = [];
      })
      // 
      //## region Ajout categorie
      .addCase(addCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.unshift(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload?.errorMessage;
      })
      //## endregion ajout categorie

      //## region mise à jour  categorie
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.categories.splice(index, 1, action.payload);
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload?.errorMessage;
      })
      //## endregion mise à jour categorie

      //## region suppression categorie
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex(c => c._id === action.payload.categoryId);
        if (index !== -1) state.categories.splice(index, 1);
        state.message = action.payload?.message
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.errorMessage;
      })
    //## region suppression categorie

    //## region suppression de plusieurs categories
    .addCase(deleteManyCategories.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(deleteManyCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      const idsList = action?.payload;
      const message = `${idsList.length} Categorie${idsList.length > 1 ? 's' : ''} supprimé${idsList.length > 1 ? 's' : ''} avec succes`;
      state.message = message;
      state.categories = state.categories.filter(category => !idsList.includes(category._id));
    })
    .addCase(deleteManyCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.errorMessage;
    });
    //## region suppression categorie
  },
});

// export const {  } = userSlice.actions;
export default categorySlice.reducer;
