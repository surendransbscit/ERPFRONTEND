import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { importData } from "../thunks/importExport";

const importReducerInitialState = {
  isError: null,
  isLoading: false,
};

export const importReducer = createSlice({
  name: "importReducer",
  initialState: importReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(importData.pending), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(importData.rejected), (state, action) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addMatcher(isAnyOf(importData.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});
