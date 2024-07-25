import { addContact } from "@/api.services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const sendContact = createAsyncThunk(
  "contacts/sendContact",
  async (data, { rejectWithValue }) => {
    try {
      return await addContact(data);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    isLoading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendContact.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
      })
      .addCase(sendContact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
      });
  },
});

// export const {  } = contactSlice.actions;
export default contactSlice.reducer;
