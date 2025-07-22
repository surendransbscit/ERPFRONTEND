import { Auth } from "../configs";
import { updatePurchaseEntry } from "../thunks/purchase";

const api = {
  purchase: {
    getPurchaseDetailsList: (page, branch, records, fromDate, toDate) =>
      Auth.post(`/purchase/purchase_entry/list/`, page, branch, records, fromDate, toDate),
    createPurchaseEntry: (content) => Auth.post("/purchase/purchase_entry/create/", content),
    getPurchaseEntryById: (id) => Auth.get(`/purchase/purchase_entry/edit/${id}/`),
    getPurchaseEntryByRefNo: (id_branch, fin_id, ref_no,billSettingType) => Auth.get(`/purchase/purchase_entry/edit/?touchUpdate&&fin_id=${fin_id}&ref_no=${ref_no}&id_branch=${id_branch}&bill_setting_type=${billSettingType}`),
    updatePurchaseEntry: (id, content) => Auth.put(`/purchase/purchase_entry/update/${id}/`, content),
    getPurchaseEntryItemDetails: (id_branch, fin_id, po_no, issue_type) =>
      Auth.get(
        `purchase/purchase_entry/get_po_details/?fin_id=${fin_id}&po_no=${po_no}&issue_type=${issue_type}&id_branch=${id_branch}`
      ),
    deletePurchaseItemByID: (id) => Auth.delete(`/purchase/purchase_entry/item_delete/?id_purchase_entry_detail=${id}`),
    getPurchaseDetails: (id_branch, fin_id, po_no) =>
      Auth.get(`purchase/purchase_entry/get_purchase_details/?fin_id=${fin_id}&po_no=${po_no}&id_branch=${id_branch}`),
    generateLotWithPo: (content) => Auth.post(`/purchase/lot_generate/`, content),
    cancelPurchaseEntry: (content) => Auth.post(`/purchase/purchase_entry/cancel/`, content),
    updatePurchaseEntryStatus: (id) => Auth.get(`/purchase/purchase_entry/edit/${id}/?approve`),
    getPurchasePayments: (id,metal,billSettingType) => Auth.get(`/purchase/purchase_payment/get_supplier_po_details/?id_supplier=${id}&id_metal=${metal}&bill_setting_type=${billSettingType}`),
    createPurchasePayment: (content) => Auth.post("/purchase/purchase_payment/create/", content),
    getStockDetails: (content) => Auth.post(`/purchase/purchase_stock_details/`, content),
    updatePendingTransfer: (content) => Auth.post("/purchase/pending_transfer/create/", content),
    createMetalIssue: (content) => Auth.post("/purchase/metal_issue/create/", content),
    getMetalIssueList: (content) => Auth.post(`/purchase/metal_issue/list/`, content),
    createSupplierPayment: (content) => Auth.post("/purchase/supplier_payment/create/", content),
    getSupplierPayments: (id,metal,billSettingType) => Auth.get(`/purchase/supplier_payment/get_supplier_po_details/?id_supplier=${id}&id_metal=${metal}&bill_setting_type=${billSettingType}`),
    createPurchaseReturnEntry: (content) => Auth.post("/purchase/purchase_return/create/", content),
    getPurchaseReturnList: (page, branch, records, fromDate, toDate) =>
      Auth.post(`/purchase/purchase_return/list/`, page, branch, records, fromDate, toDate),
    getPurchaseReturnById: (id) => Auth.get(`/purchase/purchase_return/${id}/`),
    updatePurchaseReturnById: (id, content) => Auth.put(`/purchase/purchase_return/${id}/`, content),
    cancelPurchaseReturn: (content) => Auth.post(`/purchase/purchase_return/cancel/`, content),
    updatePurchaseReturnStatus: (id) => Auth.get(`/purchase/purchase_return/${id}/?changestatus`),
    getPurchaseMetalAdvance: (content) => Auth.post(`/purchase/purchase_payment/get_supplier_advance_details/`,content),
    getPurchaseCashAdvance: (content) => Auth.post(`/purchase/purchase_payment/get_supplier_cash_varavu/`,content),
    getSupplierOpeningDetails: (content) => Auth.post(`/purchase/purchase_payment/get_supplier_opening_details/`, content),
    getSupplierPaymentList: (page, records, content,search) => Auth.post(`/purchase/supplier_payment/list/?page=${page}&records=${records}&searchText=${search}`, content),
  },
  issueReceipt: {
    createPurchaseIssueRecipt: (content) => Auth.post(`/purchase/issue_receipt/create/`, content),
    updatePurchaseIssueRecipt: (id, content) => Auth.put(`/purchase/issue_receipt/edit/${id}/`, content),
    getPurchaseIssueReciptItemDetails: (issueNo, issue_type) =>
      Auth.get(`purchase/issue_receipt/list/?issue_no=${issueNo}&issue_type=${issue_type}`),
    getPurchaseIssueReciptList: (page, branch, records, fromDate, toDate) =>
      Auth.post(`/purchase/issue_receipt/list/`, page, branch, records, fromDate, toDate),
    cancelPurchaseIssueRecipt: (content) => Auth.post(`/purchase/issue_receipt/cancel/`, content),
  },
};
const purchaseAPI = { ...api };

export default purchaseAPI;
