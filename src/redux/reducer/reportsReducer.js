import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getClosedAccountReport,
  getCustomerOutstandingReport,
  getModeWiseCollectionReport,
  getSchemeAbstract,
  getSchemeWiseOpeningReport,
  getUnpaidReport,
  getStockReport,
  getStockTrasferReport,
  getStockInAndOutReport,
  getSalesReport,
  getPurchaseReport,
  getCashAbstractReport,
  getStockAuditReport,
  getStockAuditDetailReport,
  getB2bReport,
  getAdvanceReport,
  getCreditInvoiceReportReport,
  getCreditCollectionReportReport,
  getReorderReportReport,
  getAdvanceRefundReport,
  getChitAdjReport,
  getAdvanceAdjReport,
  getMonthWiseSchemeJoin,
  getSalesReturnReport,
  getCreditPendingReport,
  getEmployeeSalesReport,
  getCreditIssuePendingReport,
  getChitCustomerReport,
  getPettyCashReport,
  getMonthWiseSchemeCollection,
  getPartlySalesReport,
  getSupplierWiseSalesReport,
  getTagWiseProfitReport,
  getCancelBillsReport,
  getDiscountBillsReport,
  getBillWiseTransactionReport,
  getSalesAndSalesReturnGSTReport,
  getPanBillsReport,
  getSalesTargetReport,
  getCreditTobeReport,
  getJewelNotDeliveredReport,
  getDailyAbstractReport,
  getMetalProcessReport,
  getOtherMetalStockInAndOutReport,
  getCashBookReport,
  getSupplierLedgerReport,
  getOtherMetalProfitLossReport,
  getEdaPurchaseReport,
  getEdaSalesReport,
  getBankStatementReport,
  getReOrderAvailabilityReport,
  getAbove2LakhsBillsReport,
  getEmployeeIncentiveReport,
  getSearchCustomerHistory,
  getSearchSupplierHistory,
  getSearchTagHistory,
  getSuppliersLedgerReport,
  getWeightRangeWiseSaleReport,
  getPaymentDevicesWiseReport,
  getPurchaseReturnReport,
  getStockAnalysisReport,
  getTagDetailsReport,
  getSupplierCatalogReport,
  getDailyCashBookReport,
  getMonthWiseSalesReport,
  getCustomerJewelNotDeliveredReport,
  getStockInwardReport,
  getLotReport,
  getOtherInventoryItemLogReport,
  getOtherInventoryItemPurchaseReport,
  getOtherInventoryItemIssueReport,
  getMonthWisePurchaseEntryReport,
  getBillViewReport,
  getVoucherIssueReport,
  getDigiGoldReport,
  getCustomerWiseDigiGoldReport,
  getStockAuditDetailReportPrint,
  getAccountWiseDigiGoldReport,
  getEstimateReport,
  getLotBalanceReport,
  getStockApprovalPendingReport,
  getLiablitySupplierPaymentReport,
  getPurchasePaymentSummaryReport,
  getareawisesalesreport,
} from "../thunks/reports";
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import BillViewReport from "../../pages/reports/BillViewReport";

