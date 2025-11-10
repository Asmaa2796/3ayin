// src/redux/ProviderPropertiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const baseURL = process.env.REACT_APP_BASE_URL;
export const getProviderProperties = createAsyncThunk(
  "providerProperties/getProviderProperties",
  async ({ status,page = 1,id }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const response = await axios.get(
        `${baseURL}/api/user/${id}/properties?status=${status}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Lang: i18n.language,
          },
        }
      );
      return {
        properties: response.data?.data || [],
        paginationProps: response.data?.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch provider properties"
      );
    }
  }
);

const initialState = {
  providerProperties: [],
  paginationProps: null,
  isLoading: false,
  error: null,
  success: null,
};

const ProviderPropertiesSlice = createSlice({
  name: "providerProperties",
  initialState,
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
      state.providerProperties = [];
      state.paginationProps = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProviderProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.providerProperties = [];
        state.paginationProps = null; 
      })
      .addCase(getProviderProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providerProperties = action.payload.properties;
        state.paginationProps = action.payload.paginationProps;
      })
      .addCase(getProviderProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = ProviderPropertiesSlice.actions;
export default ProviderPropertiesSlice.reducer;
