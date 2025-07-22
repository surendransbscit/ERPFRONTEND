import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  cancelPayments,
  createPayment,
  getAllPayments,
  getNBType,
  getPayDevices,
  getPaymentGateways,
  getPaymentHistory,
  getPaymentInfo,
  getPaymentModes,
} from "../thunks/payment";

const paymentOptionsInitialState = {
  paymentGateways: [],
  paymentModes: [],
  paymentDevices: [],
  NBtypes: [],
  isError: null,
  isLoading: false,
};

export const paymentOptionsreducer = createSlice({
  name: "paymentOptionsreducer",
  initialState: paymentOptionsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPaymentGateways.fulfilled, (state, action) => {
      state.paymentGateways = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getPaymentModes.fulfilled, (state, action) => {
      state.paymentModes = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getPayDevices.fulfilled, (state, action) => {
      state.paymentDevices = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getNBType.fulfilled, (state, action) => {
      state.NBtypes = action.payload;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(getNBType.pending, getPayDevices.pending, getPaymentGateways.pending, getPaymentModes.pending),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getPaymentModes.rejected, getPaymentGateways.rejected, getNBType.rejected, getPayDevices.rejected),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
  },
});

const paymentMasterInitialState = {
  paymentList: [],
  paymentInfo: {},
  paymentHistoryList: {},
  isError: null,
  isLoading: false,
};

export const paymentMasterReducer = createSlice({
  name: "paymentMasterReducer",
  initialState: paymentMasterInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPayments.fulfilled, (state, action) => {
      state.paymentList = action.payload;
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(getPaymentInfo.fulfilled, (state, action) => {
      state.paymentInfo = action.payload;
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(getPaymentHistory.fulfilled, (state, action) => {
      state.paymentHistoryList = action.payload;
      state.isLoading = false;
      state.isError = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllPayments.pending,
        getPaymentInfo.pending,
        createPayment.pending,
        getPaymentHistory.pending,
        cancelPayments.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllPayments.rejected,
        getPaymentInfo.pending,
        createPayment.rejected,
        getPaymentHistory.rejected,
        cancelPayments.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(createPayment.fulfilled, cancelPayments.fulfilled), (state, action) => {
      state.paymentInfo = null;
      state.isLoading = false;
      state.isError = false;
    });
  },
});
