import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createPurchaseEntry,
  getPurchaseEntryItemDetails,
  createPurchaseIssueRecipt,
  getPurchaseIssueReciptItemDetails,
  updatePurchaseIssueRecipt,
  getPurchaseDetails,
  generateLotWithPo,
  getPurchaseDetailsList,
  updatePurchaseEntryStatus,
  cancelPurchaseEntry,
  getPurchaseIssueReciptList,
  cancelPurchaseIssueRecipt,
  getPurchasePayments,
  getStockDetails,
  updatePendingTransfer,
  createMetalIssue,
  getMetalIssueList,
  createSupplierPayment,
  getSupplierPayments,
  getPurchaseEntryById,
  updatePurchaseEntry,
  deletePurchaseItemByID,
  createPurchaseReturnEntry,
  getPurchaseReturnList,
  cancelPurchaseReturn,
  getPurchaseEntryByRefNo,
  getPurchaseReturnById,
  updatePurchaseReturnById,
  getSupplierOpeningDetails,
  getPurchaseMetalAdvance,
  getPurchaseCashAdvance,
  createPurchasePayment,
  getSupplierPaymentList
} from "../thunks/purchase";

export const purchaseReducerInitialState = {
  isError: null,
  isLoading: false,
  purchaseItemDetails: [],
  purchaseDetails: [],
  purchaseListDetails: [],
  purchasePaymentListDetails: [],
  stockDetailsList: [],
  metalIssueList: [],
  supplierPaymentList: [],
  supplierPaymentsLists: [],
  supplierOpeningDetails: null,
  supplierAdvanceDetails: null,
  supplierCashVaravu: null,
  purchaseInfo:{}

};

