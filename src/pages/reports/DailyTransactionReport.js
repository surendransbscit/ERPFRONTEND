import React, { useEffect, useRef, useState } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { Col, Icon, PreviewCard, Row } from "../../components/Component";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useForm } from "react-hook-form";
import FilterSidebar from "../../components/sidebar/FilterSidebar";
import { useBranches } from "../../components/filters/filterHooks";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useBillSettingContext } from "../../contexts/BillSettingContext";
import { getDailyCashBookReport } from "../../redux/thunks/reports";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { useLocation } from "react-router";

const DailyTransactionReport = () => {
  const location = useLocation()
  const pathName = location?.pathname;
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const { branches } = useBranches();
  const {
    userInfo,
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const { dailyCashBookReport } = useSelector((state) => state.reportReducer);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);
  const tableRef = useRef();
  const { billSettingType } = useBillSettingContext();
  const dispatch = useDispatch();

  const [selectedBranch, SetSelectedBranch] = useState([]);
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());

  const [filterModal, SetFilterModal] = useState(false);
  const toggleFilterModal = () => SetFilterModal(!filterModal);

  const rateAlign = "right";
  const weightAlign = "right";
  const textAlign = "center";

  const salesDetailsColumns = [
    { header: "Description", accessor: "tag_code" },
    // { header: "Date", accessor: "invoice_date" },
    {
      header: "PCS",
      accessor: "sales_pcs",
      isTotalReq: true,
      isCurrency: false,
      decimal_places: 3,
      textAlign: weightAlign,
    },
    {
      header: "Wt.",
      accessor: "sales_wt",
      isTotalReq: true,
      isCurrency: false,
      decimal_places: 3,
      textAlign: weightAlign,
    },
    {
      header: "Sales",
      accessor: "sales_cost",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "Gold Pur",
      accessor: "gold_purchase_wt",
      isTotalReq: true,
      isCurrency: false,
      decimal_places: 3,
      textAlign: weightAlign,
    },
    {
      header: "Silver Pur",
      accessor: "silver_purchase_wt",
      isTotalReq: true,
      isCurrency: false,
      decimal_places: 3,
      textAlign: weightAlign,
    },
    {
      header: "Gold Pur. Amnt.",
      accessor: "gold_purchase_amt",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "Silver Pur. Amnt.",
      accessor: "silver_purchase_amt",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    
    {
      header: "Recd",
      accessor: "csh_recd_amt",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "Paid",
      accessor: "csh_paid_amt",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "Card Amnt.",
      accessor: "card_amt",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "UPI Amnt.",
      accessor: "upi_amt",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    // {
    //   header: "NB Amnt.",
    //   accessor: "nb_amt",
    //   isTotalReq: true,
    //   isCurrency: true,
    //   decimal_places: 2,
    //   textAlign: rateAlign,
    // },
    {
      header: "Adj Amnt.",
      accessor: "adj_amt",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "Chit Adj",
      accessor: "chit_adj_amt",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "Due Amnt.",
      accessor: "due_amount",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "MRP Disc.",
      accessor: "mrp_dis",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
  ];

  const orderAdvanceColumns = [
    { header: "Description", accessor: "tag_code" },
    { header: "Date", accessor: "invoice_date" },
    {
      header: "PCS",
      accessor: "sales_pcs",
      isTotalReq: true,
      isCurrency: false,
      decimal_places: 3,
      textAlign: weightAlign,
    },
    {
      header: "Wt.",
      accessor: "sales_wt",
      isTotalReq: true,
      isCurrency: false,
      decimal_places: 3,
      textAlign: weightAlign,
    },
    {
      header: "Sales",
      accessor: "sales_cost",
      isTotalReq: false,
      isCurrency: false,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "Pur. Wt.",
      accessor: "purchase_wt",
      isTotalReq: false,
      isCurrency: false,
      decimal_places: 3,
      textAlign: weightAlign,
    },
    {
      header: "Pur. Amnt.",
      accessor: "purchase_amt",
      isTotalReq: false,
      isCurrency: false,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "Gr. Wt. ",
      accessor: "ret_gross_wt",
      isTotalReq: false,
      isCurrency: false,
      decimal_places: 3,
      textAlign: weightAlign,
    },
    {
      header: "Amount",
      accessor: "ret_amt",
      isTotalReq: false,
      isCurrency: false,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "Due Amnt.",
      accessor: "due_amount",
      isTotalReq: false,
      isCurrency: false,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "Cash Amnt.",
      accessor: "csh_amt",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "Cash Amnt.",
      accessor: "csh__amt",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "Card Amnt.",
      accessor: "card_amt",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "UPI Amnt.",
      accessor: "upi_amt",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "NB Amnt.",
      accessor: "nb_amt",
      isTotalReq: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    {
      header: "Adj Amnt.",
      accessor: "adj_amt",
      isTotalReq: false,
      isCurrency: false,
      decimal_places: 2,
      textAlign: rateAlign,
    },
    
  ];

  const calculateDataDetailsTotal = (data, field) => {
    return data?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = salesDetailsColumns?.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const calculateMetalDataDetailsTotal = (salesDetails, field) => {
    let totals = {};
    let grandTotal = 0;

    salesDetails?.forEach((metal) => {
      let metalTotal = metal.bills.reduce((acc, bill) => {
        return acc + (parseFloat(bill[field]) || 0);
      }, 0);

      // Find decimal places from column config
      let column = salesDetailsColumns.find((col) => col.accessor === field);
      let decimal_places =
        column?.decimal_places !== undefined ? column.decimal_places : 2;

      totals[metal.metal_name] = parseFloat(metalTotal).toFixed(decimal_places);
      grandTotal += metalTotal;
    });

    let grandDecimalPlaces =
      salesDetailsColumns.find((col) => col.accessor === field)
        ?.decimal_places || 2;
    grandTotal = parseFloat(grandTotal).toFixed(grandDecimalPlaces);

    return { totals, grandTotal };
  };

const calculateOldPurchaseDetailsTotal = (salesDetails, field) => {
    let totals = {};
    let grandTotal = 0;

    
    let metalTotal = salesDetails?.reduce((acc, bill) => {
      return acc + (parseFloat(bill[field]) || 0);
    }, 0);

      // Find decimal places from column config
    let column = salesDetailsColumns.find((col) => col.accessor === field);
    let decimal_places =
      column?.decimal_places !== undefined ? column.decimal_places : 2;

    grandTotal += metalTotal;
    

    let grandDecimalPlaces =
      salesDetailsColumns.find((col) => col.accessor === field)
        ?.decimal_places || 2;
    grandTotal = parseFloat(grandTotal).toFixed(grandDecimalPlaces);

    return { grandTotal };
  };

  const calculateIssueTotals = (cashIssueDetails) => {
    return cashIssueDetails?.reduce(
      (totals, issue) => {
        if (issue?.type === 1) {
          totals.debit += issue.payment_amount || 0;
        } else if (issue?.type === 2) {
          totals.credit += issue.payment_amount || 0;
        }
        return totals;
      },

      { credit: 0, debit: 0 }
    );
  };

  const exportToPrint = () => {
    const titleContent = "Daily Transaction Report";
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    const currentDateTime = new Date().toLocaleString("en-GB", options);
    // Get the HTML table content
    const tableHTML = tableRef?.current?.innerHTML || "";

    let filterRow = `<tr><td style="text-align:center;border: none;font-size:10px;text-transform: uppercase;font-weight:bold" colspan="${salesDetailsColumns?.length}">GST IN ${userInfo?.user?.company_gst}`;

    // Combine title and table content into a single div
    const combinedHTML = `<div id="tablecontainer">
          <table><tr><td style="text-align:center;border: none;text-align:center;border: none;font-size:12px;text-transform: uppercase;font-weight:bold;" 
          colspan="${salesDetailsColumns?.length}"
          >
          
          <span style="font-size:10px;font-weight:bold;">${titleContent}</span><br/>
          <span style="font-size:10px;font-weight:normal;">From Date : ${moment(
            startDate
          ).format("DD-MM-YYYY")} && To Date : ${moment(endDate).format(
      "DD-MM-YYYY"
    )}<br/>
          Print Taken On: ${currentDateTime} By ${
      userInfo?.user?.emp_firstname
    }  ${userInfo?.user?.emp_lastname}</span></td></tr>
          </table>
          ${tableHTML}
      </div>`;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = combinedHTML;

    // Ensure you're querying the intended element
    const table = tempDiv.querySelector("#tablecontainer"); // Look for a <table> inside tempDiv
    if (!table) {
      console.error("No table element found in the provided HTML string.");
      return;
    }

    // Print the content
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
          <html>
              <head>
                  <title>${titleContent}</title>
                  <style>
                      /* Add custom styles for printing here */
                      table {
                          width: 100%;
                          border-collapse: collapse;
                          font-size:10px;
                          white-space: nowrap;
                      }
                      button {
                        font-size: 6px;  /* Smaller text */
                        padding: 0px; /* Reduce padding */
                      }
  
                      tr{
                      padding:0px;
                      }
                      
                      th, td {
                          border: 1px solid #000;
                          padding: 3px;
                      }
                      th {
                          background-color: #f4f4f4;
                          color:rgb(0, 0, 0) !important;
                          white-space: normal;
                      }
                  </style>
              </head>
              <body>
                  ${table.outerHTML}
              </body>
          </html>
      `);
    printWindow.document.close();
    printWindow.print();
  };

  const getData = () => {
    // let branch = [];
    // if (selectedBranch.length) {
    //   branch = selectedBranch?.map((obj) => {
    //     const container = obj.value;
    //     return container;
    //   });
    // } else {
    //   const loginpref = secureLocalStorage.getItem("pref")?.pref;
    //   branch = loginpref.login_branches;
    // }
    // console.log(branch);
    let passData = {
      id_branch: selectedBranch,
      from_date: moment(startDate).format("YYYY-MM-DD"),
      to_date: moment(endDate).format("YYYY-MM-DD"),

      setting_bill_type: billSettingType,
    };
    dispatch(getDailyCashBookReport(passData));
  };

  useEffect(() => {
      dispatch(getPagePermission({ path: pathName }));
    }, [pathName, dispatch]);

  useEffect(() => {
    getData();
  }, [billSettingType]);

  return (
    <React.Fragment>
      <Head title={`Daily Transaction Report`} />
      {pagePermission?.view && (
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
          </Row>

          <div className="card-inner">
            <div className="card-title-group">
              <div className="toggle-wrap nk-block-tools-toggle">
                <h5>{`Daily Transaction`}</h5>
              </div>
              <div className="card-tools me-n1">
                <ul className="btn-toolbar gx-1">
                  {/* <li className="btn-toolbar-sep"></li> */}
                  <li>
                    <div className="dt-buttons btn-group flex-wrap">
                      <button
                        className="btn btn-secondary buttons-print buttons-html5"
                        type="button"
                        onClick={() => exportToPrint()}
                      >
                        <span>print</span>
                      </button>{" "}
                    </div>
                  </li>

                  <li className="btn-toolbar-sep"></li>
                  <li>
                    <div
                      className="btn btn-trigger btn-icon dropdown-toggle"
                      onClick={toggleFilterModal}
                    >
                      <div className="dot dot-primary"></div>
                      Filters<Icon name="filter-alt"></Icon>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            ref={tableRef}
            className="table-responsive mt-4"
            style={{
              maxHeight: "500px",
              // overflowY: "auto",
              position: "relative",
              border: " 1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <table
              className="table table-bordered"
              style={{ borderCollapse: "collapse", fontSize: "14px" }}
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,

                  zIndex: 100,
                }}
              >
                {/* <tr>
                  <th>S.NO{" "}
                  </th>
                  <th >Description </th>
                  <th >Date </th>
                  <th >PCS </th>
                  <th >Wt. </th>
                  <th >Sales </th>
                  <th >Pur. Wt. </th>
                  <th >Pur. Amnt. </th>
                  <th >Gr. Wt. </th>
                  <th>Amount </th>
                  <th>Due Amnt. </th>
                  <th>Cash Amnt. </th>
                  <th>Card Amnt. </th>
                  <th>UPI Amnt. </th>
                  <th>NB Amnt. </th>
                  <th>Adj Amnt. </th>
                </tr> */}

                <tr>
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      background: "#f8f9fa",
                      zIndex: 10,
                      padding: "10px",
                      borderBottom: "2px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    S.NO{" "}
                  </th>
                  {salesDetailsColumns?.map((column, index) => (
                    <th
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "#f8f9fa",
                        zIndex: 10,
                        padding: "10px",
                        borderBottom: "2px solid #ddd",
                        textAlign: "center",
                      }}
                      key={index}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* sales details */}
                {dailyCashBookReport?.sales_details?.map((item, salesIndex) => {
                  return (
                    <React.Fragment key={salesIndex}>
                      <tr>
                        <td
                          colSpan="16"
                          style={{ fontWeight: "bold", textAlign: "left" }}
                        >
                          {/* &nbsp; */}
                          {item.metal_name}
                        </td>
                      </tr>

                      {item.bills.map((bill, billIndex) => (
                        <tr
                          key={
                            bill.erp_invoice_id || `${salesIndex}-${billIndex}`
                          }
                        >
                          <td>{bill.sales_invoice_no}</td>
                          <td>{bill.tag_code || " "}</td>
                          {/* <td>{bill.invoice_date}</td> */}
                          <td style={{ textAlign: weightAlign }}>
                            {parseFloat(bill.sales_pcs).toFixed(3)}
                          </td>
                          <td style={{ textAlign: weightAlign }}>
                            {bill.sales_wt!=0 ? parseFloat(bill.sales_wt).toFixed(3) : '' }
                          </td>
                          <td style={{ textAlign: rateAlign }}>
                            {(bill.sales_cost!=0 ?<CurrencyDisplay value={bill.sales_cost} />  : '')}
                          </td>
                          <td style={{ textAlign: weightAlign }}>
                            {bill.gold_purchase_wt!=0 ? parseFloat(bill.gold_purchase_wt).toFixed(3) : ''}
                          </td>
                          <td style={{ textAlign: weightAlign }}>
                            {bill.silver_purchase_wt!=0 ? parseFloat(bill.silver_purchase_wt).toFixed(3) : ''}
                          </td>
                          <td style={{ textAlign: rateAlign }}>
                            {bill.gold_purchase_amt!=0 ? <CurrencyDisplay value={bill.gold_purchase_amt} />  : ''}
                          </td>
                          <td style={{ textAlign: rateAlign }}>
                            {bill.silver_purchase_amt!=0 ? <CurrencyDisplay value={bill.silver_purchase_amt} />  : ''}
                          </td>
                         
                          
                          <td style={{ textAlign: rateAlign }}>
                            {bill.csh_recd_amt!='' ? <CurrencyDisplay value={bill.csh_recd_amt} /> : ' '}
                          </td>
                          <td style={{ textAlign: rateAlign }}>
                            {bill.csh_paid_amt!='' ? <CurrencyDisplay value={bill.csh_paid_amt} /> : ''}
                          </td>
                          <td style={{ textAlign: rateAlign }}>
                            {bill.card_amt!='' ? <CurrencyDisplay value={bill.card_amt} /> : ' '}
                          </td>
                          <td style={{ textAlign: rateAlign }}>
                            {bill.upi_amt!='' ? <CurrencyDisplay value={bill.upi_amt} />  : ' '}
                          </td>
                         
                          <td style={{ textAlign: rateAlign }}>
                            {bill.adj_amt!='' ? <CurrencyDisplay value={bill.adj_amt} />   : ' '}
                          </td>
                          <td style={{ textAlign: rateAlign }}>
                            {bill.chit_adj_amt!='' ? <CurrencyDisplay value={bill.chit_adj_amt} /> : ''}
                          </td>
                          <td style={{ textAlign: rateAlign }}>
                            {bill.due_amount!='' ? <CurrencyDisplay value={bill.due_amount} /> : ''}
                          </td>
                          <td style={{ textAlign: rateAlign }}>
                            {bill.mrp_dis!='' ? <CurrencyDisplay value={bill.mrp_dis} /> : ''}
                          </td>
                        </tr>
                      ))}

                      <tr
                        style={{
                          fontWeight: "bold",
                          background: "#f1f1f1",
                          borderTop: "2px solid #000",
                        }}
                      >
                        <td colSpan="">Sub Total</td>
                        {salesDetailsColumns?.map((column, index) => (
                          <td
                            key={index}
                            style={{ textAlign: column?.textAlign }}
                          >
                            {column.isTotalReq ? (
                              column.isCurrency ? (
                                (calculateDataDetailsTotal(
                                    item.bills,
                                    column.accessor
                                  )!=0 ? <CurrencyDisplay
                                  value={calculateDataDetailsTotal(
                                    item.bills,
                                    column.accessor
                                  )}
                                /> : '')
                              ) : (
                                (calculateDataDetailsTotal(
                                  item.bills,
                                  column.accessor
                                )!=0 ? calculateDataDetailsTotal(
                                  item.bills,
                                  column.accessor
                                ) : '')
                              )
                            ) : (
                              ""
                            )}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  );
                })}

                <tr
                  style={{
                    fontWeight: "bold",
                    background: "#f1f1f1",
                    borderTop: "2px solid #000",
                  }}
                >
                  <td colSpan="">Total</td>
                  {salesDetailsColumns?.map((column, index) => (
                    <td key={index} style={{ textAlign: column?.textAlign }}>
                      {column.isTotalReq ? (
                        column.isCurrency ? (
                          (calculateMetalDataDetailsTotal(
                                dailyCashBookReport?.sales_details,
                                column.accessor
                              ).grandTotal!=0 ? <CurrencyDisplay
                            value={
                              calculateMetalDataDetailsTotal(
                                dailyCashBookReport?.sales_details,
                                column.accessor
                              ).grandTotal
                            }
                          /> : '')
                          
                        ) : (
                          calculateMetalDataDetailsTotal(
                            dailyCashBookReport?.sales_details,
                            column.accessor
                          ).grandTotal
                        )
                      ) : (
                        ""
                      )}
                    </td>
                  ))}
                </tr>

                {/* Order Advance */}
              {dailyCashBookReport?.old_gold_alone_bills?.length > 0 && (
                <tr>
                  <td
                    colSpan="15"
                    style={{ fontWeight: "bold", textAlign: "left" }}
                  >
                    &nbsp;CASH PURCHASE
                  </td>
                </tr>
         )}

                {dailyCashBookReport?.old_gold_alone_bills?.map((bill, billIndex) => {
                  return (
                    <React.Fragment key={billIndex}>

                     
                        <tr
                          key={
                            bill.erp_invoice_id || `${billIndex}-${billIndex}`
                          }
                        >
                          <td>{bill.purchase_invoice_no}</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td style={{ textAlign: rateAlign }}>
                            {bill.gold_purchase_wt}
                          </td>
                          <td style={{ textAlign: weightAlign }}>
                            {bill.silver_purchase_wt}
                          </td>
                          
                          <td style={{ textAlign: rateAlign }}>
                            {bill.gold_purchase_amt!=0 ? <CurrencyDisplay value={bill.gold_purchase_amt} /> : '' }
                          </td>

                          <td style={{ textAlign: rateAlign }}>
                            {bill.silver_purchase_amt!=0 ? <CurrencyDisplay value={bill.silver_purchase_amt} /> : '' }
                          </td>
                          <td></td>
                          <td style={{ textAlign: rateAlign }}>
                            {bill.csh_paid_amt!=0 ? <CurrencyDisplay value={bill.csh_paid_amt} /> : ''}
                          </td>
                          <td style={{ textAlign: rateAlign }}>
                            {bill.card_amt!=0 ? <CurrencyDisplay value={bill.card_amt} /> : ''}
                          </td>
                          
                          <td style={{ textAlign: rateAlign }}>
                            {bill.upi_amt!=0 ? <CurrencyDisplay value={bill.upi_amt} /> : ''}
                          </td>
                         
                          <td></td>
                          <td></td>
                          <td></td>
                          
                        </tr>
                      
                    </React.Fragment>
                  );
                })}

              {dailyCashBookReport?.old_gold_alone_bills?.length > 0 && (
              <>

                <tr
                  style={{
                    fontWeight: "bold",
                    background: "#f1f1f1",
                    borderTop: "2px solid #000",
                  }}
                >
                  <td colSpan="">Total</td>
                  {salesDetailsColumns?.map((column, index) => (
                    <td key={index} style={{ textAlign: column?.textAlign }}>
                      {column.isTotalReq ? (
                        column.isCurrency ? (
                          (calculateOldPurchaseDetailsTotal(
                                dailyCashBookReport?.old_gold_alone_bills,
                                column.accessor
                              ).grandTotal!=0 ? <CurrencyDisplay
                            value={
                              calculateOldPurchaseDetailsTotal(
                                dailyCashBookReport?.old_gold_alone_bills,
                                column.accessor
                              ).grandTotal
                            }
                          /> : '')
                          
                        ) : (
                          (calculateOldPurchaseDetailsTotal(
                            dailyCashBookReport?.old_gold_alone_bills,
                            column.accessor
                          ).grandTotal!=0 ? calculateOldPurchaseDetailsTotal(
                            dailyCashBookReport?.old_gold_alone_bills,
                            column.accessor
                          ).grandTotal : '') 
                        )
                      ) : (
                        ""
                      )}
                    </td>
                  ))}
                </tr>

                  
                </>
                )}

                <tr  style={{fontWeight : "bold"}}>
                    <td>OLD TOTAL</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{dailyCashBookReport?.total_gold_purhase_wt}</td>
                    <td>{dailyCashBookReport?.total_silver_purchase_wt}</td>
                </tr>


                {dailyCashBookReport?.order_advance.length > 0 && (
                   <tr>
                    <td
                      colSpan="17"
                      style={{ fontWeight: "bold", textAlign: "left" }}
                    >
                      Order Advance
                    </td>
                  </tr>  
                )
                }
               
                {dailyCashBookReport?.order_advance?.map((item, orderIndex) => {
                  return (
                    <React.Fragment key={orderIndex}>
                      <tr key={orderIndex}>
                        <td>{orderIndex + 1}</td>
                        <td>{`${item.tag_code || "N/A"}`}</td>
                        <td></td>
                        <td style={{ textAlign: weightAlign }}>
                          {parseFloat(item.sales_pcs).toFixed(3)}
                        </td>
                        <td style={{ textAlign: weightAlign }}>
                          {parseFloat(item.sales_wt).toFixed(3)}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: rateAlign }}>
                          {/* {parseFloat(item.ret_gross_wt).toFixed(3)} */}
                        </td>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: rateAlign }}>
                          {<CurrencyDisplay value={item.csh_amt} />}
                        </td>
                        <td style={{ textAlign: rateAlign }} > {<CurrencyDisplay value={0.00} />}</td>
                        <td style={{ textAlign: rateAlign }}>
                          {<CurrencyDisplay value={item.card_amt} />}
                        </td>
                        <td style={{ textAlign: rateAlign }}>
                          {<CurrencyDisplay value={item.upi_amt} />}
                        </td>
                        <td style={{ textAlign: rateAlign }}>
                          {<CurrencyDisplay value={item.nb_amt} />}
                        </td>
                        <td></td>
                      </tr>
                    </React.Fragment>
                  );
                })}
                <tr
                  style={{
                    fontWeight: "bold",
                    background: "#f1f1f1",
                    borderTop: "2px solid #000",
                  }}
                >
                  {dailyCashBookReport?.order_advance.length > 0 && (
                    <td colSpan="">Total</td>
                  )}
                  
                  {dailyCashBookReport?.order_advance.length > 0 && orderAdvanceColumns?.map((column, index) => (
                    <td key={index} style={{ textAlign: column?.textAlign }}>
                      {column.isTotalReq ? (
                        column.isCurrency ? (
                          <CurrencyDisplay
                            value={calculateDataDetailsTotal(
                              dailyCashBookReport?.order_advance,
                              column.accessor
                            )}
                          />
                        ) : (
                          calculateDataDetailsTotal(
                            dailyCashBookReport?.order_advance,
                            column.accessor
                          )
                        )
                      ) : (
                        ""
                      )}
                    </td>
                  ))}
                </tr>
                {dailyCashBookReport?.order_advance.length > 0 && (
                  <tr>
                    <td
                      colSpan="17"
                      style={{ fontWeight: "bold", textAlign: "left" }}
                    >
                      &nbsp;
                    </td>
                  </tr>
                )}
                

                <tr
                  style={{
                    fontWeight: "bold",
                    borderTop: "2px solid #000",
                  }}
                >
                  <td></td>
                  <td colSpan="3">Opening Cash Recieved</td>
                  <td></td>
                  <td style={{ textAlign: rateAlign }}>
                    {
                      <CurrencyDisplay
                        value={dailyCashBookReport?.opening_csh_received}
                      />
                    }
                  </td>
                </tr>
                {dailyCashBookReport?.cash_issue_details?.map(
                  (issue, issueIdx) => (
                    <tr
                      key={`issue-${issueIdx}`}
                      style={{
                        fontWeight: "bold",
                        borderTop: "2px solid #000",
                      }}
                    >
                      <td></td>
                      <td colSpan="3">{issue?.remarks}</td>

                      {issue?.type === 1 ? (
                        <>
                          <td style={{ textAlign: rateAlign }}>
                            {<CurrencyDisplay value={issue?.payment_amount} />}
                          </td>
                          <td></td>
                        </>
                      ) : (
                        <>
                          <td></td>
                          <td style={{ textAlign: rateAlign }}>
                            {<CurrencyDisplay value={issue?.payment_amount} />}
                          </td>
                        </>
                      )}
                    </tr>
                  )
                )}
                {/* Total for cash issue */}
                <tr
                  style={{
                    fontWeight: "bold",
                    borderTop: "2px solid #000",
                  }}
                >
                  <td></td>
                  <td colSpan="3" style={{ textAlign: "right" }}>
                    Day's Total
                  </td>
                  <td style={{ textAlign: rateAlign }}>
                    {
                      <CurrencyDisplay
                        value={

                          parseFloat(calculateIssueTotals(dailyCashBookReport?.cash_issue_details)?.debit) +
                          parseFloat(calculateMetalDataDetailsTotal(
                            dailyCashBookReport?.sales_details,
                            "csh_paid_amt"
                          ).grandTotal)
                          +  parseFloat(calculateOldPurchaseDetailsTotal(
                            dailyCashBookReport?.old_gold_alone_bills,
                            "csh_paid_amt"
                          ).grandTotal)
                        }
                      />
                    }
                  </td>
                  <td style={{ textAlign: rateAlign }}>
                    {
                      <CurrencyDisplay
                        value={
                          parseFloat(calculateMetalDataDetailsTotal(
                            dailyCashBookReport?.sales_details,
                            "csh_recd_amt"
                          ).grandTotal)
                          +
                          parseFloat(
                            calculateIssueTotals(
                              dailyCashBookReport?.cash_issue_details
                            )?.credit
                          ) +
                          parseFloat(calculateDataDetailsTotal(
                            dailyCashBookReport?.order_advance,
                            "csh_amt"
                          ))

                        }
                      />
                    }
                  </td>
                </tr>
                <tr
                  style={{
                    fontWeight: "bold",
                    borderTop: "2px solid #000",
                  }}
                >
                  <td></td>
                  <td colSpan="3" style={{ textAlign: "right" }}>
                    Closing Cash
                  </td>
                  <td></td>
                  <td style={{ textAlign: rateAlign }}>
                    {
                      <CurrencyDisplay
                        value={
                          parseFloat(
                            calculateIssueTotals(
                              dailyCashBookReport?.cash_issue_details
                            )?.credit
                          ) +
                          parseFloat(calculateMetalDataDetailsTotal(
                            dailyCashBookReport?.sales_details,
                            "csh_recd_amt"
                          ).grandTotal)
                         
                          +
                          parseFloat(calculateDataDetailsTotal(
                            dailyCashBookReport?.order_advance,
                            "csh_amt"
                          ))
                          +
                          parseFloat(
                            dailyCashBookReport?.opening_csh_received
                          ) -
                          parseFloat(
                            calculateIssueTotals(
                              dailyCashBookReport?.cash_issue_details
                            )?.debit
                          )
                          -
                          parseFloat(calculateMetalDataDetailsTotal(
                            dailyCashBookReport?.sales_details,
                            "csh_paid_amt"
                          ).grandTotal)

                          -  parseFloat(calculateOldPurchaseDetailsTotal(
                            dailyCashBookReport?.old_gold_alone_bills,
                            "csh_paid_amt"
                          ).grandTotal)
                        }
                      />
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </PreviewCard>
      </Content>
      )}
      <FilterSidebar
        sideBar={filterModal}
        toggle={toggleFilterModal}
        children={{
          register,

          clearErrors,
          setValue,
          errors,
          selectedBranch,
          SetSelectedBranch,

          startDate,
          SetStartDate,
          endDate,
          SetEndDate,
          getData,
          is_group_by_req: false,
          branches,

          is_date_filter_req: true,

          is_branch_filter_req: true,
        }}
      />
    </React.Fragment>
  );
};

export default DailyTransactionReport;
