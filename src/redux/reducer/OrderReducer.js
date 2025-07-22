import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";
import {
  createOrder,
  deleteOrderById,
  getAllOrder,
  getOrderById,
  updateOrderById,
  updateOrderStatus,
  orderAssign,
  openOrders,
  orderLink,
  orderStatusChange,
  getAssignedOrders,
  cancelOrders,
  deliverdOrders,
  getOrders,
  getRepairs,
  getAllOrderStatus,
  getOrderLinkList,
  getOrderDropdown,
  getRepairOrderDeliveryDetails,
  getRepairOrderList,
  getAllCustomerDeposits,
  getCustomerDepositByID,
  updateCustomerDepositByID,
  createCustomerDeposits,
  getAllPurchaseOrder,
  deletePurchaseOrderById,
  getPurchaseOrderStatusList,
  purchaseOrderStatusChange,
  getPurchaseOrderById,
  updatePurchaseOrderById,
  getPurchaseOrderPurchaseSoldDetails,
  getPurchaseCartItems,
  createPurchaseCartItem,
  removePurchaseCartItem
} from "../thunks/Order";

const orderReducerInitialState = {
  orderList: [],
  purchaseOrderList: [],
  purchaseCartList: null,
  purchaseOrderStatusList: [],
  purchaseOrderPurchaseSoldDetails: [],
  orderDropdown: [],
  orderInfo: null,
  purchaseOrderInfo: null,
  isError: null,
  isLoading: false,
  openOrdersList: [],
  jobOrderList: [],
  orderStatusList: [],
  orderLinkList: [],
  repairOrderList: [],
  repairOrderAllList:[],
};

