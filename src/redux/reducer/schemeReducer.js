import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createScheme,
  createSchemeAccount,
  createSchemeClass,
  deleteSchemeAccountById,
  deleteSchemeById,
  deleteSchemeClassById,
  getActiveScheme,
  getActiveSchemeClass,
  getAllActiveScheme,
  getAllClosedSchemeAccount,
  getAllCustomerMultiScheme,
  getAllPaymentFormula,
  getAllScheme,
  getAllSchemeAccount,
  getAllSchemeClass,
  getCustomerAccount,
  getSchemeAccountById,
  getSchemeById,
  getSchemeClassById,
  schemeAccountCloseById,
  schemeAccountCloseRevertById,
  updateSchemeAccountById,
  updateSchemeById,
  updateSchemeClassById,
  updateSchemeClassStatus,
  updateSchemeStatus,
} from "../thunks/scheme";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";

export const schemeClassReducerInitialState = {
  schemeClassList: [],
  schemeClassInfo: null,
  isError: null,
  isLoading: false,
};

export const schemeClassReducer = createSlice({
  name: "schemeClassReducer",
  initialState: schemeClassReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllSchemeClass.fulfilled, (state, action) => {
      state.schemeClassList = action.payload;
      state.schemeClassInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getSchemeClassById.fulfilled, (state, action) => {
      state.schemeClassInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getActiveSchemeClass.fulfilled, (state, action) => {
      state.schemeClassList = action.payload;
      state.schemeClassInfo = null;
      state.isLoading = false;
    });
    builder.addCase(deleteSchemeClassById.fulfilled, (state, action) => {
      toastsuccess("Scheme Classification Deleted Successfully");
      state.schemeClassInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateSchemeClassStatus.fulfilled, (state, action) => {
      toastsuccess("Scheme Classification Status changed Successfully");
      state.schemeClassInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllSchemeClass.pending,
        getSchemeClassById.pending,
        createSchemeClass.pending,
        updateSchemeClassById.pending,
        getActiveSchemeClass.pending,
        deleteSchemeClassById.pending,
        updateSchemeClassStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllSchemeClass.rejected,
        getSchemeClassById.rejected,
        createSchemeClass.rejected,
        updateSchemeClassById.rejected,
        getActiveSchemeClass.rejected,
        deleteSchemeClassById.rejected,
        updateSchemeClassStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getActiveSchemeClass.fulfilled,
        getAllSchemeClass.fulfilled,
        createSchemeClass.fulfilled,
        updateSchemeClassById.fulfilled,
        deleteSchemeClassById.fulfilled,
        updateSchemeClassStatus.fulfilled
      ),
      (state) => {
        state.schemeClassInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

export const paymentFormulaReducerInitialState = {
  paymentFormulaList: [],
  isError: null,
  isLoading: false,
};

export const paymentFormulaReducer = createSlice({
  name: "paymentFormulaReducer",
  initialState: paymentFormulaReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPaymentFormula.fulfilled, (state, action) => {
      state.paymentFormulaList = action.payload;
      state.isLoading = false;
      state.isError = false;
    });

    builder.addMatcher(isAnyOf(getAllPaymentFormula.pending), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(
      isAnyOf(getAllPaymentFormula.rejected),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
  },
});

export const schemesReducerInitialState = {
  schemeList: [],
  activeSchemeList: [],
  customerMultiSchemeList: [],
  schemeInfo: null,
  isError: null,
  isLoading: false,
};

export const schemesReducer = createSlice({
  name: "schemesReducer",
  initialState: schemesReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllScheme.fulfilled, (state, action) => {
      state.schemeList = action.payload;
      state.schemeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getSchemeById.fulfilled, (state, action) => {
      state.schemeInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAllActiveScheme.fulfilled, (state, action) => {
      state.activeSchemeList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAllCustomerMultiScheme.fulfilled, (state, action) => {
      state.customerMultiSchemeList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getActiveScheme.fulfilled, (state, action) => {
      state.schemeList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteSchemeById.fulfilled, (state, action) => {
      toastsuccess("Scheme Deleted Successfully");
      state.schemeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateSchemeStatus.fulfilled, (state, action) => {
      toastsuccess("Scheme Status changed Successfully");
      state.schemeInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getActiveScheme.pending,
        getAllScheme.pending,
        getSchemeById.pending,
        createScheme.pending,
        updateSchemeById.pending,
        deleteSchemeById.pending,
        updateSchemeStatus.pending,
        getAllActiveScheme.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getActiveScheme.rejected,
        getAllScheme.rejected,
        getSchemeById.rejected,
        createScheme.rejected,
        updateSchemeById.rejected,
        deleteSchemeById.rejected,
        updateSchemeStatus.rejected,
        getAllActiveScheme.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getActiveScheme.fulfilled,
        createScheme.fulfilled,
        updateSchemeById.fulfilled,
        updateSchemeStatus.fulfilled
      ),
      (state) => {
        state.schemeInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

const schemeAccountReducerInitialState = {
  schemeAccountList: [],
  closedSchemeAccountList: [],
  customerAccountList: [],
  schemeAccountInfo: null,
  createSchemeAccountData: null,
  isError: null,
  isLoading: false,
};

export const schemeAccountReducer = createSlice({
  name: "schemeAccountReducer",
  initialState: schemeAccountReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllSchemeAccount.fulfilled, (state, action) => {
      state.schemeAccountList = action.payload;
      state.schemeAccountInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getAllClosedSchemeAccount.fulfilled, (state, action) => {
      state.closedSchemeAccountList = action.payload;
      state.schemeAccountInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getSchemeAccountById.fulfilled, (state, action) => {
      state.schemeAccountInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(createSchemeAccount.fulfilled, (state, action) => {
      state.createSchemeAccountData = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getCustomerAccount.fulfilled, (state, action) => {
      state.customerAccountList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteSchemeAccountById.fulfilled, (state, action) => {
      toastsuccess("Scheme Account Deleted Successfully");
      state.schemeAccountInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllSchemeAccount.pending,
        getSchemeAccountById.pending,
        createSchemeAccount.pending,
        updateSchemeAccountById.pending,
        getCustomerAccount.pending,
        schemeAccountCloseById.pending,
        getAllClosedSchemeAccount.pending,
        deleteSchemeAccountById.pending,
        schemeAccountCloseRevertById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllSchemeAccount.rejected,
        getSchemeAccountById.rejected,
        createSchemeAccount.rejected,
        updateSchemeAccountById.rejected,
        getCustomerAccount.rejected,
        schemeAccountCloseById.rejected,
        getAllClosedSchemeAccount.rejected,
        deleteSchemeAccountById.rejected,
        schemeAccountCloseRevertById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        // getAllSchemeAccount.fulfilled,
        getCustomerAccount.fulfilled,
        updateSchemeAccountById.fulfilled,
        schemeAccountCloseById.fulfilled,
        schemeAccountCloseRevertById.fulfilled
      ),
      (state) => {
        // state.schemeAccountInfo = null;
        state.createSchemeAccountData = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});
