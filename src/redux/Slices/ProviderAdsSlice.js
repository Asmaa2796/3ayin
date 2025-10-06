// src/redux/ProviderAdsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const baseURL = process.env.REACT_APP_BASE_URL;
// Async thunk: fetch provider ads with status
export const getProviderAds = createAsyncThunk(
  "providerAds/getProviderAds",
  async ({ status,page = 1 }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const response = await axios.get(
        `${baseURL}/api/provider/ads?status=${status}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Lang: i18n.language,
          },
        }
      );
      return {
        ads: response.data?.data || [],
        pagination: response.data?.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch provider ads"
      );
    }
  }
);

const initialState = {
  providerAds: [],
  pagination: null,
  isLoading: false,
  error: null,
  success: null,
};

const ProviderAdsSlice = createSlice({
  name: "providerAds",
  initialState,
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
      state.providerAds = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProviderAds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProviderAds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providerAds = action.payload.ads;
        state.pagination = action.payload.pagination;
      })
      .addCase(getProviderAds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = ProviderAdsSlice.actions;
export default ProviderAdsSlice.reducer;
