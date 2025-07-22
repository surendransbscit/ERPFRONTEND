import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getTagCodeBySearch,
  createLot,
  getActiveLot,
  getLotList,
  createTag,
  getLotAvailableDetails,
  getTagDetailsByCode,
  getTagList,
  geLotDetailById,
  updateLot,
  closeLot,
  getTagFilterdedData,
  getTagEstimatedData,
  updateBulkTagEdit,
  updateTag,
  deleteTag,
  createStockTransfer,
  getStockTransferList,
  createApproval,
  getApprovalList,
  getStockList,
  getNonTagStock,
  cancelStockTransfer,
  createTagScanAudit,
  closeTagScanAudit,
  getPartlySoldTagDetailsByCode,
  assignTagToContainer,
  getTagContainerList,
  createContainerScanAudit,
  closeContainerScanAudit,
  printLotQRCode,
  printBulkTag,
  getLogProductDetails,
  getOldMetalStock,
  getSalesReturnStock,
  getPartlySalesStock,
  createLotIssueReceiptForm,
  getLotStockList,
  getTagStockList,
  getLotIssueReceiptList,
  getTagIssueReceiptList,
  getLotNonStockList,
  getTagSearchDetails,
  createLotNonTagInwardForm,
  getNonTagInwardList,
  UpdatelotClose,
  getStockIssuedDetails,
  getLotBalanceStockList,
  createLotMerge
} from "../thunks/inventory";
import { toastfunc, toastsuccess } from "../../components/sds-toast-style/toast-style";

export const lotReducerInitialState = {
  activeLot: [],
  lotList: [],
  lotItemList: [],
  lotProductDetails: [],
  nonTagStock: [],
  lotInfo: null,
  lotItemDetails: null,
  isError: null,
  isLoading: false,
  lotIssueReceiptList: [],
  nonTagInwardList: [],
  lotBalanceList : [],
  nonTagLotStock: null,
};

