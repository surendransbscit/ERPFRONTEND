import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import { toastfunc, toastsuccess } from "../../components/sds-toast-style/toast-style";
import importExportAPI from "../api/importExportAPI";

export const importData = createAsyncThunk(
  "importReducer/importData",
  async (payload = {}, { rejectWithValue }) => {
    try {
      let response = "";
      if (payload?.actionType === 1) {
        response = await importExportAPI.import.importCustomer(payload);
      }
      if (payload?.actionType === 2) {
        response = await importExportAPI.import.importMetalProductCategory(payload);
      }
      if (payload?.actionType === 3) {
        response = await importExportAPI.import.importTag(payload);
      }
      if (payload?.actionType === 4) {
        response = await importExportAPI.import.importEmployee(payload);
      }
      if (payload?.actionType === 5) {
        response = await importExportAPI.import.importTagStatus(payload);
      }
      if (payload?.actionType === 6) {
        response = await importExportAPI.import.importSchemeAccounts(payload);
      }
      // console.log(response.data);
      toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      console.log(error?.response?.data?.error);
      toastfunc(error?.response?.data?.error)
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
