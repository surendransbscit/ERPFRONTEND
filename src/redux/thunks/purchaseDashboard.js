import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import purchaseDashboardAPI from "../api/purchaseDashboardAPI";

export const getSupplierRateCut = createAsyncThunk(
  "purchaseDashboardReducer/getSupplierRateCut",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await purchaseDashboardAPI.purchaseDashboards.getSupplierRateCut(
          payload.view
        );

      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSupplierListRateCut = createAsyncThunk(
  "purchaseDashboardReducer/getSupplierListRateCut",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await purchaseDashboardAPI.purchaseDashboards.getSupplierListRateCut(
          payload.view
        );

      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSupplierWisePurchase = createAsyncThunk(
  "purchaseDashboardReducer/getSupplierWisePurchase",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await purchaseDashboardAPI.purchaseDashboards.getSupplierWisePurchase(
          payload.view
        );

      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseDetailList = createAsyncThunk(
  "purchaseDashboardReducer/getPurchaseDetailList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await purchaseDashboardAPI.purchaseDashboards.getPurchaseDetailList(
          payload.view
        );

      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);