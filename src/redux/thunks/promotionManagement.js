import { createAsyncThunk } from "@reduxjs/toolkit";
import promotionManagementAPI from "../api/promotionManagementAPI";
import { DispatchErrorHandler } from "../configs";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";

// discount

export const getAllDiscount = createAsyncThunk(
  "promotionManagementDiscountReducer/getAllDiscount",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_discount.getAllDiscount(
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

export const createDiscount = createAsyncThunk(
  "promotionManagementDiscountReducer/createDiscount",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_discount.createDiscount(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDiscountById = createAsyncThunk(
  "promotionManagementDiscountReducer/getDiscountById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_discount.getDiscountById(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateDiscountById = createAsyncThunk(
  "promotionManagementDiscountReducer/updateDiscountById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_discount.updateDiscountById(
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

export const deleteDiscountById = createAsyncThunk(
  "promotionManagementDiscountReducer/deleteDiscountById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_discount.deleteDiscountById(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDiscountOptions = createAsyncThunk(
  "promotionManagementDiscountReducer/getDiscountOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_discount.getDiscountOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

// coupon

export const getAllCoupon = createAsyncThunk(
  "promotionManagementCouponReducer/getAllCoupon",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_coupon.getAllCoupon(
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

export const createCoupon = createAsyncThunk(
  "promotionManagementCouponReducer/createCoupon",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_coupon.createCoupon(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCouponById = createAsyncThunk(
  "promotionManagementCouponReducer/getCouponById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_coupon.getCouponById(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateCouponById = createAsyncThunk(
  "promotionManagementCouponReducer/updateCouponById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_coupon.updateCouponById(
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

export const deleteCouponById = createAsyncThunk(
  "promotionManagementCouponReducer/deleteCouponById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_coupon.deleteCouponById(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCouponOptions = createAsyncThunk(
  "promotionManagementCouponReducer/getCouponOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_coupon.getCouponOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

// gift voucher

export const getAllGiftVoucher = createAsyncThunk(
  "promotionManagementGiftVoucherReducer/getAllGiftVoucher",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_gift_voucher.getAllGiftVoucher(
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

export const createGiftVoucher = createAsyncThunk(
  "promotionManagementGiftVoucherReducer/createGiftVoucher",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_gift_voucher.createGiftVoucher(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getGiftVoucherById = createAsyncThunk(
  "promotionManagementGiftVoucherReducer/getGiftVoucherById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_gift_voucher.getGiftVoucherByID(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateGiftVoucherById = createAsyncThunk(
  "promotionManagementGiftVoucherReducer/updateGiftVoucherById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_gift_voucher.updateGiftVoucherByID(
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

export const deleteGiftVoucherById = createAsyncThunk(
  "promotionManagementGiftVoucherReducer/deleteGiftVoucherById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_gift_voucher.deleteGiftVoucherByID(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getGiftVoucherOptions = createAsyncThunk(
  "promotionManagementGiftVoucherReducer/getGiftVoucherOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_gift_voucher.getGiftVoucherOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

// voucher issue

export const getAllVoucherIssue = createAsyncThunk(
  "promotionManagementVoucherIssueReducer/getAllVoucherIssue",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_voucher_issue.getAllVoucherIssue(
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

export const createVoucherIssue = createAsyncThunk(
  "promotionManagementVoucherIssueReducer/createVoucherIssue",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_voucher_issue.createVoucherIssue(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getVoucherIssueById = createAsyncThunk(
  "promotionManagementVoucherIssueReducer/getVoucherIssueById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_voucher_issue.getVoucherIssueByID(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateVoucherIssueById = createAsyncThunk(
  "promotionManagementVoucherIssueReducer/updateVoucherIssueById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_voucher_issue.updateVoucherIssueByID(
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

export const deleteVoucherIssueById = createAsyncThunk(
  "promotionManagementVoucherIssueReducer/deleteVoucherIssueById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_voucher_issue.deleteVoucherIssueByID(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const cancelVoucherIssue = createAsyncThunk(
  "promotionManagementVoucherIssueReducer/cancelVoucherIssue",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_voucher_issue.cancelVoucherIssue(
          payload
        );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getVoucherIssueDetails = createAsyncThunk(
  "promotionManagementVoucherIssueReducer/getVoucherIssueDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_voucher_issue.getVoucherIssueDetails(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getVoucherIssueStatusDetails = createAsyncThunk(
  "promotionManagementVoucherIssueReducer/getVoucherIssueStatusDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await promotionManagementAPI.promotion_management_voucher_issue.getVoucherIssueStatusDetails(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
