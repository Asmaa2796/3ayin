// src/redux/ProviderStatisticsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  getById
} = crudFactory("provider/statistics");
// Initial state
const initialState = {
  providerStatistics: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const ProviderStatisticsSlice = createSlice({
  name: "providerStatistics",
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
      key: "providerStatistics",
    });
  },
});
// Export
export const { clearState } = ProviderStatisticsSlice.actions;
export {
  getById as getProviderStatistics,
};
export default ProviderStatisticsSlice.reducer;