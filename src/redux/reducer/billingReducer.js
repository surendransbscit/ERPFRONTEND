import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createInvoice,
  createIssueReceipt,
  getIssueCreditList,
  getIssueReceiptById,
  getIssueReceiptList,
  getBillingList,
  getJewelNotDeliverList,
  updateJewelDelivered,
  cancelInvoice,
  getReturnDetails,
  getAdvanceDetails,
  getOrderDelivery,
  cancelIssueReceipt,
  getChitDetails,
  createBankSettlementDetails,
  getBankSettlementDetails,
  getBankSettlementList,
  createDiscountInvoice,
  getDiscountBillingList,
  getBillDetails,
  updateInvoice,
  getDepositDetails,
  getDeleteableInvoiceList,
  deleteInvoiceList,
  getDeleteableReceiptList,
  deleteIssueReceiptList,
  deleteTransaction,
  createLiablityEntry,
  getLiablityEntry,
  getLiablityEntryPayable,
  createLiablityEntryPayment,
  getLiablityEntryPayment,
  getCustomerSalesLogOptions,
  customerSalesLog,
} from "../thunks/billing";

import {
  toastfunc,
  toastsuccess,
} from "../../components/sds-toast-style/toast-style";

const billingReducerInitialState = {
  invoiceList: [],
  isError: null,
  isLoading: false,
  invoiceDetails: {},
  advanceDetails: [],
  depositDetails: [],
  chitDetails: [],
  orderDetails: [],
  jewelNotDeliverList: [],
  invoiceDiscountList: [],
  deleteableInvoiceList: [],
  deleteableReceiptList: null,
  billDetails: {},
};

export const billingReducer = createSlice({
  name: "billingReducer",
  initialState: billingReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createInvoice.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(updateInvoice.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(createDiscountInvoice.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(deleteInvoiceList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(deleteTransaction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(getDeleteableInvoiceList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.deleteableInvoiceList = action.payload;
    });
    builder.addCase(getDeleteableReceiptList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.deleteableReceiptList = action.payload;
    });
    builder.addCase(getReturnDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.invoiceDetails = action.payload;
    });
    builder.addCase(getBillDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.billDetails = action.payload;
    });

    builder.addCase(getDiscountBillingList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.invoiceDiscountList = action.payload;
    });

    builder.addCase(getJewelNotDeliverList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.jewelNotDeliverList = action.payload.data;
    });

    builder.addCase(updateJewelDelivered.fulfilled, (state, action) => {
      toastsuccess(action.payload.data.message);
      state.isLoading = false;
      state.isError = false;
    });

    builder.addCase(getAdvanceDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.advanceDetails = action.payload;
    });
    builder.addCase(getDepositDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.depositDetails = action.payload;
    });

    builder.addCase(getChitDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.chitDetails = action.payload;
    });

    builder.addCase(getOrderDelivery.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.orderDetails = action.payload;
    });

    builder.addCase(cancelInvoice.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      toastsuccess(action.payload.message);
    });
    builder.addCase(getBillingList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.invoiceList = action.payload;
    });
    builder.addMatcher(
      isAnyOf(
        createInvoice.pending,
        getBillingList.pending,
        cancelInvoice.pending,
        getReturnDetails.pending,
        getAdvanceDetails.pending,
        getOrderDelivery.pending,
        cancelIssueReceipt.pending,
        updateJewelDelivered.pending,
        getJewelNotDeliverList.pending,
        getDiscountBillingList.pending,
        getDepositDetails.pending,
        getDeleteableInvoiceList.pending,
        deleteInvoiceList.pending,
        getDeleteableReceiptList.pending,
        deleteIssueReceiptList.pending,
        deleteTransaction.pending
      ),
      (state) => {
        state.isLoading = false;
        state.advanceDetails = [];
      }
    );
    builder.addMatcher(
      isAnyOf(
        createInvoice.rejected,
        getBillingList.rejected,
        cancelInvoice.rejected,
        getReturnDetails.rejected,
        getAdvanceDetails.rejected,
        getOrderDelivery.rejected,
        cancelIssueReceipt.rejected,
        updateJewelDelivered.rejected,
        getJewelNotDeliverList.rejected,
        getDiscountBillingList.rejected,
        getDepositDetails.rejected,
        getDeleteableInvoiceList.rejected,
        deleteInvoiceList.rejected,
        getDeleteableReceiptList.rejected,
        deleteIssueReceiptList.rejected,
        deleteTransaction.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.advanceDetails = [];
      }
    );
    builder.addMatcher(
      isAnyOf(
        createInvoice.fulfilled,
        getBillingList.fulfilled,
        cancelInvoice.fulfilled,
        getReturnDetails.fulfilled,
        getAdvanceDetails.fulfilled,
        getOrderDelivery.fulfilled,
        cancelIssueReceipt.fulfilled,
        updateJewelDelivered.fulfilled,
        getJewelNotDeliverList.fulfilled,
        getDiscountBillingList.fulfilled,
        getDeleteableInvoiceList.fulfilled,
        deleteInvoiceList.fulfilled,
        deleteIssueReceiptList.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

const receiptReducerInitialState = {
  receiptList: [],
  issueCreditsList: [],
  receiptInfo: {},
  isError: null,
  isLoading: false,
};

export const receiptReducer = createSlice({
  name: "receiptReducer",
  initialState: receiptReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIssueReceiptList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.receiptList = action.payload;
    });
    builder.addCase(getIssueCreditList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.issueCreditsList = action.payload;
    });
    builder.addCase(getIssueReceiptById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.receiptInfo = action.payload;
    });

    builder.addMatcher(
      isAnyOf(
        createIssueReceipt.pending,
        getIssueReceiptList.pending,
        getIssueReceiptById.pending,
        getIssueCreditList.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createIssueReceipt.rejected,
        getIssueReceiptList.rejected,
        getIssueReceiptById.rejected,
        getIssueCreditList.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(createInvoice.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
      state.receiptInfo = {};
    });
  },
});

