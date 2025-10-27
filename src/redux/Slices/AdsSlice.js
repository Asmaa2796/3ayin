// src/redux/AdsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const { fetchAll } = crudFactory("ads");

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

      if (res.data.code === 200) {
        return {
          data: res.data.data,
          pagination: res.data.pagination,
        };
      }
      return rejectWithValue(res.data.message || "Failed to load ads");
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load ads");
    }
  }
);

export const filterAds = createAsyncThunk(
  "ads/filterAds",
  async (filters, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const res = await axios.post(`${BASE_URL}/api/ad/filter`, filters, {
        headers: {
          Authorization: `Bearer ${token}`,
          Lang: i18n.language,
        },
      });

      if (res.data.code === 200) {
        return {
          data: res.data.data,
          pagination: res.data.pagination,
        };
      }

      return rejectWithValue(res.data.message || "Failed to filter ads");
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Initial state
const initialState = {
  ads: [],
  record: null,
  isLoading: false,
  loading: false,
  pagination: null,
  error: null,
  success: null,
};

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
    addCrudExtraReducers(builder, { fetchAll, key: "ads" });

    builder
      .addCase(fetchAdsWithPagination.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdsWithPagination.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ads = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdsWithPagination.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(filterAds.pending, (state) => {
        state.loading = true;
      })
      .addCase(filterAds.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(filterAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = AdsSlice.actions;
export { fetchAll as fetchAds };
export default AdsSlice.reducer;
