// src/redux/SubscribePlanSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Async thunk for submitting the subscribe form
export const subscribePlan = createAsyncThunk(
  "subscribe/submit",
  async (formData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const response = await axios.post(`${BASE_URL}/api/buy_plan`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Lang: i18n.language,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to submit subscribe plan"
      );
    }
  }
);

// Initial state
const initialState = {
  isLoading: false,
  success: null,
  error: null,
};

// Slice
const SubscribePlanSlice = createSlice({
  name: "subscribe",
  initialState,
  reducers: {
    clearState: (state) => {
      state.isLoading = false;
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribePlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(subscribePlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(subscribePlan.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload || action.error?.message || "Something went wrong";
      });
  },
});

// Exports
export const { clearState } = SubscribePlanSlice.actions;
export default SubscribePlanSlice.reducer;
