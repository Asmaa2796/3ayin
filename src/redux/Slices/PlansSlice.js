// src/redux/PlansSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";
const BASE_URL = process.env.REACT_APP_BASE_URL;

// 🔹 Custom fetch with pagination
export const fetchPlans = createAsyncThunk(
  "ads/fetchWithPagination",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/plans`, {
        headers: {
          Lang: i18n.language,
        },
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
  plans: [],
  record: null,
  isLoading: false,
  pagination: null,
  error: null,
  success: null,
};

// Create slice
const PlansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    addCrudExtraReducers(builder, {
      key: "plans",
    });

    builder
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload.data; // plans list
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export
export const { clearState } = PlansSlice.actions;
export default PlansSlice.reducer;