export const reportReducerInitialState = {
  schemeAbstractReportList: [],
  monthWiseSchemeJoinList: [],
  monthWiseSchemeCollectionList: [],
  chitCustomerList: [],
  schemeWiseOpeningReportList: [],
  unpaidReportList: [],
  customerOutstandingReportList: [],
  modeWiseCollectionReportList: [],
  closedAccountReportList: [],
  stockInAndOutReportList: [],
  stockReportList: [],
  salesReportList: [],
  purchaseReportList: [],
  stockTransferReportList: [],
  cashAbstractReportList: [],
  StockAuditReportList: [],
  StockAuditDetailsReportList: [],
  advanceReportList: [],
  creditInvoiceReportList: [],
  creditCollectionReportList: [],
  B2bReportList: [],
  reorderReportList: [],
  advAdjReportList: [],
  chitAdjReportList: [],
  advRefundReportList: [],
  employeeSalesReportList: [],
  creditIssuePendingReportList: [],
  pettyCashReportList: [],
  creditPendingReportList: [],
  salesReturnReportList: [],
  partlySalesReportList: [],
  supplierSalesReportList: [],
  tagWiseSalesProfitReportList: [],
  cancelBillReportList: [],
  discountBillReportList: [],
  panBillsReportList: [],
  billWiseTransationReportList: [],
  salesAndSalesReturnReportList: [],
  salesTargetReportList: [],
  creditTobeReportList: [],
  jewelNotDeliveredReportList: [],
  customerJewelNotDeliveredReportList: [],
  otherInventoryItemLogReportList: [],
  otherInventoryItemPurchaseReportList: [],
  otherInventoryItemIssueReportList: [],
  voucherIssueReportList:[],
  dailyAbstractReportList: [],
  metalProcessReportList: [],
  otherMetalStockInAndOutReportList: [],
  cashBookList: [],
  edaSaleList: [],
  edaPurchaseList: [],
  purchaseReturnList: [],
  tagDetailsList: [],
  otherMetalProfitLossList: [],
  bankStatementList: [],
  reOrderAvailabilityReportList: [],
  above2lakhsBillList: [],
  incentiveReportList: [],
  suppliersLedgerReportList: [],
  weightRangeSalesReportList: [],
  paymentDevicesWiseReport: [],
  paymentStockAnalysisReport: [],
  stockInwardReport: [],
  lotReport: [],
  lotBalanceReportList: [],
  billViewReport: [],
  stockAuditDetailReportPrint: [],
  estimateReportList: [],
  stockApprovalPendingReportList: [],
  liablitySupplierPaymentReportList: [],
  purchasePaymentSummaryList : [],
  getareawisesalesreportList: [],
  suppliercatalogReport: null,
  searchCustomerHistoryList: null,
  searchSupplierHistoryList: null,
  searchTagHistoryList: null,
  supplierLedgerList: null,
  dailyCashBookReport: null,
  monthWiseSalesReport: null,
  monthWisePurchaseEntryReport: null,
  digiGoldReportList: null,
  accountWiseDigiGoldReportList: null,
  reportInfo: null,
  isError: null,
  isLoading: false,
};

