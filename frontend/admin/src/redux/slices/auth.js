/* eslint-disable react-hooks/rules-of-hooks */
import { loginService, logoutService, getCurrentUserService} from "@/api.services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// ###region Call API
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",

  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUserService();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//verifier la fonction et continuer les etape de case
export const updateUser = createAsyncThunk(
  "auth/update-user",
  async (userData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth.user._id; 
      return await updateUserService(userId, userData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      return await updatePasswordService(passwordData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const register = createAsyncThunk(
  "auth/register",

  async (data, { rejectWithValue }) => {
    try {
      return await registerService(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const login = createAsyncThunk(
  "auth/login",

  async (data, { rejectWithValue }) => {
    try {
      return await loginService(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",

  async (_, { rejectWithValue }) => {
    try {
      return await logoutService();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",

  async (data, { rejectWithValue }) => {
    try {
      return await verifyEmailService(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const reverifyEmail = createAsyncThunk(
  "auth/reverifyEmail",

  async (data, { rejectWithValue }) => {
    try {
      return await reverifyEmailService(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const generateForgetPasswordlink = createAsyncThunk(
  "auth/generateForgetPasswordlink",

  async (data, { rejectWithValue }) => {
    try {
      return await generateForgetPasswordlinkService(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPasswordService",

  async (data, { rejectWithValue }) => {
    try {
      return await resetPasswordService(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "authentification",
  initialState: {
    user: null, 
    isAuthenticated: false,
    token: null,
    isLoading: false,
    error: "",
  },
  reducers: {
    forceLogout:  (state) => {
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ###region connexion de l'utilisateur
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled,(state, { payload }) => {
          // if (payload) {
          //  return payload;
          // }
        }
      )
      .addCase(register.rejected, (state, { payload }) => {
        state.isLoading = true;
        state.error = payload?.error;
      })
      // ###endregion inscription de l'utilisateur

      // ###region check email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyEmail.fulfilled,(state) => {
          state.error = null;
        }
      )
      .addCase(verifyEmail.rejected, (state, { payload }) => {
        state.isLoading = true;
        state.error = payload?.error;
      })
      // ###endregion inscription de l'utilisateur

      // ###region connexion de l'utilisateur
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled,(state, { payload: {token, profile } }) => {
          const decodedToken = token ? jwtDecode(token) : null;
          state.isLoading = false;
          state.error = null
          state.user = profile;
          state.token = token;
          // on vérifie que le user existe et que la date d'expiration du token est supérieur à la date du jour
          state.isAuthenticated = profile && Math.floor(Date.now() / 1000) < decodedToken?.exp;
          localStorage.setItem("token", token);
        }
      )
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoading = true;
        state.error = payload.error;
        // state.error = null;
      })
      // ###endregion connexion de l'utilisateur

      // ###region deconnexion de l'utilisateur
      .addCase(logout.pending,(state, { payload}) => {
          if (payload?.error) {
            state.error = payload?.error;
          }
          if(localStorage.getItem("token")){
            localStorage.removeItem("token");
          }
          state.isAuthenticated = false;
        }
      )
      .addCase(logout.fulfilled,(state, { payload}) => {
          state.user = null;
          if (payload?.error) {
            state.error = payload?.error;
          }
          // console.log("payload?.isLogout ", payload?.isLogout);
          if(payload?.isLogout && localStorage.getItem("token")){
            state.isAuthenticated = false;
            localStorage.removeItem("token");
          }
        }
      )
      .addCase(logout.rejected, (state, { payload }) => {
        state.isLoading = true;
        state.error = payload?.error;
      })
      // ###endregion dconnexion de l'utilisateur

      // ###region récupération de l'utilisateur connecté
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        if (payload?.error) {
          state.error = payload?.error;
        }
        const decodedToken = localStorage.getItem("token") ? jwtDecode(localStorage.getItem("token")) : null;
        state.isLoading = false;
        state.user = payload?.profile;
        state.isAuthenticated = payload?.profile && Math.floor(Date.now() / 1000) < decodedToken?.exp;// on vérifie que le user existe et que la date d'expiration du token est supérieur à la date du jour
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        state.isLoading = true;
        state.error = payload?.error;
      })
      // ###endregion récupération de l'utilisateur connecté

      // ###gerer le forgetpassword avec le link:generateForgetPasswordlink
      .addCase(generateForgetPasswordlink.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateForgetPasswordlink.fulfilled,(state) => {
          state.error = null;
        }
      )
      .addCase(generateForgetPasswordlink.rejected, (state, { payload }) => {
        state.isLoading = true;
        state.error = payload?.error;
      })
      // ###gerer le forgetpassword avec le link:generateForgetPasswordlink

      
      // ###gerer le resetPassword 
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled,(state) => {
          state.error = null;
        }
      )
      .addCase(resetPassword.rejected, (state, { payload }) => {
        state.isLoading = true;
        state.error = payload?.error;
      })
      // ###gerer le resetPassword
      //### update-user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.profile;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload?.error;
      })
      //###update-user

      //### Update password
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePassword.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Optionnel: mettre à jour l'état utilisateur si nécessaire
        state.message = payload.message;
      })
      .addCase(updatePassword.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload?.msg 
      });
      //###Update password
  },
});

export const { forceLogout } = authSlice.actions;
export default authSlice.reducer;
