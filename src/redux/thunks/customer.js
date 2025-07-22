import { createAsyncThunk } from "@reduxjs/toolkit";
import customerAPI from "../api/customerAPI";
import { DispatchErrorHandler } from "../configs";

//customer

export const createCustomer = createAsyncThunk(
  "customerReducer/createCustomer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await customerAPI.customer.createCustomer(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const searchCustomer = createAsyncThunk(
  "customerReducer/searchCustomer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await customerAPI.customer.searchCustomer(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllCustomer = createAsyncThunk(
  "customerReducer/getAllCustomer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await customerAPI.customer.getAllCustomer(payload?.page, payload?.branch, payload?.records, payload?.search, payload?.path_name);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCustomerById = createAsyncThunk(
  "customerReducer/getCustomerById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await customerAPI.customer.getCustomerByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateCustomerById = createAsyncThunk(
  "customerReducer/updateCustomerById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await customerAPI.customer.updateCustomerByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteCustomerById = createAsyncThunk(
  "customerReducer/deleteCustomerById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await customerAPI.customer.deleteCustomerByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateCustomerStatus = createAsyncThunk(
  "customerReducer/updateCustomerStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await customerAPI.customer.changeStatusCustomer(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllApprovalCustomer = createAsyncThunk(
  "customerReducer/getAllApprovalCustomer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await customerAPI.customer.getAllApprovalCustomer();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createApprovalCustomer = createAsyncThunk(
  "customerReducer/createApprovalCustomer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await customerAPI.customer.createApprovalCustomer(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveCustomers = createAsyncThunk(
  "customerReducer/getActiveCustomers",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await customerAPI.customer.getActiveCustomers();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);