import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createBuySell,
  getAllBuySell,
  getOpeningPosition,
} from "../thunks/mcx";

const buySellReducerInitialState = {
  buySellList: [],
  buySellOpeningPosition: null,
  isError: null,
  isLoading: false,
};

export const buySellReducer = createSlice({
  name: "buySellReducer",
  initialState: buySellReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllBuySell.fulfilled, (state, action) => {
      state.buySellList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getOpeningPosition.fulfilled, (state, action) => {
      state.buySellOpeningPosition = action.payload;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getAllBuySell.pending,
        createBuySell.pending,
        getOpeningPosition.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllBuySell.rejected,
        createBuySell.rejected,
        getOpeningPosition.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(createBuySell.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});
