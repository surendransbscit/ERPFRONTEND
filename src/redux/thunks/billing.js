import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import {
  toastfunc,
  toastsuccess,
} from "../../components/sds-toast-style/toast-style";
import billingAPI from "../api/billingAPI";

//Billing
export const createInvoice = createAsyncThunk(
  "billingReducer/createInvoice",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.createInvoice(payload);
      console.log(response.data);
      toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createDiscountInvoice = createAsyncThunk(
  "billingReducer/createDiscountInvoice",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.createDiscountInvoice(payload);
      console.log(response.data);
      toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createIssueReceipt = createAsyncThunk(
  "receiptReducer/createIssueReceipt",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.receipt.createIssueReceipt(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getIssueReceiptList = createAsyncThunk(
  "receiptReducer/getIssueReceiptList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.receipt.getIssueReceiptList(
        payload?.page,
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const cancelIssueReceipt = createAsyncThunk(
  "receiptReducer/cancelIssueReceipt",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.receipt.cancelIssueReceipt(payload);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getIssueCreditList = createAsyncThunk(
  "receiptReducer/getIssueCreditList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.receipt.getIssueCreditList(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getIssueReceiptById = createAsyncThunk(
  "receiptReducer/getIssueReceiptById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.receipt.getIssueReceiptById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getBillingList = createAsyncThunk(
  "billingReducer/getBillingList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.getBillingList(
        payload?.page,
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const cancelInvoice = createAsyncThunk(
  "billingReducer/cancelInvoice",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.cancelInvoice(payload);
      if (
        response?.data?.message !== undefined &&
        response?.data?.message?.includes("Enter")
      ) {
        payload?.setOtpModal(true);
      }

      return response.data || null;
    } catch (error) {
      if (
        error?.response?.data?.message !== undefined &&
        error?.response?.data?.message?.includes("already")
      ) {
        // toastfunc(response?.data?.message)
        payload?.setOtpModal(true);
      }
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getReturnDetails = createAsyncThunk(
  "billingReducer/getReturnDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.getReturnDetails(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAdvanceDetails = createAsyncThunk(
  "billingReducer/getAdvanceDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.getAdvanceDetails(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDepositDetails = createAsyncThunk(
  "billingReducer/getDepositDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.getDepositDetails(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOrderDelivery = createAsyncThunk(
  "billingReducer/getOrderDelivery",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.getOrderDelivery(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getChitDetails = createAsyncThunk(
  "billingReducer/getChitDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.getChitDetails(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//bank settlement

export const createBankSettlementDetails = createAsyncThunk(
  "bankSettlementReducer/createBankSettlementDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await billingAPI.banksettlement.createBankSettlementDetails(payload);
     // toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getBankSettlementDetails = createAsyncThunk(
  "bankSettlementReducer/getBankSettlementDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.banksettlement.getBankSettlementDetails(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getBankSettlementList = createAsyncThunk(
  "bankSettlementReducer/getBankSettlementList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.banksettlement.getBankSettlementList(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getJewelNotDeliverList = createAsyncThunk(
  "billingReducer/getJewelNotDeliverList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.getJewelNotDeliverList(payload);
      console.log(response.data, "sdfsdfcasd");
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateJewelDelivered = createAsyncThunk(
  "billingReducer/updateJewelDelivered",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.updateJewelDelivered(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDiscountBillingList = createAsyncThunk(
  "billingReducer/getDiscountBillingList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.getDiscountBillingList(
        payload?.page,
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getBillDetails = createAsyncThunk(
  "billingReducer/getBillDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.getBillDetails(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Billing
export const updateInvoice = createAsyncThunk(
  "billingReducer/updateInvoice",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.updateInvoice(
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

export const getDeleteableInvoiceList = createAsyncThunk(
  "billingReducer/getDeleteableInvoiceList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.getDeleteableInvoiceList(
        payload
      );
      console.log(response.data, "sdfsdfcasd");
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDeleteableReceiptList = createAsyncThunk(
  "billingReducer/getDeleteableReceiptList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.receipt.getDeleteableReceiptList(
        payload
      );
      console.log(response.data, "sdfsdfcasd");
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteInvoiceList = createAsyncThunk(
  "billingReducer/deleteInvoiceList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.deleteInvoiceList(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteIssueReceiptList = createAsyncThunk(
  "billingReducer/deleteIssueReceiptList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.receipt.deleteIssueReceiptList(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const convertInvoiceList = createAsyncThunk(
  "billingReducer/convertInvoiceList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.convertInvoiceList(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "billingReducer/deleteTransaction",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.invoice.deleteTransaction(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//liablity entry

export const createLiablityEntry = createAsyncThunk(
  "liablityEntryReducer/createLiablityEntry",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.liablity_entry.createLiablityEntry(
        payload
      );
      toastsuccess(response.data.message);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLiablityEntry = createAsyncThunk(
  "liablityEntryReducer/getLiablityEntry",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.liablity_entry.getLiablityEntry(
        payload?.page,
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLiablityEntryPayment = createAsyncThunk(
  "liablityEntryReducer/getLiablityEntryPayment",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.liablity_entry.getLiablityEntryPayment(
        payload?.page,
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLiablityEntryPayable = createAsyncThunk(
  "liablityEntryReducer/getLiablityEntryPayable",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.liablity_entry.getLiablityEntryPayable(
        payload.karigar
      );
      // console.log(payload, "payload");
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createLiablityEntryPayment = createAsyncThunk(
  "liablityEntryReducer/createLiablityEntryPayment",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.liablity_entry.createLiablityEntryPayment(
        payload
      );
      // console.log(payload, "payload");
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCustomerSalesLogOptions = createAsyncThunk(
  "customerSalesLogReducer/getCustomerSalesLogOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.customer_sales_log.getCustomerSalesLogOptions(
      );
      // console.log(payload, "payload");
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const customerSalesLog = createAsyncThunk(
  "customerSalesLogReducer/customerSalesLog",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await billingAPI.customer_sales_log.customerSalesLog(
        payload
      );
      console.log("payload",payload);
      console.log(response.data,"response.data");
      
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error); 
      return rejectWithValue(error);
    }
  }
);

