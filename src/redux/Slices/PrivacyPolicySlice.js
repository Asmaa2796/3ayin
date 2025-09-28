// src/redux/PrivacyPoliceSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  fetchAll
} = crudFactory("privacy-policy");
// Initial state
const initialState = {
  privacyPolicy: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const PrivacyPoliceSlice = createSlice({
  name: "privacyPolicy",
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
      key: "privacyPolicy",
    });
  },
});
// Export
export const { clearState } = PrivacyPoliceSlice.actions;
export {
  fetchAll as fetchPrivacy,
};
export default PrivacyPoliceSlice.reducer;