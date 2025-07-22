// import { createSlice, isAnyOf } from "@reduxjs/toolkit";
// import { getSupplierRateCut } from "../thunks/purchaseDashboard";

// const purchaseDashboardInitialState = {
//   supplierRateCutList: [],
//   isError: null,
//   isLoading: false,
// };

// export const purchaseDashboardReducer = createSlice({
//   name: "purchaseDashboardReducer",
//   initialState: purchaseDashboardInitialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(getSupplierRateCut.fulfilled, (state, action) => {
//       state.supplierRateCutList = action?.payload?.data;
//       state.isLoading = false;
//     });
//     builder.addMatcher(isAnyOf(getSupplierRateCut.pending), (state) => {
//       state.isLoading = true;
//     });
//     builder.addMatcher(
//       isAnyOf(getSupplierRateCut.rejected),
//       (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//       }
//     );
//     builder.addMatcher(isAnyOf(), (state) => {
//       state.isLoading = false;
//       state.isError = false;
//     });
//   },
// });

import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getSupplierRateCut,
  getSupplierListRateCut,
  getSupplierWisePurchase,
  getPurchaseDetailList,
} from "../thunks/purchaseDashboard";

const purchaseDashboardInitialState = {
  supplierRateCutList: [],
  supplierListRateCut: [],
  supplierWisePurchase: [],
  purchaseDetailList: [],
  isError: null,
  isLoading: false,
};

export const purchaseDashboardReducer = createSlice({
  name: "purchaseDashboardReducer",
  initialState: purchaseDashboardInitialState,
  reducers: {},
  extraReducers: (builder) => {
    
    builder.addCase(getSupplierRateCut.fulfilled, (state, action) => {
      state.supplierRateCutList = action?.payload?.data || [];
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(getSupplierListRateCut.fulfilled, (state, action) => {
      state.supplierListRateCut = action?.payload?.data || [];
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(getSupplierWisePurchase.fulfilled, (state, action) => {
      state.supplierWisePurchase = action?.payload?.data || [];
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(getPurchaseDetailList.fulfilled, (state, action) => {
      state.purchaseDetailList = action?.payload?.data || [];
      state.isLoading = false;
      state.isError = false;
    });

    // Handle pending states for all thunks
    builder.addMatcher(
      isAnyOf(
        getSupplierRateCut.pending,
        getSupplierListRateCut.pending,
        getSupplierWisePurchase.pending,
        getPurchaseDetailList.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );

    // Handle rejected states for all thunks
    builder.addMatcher(
      isAnyOf(
        getSupplierRateCut.rejected,
        getSupplierListRateCut.rejected,
        getSupplierWisePurchase.rejected,
        getPurchaseDetailList.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message || "An error occurred";
      }
    );
  },
});

export default purchaseDashboardReducer.reducer;
