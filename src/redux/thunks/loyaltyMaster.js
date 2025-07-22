import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import loyaltyMasterAPI from "../api/loyaltyMasterAPI";

//loyalty Tier
export const getLoyaltyTierOptions = createAsyncThunk(
  "LoyaltyTierReducer/getLoyaltyTierOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_tier.getLoyaltyTierOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllLoyaltyTier = createAsyncThunk(
  "LoyaltyTierReducer/getAllLoyaltyTier",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await loyaltyMasterAPI.loyalty_tier.getAllLoyaltyTier(
        payload?.page,
        payload?.records,
        payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createLoyaltyTier = createAsyncThunk(
  "LoyaltyTierReducer/createLoyaltyTier",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await loyaltyMasterAPI.loyalty_tier.createLoyaltyTier(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLoyaltyTierById = createAsyncThunk(
  "LoyaltyTierReducer/getLoyaltyTierById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await loyaltyMasterAPI.loyalty_tier.getLoyaltyTierById(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateLoyaltyTierById = createAsyncThunk(
  "LoyaltyTierReducer/updateLoyaltyTierById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_tier.updateLoyaltyTierById(
          payload?.id,
          payload?.putData
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteLoyaltyTierById = createAsyncThunk(
  "LoyaltyTierReducer/deleteLoyaltyTierById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_tier.deleteLoyaltyTierById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateLoyaltyTierStatus = createAsyncThunk(
  "LoyaltyTierReducer/updateLoyaltyTierStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_tier.updateLoyaltyTierStatus(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//loyalty settings
export const getLoyaltySettingsOptions = createAsyncThunk(
  "loyaltySettingsReducer/getLoyaltySettingsOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_settings.getLoyaltySettingsOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllLoyaltySettings = createAsyncThunk(
  "loyaltySettingsReducer/getAllLoyaltySettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_settings.getAllLoyaltySettings(
          payload?.page,
          payload?.records,
          payload?.search
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createLoyaltySettings = createAsyncThunk(
  "loyaltySettingsReducer/createLoyaltySettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_settings.createLoyaltySettings(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLoyaltySettingsById = createAsyncThunk(
  "loyaltySettingsReducer/getLoyaltySettingsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_settings.getLoyaltySettingsById(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateLoyaltySettingsById = createAsyncThunk(
  "loyaltySettingsReducer/updateLoyaltySettingsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_settings.updateLoyaltySettingsById(
          payload?.id,
          payload?.putData
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteLoyaltySettingsById = createAsyncThunk(
  "loyaltySettingsReducer/deleteLoyaltySettingsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_settings.deleteLoyaltySettingsById(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateLoyaltySettingsStatus = createAsyncThunk(
  "loyaltySettingsReducer/updateLoyaltySettingsStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_settings.updateLoyaltySettingsStatus(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//loyalty Customer
export const getLoyaltyCustomerOptions = createAsyncThunk(
  "loyaltyCustomerReducer/getLoyaltyCustomerOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_customer.getLoyaltyCustomerOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllLoyaltyCustomer = createAsyncThunk(
  "loyaltyCustomerReducer/getAllLoyaltyCustomer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_customer.getAllLoyaltyCustomer(
          payload?.page,
          payload?.records,
          payload?.search
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createLoyaltyCustomer = createAsyncThunk(
  "loyaltyCustomerReducer/createLoyaltyCustomer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_customer.createLoyaltyCustomer(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLoyaltyCustomerById = createAsyncThunk(
  "loyaltyCustomerReducer/getLoyaltyCustomerById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_customer.getLoyaltyCustomerById(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateLoyaltyCustomerById = createAsyncThunk(
  "loyaltyCustomerReducer/updateLoyaltyCustomerById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_customer.updateLoyaltyCustomerById(
          payload?.id,
          payload?.putData
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteLoyaltyCustomerById = createAsyncThunk(
  "loyaltyCustomerReducer/deleteLoyaltyCustomerById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_customer.deleteLoyaltyCustomerById(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateLoyaltyCustomerStatus = createAsyncThunk(
  "loyaltyCustomerReducer/updateLoyaltyCustomerStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_customer.updateLoyaltyCustomerStatus(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//loyalty Transaction
export const getLoyaltyTransactionOptions = createAsyncThunk(
  "loyaltyTransactionReducer/getLoyaltyTransactionOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_transactions.getLoyaltyTransactionsOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllLoyaltyTransaction = createAsyncThunk(
  "loyaltyTransactionReducer/getAllLoyaltyTransaction",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_transactions.getAllLoyaltyTransactions(
          payload?.page,
          payload?.records,
          payload?.search
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createLoyaltyTransaction = createAsyncThunk(
  "loyaltyTransactionReducer/createLoyaltyTransaction",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_transactions.createLoyaltyTransactions(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLoyaltyTransactionById = createAsyncThunk(
  "loyaltyTransactionReducer/getLoyaltyTransactionById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_transactions.getLoyaltyTransactionsById(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateLoyaltyTransactionById = createAsyncThunk(
  "loyaltyTransactionReducer/updateLoyaltyTransactionById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_transactions.updateLoyaltyTransactionsById(
          payload?.id,
          payload?.putData
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteLoyaltyTransactionById = createAsyncThunk(
  "loyaltyTransactionReducer/deleteLoyaltyTransactionById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_transactions.deleteLoyaltyTransactionsById(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateLoyaltyTransactionStatus = createAsyncThunk(
  "loyaltyTransactionReducer/updateLoyaltyTransactionStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_transactions.updateLoyaltyTransactionsStatus(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//loyalty Referrals
export const getLoyaltyReferralsOptions = createAsyncThunk(
  "loyaltyReferralsReducer/getLoyaltyReferralsOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_referrals.getLoyaltyReferralsOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllLoyaltyReferrals = createAsyncThunk(
  "loyaltyReferralsReducer/getAllLoyaltyReferrals",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_referrals.getAllLoyaltyReferrals(
          payload?.page,
          payload?.records,
          payload?.search
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createLoyaltyReferrals = createAsyncThunk(
  "loyaltyReferralsReducer/createLoyaltyReferrals",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_referrals.createLoyaltyReferrals(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLoyaltyReferralsById = createAsyncThunk(
  "loyaltyReferralsReducer/getLoyaltyReferralsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_referrals.getLoyaltyReferralsById(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateLoyaltyReferralsById = createAsyncThunk(
  "loyaltyReferralsReducer/updateLoyaltyReferralsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_referrals.updateLoyaltyReferralsById(
          payload?.id,
          payload?.putData
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteLoyaltyReferralsById = createAsyncThunk(
  "loyaltyReferralsReducer/deleteLoyaltyReferralsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_referrals.deleteLoyaltyReferralsById(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateLoyaltyReferralsStatus = createAsyncThunk(
  "loyaltyReferralsReducer/updateLoyaltyReferralsStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await loyaltyMasterAPI.loyalty_referrals.updateLoyaltyReferralsStatus(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
