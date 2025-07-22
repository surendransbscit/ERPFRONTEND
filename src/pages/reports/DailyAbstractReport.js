import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import styled from "styled-components";
import { Block,Icon} from "../../components/Component";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { Card } from "reactstrap";
import {  getDailyAbstractReport } from "../../redux/thunks/reports";
import moment from "moment";
import { useForm } from "react-hook-form";
import "../../assets/css/datatable.css";
import FilterSidebar from "../../components/sidebar/FilterSidebar";
import html2pdf from "html2pdf.js";
import DailyAbstractTable from "../../components/reports-print/DailyAbstractTable";
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

const DailyAbstractReport = () => {
    const { register, clearErrors, setValue, errors } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathName = location?.pathname;
  const [fromDate, SetFromDate] = useState(new Date());
  const [toDate, SetToDate] = useState(new Date());
  const [scheme, SetScheme] = useState("");
  const tableRef = useRef(null);
  const [counterId, setCounterId] = useState();
  const { dailyAbstractReportList, isLoading: loadingData } = useSelector((state) => state.reportReducer);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const [selectedBranch, SetSelectedBranch] = useState([]);
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());
  const { billSettingType } = useBillSettingContext();
  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    dispatch(
      getDailyAbstractReport({
        from_date: moment(startDate).format("YYYY-MM-DD"),
        to_date: moment(endDate).format("YYYY-MM-DD"),
        id_branch: selectedBranch?.map((obj) => {
          const container = obj.value;
          return container;
        }),
        bill_setting_type: billSettingType,
      })
    );
  }, [dispatch, fromDate, toDate, billSettingType]);

  const getData = async () => {
    try {
      await dispatch(
        getDailyAbstractReport({
          from_date: moment(startDate).format("YYYY-MM-DD"),
          to_date: moment(endDate).format("YYYY-MM-DD"),
          id_branch: selectedBranch?.map((obj) => {
            const container = obj.value;
            return container;
          }),
          bill_setting_type: billSettingType,
          id_counter: counterId,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [filterModal, SetFilterModal] = useState(false);
  const toggleFilterModal = () => SetFilterModal(!filterModal);

  const calculateTotal = (field, data) => {
    if(Array.isArray(data)){
      return data.reduce((acc, current) => {
        let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
        let column = columns.find((item) => item.accessor === field);
        let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
        return parseFloat(total).toFixed(decimal_places);
      }, 0);
    }else{
      return 0;
    }

  };

  const columns = [
    { accessor: "product_name", header: "PRODUCT", isTotalReq: false, textAlign: "left" },
    { accessor: "pcs", header: "PCS", isTotalReq: true, textAlign: "right" },
    { accessor: "grosswt", header: "GRS.WT", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "netwt", header: "NET.WT", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "issue_pcs", header: "PCS", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "issue_grosswt", header: "GRS.WT", isTotalReq: true, decimal_places: 3, textAlign: "right" },
    { accessor: "issue_netwt", header: "NET.WT", isTotalReq: true, decimal_places: 3, textAlign: "right" },
    { accessor: "issue_amount", header: "RECEIPT", isTotalReq: true, decimal_places: 2, textAlign: "right" },
    { accessor: "payment_amount", header: "PAYMENT", isTotalReq: true, decimal_places: 2, textAlign: "right" },
  ];

    const printReport = () => {
        const printUrl = `${process.env.PUBLIC_URL}/reports/daily_abstract/print`;
        const reportData = {
            columns: columns,
            data: schemeAbstractReportList,
            modewiseData: modeWiseCollectionReportList,
            company_name: userInfo?.user?.company_fullname,
        };
        localStorage.setItem(
            "schemeAbstractData",
            JSON.stringify({
                columns: columns,
                data: schemeAbstractReportList,
                company_name: userInfo?.user?.company_fullname,
                company_address: userInfo?.user?.company_address,
                comapny_mobile: userInfo?.user?.comapny_mobile,
                fromDate: startDate,
                toDate: endDate,
                modewiseData: modeWiseCollectionReportList,
            })
        );

        const newWindow = window.open(printUrl, "_blank");

        newWindow.onload = () => {
            newWindow.postMessage(reportData, "*");
        };
    };

    const exportToExcel = () => {
      // Get the HTML table element
      const tableElement = tableRef.current;

      console.log(tableRef,tableElement,"tableElement")

      // Convert the table to a worksheet
      const worksheet = XLSX.utils.table_to_sheet(tableElement);

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Export the workbook as an Excel file
      XLSX.writeFile(workbook, 'DailyAbstractReport.xlsx');
  };
    const exportToPrint = () => {
      const titleContent ="Daily Abstract Report";
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      const currentDateTime = new Date().toLocaleString("en-GB", options);
      // Get the HTML table content
      const tableHTML = tableRef?.current?.innerHTML || "";
  
      let filterRow = `<tr><td style="text-align:center;border: none;font-size:10px;text-transform: uppercase;font-weight:bold" colspan="${columns.length}">GST IN ${userInfo?.user?.company_gst}`
  
      // Combine title and table content into a single div
      const combinedHTML = `<div id="tablecontainer">
          <table><tr><td style="text-align:center;border: none;font-size:12px;text-transform: uppercase;font-weight:bold;" colspan="${columns.length}">
          ${userInfo?.user?.company_fullname}<br/>
          <span style="font-size:10px;font-weight:normal;">${userInfo?.user?.company_address}</span><br/>
          ${userInfo?.user?.company_city ? `<span style="font-size:10px;font-weight:normal;">${userInfo?.user?.company_city}</span><br/>` : ""}
          ${userInfo?.user?.company_gst ? `<span style="font-size:10px;font-weight:normal;">GST IN : ${userInfo?.user?.company_gst}</span><br/>` : ""}
          <span style="font-size:10px;font-weight:bold;">${titleContent}</span><br/>
          <span style="font-size:10px;font-weight:normal;">From Date : ${moment(startDate).format("DD-MM-YYYY")} && To Date : ${moment(endDate).format("DD-MM-YYYY")}<br/>
          Print Taken On: ${currentDateTime} By ${userInfo?.user?.emp_firstname}  ${userInfo?.user?.emp_lastname}</span></td></tr>
          </table>
          ${tableHTML}
      </div>`;
  
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = combinedHTML;
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
                      button {
                        font-size: 6pt;  /* Smaller text */
                        padding: 0px; /* Reduce padding */
                      }
  
                      tr{
                       padding:0px;
                      }
                      
                      th {
                          border-top: 1px solid #000;
                          border-bottom: 1px solid #000;
                          background-color: #f4f4f4;
                          color:rgb(0, 0, 0) !important;
                          white-space: normal;
                      }
                      @page {
                            size: A4; 
                            margin: 3mm;
                        }
                        @media print {
                          * {
                              background: none !important;
                              color: black !important;
                              
                          }
                       
                          body {
                              font-family:  "Source Code Pro", Courier, monospace;
                              font-size: 10pt; /* Adjust as needed */
                              line-height: 1;
                          }
                          table {
                              font-size: 10pt; /* Adjust as needed */
                          }
  
  
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
// const exportToPrint = () => {
//   const titleContent = "Daily Abstract Report";

//   // Get the HTML table content
//   const tableHTML = tableRef?.current?.innerHTML || "";
  
//   // Combine title and table content into a single div
//   const combinedHTML = `<div id="tablecontainer">
//       <table><tr><td style="text-align:center;" colspan="${columns.length}">${titleContent}</td></tr></table>
//       ${tableHTML}
//   </div>`;
  
//   const tempDiv = document.createElement('div');
//   tempDiv.innerHTML = combinedHTML;
  
//   // Ensure you're querying the intended element
//   const table = tempDiv.querySelector('#tablecontainer'); // Look for a <table> inside tempDiv
//   if (!table) {
//       console.error("No table element found in the provided HTML string.");
//       return;
//   }
  
//   // Print the content
//   const printWindow = window.open('', '_blank');
//   printWindow.document.open();
//   printWindow.document.write(`
//       <html>
//           <head>
//               <title>${titleContent}</title>
//               <style>
//                   /* Add custom styles for printing here */
//                   table {
//                       width: 100%;
//                       border-collapse: collapse;
//                   }
//                   th, td {
//                       border: 1px solid #000;
//                       padding: 8px;
//                       text-align: left;
//                   }
//                   th {
//                       background-color: #f4f4f4;
//                   }
//               </style>
//           </head>
//           <body>
//               ${table.outerHTML}
//           </body>
//       </html>
//   `);
//   printWindow.document.close();
//   printWindow.print();
  
// }

    return (
        <React.Fragment>
            <Head title={pagePermission?.title ? pagePermission?.title : "Daily Abstract Reports"}></Head>
            {pagePermission?.view && (
                <Content>
                    <Block size="lg">
                        <Card className="card-bordered card-preview">
                            <Styles>
                                <div className="card-inner">
                                    <div className="card-title-group">
                                        <div className="toggle-wrap nk-block-tools-toggle">
                                            <h5>Daily Abstract Reports</h5>
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
                                                
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <DailyAbstractTable
                                    ref={tableRef}
                                    dailyAbstractReportList={dailyAbstractReportList}
                                    calculateTotal={calculateTotal}
                                    columns={columns}
                                />
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
                            counterId,
                            setCounterId,
                            is_group_by_req: false,
                            is_multi_branch_filter_req: false,
                            is_scheme_filter_req: false,
                            is_date_filter_req: true,
                            is_branch_filter_req: true,
                            isCounterFilterReq: true,
                        }}
                    />
                </Content>
            )}
        </React.Fragment>
    );
};

export default DailyAbstractReport;
