import { createUser, getCustomers, getUsersAdmin, editUser, removeUser, removeMultipleUsers } from "@/api.services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Fetch all users
export const fetchCustomers = createAsyncThunk(
  "users/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      return await getCustomers();
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);
export const fetchAdminUsers = createAsyncThunk(
  "users/fetchAdminUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await getUsersAdmin();
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (user, { rejectWithValue }) => {
    try {
      return await createUser(user);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (user, { rejectWithValue }) => {
    try {
      return await editUser(user);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      return await removeUser(userId);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

// Delete multiple users
export const deleteManyUsers = createAsyncThunk(
  "users/deleteManyUsers",
  async (userIds, { rejectWithValue }) => {
    try {
      return await removeMultipleUsers(userIds);
    } catch (error) {
      return rejectWithValue({ errorMessage: error.message });
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    isLoading: false,
    error: "",
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.users = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
        state.users = [];
      })
      // 
      .addCase(fetchAdminUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage;
        state.users = [];
      })
      
    // ######## Add User ########
    builder.addCase(addUser.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(addUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users.unshift(action.payload);
    });

    builder.addCase(addUser.rejected, (state, action) => {
      state.error = action.payload?.errorMessage;
    });

    // ######## Update User ########
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
     
        const index = state.users.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.users.splice(index, 1, action.payload);
    });

    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.errorMessage;
    });

    // ######## Delete User ########
    builder.addCase(deleteUser.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.users.findIndex(c => c._id === action.payload._id);
      if (index !== -1) state.users.splice(index, 1);
      state.message = action.payload?.message
    });

    builder.addCase(deleteUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.errorMessage;
    });

    // ######## Delete Many Users ########
    builder.addCase(deleteManyUsers.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteManyUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      const idsList = action?.payload;
      const message = `${idsList.length} User${idsList.length > 1 ? 's' : ''} supprimé${idsList.length > 1 ? 's' : ''} avec succes`;
      state.message = message;
      state.users = state.users.filter(user => !idsList.includes(user._id));
    })

    builder.addCase(deleteManyUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.errorMessage;
    });
  },
});

export default userSlice.reducer;
