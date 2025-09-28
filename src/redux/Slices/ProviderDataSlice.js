// src/redux/ProviderDateSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  getById
} = crudFactory("provider/profile");
// Initial state
const initialState = {
  providerData: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const ProviderDataSlice = createSlice({
  name: "providerData",
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
      key: "providerData",
    });
  },
});
// Export
export const { clearState } = ProviderDataSlice.actions;
export {
  getById as getProviderData,
};
export default ProviderDataSlice.reducer;