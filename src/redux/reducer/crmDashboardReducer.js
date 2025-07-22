import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getActiveChitsReports, getBranchwise, getMaturedandUnclaimedReports, getPaymentSummaryReports, getschemewise, getUsersJoinedThrough } from "../thunks/crmDashboard";


export const crmDashboardReducerInitialState = {
    activeChitsDashList: {},
    MaturedandUnclaimedDashList: [],
    PaymentDashList: [],
    UsersJoinedThroughDashList: [],
    schemewiseDashList: [],
    BranchwiseDashList: [],
    RegisterThroughDetailsDashList: [],
    CustomerDetailsDashList: [],
    CollectionSummaryDashList: [],
    InActiveChitsDashList: [],
    ChitClosingDetailsDashList: [],
    isError: null,
    isLoading: false,
};

export const crmDashboardReducer = createSlice({
    name: "crmDashboardReducer",
    initialState: crmDashboardReducerInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getActiveChitsReports.fulfilled, (state, action) => {
            state.activeChitsDashList = action?.payload?.data;
            state.isLoading = false;
        });
        builder.addCase(getMaturedandUnclaimedReports.fulfilled, (state, action) => {
            state.MaturedandUnclaimedDashList = action?.payload?.data;
            state.isLoading = false;
        });
        builder.addCase(getPaymentSummaryReports.fulfilled, (state, action) => {
            state.PaymentDashList = action?.payload?.data;
            state.isLoading = false;
        });
        builder.addCase(getUsersJoinedThrough.fulfilled, (state, action) => {
            state.UsersJoinedThroughDashList = action?.payload?.data;
            state.isLoading = false;
        });
        builder.addCase(getschemewise.fulfilled, (state, action) => {
            state.schemewiseDashList = action?.payload?.data;
            state.isLoading = false;
        });
        builder.addCase(getBranchwise.fulfilled, (state, action) => {
            state.BranchwiseDashList = action?.payload?.data;
            state.isLoading = false;
        });
        // builder.addCase(getRegisterThroughDetails.fulfilled, (state, action) => {
        //     state.RegisterThroughDetailsDashList = action?.payload?.data;
        //     state.isLoading = false;
        // });
        // builder.addCase(getCustomerDetails.fulfilled, (state, action) => {
        //     state.CustomerDetailsDashList = action?.payload?.data;
        //     state.isLoading = false;
        // });
        // builder.addCase(getCollectionSummary.fulfilled, (state, action) => {
        //     state.CollectionSummaryDashList = action?.payload?.data;
        //     state.isLoading = false;
        // });
        // builder.addCase(getInActiveChits.fulfilled, (state, action) => {
        //     state.InActiveChitsDashList = action?.payload?.data;
        //     state.isLoading = false;
        // });
        // builder.addCase(getChitClosingDetails.fulfilled, (state, action) => {
        //     state.ChitClosingDetailsDashList = action?.payload?.data;
        //     state.isLoading = false;
        // });
        builder.addMatcher(
            isAnyOf(
                getActiveChitsReports.pending,
                getMaturedandUnclaimedReports.pending,
                getPaymentSummaryReports.pending,
                getUsersJoinedThrough.pending,
                getschemewise.pending,
                getBranchwise.pending,
                // getRegisterThroughDetails.pending,
                // getCustomerDetails.pending,
                // getCollectionSummary.pending,
                // getInActiveChits.pending,
                // getChitClosingDetails.pending

            ),
            (state) => {
                state.isLoading = true;
            }
        );
        builder.addMatcher(
            isAnyOf(
                getActiveChitsReports.rejected,
                getMaturedandUnclaimedReports.rejected,
                getPaymentSummaryReports.rejected,
                getUsersJoinedThrough.rejected,
                getschemewise.rejected,
                getBranchwise.rejected,
                // getRegisterThroughDetails.rejected,
                // getCustomerDetails.rejected,
                // getCollectionSummary.rejected,
                // getInActiveChits.rejected,
                // getChitClosingDetails.rejected
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
