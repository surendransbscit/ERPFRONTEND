import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import { Block, Col, DropdownInputField, Icon, ReactDataTable, Row } from "../../components/Component";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { Button, DropdownMenu, DropdownToggle, UncontrolledDropdown, Card } from "reactstrap";
import { getStockInAndOutReport } from "../../redux/thunks/reports";
import moment from "moment";
import { useForm } from "react-hook-form";
import "../../assets/css/datatable.css";
import { tr } from "date-fns/locale";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import ReportFilterComponent from "./ReportFilterComponent";
import FilterSidebar from "../../components/sidebar/FilterSidebar";
import CashAbstractPrintComponent from "../../components/reports-print/CashAbstractPrintComponent";
import CashAbstractTable from "../../components/reports-print/CashAbstractTable";
import secureLocalStorage from "react-secure-storage";
import { useProducts,useSections,useMetals } from "../../components/filters/filterHooks";
import * as XLSX from 'xlsx'
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import StockInAndOutTable from "../../components/reports-print/StockInAndOutTable";

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

const StockInAndOutReport = () => {
  const { register, clearErrors, setValue, errors } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tableRef = useRef();
  const pathName = location?.pathname;
  const { stockInAndOutReportList, isLoading: loadingData } = useSelector((state) => state.reportReducer);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const [selectedBranch, SetSelectedBranch] = useState([]);
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());
  const [filteredProducts, setFilteredProducts] = useState();
  const [filterSection, setFilteredSection] = useState();
  const [filterMetal, setFilteredMetal] = useState();
  const { metals } = useMetals();
  const { sections } = useSections();
  const { products } = useProducts();
  const [exportModal, SetExportModal] = useState(false);
  const toggleExportModal = () => SetExportModal(!exportModal);
  const [exportColumns, setExportColumns] = useState([]);
  const [exportSettings, setExportSettings] = useState([]);
  const chunkArray = (arr, size) => {
    return arr.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);
  };

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

    useEffect(() => {
      if(exportSettings?.length > 0){
        let col = exportSettings.filter(item => item.isChecked === true)
        setExportColumns(stockInAndOutReportList?.columns != undefined ? col : [])
      }
  
    }, [exportSettings]);

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
      getStockInAndOutReport({
        fromDate: moment(startDate).format("YYYY-MM-DD"),
        toDate: moment(endDate).format("YYYY-MM-DD"),
        branch: branch
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
        getStockInAndOutReport({
          fromDate: moment(startDate).format("YYYY-MM-DD"),
          toDate: moment(endDate).format("YYYY-MM-DD"),
          branch: branch,
          metal: filterMetal,
          section: filterSection,
          product: filteredProducts
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
      let column = stockInAndOutReportList?.columns.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const columns = [
    { accessor: "product_name", header: "Product", isTotalReq: false, textAlign: "left" },
    { accessor: "op_pieces", header: "O/P Pcs", isTotalReq: true, textAlign: "right" },
    { accessor: "op_gross_wt", header: "OP Gwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "op_net_wt", header: "OP Nwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "op_dia_wt", header: "OP Dia", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "op_stone_wt", header: "OP Stn", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "inw_pieces", header: "Inw Pcs", isTotalReq: true, textAlign: "right" },
    { accessor: "inw_gross_wt", header: "Inw Gwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "inw_net_wt", header: "Inw Nwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "inw_dia_wt", header: "Inw Dia", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "inw_stone_wt", header: "Inw Stn", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "outw_pieces", header: "Out Pcs", isTotalReq: true, textAlign: "right" },
    { accessor: "outw_gross_wt", header: "Out Gwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "outw_net_wt", header: "Out Nwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "outw_dia_wt", header: "Out Dia", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "outw_stone_wt", header: "Out Stn", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "closing_pieces", header: "Clc Pcs", isTotalReq: true, textAlign: "right" },
    { accessor: "closing_gross_wt", header: "Clc Gwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "closing_net_wt", header: "Clc Nwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "closing_dia_wt", header: "Clc Dia", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "closing_stone_wt", header: "Cls stn", isTotalReq: true, textAlign: "right", decimal_places: 3 }
  ];

  useEffect(() => {
    if(stockInAndOutReportList?.columns != undefined){
      setExportSettings(stockInAndOutReportList?.columns != undefined ? stockInAndOutReportList.columns : [])
    }
  }, [stockInAndOutReportList]);

  const tableData = chunkArray(exportSettings, 5);

  

  const exportToPrint = () => {
    const titleContent = "Stock In and Out Report";
    let filteredBy  = "FILTERED BY"

    if(filterMetal){
      let metal_name = metals.find((item)=>item.id_metal == filterMetal).metal_name
      filteredBy += " METAL : "+metal_name+" / "
    }

    if(filteredProducts){
      let product_name = products.find((item)=>item.pro_id == filteredProducts).product_name
      filteredBy += " PRODUCT : "+product_name+" / "
    }

    if(filterSection){
      let section_name = sections.find((item)=> item.id_section == filterSection).section_name
      filteredBy += " SECTION : "+section_name+" / "
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
    const currentDateTime = new Date().toLocaleString("en-GB", options);
    // Get the HTML table content
    const tableHTML = tableRef?.current?.innerHTML || "";

  let filterRow = `<tr><td style="text-align:center;border: none;font-size:10px;text-transform: uppercase;font-weight:bold" colspan="${exportColumns.length}">GST IN ${userInfo?.user?.company_gst}`

    // Combine title and table content into a single div
    const combinedHTML = `<div id="tablecontainer">
        <table><tr><td style="text-align:center;border: none;text-align:center;border: none;font-size:12px;text-transform: uppercase;font-weight:bold;" colspan="${exportColumns.length}">
        ${userInfo?.user?.company_fullname}<br/>
        <span style="font-size:10px;font-weight:normal;">${userInfo?.user?.company_address}</span><br/>
        ${userInfo?.user?.company_city ? `<span style="font-size:10px;font-weight:normal;">${userInfo?.user?.company_city}</span><br/>` : ""}
        ${userInfo?.user?.company_gst ? `<span style="font-size:10px;font-weight:normal;">GST IN : ${userInfo?.user?.company_gst}</span><br/>` : ""}
        <span style="font-size:10px;font-weight:bold;">${titleContent}</span><br/>
        <span style="font-size:10px;font-weight:normal;">From Date : ${moment(startDate).format("DD-MM-YYYY")} && To Date : ${moment(endDate).format("DD-MM-YYYY")}<br/>
         ${filteredBy != "FILTERED BY" ? `<span>${filteredBy}</span><br/>` : ""}
        Print Taken On: ${currentDateTime} By ${userInfo?.user?.emp_firstname}  ${userInfo?.user?.emp_lastname}</span><br/>
       
        </td></tr>
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
                    @page {
                      size: 80mm 250mm;
                      margin: 2mm;
                      margin-top: 0;
                      /* Set the size for the page */
                          }
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
    
  }

  const exportToExcel = () => {
    const titleContent = "Stock In and Out Report";

    // Get the HTML table content
    const tableHTML = tableRef?.current?.innerHTML || "";

    // Combine title and table content into a single div
    const combinedHTML = `<div id="tablecontainer" >
        <table><tr><td style="text-align:center;"colspan= "${exportColumns.length}" >${titleContent}</td></tr></table>
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

  const handelChange = (accessor,field, value) => {
    const index = exportSettings.findIndex(item => item.accessor === accessor);

    setExportSettings((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      let updateValue = {
        [field] : value,
      }
      updatedValues[index] = {...updatedObject,...updateValue};
      return updatedValues;
    });
  };

  return (
    <React.Fragment>
      <Head title={pagePermission?.title ? pagePermission?.title : "Cash Abstract Reports"}></Head>
      {pagePermission?.view && (
        <Content>
          <Block size="lg">
            <Card className="card-bordered card-preview">
              <Styles>
                <div className="card-inner">
                  <div className="card-title-group">
                    <div className="toggle-wrap nk-block-tools-toggle">
                      <h5>Stock In and Out Reports</h5>
                    </div>
                    <div className="card-tools me-n1">
                      <ul className="btn-toolbar gx-1">
                        <li className="btn-toolbar-sep"></li>
                        <li>
                          <div className="dt-buttons btn-group flex-wrap">
                            <button className="btn btn-secondary buttons-csv buttons-html5" type="button">
                              <span>Print</span>
                            </button>{" "}
                            <button
                              className="btn btn-secondary buttons-excel buttons-html5"
                              type="button"
                               onClick={() => toggleExportModal()}
                            >
                              <span>Excel</span>
                            </button>{" "}
                            <button className="btn btn-secondary " type="button"  onClick={() => toggleExportModal()}>
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
                  <div className="table-responsive dataTables_wrapper" >
                    <StockInAndOutTable
                      calculateTotal={calculateTotal}
                      stockInAndOutReportList={stockInAndOutReportList}
                      columns={stockInAndOutReportList?.columns != undefined ? stockInAndOutReportList?.columns : []}
                    />
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
              isSectionFilterReq: true,
              isMetalFilterReq: true,
              isProductFilterReq: true,
              filterMetal,
              filterSection,
              filteredProducts,
              setFilteredMetal,
              setFilteredSection,
              setFilteredProducts,
              products,
              sections,
              metals
            }}
          />
          <Modal isOpen={exportModal} className="modal-dialog-centered text-center" size="lg">
                <ModalHeader
                  tag="h6"
                  className="bg-light"
                  toggle={toggleExportModal}
                  close={
                    <button
                      className="close"
                      style={{
                        position: "absolute",
                        right: "1rem",
                      }}
                      onClick={toggleExportModal}
                    >
                      <Icon name="cross" />
                    </button>
                  }
                >
                  <span style={{ fontSize: "small" }}>Export Report</span>
                </ModalHeader>
                <ModalBody className="text-center ">

                  <p className="mb-3" style={{textAlign:"left",fontWeight:"bold"}} >Export Column</p>

                <div >
                  <table className="react_table" style={{ width: "100%", textAlign: "left" }}>
                  <tbody>
                    {tableData.map((row, rowIndex) => (
                      <tr key={rowIndex} style={{
                        background: "#fff",           
                        boxShadow: "inset 0px 1px 0px 0px #fff",
                        textAlign: "center",
                        padding: "0.25rem",
                        fontWeight: "500",
                        color: "#364a63",
                        border: "1px solid #ccc"
                      }}>
                        {row.map((item, colIndex) => (
                          <td style={{
                            background: "#fff",           
                            boxShadow: "inset 0px 1px 0px 0px #fff",
                            textAlign: "left",
                            padding: "0.25rem",
                            fontWeight: "500",
                            color: "#364a63",
                            border: "1px solid #ccc"
                          }}  key={colIndex}> <input
                          type="checkbox" 
                          checked={item.isChecked} 
                          onChange={(event) => {
                            handelChange(item.accessor,'isChecked',event.target.checked);
                          }}
                        />  {item.Header}</td>
                        ))}
                        {/* Fill empty cells if row has less than 5 items */}
                        {Array.from({ length: 5 - row.length }).map((_, i) => (
                          <td key={`empty-${rowIndex}-${i}`}></td>
                        ))}
                      </tr>
                      ))}
                      </tbody>
                  </table>
                </div>

                <div style={{display:"none"}} >
                <div className="dataTables_wrapper" ref={tableRef} >
                    <div className="table-wrapper" style={{ overflowX: "auto", width: "100%" }}>
                    <StockInAndOutTable
                      calculateTotal={calculateTotal}
                      stockInAndOutReportList={stockInAndOutReportList}
                      columns={exportColumns}
                    />
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "end", marginTop: "20px" }}>
                        <button className="btn btn-secondary" type="button"  onClick={() => {
                          toggleExportModal();
                          exportToPrint();
                        }}>
                              <Icon name="printer-fill"></Icon> <span>Print</span>
                          </button> 
                          &nbsp;
                        <button className="btn btn-primary" type="button"  onClick={() => {
                          toggleExportModal();
                          exportToExcel();
                        }
                        }>
                        <Icon name="file-xls"></Icon><span>Excel</span>
                            </button>
                  </div>
                        
                </ModalBody>
          </Modal>
        </Content>
      )}
    </React.Fragment>
  );
};

export default StockInAndOutReport;
