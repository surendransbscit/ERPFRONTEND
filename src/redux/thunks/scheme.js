import { createAsyncThunk } from "@reduxjs/toolkit";
import schemeAPI from "../api/schemeAPI";
import { DispatchErrorHandler } from "../configs";
import { toastfunc } from "../../components/sds-toast-style/toast-style";

//Scheme Class
export const createSchemeClass = createAsyncThunk(
  "schemeClassReducer/createSchemeClass",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.schemeClassification.createSchemeClass(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllSchemeClass = createAsyncThunk(
  "schemeClassReducer/getAllSchemeClass",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.schemeClassification.getAllSchemeClass(
        payload?.page,
        payload?.records,
        payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSchemeClassById = createAsyncThunk(
  "schemeClassReducer/getSchemeClassById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.schemeClassification.getSchemeClassByID(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSchemeClassById = createAsyncThunk(
  "schemeClassReducer/updateSchemeClassById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await schemeAPI.schemeClassification.updateSchemeClassByID(
          payload?.id,
          payload?.putData
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveSchemeClass = createAsyncThunk(
  "schemeClassReducer/getActiveSchemeClass",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await schemeAPI.schemeClassification.getActiveSchemeClass(
          payload?.page
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteSchemeClassById = createAsyncThunk(
  "schemeClassReducer/deleteSchemeClassById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await schemeAPI.schemeClassification.deleteSchemeClassByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSchemeClassStatus = createAsyncThunk(
  "schemeClassReducer/updateSchemeStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await schemeAPI.schemeClassification.changeSchemeClassScheme(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Payment Formula
export const getAllPaymentFormula = createAsyncThunk(
  "paymentFormulaReducer/getAllPaymentFormula",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.paymentFormula.getAllPaymentFormula();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Scheme
export const createScheme = createAsyncThunk(
  "schemesReducer/createScheme",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.scheme.createScheme(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllScheme = createAsyncThunk(
  "schemesReducer/getAllScheme",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.scheme.getAllScheme(
        payload?.page,
        payload?.records,
        payload?.search,
        payload?.path_name
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllActiveScheme = createAsyncThunk(
  "schemesReducer/getAllActiveScheme",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.scheme.getAllActiveScheme();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllCustomerMultiScheme = createAsyncThunk(
  "schemesReducer/getAllCustomerMultiScheme",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.scheme.getAllCustomerMultiScheme(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveScheme = createAsyncThunk(
  "schemesReducer/getActiveScheme",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.scheme.getActiveScheme(
        payload?.page,
        payload?.records,
        payload?.search
      );
      return response?.data.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCustomerAccount = createAsyncThunk(
  "schemeAccountReducer/getCustomerAccount",
  async (payload = {}, { rejectWithValue }) => {
    try {
      console.log(payload);
      const response = await schemeAPI.schemeAccount.getCustomerAccount(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSchemeById = createAsyncThunk(
  "schemesReducer/getSchemeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.scheme.getSchemeByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSchemeById = createAsyncThunk(
  "schemesReducer/updateSchemeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.scheme.updateSchemeByID(
        payload?.id,
        payload?.putData
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteSchemeById = createAsyncThunk(
  "schemesReducer/deleteSchemeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.scheme.deleteSchemeByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSchemeStatus = createAsyncThunk(
  "schemesReducer/updateSchemeStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.scheme.changeStatusScheme(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Scheme Account
export const createSchemeAccount = createAsyncThunk(
  "schemeAccountReducer/createSchemeAccount",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.schemeAccount.createSchemeAccount(
        payload
      );
      console.log(response.data);

      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllSchemeAccount = createAsyncThunk(
  "schemeAccountReducer/getAllSchemeAccount",
  async (payload = {}, { rejectWithValue }) => {
    try {
      console.log(payload);

      const response = await schemeAPI.schemeAccount.getAllSchemeAccount(
        payload?.page,
        payload?.records,
        payload?.branch,
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

export const getSchemeAccountById = createAsyncThunk(
  "schemeAccountReducer/getSchemeAccountById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.schemeAccount.getSchemeAccountByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSchemeAccountById = createAsyncThunk(
  "schemeAccountReducer/updateSchemeAccountById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.schemeAccount.updateSchemeAccountByID(
        payload?.id,
        payload?.putData
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteSchemeAccountById = createAsyncThunk(
  "schemeAccountReducer/deleteSchemeAccountById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await schemeAPI.schemeAccount.deleteSchemeAccountByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//scheme account close

export const getAllClosedSchemeAccount = createAsyncThunk(
  "schemeAccountReducer/getAllClosedSchemeAccount",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await schemeAPI.schemeAccountClose.getAllClosedSchemeAccount(
          payload?.page,
          payload?.records,
          payload?.branch,
          payload?.fromDate,
          payload?.toDate,
          payload?.search
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const schemeAccountCloseById = createAsyncThunk(
  "schemeAccountReducer/schemeAccountCloseById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await schemeAPI.schemeAccountClose.SchemeAccountCloseByID(
          payload?.id,
          payload?.putData
        );
      return response?.data || null;
    } catch (error) {
      if (
        error?.response?.data?.message !== undefined &&
        error?.response?.data?.message?.includes("already")
      ) {
        // toastfunc(error?.response?.data?.message);
        payload?.setOtpModal(true);
      }
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const schemeAccountCloseRevertById = createAsyncThunk(
  "schemeAccountReducer/schemeAccountCloseRevertById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await schemeAPI.schemeAccountClose.schemeAccountCloseRevertById(
          payload?.id,
          payload?.putData
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
