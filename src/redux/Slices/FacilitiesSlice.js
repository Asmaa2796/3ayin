// src/redux/SubCategoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  fetchAll
} = crudFactory("facilities");
// Initial state
const initialState = {
  facilities: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const FacilitiesSlice = createSlice({
  name: "facilities",
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
      key: "facilities",
    });
  },
});
// Export
export const { clearState } = FacilitiesSlice.actions;
export {
  fetchAll as fetchFacilities,
};
export default FacilitiesSlice.reducer;