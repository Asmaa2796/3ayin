// src/redux/AllPropertiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Async thunk for submitting the contact form
export const fetchAllProperties = createAsyncThunk(
  "properties/fetchAll",
  async ({ filters = {}, page = 1, per_page = 9 }, { rejectWithValue }) => {
    try {
      let url = `${BASE_URL}/api/properties?page=${page}&per_page=${per_page}`;

      // Dynamically append filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          url += `&${key}=${value}`;
        }
      });

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Lang: i18n.language,
        },
      });

      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch properties"
      );
    }
  }
);

// Initial state
const initialState = {
  properties: [],
  isLoading: false,
  pagination: null,
  success: null,
  error: null,
};

// Slice
const AllPropertiesSlice = createSlice({
  name: "properties",
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
      .addCase(fetchAllProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchAllProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error =
          action.payload || action.error?.message || "Something went wrong";
      });
  },
});

// Exports
export const { clearState } = AllPropertiesSlice.actions;
export default AllPropertiesSlice.reducer;
