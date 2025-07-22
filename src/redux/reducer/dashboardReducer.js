import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getActiveChits,
  getBranchWiseCollectionDetails,
  getBranchWiseDetails,
  getBranchWiseSchemeClosed,
  getBranchWiseSchemeJoined,
  getChitClosingDetails,
  getCollectionSummary,
  getCustomerDetails,
  getCustomerImportantDates,
  getCustomerImportantDatesList,
  getInActiveChits,
  getMaturedUnclaimedChits,
  getOrderDetails,
  getPaymentModeDash,
  getPaymentStatus,
  getPaymentSummary,
  getPaymentThrough,
  getRegisterThroughDetails,
  getSchemeWiseClosed,
  getSchemeWiseJoined,
  getUnPaidCustomersDetails,
  getUserByAreas,
  getUserJoinedThrough,
  // Order Management Dashboard
  fetchOrderDetails,
  fetchTotalOrderDetails,
  fetchTodayRecivedDetails,
  fetchErpTodayDeliveredOrders,
  fetchErpYetToAssignOrders,
  fetchErpTotalDeliveredOrders,
  fetchErpWeekDeliveryOrders,
  fetchErpNextWeekDeliveryOrders,
  fetchErpOverDueOrderSupplier,
  fetchErpCustomerOverDueOrder,
  fetchErpTotalDeliveryReady,
  fetchErpWorkProgress,
  getErpCustomerCartReport,
} from "../thunks/dashboard";

export const dashboardReducerInitialState = {
  paymentStatusList: [],
  paymentThroughList: [],
  paymentModeDashList: [],
  schemeWiseJoinedList: [],
  schemeWiseClosedList: [],
  branchWiseSchemeJoinedList: [],
  branchWiseSchemeClosedList: [],
  userByAreas: [],
  userJoinedThrough: [],

  activeList: {},
  paymentSummary: {},
  maturedAndUnclaimedList: {},
  inActiveList: [],
  branchWiseDetailsList: [],
  unPaidCustomersDetailsList: [],
  collectionSummaryList: [],
  chitClosingDetailsList: [],
  registerThroughDetailsList: [],
  customerDetailsList: {},
  orderDetailsList: {},
  customerImportantDates: [],
  customerImportantDatesList: [],
  branchWiseCollectionDetailsList:[],
  // Order Management Dashboard
  dashBoardOrderDetailsList: {},
  totalOrderDetails: [],
  todayRecivedDetails: [],
  erpTodayDeliveredOrders: [],
  erpYetToAssignOrders: [],
  erpTotalDeliveredOrders: [],
  erpWeekDeliveryOrders: [],
  erpNextWeekDeliveryOrders: [],
  erpOverDueOrderSupplier: [],
  erpTotalDeliveryReady: [],
  erpWorkProgress: [],
  erpCustomerCart: null,
  isError: null,
  isLoading: false,
};

