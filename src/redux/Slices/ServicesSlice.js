// src/redux/ServicesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";
const BASE_URL = process.env.REACT_APP_BASE_URL;

// 🔹 Custom fetch with pagination
export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/services`, {
        headers: {
          Lang: i18n.language,
        },
      });
      return res.data; // { data, pagination }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load services"
      );
    }
  }
);

// Initial state
const initialState = {
  services: [],
  record: null,
  isLoading: false,
  pagination: null,
  error: null,
  success: null,
};

// Create slice
const ServicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    addCrudExtraReducers(builder, {
      key: "services",
    });

    builder
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload.data; // services list
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export
export const { clearState } = ServicesSlice.actions;
export default ServicesSlice.reducer;
