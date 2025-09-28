// src/redux/SubCategoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { crudFactory, addCrudExtraReducers } from "../helpers/CrudToolkit";
// Generate thunks for this resource
const {
  fetchAll
} = crudFactory("settings");
// Initial state
const initialState = {
  settings: [],
  record: null,
  isLoading: false,
  error: null,
  success: null,
};
// Create slice
const SettingsSlice = createSlice({
  name: "settings",
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
      key: "settings",
    });
  },
});
// Export
export const { clearState } = SettingsSlice.actions;
export {
  fetchAll as fetchSettings,
};
export default SettingsSlice.reducer;