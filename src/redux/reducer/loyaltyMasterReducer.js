import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";
import {
  createLoyaltyCustomer,
  createLoyaltyReferrals,
  createLoyaltySettings,
  createLoyaltyTier,
  createLoyaltyTransaction,
  deleteLoyaltyCustomerById,
  deleteLoyaltyReferralsById,
  deleteLoyaltySettingsById,
  deleteLoyaltyTierById,
  deleteLoyaltyTransactionById,
  getAllLoyaltyCustomer,
  getAllLoyaltyReferrals,
  getAllLoyaltySettings,
  getAllLoyaltyTier,
  getAllLoyaltyTransaction,
  getLoyaltyCustomerById,
  getLoyaltyCustomerOptions,
  getLoyaltyReferralsById,
  getLoyaltyReferralsOptions,
  getLoyaltySettingsById,
  getLoyaltySettingsOptions,
  getLoyaltyTierById,
  getLoyaltyTierOptions,
  getLoyaltyTransactionById,
  getLoyaltyTransactionOptions,
  updateLoyaltyCustomerById,
  updateLoyaltyCustomerStatus,
  updateLoyaltyReferralsById,
  updateLoyaltyReferralsStatus,
  updateLoyaltySettingsById,
  updateLoyaltySettingsStatus,
  updateLoyaltyTierById,
  updateLoyaltyTierStatus,
  updateLoyaltyTransactionById,
  updateLoyaltyTransactionStatus,
} from "../thunks/loyaltyMaster";

const loyaltyTierReducerInitialState = {
  loyaltytierOptions: [],
  loyaltyTierList: [],
  loyaltyTierInfo: null,
  isError: null,
  isLoading: false,
};

export const LoyaltyTierReducer = createSlice({
  name: "LoyaltyTierReducer",
  initialState: loyaltyTierReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLoyaltyTierOptions.fulfilled, (state, action) => {
      state.loyaltytierOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllLoyaltyTier.fulfilled, (state, action) => {
      state.loyaltyTierList = action.payload;
      state.loyaltyTierInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getLoyaltyTierById.fulfilled, (state, action) => {
      state.loyaltyTierInfo = action.payload?.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getLoyaltyTierOptions.pending,
        getAllLoyaltyTier.pending,
        createLoyaltyTier.pending,
        updateLoyaltyTierById.pending,
        deleteLoyaltyTierById.pending,
        updateLoyaltyTierStatus.pending,
        getLoyaltyTierById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getLoyaltyTierOptions.rejected,
        getAllLoyaltyTier.rejected,
        createLoyaltyTier.rejected,
        updateLoyaltyTierById.rejected,
        deleteLoyaltyTierById.rejected,
        updateLoyaltyTierStatus.rejected,
        getLoyaltyTierById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createLoyaltyTier.fulfilled,
        updateLoyaltyTierById.fulfilled,
        deleteLoyaltyTierById.fulfilled,
        updateLoyaltyTierStatus.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.loyaltyTierInfo = null;
        state.isError = false;
      }
    );
  },
});

const loyaltySettingsReducerInitialState = {
  loyaltySettingsOptions: [],
  loyaltySettingsList: [],
  loyaltySettingsInfo: null,
  isError: null,
  isLoading: false,
};

export const LoyaltySettingsReducer = createSlice({
  name: "LoyaltySettingsReducer",
  initialState: loyaltySettingsReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLoyaltySettingsOptions.fulfilled, (state, action) => {
      state.loyaltySettingsOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllLoyaltySettings.fulfilled, (state, action) => {
      state.loyaltySettingsList = action.payload;
      state.loyaltySettingsInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getLoyaltySettingsById.fulfilled, (state, action) => {
      state.loyaltySettingsInfo = action.payload?.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getLoyaltySettingsOptions.pending,
        getAllLoyaltySettings.pending,
        createLoyaltySettings.pending,
        updateLoyaltySettingsById.pending,
        deleteLoyaltySettingsById.pending,
        updateLoyaltySettingsStatus.pending,
        getLoyaltySettingsById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getLoyaltySettingsOptions.rejected,
        getAllLoyaltySettings.rejected,
        createLoyaltySettings.rejected,
        updateLoyaltySettingsById.rejected,
        deleteLoyaltySettingsById.rejected,
        updateLoyaltySettingsStatus.rejected,
        getLoyaltySettingsById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createLoyaltySettings.fulfilled,
        updateLoyaltySettingsById.fulfilled,
        deleteLoyaltySettingsById.fulfilled,
        updateLoyaltySettingsStatus.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.loyaltySettingsInfo = null;
        state.isError = false;
      }
    );
  },
});

const loyaltyCustomerReducerInitialState = {
  loyaltyCustomerOptions: [],
  loyaltyCustomerList: [],
  loyaltyCustomerInfo: null,
  isError: null,
  isLoading: false,
};

