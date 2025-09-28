// src/redux/AdsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";
const BASE_URL = process.env.REACT_APP_BASE_URL;
// Generate thunks for this resource (generic CRUD)
const { fetchAll } = crudFactory("ads");

// 🔹 Custom fetch with pagination
export const fetchAdsWithPagination = createAsyncThunk(
  "ads/fetchWithPagination",
  async ({ page = 1, per_page = 9 } = {}, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const res = await axios.get(`${BASE_URL}/api/ads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Lang: i18n.language,
        },
        params: { page, per_page },
      });
      return res.data; // { data, pagination }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load ads"
      );
    }
  }
);

// Initial state
const initialState = {
  ads: [],
  record: null,
  isLoading: false,
  pagination: null,
  error: null,
  success: null,
};

// Create slice
const AdsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // keep generic CRUD reducers
    addCrudExtraReducers(builder, {
      fetchAll,
      key: "ads",
    });

    // add custom pagination reducer
    builder
      .addCase(fetchAdsWithPagination.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdsWithPagination.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ads = action.payload.data; // ads list
        state.pagination = action.payload.pagination; // backend pagination
      })
      .addCase(fetchAdsWithPagination.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export
export const { clearState } = AdsSlice.actions;
export { fetchAll as fetchAds };
export default AdsSlice.reducer;
