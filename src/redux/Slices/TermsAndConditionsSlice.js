// src/redux/TermsAndConditionsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  fetchAll
} = crudFactory("terms-and-conditions");
// Initial state
const initialState = {
  termsConditions: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const TermsAndConditionsSlice = createSlice({
  name: "termsConditions",
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
      key: "termsConditions",
    });
  },
});
// Export
export const { clearState } = TermsAndConditionsSlice.actions;
export {
  fetchAll as fetchTerms,
};
export default TermsAndConditionsSlice.reducer;