export const dashboardReducer = createSlice({
  name: "dashboardReducer",
  initialState: dashboardReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPaymentStatus.fulfilled, (state, action) => {
      state.paymentStatusList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getUserByAreas.fulfilled, (state, action) => {
      state.userByAreas = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getPaymentThrough.fulfilled, (state, action) => {
      state.paymentThroughList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getSchemeWiseClosed.fulfilled, (state, action) => {
      state.schemeWiseClosedList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getSchemeWiseJoined.fulfilled, (state, action) => {
      state.schemeWiseJoinedList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getUserJoinedThrough.fulfilled, (state, action) => {
      state.userJoinedThrough = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getBranchWiseSchemeClosed.fulfilled, (state, action) => {
      state.branchWiseSchemeClosedList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getBranchWiseSchemeJoined.fulfilled, (state, action) => {
      state.branchWiseSchemeJoinedList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getPaymentModeDash.fulfilled, (state, action) => {
      state.paymentModeDashList = action?.payload?.data;
      state.isLoading = false;
    });

    builder.addCase(getActiveChits.fulfilled, (state, action) => {
      state.activeList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getMaturedUnclaimedChits.fulfilled, (state, action) => {
      state.maturedAndUnclaimedList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getInActiveChits.fulfilled, (state, action) => {
      state.inActiveList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getPaymentSummary.fulfilled, (state, action) => {
      state.paymentSummary = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getBranchWiseDetails.fulfilled, (state, action) => {
      state.branchWiseDetailsList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getUnPaidCustomersDetails.fulfilled, (state, action) => {
      state.unPaidCustomersDetailsList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getCollectionSummary.fulfilled, (state, action) => {
      state.collectionSummaryList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getChitClosingDetails.fulfilled, (state, action) => {
      state.chitClosingDetailsList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getRegisterThroughDetails.fulfilled, (state, action) => {
      state.registerThroughDetailsList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getCustomerDetails.fulfilled, (state, action) => {
      state.customerDetailsList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getOrderDetails.fulfilled, (state, action) => {
      state.orderDetailsList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getCustomerImportantDates.fulfilled, (state, action) => {
      state.customerImportantDates= action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getCustomerImportantDatesList.fulfilled, (state, action) => {
      state.customerImportantDatesList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getBranchWiseCollectionDetails.fulfilled, (state, action) => {
      state.branchWiseCollectionDetailsList = action?.payload?.data;
      state.isLoading = false;
    });
    // Order Management Dashboard
    builder.addCase(fetchOrderDetails.fulfilled, (state, action) => {
      state.dashBoardOrderDetailsList = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchTotalOrderDetails.fulfilled, (state, action) => {
      state.totalOrderDetails = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchTodayRecivedDetails.fulfilled, (state, action) => {
      state.todayRecivedDetails = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchErpTodayDeliveredOrders.fulfilled, (state, action) => {
      state.erpTodayDeliveredOrders = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchErpYetToAssignOrders.fulfilled, (state, action) => {
      state.erpYetToAssignOrders = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchErpTotalDeliveredOrders.fulfilled, (state, action) => {
      state.erpTotalDeliveredOrders = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchErpWeekDeliveryOrders.fulfilled, (state, action) => {
      state.erpWeekDeliveryOrders = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(
      fetchErpNextWeekDeliveryOrders.fulfilled,
      (state, action) => {
        state.erpNextWeekDeliveryOrders = action?.payload;
        state.isLoading = false;
      }
    );
    builder.addCase(fetchErpOverDueOrderSupplier.fulfilled, (state, action) => {
      state.erpOverDueOrderSupplier = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchErpCustomerOverDueOrder.fulfilled, (state, action) => {
      state.erpCustomerOverDueOrder = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchErpTotalDeliveryReady.fulfilled, (state, action) => {
      state.erpTotalDeliveryReady = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchErpWorkProgress.fulfilled, (state, action) => {
      state.erpWorkProgress = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(getErpCustomerCartReport.fulfilled, (state, action) => {
      state.erpCustomerCart = action?.payload;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getPaymentStatus.pending,
        getPaymentThrough.pending,
        getPaymentModeDash.pending,
        getSchemeWiseJoined.pending,
        getSchemeWiseClosed.pending,
        getBranchWiseSchemeJoined.pending,
        getBranchWiseSchemeClosed.pending,
        getUserJoinedThrough.pending,
        getUserByAreas.pending,

        getActiveChits.pending,
        getInActiveChits.pending,
        getBranchWiseDetails.pending,
        getUnPaidCustomersDetails.pending,
        getCollectionSummary.pending,
        getChitClosingDetails.pending,
        getRegisterThroughDetails.pending,
        getCustomerDetails.pending,
        getMaturedUnclaimedChits.pending,
        getPaymentSummary.pending,
        getOrderDetails.pending,
        getCustomerImportantDates.pending,
        getCustomerImportantDatesList.pending,
        getBranchWiseCollectionDetails.pending,
        // Order Management Dashboard
        fetchOrderDetails.pending,

        fetchTotalOrderDetails.pending,
        fetchTodayRecivedDetails.pending,
        fetchErpTodayDeliveredOrders.pending,
        fetchErpYetToAssignOrders.pending,
        fetchErpTotalDeliveredOrders.pending,
        fetchErpWeekDeliveryOrders.pending,
        fetchErpNextWeekDeliveryOrders.pending,
        fetchErpOverDueOrderSupplier.pending,
        fetchErpCustomerOverDueOrder.pending,
        fetchErpTotalDeliveryReady.pending,
        fetchErpWorkProgress.pending,
        getErpCustomerCartReport.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getPaymentStatus.rejected,
        getPaymentThrough.rejected,
        getPaymentModeDash.rejected,
        getSchemeWiseJoined.rejected,
        getSchemeWiseClosed.rejected,
        getBranchWiseSchemeJoined.rejected,
        getBranchWiseSchemeClosed.rejected,
        getUserJoinedThrough.rejected,
        getUserByAreas.rejected,

        getActiveChits.rejected,
        getInActiveChits.rejected,
        getBranchWiseDetails.rejected,
        getUnPaidCustomersDetails.rejected,
        getCollectionSummary.rejected,
        getChitClosingDetails.rejected,
        getRegisterThroughDetails.rejected,
        getCustomerDetails.rejected,
        getMaturedUnclaimedChits.rejected,
        getPaymentSummary.rejected,
        getOrderDetails.rejected,
        getCustomerImportantDates.rejected,
        getCustomerImportantDatesList.rejected,
        getBranchWiseCollectionDetails.rejected,
        // Order Management Dashboard
        fetchOrderDetails.rejected,
        fetchTotalOrderDetails.rejected,
        fetchTodayRecivedDetails.rejected,
        fetchErpTodayDeliveredOrders.rejected,
        fetchErpYetToAssignOrders.rejected,
        fetchErpTotalDeliveredOrders.rejected,
        fetchErpWeekDeliveryOrders.rejected,
        fetchErpNextWeekDeliveryOrders.rejected,
        fetchErpOverDueOrderSupplier.rejected,
        fetchErpCustomerOverDueOrder.rejected,
        fetchErpTotalDeliveryReady.rejected,
        fetchErpWorkProgress.rejected,
        getErpCustomerCartReport.rejected
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
