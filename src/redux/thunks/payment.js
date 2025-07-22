import { createAsyncThunk } from "@reduxjs/toolkit";
import paymentAPI from "../api/paymentAPI";
import { DispatchErrorHandler } from "../configs";
import { toastfunc } from "../../components/sds-toast-style/toast-style";

export const getPaymentGateways = createAsyncThunk(
  "paymentOptionsreducer/getPaymentGateways",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.paymentOptions.getPaymentGateways();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getPaymentModes = createAsyncThunk(
  "paymentOptionsreducer/getPaymentModes",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.paymentOptions.getPaymentModes();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getPayDevices = createAsyncThunk(
  "paymentOptionsreducer/getPayDevices",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.paymentOptions.getPayDevices();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getNBType = createAsyncThunk(
  "paymentOptionsreducer/getNBType",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.paymentOptions.getNBType();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Payment Master
export const createPayment = createAsyncThunk(
  "paymentMasterReducer/createPayment",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.payments.createPayments(payload);
      return response;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPaymentInfo = createAsyncThunk(
  "paymentMasterReducer/getPaymentInfo",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.payments.getPaymentInfo(payload);
      return response?.data;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllPayments = createAsyncThunk(
  "paymentMasterReducer/getAllPayments",
  async (payload = {}, { rejectWithValue }) => {
    try {
      console.log(payload);
      const response = await paymentAPI.payments.getAllPayments(
        payload?.page,
        payload?.branch,
        payload?.records,
        payload?.fromDate,
        payload?.toDate,
        payload?.search,
        payload?.customer,
        payload?.id_scheme,
        payload?.path_name
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPaymentHistory = createAsyncThunk(
  "paymentMasterReducer/getPaymentHistory",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.payments.getPaymentHistory(payload?.id_scheme_account);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const cancelPayments = createAsyncThunk(
  "paymentMasterReducer/cancelPayments",
  async (payload = {}, { rejectWithValue }) => {
    console.log(payload);

    try {
      const response = await paymentAPI.payments.cancelPayments(payload);
      // console.log(response);
      return response?.data || null;
    } catch (error) {
      if (error?.response?.data?.message !== undefined && error?.response?.data?.message?.includes("already")) {
        // toastfunc(response?.data?.message);
        payload?.setOtpModal(true);
      }
      console.log(error);
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
