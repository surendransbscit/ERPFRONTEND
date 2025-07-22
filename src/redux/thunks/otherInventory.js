import { createAsyncThunk } from "@reduxjs/toolkit";
import otherInventoryAPI from "../api/OtherInventoryAPI";
import { DispatchErrorHandler } from "../configs";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";

//category

export const getAllOtherInventoryCategory = createAsyncThunk(
  "otherInventoryCategoryReducer/getAllOtherInventoryCategory",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_category.getAllOtherInventoryCategory(
          payload?.page,
          payload?.records
          ,payload?.search
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createOtherInventoryCategory = createAsyncThunk(
  "otherInventoryCategoryReducer/createOtherInventoryCategory",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_category.createOtherInventoryCategory(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOtherInventoryCategoryById = createAsyncThunk(
  "otherInventoryCategoryReducer/getOtherInventoryCategoryById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_category.getOtherInventoryCategoryById(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateOtherInventoryCategoryById = createAsyncThunk(
  "otherInventoryCategoryReducer/updateOtherInventoryCategoryById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_category.updateOtherInventoryCategoryById(
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

export const deleteOtherInventoryCategoryById = createAsyncThunk(
  "otherInventoryCategoryReducer/deleteOtherInventoryCategoryById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_category.deleteOtherInventoryCategoryById(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOtherInventoryCategoryOptions = createAsyncThunk(
  "otherInventoryCategoryReducer/getOtherInventoryCategoryOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_category.getOtherInventoryCategoryOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//size
export const getOtherInventorySize = createAsyncThunk(
  "otherInventorySizeReducer/getOtherInventorySize",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_size.getOtherInventorySize(
          payload?.page,
          payload?.records
          ,payload?.search
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createOtherInventorySize = createAsyncThunk(
  "otherInventorySizeReducer/createOtherInventorySize",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_size.createOtherInventorySize(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOtherInventorySizeById = createAsyncThunk(
  "otherInventorySizeReducer/getOtherInventorySizeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_size.getOtherInventorySizeById(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateOtherInventorySizeById = createAsyncThunk(
  "otherInventorySizeReducer/updateOtherInventorySizeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_size.updateOtherInventorySizeById(
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

export const deleteOtherInventorySizeById = createAsyncThunk(
  "otherInventorySizeReducer/deleteOtherInventorySizeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_size.deleteOtherInventorySizeById(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOtherInventorySizeOptions = createAsyncThunk(
  "otherInventorySizeReducer/getOtherInventorySizeOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_size.getOtherInventorySizeOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateOtherInventorySizeStatus = createAsyncThunk(
  "otherInventorySizeReducer/updateOtherInventorySizeStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_size.changeStatusOtherInventorySize(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//item
export const createOtherInventoryItem = createAsyncThunk(
  "OtherInventoryItemReducer/createOtherInventoryItem",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_item.createOtherInventoryItem(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllOtherInventoryItem = createAsyncThunk(
  "OtherInventoryItemReducer/getAllOtherInventoryItem",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_item.getAllOtherInventoryItem(
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

export const getOtherInventoryItemById = createAsyncThunk(
  "OtherInventoryItemReducer/getOtherInventoryItemById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_item.getOtherInventoryItemByID(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateOtherInventoryItemById = createAsyncThunk(
  "OtherInventoryItemReducer/updateOtherInventoryItemById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_item.updateOtherInventoryItemByID(
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

export const updateOtherInventoryItemStatus = createAsyncThunk(
  "OtherInventoryItemReducer/updateOtherInventoryItemStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_item.changeStatusOtherInventoryItem(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteOtherInventoryItemById = createAsyncThunk(
  "OtherInventoryItemReducer/deleteOtherInventoryItemById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_item.deleteOtherInventoryItemByID(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOtherInventoryItemOptions = createAsyncThunk(
  "OtherInventoryItemReducer/getOtherInventoryItemOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_item.getOtherInventoryItemOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Item Issue

export const getAllOtherInventoryItemIssue = createAsyncThunk(
  "otherInventoryItemIssueReducer/getAllOtherInventoryItemIssue",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_item_issue.getAllOtherInventoryItemIssue(
          payload?.page,
          payload?.records
          ,payload?.search
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createOtherInventoryItemIssue = createAsyncThunk(
  "otherInventoryItemIssueReducer/createOtherInventoryItemIssue",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_item_issue.createOtherInventoryItemIssue(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOtherInventoryItemIssueById = createAsyncThunk(
  "otherInventoryItemIssueReducer/getOtherInventoryItemIssueById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_item_issue.getOtherInventoryItemIssueById(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateOtherInventoryItemIssueById = createAsyncThunk(
  "otherInventoryItemIssueReducer/updateOtherInventoryItemIssueById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_item_issue.updateOtherInventoryItemIssueById(
          payload?.id,
          payload?.putData
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteOtherInventoryItemIssueById = createAsyncThunk(
  "otherInventoryItemIssueReducer/deleteOtherInventoryItemIssueById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_item_issue.deleteOtherInventoryItemIssueById(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const cancelOtherInventoryItemIssue = createAsyncThunk(
  "otherInventoryItemIssueReducer/cancelOtherInventoryItemIssue",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await otherInventoryAPI.other_inventory_item_issue.cancelOtherInventoryItemIssue(payload);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


//Purchase
export const createOtherInventoryPurchase = createAsyncThunk(
  "OtherInventoryPurchaseReducer/createOtherInventoryPurchase",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_purchase.createOtherInventoryPurchase(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllOtherInventoryPurchase = createAsyncThunk(
  "OtherInventoryPurchaseReducer/getAllOtherInventoryPurchase",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_purchase.getAllOtherInventoryPurchase(
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

export const cancelOtherInventoryPurchase = createAsyncThunk(
  "OtherInventoryPurchaseReducer/cancelOtherInventoryPurchase",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await otherInventoryAPI.other_inventory_purchase.cancelOtherInventoryPurchase(payload);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOtherInventoryPurchaseById = createAsyncThunk(
  "OtherInventoryPurchaseReducer/getOtherInventoryPurchaseById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_purchase.getOtherInventoryPurchaseByID(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateOtherInventoryPurchaseById = createAsyncThunk(
  "OtherInventoryPurchaseReducer/updateOtherInventoryPurchaseById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_purchase.updateOtherInventoryPurchaseByID(
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

export const updateOtherInventoryPurchaseStatus = createAsyncThunk(
  "OtherInventoryPurchaseReducer/updateOtherInventoryPurchaseStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_purchase.changeStatusOtherInventoryPurchase(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteOtherInventoryPurchaseById = createAsyncThunk(
  "OtherInventoryPurchaseReducer/deleteOtherInventoryPurchaseById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_purchase.deleteOtherInventoryPurchaseByID(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOtherInventoryPurchaseOptions = createAsyncThunk(
  "OtherInventoryPurchaseReducer/getOtherInventoryPurchaseOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await otherInventoryAPI.other_inventory_purchase.getOtherInventoryPurchaseOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
