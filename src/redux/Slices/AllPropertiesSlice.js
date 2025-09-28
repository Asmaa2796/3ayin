// src/redux/AllPropertiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Async thunk for submitting the contact form
export const fetchAllProperties = createAsyncThunk(
  "properties/submit",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const response = await axios.get(`${BASE_URL}/api/properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Lang: i18n.language,
        },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to submit contact form"
      );
    }
  }
);

// Initial state
const initialState = {
  properties: [],
  isLoading: false,
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
        state.properties = action.payload;
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
