// src/redux/SubCategoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  fetchAll
} = crudFactory("plans");
// Initial state
const initialState = {
  plans: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const PlansSlice = createSlice({
  name: "plans",
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
      key: "plans",
    });
  },
});
// Export
export const { clearState } = PlansSlice.actions;
export {
  fetchAll as fetchPlans,
};
export default PlansSlice.reducer;