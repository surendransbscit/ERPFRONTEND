import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import digigoldDashboardAPI from "../api/digiGoldDashboardAPI";

export const getActiveInActiveCustomer = createAsyncThunk(
  "digigoldDashboardReducer/getActiveInActiveCustomer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await digigoldDashboardAPI.digiGoldDashboards.getActiveInActiveCustomer(
          payload.filter,
          payload.branch,
          payload.type
        );
      console.log(response);

      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getNewCustomer = createAsyncThunk(
  "digigoldDashboardReducer/getNewCustomer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await digigoldDashboardAPI.digiGoldDashboards.getNewCustomer(
          payload.filter,
          payload.branch,
          payload.type
        );
      console.log(response);

      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getTotalCustomer = createAsyncThunk(
  "digigoldDashboardReducer/getTotalCustomer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await digigoldDashboardAPI.digiGoldDashboards.getTotalCustomer(
          payload.filter,
          payload.branch,
          payload.type
        );
      console.log(response);

      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDashboardSummary = createAsyncThunk(
  "digigoldDashboardReducer/getDashboardSummary",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await digigoldDashboardAPI.digiGoldDashboards.getDashboardSummary(payload?.days);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getMonthlywiseMetalWeight = createAsyncThunk(
  "digigoldDashboardReducer/getMonthlywiseMetalWeight",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await digigoldDashboardAPI.digiGoldDashboards.getMonthlywiseMetalWeight(payload?.year);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getClosedAccountsSummary = createAsyncThunk(
  "digigoldDashboardReducer/getClosedAccountsSummary",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await digigoldDashboardAPI.digiGoldDashboards.getClosedAccountsSummary();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSchemeSlabWiseAccounts = createAsyncThunk(
  "digigoldDashboardReducer/getSchemeSlabWiseAccounts",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await digigoldDashboardAPI.digiGoldDashboards.getSchemeSlabWiseAccounts(payload?.metalType);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getUpcomingMaturies = createAsyncThunk(
  "digigoldDashboardReducer/getUpcomingMaturies",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await digigoldDashboardAPI.digiGoldDashboards.getUpcomingMaturies();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
