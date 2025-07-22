import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  backupCurrentDB,
  getAccessBranches,
  getAdminLogs,
  getAllActiveCompanies,
  getAllMenus,
  getLoginDetails,
  getMenuList,
  getPagePermission,
  getSearchItems,
} from "../thunks/coreComponent";

export const coreCompInitialState = {
  companyList: [],
  menuList: [],
  accessBranches: [],
  menuSettingsList: {},
  pagePermission: {},
  loginDetailsList: [],
  adminLogsList: [],
  searchItemsList: [],
  backupDB: null,
  isError: null,
  isLoading: false,
};

export const coreCompReducer = createSlice({
  name: "coreCompReducer",
  initialState: coreCompInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllActiveCompanies.fulfilled, (state, action) => {
      state.companyList = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(backupCurrentDB.fulfilled, (state, action) => {
      state.backupDB = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllMenus.fulfilled, (state, action) => {
      state.menuList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getMenuList.fulfilled, (state, action) => {
      state.menuSettingsList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAccessBranches.fulfilled, (state, action) => {
      state.accessBranches = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getPagePermission.fulfilled, (state, action) => {
      state.pagePermission = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getLoginDetails.fulfilled, (state, action) => {
      state.loginDetailsList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAdminLogs.fulfilled, (state, action) => {
      state.adminLogsList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getSearchItems.fulfilled, (state, action) => {
      state.searchItemsList = action.payload?.data;
      state.isLoading = false;
    });
    builder.addCase("searchItems/reset", (state) => {
      state.searchItemsList = [];
    });
    builder.addMatcher(
      isAnyOf(
        getAllActiveCompanies.pending,
        getMenuList.pending,
        getPagePermission.pending,
        getAllMenus.pending,
        getAccessBranches.pending,
        getLoginDetails.pending,
        getAdminLogs.pending,
        getSearchItems.pending,
        backupCurrentDB.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllActiveCompanies.rejected,
        getMenuList.rejected,
        getPagePermission.rejected,
        getAllMenus.rejected,
        getAccessBranches.rejected,
        getLoginDetails.rejected,
        getAdminLogs.rejected,
        getSearchItems.rejected,
        backupCurrentDB.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
  },
});
