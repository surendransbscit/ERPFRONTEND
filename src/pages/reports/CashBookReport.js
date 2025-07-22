import React, { useEffect,useState,useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import styled from "styled-components";
import { Block,Icon} from "../../components/Component";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { Card } from "reactstrap";
import { getCashBookReport } from "../../redux/thunks/reports";
import moment from "moment";
import { useForm } from "react-hook-form";
import "../../assets/css/datatable.css";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import ReportFilterComponent from "./ReportFilterComponent";
import FilterSidebar from "../../components/sidebar/FilterSidebar";
import secureLocalStorage from "react-secure-storage";
import { isUndefined } from "../../components/common/calculations/ErpCalculations";
import * as XLSX from 'xlsx'
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

const CashBookReport = () => {
  const { register, clearErrors, setValue, errors } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathName = location?.pathname;
  const { cashBookList, isLoading: loadingData } = useSelector((state) => state.reportReducer);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const [selectedBranch, SetSelectedBranch] = useState([]);
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());
  const [reportType, setReportType] = useState(1);
  const reportTypeOption = [ { value: 1, label: "Summary" }, { value: 2, label: "Detail" } ];
  const tableRef = useRef();
  const { billSettingType } = useBillSettingContext();
  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

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
    dispatch(
      getCashBookReport({
        fromDate: moment(startDate).format("YYYY-MM-DD"),
        toDate: moment(endDate).format("YYYY-MM-DD"),
        branch: branch,
        reportType:reportType,
        bill_setting_type:billSettingType
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
        getCashBookReport({
          fromDate: moment(startDate).format("YYYY-MM-DD"),
          toDate: moment(endDate).format("YYYY-MM-DD"),
          branch: branch,
          reportType:reportType,
          bill_setting_type:billSettingType
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [filterModal, SetFilterModal] = useState(false);
  const toggleFilterModal = () => SetFilterModal(!filterModal);

  const calculateTotal = (field, data) => {
    return data.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  
  const calculateDayTotal = (data) => {
     let opn = isUndefined(data.opening)
     let credit = calculateTotal('credit',data.details)
     let debit = calculateTotal('debit',data.details)
     return parseFloat(opn) -  parseFloat(credit) + parseFloat(debit)
  };

  const columns = [
    // { accessor: "sno", header: "SNO", textAlign: "left" },
    { accessor: "trans_name", header: "Trans Name", textAlign: "left" },
    { accessor: "debit", header: "Credit", textAlign: "right", isTotalReq: true, isCurrency: true, decimalPlaces: 2 },
    { accessor: "credit", header: "Debit", textAlign: "right", isTotalReq: true, isCurrency: true, decimalPlaces: 2 },
];

  const printReport = () => {
    const printUrl = `${process.env.PUBLIC_URL}/reports/cash_abstract/print`;
    const reportData = {
      columns: columns,
      data: cashBookList,
      company_name: userInfo?.user?.company_fullname,
    };
    localStorage.setItem(
      "cashAbstractData",
      JSON.stringify({
        columns: columns,
        data: cashBookList,
        company_name: userInfo?.user?.company_fullname,
        company_address: userInfo?.user?.company_address,
        comapny_mobile: userInfo?.user?.comapny_mobile,
        fromDate: startDate,
        toDate: endDate,
      })
    );

    const newWindow = window.open(printUrl, "_blank");

    newWindow.onload = () => {
      newWindow.postMessage(reportData, "*");
    };

  };

  const exportToPrint = () => {
    const titleContent = "Cash Book Report";

    // Get the HTML table content
    const tableHTML = tableRef?.current?.innerHTML || "";
    
    // Combine title and table content into a single div
    const combinedHTML = `<div id="tablecontainer">
        <table><tr><td style="text-align:center;" colspan="${columns.length}">${titleContent}</td></tr></table>
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
    const titleContent = "Cash Book Report";

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
      <Head title={pagePermission?.title ? pagePermission?.title : "Cash Book Reports"}></Head>
      {pagePermission?.view && (
        <Content>
          <Block size="lg">
            <Card className="card-bordered card-preview">
              <Styles>
                <div className="card-inner">
                  <div className="card-title-group">
                    <div className="toggle-wrap nk-block-tools-toggle">
                      <h5>Cash Book Reports</h5>
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
                  <div className="table-responsive dataTables_wrapper" ref={tableRef} >
                    <table className="table-wrapper react_table">
                      <thead>
                        <tr>
                          {columns?.map((column, index) => (
                            <th key={index} style={{ textAlign: column?.textAlign }}>
                              {column.header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>

                        { cashBookList.length > 0 &&
                          Object.entries(cashBookList).map(([date, items]) => {
                            return (
                              <React.Fragment key={date}>
                                <tr style={{ fontWeight: "bold" }}>
                                  <td style={{ textAlign: "left" }} >{items.entry_date} </td>
                                  {/* <td></td> */}
                                  <td style={{ textAlign: "right" }} ><span style={{ textAlign: "left",marginRight:"50px" }} >Opening :</span> <span style={{ textAlign: "right" }} ><CurrencyDisplay value={items.opening} /></span></td>
                                  <td style={{ textAlign: "right" }} > </td>
                                  {/* <td style={{ textAlign: "left" }} colSpan={columns.length}>{section}</td> */}
                                </tr>
                                {items?.details?.map((item, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {columns.map((column, colIndex) => (
                                      <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                                        {column.isCurrency ? (
                                          <CurrencyDisplay value={item[column.accessor]} />
                                        ) : column.decimal_places ? (
                                          parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                                        ) : (
                                          item[column.accessor]
                                        )}
                                      </td>
                                    ))}
                                  </tr>
                                ))}

                                {items?.details.length > 0 && (
                                  <tr style={{ fontWeight: "bold" }}>
                                    <td>SUB TOTAL</td>
                                    {columns?.map((column, index) => {
                                      return (
                                        index !== 0 && (
                                          <td key={index} style={{ textAlign: column?.textAlign }}>
                                            {column.isTotalReq ? (
                                              column.isCurrency ? (
                                                <CurrencyDisplay
                                                  value={calculateTotal(column.accessor, items?.details)}
                                                />
                                              ) : (
                                                calculateTotal(column.accessor, items?.details)
                                              )
                                            ) : (
                                              ""
                                            )}
                                          </td>
                                        )
                                      );
                                    })}
                                  </tr>
                                )}
                                  {items?.details.length > 0 && (
                                  <tr style={{ fontWeight: "bold" }}>
                                    <td>DAY TOTAL</td>
                                    <td></td>
                                    <td style={{ textAlign: "right" }} > <CurrencyDisplay value={calculateDayTotal(items)}/></td>
                                  </tr>
                                )}

                              </React.Fragment>
                            );
                          })}
                          { ! cashBookList.length && (
                          <tr style={{ fontWeight: "bold" }}>
                            <td colSpan={3}>No Data</td>
                            </tr>
                          )}


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
              setReportType,
              reportType,
              reportTypeOption,
              isReportTypeReq: true,
            }}
          />
        </Content>
      )}
    </React.Fragment>
  );
};

export default CashBookReport;
