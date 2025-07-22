import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";
import estimationAPI from "../api/estimationAPI";

//Estimation
export const createEstimation = createAsyncThunk(
  "estReducer/createEstimation",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await estimationAPI.estimation.createEstimation(payload);
      console.log(response.data);
      toastsuccess(response.data.message);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getEstimationApprovalList = createAsyncThunk(
  "estReducer/getEstimationApprovalList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await estimationAPI.estimation.estimationApprovalList(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const approveEstimation = createAsyncThunk(
  "estReducer/approveEstimation",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await estimationAPI.estimation.approveEstimation(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateEstimation = createAsyncThunk(
  "estReducer/updateEstimation",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await estimationAPI.estimation.updateEstimation(payload?.id, payload?.putData);
      console.log(response.data);
      toastsuccess(response.data.message);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const estimationList = createAsyncThunk(
  "estReducer/estimationList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await estimationAPI.estimation.estimationList(payload?.page, payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getEstimationDetailsById = createAsyncThunk(
  "estReducer/getEstimationDetailsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await estimationAPI.estimation.getEstimationDetailsById(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getEstimationDetailsByNo = createAsyncThunk(
  "estReducer/getEstimationDetailsByNo",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await estimationAPI.estimation.getEstimationDetailsByNo(payload);
      console.log(response.data);
      // toastsuccess(response.data.message);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const estimationDetailsPrint = createAsyncThunk(
  "estReducer/estimationDetailsPrint",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await estimationAPI.estimation.estimationDetailsPrint(payload?.id);
      toastsuccess(response.data.message);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);