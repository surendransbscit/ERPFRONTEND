import { createAsyncThunk } from "@reduxjs/toolkit";
import coreCompAPI from "../api/coreCompAPI";
import { DispatchErrorHandler } from "../configs";

export const getAllActiveCompanies = createAsyncThunk(
  "coreCompReducer/getAllActiveCompanies",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await coreCompAPI.core.getAllActiveCompany(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllMenus = createAsyncThunk(
  "coreCompReducer/getAllMenus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await coreCompAPI.core.getAllMenu(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPagePermission = createAsyncThunk(
  "coreCompReducer/getPagePermission",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await coreCompAPI.core.menuPermission(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAccessBranches = createAsyncThunk(
  "coreCompReducer/getAccessBranches",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await coreCompAPI.core.getAccessBranches(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getMenuList = createAsyncThunk(
  "coreCompReducer/getMenuList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await coreCompAPI.core.getMenus(payload?.page);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLoginDetails = createAsyncThunk(
  "coreCompReducer/getLoginDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await coreCompAPI.core.getLoginDetails(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAdminLogs = createAsyncThunk(
  "coreCompReducer/getAdminLogs",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await coreCompAPI.core.getAdminLogs(payload?.start, payload?.last, payload?.offset);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


//earch items
export const getSearchItems = createAsyncThunk(
  "coreCompReducer/getSearchItems",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await coreCompAPI.core.getSearchItems(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const backupCurrentDB = createAsyncThunk(
  "coreCompReducer/backupCurrentDB",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await coreCompAPI.core.backupCurrentDB();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);