import { createAsyncThunk } from "@reduxjs/toolkit";
import mcxAPI from "../api/mcxApi";
import { DispatchErrorHandler } from "../configs";

export const getAllBuySell = createAsyncThunk(
    "buySellReducer/getAllBuySell",
    async (payload = {}, { rejectWithValue }) => {
      try {
        const response = await mcxAPI.buySell.getAllBuySell(payload?.page, payload?.records, payload,payload?.search);
        return response?.data || null;
      } catch (error) {
        DispatchErrorHandler(error);
        return rejectWithValue(error);
      }
    }
  );

export const getOpeningPosition = createAsyncThunk(
    "buySellReducer/getOpeningPosition",
    async (payload = {}, { rejectWithValue }) => {
      try {
        const response = await mcxAPI.buySell.getOpeningPosition();
        return response?.data || null;
      } catch (error) {
        DispatchErrorHandler(error);
        return rejectWithValue(error);
      }
    }
  );
  
  export const createBuySell = createAsyncThunk(
    "buySellReducer/createBuySell",
    async (payload = {}, { rejectWithValue }) => {
      try {
        const response = await mcxAPI.buySell.createBuySell(payload);
        return response || null;
      } catch (error) {
        DispatchErrorHandler(error);
        return rejectWithValue(error);
      }
    }
  );