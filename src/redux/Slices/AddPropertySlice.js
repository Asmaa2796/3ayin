// src/redux/PropertySlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
import i18n from "../../i18n/i18n";
import axios from "axios";

// Generate thunks for this resource
const {
  fetchAll,
  create,
  getById,
  update
} = crudFactory("properties");
export const fetchPropertyById = createAsyncThunk(
  "properties/fetchPropertyById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`https://3ayin.resporthub.com/api/properties/${id}`,{
        headers: {
            "Content-Type": "application/json",
            Lang: i18n.language,
          },
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Initial state
const initialState = {
  properties: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const PropertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    addCrudExtraReducers(builder, {
      fetchAll,
      create,
      getById,
      update,
      key: "property",
    });
    
    // Custom reducer for fetchPropertyById
    builder
      .addCase(fetchPropertyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.record = action.payload;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
// Export
export const { clearState } = PropertySlice.actions;
export {
  fetchAll as fetchAd,
  create as addProperty,
  getById as propertyRecord,
  update as updateProperty
};
export default PropertySlice.reducer;