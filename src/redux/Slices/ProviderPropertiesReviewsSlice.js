import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getProviderPropertiesReviews = createAsyncThunk(
  "providerPropertiesReviews/fetchAll",
  async ({ page = 1 } = {}, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;

      const response = await axios.get(
        `${BASE_URL}/api/provider/properties/reviews?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Lang: i18n.language,
          },
        }
      );

      return {
        data: response.data?.data || [],
        pagination: response.data?.pagination || {},
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const initialState = {
  providerPropertiesReviews: [],
  pagination: {},
  isLoading: false,
  error: null,
  success: null,
};

const ProviderPropertiesReviewsSlice = createSlice({
  name: "providerPropertiesReviews",
  initialState,
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProviderPropertiesReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProviderPropertiesReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providerPropertiesReviews = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getProviderPropertiesReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = ProviderPropertiesReviewsSlice.actions;
export default ProviderPropertiesReviewsSlice.reducer;