export const loyaltyCustomerReducer = createSlice({
  name: "loyaltyCustomerReducer",
  initialState: loyaltyCustomerReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLoyaltyCustomerOptions.fulfilled, (state, action) => {
      state.loyaltyCustomerOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllLoyaltyCustomer.fulfilled, (state, action) => {
      state.loyaltyCustomerList = action.payload;
      state.loyaltyCustomerInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getLoyaltyCustomerById.fulfilled, (state, action) => {
      state.loyaltyCustomerInfo = action.payload?.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getLoyaltyCustomerOptions.pending,
        getAllLoyaltyCustomer.pending,
        createLoyaltyCustomer.pending,
        updateLoyaltyCustomerById.pending,
        deleteLoyaltyCustomerById.pending,
        updateLoyaltyCustomerStatus.pending,
        getLoyaltyCustomerById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getLoyaltyCustomerOptions.rejected,
        getAllLoyaltyCustomer.rejected,
        createLoyaltyCustomer.rejected,
        updateLoyaltyCustomerById.rejected,
        deleteLoyaltyCustomerById.rejected,
        updateLoyaltyCustomerStatus.rejected,
        getLoyaltyCustomerById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createLoyaltyCustomer.fulfilled,
        updateLoyaltyCustomerById.fulfilled,
        deleteLoyaltyCustomerById.fulfilled,
        updateLoyaltyCustomerStatus.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.loyaltyCustomerInfo = null;
        state.isError = false;
      }
    );
  },
});

const loyaltyTransactionReducerInitialState = {
  loyaltyTransactionOptions: [],
  loyaltyTransactionList: [],
  loyaltyTransactionInfo: null,
  isError: null,
  isLoading: false,
};

export const loyaltyTransactionReducer = createSlice({
  name: "loyaltyTransactionReducer",
  initialState: loyaltyTransactionReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLoyaltyTransactionOptions.fulfilled, (state, action) => {
      state.loyaltyTransactionOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllLoyaltyTransaction.fulfilled, (state, action) => {
      state.loyaltyTransactionList = action.payload;
      state.loyaltyTransactionInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getLoyaltyTransactionById.fulfilled, (state, action) => {
      state.loyaltyTransactionInfo = action.payload?.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getLoyaltyTransactionOptions.pending,
        getAllLoyaltyTransaction.pending,
        createLoyaltyTransaction.pending,
        updateLoyaltyTransactionById.pending,
        deleteLoyaltyTransactionById.pending,
        updateLoyaltyTransactionStatus.pending,
        getLoyaltyTransactionById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getLoyaltyTransactionOptions.rejected,
        getAllLoyaltyTransaction.rejected,
        createLoyaltyTransaction.rejected,
        updateLoyaltyTransactionById.rejected,
        deleteLoyaltyTransactionById.rejected,
        updateLoyaltyTransactionStatus.rejected,
        getLoyaltyTransactionById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createLoyaltyTransaction.fulfilled,
        updateLoyaltyTransactionById.fulfilled,
        deleteLoyaltyTransactionById.fulfilled,
        updateLoyaltyTransactionStatus.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.loyaltyTransactionInfo = null;
        state.isError = false;
      }
    );
  },
});

const loyaltyReferralsReducerInitialState = {
  loyaltyReferralsOptions: [],
  loyaltyReferralsList: [],
  loyaltyReferralsInfo: null,
  isError: null,
  isLoading: false,
};

export const loyaltyReferralsReducer = createSlice({
  name: "loyaltyReferralsReducer",
  initialState: loyaltyReferralsReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLoyaltyReferralsOptions.fulfilled, (state, action) => {
      state.loyaltyReferralsOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllLoyaltyReferrals.fulfilled, (state, action) => {
      state.loyaltyReferralsList = action.payload;
      state.loyaltyReferralsInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getLoyaltyReferralsById.fulfilled, (state, action) => {
      state.loyaltyReferralsInfo = action.payload?.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getLoyaltyReferralsOptions.pending,
        getAllLoyaltyReferrals.pending,
        createLoyaltyReferrals.pending,
        updateLoyaltyReferralsById.pending,
        deleteLoyaltyReferralsById.pending,
        updateLoyaltyReferralsStatus.pending,
        getLoyaltyReferralsById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getLoyaltyReferralsOptions.rejected,
        getAllLoyaltyReferrals.rejected,
        createLoyaltyReferrals.rejected,
        updateLoyaltyReferralsById.rejected,
        deleteLoyaltyReferralsById.rejected,
        updateLoyaltyReferralsStatus.rejected,
        getLoyaltyReferralsById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createLoyaltyReferrals.fulfilled,
        updateLoyaltyReferralsById.fulfilled,
        deleteLoyaltyReferralsById.fulfilled,
        updateLoyaltyReferralsStatus.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.loyaltyReferralsInfo = null;
        state.isError = false;
      }
    );
  },
});
