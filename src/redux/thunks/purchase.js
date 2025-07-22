import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";
import purchaseAPI from "../api/purchaseAPI";

//Purchase entry
export const createPurchaseEntry = createAsyncThunk(
  "purchaseReducer/createPurchaseEntry",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.createPurchaseEntry(payload);
      console.log(response.data);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseEntryById = createAsyncThunk(
  "purchaseReducer/getPurchaseEntryById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.getPurchaseEntryById(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updatePurchaseEntry = createAsyncThunk(
  "purchaseReducer/updatePurchaseEntry",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.updatePurchaseEntry(
        payload?.id,
        payload?.putData
      );
      console.log(response.data);
      toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseDetailsList = createAsyncThunk(
  "purchaseReducer/getPurchaseDetailsList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      console.log(payload);
      const response = await purchaseAPI.purchase.getPurchaseDetailsList(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseEntryItemDetails = createAsyncThunk(
  "purchaseReducer/getPurchaseEntryItemDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.getPurchaseEntryItemDetails(
        payload.id_branch,
        payload.fin_id,
        payload.po_no,
        payload.issue_type
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deletePurchaseItemByID = createAsyncThunk(
  "purchaseReducer/deletePurchaseItemByID",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.deletePurchaseItemByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createPurchaseIssueRecipt = createAsyncThunk(
  "purchaseIssueReceiptReducer/createPurchaseIssueRecipt",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.issueReceipt.createPurchaseIssueRecipt(
        payload
      );
      console.log(response.data);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseIssueReciptItemDetails = createAsyncThunk(
  "purchaseIssueReceiptReducer/getPurchaseIssueReciptItemDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await purchaseAPI.issueReceipt.getPurchaseIssueReciptItemDetails(
          payload.issueNo,
          payload.issue_type
        );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updatePurchaseIssueRecipt = createAsyncThunk(
  "purchaseIssueReceiptReducer/updatePurchaseIssueRecipt",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.issueReceipt.updatePurchaseIssueRecipt(
        payload.id,
        payload
      );
      console.log(response.data);
      toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseIssueReciptList = createAsyncThunk(
  "purchaseIssueReceiptReducer/getPurchaseIssueReciptList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await purchaseAPI.issueReceipt.getPurchaseIssueReciptList(
          // payload.issueNo,
          // payload.issue_type,
          payload)
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseDetails = createAsyncThunk(
  "purchaseReducer/getPurchaseDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.getPurchaseDetails(
        payload.id_branch,
        payload.fin_id,
        payload.po_no,
        payload.issue_type
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const generateLotWithPo = createAsyncThunk(
  "purchaseReducer/generateLotWithPo",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.generateLotWithPo(payload);
      console.log(response.data);
      toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updatePurchaseEntryStatus = createAsyncThunk(
  "purchaseReducer/updatePurchaseEntryStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.updatePurchaseEntryStatus(
        payload?.id
      );
      toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const cancelPurchaseEntry = createAsyncThunk(
  "purchaseReducer/cancelPurchaseEntry",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.cancelPurchaseEntry(payload);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const cancelPurchaseIssueRecipt = createAsyncThunk(
  "purchaseIssueReceiptReducer/cancelPurchaseIssueRecipt",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.issueReceipt.cancelPurchaseIssueRecipt(
        payload
      );
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchasePayments = createAsyncThunk(
  "purchaseReducer/getPurchasePayments",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.getPurchasePayments(
        payload.karigar, payload.metal, payload.billSettingType
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseMetalAdvance = createAsyncThunk(
  "purchaseReducer/getPurchaseMetalAdvance",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.getPurchaseMetalAdvance(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const createPurchasePayment = createAsyncThunk(
  "purchaseReducer/createPurchasePayment",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.createPurchasePayment(
        payload
      );
      // console.log(response.data);
      toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getStockDetails = createAsyncThunk(
  "purchaseReducer/getStockDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.getStockDetails(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updatePendingTransfer = createAsyncThunk(
  "purchaseReducer/updatePendingTransfer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.updatePendingTransfer(
        payload
      );
      // console.log(response.data);
      toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createMetalIssue = createAsyncThunk(
  "purchaseReducer/createMetalIssue",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.createMetalIssue(payload);
      console.log(response.data);
      toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getMetalIssueList = createAsyncThunk(
  "purchaseReducer/getMetalIssueList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.getMetalIssueList(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createSupplierPayment = createAsyncThunk(
  "purchaseReducer/createSupplierPayment",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.createSupplierPayment(
        payload
      );
      // console.log(response.data);
      toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSupplierPayments = createAsyncThunk(
  "purchaseReducer/getSupplierPayments",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.getSupplierPayments(
        payload.karigar,payload.metal,payload.billSettingType
      );
      console.log(payload,"payload");
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Purchase return
export const createPurchaseReturnEntry = createAsyncThunk(
  "purchaseReturnReducer/createPurchaseReturnEntry",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.createPurchaseReturnEntry(
        payload
      );
      console.log(response.data);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseReturnList = createAsyncThunk(
  "purchaseReturnReducer/getPurchaseReturnList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      console.log(payload);
      const response = await purchaseAPI.purchase.getPurchaseReturnList(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseReturnById = createAsyncThunk(
  "purchaseReturnReducer/getPurchaseReturnById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      // console.log(payload);
      const response = await purchaseAPI.purchase.getPurchaseReturnById(
        payload?.id
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updatePurchaseReturnById = createAsyncThunk(
  "purchaseReturnReducer/updatePurchaseReturnById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      // console.log(payload);
      const response = await purchaseAPI.purchase.updatePurchaseReturnById(
        payload?.id,
        payload?.content
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updatePurchaseReturnStatus = createAsyncThunk(
  "purchaseReducer/updatePurchaseReturnStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.updatePurchaseReturnStatus(
        payload?.id
      );
      toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const cancelPurchaseReturn = createAsyncThunk(
  "purchaseReturnReducer/cancelPurchaseReturn",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.cancelPurchaseReturn(payload);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseEntryByRefNo = createAsyncThunk(
  "purchaseReducer/getPurchaseEntryByRefNo",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.getPurchaseEntryByRefNo(
        payload.id_branch,
        payload.fin_id,
        payload.po_no,
        payload.billSettingType
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSupplierOpeningDetails = createAsyncThunk(
  "purchaseReducer/getSupplierOpeningDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.getSupplierOpeningDetails(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseCashAdvance = createAsyncThunk(
  "purchaseReducer/getPurchaseCashAdvance",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.getPurchaseCashAdvance(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getSupplierPaymentList = createAsyncThunk(
  "purchaseReducer/getSupplierPaymentList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseAPI.purchase.getSupplierPaymentList(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);