//bank settlement

const bankSettlementReducerInitialState = {
  bankSettlementList: [],
  bankSettlementListingData: [],
  bankSettlementInfo: null,
  isError: null,
  isLoading: false,
};

export const bankSettlementReducer = createSlice({
  name: "bankSettlementReducer",
  initialState: bankSettlementReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBankSettlementDetails.fulfilled, (state, action) => {
      state.bankSettlementList = action.payload;
      state.bankSettlementInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getBankSettlementList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.bankSettlementListingData = action.payload;
    });
    builder.addMatcher(
      isAnyOf(
        createBankSettlementDetails.pending,
        getBankSettlementDetails.pending,
        getBankSettlementList.pending
      ),
      (state) => {
        state.isLoading = false;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createBankSettlementDetails.rejected,
        getBankSettlementDetails.rejected,
        getBankSettlementList.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createBankSettlementDetails.fulfilled,
        getBankSettlementList.fulfilled
      ),
      (state) => {
        state.bankSettlementInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//liablity entry

const liablityEntryReducerInitialState = {
  liablityEntryList: [],
  liablityEntryPaymentList: [],
  liablityEntryPayableList: [],
  liablityEntryInfo: null,
  isError: null,
  isLoading: false,
};

export const liablityEntryReducer = createSlice({
  name: "liablityEntryReducer",
  initialState: liablityEntryReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLiablityEntry.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.liablityEntryList = action.payload;
    });
    builder.addCase(getLiablityEntryPayment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.liablityEntryPaymentList = action.payload;
    });
    builder.addCase(getLiablityEntryPayable.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.liablityEntryPayableList = action.payload;
    });
    builder.addMatcher(
      isAnyOf(
        createLiablityEntry.pending,
        getLiablityEntry.pending,
        getLiablityEntryPayable.pending,
        createLiablityEntryPayment.pending,
        getLiablityEntryPayment.pending
      ),
      (state) => {
        state.isLoading = false;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createLiablityEntry.rejected,
        getLiablityEntry.rejected,
        getLiablityEntryPayable.rejected,
        createLiablityEntryPayment.rejected,
        getLiablityEntryPayment.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createLiablityEntry.fulfilled,
        getLiablityEntry.fulfilled,
        createLiablityEntryPayment.fulfilled
      ),
      (state) => {
        state.liablityEntryInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});



const customerSalesLogReducerInitialState = {
  customerSalesLogOptions: [],
  customerSalesLogList: [],
  customerSalesLogInfo: null,
  isError: null,
  isLoading: false,
};

export const customerSalesLogReducer = createSlice({
  name: "customerSalesLogReducer",
  initialState: customerSalesLogReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomerSalesLogOptions.fulfilled, (state, action) => {
          state.customerSalesLogOptions = action.payload.data;
          state.isLoading = false;
        });
        builder.addCase(customerSalesLog.fulfilled, (state, action) => {
          state.customerSalesLogList = action.payload;
          state.customerSalesLogInfo = null;
          state.isLoading = false;
        });
    builder.addMatcher(
      isAnyOf(
        getCustomerSalesLogOptions.pending,
        customerSalesLog.pending,
      ),
      (state) => {
        state.isLoading = false;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getCustomerSalesLogOptions.rejected,
        customerSalesLog.rejected,
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        customerSalesLog.fulfilled,
      ),
      (state) => {
        state.customerSalesLogInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});
