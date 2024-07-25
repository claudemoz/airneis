import { getMaterials } from "@/api.services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchMaterials = createAsyncThunk(
  "materials/fetchMaterials",

  async (_, { rejectWithValue }) => {
    try {
      return await getMaterials();
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

const materialSlice = createSlice({
  name: "materials",
  initialState: {
    materials: [],
    isLoading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.materials = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.isLoading = true;
        state.error = action.payload?.errorMessage;
        state.materials = [];
      });
  },
});

// export const {  } = userSlice.actions;
export default materialSlice.reducer;
