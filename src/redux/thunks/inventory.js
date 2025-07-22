import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import inventoryAPI from "../api/inventoryAPI";
import { toastfunc, toastsuccess } from "../../components/sds-toast-style/toast-style";

//Lot

export const getActiveLot = createAsyncThunk("lotReducer/getActiveLot", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await inventoryAPI.lot.getActiveLot(payload);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getLotList = createAsyncThunk("lotReducer/getLotList", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await inventoryAPI.lot.getLotList(payload);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const createLot = createAsyncThunk("lotReducer/createLot", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await inventoryAPI.lot.createLot(payload);
    console.log(response.data);
    toastsuccess(response.data.message);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const updateLot = createAsyncThunk("lotReducer/updateLot", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await inventoryAPI.lot.updateLot(payload?.id, payload?.putData);
    console.log(response.data);
    toastsuccess(response.data.message);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getLotAvailableDetails = createAsyncThunk(
  "lotReducer/getLotAvailableDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.lot.getLotAvailableDetails(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLogProductDetails = createAsyncThunk(
  "lotReducer/getLogProductDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.lot.getLogProductDetails(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const geLotDetailById = createAsyncThunk(
  "lotReducer/geLotDetailById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.lot.geLotDetailById(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const printLotQRCode = createAsyncThunk(
  "lotReducer/printLotQRCode",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.lot.printLotQRCode(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const closeLot = createAsyncThunk("lotReducer/closeLot", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await inventoryAPI.lot.closeLot(payload?.id);
    toastsuccess(response.data.message);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const UpdatelotClose = createAsyncThunk("lotReducer/UpdatelotClose", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await inventoryAPI.lot.UpdatelotClose(payload?.id);
    toastsuccess(response.data.message);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getNonTagStock = createAsyncThunk(
  "lotReducer/getNonTagStock",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.lot.getNonTagStock(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getOldMetalStock = createAsyncThunk(
  "stockTransferReducer/getOldMetalStock",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.stockTransfer.getOldMetalStock(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const detailStockTransferPrint = createAsyncThunk(
  "stockTransferReducer/detailStockTransferPrint",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.stockTransfer.detailStockTransferPrint(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getSalesReturnStock = createAsyncThunk(
  "stockTransferReducer/getSalesReturnStock",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.stockTransfer.getSalesReturnStock(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPartlySalesStock = createAsyncThunk(
  "stockTransferReducer/getPartlySalesStock",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.stockTransfer.getPartlySalesStock(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Tagging
export const createTag = createAsyncThunk("tagReducer/createTag", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await inventoryAPI.tag.createTag(payload);
    toastsuccess(response.data.message);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const assignTagToContainer = createAsyncThunk(
  "tagReducer/assignTagToContainer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tag.assignToContainer(payload);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getTagContainerList = createAsyncThunk(
  "tagReducer/tagContainerList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tag.tagContainerList(payload);
      // toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateTag = createAsyncThunk("tagReducer/updateTag", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await inventoryAPI.tag.updateTag(payload);
    console.log(response.data);
    toastsuccess(response.data.message);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const deleteTag = createAsyncThunk("tagReducer/deleteTag", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await inventoryAPI.tag.deleteTag(payload.tag_id, payload);
    console.log(response.data);
    toastsuccess(response.data.message);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getTagDetailsByCode = createAsyncThunk(
  "tagReducer/getTagDetailsByCode",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tag.getTagDetailsByCode(payload);
      console.log(response.data);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
        //toastfunc(error?.response?.data?.message);
        console.error("Error fetching tag details by code:", error);
        DispatchErrorHandler(error);
        return rejectWithValue(error);
    }
  }
);

export const getTagSearchDetails = createAsyncThunk(
  "tagReducer/getTagSearchDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tag.getTagSearchDetails(payload);
      console.log(response.data);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      toastfunc(error?.response?.data?.message);
      // DispatchErrorHandler(error);
      // return rejectWithValue(error);
    }
  }
);

export const getTagList = createAsyncThunk("tagReducer/getTagList", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await inventoryAPI.tag.getTagList(payload?.page, payload?.records,payload,payload?.search);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getPartlySoldTagDetailsByCode = createAsyncThunk(
  "tagReducer/getPartlySoldTagDetailsByCode",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tag.getPartlySoldTagDetailsByCode(payload.tagCode, payload.idBranch);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getTagFilterdedData = createAsyncThunk(
  "tagBulkEditReducer/getTagFilterdedData",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tagBulkEdit.getTagFilterdedData(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getTagEstimatedData = createAsyncThunk(
  "tagBulkEditReducer/getTagEstimatedData",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tagBulkEdit.getTagEstimatedData(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const printBulkTag = createAsyncThunk(
  "tagBulkEditReducer/printBulkTag",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tagBulkEdit.printBulkTag(payload);
      return response?.data || null;
    } catch (error) {
      if (error?.response?.data?.message !== undefined && error?.response?.data?.message?.includes("already")) {
        // toastfunc(response?.data?.message);
        payload?.setOtpModal(true);
      }
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateBulkTagEdit = createAsyncThunk(
  "tagBulkEditReducer/updateBulkTagEdit",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tagBulkEdit.updateBulkTagEdit(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getTagCodeBySearch = createAsyncThunk(
  "tagReducer/getTagCodeBySearch",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tag.getTagCodeBySearch(payload);
      console.log(response.data);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//stock transfer
export const createStockTransfer = createAsyncThunk(
  "stockTransferReducer/createStockTransfer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.stockTransfer.createStockTransfer(payload);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockTransferList = createAsyncThunk(
  "stockTransferReducer/getStockTransferList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.stockTransfer.getStockTransferList(payload?.page, payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const cancelStockTransfer = createAsyncThunk(
  "stockTransferReducer/cancelStockTransfer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.stockTransfer.cancelStockTransfer(payload);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//approval

export const createApproval = createAsyncThunk(
  "approvalReducer/createApproval",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.approval.createApproval(payload);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockList = createAsyncThunk(
  "approvalReducer/getStockList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.approval.getStockList(
        payload.trans_code,
        payload.transfer_from,
        payload.transfer_to,
        payload.type,
        payload.stock_type
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createTagScanAudit = createAsyncThunk(
  "tagAuditReducer/createTagScanAudit",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tagAudit.createTagScanAudit(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const closeTagScanAudit = createAsyncThunk(
  "tagAuditReducer/closeTagScanAudit",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tagAudit.closeTagScanAudit(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createContainerScanAudit = createAsyncThunk(
  "tagAuditReducer/createContainerScanAudit",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tagAudit.createContainerScanAudit(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const closeContainerScanAudit = createAsyncThunk(
  "tagAuditReducer/closeContainerScanAudit",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tagAudit.closeContainerScanAudit(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const createLotIssueReceiptForm = createAsyncThunk(
  "lotReducer/createLotIssueReceiptForm",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.lot.createLotIssueReceiptForm(payload);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLotStockList = createAsyncThunk(
  "lotReducer/getLotStockList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.lot.getLotStockList(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLotBalanceStockList = createAsyncThunk(
  "lotReducer/getLotBalanceStockList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.lot.getLotBalanceStockList(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createTagIssueReceiptForm = createAsyncThunk(
  "tagReducer/createTagIssueReceiptForm",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tag.createTagIssueReceiptForm(payload);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getTagStockList = createAsyncThunk(
  "tagReducer/getTagStockList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tag.getTagStockList(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLotIssueReceiptList = createAsyncThunk(
  "lotReducer/getLotIssueReceiptList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.lot.getLotIssueReceiptList(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getTagIssueReceiptList = createAsyncThunk(
  "tagReducer/getTagIssueReceiptList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tag.getTagIssueReceiptList(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLotNonStockList = createAsyncThunk(
  "lotReducer/getLotNonStockList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.lot.getLotNonStockList(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createLotNonTagInwardForm = createAsyncThunk(
  "lotReducer/createLotNonTagInwardForm",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.lot.createLotNonTagInwardForm(payload);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getNonTagInwardList = createAsyncThunk(
  "lotReducer/getNonTagInwardList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.lot.getNonTagInwardList(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getTagPrnFile = createAsyncThunk(
  "tagReducer/getTagPrnFile",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.tag.getTagPrnFile(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockIssuedDetails = createAsyncThunk(
  "stockTransferReducer/getStockIssuedDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.stockTransfer.getStockIssuedDetails(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createLotMerge = createAsyncThunk(
  "lotReducer/createLotMerge",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryAPI.lot.createLotMerge(payload);
      toastsuccess(response.data.message);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);