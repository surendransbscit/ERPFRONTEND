import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createApprovalCustomer,
  createCustomer,
  deleteCustomerById,
  getActiveCustomers,
  getAllApprovalCustomer,
  getAllCustomer,
  getCustomerById,
  searchCustomer,
  updateCustomerById,
  updateCustomerStatus,
} from "../thunks/customer";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";

//customer

export const customerReducerInitialState = {
  customerList: [],
  approvalCustomerList: null,
  customerActiveList:[],
  searchCustomerList: [],
  customerInfo: null,
  createCustomerData : null,
  isError: false,
  isLoading: false,
};

export const customerReducer = createSlice({
  name: "customerReducer",
  initialState: customerReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCustomer.fulfilled, (state, action) => {
      state.customerList = action.payload;
      state.customerInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getAllApprovalCustomer.fulfilled, (state, action) => {
      state.approvalCustomerList = action.payload;
      state.customerInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActiveCustomers.fulfilled, (state, action) => {
      state.customerActiveList = action.payload;
      state.customerInfo = null;
      state.isLoading = false;
    });
    builder.addCase(searchCustomer.fulfilled, (state, action) => {
      state.searchCustomerList = action.payload;
      state.customerInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCustomerById.fulfilled, (state, action) => {
      state.customerInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(createCustomer.fulfilled, (state, action) => {
      state.createCustomerData = action.payload;
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(deleteCustomerById.fulfilled, (state, action) => {
      toastsuccess("Customer Deleted Successfully");
      state.customerInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateCustomerStatus.fulfilled, (state, action) => {
      toastsuccess("Customer Status changed Successfully");
      state.customerInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllCustomer.pending,
        getCustomerById.pending,
        createCustomer.pending,
        updateCustomerById.pending,
        deleteCustomerById.pending,
        searchCustomer.pending,
        updateCustomerStatus.pending,
        getAllApprovalCustomer.pending,
        createApprovalCustomer.pending,
        getActiveCustomers.pending
      ),
      (state) => {
        state.isLoading = true;
        state.isError = false;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCustomer.rejected,
        getCustomerById.rejected,
        createCustomer.rejected,
        updateCustomerById.rejected,
        deleteCustomerById.rejected,
        searchCustomer.rejected,
        updateCustomerStatus.rejected,
        getAllApprovalCustomer.rejected,
        createApprovalCustomer.rejected,
        getActiveCustomers.rejected
      ),
      (state, action) => {
        state.searchCustomerList = []
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(updateCustomerById.fulfilled, updateCustomerStatus.fulfilled, createApprovalCustomer.fulfilled),
      (state) => {
        state.customerInfo = null;
        state.createCustomerData = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});
