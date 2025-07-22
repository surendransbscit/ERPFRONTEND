import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getCreditSales,
  getCreditSalesReport,
  getCustomerOrder,
  getCustomerVists,
  getCustomerVistsReports,
  getEstimation,
  getEstimationReport,
  getKarigarOrders,
  getLot,
  getLotReport,
  getPurchase,
  getPurchaseReport,
  getSales,
  getSalesReport,
  getSalesReturn,
  getSalesReturnReport,
  getStockApproval,
  getStoreStatistics,
  getSupplierPayment,
  getTopProduct,
  getKarigarReport,
  getCustomerOrderReport,
  getStockApprovalReport
} from "../thunks/retailDashboard";

export const retailDashboardReducerInitialState = {
  estimationDashList: [],
  customerVisitsDashList: [],
  salesDashList: [],
  stockApprovalDashList: [],
  karigarOrderList: [],
  customerOrderDashList: [],
  salesReturnDashList: [],
  purchaseDashList: [],
  lotDashList: [],
  creditSalesDashList: [],
  storeStatisticsDashList: [],
  topProductDashList: [],
  supplierPaymentList: [],
  estimationDashReportList :[],
  customerVisitsDashReportList: [],
  salesDashReportList: [],
  salesReturnDashReportList: [],
  purchaseDashReportList: [],
  lotDashReportList: [],
  creditSalesDashReportList: [],
  karigarReportList: [],
  customerOrderReportList: [],
  stockApprovalReportList: [],
  isError: null,
  isLoading: false,
};

export const retailDashboardReducer = createSlice({
  name: "retailDashboardReducer",
  initialState: retailDashboardReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEstimation.fulfilled, (state, action) => {
      state.estimationDashList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getStockApprovalReport.fulfilled, (state, action) => {
      state.stockApprovalReportList = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(getKarigarReport.fulfilled, (state, action) => {
      state.karigarReportList = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(getCustomerOrderReport.fulfilled, (state, action) => {
      state.customerOrderReportList = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(getEstimationReport.fulfilled, (state, action) => {
      state.estimationDashReportList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getCustomerVists.fulfilled, (state, action) => {
      state.customerVisitsDashList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getCustomerVistsReports.fulfilled, (state, action) => {
      state.customerVisitsDashReportList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getKarigarOrders.fulfilled, (state, action) => {
      state.karigarOrderList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getStockApproval.fulfilled, (state, action) => {
      state.stockApprovalDashList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getSales.fulfilled, (state, action) => {
      state.salesDashList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getSalesReport.fulfilled, (state, action) => {
      state.salesDashReportList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getCustomerOrder.fulfilled, (state, action) => {
      state.customerOrderDashList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getSalesReturn.fulfilled, (state, action) => {
      state.salesReturnDashList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getSalesReturnReport.fulfilled, (state, action) => {
      state.salesReturnDashReportList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getPurchase.fulfilled, (state, action) => {
      state.purchaseDashList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getPurchaseReport.fulfilled, (state, action) => {
      state.purchaseDashReportList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getLot.fulfilled, (state, action) => {
      state.lotDashList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getLotReport.fulfilled, (state, action) => {
      state.lotDashReportList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getCreditSales.fulfilled, (state, action) => {
      state.creditSalesDashList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getCreditSalesReport.fulfilled, (state, action) => {
      state.creditSalesDashReportList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getStoreStatistics.fulfilled, (state, action) => {
      state.storeStatisticsDashList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getTopProduct.fulfilled, (state, action) => {
      state.topProductDashList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getSupplierPayment.fulfilled, (state, action) => {
      state.supplierPaymentList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getEstimation.pending,
        getCustomerVists.pending,
        getSales.pending,
        getCustomerOrder.pending,
        getSalesReturn.pending,
        getPurchase.pending,
        getLot.pending,
        getCreditSales.pending,
        getStoreStatistics.pending,
        getTopProduct.pending,
        getSupplierPayment.pending,
        getEstimationReport.pending,
        getCustomerVistsReports.pending,
        getSalesReport.pending,
        getSalesReturnReport.pending,
        getPurchaseReport.pending,
        getLotReport.pending,
        getCreditSalesReport.pending,
        getStockApprovalReport.pending,
        getCustomerOrderReport.pending,
        getKarigarReport.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getEstimation.rejected,
        getCustomerVists.rejected,
        getSales.rejected,
        getCustomerOrder.rejected,
        getSalesReturn.rejected,
        getPurchase.rejected,
        getLot.rejected,
        getCreditSales.rejected,
        getStoreStatistics.rejected,
        getTopProduct.rejected,
        getSupplierPayment.rejected,
        getEstimationReport.rejected,
        getCustomerVistsReports.rejected,
        getSalesReport.rejected,
        getSalesReturnReport.rejected,
        getPurchaseReport.rejected,
        getLotReport.rejected,
        getCreditSalesReport.rejected,
        getStockApprovalReport.rejected,
        getCustomerOrderReport.rejected,
        getKarigarReport.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});
