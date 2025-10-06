// src/redux/PublishAdSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Async thunk to create ad
export const storeAd = createAsyncThunk(
  "ad/storeAd",
  async (formData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const res = await axios.post(`${BASE_URL}/api/ad/store`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Lang: i18n.language,
        },
      });
      // return the full response so you have both message + data
      return res.data; // { code, message, data }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
const PublishAdSlice = createSlice({
  name: "ad",
  initialState: {
    ad: [],
    record: null,
    isLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
      state.record = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(storeAd.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(storeAd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.success = action.payload.message; // success on fulfilled
        state.record = action.payload.data;
      })
      .addCase(storeAd.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false; // explicitly false on failure
        state.error =
          action.payload?.message || action.payload || "Failed to create ad";
      });
  },
});

export const { clearState } = PublishAdSlice.actions;
export default PublishAdSlice.reducer;
