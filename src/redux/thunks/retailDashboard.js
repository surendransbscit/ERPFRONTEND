import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import retailDashboardAPI from "../api/retailDashboardAPI";

export const getEstimation = createAsyncThunk(
  "retailDashboardReducer/getEstimation",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getEstimation(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCustomerVists = createAsyncThunk(
  "retailDashboardReducer/getCustomerVists",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getCustomerVists(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getKarigarOrders = createAsyncThunk(
  "retailDashboardReducer/getKarigarOrders",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getKarigarOrders();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSales = createAsyncThunk(
  "retailDashboardReducer/getSales",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getSales(payload?.view, payload?.branch);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockApproval = createAsyncThunk(
  "retailDashboardReducer/getStockApproval",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getStockApproval(payload?.view, payload?.branch);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCustomerOrder = createAsyncThunk(
  "retailDashboardReducer/getCustomerOrder",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getCustomerOrder(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSalesReturn = createAsyncThunk(
  "retailDashboardReducer/getSalesReturn",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getSalesReturn(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchase = createAsyncThunk(
  "retailDashboardReducer/getPurchase",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getPurchase(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLot = createAsyncThunk("retailDashboardReducer/getLot", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await retailDashboardAPI.retailDashboards.getLot(payload.view);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getCreditSales = createAsyncThunk(
  "retailDashboardReducer/getCreditSales",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getCreditSales(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStoreStatistics = createAsyncThunk(
  "retailDashboardReducer/getStoreStatistics",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getStoreStatistics(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getTopProduct = createAsyncThunk(
  "retailDashboardReducer/getTopProduct",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getTopProduct(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getSupplierPayment = createAsyncThunk(
  "retailDashboardReducer/getSupplierPayment",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getSupplierPayment(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


//Reports
export const getEstimationReport = createAsyncThunk(
  "retailDashboardReducer/getEstimationReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getEstimationReport(
        payload.view, payload.branch, payload.type);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCustomerVistsReports = createAsyncThunk(
  "retailDashboardReducer/getCustomerVistsReports",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getCustomerVistsReport(
        payload.view, payload.branch, payload.type);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSalesReport = createAsyncThunk(
  "retailDashboardReducer/getSalesReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getSalesReport(payload?.view, payload?.branch, payload?.type);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSalesReturnReport = createAsyncThunk(
  "retailDashboardReducer/getSalesReturnReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getSalesReturnReport(payload.view,payload?.branch, payload?.type);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseReport = createAsyncThunk(
  "retailDashboardReducer/getPurchaseReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getPurchaseReport(payload.view,payload.branch, payload.type);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLotReport = createAsyncThunk("retailDashboardReducer/getLotReport", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await retailDashboardAPI.retailDashboards.getLotReport(payload.view, payload.branch, payload.type);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getCreditSalesReport = createAsyncThunk(
  "retailDashboardReducer/getCreditSalesReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getCreditSalesReport(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getKarigarReport = createAsyncThunk(
  "retailDashboardReducer/getKarigarReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getKarigarReport(
        payload.view, payload.branch, payload.type);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCustomerOrderReport = createAsyncThunk(
  "retailDashboardReducer/getCustomerOrderReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getCustomerOrderReport(
        payload.view, payload.branch, payload.type);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockApprovalReport = createAsyncThunk(
  "retailDashboardReducer/getStockApprovalReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailDashboardAPI.retailDashboards.getStockApprovalReport(
        payload.view, payload.branch, payload.type);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);