import {
  getContacts,
  removeContact,
  removeMultipleContacts,
  getAllContactsbyId,
} from "@/api.services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Fetch all contacts
export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      return await getContacts();
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

// Fetch a specific contact by ID
export const fetchAllContacts = createAsyncThunk(
  "contacts/fetchAllContacts",
  async (contactId, { rejectWithValue }) => {
    // Adjusted to accept contactId
    try {
      return await getAllContactsbyId(contactId); // Pass contactId to the function
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

// Delete a contact
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (contactId, { rejectWithValue }) => {
    try {
      return await removeContact(contactId);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message }); // Corrected errorMessage
    }
  }
);

// Delete multiple contacts
export const deleteManyContacts = createAsyncThunk(
  "contacts/deleteManyContacts",
  async (item, { rejectWithValue }) => {
    try {
      return await removeMultipleContacts(item);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message }); // Corrected errorMessage
    }
  }
);

const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    isLoading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
        state.contacts = [];
      })
      .addCase(deleteContact.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.contacts.findIndex(
          (c) => c._id === action.payload.contactId // Corrected contactId
        );
        if (index !== -1) state.contacts.splice(index, 1);
        state.message = action.payload?.message;
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
      })
      .addCase(deleteManyContacts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteManyContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        const idsList = action?.payload;
        const message = `${idsList.length} Contact${
          idsList.length > 1 ? "s" : ""
        } supprimé${idsList.length > 1 ? "s" : ""} avec succès`;
        state.message = message;
        state.contacts = state.contacts.filter(
          (contact) => !idsList.includes(contact._id)
        );
      })
      .addCase(deleteManyContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
      });
  },
});

export default contactSlice.reducer;
