import { Auth } from "../configs";
import { getLotStockList } from "../thunks/inventory";

const api = {
  lot: {
    getActiveLot: (content) => Auth.get(`/inventory/lot/list/?active`),
    getLotList: (content) =>
      Auth.post(`/inventory/lot/list/?page=${content?.page}&records=${content?.records}&searchText=${content?.search}`, content),
    createLot: (content) => Auth.post("/inventory/lot/create/", content),
    getLogProductDetails: (content) => Auth.post("/reports/lot_tag_product_details/", content),
    updateLot: (id, content) => Auth.put(`/inventory/lot/update/${id}/`, content),
    getLotAvailableDetails: (id) => Auth.get(`/inventory/lot/lot_balance/${id}/`),
    printLotQRCode: (content) => Auth.post(`/inventory/lot/qr_print/` , content),
    geLotDetailById: (id) => Auth.get(`/inventory/lot/${id}/`),
    closeLot: (id) => Auth.get(`/inventory/lot/${id}/?close`),
    UpdatelotClose: (id) => Auth.get(`/inventory/lot/lot_product_close/${id}`),
    getNonTagStock: (idBranch) => Auth.get(`inventory/nontag/stock/?id_branch=${idBranch}`),
    getLotNonStockList: (content) => Auth.get(`inventory/nontag_lot/?${content}`),
    getLotStockList: (content) => Auth.get(`/inventory/lot_product_details/?${content}`),
    getLotBalanceStockList: (content) => Auth.post(`/inventory/lot/lot_balance_list/` , content),
    createLotIssueReceiptForm: (content) => Auth.post("/inventory/lot/issue_receipt/create/", content),
    getLotIssueReceiptList: (page, branch, records, fromDate, toDate) =>
      Auth.post(`/inventory/lot/issue_receipt/list/`, page, branch, records, fromDate, toDate),
    createLotNonTagInwardForm: (content) => Auth.post("/inventory/lot/non_tag_lot_inward/create/", content),
    getNonTagInwardList: (content) => Auth.post(`/inventory/lot/non_tag_lot_inward/list/?page=${content.page}&records=${content.records}&searchText=${content.search}`, content),
    createLotMerge: (content) => Auth.post("/inventory/lot/lot_merge/add/", content),
  },
  tag: {
    getTagIssueReceiptList: (page, branch, records, fromDate, toDate,search) =>
      Auth.post(`/inventory/tag/issue_receipt/list/`, page, branch, records, fromDate, toDate),
    getTagPrnFile: (content) => Auth.post(`/inventory/tag/print/`, content, { responseType: "blob" }),
    getActiveLot: () => Auth.get(`/inventory/lot/list/?active`),
    getTagList: (page, records, content) => Auth.post(`/inventory/tag/list/?page=${page}&records=${records}&searchText=${content?.search}`, content),
    createTag: (content) => Auth.post("/inventory/tag/create/", content),
    updateTag: (content) => Auth.put("/inventory/tag/update/", content),
    deleteTag: (id, content) => Auth.delete(`/inventory/tag/delete/${id}/`, content),
    getTagStockList: (content) => Auth.get(`/inventory/tag_product_details/?${content}`),
    createTagIssueReceiptForm: (content) => Auth.post("/inventory/tag/issue_receipt/create/", content),
    getTagSearchDetails: (content) => Auth.post("/inventory/tag_search_deails/", content),
    getTagDetailsByCode: (payload) => {
      let filters = ''
      if(payload.tagCode != undefined && payload.tagCode !==""){
        filters = `?tag_code=${payload.tagCode}&id_branch=${payload.idBranch}`
      }else{
        filters = `?id_branch=${payload.idBranch}&old_tag_code=${payload?.oldTagCode}`
      }
      return Auth.get(`/inventory/tag/list/${filters}`)
    },
    getTagCodeBySearch: (content) => Auth.post(`/inventory/tag/autoCompete/`, content),
    getPartlySoldTagDetailsByCode: (tagCode, idBranch) =>
      Auth.get(`/inventory/tag/partly_sold/?tag_code=${tagCode}&id_branch=${idBranch}`),
    assignToContainer: (content) => Auth.post(`/inventory/tag/assign_container/`, content),
    tagContainerList: (content) => Auth.post(`/inventory/tag/container/list/`, content),
  },
  tagBulkEdit: {
    updateBulkTagEdit: (content) => Auth.put("/inventory/bulk_tag_edit/update/", content),
    getTagFilterdedData: (content) => Auth.post(`/inventory/bulk_tag_edit/tag_data/`, content),
    printBulkTag: (content) => Auth.post(`/inventory/bulk_tag/print/`, content),
    getTagEstimatedData: (content) => Auth.post(`/estimation/est_transfer_details/`, content),
  },
  stockTransfer: {
    createStockTransfer: (content) => Auth.post("/stock_transfer/create/", content),
    cancelStockTransfer: (content) => Auth.post("/stock_transfer/cancel/", content),
    detailStockTransferPrint: (id,print_type) => Auth.get(`/stock_transfer/print/${id}/?print_type=${print_type}`, id),
    getStockTransferList: (page, content) => Auth.post(`/stock_transfer/list/?page=${page}`, content),
    getPartlySalesStock: (content) => Auth.post(`/stock_transfer/get_partly_sales_stock/`, content),
    getSalesReturnStock: (content) => Auth.post(`/stock_transfer/get_sales_return_stock/`, content),
    getOldMetalStock: (content) => Auth.post(`/stock_transfer/old_metal_details/`, content),
    getStockIssuedDetails: (content) => Auth.post(`/stock_transfer/stock_issued_details/`, content),
  },
  approval: {
    getStockList: (trans_code, transfer_from, transfer_to, type, stock_type) =>
      Auth.get(
        `/stock_transfer/approval/list/?trans_code=${trans_code}&transfer_from=${transfer_from}&transfer_to=${transfer_to}&type=${type}&stock_type=${stock_type}`
      ),
    createApproval: (content) => Auth.post("/stock_transfer/approval/", content),
  },
  tagAudit: {
    createTagScanAudit: (content) => Auth.post("/inventory/tag_audit/tag_scan/", content),
    closeTagScanAudit: (content) => Auth.post("/inventory/tag_audit/close_scan/", content),
    createContainerScanAudit: (content) => Auth.post("/inventory/tag_audit/container_scan/", content),
    closeContainerScanAudit: (content) => Auth.post("/inventory/tag_audit/close_container_scan/", content),
  },
};
const inventoryAPI = { ...api };

export default inventoryAPI;
