import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const searchAds = createAsyncThunk(
  "search/ads",
  async (searchValue, { rejectWithValue }) => {
    try {
      const trimmedValue = searchValue.trim();
      const response = await axios.post(`${BASE_URL}/ads/search`, {
        search: trimmedValue,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    adsList: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.adsList = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAds.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.adsList = []; // Clear previous results while loading
      })
      .addCase(searchAds.fulfilled, (state, action) => {
        state.loading = false;
        state.adsList = action.payload || [];
      })
      .addCase(searchAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
