import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import reportsAPI from "../api/reportsApi";

export const getChitCustomerReport = createAsyncThunk(
  "reportReducer/getChitCustomerReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      // let postData = { "year":payload};
      const response = await reportsAPI.scheme_reports.getChitCustomerReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getMonthWiseSchemeJoin = createAsyncThunk(
  "reportReducer/getMonthWiseSchemeJoin",
  async (payload = {}, { rejectWithValue }) => {
    try {
      // let postData = { "year":payload};
      const response = await reportsAPI.scheme_reports.getMonthWiseSchemeJoin(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getMonthWiseSchemeCollection = createAsyncThunk(
  "reportReducer/getMonthWiseSchemeCollection",
  async (payload = {}, { rejectWithValue }) => {
    try {
      // let postData = { "year":payload};
      const response = await reportsAPI.scheme_reports.getMonthWiseSchemeCollection(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getSchemeAbstract = createAsyncThunk(
  "reportReducer/getSchemeAbstract",
  async (payload = {}, { rejectWithValue }) => {
    try {
      let postData = { id_branch: payload.id_branch, from_date: payload.from_date, to_date: payload.to_date, id_scheme: "" };
      const response = await reportsAPI.scheme_reports.getSchemeAbstract(postData);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getUnpaidReport = createAsyncThunk(
  "reportReducer/getUnpaidReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.scheme_reports.getUnpaidReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getCustomerOutstandingReport = createAsyncThunk(
  "reportReducer/getCustomerOutstandingReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.scheme_reports.getCustomerOutstandingReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getModeWiseCollectionReport = createAsyncThunk(
  "reportReducer/getModeWiseCollectionReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.scheme_reports.getModeWiseCollectionReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getClosedAccountReport = createAsyncThunk(
  "reportReducer/getClosedAccountReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.scheme_reports.getClosedAccountReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getSchemeWiseOpeningReport = createAsyncThunk(
  "reportReducer/getSchemeWiseOpeningReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.scheme_reports.getSchemeWiseOpeningReport({
        from_date: payload?.fromDate,
        to_date: payload?.toDate,
        id_scheme: payload?.id_scheme,
      });
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockReport = createAsyncThunk(
  "reportReducer/getStockReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getStockReport(payload?.page, payload?.records,payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockTrasferReport = createAsyncThunk(
  "reportReducer/getStockTrasferReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getStockTrasferReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockInAndOutReport = createAsyncThunk(
  "reportReducer/getStockInAndOutReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getStockInAndOutReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSalesReport = createAsyncThunk(
  "reportReducer/getSalesReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getSalesReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseReport = createAsyncThunk(
  "reportReducer/getPurchaseReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getPurchaseReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockAuditReport = createAsyncThunk(
  "reportReducer/getStockAuditReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getStockAuditReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockAuditDetailReport = createAsyncThunk(
  "reportReducer/getStockAuditDetailReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getStockAuditDetailReport(
        payload?.page,
        payload?.records,
        payload
        ,payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getB2bReport = createAsyncThunk(
  "reportReducer/getB2bReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getB2bReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getCashAbstractReport = createAsyncThunk(
  "reportReducer/getCashAbstractReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getCashAbstractReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAdvanceReport = createAsyncThunk(
  "reportReducer/getAdvanceReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getAdvanceReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCreditInvoiceReportReport = createAsyncThunk(
  "reportReducer/getCreditInvoiceReportReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getCreditInvoiceReportReport(
        payload?.page,
        payload?.records,
        payload
        ,payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getCreditCollectionReportReport = createAsyncThunk(
  "reportReducer/getCreditCollectionReportReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getCreditCollectionReportReport(
        payload?.page,
        payload?.records,
        payload
        ,payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getReorderReportReport = createAsyncThunk(
  "reportReducer/getReorderReportReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getReorderReportReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getAdvanceAdjReport = createAsyncThunk(
  "reportReducer/getAdvanceAdjReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getAdvanceAdjReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getChitAdjReport = createAsyncThunk(
  "reportReducer/getChitAdjReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getChitAdjReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getAdvanceRefundReport = createAsyncThunk(
  "reportReducer/getAdvanceRefundReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getAdvanceRefundReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getSalesReturnReport = createAsyncThunk(
  "reportReducer/getSalesReturnReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getSalesReturnReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCreditPendingReport = createAsyncThunk(
  "reportReducer/getCreditPendingReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getCreditPendingReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPettyCashReport = createAsyncThunk(
  "reportReducer/getPettyCashReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getPettyCashReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getEmployeeSalesReport = createAsyncThunk(
  "reportReducer/getEmployeeSalesReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getEmployeeSalesReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCreditIssuePendingReport = createAsyncThunk(
  "reportReducer/getCreditIssuePendingReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getCreditIssuePendingReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getPartlySalesReport = createAsyncThunk(
  "reportReducer/getPartlySalesReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getPartlySalesReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSupplierWiseSalesReport = createAsyncThunk(
  "reportReducer/getSupplierWiseSalesReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getSupplierWiseSalesReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getTagWiseProfitReport = createAsyncThunk(
  "reportReducer/getTagWiseProfitReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getTagWiseProfitReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCancelBillsReport = createAsyncThunk(
  "reportReducer/getCancelBillsReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getCancelBillsReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDiscountBillsReport = createAsyncThunk(
  "reportReducer/getDiscountBillsReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getDiscountBillsReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getPanBillsReport = createAsyncThunk(
  "reportReducer/getPanBillsReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getPanBillsReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getBillWiseTransactionReport = createAsyncThunk(
  "reportReducer/getBillWiseTransactionReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getBillWiseTransactionReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getSalesAndSalesReturnGSTReport = createAsyncThunk(
  "reportReducer/getSalesAndSalesReturnGSTReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getSalesAndSalesReturnGSTReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSalesTargetReport = createAsyncThunk(
  "reportReducer/getSalesTargetReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getSalesTargetReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getJewelNotDeliveredReport = createAsyncThunk(
  "reportReducer/getJewelNotDeliveredReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getJewelNotDeliveredReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCreditTobeReport = createAsyncThunk(
  "reportReducer/getCreditTobeReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getCreditTobeReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getDailyAbstractReport = createAsyncThunk(
  "reportReducer/getDailyAbstractReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getDailyAbstractReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getMetalProcessReport = createAsyncThunk(
  "reportReducer/getMetalProcessReport",
  async (payload = {}, { rejectWithValue }) => {
    try {

      const response = await reportsAPI.retail_report.getMetalProcessReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOtherMetalStockInAndOutReport = createAsyncThunk(
  "reportReducer/getOtherMetalStockInAndOutReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getOtherMetalStockInAndOutReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getCashBookReport = createAsyncThunk(
  "reportReducer/getCashBookReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getCashBookReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSupplierLedgerReport = createAsyncThunk(
  "reportReducer/getSupplierLedgerReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getSupplierLedgerReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getEdaSalesReport = createAsyncThunk(
  "reportReducer/getEdaSalesReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getEdaSalesReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getEdaPurchaseReport = createAsyncThunk(
  "reportReducer/getEdaPurchaseReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getEdaPurchaseReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurchaseReturnReport = createAsyncThunk(
  "reportReducer/getPurchaseReturnReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getPurchaseReturnReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getTagDetailsReport = createAsyncThunk(
  "reportReducer/getTagDetailsReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getTagDetailsReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOtherMetalProfitLossReport = createAsyncThunk(
  "reportReducer/getOtherMetalProfitLossReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getOtherMetalProfitLossReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getBankStatementReport = createAsyncThunk(
  "reportReducer/getBankStatementReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getBankStatementReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getReOrderAvailabilityReport = createAsyncThunk(
  "reportReducer/getReOrderAvailabilityReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getReOrderAvailabilityReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAbove2LakhsBillsReport = createAsyncThunk(
  "reportReducer/getAbove2Lakhs",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getAbove2LakhsBillsReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getEmployeeIncentiveReport = createAsyncThunk(
  "reportReducer/getEmployeeIncentiveReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getEmployeeIncentiveReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//search history

export const getSearchCustomerHistory = createAsyncThunk(
  "reportReducer/getSearchCustomerHistory",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.search_history.getSearchCustomerHistory(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSearchSupplierHistory = createAsyncThunk(
  "reportReducer/getSearchSupplierHistory",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.search_history.getSearchSupplierHistory(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSearchTagHistory = createAsyncThunk(
  "reportReducer/getSearchTagHistory",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.search_history.getSearchTagHistory(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSuppliersLedgerReport = createAsyncThunk(
  "reportReducer/getSuppliersLedgerReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getSuppliersLedgerReport(payload?.page, payload?.records,payload, payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getWeightRangeWiseSaleReport = createAsyncThunk(
  "reportReducer/getWeightRangeWiseSaleReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getWeightRangeWiseSaleReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPaymentDevicesWiseReport = createAsyncThunk(
  "reportReducer/getPaymentDevicesWiseReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getPaymentDevicesWiseReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockAnalysisReport = createAsyncThunk(
  "reportReducer/getStockAnalysisReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getStockAnalysisReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSupplierCatalogReport = createAsyncThunk(
  "reportReducer/getSupplierCatalogReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getSupplierCatalogReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDailyCashBookReport = createAsyncThunk(
  "reportReducer/getDailyCashBookReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getDailyCashBookReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getMonthWiseSalesReport = createAsyncThunk(
  "reportReducer/getMonthWiseSalesReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getMonthWiseSalesReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getMonthWisePurchaseEntryReport = createAsyncThunk(
  "reportReducer/getMonthWisePurchaseEntryReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getMonthWisePurchaseEntryReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCustomerJewelNotDeliveredReport = createAsyncThunk(
  "reportReducer/getCustomerJewelNotDeliveredReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getCustomerJewelNotDeliveredReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOtherInventoryItemLogReport = createAsyncThunk(
  "reportReducer/getOtherInventoryItemLogReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getOtherInventoryItemLogReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOtherInventoryItemPurchaseReport = createAsyncThunk(
  "reportReducer/getOtherInventoryItemPurchaseReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getOtherInventoryItemPurchaseReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOtherInventoryItemIssueReport = createAsyncThunk(
  "reportReducer/getOtherInventoryItemIssueReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getOtherInventoryItemIssueReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockInwardReport = createAsyncThunk(
  "reportReducer/getStockInwardReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getStockInwardReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLotReport = createAsyncThunk(
  "reportReducer/getLotReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getLotReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getLotBalanceReport = createAsyncThunk(
  "reportReducer/getLotBalanceReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getLotBalanceReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getBillViewReport = createAsyncThunk(
  "reportReducer/getBillViewReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getBillViewReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getVoucherIssueReport = createAsyncThunk(
  "reportReducer/getVoucherIssueReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getVoucherIssueReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDigiGoldReport = createAsyncThunk(
  "reportReducer/getDigiGoldReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getDigiGoldReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAccountWiseDigiGoldReport = createAsyncThunk(
  "reportReducer/getAccountWiseDigiGoldReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getAccountWiseDigiGoldReport(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockAuditDetailReportPrint = createAsyncThunk(
  "reportReducer/getStockAuditDetailReportPrint",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getStockAuditDetailReportPrint(
        payload?.page,
        payload?.records,
        payload
        ,payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getEstimateReport = createAsyncThunk(
  "reportReducer/getEstimateReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getEstimateReport(
        payload?.page,
        payload?.records,
        payload
        ,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getStockApprovalPendingReport = createAsyncThunk(
  "reportReducer/getStockApprovalPendingReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getStockApprovalPendingReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLiablitySupplierPaymentReport = createAsyncThunk(
  "reportReducer/getLiablitySupplierPaymentReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getLiablitySupplierPaymentReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getPurchasePaymentSummaryReport = createAsyncThunk(
  "reportReducer/getPurchasePaymentSummaryReport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getPurchasePaymentSummaryReport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getareawisesalesreport = createAsyncThunk(
  "reportReducer/getareawisesalesreport",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.retail_report.getareawisesalesreport(payload?.page, payload?.records, payload,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);