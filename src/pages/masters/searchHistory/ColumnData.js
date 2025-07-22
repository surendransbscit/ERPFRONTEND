export const CustomerSalesColumn = [
    { header: "Invoice No.", accessor: "sales_invoice_no", textAlign: "center" },
    { header: "Branch", accessor: "branch_name", textAlign: "center" },
    { header: "Sales Amount", accessor: "sales_amount", textAlign: "right", isTotalReq: true, isCurrency:true },
    { header: "Net Amount", accessor: "net_amount", textAlign: "right", isTotalReq: true, isCurrency:true },
    { header: "Received Amount", accessor: "received_amount", textAlign: "right", isTotalReq: true, isCurrency:true },
    { header: "Due Amount", accessor: "due_amount", textAlign: "right", isTotalReq: true, isCurrency:true },
    { header: "Due Date", accessor: "due_date", textAlign: "center" },
    { header: "Invoice Date", accessor: "invoice_date", textAlign: "center", },
    
]

export const CustomerPurchaseColumn = [
    { header: "Product", accessor: "product_name", textAlign: "center" },
    { header: "Stock Type", accessor: "stock_type", textAlign: "center" },
    { header: "Piece", accessor: "pieces", decimal_places: 0, textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "gross_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Lwt", accessor: "less_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Nwt", accessor: "net_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Amount", accessor: "amount", textAlign: "right", isTotalReq: true, isCurrency:true },
    
]

export const CustomerOrderColumns = [
    { header: "Order No", accessor: "order_no", textAlign: "center" },
    { header: "Branch", accessor: "branch_name", textAlign: "center" },
    { header: "Order Date", accessor: "order_date", textAlign: "center" },
    { header: "Image", accessor: "image", textAlign: "center", type: "image" },
    { header: "Customer", accessor: "customer", textAlign: "left" },
    { header: "Mobile", accessor: "mobile", textAlign: "center" },
    { header: "Tag Code", accessor: "tag_code", textAlign: "left" },
    { header: "Supplier", accessor: "karigar", textAlign: "left" },
    { header: "Order Status", accessor: "name", textAlign: "center", type: "lable" },
    { header: "Product", accessor: "product", textAlign: "center" },
    { header: "Design", accessor: "design", textAlign: "center" },
    { header: "Sub Design", accessor: "sub_design", textAlign: "center" },
    { header: "Piece", accessor: "pieces", decimal_places: 0, textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "gross_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Lwt", accessor: "less_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Nwt", accessor: "net_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Type", accessor: "customer_order_type", decimal_places: 0, textAlign: "left", isTotalReq: false },
]

export const CustomerAccountDetailColumns = [
  { accessor: "account_name", header: "Account Name", textAlign: "left" },
  { accessor: "scheme_acc_number", header: "Acc No" },
  { accessor: "branch_name", header: "Branch", textAlign: "left" },
  { accessor: "start_date", header: "Date" },
  { accessor: "scheme_name", header: "Scheme", textAlign: "left" },
  { accessor: "paid_installments", header: "Paid Ins" },
  {
    accessor: "total_paid_weight",
    header: "Paid Weight",
    textAlign: "right",
    isTotalReq: true,
    decimal_places: 3,
  },
  {
    accessor: "total_paid_amount",
    header: "Paid Amount",
    textAlign: "right",
    isTotalReq: true,
    decimal_places: 2,
    isCurrency:true
  },
];


export const CustomerCreditColumns = [
    { header: "Bill No.", accessor: "bill_no", textAlign: "center" },
    { header: "Branch", accessor: "branch_name", textAlign: "center" },
    { header: "Issued Amount", accessor: "issued_amount", textAlign: "right", isTotalReq: true, isCurrency:true },
    { header: "Received Amount", accessor: "received_amount", textAlign: "right", isTotalReq: true, isCurrency:true },
    { header: "Balance Amount", accessor: "balance_amount", textAlign: "right", isTotalReq: true, isCurrency:true },
    { header: "Date", accessor: "bill_date", textAlign: "center",}
]

export const SupplierPurchaseEntryColumns = [
    { header: "Ref No.", accessor: "ref_code", textAlign: "center" },
    { header: "Date", accessor: "entry_date", textAlign: "center",},
    { header: "Supplier", accessor: "id_supplier__supplier_name", textAlign: "center" },
    { header: "Branch", accessor: "id_branch__name", textAlign: "center" },
    { header: "Gross Wt.", accessor: "total_gross_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Net Wt.", accessor: "total_net_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Stone Wt.", accessor: "total_stn_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Dia Wt.", accessor: "total_dia_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Status", accessor: "status_name", textAlign: "center", type: "lable" },
]

export const TagStoneDetailsColumns = [
    { header: "Stone Name", accessor: "stone_name", textAlign: "center" },
    { header: "Stone Calc. Type", accessor: "stn_calc_type", textAlign: "center" },
    { header: "UOM", accessor: "uom_name", textAlign: "center" },
    { header: "Quality Code", accessor: "quality_code", textAlign: "center" },
    { header: "Piece", accessor: "piece", decimal_places: 0, textAlign: "right", isTotalReq: true },
    { header: "Weight", accessor: "weight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Amount", accessor: "amount", textAlign: "right", isTotalReq: true, isCurrency:true },
]

export const TagLogHistoryDetailsColumns = [
    { header: "From Branch", accessor: "from_branch_name", textAlign: "center" },
    { header: "To Branch", accessor: "to_branch_name", textAlign: "center" },
    { header: "Date", accessor: "log_date", textAlign: "center" },
    { header: "Ref No", accessor: "ref_no", textAlign: "center" },
    { header: "Stock Status", accessor: "stock_status_name", textAlign: "center" },
    { header: "Transaction Type", accessor: "transaction_type", textAlign: "center" },
]