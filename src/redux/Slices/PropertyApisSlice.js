// src/redux/AllPropertiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Async thunk for submitting the contact form
export const fetchPurposes = createAsyncThunk(
  "properties/fetchPurposes",
  async (_, { rejectWithValue }) => {
    try {
      // const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const response = await axios.get(`${BASE_URL}/api/property/purposes`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Lang: i18n.language,
        },
      });
      return {
        data: response.data.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load"
      );
    }
  }
);
export const fetchTypes = createAsyncThunk(
  "properties/fetchTypes",
  async (_, { rejectWithValue }) => {
    try {
      // const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const response = await axios.get(`${BASE_URL}/api/property/types`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Lang: i18n.language,
        },
      });
      return {
        data: response.data.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load"
      );
    }
  }
);
export const fetchLevels = createAsyncThunk(
  "properties/fetchLevels",
  async (_, { rejectWithValue }) => {
    try {
      // const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const response = await axios.get(`${BASE_URL}/api/property/levels`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Lang: i18n.language,
        },
      });
      return {
        data: response.data.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load"
      );
    }
  }
);
export const fetchPropertCategories = createAsyncThunk(
  "properties/fetchPropertCategories",
  async (_, { rejectWithValue }) => {
    try {
      // const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const response = await axios.get(`${BASE_URL}/api/property/categories`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Lang: i18n.language,
        },
      });
      return {
        data: response.data.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load"
      );
    }
  }
);
export const fetchPropertCategoriesChilds = createAsyncThunk(
  "properties/fetchPropertCategoriesChilds",
  async (id, { rejectWithValue }) => {
    try {
      // const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const response = await axios.get(`${BASE_URL}/api/property/categories?parent_id=${id}`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Lang: i18n.language,
        },
      });
      return {
        data: response.data.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load"
      );
    }
  }
);
export const fetchPropertCategoriesSubChilds = createAsyncThunk(
  "properties/fetchPropertCategoriesSubChilds",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/property/categories?parent_id=${id}`, {
        headers: {
          "Content-Type": "application/json",
          Lang: i18n.language,
        },
      });
      return {
        data: response.data.data,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load");
    }
  }
);


// Initial state
const initialState = {
  properties_api: [],
  purposes: [],
  types: [],
  levels: [],
  property_categories: [],
  property_categories_childs: [],
  property_categories_sub_childs: [],
  isLoading: false,
  pagination: null,
  success: null,
  error: null,
};

// Slice
const PropertyApisSlice = createSlice({
  name: "properties_api",
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
      .addCase(fetchPurposes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchPurposes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purposes = action.payload.data;
      })
      .addCase(fetchPurposes.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error =
          action.payload || action.error?.message || "Something went wrong";
      })
      .addCase(fetchTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.types = action.payload.data;
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error =
          action.payload || action.error?.message || "Something went wrong";
      })
      .addCase(fetchLevels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchLevels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.levels = action.payload.data;
      })
      .addCase(fetchLevels.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error =
          action.payload || action.error?.message || "Something went wrong";
      })
      .addCase(fetchPropertCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchPropertCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.property_categories = action.payload.data;
      })
      .addCase(fetchPropertCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error =
          action.payload || action.error?.message || "Something went wrong";
      })
      .addCase(fetchPropertCategoriesChilds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchPropertCategoriesChilds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.property_categories_childs = action.payload.data;
      })
      .addCase(fetchPropertCategoriesChilds.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error =
          action.payload || action.error?.message || "Something went wrong";
      })
      .addCase(fetchPropertCategoriesSubChilds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchPropertCategoriesSubChilds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.property_categories_sub_childs = action.payload.data;
      })
      .addCase(fetchPropertCategoriesSubChilds.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error =
          action.payload || action.error?.message || "Something went wrong";
      });
  },
});

// Exports
export const { clearState } = PropertyApisSlice.actions;
export default PropertyApisSlice.reducer;
