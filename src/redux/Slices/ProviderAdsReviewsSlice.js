// src/redux/ProviderAdsReviewsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  getById
} = crudFactory("provider/ads/reviews");
// Initial state
const initialState = {
  providerAdsReviews: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const ProviderAdsReviewsSlice = createSlice({
  name: "providerAdsReviews",
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
      key: "providerAdsReviews",
    });
  },
});
// Export
export const { clearState } = ProviderAdsReviewsSlice.actions;
export {
  getById as getProviderAdsReviews,
};
export default ProviderAdsReviewsSlice.reducer;