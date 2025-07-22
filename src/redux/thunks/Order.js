import { createAsyncThunk } from "@reduxjs/toolkit";
import orderAPI from "../api/OrderAPI";
import { DispatchErrorHandler } from "../configs";
import {
  toastfunc,
  toastsuccess,
} from "../../components/sds-toast-style/toast-style";

export const createOrder = createAsyncThunk(
  "orderReducer/createOrder",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.createOrder(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllOrder = createAsyncThunk(
  "orderReducer/getAllOrder",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getAllOrder(payload?.page, payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllPurchaseOrder = createAsyncThunk(
  "orderReducer/getAllPurchaseOrder",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getAllPurchaseOrder(
        payload?.page,
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseOrderStatusList = createAsyncThunk(
  "orderReducer/getPurchaseOrderStatusList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getPurchaseOrderStatusList(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const purchaseOrderStatusChange = createAsyncThunk(
  "orderReducer/purchaseOrderStatusChange",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.purchaseOrderStatusChange(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseOrderById = createAsyncThunk(
  "orderReducer/getPurchaseOrderById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getPurchaseOrderById(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseOrderPurchaseSoldDetails = createAsyncThunk(
  "orderReducer/getPurchaseOrderPurchaseSoldDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getPurchaseOrderPurchaseSoldDetails(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updatePurchaseOrderById = createAsyncThunk(
  "orderReducer/updatePurchaseOrderById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.updatePurchaseOrderById(
        payload?.id,
        payload?.putData
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deletePurchaseOrderById = createAsyncThunk(
  "orderReducer/deletePurchaseOrderById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.deletePurchaseOrderById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOrderDropdown = createAsyncThunk(
  "orderReducer/getOrderDropdown",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getOrderDropdown(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOrderById = createAsyncThunk(
  "orderReducer/getOrderById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getOrderByID(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateOrderById = createAsyncThunk(
  "orderReducer/updateOrderById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.updateOrderByID(
        payload?.id,
        payload?.putData
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteOrderById = createAsyncThunk(
  "orderReducer/deleteOrderById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.deleteOrderByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orderReducer/updateOrderStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.changeStatusOrder(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const orderAssign = createAsyncThunk(
  "orderReducer/orderAssign",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.orderAssign(payload);
      let message = response.data?.data?.error_message;

      if (Array.isArray(message) && message.length > 0) {
        message.forEach((msg) => {
          toastfunc(msg);
        });
      } else {
        toastsuccess("Order Assigned successfully");
      }
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const openOrders = createAsyncThunk(
  "orderReducer/openOrders",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.openOrders(payload);
      return response.data.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const orderStatusChange = createAsyncThunk(
  "orderReducer/orderStatusChange",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.orderStatusChange(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAssignedOrders = createAsyncThunk(
  "orderReducer/getAssignedOrders",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getAssignedOrders(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const cancelOrders = createAsyncThunk(
  "orderReducer/cancelOrders",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.cancelOrders(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deliverdOrders = createAsyncThunk(
  "orderReducer/deliverdOrders",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.deliverdOrders(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOrders = createAsyncThunk(
  "orderReducer/getOrders",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getOrders(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getRepairs = createAsyncThunk(
  "orderReducer/getRepairs",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getRepairs(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllOrderStatus = createAsyncThunk(
  "orderReducer/getAllOrderStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getAllOrderStatus(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const orderLink = createAsyncThunk(
  "orderReducer/orderLink",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.orderLink(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOrderLinkList = createAsyncThunk(
  "orderReducer/getOrderLinkList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.orderLinkList(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getRepairOrderDeliveryDetails = createAsyncThunk(
  "orderReducer/getRepairOrderDeliveryDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getRepairOrderDeliveryDetails(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createRepairOrderDelivery = createAsyncThunk(
  "orderReducer/createRepairOrderDelivery",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.createRepairOrderDelivery(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getRepairOrderList = createAsyncThunk(
  "orderReducer/getRepairOrderList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getRepairOrderList(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Customer Deposit
export const createCustomerDeposits = createAsyncThunk(
  "customerDepositReducer/createCustomerDeposits",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.createCustomerDeposits(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllCustomerDeposits = createAsyncThunk(
  "customerDepositReducer/getAllCustomerDeposits",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getAllCustomerDeposits(
        payload?.page,
        payload,
        payload?.path_name
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCustomerDepositByID = createAsyncThunk(
  "customerDepositReducer/getCustomerDepositByID",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getCustomerDepositByID(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateCustomerDepositByID = createAsyncThunk(
  "customerDepositReducer/updateCustomerDepositByID",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.updateCustomerDepositByID(
        payload?.id,
        payload?.putData
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseCartItems = createAsyncThunk(
  "orderReducer/getPurchaseCartItems",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.getPurchaseCartItems();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createPurchaseCartItem = createAsyncThunk(
  "orderReducer/createPurchaseCartItem",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.createPurchaseCartItem(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const removePurchaseCartItem = createAsyncThunk(
  "orderReducer/removePurchaseCartItem",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await orderAPI.order.removePurchaseCartItem(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
