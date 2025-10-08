import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const searchAds = createAsyncThunk(
  "search/ads",
  async (searchValue, { rejectWithValue }) => {
    try {
      const trimmedValue = searchValue.trim();
      // const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;

      const response = await axios.post(
        `${BASE_URL}/api/ads/search`,
        { search: trimmedValue },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Lang: i18n.language,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const searchProperty = createAsyncThunk(
  "search/properties",
  async (searchValue, { rejectWithValue }) => {
    try {
      const trimmedValue = searchValue.trim();
      // const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;

      const response = await axios.post(
        `${BASE_URL}/api/searchProperty`,
        { search: trimmedValue },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Lang: i18n.language,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const SearchSlice = createSlice({
  name: "search",
  initialState: {
    adsList: [],
    propertiesList: [],
    adsPagination: null,
    propertiesPagination: null,
    loading: false,
    loadingFiltered: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.adsList = [];
      state.propertiesList = [];
      state.loading = false;
      state.loadingFiltered = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAds.pending, (state) => {
        state.loadingFiltered = true;
        state.error = null;
        state.adsList = [];
        state.adsPagination = null;
      })
      .addCase(searchAds.fulfilled, (state, action) => {
        state.loadingFiltered = false;
        state.adsList = action.payload?.data || [];
        state.adsPagination = action.payload?.pagination || null;
      })
      .addCase(searchAds.rejected, (state, action) => {
        state.loadingFiltered = false;
        state.error = action.payload || "Something went wrong.";
      })
      .addCase(searchProperty.pending, (state) => {
        state.loadingFiltered = true;
        state.error = null;
        state.propertiesList = [];
        state.propertiesPagination = null;
      })
      .addCase(searchProperty.fulfilled, (state, action) => {
        state.loadingFiltered = false;
        state.propertiesList = action.payload?.data || [];
        state.propertiesPagination = action.payload?.pagination || null;
      })
      .addCase(searchProperty.rejected, (state, action) => {
        state.loadingFiltered = false;
        state.error = action.payload || "Something went wrong.";
      });
  },
});

export const { clearSearchResults } = SearchSlice.actions;
export default SearchSlice.reducer;
