import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";
import metalProcessAPI from "../api/metalProcessAPI";

//Purchase entry
export const createPocketEntry = createAsyncThunk("metalProcessReducer/createPocketEntry", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await metalProcessAPI.metal_process.createPocketEntry(payload);
    console.log(response.data);
    toastsuccess(response.data.message);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});


export const getStockDetails = createAsyncThunk("metalProcessReducer/getStockDetails", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await metalProcessAPI.metal_process.getStockDetails(payload);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const createMetalProcess = createAsyncThunk("metalProcessReducer/createMetalProcess", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await metalProcessAPI.metal_process.createMetalProcess(payload);
    console.log(response.data);
    toastsuccess(response.data.message);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});


export const getPocketDetails = createAsyncThunk("metalProcessReducer/getPocketDetails", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await metalProcessAPI.metal_process.getPocketDetails(payload);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getMetalIssueDetails = createAsyncThunk("metalProcessReducer/getMetalIssueDetails", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await metalProcessAPI.metal_process.getMetalIssueDetails(payload);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});


export const getMetalReceivedDetails = createAsyncThunk("metalProcessReducer/getMetalReceivedDetails", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await metalProcessAPI.metal_process.getMetalReceivedDetails(payload);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getMetalTestingIssueDetails = createAsyncThunk("metalProcessReducer/getMetalTestingIssueDetails", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await metalProcessAPI.metal_process.getMetalTestingIssueDetails(payload);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getMetalTestingReceivedDetails = createAsyncThunk("metalProcessReducer/getMetalTestingReceivedDetails", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await metalProcessAPI.metal_process.getMetalTestingReceivedDetails(payload);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getMetalRefiningIssueDetails = createAsyncThunk("metalProcessReducer/getMetalRefiningIssueDetails", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await metalProcessAPI.metal_process.getMetalRefiningIssueDetails(payload);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getPocketDetailsList = createAsyncThunk("metalProcessReducer/getPocketDetailsList", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await metalProcessAPI.metal_process.getPocketDetailsList(payload);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});