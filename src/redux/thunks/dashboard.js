import { createAsyncThunk } from "@reduxjs/toolkit";
import dashboardAPI from "../api/dashboardAPI";
import { DispatchErrorHandler } from "../configs";

//payment status
export const getPaymentStatus = createAsyncThunk(
  "dashboardReducer/getPaymentStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getPaymentStatus(payload?.days);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPaymentThrough = createAsyncThunk(
  "dashboardReducer/getPaymentThrough",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getPaymentThrough(payload?.days);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPaymentModeDash = createAsyncThunk(
  "dashboardReducer/getPaymentModeDash",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getPaymentModeDash(payload?.days);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSchemeWiseJoined = createAsyncThunk(
  "dashboardReducer/getSchemeWiseJoined",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getSchemeWiseJoined(payload?.days);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSchemeWiseClosed = createAsyncThunk(
  "dashboardReducer/getSchemeWiseClosed",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getSchemeWiseClosed(payload?.days);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getUserJoinedThrough = createAsyncThunk(
  "dashboardReducer/getUserJoinedThrough",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getUserJoinedThrough(payload?.days);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getBranchWiseSchemeJoined = createAsyncThunk(
  "dashboardReducer/getBranchWiseSchemeJoined",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getBranchWiseSchemeJoined(payload?.days);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getBranchWiseSchemeClosed = createAsyncThunk(
  "dashboardReducer/getBranchWiseSchemeClosed",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getBranchWiseSchemeClosed(payload?.days);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getUserByAreas = createAsyncThunk(
  "dashboardReducer/getUserByAreas",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getUserByAreas();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveChits = createAsyncThunk(
  "dashboardReducer/getActiveChits",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getActiveChits(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getMaturedUnclaimedChits = createAsyncThunk(
  "dashboardReducer/getMaturedUnclaimedChits",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getMaturedUnclaimedChits();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getInActiveChits = createAsyncThunk(
  "dashboardReducer/getInActiveChits",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getInActiveChits();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPaymentSummary = createAsyncThunk(
  "dashboardReducer/getPaymentSummary",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getPaymentSummary(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getBranchWiseDetails = createAsyncThunk(
  "dashboardReducer/getBranchWiseDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getBranchWiseDetails();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getUnPaidCustomersDetails = createAsyncThunk(
  "dashboardReducer/getUnPaidCustomersDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getUnPaidCustomersDetails();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCollectionSummary = createAsyncThunk(
  "dashboardReducer/getCollectionSummary",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getCollectionSummary();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getChitClosingDetails = createAsyncThunk(
  "dashboardReducer/getChitClosingDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getChitClosingDetails();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getRegisterThroughDetails = createAsyncThunk(
  "dashboardReducer/getRegisterThroughDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getRegisterThroughDetails(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCustomerDetails = createAsyncThunk(
  "dashboardReducer/getCustomerDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getCustomerDetails();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getOrderDetails = createAsyncThunk(
  "dashboardReducer/getOrderDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getOrderDetails();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCustomerImportantDates = createAsyncThunk(
  "dashboardReducer/getCustomerImportantDates",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getCustomerImportantDates();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCustomerImportantDatesList = createAsyncThunk(
  "dashboardReducer/getCustomerImportantDatesList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getCustomerImportantDatesList(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getBranchWiseCollectionDetails = createAsyncThunk(
  "dashboardReducer/getBranchWiseCollectionDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.getBranchWiseCollectionDetails(payload.view);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

// Order Management Dashboard


export const fetchOrderDetails = createAsyncThunk(
  "dashboardReducer/fetchOrderDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.fetchOrderDetails();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchTotalOrderDetails = createAsyncThunk(
  "dashboardReducer/fetchTotalOrderDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.fetchTotalOrderDetails();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchTodayRecivedDetails = createAsyncThunk(
  "dashboardReducer/fetchTodayRecivedDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.fetchTodayRecivedDetails();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchErpTodayDeliveredOrders = createAsyncThunk(
  "dashboardReducer/fetchErpTodayDeliveredOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await dashboardAPI.dashboards.fetchErpTodayDeliveredOrders();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchErpYetToAssignOrders = createAsyncThunk(
  "dashboardReducer/fetchErpYetToAssignOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await dashboardAPI.dashboards.fetchErpYetToAssignOrders();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchErpTotalDeliveredOrders = createAsyncThunk(
  "dashboardReducer/fetchErpTotalDeliveredOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await dashboardAPI.dashboards.fetchErpTotalDeliveredOrders();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchErpWeekDeliveryOrders = createAsyncThunk(
  "dashboardReducer/fetchErpWeekDeliveryOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await dashboardAPI.dashboards.fetchErpWeekDeliveryOrders();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchErpNextWeekDeliveryOrders = createAsyncThunk(
  "dashboardReducer/fetchErpNextWeekDeliveryOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await dashboardAPI.dashboards.fetchErpNextWeekDeliveryOrders();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchErpOverDueOrderSupplier = createAsyncThunk(
  "dashboardReducer/fetchErpOverDueOrderSupplier",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await dashboardAPI.dashboards.fetchErpOverDueOrderSupplier();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchErpCustomerOverDueOrder = createAsyncThunk(
  "dashboardReducer/fetchErpCustomerOverDueOrder",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await dashboardAPI.dashboards.fetchErpCustomerOverDueOrder();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchErpTotalDeliveryReady = createAsyncThunk(
  "dashboardReducer/fetchErpTotalDeliveryReady",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await dashboardAPI.dashboards.fetchErpTotalDeliveryReady();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchErpWorkProgress = createAsyncThunk(
  "dashboardReducer/fetchErpWorkProgress",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.dashboards.fetchErpWorkProgress();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const getErpCustomerCartReport = createAsyncThunk(
  "dashboardReducer/getCustomerCartReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await dashboardAPI.dashboards.getCreditCollectionReportReport(
          payload?.page,
          payload?.records
          ,payload?.search
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);