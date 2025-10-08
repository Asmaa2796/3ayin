// src/redux/CustomizePackageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Async thunk for submitting the customize package form
export const customizePackage = createAsyncThunk(
  "customizePackage/submit",
  async (formData, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const response = await axios.post(
        `${BASE_URL}/api/customize_package`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Lang: i18n.language,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to submit customize package form"
      );
    }
  }
);

// Initial state
const initialState = {
  isLoading: false,
  successed: null,
  failed: null,
};

// Slice
const CustomizePackageSlice = createSlice({
  name: "customize_package",
  initialState,
  reducers: {
    clearState: (state) => {
      state.isLoading = false;
      state.successed = null;
      state.failed = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(customizePackage.pending, (state) => {
        state.isLoading = true;
        state.failed = null;
        state.successed = null;
      })
      .addCase(customizePackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successed = true;
      })
      .addCase(customizePackage.rejected, (state, action) => {
        state.isLoading = false;
        state.successed = false;
        state.failed = action.payload || action.failed?.message || "Something went wrong";
      });
  },
});

// Exports
export const { clearState } = CustomizePackageSlice.actions;
export default CustomizePackageSlice.reducer;
