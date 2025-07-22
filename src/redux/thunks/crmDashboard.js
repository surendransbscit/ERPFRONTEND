import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import crmDashboardAPI from "../api/crmDashboardAPI";

export const getActiveChitsReports = createAsyncThunk(
    "crmDashboardReducer/getActiveChitsReports",
    async (payload = {}, { rejectWithValue }) => {
        try {
            const response = await crmDashboardAPI.crmDashboards.getActiveChits(
                payload.filter, payload.branch, payload.type);
            console.log(response);
            
            return response || null;
        } catch (error) {
            DispatchErrorHandler(error);
            return rejectWithValue(error);
        }
    }
);


export const getMaturedandUnclaimedReports = createAsyncThunk(
    "crmDashboardReducer/getMaturedandUnclaimedReports",
    async (payload = {}, { rejectWithValue }) => {
        try {
            const response = await crmDashboardAPI.crmDashboards.getMaturedandUnclaimed();
            return response || null;
        } catch (error) {
            DispatchErrorHandler(error);
            return rejectWithValue(error);
        }
    }
);

export const getPaymentSummaryReports = createAsyncThunk(
    "crmDashboardReducer/getPaymentSummaryReports",
    async (payload = {}, { rejectWithValue }) => {
        try {
            const response = await crmDashboardAPI.crmDashboards.getPayment(
                payload.view, payload.branch, payload.type);;
            return response || null;
        } catch (error) {
            DispatchErrorHandler(error);
            return rejectWithValue(error);
        }
    }
);

export const getUsersJoinedThrough = createAsyncThunk(
    "crmDashboardReducer/getUsersJoinedThrough",
    async (payload = {}, { rejectWithValue }) => {
        try {
            const response = await crmDashboardAPI.crmDashboards.getUsersJoinedThrough(
                payload.view, payload.branch, payload.type);;
            return response || null;
        } catch (error) {
            DispatchErrorHandler(error);
            return rejectWithValue(error);
        }
    }
);

export const getschemewise = createAsyncThunk(
    "crmDashboardReducer/getschemewise",
    async (payload = {}, { rejectWithValue }) => {
        try {
            const response = await crmDashboardAPI.crmDashboards.getschemewise(payload.view);
            return response || null;
        } catch (error) {
            DispatchErrorHandler(error);
            return rejectWithValue(error);
        }
    }
);

export const getBranchwise = createAsyncThunk(
    "crmDashboardReducer/getBranchwise",
    async (payload = {}, { rejectWithValue }) => {
        try {
            const response = await crmDashboardAPI.crmDashboards.getBranchwise(payload.view);
            return response || null;
        } catch (error) {
            DispatchErrorHandler(error);
            return rejectWithValue(error);
        }
    }
);

export const getRegisterThroughDetails = createAsyncThunk(
    "crmDashboardReducer/getRegisterThroughDetails",
    async (payload = {}, { rejectWithValue }) => {
        try {
            const response = await crmDashboardAPI.crmDashboards.getRegisterThroughDetails(
                payload.view, payload.branch, payload.type);;
            return response || null;
        } catch (error) {
            DispatchErrorHandler(error);
            return rejectWithValue(error);
        }
    }
);

export const getCustomerDetails = createAsyncThunk(
    "crmDashboardReducer/getCustomerDetails",
    async (payload = {}, { rejectWithValue }) => {
        try {
            const response = await crmDashboardAPI.crmDashboards.getCustomerDetails(
                payload.view, payload.branch, payload.type);;
            return response || null;
        } catch (error) {
            DispatchErrorHandler(error);
            return rejectWithValue(error);
        }
    }
);


export const getCollectionSummary = createAsyncThunk(
    "crmDashboardReducer/getCollectionSummary",
    async (payload = {}, { rejectWithValue }) => {
        try {
            const response = await crmDashboardAPI.crmDashboards.getCollectionSummary(
                payload.view, payload.branch, payload.type);;
            return response || null;
        } catch (error) {
            DispatchErrorHandler(error);
            return rejectWithValue(error);
        }
    }
);

export const getInActiveChits = createAsyncThunk(
    "crmDashboardReducer/getInActiveChits",
    async (payload = {}, { rejectWithValue }) => {
        try {
            const response = await crmDashboardAPI.crmDashboards.getInActiveChits(
                payload.view, payload.branch, payload.type);;
            return response || null;
        } catch (error) {
            DispatchErrorHandler(error);
            return rejectWithValue(error);
        }
    }
);

export const getChitClosingDetails = createAsyncThunk(
    "crmDashboardReducer/getChitClosingDetails",
    async (payload = {}, { rejectWithValue }) => {
        try {
            const response = await crmDashboardAPI.crmDashboards.getChitClosingDetails(
                payload.view, payload.branch, payload.type);;
            return response || null;
        } catch (error) {
            DispatchErrorHandler(error);
            return rejectWithValue(error);
        }
    }
);