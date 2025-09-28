// src/redux/PropertySlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  fetchAll,
  create,
  getById,
  update
} = crudFactory("properties");
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