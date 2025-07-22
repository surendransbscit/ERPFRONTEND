import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getStockDetails,createPocketEntry,getPocketDetails,getMetalIssueDetails,getMetalReceivedDetails,getMetalTestingIssueDetails,getMetalTestingReceivedDetails,getMetalRefiningIssueDetails,getPocketDetailsList } from "../thunks/metalProcess";

export const metalProcessReducerInitialState = {
  isError: null,
  isLoading: false,
  stockDetails:[],
  pocketDetails:[],
  pocketDetailsList:[],
  metalIssueDetails:[],
  metalReceivedDetails:[],
};

export const metalProcessReducer = createSlice({
  name: "metalProcessReducer",
  initialState: metalProcessReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(getStockDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stockDetails = action.payload.result;
    });

    builder.addCase(getPocketDetailsList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.pocketDetailsList = action.payload;
    });

    builder.addCase(getMetalRefiningIssueDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.metalIssueDetails = action.payload.result;
    });

    builder.addCase(getMetalReceivedDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.metalReceivedDetails = action.payload.result;
    });

    builder.addCase(getMetalTestingReceivedDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.metalReceivedDetails = action.payload.result;
    });

    builder.addCase(getMetalTestingIssueDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.metalIssueDetails = action.payload.result;
    });

    builder.addCase(getPocketDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.pocketDetails = action.payload.result;
    });

    builder.addCase(getMetalIssueDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.metalIssueDetails = action.payload.result;
    });

    builder.addCase(createPocketEntry.fulfilled, (state, action) => {
      state.isLoading = false;
    });


    builder.addMatcher(
      isAnyOf(
        getStockDetails.pending,
        createPocketEntry.pending,
        getPocketDetailsList.pending,
      ),
      (state) => {
        state.isLoading = true;
        state.lotInfo = null;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getStockDetails.rejected,
        createPocketEntry.rejected,
        getPocketDetailsList.rejected,
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getStockDetails.fulfilled,
        createPocketEntry.fulfilled,
        getPocketDetailsList.fulfilled,

      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});




export const purchaseIssueReceiptReducerInitialState = {
  isError: null,
  isLoading: false,
  purchaseIssueReceiptDetails:[],
  purchaseIssueReceiptList:[],

};

export const purchaseIssueReceiptReducer = createSlice({
  name: "purchaseIssueReceiptReducer",
  initialState: purchaseIssueReceiptReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(createPurchaseIssueRecipt.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(cancelPurchaseIssueRecipt.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getPurchaseIssueReciptItemDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.purchaseIssueReceiptDetails = action.payload;
    });

    builder.addCase(getPurchaseIssueReciptList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.purchaseIssueReceiptList = action.payload;
    });

    builder.addMatcher(
      isAnyOf(
        createPurchaseIssueRecipt.pending,
        updatePurchaseIssueRecipt.pending,
        getPurchaseIssueReciptItemDetails.pending,
        getPurchaseIssueReciptList.pending,
        cancelPurchaseIssueRecipt.pending,
      ),
      (state) => {
        state.isLoading = true;
        state.lotInfo = null;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createPurchaseIssueRecipt.rejected,
        updatePurchaseIssueRecipt.rejected,
        getPurchaseIssueReciptItemDetails.rejected,
        getPurchaseIssueReciptList.rejected,
        cancelPurchaseIssueRecipt.rejected,
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createPurchaseIssueRecipt.fulfilled,
        updatePurchaseIssueRecipt.fulfilled,
        getPurchaseIssueReciptItemDetails.fulfilled,
        getPurchaseIssueReciptList.fulfilled,
        cancelPurchaseIssueRecipt.fulfilled,
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});


