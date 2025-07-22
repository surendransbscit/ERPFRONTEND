import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";
import {
  cancelVoucherIssue,
  createCoupon,
  createDiscount,
  createGiftVoucher,
  createVoucherIssue,
  deleteCouponById,
  deleteDiscountById,
  deleteGiftVoucherById,
  deleteVoucherIssueById,
  getAllCoupon,
  getAllDiscount,
  getAllGiftVoucher,
  getAllVoucherIssue,
  getCouponById,
  getCouponOptions,
  getDiscountById,
  getDiscountOptions,
  getGiftVoucherById,
  getGiftVoucherOptions,
  getVoucherIssueById,
  getVoucherIssueDetails,
  getVoucherIssueStatusDetails,
  updateCouponById,
  updateDiscountById,
  updateGiftVoucherById,
  updateVoucherIssueById,
} from "../thunks/promotionManagement";

// discount

const promotionManagementDiscountReducerInitialState = {
  promotionManagementDiscountList: [],
  promotionManagementDiscountOptions: [],
  promotionManagementDiscountInfo: null,
  isError: null,
  isLoading: false,
};
export const promotionManagementDiscountReducer = createSlice({
  name: "promotionManagementDiscountReducer",
  initialState: promotionManagementDiscountReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllDiscount.fulfilled, (state, action) => {
      state.promotionManagementDiscountList = action.payload;
      state.promotionManagementDiscountInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getDiscountById.fulfilled, (state, action) => {
      state.promotionManagementDiscountInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(deleteDiscountById.fulfilled, (state, action) => {
      toastsuccess("Discount Deleted Successfully");
      state.promotionManagementDiscountInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getDiscountOptions.fulfilled, (state, action) => {
      state.promotionManagementDiscountOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllDiscount.pending,
        createDiscount.pending,
        getDiscountById.pending,
        updateDiscountById.pending,
        deleteDiscountById.pending,
        getDiscountOptions.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllDiscount.rejected,
        createDiscount.rejected,
        getDiscountById.rejected,
        updateDiscountById.rejected,
        deleteDiscountById.rejected,
        getDiscountOptions.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createDiscount.fulfilled,
        updateDiscountById.fulfilled,
        getAllDiscount.fulfilled
      ),
      (state) => {
        state.promotionManagementDiscountInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

// coupon
const promotionManagementCouponReducerInitialState = {
  promotionManagementCouponList: [],
  promotionManagementCouponOptions: [],
  promotionManagementCouponInfo: null,
  isError: null,
  isLoading: false,
};
export const promotionManagementCouponReducer = createSlice({
  name: "promotionManagementCouponReducer",
  initialState: promotionManagementCouponReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCoupon.fulfilled, (state, action) => {
      state.promotionManagementCouponList = action.payload;
      state.promotionManagementCouponInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCouponById.fulfilled, (state, action) => {
      state.promotionManagementCouponInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(deleteCouponById.fulfilled, (state, action) => {
      toastsuccess("Coupon Deleted Successfully");
      state.promotionManagementCouponInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCouponOptions.fulfilled, (state, action) => {
      state.promotionManagementCouponOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllCoupon.pending,
        createCoupon.pending,
        getCouponById.pending,
        updateCouponById.pending,
        deleteCouponById.pending,
        getCouponOptions.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCoupon.rejected,
        createCoupon.rejected,
        getCouponById.rejected,
        updateCouponById.rejected,
        deleteCouponById.rejected,
        getCouponOptions.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createCoupon.fulfilled,
        updateCouponById.fulfilled,
        getAllCoupon.fulfilled
      ),
      (state) => {
        state.promotionManagementCouponInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

// gift voucher

const promotionManagementGiftVoucherReducerInitialState = {
  promotionManagementGiftVoucherList: [],
  promotionManagementGiftVoucherOptions: [],
  promotionManagementGiftVoucherInfo: null,
  isError: null,
  isLoading: false,
};
export const promotionManagementGiftVoucherReducer = createSlice({
  name: "promotionManagementGiftVoucherReducer",
  initialState: promotionManagementGiftVoucherReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllGiftVoucher.fulfilled, (state, action) => {
      state.promotionManagementGiftVoucherList = action.payload;
      state.promotionManagementGiftVoucherInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getGiftVoucherById.fulfilled, (state, action) => {
      state.promotionManagementGiftVoucherInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(deleteGiftVoucherById.fulfilled, (state, action) => {
      toastsuccess("Gift Voucher Deleted Successfully");
      state.promotionManagementGiftVoucherInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getGiftVoucherOptions.fulfilled, (state, action) => {
      state.promotionManagementGiftVoucherOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllGiftVoucher.pending,
        createGiftVoucher.pending,
        getGiftVoucherById.pending,
        updateGiftVoucherById.pending,
        deleteGiftVoucherById.pending,
        getGiftVoucherOptions.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllGiftVoucher.rejected,
        createGiftVoucher.rejected,
        getGiftVoucherById.rejected,
        updateGiftVoucherById.rejected,
        deleteGiftVoucherById.rejected,
        getGiftVoucherOptions.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createGiftVoucher.fulfilled,
        updateGiftVoucherById.fulfilled,
        getAllGiftVoucher.fulfilled
      ),
      (state) => {
        state.promotionManagementGiftVoucherInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

// voucher issue

const promotionManagementVoucherIssueReducerInitialState = {
  promotionManagementVoucherIssueList: [],
  promotionManagementVoucherIssueOptions: [],
  promotionManagementVoucherIssueInfo: null,
  VoucherDetailsList: [],
  searchVoucherInfo: null,
  isError: null,
  isLoading: false,
};
export const promotionManagementVoucherIssueReducer = createSlice({
  name: "promotionManagementVoucherIssueReducer",
  initialState: promotionManagementVoucherIssueReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllVoucherIssue.fulfilled, (state, action) => {
      state.promotionManagementVoucherIssueList = action.payload;
      state.promotionManagementVoucherIssueInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getVoucherIssueById.fulfilled, (state, action) => {
      state.promotionManagementVoucherIssueInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(deleteVoucherIssueById.fulfilled, (state, action) => {
      toastsuccess(" Voucher Issue Deleted Successfully");
      state.promotionManagementVoucherIssueInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getVoucherIssueDetails.fulfilled, (state, action) => {
      state.searchVoucherInfo = action.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getVoucherIssueDetails.rejected, (state, action) => {
      state.searchVoucherInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getVoucherIssueStatusDetails.fulfilled, (state, action) => {
          state.VoucherDetailsList = action.payload;
          state.isLoading = false;
    });
    builder.addCase(cancelVoucherIssue.fulfilled, (state, action) => {
      state.promotionManagementVoucherIssueInfo = action.payload;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getAllVoucherIssue.pending,
        createVoucherIssue.pending,
        getVoucherIssueById.pending,
        updateVoucherIssueById.pending,
        deleteVoucherIssueById.pending,
        getVoucherIssueDetails.pending,
        cancelVoucherIssue.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllVoucherIssue.rejected,
        createVoucherIssue.rejected,
        getVoucherIssueById.rejected,
        updateVoucherIssueById.rejected,
        deleteVoucherIssueById.rejected,
        cancelVoucherIssue.rejected,
        getVoucherIssueStatusDetails.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createVoucherIssue.fulfilled,
        updateVoucherIssueById.fulfilled,
        getAllVoucherIssue.fulfilled,
        cancelVoucherIssue.fulfilled,
        getVoucherIssueStatusDetails.fulfilled
      ),
      (state) => {
        state.promotionManagementVoucherIssueInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});
