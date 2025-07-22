import React, { useEffect,useState,useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import styled from "styled-components";
import { Block,Icon} from "../../components/Component";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { Card } from "reactstrap";
import { getSupplierLedgerReport } from "../../redux/thunks/reports";
import moment from "moment";
import { useForm } from "react-hook-form";
import "../../assets/css/datatable.css";
import CurrencyDisplay, { formatCurrencyInINR } from "../../components/common/moneyFormat/moneyFormat";
import ReportFilterComponent from "./ReportFilterComponent";
import FilterSidebar from "../../components/sidebar/FilterSidebar";
import secureLocalStorage from "react-secure-storage";
import { isUndefined } from "../../components/common/calculations/ErpCalculations";
import {
  useSupplierFilter,
  useMetals,
} from "../../components/filters/filterHooks";
import * as XLSX from 'xlsx';
import { useBillSettingContext } from "../../contexts/BillSettingContext";
export const Styles = styled.div`
  padding: 2vh 0.75vw;
  .table-wrapper {
    overflow-x: auto; /* Enable horizontal scrolling */
    width: 100%;
  }
  table {
    width: 100%;
    min-width: 1000px; /* Ensures scrolling on smaller screens */
    border-spacing: 2px;
    border: 1px solid #e1e1e1;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      border-bottom: 1px solid #e1e1e1;
    }
  }
`;

const SupplierLedgerReport = () => {
  const { register, clearErrors, setValue, errors } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathName = location?.pathname;
  const { supplierLedgerList, isLoading: loadingData } = useSelector((state) => state.reportReducer);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const [selectedBranch, SetSelectedBranch] = useState([]);
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());
  const [selectedSupplier, SetSelectedSupplier] = useState();
  const [selectedMetal, SetSelectedMetal] = useState();
  const { metals } = useMetals();
  const { supplier } = useSupplierFilter();
  const tableRef = useRef();
  const id_supplier = location?.state?.id_supplier;
  const id_metal = location?.state?.id_metal;
  const { billSettingType } = useBillSettingContext();

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    getData()
  }, [billSettingType]);

  useEffect(() => {
    let branch = [];
    if (selectedBranch.length) {
      branch = selectedBranch?.map((obj) => {
        const container = obj.value;
        return container;
      });
    } else {
      const loginpref = secureLocalStorage.getItem("pref")?.pref;
      branch = loginpref.login_branches;
    }
    let supplier =  id_supplier != undefined ? id_supplier : selectedSupplier
    let metal =  id_metal != undefined ? id_metal : selectedMetal
    SetSelectedSupplier(supplier);
    SetSelectedMetal(metal);
    dispatch(
      getSupplierLedgerReport({
        fromDate: moment(startDate).format("YYYY-MM-DD"),
        toDate: moment(endDate).format("YYYY-MM-DD"),
        branch: branch,
        id_supplier: supplier,
        id_metal: metal,
      })
    );
  }, [dispatch]);



  const getData = async () => {
    let branch = [];
    if (selectedBranch.length) {
      branch = selectedBranch?.map((obj) => {
        const container = obj.value;
        return container;
      });
    } else {
      const loginpref = secureLocalStorage.getItem("pref")?.pref;
      branch = loginpref.login_branches;
    }
    try {
      await dispatch(
        getSupplierLedgerReport({
          fromDate: moment(startDate).format("YYYY-MM-DD"),
          toDate: moment(endDate).format("YYYY-MM-DD"),
          branch: branch,
          id_supplier: selectedSupplier,
          id_metal: selectedMetal,
          bill_setting_type: billSettingType,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [filterModal, SetFilterModal] = useState(false);
  const toggleFilterModal = () => SetFilterModal(!filterModal);

  const calculateTotal = (field, data,decimal_places = 3) => {
    return data.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      //let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  
  const calculateDayTotalWt = (data) => {
     let opn = parseFloat(data.opening.balance_weight)
     let credit = calculateTotal('credit_wt',data.details)
     let debit = calculateTotal('debit_wt',data.details)
     let close = parseFloat(opn) + (parseFloat(credit) - parseFloat(debit))
     return parseFloat(Math.abs(close)).toFixed(3) + (close < 0 ?" Dr":" Cr")
  };
  const calculateGrandTotalWt = (data,type) => {
    let opn = parseFloat(data.opening.balance_weight)
    let credit = calculateTotal('credit_wt',data.details)
    let debit = calculateTotal('debit_wt',data.details)
    let close = parseFloat(opn) + (parseFloat(credit) - parseFloat(debit))
    let amount_type = (close < 0 ? 1:2)
    if (type == amount_type) {
        return parseFloat(Math.abs(close)).toFixed(3) + (close < 0 ?" Dr":" Cr")
    }
 };
  const calculateDayTotalAmt = (data,type) => {
    let opn = isUndefined(data.opening.balance_amount)
    let credit = calculateTotal('credit_amt',data.details)
    let debit = calculateTotal('debit_amt',data.details)
    let close = parseFloat(opn) + (parseFloat(credit) - parseFloat(debit))
    let amount_type = (close < 0 ? 1:2)
    if (type == amount_type) {
      return  formatCurrencyInINR (parseFloat(Math.abs(close)).toFixed(2)) +" "+ (close < 0 ?"Dr":"Cr")
    }
 };
  const columns = [
    // { accessor: "sno", header: "SNO", textAlign: "left" },
    { accessor: "trans_name", header: "Trans Name", textAlign: "center" },
    { accessor: "credit", header: "Credit", textAlign: "right", isTotalReq: true, isCurrency: true, decimalPlaces: 2 },
    { accessor: "debit", header: "Debit", textAlign: "right", isTotalReq: true, isCurrency: true, decimalPlaces: 2 },
];

  const exportToPrint = () => {
    const titleContent = "Supplier Ledger Report";
    let supplierName = ''
    let metalName = ''
    if (selectedSupplier) {
      const selectedSupplierData = supplier.find((item) => item.id_supplier == selectedSupplier);
      if (selectedSupplierData) {
        supplierName = selectedSupplierData.supplier_name;
      }
    }
    if (selectedMetal){
      const selectedMetalData = metals.find((item) => item.id_metal == selectedMetal);
      if (selectedMetalData) {
        metalName = selectedMetalData.metal_name;
      }
    }
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    };
    // Get the HTML table content
    const tableHTML = tableRef?.current?.innerHTML || "";
    const currentDateTime = new Date().toLocaleString("en-GB", options);
    // Combine title and table content into a single div
    const combinedHTML = `<div id="tablecontainer">
        <table><tr><td style="text-align:center;border: none;font-size:12px;text-transform: uppercase;font-weight:bold;" colspan="6">
        ${userInfo?.user?.company_fullname}<br/>
        <span style="font-size:10px;font-weight:normal;">${userInfo?.user?.company_address}</span><br/>
        ${userInfo?.user?.company_city ? `<span style="font-size:10px;font-weight:normal;">${userInfo?.user?.company_city}</span><br/>` : ""}
        ${userInfo?.user?.company_gst ? `<span style="font-size:10px;font-weight:normal;">GST IN : ${userInfo?.user?.company_gst}</span><br/>` : ""}
        <span style="font-size:10px;font-weight:bold;">${titleContent}</span><br/>
        ${supplierName ? `<span style="font-size:10px;font-weight:normal;">Supplier Name : ${supplierName}</span><br/>` : ""}
        ${metalName ? `<span style="font-size:10px;font-weight:normal;">Metal Name : ${metalName}</span><br/>` : ""}
        <span style="font-size:10px;font-weight:normal;">From Date : ${moment(startDate).format("DD-MM-YYYY")} && To Date : ${moment(endDate).format("DD-MM-YYYY")}<br/>
        Print Taken On: ${currentDateTime} By ${userInfo?.user?.emp_firstname}  ${userInfo?.user?.emp_lastname}</span></td></tr>
        </table>
        ${tableHTML}
    </div>`;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = combinedHTML;
    
    // Ensure you're querying the intended element
    const table = tempDiv.querySelector('#tablecontainer'); // Look for a <table> inside tempDiv
    if (!table) {
        console.error("No table element found in the provided HTML string.");
        return;
    }
    
    // Print the content
    const printWindow = window.open('', '_blank');
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
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f4f4f4;
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
    
  }

  const exportToExcel = () => {
    const titleContent = "Supplier Ledger Report";
    // Get the HTML table content
    const tableHTML = tableRef?.current?.innerHTML || "";

    // Combine title and table content into a single div
    const combinedHTML = `<div id="tablecontainer" >
        <table><tr><td style="text-align:center;"colspan= "${columns.length}" >${titleContent}</td></tr></table>
        ${tableHTML}
    </div>`;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = combinedHTML;
      
      // Ensure you're querying the intended element
      const table = tempDiv.querySelector('#tablecontainer'); // Look for a <table> inside tempDiv
      if (!table) {
          console.error("No table element found in the provided HTML string.");
          return;
      }
      
      // Proceed with further operations on the table
      console.log("Table found:", table);
      

      // Convert the table to a worksheet
      const worksheet = XLSX.utils.table_to_sheet(table);

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Export the workbook as an Excel file
      XLSX.writeFile(workbook, 'export.xlsx');
    };

  return (
    <React.Fragment>
      <Head title={pagePermission?.title ? pagePermission?.title : "Supplier Ledger Reports"}></Head>
      {pagePermission?.view && (
        <Content>
          <Block size="lg">
            <Card className="card-bordered card-preview">
              <Styles>
                <div className="card-inner">
                  <div className="card-title-group">
                    <div className="toggle-wrap nk-block-tools-toggle">
                      <h5>Supplier Ledger Reports</h5>
                    </div>
                    <div className="card-tools me-n1">
                      <ul className="btn-toolbar gx-1">
                        <li className="btn-toolbar-sep"></li>
                        <li>
                          <div className="dt-buttons btn-group flex-wrap">
                            <button className="btn btn-secondary buttons-csv buttons-html5" type="button">
                              <span>CSV</span>
                            </button>{" "}
                            <button
                              className="btn btn-secondary buttons-excel buttons-html5"
                              type="button"
                               onClick={() => exportToExcel()}
                            >
                              <span>Excel</span>
                            </button>{" "}
                            <button className="btn btn-secondary " type="button" onClick={exportToPrint}>
                              <Icon name="printer-fill"></Icon>
                            </button>{" "}
                          </div>
                        </li>
                        <li className="btn-toolbar-sep"></li>
                        <li>
                          <div className="btn btn-trigger btn-icon dropdown-toggle" onClick={toggleFilterModal}>
                            <div className="dot dot-primary"></div>
                            Filters<Icon name="filter-alt"></Icon>
                          </div>
                        </li>
                        {/* {FilterComponent} */}
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="table-responsive dataTables_wrapper" ref={tableRef}>
                    <table className="table-wrapper react_table table-bordered">
                      <thead>
                        <tr>
                            <th rowSpan={2} style={{ textAlign: "center" }}>
                              Date
                            </th>
                            <th rowSpan={2} style={{ textAlign: "center" }}>
                              Trans Name
                            </th>
                            <th colSpan={2}  style={{ textAlign: "center" }}>
                              Weight
                            </th>
                            <th colSpan={2}  style={{ textAlign: "center" }}>
                              Amount
                            </th>
                         
                        </tr>
                        <tr>
                         
                         <th style={{ textAlign: "center" }}>
                         Debit
                         </th>
                         <th style={{ textAlign: "center" }}>
                         Credit
                         </th>
                         <th style={{ textAlign: "center" }}>
                         Debit
                          </th>
                          <th style={{ textAlign: "center" }}>
                          Credit
                          </th>

                      
                     </tr>


                      </thead>
                      <tbody>

                        {supplierLedgerList != null &&
                          
                             (
                              <React.Fragment>
                                <tr style={{ fontWeight: "bold" }}>

                                  <td style={{ textAlign: "left" }}>Opening :</td>
                                  <td style={{ textAlign: "left" }} > </td>
                                  <td style={{ textAlign: "right" }} >{ parseFloat(supplierLedgerList.opening.balance_weight) < 0 ? parseFloat(Math.abs(supplierLedgerList.opening.balance_weight)).toFixed(3) +" Dr": ''} </td>
                                  <td style={{ textAlign: "right" }} >{ parseFloat(supplierLedgerList.opening.balance_weight) > 0 ? parseFloat(Math.abs(supplierLedgerList.opening.balance_weight)).toFixed(3) +" Cr": ''} </td>
                                  <td style={{ textAlign: "right" }} > { parseFloat(supplierLedgerList.opening.balance_amount) < 0 && ( <><CurrencyDisplay value={Math.abs(supplierLedgerList.opening.balance_amount)}  /> Dr </>)}</td>
                                  <td style={{ textAlign: "right" }} > { parseFloat(supplierLedgerList.opening.balance_amount) > 0 && ( <><CurrencyDisplay value={Math.abs(supplierLedgerList.opening.balance_amount)}  /> Cr </>)}</td>
                                </tr>
                                {supplierLedgerList?.details?.map((item, rowIndex) => (
                                  <tr key={rowIndex}>
                                    <td style={{ textAlign: "left" }} >{item.entry_date}</td>
                                    <td style={{ textAlign: "left" }} dangerouslySetInnerHTML={{ __html: `${item.name}` }} ></td>
                                    <td style={{ textAlign: "right" }} >{item.debit_wt > 0 && parseFloat(item.debit_wt).toFixed(3)}</td>
                                    <td style={{ textAlign: "right" }}>{item.credit_wt > 0 && parseFloat(item.credit_wt).toFixed(3)}</td>
                                    <td style={{ textAlign: "right" }} >{item.debit_amt > 0 && ( <CurrencyDisplay value={item.debit_amt} />)}</td>
                                    <td style={{ textAlign: "right" }}>{item.credit_amt > 0 && (<CurrencyDisplay value={item.credit_amt} />)}</td>
                                  </tr>
                                ))}

                                {supplierLedgerList?.details.length > 0 && (
                                  <tr style={{ fontWeight: "bold" }}>
                                    <td>SUB TOTAL</td>
                                    <td></td>
                                    <td style={{ textAlign: "right" }} >{parseFloat(calculateTotal('debit_wt',supplierLedgerList?.details)).toFixed(3)}</td>
                                    <td style={{ textAlign: "right" }}>{calculateTotal('credit_wt',supplierLedgerList?.details)}</td>
                                    <td style={{ textAlign: "right" }} ><CurrencyDisplay value={calculateTotal('debit_amt',supplierLedgerList?.details)} /></td>
                                    <td style={{ textAlign: "right" }}><CurrencyDisplay value={calculateTotal('credit_amt',supplierLedgerList?.details)} /></td>
                                  </tr>
                                )}
                                  {supplierLedgerList?.details.length > 0 && (
                                  <tr style={{ fontWeight: "bold" }}>
                                    <td>CLOSING</td>
                                    <td></td>
                                    <td style={{ textAlign: "right" }} > {calculateGrandTotalWt(supplierLedgerList,1)}</td>
                                    <td style={{ textAlign: "right" }} > {calculateGrandTotalWt(supplierLedgerList,2)}</td>
                                    <td style={{ textAlign: "right" }} > {calculateDayTotalAmt(supplierLedgerList,1)}</td>
                                    <td style={{ textAlign: "right" }} > {calculateDayTotalAmt(supplierLedgerList,2)}</td>

                                  </tr>
                                )}

                              </React.Fragment>
                            )
                          }

                      </tbody>

                      <tfoot></tfoot>
                    </table>
                  </div>
                </div>
              </Styles>
            </Card>
          </Block>
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
              is_multi_branch_filter_req: true,
              is_scheme_filter_req: false,
              is_date_filter_req: true,
              isSupplierFilterReq: true,
              isMetalFilterReq: true,
              setFilteredSupplier:SetSelectedSupplier,
              filteredSupplier:selectedSupplier,
              supplier,
              setFilteredMetal : SetSelectedMetal,
              filterMetal : selectedMetal,
              metals
            }}
          />
        </Content>
      )}
    </React.Fragment>
  );
};

export default SupplierLedgerReport;
