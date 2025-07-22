import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getActiveInActiveCustomer,
  getClosedAccountsSummary,
  getDashboardSummary,
  getMonthlywiseMetalWeight,
  getNewCustomer,
  getSchemeSlabWiseAccounts,
  getTotalCustomer,
  getUpcomingMaturies,
} from "../thunks/digiGoldDashboard";

export const digiGoldDashboardReducerInitialState = {
  dashboardSummary: null,
  monthwiseMetalWeight: [],
  closedAccountsSummary: [],
  schemeSlabWiseAccounts: [],
  upcomingMaturitiesList: [],
  activeCusDashList: {},
  newCustomerDashList: [],
  TotalCustomerDashList: [],

  isError: null,
  isLoading: false,
};

export const digigoldDashboardReducer = createSlice({
  name: "digigoldDashboardReducer",
  initialState: digiGoldDashboardReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDashboardSummary.fulfilled, (state, action) => {
      state.dashboardSummary = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getMonthlywiseMetalWeight.fulfilled, (state, action) => {
      state.monthwiseMetalWeight = action?.payload?.data?.data;
      state.isLoading = false;
    });
    builder.addCase(getClosedAccountsSummary.fulfilled, (state, action) => {
      state.closedAccountsSummary = action?.payload?.data?.data;
      state.isLoading = false;
    });
    builder.addCase(getSchemeSlabWiseAccounts.fulfilled, (state, action) => {
      state.schemeSlabWiseAccounts = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getUpcomingMaturies.fulfilled, (state, action) => {
      state.upcomingMaturitiesList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getActiveInActiveCustomer.fulfilled, (state, action) => {
      state.activeCusDashList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getNewCustomer.fulfilled, (state, action) => {
      state.newCustomerDashList = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getTotalCustomer.fulfilled, (state, action) => {
      state.TotalCustomerDashList = action?.payload?.data;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getActiveInActiveCustomer.pending,
        getNewCustomer.pending,
        getTotalCustomer.pending,
        getDashboardSummary.pending,
        getMonthlywiseMetalWeight.pending,
        getClosedAccountsSummary.pending,
        getUpcomingMaturies.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getActiveInActiveCustomer.rejected,
        getNewCustomer.rejected,
        getTotalCustomer.rejected,
        getDashboardSummary.rejected,
        getMonthlywiseMetalWeight.rejected,
        getClosedAccountsSummary.rejected,
        getUpcomingMaturies.rejected
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
