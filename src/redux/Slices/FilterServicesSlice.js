// all service slice and filters
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

export const fetchAllCategoriesTree = createAsyncThunk(
  "subCategories/fetchAllCategoriesTree",
  async (_, { rejectWithValue }) => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("user3ayin"));
      const token = userData?.token;
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/categories/sub-categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            Lang: i18n.language,
          },
        }
      );
      if (response.data.code === 200) {
        return response.data;
      }
      return rejectWithValue(response.data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const FilterServicesSlice = createSlice({
  name: "filterServices",
  initialState: {
    filterByCats: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategoriesTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategoriesTree.fulfilled, (state, action) => {
        state.loading = false;
        state.filterByCats = action.payload;
      })
      .addCase(fetchAllCategoriesTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load subcategories";
      });
  },
});

export default FilterServicesSlice.reducer;
