// src/redux/ProviderAdsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  getById
} = crudFactory("provider/ads");
// Initial state
const initialState = {
  providerAds: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const ProviderAdsSlice = createSlice({
  name: "providerAds",
  initialState,
  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    addCrudExtraReducers(builder, {
      getById,
      key: "providerAds",
    });
  },
});
// Export
export const { clearState } = ProviderAdsSlice.actions;
export {
  getById as getProviderAds,
};
export default ProviderAdsSlice.reducer;