export const orderReducer = createSlice({
  name: "orderReducer",
  initialState: orderReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllOrder.fulfilled, (state, action) => {
      state.orderList = action.payload;
      state.orderInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getAllPurchaseOrder.fulfilled, (state, action) => {
      state.purchaseOrderList = action.payload;
      state.purchaseOrderInfo = null;
      state.purchaseOrderPurchaseSoldDetails = [];
      state.isLoading = false;
    });
    builder.addCase(getPurchaseCartItems.fulfilled, (state, action) => {
      state.purchaseCartList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getPurchaseOrderById.fulfilled, (state, action) => {
      state.purchaseOrderInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getPurchaseOrderStatusList.fulfilled, (state, action) => {
      state.purchaseOrderStatusList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getPurchaseOrderPurchaseSoldDetails.fulfilled, (state, action) => {
      state.purchaseOrderPurchaseSoldDetails = action.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getRepairOrderDeliveryDetails.fulfilled, (state, action) => {
      state.repairOrderList = action.payload;
      state.orderInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getRepairOrderList.fulfilled, (state, action) => {
      state.repairOrderAllList = action.payload;
      state.orderInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getOrderById.fulfilled, (state, action) => {
      state.orderInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getOrderDropdown.fulfilled, (state, action) => {
      state.orderDropdown = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteOrderById.fulfilled, (state, action) => {
      toastsuccess("Order Deleted Successfully");
      state.orderInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      // toastsuccess("ORder Status changed Successfully");
      state.orderInfo = null;
      state.isLoading = false;
    });
    builder.addCase(orderAssign.fulfilled, (state, action) => {
      state.orderInfo = null;
      state.isLoading = false;
      state.openOrdersList = [];
    });
    builder.addCase(openOrders.fulfilled, (state, action) => {
      state.openOrdersList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAssignedOrders.fulfilled, (state, action) => {
      state.jobOrderList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.openOrdersList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getRepairs.fulfilled, (state, action) => {
      state.openOrdersList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(orderStatusChange.fulfilled, (state, action) => {
      toastsuccess("Order Status Updated Successfully");
      state.openOrdersList = [];
      state.isLoading = false;
    });
    builder.addCase(cancelOrders.fulfilled, (state, action) => {
      toastsuccess("Order Status Successfully");
      state.openOrdersList = [];
      state.isLoading = false;
    });
    builder.addCase(deliverdOrders.fulfilled, (state, action) => {
      toastsuccess("Order Status Successfully");
      state.openOrdersList = [];
      state.isLoading = false;
    });
    builder.addCase(getAllOrderStatus.fulfilled, (state, action) => {
      state.orderStatusList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(orderLink.fulfilled, (state, action) => {
      toastsuccess(action.payload.message);
      state.orderInfo = null;
      state.isLoading = false;
      state.openOrdersList = [];
    });

    builder.addCase(getOrderLinkList.fulfilled, (state, action) => {
      state.orderLinkList = action.payload;
      state.isLoading = false;
      if (action.payload.length) {
        toastsuccess("Order Detail Retrived Successfully");
      }
      //  else {
      //   toastfunc("Order Detail Is Not Available");
      // }
    });

    builder.addCase("orderLinkList/reset", (state) => {
      state.orderLinkList = [];
    });

    builder.addMatcher(
      isAnyOf(
        getAllOrder.pending,
        getOrderById.pending,
        createOrder.pending,
        updateOrderById.pending,
        deleteOrderById.pending,
        updateOrderStatus.pending,
        orderAssign.pending,
        openOrders.pending,
        cancelOrders.pending,
        deliverdOrders.pending,
        orderStatusChange.pending,
        getOrders.pending,
        getRepairs.pending,
        getAssignedOrders.pending,
        orderLink.pending,
        getOrderLinkList.pending,
        getOrderDropdown.pending,
        getRepairOrderDeliveryDetails.pending,
        getRepairOrderList.pending,
        getAllPurchaseOrder.pending,
        deletePurchaseOrderById.pending,
        getPurchaseOrderStatusList.pending,
        purchaseOrderStatusChange.pending,
        getPurchaseOrderById.pending,
        updatePurchaseOrderById.pending,
        getPurchaseOrderPurchaseSoldDetails.pending,
        createPurchaseCartItem.pending,
        removePurchaseCartItem.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllOrder.rejected,
        getOrderById.rejected,
        createOrder.rejected,
        updateOrderById.rejected,
        deleteOrderById.rejected,
        updateOrderStatus.rejected,
        orderAssign.rejected,
        openOrders.rejected,
        cancelOrders.rejected,
        deliverdOrders.rejected,
        orderStatusChange.rejected,
        getOrders.rejected,
        getRepairs.rejected,
        getAssignedOrders.rejected,
        orderLink.rejected,
        getOrderLinkList.rejected,
        getOrderDropdown.rejected,
        getRepairOrderDeliveryDetails.rejected,
        getRepairOrderList.rejected,
        getAllPurchaseOrder.rejected,
        deletePurchaseOrderById.rejected,
        getPurchaseOrderStatusList.rejected,
        purchaseOrderStatusChange.rejected,
        getPurchaseOrderById.rejected,
        updatePurchaseOrderById.rejected,
        getPurchaseOrderPurchaseSoldDetails.rejected,
        createPurchaseCartItem.rejected,
        removePurchaseCartItem.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllOrder.fulfilled,
        createOrder.fulfilled,
        updateOrderById.fulfilled,
        updateOrderStatus.fulfilled,
        orderAssign.fulfilled,
        openOrders.fulfilled,
        cancelOrders.fulfilled,
        deliverdOrders.fulfilled,
        orderStatusChange.fulfilled,
        getOrders.fulfilled,
        getRepairs.fulfilled,
        getAssignedOrders.fulfilled,
        orderLink.fulfilled,
        getRepairOrderDeliveryDetails.fulfilled,
        getRepairOrderList.fulfilled,
        deletePurchaseOrderById.fulfilled,
        purchaseOrderStatusChange.fulfilled,
        updatePurchaseOrderById.fulfilled,
        createPurchaseCartItem.fulfilled,
        removePurchaseCartItem.fulfilled
      ),
      (state) => {
        state.orderInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});



const customerDepositReducerInitialState = {
  customerDepositList: [],
  customerDepositInfo: null,
  isError: null,
  isLoading: false,
};

export const customerDepositReducer = createSlice({
  name: "customerDepositReducer",
  initialState: customerDepositReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCustomerDeposits.fulfilled, (state, action) => {
      state.customerDepositList = action.payload;
      state.customerDepositInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getCustomerDepositByID.fulfilled, (state, action) => {
      state.customerDepositInfo = action.payload.data;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getAllCustomerDeposits.pending,
        getCustomerDepositByID.pending,
        updateCustomerDepositByID.pending,
        createCustomerDeposits.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCustomerDeposits.rejected,
        getCustomerDepositByID.rejected,
        updateCustomerDepositByID.rejected,
        createCustomerDeposits.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        updateCustomerDepositByID.fulfilled,
        createCustomerDeposits.fulfilled
      ),
      (state) => {
        state.customerDepositInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});