export const purchaseReducer = createSlice({
  name: "purchaseReducer",
  initialState: purchaseReducerInitialState,
  reducers: {
    resetPurchaseItemDetails(state) {
      state.purchaseItemDetails = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createPurchaseEntry.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(createPurchasePayment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.purchasePaymentListDetails = [];
      state.supplierAdvanceDetails = null;
    });
    builder.addCase(getPurchaseEntryById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.purchaseInfo = action.payload;
    });
    builder.addCase(getSupplierPaymentList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.supplierPaymentsLists = action.payload;
    });

    builder.addCase(getSupplierOpeningDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.supplierOpeningDetails = action.payload;
    });

    builder.addCase(getPurchaseMetalAdvance.fulfilled, (state, action) => {
      state.isLoading = false;
      state.supplierAdvanceDetails = action.payload;
    });

    builder.addCase(getPurchaseCashAdvance.fulfilled, (state, action) => {
      state.isLoading = false;
      state.supplierCashVaravu = action.payload;
    });

    builder.addCase(getPurchaseEntryByRefNo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.purchaseInfo = action.payload;
    });

    builder.addCase(deletePurchaseItemByID.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(updatePurchaseEntry.fulfilled, (state, action) => {
      state.isLoading = false;
      state.purchaseInfo = null;
    });

    builder.addCase(createSupplierPayment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.supplierPaymentList = [];

    });
    builder.addCase(createMetalIssue.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updatePendingTransfer.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(generateLotWithPo.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updatePurchaseEntryStatus.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(cancelPurchaseEntry.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(cancelPurchaseReturn.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getPurchaseEntryItemDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.purchaseItemDetails = action.payload;
    });
    builder.addCase(getStockDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stockDetailsList = action.payload.result;
    });
    builder.addCase(getPurchasePayments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.purchasePaymentListDetails = action.payload;
    });
    builder.addCase(getSupplierPayments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.supplierPaymentList = action.payload;
    });
    builder.addCase(getPurchaseDetailsList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.purchaseListDetails = action.payload;
    });

    builder.addCase(getPurchaseDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.purchaseDetails = action.payload;
    });
    builder.addCase(getMetalIssueList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.metalIssueList = action.payload;
    });
    builder.addMatcher(
      isAnyOf(
        createPurchaseEntry.pending,
        getPurchaseEntryById.pending,
        updatePurchaseEntry.pending,
        getPurchaseEntryItemDetails.pending,
        getPurchaseDetails.pending,
        generateLotWithPo.pending,
        getPurchaseDetailsList.pending,
        getStockDetails.pending,
        updatePendingTransfer.pending,
        createMetalIssue.pending,
        getMetalIssueList.pending,
        deletePurchaseItemByID.pending,
        cancelPurchaseReturn.pending,
        getPurchaseEntryByRefNo.pending,
        getSupplierOpeningDetails.pending,
        getPurchaseMetalAdvance.pending,
        getPurchaseCashAdvance.pending, 
        getSupplierPaymentList.pending
      ),
      (state) => {
        state.isLoading = true;
        state.lotInfo = null;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createPurchaseEntry.rejected,
        getPurchaseEntryById.rejected,
        updatePurchaseEntry.rejected,
        deletePurchaseItemByID.rejected,
        createMetalIssue.rejected,
        getPurchaseEntryItemDetails.rejected,
        getPurchaseDetails.rejected,
        generateLotWithPo.rejected,
        getPurchaseDetailsList.rejected,
        getStockDetails.rejected,
        updatePendingTransfer.rejected,
        getMetalIssueList.rejected,
        cancelPurchaseReturn.rejected,
        getPurchaseEntryByRefNo.rejected,
        getSupplierOpeningDetails.rejected,
        getPurchaseMetalAdvance.rejected,
        getPurchaseCashAdvance.rejected,
        getSupplierPaymentList.rejected 
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createPurchaseEntry.fulfilled,
        getPurchaseEntryById.fulfilled,
        updatePurchaseEntry.fulfilled,
        deletePurchaseItemByID.fulfilled,
        getPurchaseEntryItemDetails.fulfilled,
        getPurchaseDetails.fulfilled,
        generateLotWithPo.fulfilled,
        getPurchaseDetailsList.fulfilled,
        getStockDetails.fulfilled,
        updatePendingTransfer.fulfilled,
        createMetalIssue.fulfilled,
        getMetalIssueList.fulfilled,
        cancelPurchaseReturn.fulfilled,
        getSupplierOpeningDetails.fulfilled,
        getPurchaseCashAdvance.fulfilled, 
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
  purchaseIssueReceiptDetails: [],
  purchaseIssueReceiptList: [],
};

export const purchaseIssueReceiptReducer = createSlice({
  name: "purchaseIssueReceiptReducer",
  initialState: purchaseIssueReceiptReducerInitialState,
  reducers: {
    resetPurchaseIssueReceiptDetails(state) {
      state.purchaseIssueReceiptDetails = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createPurchaseIssueRecipt.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
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
        cancelPurchaseIssueRecipt.pending
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
        cancelPurchaseIssueRecipt.rejected
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
        cancelPurchaseIssueRecipt.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});


export const purchaseReturnReducerInitialState = {
  isError: null,
  isLoading: false,
  purchaseReturnDetailsList: [],
  purchaseReturnInfo: null,
};

export const purchaseReturnReducer = createSlice({
  name: "purchaseReturnReducer",
  initialState: purchaseReturnReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createPurchaseReturnEntry.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getPurchaseReturnList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.purchaseReturnDetailsList = action.payload;
    });
    builder.addCase(getPurchaseReturnById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.purchaseReturnInfo = action.payload;
    });
    builder.addMatcher(
      isAnyOf(
        createPurchaseReturnEntry.pending,
        getPurchaseReturnList.pending,
        getPurchaseReturnById.pending,
        updatePurchaseReturnById.pending,
      ),
      (state) => {
        state.isLoading = true;
        state.lotInfo = null;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createPurchaseReturnEntry.rejected,
        getPurchaseReturnList.rejected,
        getPurchaseReturnById.rejected,
        updatePurchaseReturnById.rejected,
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createPurchaseReturnEntry.fulfilled,
        getPurchaseReturnList.fulfilled,
        updatePurchaseReturnById.fulfilled,

      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
        state.purchaseReturnInfo = null;
      }
    );
  },
});

export const { resetPurchaseItemDetails } = purchaseReducer.actions;
export const { resetPurchaseIssueReceiptDetails } = purchaseIssueReceiptReducer.actions;