export const lotReducer = createSlice({
  name: "lotReducer",
  initialState: lotReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActiveLot.fulfilled, (state, action) => {
      state.activeLot = action.payload;
      state.isLoading = false;
      state.lotItemDetails = null;
    });
    builder.addCase(getLotStockList.fulfilled, (state, action) => {
      state.lotItemList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getNonTagInwardList.fulfilled, (state, action) => {
      state.nonTagInwardList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getLotIssueReceiptList.fulfilled, (state, action) => {
      state.lotIssueReceiptList = action.payload;
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(getLotNonStockList.fulfilled, (state, action) => {
      state.nonTagLotStock = action.payload;
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(getLogProductDetails.fulfilled, (state, action) => {
      state.lotProductDetails = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getLotList.fulfilled, (state, action) => {
      state.lotList = action.payload;
      state.lotInfo = null;
      state.isLoading = false;
      state.lotItemDetails = null;
    });
    builder.addCase(getLotAvailableDetails.fulfilled, (state, action) => {
      state.lotInfo = action.payload;
      state.isLoading = false;
      state.lotItemDetails = null;
    });
    builder.addCase(geLotDetailById.fulfilled, (state, action) => {
      state.lotItemDetails = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getNonTagStock.fulfilled, (state, action) => {
      state.nonTagStock = action.payload;
      state.isLoading = false;
    });

    builder.addCase(createLot.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(createLotIssueReceiptForm.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(createLotNonTagInwardForm.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updateLot.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(closeLot.fulfilled, (state, action) => {
      state.isLoading = false;
    });

      builder.addCase(UpdatelotClose.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getLotBalanceStockList.fulfilled, (state, action) => {
      state.lotBalanceList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(createLotMerge.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        createLot.pending,
        getLotList.pending,
        getLotAvailableDetails.pending,
        geLotDetailById.pending,
        closeLot.pending,
        UpdatelotClose.pending,
        getNonTagStock.pending,
        printLotQRCode.pending,
        getLogProductDetails.pending,
        getLotIssueReceiptList.pending,
        getLotNonStockList.pending,
        createLotNonTagInwardForm.pending,
        getNonTagInwardList.pending,
        getLotBalanceStockList.pending,
        createLotMerge.pending,
      ),
      (state) => {
        state.isLoading = true;
        state.lotInfo = null;
        state.lotItemDetails = null;
        state.nonTagLotStock = null;

      }
    );
    builder.addMatcher(
      isAnyOf(
        createLot.rejected,
        getLotList.rejected,
        getActiveLot.rejected,
        getLotAvailableDetails.rejected,
        geLotDetailById.rejected,
        closeLot.rejected,
        UpdatelotClose.rejected,
        getNonTagStock.rejected,
        printLotQRCode.rejected,
        getLogProductDetails.rejected,
        getLotIssueReceiptList.rejected,
        getLotNonStockList.rejected,
        createLotNonTagInwardForm.rejected,
        getNonTagInwardList.rejected,
        getLotBalanceStockList.rejected,
        createLotMerge.rejected,
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.lotInfo = null;
        state.lotItemDetails = null;
        state.nonTagLotStock = null;

      }
    );
    builder.addMatcher(
      isAnyOf(
        createLot.fulfilled,
        getActiveLot.fulfilled,
        getLotAvailableDetails.fulfilled,
        closeLot.fulfilled,
        UpdatelotClose.fulfilled,
        getNonTagStock.fulfilled,
        printLotQRCode.fulfilled,
        getLotNonStockList.fulfilled,
        createLotNonTagInwardForm.fulfilled,
        getNonTagInwardList.fulfilled,
        getLotBalanceStockList.fulfilled,
        createLotMerge.fulfilled,
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

export const tagReducerInitialState = {
  tagInfo: null,
  isError: null,
  isLoading: false,
  lotDetails: {},
  tagList: [],
  tagContainerList: [],
  tagStockList:[],
  tagIssueReceiptList:[],
  tagFilteredDetails : [],
};

export const tagReducer = createSlice({
  name: "tagReducer",
  initialState: tagReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createTag.fulfilled, (state, action) => {
      state.lotDetails = action.payload;
      state.isLoading = false;
    });

    builder.addCase(updateTag.fulfilled, (state, action) => {
      state.lotDetails = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getTagDetailsByCode.fulfilled, (state, action) => {
      state.tagInfo = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getTagSearchDetails.fulfilled, (state, action) => {
      state.tagFilteredDetails = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getTagList.fulfilled, (state, action) => {
      state.tagList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getTagContainerList.fulfilled, (state, action) => {
      state.tagContainerList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getTagStockList.fulfilled, (state, action) => {
      state.tagStockList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getTagIssueReceiptList.fulfilled, (state, action) => {
      state.tagIssueReceiptList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getTagCodeBySearch.fulfilled, (state, action) => {
      state.tagList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getPartlySoldTagDetailsByCode.fulfilled, (state, action) => {
      state.tagList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(deleteTag.fulfilled, (state, action) => {
      state.lotDetails = action.payload;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        createTag.pending,
        updateTag.pending,
        getTagDetailsByCode.pending,
        getTagList.pending,
        deleteTag.pending,
        getTagCodeBySearch.pending,
        assignTagToContainer.pending,
        getTagContainerList.pending,
        getTagStockList.pending,
        getTagIssueReceiptList.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        createTag.rejected,
        updateTag.rejected,
        getTagDetailsByCode.rejected,
        getTagList.rejected,
        deleteTag.rejected,
        getTagCodeBySearch.rejected,
        getPartlySoldTagDetailsByCode.rejected,
        assignTagToContainer.rejected,
        getTagContainerList.rejected,
        getTagStockList.rejected,
        getTagIssueReceiptList.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createTag.fulfilled,
        updateTag.fulfilled,
        getTagDetailsByCode.fulfilled,
        getTagList.fulfilled,
        deleteTag.fulfilled,
        getTagCodeBySearch.fulfilled,
        getPartlySoldTagDetailsByCode.fulfilled,
        assignTagToContainer.fulfilled,
        getTagIssueReceiptList.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

export const tagBulkEditReducerInitialState = {
  isError: null,
  isLoading: false,
  tagList: [],
};
export const tagBulkEditReducer = createSlice({
  name: "tagBulkEditReducer",
  initialState: tagBulkEditReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTagFilterdedData.fulfilled, (state, action) => {
      console.log(action.payload);
      state.tagList = action.payload;
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(getTagEstimatedData.fulfilled, (state, action) => {
      console.log(action.payload);
      state.tagList = action.payload;
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(updateBulkTagEdit.fulfilled, (state, action) => {
      state.tagList = [];
      state.isLoading = false;
      state.isError = false;
      toastsuccess("Tag Updated SuccessFully");
    });
    builder.addMatcher(
      isAnyOf(
        updateBulkTagEdit.pending,
        getTagFilterdedData.pending,
        getTagEstimatedData.pending,
        printBulkTag.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        updateBulkTagEdit.rejected,
        getTagFilterdedData.rejected,
        getTagEstimatedData.rejected,
        printBulkTag.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        updateBulkTagEdit.fulfilled,
        getTagFilterdedData.fulfilled,
        getTagEstimatedData.fulfilled,
        printBulkTag.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

export const stockTransferReducerInitialState = {
  stockTransferList: [],
  oldMetalList: [],
  partlySoldList: [],
  salesReturnList: [],
  stockIssuedList: [],
  stockTransferInfo: null,
  isError: null,
  isLoading: false,
};

export const stockTransferReducer = createSlice({
  name: "stockTransferReducer",
  initialState: stockTransferReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createStockTransfer.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getStockTransferList.fulfilled, (state, action) => {
      state.stockTransferList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getStockIssuedDetails.fulfilled, (state, action) => {
      state.stockIssuedList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getPartlySalesStock.fulfilled, (state, action) => {
      state.partlySoldList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getSalesReturnStock.fulfilled, (state, action) => {
      state.salesReturnList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getOldMetalStock.fulfilled, (state, action) => {
      state.oldMetalList = action.payload;
      state.isLoading = false;
    });

    builder.addMatcher(isAnyOf(createStockTransfer.pending,getStockIssuedDetails.pending, getStockTransferList.pending,getOldMetalStock.pending,getSalesReturnStock.pending,getPartlySalesStock.pending ), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(createStockTransfer.rejected,getStockIssuedDetails.rejected,getStockTransferList.rejected,getOldMetalStock.rejected,getSalesReturnStock.rejected,getPartlySalesStock.rejected), (state, action) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addMatcher(isAnyOf(createStockTransfer.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});

export const ApprovalReducerInitialState = {
  approvalList: [],
  approvalInfo: null,
  isError: null,
  isLoading: false,
  stockList: [],
};

export const approvalReducer = createSlice({
  name: "approvalReducer",
  initialState: ApprovalReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createApproval.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(cancelStockTransfer.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getStockList.fulfilled, (state, action) => {
      state.stockList = action.payload;
      state.isLoading = false;
      if (action.payload?.list?.length > 0) {
        toastsuccess(" Stock Detail Retrived Successfully");
      } else {
        toastfunc("Stock Detail Is Not Available");
      }
    });
    builder.addMatcher(isAnyOf(createApproval.pending, getStockList.pending, cancelStockTransfer.pending), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(
      isAnyOf(createApproval.rejected, getStockList.rejected, cancelStockTransfer.rejected),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(createApproval.fulfilled, cancelStockTransfer.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});

export const tagAuditInitialState = {
  isError: null,
  isLoading: false,
  tagList: {},
  containerTagDetails: [],
};
export const tagAuditReducer = createSlice({
  name: "tagAuditReducer",
  initialState: tagAuditInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createTagScanAudit.fulfilled, (state, action) => {
      state.tagList = action.payload.data;
      state.isLoading = false;
      state.isError = false;
      toastsuccess(action.payload?.message);
    });
    builder.addCase(closeTagScanAudit.fulfilled, (state, action) => {
      state.tagList = {};
      state.isLoading = false;
      state.isError = false;
      toastsuccess(action.payload?.message);
    });
    builder.addCase(closeContainerScanAudit.fulfilled, (state, action) => {
      state.containerTagDetails = {};
      state.isLoading = false;
      state.isError = false;
      toastsuccess(action.payload?.message);
    });
    builder.addCase(createContainerScanAudit.fulfilled, (state, action) => {
      state.containerTagDetails = action.payload;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        closeTagScanAudit.pending,
        createContainerScanAudit.pending,
        createTagScanAudit.pending,
        closeContainerScanAudit.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        createTagScanAudit.rejected,
        closeTagScanAudit.rejected,
        createContainerScanAudit.rejected,
        closeContainerScanAudit.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createTagScanAudit.fulfilled,
        closeTagScanAudit.fulfilled,
        createContainerScanAudit.fulfilled,
        closeContainerScanAudit.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});
