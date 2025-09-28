import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Async Thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/register`, payload,{
        headers:{
          Lang:i18n.language
        }
      });
      
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "An unknown error occurred";
      const validationErrors = error.response?.data?.errors || null;
      return rejectWithValue({ message, validationErrors });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/login`, userData,{
        headers:{
          Lang:i18n.language
        }
      });
      return response.data;
    } catch (error) {
      const data = error.response?.data;
      return rejectWithValue({
        message: data?.message || "Login failed!",
        code: data?.code || null,
      });
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/verifyEmail`, userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message;
      return rejectWithValue({ message });
    }
  }
);
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/resendOtp`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const resendPasswordOtp = createAsyncThunk(
  "auth/resendPasswordOtp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/resendOtp`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/password/reset`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/password/otp`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const verifyPasswordOtp = createAsyncThunk(
  "auth/verifyPasswordOtp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/password/verify-otp`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const storedNewUser = sessionStorage.getItem("new_user_3ayin");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    new_user: storedNewUser ? JSON.parse(storedNewUser) : null,
    user: null,
    isLoading: false,
    isLoadingOtp: false,
    error: null,
    errorCode: null,
    success: null,
    successResendPasswordOtp: null,
    successResendOtp: null,
    validationErrors: {},
  },
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
      state.new_user = null; // also reset this
      sessionStorage.removeItem("new_user_3ayin");
    },
    logout: (state) => {
      state.user = null;
      state.new_user = null;
      sessionStorage.removeItem("user3ayin");
      sessionStorage.removeItem("new_user_3ayin");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        sessionStorage.setItem("user3ayin", JSON.stringify(action.payload.data));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
        state.errorCode = action.payload?.code;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.new_user = action.payload.data;
        sessionStorage.setItem(
          "new_user_3ayin",
          JSON.stringify(action.payload.data)
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
        state.validationErrors = action.payload.validationErrors || {};
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // resend otp
      .addCase(resendOtp.pending, (state) => {
        state.isLoadingOtp = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.isLoadingOtp = false;
        state.successResendOtp = action.payload.message;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isLoadingOtp = false;
        state.error = action.payload.message;
      })
      // resend password otp
      .addCase(resendPasswordOtp.pending, (state) => {
        state.isLoadingOtp = true;
        state.error = null;
      })
      .addCase(resendPasswordOtp.fulfilled, (state, action) => {
        state.isLoadingOtp = false;
        state.successResendPasswordOtp = action.payload.message;
      })
      .addCase(resendPasswordOtp.rejected, (state, action) => {
        state.isLoadingOtp = false;
        state.error = action.payload.message;
      })
      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // change password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Verify Password Otp
      .addCase(verifyPasswordOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPasswordOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
      })
      .addCase(verifyPasswordOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearState, logout } = authSlice.actions;
export default authSlice.reducer;
