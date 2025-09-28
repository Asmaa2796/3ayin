// src/redux/helpers/crudToolkit.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const getHeaders = (isFormData = false) => {
  const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
  const headers = {
    Authorization: `Bearer ${token}`,
    Lang: i18n.language,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// ✅ Factory to generate CRUD thunks (optionally with restore and deleted)
export const crudFactory = (resourceName) => {
  const fetchAll = createAsyncThunk(
    `${resourceName}/fetchAll`,
    async (_, { rejectWithValue }) => {
      try {
        const res = await axios.get(`${BASE_URL}/api/${resourceName}`, {
          headers: getHeaders(),
        });
        return res.data.data;
      } catch (err) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to load data"
        );
      }
    }
  );

  const create = createAsyncThunk(
    `${resourceName}/add`,
    async (formData, { rejectWithValue }) => {
      try {
        const isFormData = formData instanceof FormData;
        const res = await axios.post(
          `${BASE_URL}/api/${resourceName}/store`,
          formData,
          { headers: getHeaders(isFormData) }
        );
        return res.data;
      } catch (err) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to create"
        );
      }
    }
  );

  const update = createAsyncThunk(
    `${resourceName}/update`,
    async ({ id, formData }, { rejectWithValue }) => {
      try {
        const isFormData = formData instanceof FormData;
        const res = await axios.post(
          `${BASE_URL}/${resourceName}/${id}`,
          formData,
          { headers: getHeaders(isFormData) }
        );
        return res.data;
      } catch (err) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to update"
        );
      }
    }
  );

  const getById = createAsyncThunk(
    `${resourceName}/record`,
    async (id, { rejectWithValue }) => {
      try {
        const res = await axios.get(`${BASE_URL}/api/${resourceName}/${id}`, {
          headers: getHeaders(),
        });
        return res.data.data;
      } catch (err) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to get record"
        );
      }
    }
  );

  return {
    fetchAll,
    create,
    getById,
    update,
  };
};

// ✅ Helper to auto-generate reducers for those thunks
export function addCrudExtraReducers(
  builder,
  { fetchAll, create, getById, update, key, idKey = "id" }
) {
  if (fetchAll) {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.isLoading = false;
        state[key] = action.payload;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }

  if (create) {
    builder
      .addCase(create.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(create.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(create.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      });
  }

  if (getById) {
    builder
      .addCase(getById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.record = action.payload;
      })
      .addCase(getById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }

  if (update) {
    builder
      .addCase(update.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(update.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
      })
      .addCase(update.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
}