export const reportReducer = createSlice({
  name: "reportReducer",
  initialState: reportReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCashBookReport.fulfilled, (state, action) => {
      console.log(action.payload, "PAYLOAD")
      state.cashBookList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getBillViewReport.fulfilled, (state, action) => {
      console.log(action.payload, "PAYLOAD")
      state.billViewReport = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getPaymentDevicesWiseReport.fulfilled, (state, action) => {
      console.log(action.payload, "PAYLOAD")
      state.paymentDevicesWiseReport = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getEstimateReport.fulfilled, (state, action) => {
      console.log(action.payload, "PAYLOAD")
      state.estimateReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getLotReport.fulfilled, (state, action) => {
      console.log(action.payload, "PAYLOAD")
      state.lotReport = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getLotBalanceReport.fulfilled, (state, action) => {
      state.lotBalanceReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getStockAuditDetailReportPrint.fulfilled, (state, action) => {
      console.log(action.payload, "PAYLOAD")
      state.stockAuditDetailReportPrint = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getStockInwardReport.fulfilled, (state, action) => {
      console.log(action.payload, "PAYLOAD")
      state.stockInwardReport = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getStockAnalysisReport.fulfilled, (state, action) => {
      console.log(action.payload, "PAYLOAD")
      state.paymentStockAnalysisReport = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getSupplierCatalogReport.fulfilled, (state, action) => {
      console.log(action.payload, "PAYLOAD")
      state.suppliercatalogReport = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getReOrderAvailabilityReport.fulfilled, (state, action) => {
      console.log(action.payload, "PAYLOAD")
      state.reOrderAvailabilityReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getWeightRangeWiseSaleReport.fulfilled, (state, action) => {
      console.log(action.payload, "PAYLOAD")
      state.weightRangeSalesReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getAbove2LakhsBillsReport.fulfilled, (state, action) => {
      console.log(action.payload, "PAYLOAD")
      state.above2lakhsBillList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getSupplierLedgerReport.fulfilled, (state, action) => {
      console.log(action.payload, "PAYLOAD")
      state.supplierLedgerList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCashAbstractReport.fulfilled, (state, action) => {
      state.cashAbstractReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getJewelNotDeliveredReport.fulfilled, (state, action) => {
      state.jewelNotDeliveredReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCustomerJewelNotDeliveredReport.fulfilled, (state, action) => {
      state.customerJewelNotDeliveredReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getOtherInventoryItemLogReport.fulfilled, (state, action) => {
      state.otherInventoryItemLogReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getOtherInventoryItemPurchaseReport.fulfilled, (state, action) => {
      state.otherInventoryItemPurchaseReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getOtherInventoryItemIssueReport.fulfilled, (state, action) => {
      state.otherInventoryItemIssueReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getVoucherIssueReport.fulfilled, (state, action) => {
      state.voucherIssueReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getDigiGoldReport.fulfilled, (state, action) => {
      state.digiGoldReportList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAccountWiseDigiGoldReport.fulfilled, (state, action) => {
      state.accountWiseDigiGoldReportList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getCreditTobeReport.fulfilled, (state, action) => {
      state.creditTobeReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getSchemeAbstract.fulfilled, (state, action) => {
      state.schemeAbstractReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getPurchaseReport.fulfilled, (state, action) => {
      state.purchaseReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getMonthWiseSchemeJoin.fulfilled, (state, action) => {
      state.monthWiseSchemeJoinList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getMonthWiseSchemeCollection.fulfilled, (state, action) => {
      state.monthWiseSchemeCollectionList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getChitCustomerReport.fulfilled, (state, action) => {
      state.chitCustomerList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getStockReport.fulfilled, (state, action) => {
      state.stockReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getSuppliersLedgerReport.fulfilled, (state, action) => {
      state.suppliersLedgerReportList = action.payload;
      if (action.payload?.message != undefined) {
        toastfunc(action.payload?.message)
      }
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getMetalProcessReport.fulfilled, (state, action) => {
      state.metalProcessReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getSchemeWiseOpeningReport.fulfilled, (state, action) => {
      state.schemeWiseOpeningReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getClosedAccountReport.fulfilled, (state, action) => {
      state.closedAccountReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getModeWiseCollectionReport.fulfilled, (state, action) => {
      state.modeWiseCollectionReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCustomerOutstandingReport.fulfilled, (state, action) => {
      state.customerOutstandingReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getUnpaidReport.fulfilled, (state, action) => {
      state.unpaidReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getStockTrasferReport.fulfilled, (state, action) => {
      state.stockTransferReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getStockInAndOutReport.fulfilled, (state, action) => {
      state.stockInAndOutReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getOtherMetalStockInAndOutReport.fulfilled, (state, action) => {
      state.otherMetalStockInAndOutReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getSalesReport.fulfilled, (state, action) => {
      state.salesReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getStockAuditReport.fulfilled, (state, action) => {
      state.StockAuditReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getStockAuditDetailReport.fulfilled, (state, action) => {
      state.StockAuditDetailsReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getB2bReport.fulfilled, (state, action) => {
      state.B2bReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCreditCollectionReportReport.fulfilled, (state, action) => {
      state.creditCollectionReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCreditInvoiceReportReport.fulfilled, (state, action) => {
      state.creditInvoiceReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getAdvanceReport.fulfilled, (state, action) => {
      state.advanceReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getReorderReportReport.fulfilled, (state, action) => {
      state.reorderReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getAdvanceRefundReport.fulfilled, (state, action) => {
      state.advRefundReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getAdvanceAdjReport.fulfilled, (state, action) => {
      state.advAdjReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getChitAdjReport.fulfilled, (state, action) => {
      state.chitAdjReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getEmployeeSalesReport.fulfilled, (state, action) => {
      state.employeeSalesReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getPettyCashReport.fulfilled, (state, action) => {
      state.pettyCashReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getCreditIssuePendingReport.fulfilled, (state, action) => {
      state.creditIssuePendingReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getCreditPendingReport.fulfilled, (state, action) => {
      state.creditPendingReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getSalesReturnReport.fulfilled, (state, action) => {
      state.salesReturnReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getPartlySalesReport.fulfilled, (state, action) => {
      state.partlySalesReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getSupplierWiseSalesReport.fulfilled, (state, action) => {
      state.supplierSalesReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getTagWiseProfitReport.fulfilled, (state, action) => {
      state.tagWiseSalesProfitReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getCancelBillsReport.fulfilled, (state, action) => {
      state.cancelBillReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getDiscountBillsReport.fulfilled, (state, action) => {
      state.discountBillReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getPanBillsReport.fulfilled, (state, action) => {
      state.panBillsReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getBillWiseTransactionReport.fulfilled, (state, action) => {
      state.billWiseTransationReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getSalesAndSalesReturnGSTReport.fulfilled, (state, action) => {
      state.salesAndSalesReturnReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getSalesTargetReport.fulfilled, (state, action) => {
      state.salesTargetReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getDailyAbstractReport.fulfilled, (state, action) => {
      state.dailyAbstractReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getOtherMetalProfitLossReport.fulfilled, (state, action) => {
      state.otherMetalProfitLossList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getEdaPurchaseReport.fulfilled, (state, action) => {
      state.edaPurchaseList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getPurchaseReturnReport.fulfilled, (state, action) => {
      state.purchaseReturnList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getTagDetailsReport.fulfilled, (state, action) => {
      state.tagDetailsList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getEdaSalesReport.fulfilled, (state, action) => {
      state.edaSaleList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getBankStatementReport.fulfilled, (state, action) => {
      state.bankStatementList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getEmployeeIncentiveReport.fulfilled, (state, action) => {
      state.incentiveReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getSearchCustomerHistory.fulfilled, (state, action) => {
      state.searchCustomerHistoryList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getSearchSupplierHistory.fulfilled, (state, action) => {
      state.searchSupplierHistoryList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getSearchTagHistory.fulfilled, (state, action) => {
      state.searchTagHistoryList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getDailyCashBookReport.fulfilled, (state, action) => {
      state.dailyCashBookReport = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getMonthWiseSalesReport.fulfilled, (state, action) => {
      state.monthWiseSalesReport = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getMonthWisePurchaseEntryReport.fulfilled, (state, action) => {
      state.monthWisePurchaseEntryReport = action.payload;
      state.isLoading = false;
    });

     builder.addCase(getStockApprovalPendingReport.fulfilled, (state, action) => {
      state.stockApprovalPendingReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

     builder.addCase(getLiablitySupplierPaymentReport.fulfilled, (state, action) => {
      state.liablitySupplierPaymentReportList = action.payload;
      state.reportInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getPurchasePaymentSummaryReport.fulfilled, (state, action) => {
      state.purchasePaymentSummaryList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getareawisesalesreport.fulfilled, (state, action) => {
      state.getareawisesalesreportList = action.payload;
      state.isLoading = false;
    });


    builder.addCase("getSearchCustomerHistory/reset", (state) => {
      state.searchCustomerHistoryList = null;
    });

    builder.addCase("getSearchSupplierHistory/reset", (state) => {
      state.searchSupplierHistoryList = null;
    });

    builder.addCase("getSearchTagHistory/reset", (state) => {
      state.searchTagHistoryList = null;
    });

    


    builder.addMatcher(
      isAnyOf(
        getBillViewReport.pending,
        getStockInwardReport.pending,
        getLotReport.pending,
        getLotBalanceReport.pending,
        getSchemeAbstract.pending,
        getSchemeWiseOpeningReport.pending,
        getClosedAccountReport.pending,
        getModeWiseCollectionReport.pending,
        getCustomerOutstandingReport.pending,
        getUnpaidReport.pending,
        getStockReport.pending,
        getStockTrasferReport.pending,
        getStockInAndOutReport.pending,
        getSalesReport.pending,
        getPurchaseReport.pending,
        getCashAbstractReport.pending,
        getStockAuditReport.pending,
        getStockAuditDetailReport.pending,
        getB2bReport.pending,
        getAdvanceReport.pending,
        getCreditCollectionReportReport.pending,
        getCreditInvoiceReportReport.pending,
        getReorderReportReport.pending,
        getAdvanceRefundReport.pending,
        getAdvanceAdjReport.pending,
        getChitAdjReport.pending,
        getMonthWiseSchemeJoin.pending,
        getSalesReturnReport.pending,
        getCreditPendingReport.pending,
        getCreditIssuePendingReport.pending,
        getPettyCashReport.pending,
        getEmployeeSalesReport.pending,
        getChitCustomerReport.pending,
        getMonthWiseSchemeCollection.pending,
        getPartlySalesReport.pending,
        getSupplierWiseSalesReport.pending,
        getTagWiseProfitReport.pending,
        getCancelBillsReport.pending,
        getDiscountBillsReport.pending,
        getBillWiseTransactionReport.pending,
        getSalesAndSalesReturnGSTReport.pending,
        getPanBillsReport.pending,
        getSalesTargetReport.pending,
        getCreditTobeReport.pending,
        getJewelNotDeliveredReport.pending,
        getCustomerJewelNotDeliveredReport.pending,
        getDailyAbstractReport.pending,
        getMetalProcessReport.pending,
        getCashAbstractReport.pending,
        getSupplierLedgerReport.pending,
        getOtherMetalProfitLossReport.pending,
        getEdaPurchaseReport.pending,
        getPurchaseReturnReport.pending,
        getEdaSalesReport.pending,
        getBankStatementReport.pending,
        getReOrderAvailabilityReport.pending,
        getAbove2LakhsBillsReport.pending,
        getEmployeeIncentiveReport.pending,
        getSearchCustomerHistory.pending,
        getSearchSupplierHistory.pending,
        getSearchTagHistory.pending,
        getWeightRangeWiseSaleReport.pending,
        getSuppliersLedgerReport.pending,
        getPaymentDevicesWiseReport.pending,
        getStockAnalysisReport.pending,
        getSupplierCatalogReport.pending,
        getMonthWiseSalesReport.pending,
        getMonthWisePurchaseEntryReport.pending,
        getOtherInventoryItemLogReport.pending,
        getOtherInventoryItemPurchaseReport.pending,
        getVoucherIssueReport.pending,
        getDigiGoldReport.pending,
        getStockAuditDetailReportPrint.pending,
        getAccountWiseDigiGoldReport.pending,
        getStockApprovalPendingReport.pending,
        getLiablitySupplierPaymentReport.pending,
        getPurchasePaymentSummaryReport.pending,
        getareawisesalesreport.pending,
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getBillViewReport.rejected,
        getReOrderAvailabilityReport.rejected,
        getSchemeAbstract.rejected,
        getSchemeWiseOpeningReport.rejected,
        getClosedAccountReport.rejected,
        getModeWiseCollectionReport.rejected,
        getCustomerOutstandingReport.rejected,
        getUnpaidReport.rejected,
        getStockReport.rejected,
        getStockTrasferReport.rejected,
        getStockInAndOutReport.rejected,
        getSalesReport.rejected,
        getPurchaseReport.rejected,
        getCashAbstractReport.rejected,
        getStockAuditReport.rejected,
        getStockAuditDetailReport.rejected,
        getB2bReport.rejected,
        getAdvanceReport.rejected,
        getCreditCollectionReportReport.rejected,
        getCreditInvoiceReportReport.rejected,
        getReorderReportReport.rejected,
        getAdvanceRefundReport.rejected,
        getAdvanceAdjReport.rejected,
        getChitAdjReport.rejected,
        getMonthWiseSchemeJoin.rejected,
        getSalesReturnReport.rejected,
        getCreditPendingReport.rejected,
        getCreditIssuePendingReport.rejected,
        getPettyCashReport.rejected,
        getEmployeeSalesReport.rejected,
        getChitCustomerReport.rejected,
        getMonthWiseSchemeCollection.rejected,
        getPartlySalesReport.rejected,
        getSupplierWiseSalesReport.rejected,
        getTagWiseProfitReport.rejected,
        getCancelBillsReport.rejected,
        getDiscountBillsReport.rejected,
        getBillWiseTransactionReport.rejected,
        getSalesAndSalesReturnGSTReport.rejected,
        getPanBillsReport.rejected,
        getSalesTargetReport.rejected,
        getCreditTobeReport.rejected,
        getJewelNotDeliveredReport.rejected,
        getCustomerJewelNotDeliveredReport.rejected,
        getDailyAbstractReport.rejected,
        getMetalProcessReport.rejected,
        getCashAbstractReport.rejected,
        getSupplierLedgerReport.rejected,
        getOtherMetalProfitLossReport.rejected,
        getEdaPurchaseReport.rejected,
        getPurchaseReturnReport.rejected,
        getEdaSalesReport.rejected,
        getBankStatementReport.rejected,
        getAbove2LakhsBillsReport.rejected,
        getEmployeeIncentiveReport.rejected,
        getSearchCustomerHistory.rejected,
        getSearchSupplierHistory.rejected,
        getSearchTagHistory.rejected,
        getWeightRangeWiseSaleReport.rejected,
        getSuppliersLedgerReport.rejected,
        getPaymentDevicesWiseReport.rejected,
        getStockAnalysisReport.rejected,
        getSupplierCatalogReport.rejected,
        getMonthWiseSalesReport.rejected,
        getMonthWisePurchaseEntryReport.rejected,
        getStockInwardReport.rejected,
        getLotReport.rejected,
        getLotBalanceReport.rejected,
        getOtherInventoryItemLogReport.rejected,
        getOtherInventoryItemPurchaseReport.rejected,
        getVoucherIssueReport.rejected,
        getDigiGoldReport.rejected,
        getStockAuditDetailReportPrint.rejected,
        getAccountWiseDigiGoldReport.rejected,
        getStockApprovalPendingReport.rejected,
        getLiablitySupplierPaymentReport.rejected,
        getPurchasePaymentSummaryReport.rejected,
        getareawisesalesreport.rejected,
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
  },
});
