import { Auth } from "../configs";

const api = {
  invoice: {
    createInvoice: (content) => Auth.post("/billing/create/", content),
    cancelInvoice: (content) => Auth.post("/billing/cancel/", content),
    getBillingList: (page, content) =>
      Auth.post(
        `/billing/list/?page=${page}&records=${content?.records}&searchText=${content?.search}`,
        content
      ),
    updateInvoice: (id, content) => Auth.put(`/billing/update/${id}/`, content),
    getReturnDetails: (content) =>
      Auth.post("/billing/return_details/", content),
    getJewelNotDeliverList: (content) =>
      Auth.post("/billing/jewel_not_delivered/", content),
    updateJewelDelivered: (content) =>
      Auth.put("/billing/jewel_not_delivered/", content),
    getAdvanceDetails: (content) =>
      Auth.post("/billing/customer_advance/", content),
    getDepositDetails: (content) =>
      Auth.post("/billing/customer_deposit/", content),
    getChitDetails: (content) => Auth.post("/billing/customer_chit/", content),
    getOrderDelivery: (content) => Auth.post("/orders/orderdelivery/", content),
    createDiscountInvoice: (content) =>
      Auth.post("/billing/discount_invoice_create/", content),
    getDiscountBillingList: (page, content) =>
      Auth.post(`/billing/discount_invoice/list/?page=${page}`, content),
    getBillDetails: (content) => Auth.post("/billing/bill_details/", content),
    getDeleteableInvoiceList: (content) =>
      Auth.post("/billing/deleteable_bill_list/", content),
    deleteInvoiceList: (content) => Auth.post("/billing/delete/", content),
    convertInvoiceList: (content) =>
      Auth.post("/billing/convert_bill_list/", content),
    deleteTransaction: (content) =>
      Auth.post("/billing/delete_transaction/", content),
  },
  receipt: {
    createIssueReceipt: (content) =>
      Auth.post("/billing/issue_receipt/create/", content),
    cancelIssueReceipt: (content) =>
      Auth.post("/billing/issue_receipt/cancel/", content),
    getIssueReceiptList: (page, content) =>
      Auth.post(`/billing/issue_receipt/list/?page=${page}`, content),
    getIssueCreditList: (content) =>
      Auth.post(`/billing/customer_credit/`, content),
    getIssueReceiptById: (id) => Auth.get(`/billing/issue_receipt/${id}/`),
    getDeleteableReceiptList: (content) =>
      Auth.post("/billing/deleteable_issuereciept_list/", content),
    deleteIssueReceiptList: (content) =>
      Auth.post("/billing/issuereciept_delete/", content),
  },
  banksettlement: {
    createBankSettlementDetails: (content) =>
      Auth.post("/billing/bank_settlement_create/", content),
    getBankSettlementDetails: (content) =>
      Auth.post("/billing/online_payment_details/", content),
    getBankSettlementList: (content) =>
      Auth.post(`/billing/bank_settlement/list`, content),
  },
  liablity_entry: {
    createLiablityEntry: (content) =>
      Auth.post("/billing/liablity_entry/", content),
    createLiablityEntryPayment: (content) =>
      Auth.post("/billing/liablity_entry_payment/", content),
    getLiablityEntry: (page, content) =>
      Auth.get(
        `/billing/liablity_entry/?page=${page}&records=${content?.records}&searchText=${content?.search}`,
        content
      ),
    getLiablityEntryPayment: (page, content) =>
      Auth.get(
        `/billing/liablity_entry_payment/?page=${page}&records=${content?.records}&searchText=${content?.search}`,
        content
      ),
    getLiablityEntryPayable: (id_supplier) =>
      Auth.get(`/billing/liablity_entry_payable/?id_supplier=${id_supplier}`),
  },
  customer_sales_log:{
    getCustomerSalesLogOptions: () => Auth.get(`/billing/customer_sales_log/?active`),
    customerSalesLog: (page, records,search) =>
      Auth.post(`/billing/customer_sales_log/?page=${page}&records=${records}&searchText=${search}`)
  },
};
const billingAPI = { ...api };

export default billingAPI;
