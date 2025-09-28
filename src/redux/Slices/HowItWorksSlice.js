// src/redux/SubCategoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  fetchAll
} = crudFactory("how-it-works");
// Initial state
const initialState = {
  howItWorks: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const HowItWorksSlice = createSlice({
  name: "howItWorks",
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
      key: "howItWorks",
    });
  },
});
// Export
export const { clearState } = HowItWorksSlice.actions;
export {
  fetchAll as fetchHowItWorks,
};
export default HowItWorksSlice.reducer;