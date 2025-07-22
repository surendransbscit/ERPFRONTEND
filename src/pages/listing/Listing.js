import React, { useEffect, useRef, useState } from "react";
import { matcherData } from "./MenuReduxMatcher";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Block, TooltipComponent, UserAvatar } from "../../components/Component";
import { Table } from "../../components/sds-table/ReactTable";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { Badge, Button, Card } from "reactstrap";
import queryString from "query-string";
import moment from "moment";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import DeleteModal from "../../components/modals/DeleteModal";
import CancelModel from "../../components/modals/CancelModel";
import { toastfunc, toastsuccess } from "../../components/sds-toast-style/toast-style";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import PreviewImagesModal from "../../components/modals/PreviewImagesModal";
import FilterSidebar from "../../components/sidebar/FilterSidebar";
import OTPModal from "../../components/modals/OtpModel";
import { userOTPVerify } from "../../redux/thunks/authUser";
import * as XLSX from 'xlsx'
import ExportPreviewModal from "../../components/modals/ExportPreview";
import { useBillSettingContext } from "../../contexts/BillSettingContext";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import { searchCustomer } from "../../redux/thunks/customer";
import LotPrnPrint from "../inventory/lot/lotPrnPrint";
import { useHotkeys } from 'react-hotkeys-hook';
import { createReportTemplate } from "../../redux/thunks/settings";
import StatusChangeModel from "../../components/modals/StatusChange";
import PrintSizeModal from "../../components/modals/PrintSizeModal";

export const Styles = styled.div`
  padding: 2vh 0.75vw;
  table {
    width: 100%;
    border-spacing: 0;
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
      margin: 0;
      padding: 0px 5px;
      border-bottom: 1px solid #e1e1e1;
      border-right: 0px solid black;
      // font-size: medium;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

const Listing = () => {
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pathName = location?.pathname;
  const [page, SetPage] = useState(1);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);
  const { searchCustomerList } = useSelector((state) => state.customerReducer);
  const {
    userInfo,
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const { billSettingType } = useBillSettingContext();
  const [filterEmployee, setFilterEmployee] = useState();
  const [selectedScheme, SetSelectedSchene] = useState("");
  const [selectedBranch, SetSelectedBranch] = useState([]);
  const [tagCode, setTagCode] = useState([]);
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());
  const [delId, SetDelId] = useState();
  const [deleteModal, SetDeleteModal] = useState(false);
  const [cancelModal, SetCancelModal] = useState(false);
  const [exportModal, SetExportModal] = useState(false);
  const [printModal, setPrintModal] = useState(false);
  const [selectedPrintSize, setSelectedPrintSize] = useState();
  const [modalActionName, SetModalActionName] = useState("");
  const [itemPerPage, SetItemPerPage] = useState(50);
  const [searchValue, setSearchValue] = useState(null);
  const [totalListingPages, setTotalListingPages] = useState();
  const [optionalId, SetOptionalId] = useState(1);



  const paginate = (pageNumber) => SetPage(pageNumber);
  const [modal, setModal] = useState(false);
  const toggle = () => SetDeleteModal(!deleteModal);
  const toggleExportModal = () => SetExportModal(!exportModal);
  const togglePrintModal = () => setPrintModal(!printModal);
  const useDynamicSelector = (sliceName, key) => {
    return useSelector((state) => state[sliceName][key]);
  };
  const [fromBranch, SetFromBranch] = useState();

  const [toBranch, SetToBranch] = useState();

  const [stockTransferType, SetStockTransferType] = useState();

  const [transferType, SetTransferType] = useState(1);

  const [filteredProducts, setFilteredProducts] = useState();

  const [filteredDesign, setFilteredDesign] = useState();
  const [filteredSubDesign, setFilteredSubDesign] = useState();
  const [filteredPurity, setFilteredPurity] = useState();
  const [filterLot, setFilterLot] = useState();
  const [filterMcType, setFilterMcType] = useState();
  const [filterMcValue, setFilterMcValue] = useState();
  const [filterVaPercent, setFilterVaPercent] = useState();
  const [filterVaFrom, setFilterVaFrom] = useState();
  const [filterVaTo, setFilterVaTo] = useState();
  const [filterGwtFrom, setFilterGwtFrom] = useState();
  const [filterGwtTo, setFilterGwtTo] = useState();
  const [filteredSupplier, setFilteredSupplier] = useState();
  const [filterVoucherIssueType, setFilterVoucherIssueType] = useState();
  const [counterId, setCounterId] = useState();
  const [lotType, setLotType] = useState();


  const [issueReciptType, setIssueReciptType] = useState(1);

  const [stockType, setStockType] = useState(3);

  const [processId, setProcessId] = useState(1);

  const [filterMetal, setFilteredMetal] = useState("");
  const [filterSection, setFilteredSection]=useState();

  const [customer, SetCustomer] = useState();
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [inputType, setInputType] = useState();
  const [isSearching, setIsSearching] = useState(false);


  const [otpFor, setOtpFor] = useState("4");

  const [reportType, setReportType] = useState(1);

  const [groupBy, setGroupBy] = useState(1);


  const [exportColumns, setExportColumns] = useState([]);

  const [savedColumns, setSavedColumns] = useState([]);


  const [exportSettings, setExportSettings] = useState([]);

  const [statusModal, setStatusModal] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const [statusActionName, setStatusActionName] = useState("");

  const toggleStatusModal = () => setStatusModal(!statusModal);


  const reportTypeOption = [{ value: 1, label: "Summary" }, { value: 2, label: "Detail" }];

  const stockTypeOption = [
    { value: 1, label: "Sales Return" },
    { value: 2, label: "Partly Sales" },
    { value: 3, label: "Old Metal" },
  ];
  const tableRef = useRef();

  useEffect(() => {
    if (exportSettings?.length > 0) {
      let col = exportSettings.filter(item => item.showCol === true)
      setExportColumns(listingData?.columns ? col : [])
    }

  }, [exportSettings]);

  const checkEditable = (list, row) => {
    if (listingData?.actions?.is_edit_req == true) {
      if (row && row.hasOwnProperty("is_editable")) {
        if (row.is_editable === 1) {
          // console.log(row);
          return true;
        } else {
          // console.log(row);
          return false;
        }
      } else {
        // console.log(row);
        return true;
      }
    }

    return false;
  };

  const reduxData = matcherData?.find((element) => element?.url === pathName);
  const listingData = useDynamicSelector(reduxData.sliceName, reduxData.dataKey);
  const loadingData = useDynamicSelector(reduxData.sliceName, reduxData.loaderKey);





  const [imageModal, SetImageModal] = useState(false);
  const [previewImages, SetPreviewImages] = useState([]);
  const imageModalClose = () => {
    SetImageModal(!imageModal);
    SetPreviewImages([]);
  };

  const [inputOTP, setInputOTP] = useState(["", "", "", "", "", ""]);
  const [otpModal, setOtpModal] = useState(false);

  const otpToggle = () => {
    setOtpModal(!otpModal);
  };

  const cancelToggle = () => SetCancelModal(!cancelModal);
  const [cancelReason, SetCancelReason] = useState("");
  const cancelReasonSet = (value) => {
    console.log(value);
    SetCancelReason(value);
  };

  useEffect(() => {
    setSearchValue(null);
    console.log(searchValue, listingData?.total_pages, "searchValueUpdated");

  }, [JSON.stringify(reduxData),itemPerPage]);
  useEffect(() => {
    if (searchValue === null) {
      setTotalListingPages(listingData?.total_pages);
    }
    console.log(searchValue, listingData?.total_pages, "searchValue");
  }, [listingData, searchValue]);

  useEffect(() => {
    getData();
    if (reduxData?.disablePagination === true && itemPerPage != 10000) {
       SetItemPerPage(10000);
       console.log("disablePagination is true, setting itemPerPage to 10000");
    }
  }, [reduxData, page, itemPerPage, billSettingType]);

  useEffect(() => {
    if (searchValue !== null && totalListingPages > 1) {
      getData(searchValue);
    }
    console.log(searchValue, totalListingPages, "searchValue");
  }, [searchValue]);

  const downloadQr = async (id , qrPrintType) => {
    try {
      let response = "";
      response = await dispatch(reduxData?.qrPrintAction({'id' : id , 'qrPrintType' : qrPrintType})).unwrap();
      LotPrnPrint(response);
      // console.log(response);
      //window.open(response?.pdf_url, "_blank");
    } catch (error) {
      console.error(error);
    }
  };

  const downloadPDF = async (id, printPageURL,print_type=1) => {
    if (printPageURL != undefined) {
      const data = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/${printPageURL}/${id}/?print_type=${print_type}`, {
        headers: {
          Authorization: `Token ${secureLocalStorage.getItem("pref")?.token}`,
        },
      });

      if (reduxData?.printType == "page") {
        console.log(data)
        let responseData = {
          settings: settings,
          itemDetails: data.data.response_data,
          userInfo: userInfo,
        };
        console.log(responseData, "responseData");
        secureLocalStorage.setItem("pageState", JSON.stringify(responseData));
        window.open(`${process.env.PUBLIC_URL}/${printPageURL}`, "_blank");
      } else {
        try {
          const response = await axios.get(data?.data?.pdf_url, {
            responseType: "blob",
          });

          const pdfBlob = new Blob([response.data], { type: "application/pdf" });

          const url = window.URL.createObjectURL(pdfBlob);

          const tempLink = document.createElement("a");
          tempLink.href = url;
          tempLink.target = "_blank";
          tempLink.setAttribute("print", `invoice.pdf`);

          document.body.appendChild(tempLink);
          tempLink.click();

          document.body.removeChild(tempLink);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error downloading PDF:", error);
        }
      }
    } else {
      //download qr pdf
      try {
        let response = "";
        response = await dispatch(reduxData?.printPdfAction(id)).unwrap();
        // console.log(response);
        window.open(response?.pdf_url, "_blank");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const modalClickAction = async () => {
    if (modalActionName == "delete") {
      await dispatch(reduxData?.deleteAction(delId));
      toggle();
      let passData = {
        page: page,
        branch: selectedBranch?.map((obj) => {
          const container = obj.value;
          return container;
        }),
        fromDate: moment(startDate).format("YYYY-MM-DD"),
        toDate: moment(endDate).format("YYYY-MM-DD"),
      };
      getData();
    } else if (modalActionName == "cancel") {
      if (cancelReason) {
        let postData = {
          pk_id: delId,
          cancel_reason: cancelReason,
          setOtpModal,
        };
        await dispatch(reduxData?.cancelAction(postData));
        cancelToggle();
        getData();
      } else {
        console.log(cancelReason);
        toastfunc("Enter Cancel Reason");
      }
    }
    else if (modalActionName == "revert") {
      await dispatch(reduxData?.revertAction({id:delId}));
      toggle();
      getData();
    }
  };

  const OTPVerify = async () => {
    let postData = {
      pk_id: delId,
      cancel_reason: cancelReason,
      bill_cancel_otp: inputOTP.join(""),
    };
    try {
      let response = "";
      response = await dispatch(userOTPVerify((postData))).unwrap();
      toastsuccess(response?.message)
      setOtpModal(false)
    } catch (error) {
      console.error(error);
    }

  };

  const getData = (search=null) => {
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
    console.log(branch);
    let passData = {
      path_name : pathName,
      search: search,
      page: page,
      records: reduxData?.disablePagination === true ? 10000 : itemPerPage,
      branch: branch,
      fromDate: moment(startDate).format("YYYY-MM-DD"),
      toDate: moment(endDate).format("YYYY-MM-DD"),
      transfer_from: fromBranch ? [fromBranch] : branch,
      transfer_to: toBranch,
      type: transferType,
      item_type: stockTransferType,
      product: filteredProducts,
      design: filteredDesign,
      subDesign: filteredSubDesign,
      purity: filteredPurity,
      supplier: filteredSupplier,
      id_metal: filterMetal,
      section: filterSection,
      process: processId,
      // type: issueReciptType,
      stock_type: stockType,
      report_type: reportType,
      id_scheme: selectedScheme,
      bill_setting_type: billSettingType,
      group_by: groupBy,
      customer: customer,
      optional_type:optionalId,
      id_counter: counterId,
      filterEmployee : filterEmployee,
      lotType : lotType,
      // report_type : filterVoucherIssueType
    };
    reduxData && dispatch(reduxData?.action(passData));
  };

  const handleStatusChange = () => {
    if (selectedStatusId) {
      changeStatus(selectedStatusId);
      toggleStatusModal();
    }
  };

  const changeStatus = async (id, status) => {

    try {
      const putData = {
        id: id,
      };
      let branch = null
      if (selectedBranch.length) {
        branch = selectedBranch?.map((obj) => {
          const container = obj.value;
          return container;
        });
      } else {
        const loginpref = secureLocalStorage.getItem("pref")?.pref;
        branch = loginpref.login_branches;
      }
      await dispatch(reduxData?.updateStatusAction(putData));
      getData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleImagePreview = (data) => {
    if (data?.length > 0) {
      SetPreviewImages(data);
      SetImageModal(true);
    }
  };

  const [filterModal, SetFilterModal] = useState(false);
  const toggleFilterModal = () => SetFilterModal(!filterModal);


  useHotkeys('f1', (event) => {
    event.preventDefault();
    toggleFilterModal();
  });


  // const FilterComponent = (
  //   <ReportFilterComponent
  //     children={{
  //       register,
  //       schemes,
  //       selectedScheme,
  //       SetSelectedSchene,
  //       clearErrors,
  //       setValue,
  //       errors,
  //       selectedBranch,
  //       SetSelectedBranch,
  //       startDate,
  //       SetStartDate,
  //       endDate,
  //       SetEndDate,
  //       getData,
  //       is_group_by_req: false,
  //       is_multi_branch_filter_req: listingData?.filters?.isBranchFilterReq,
  //       is_scheme_filter_req: listingData?.filters?.isSchemeFilterReq,
  //       is_date_filter_req: true,
  //       isBranchFromToFilterReq: listingData?.filters?.isBranchFromToFilterReq,
  //       StockTransferFilterReq: listingData?.filters?.StockTransferFilterReq,
  //       fromBranch,
  //       SetFromBranch,
  //       toBranch,
  //       SetToBranch,
  //       stockTransferType,
  //       SetStockTransferType,
  //       transferType,
  //       SetTransferType,
  //       filteredProducts,
  //       setFilteredProducts,
  //       products,
  //     }}
  //   />
  // );
  const saveColumn = async() =>{
    let data = exportSettings.map((item)=>{
      return {
        "accessor": item.accessor,
        "showCol":item?.showCol != undefined? item.showCol : true
      }
    })
    let colData = JSON.stringify(data);
    let postData = {
      "path":pathName,
      "path_name":pathName,
      "columns":colData
    }
    await dispatch(createReportTemplate(postData));
  }
  const exportToPrint = () => {
    const titleContent = pagePermission?.title || reduxData?.title || "Default Title";
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

    let filterRow = `<tr><td style="text-align:center;border: none;font-size:10px;text-transform: uppercase;font-weight:bold" colspan="${listingData?.columns.length}">GST IN ${userInfo?.user?.company_gst}`

    // Combine title and table content into a single div
    const combinedHTML = `<div id="tablecontainer">
        <table><tr><td style="text-align:center;border: none;font-size:12px;text-transform: uppercase;font-weight:bold;" colspan="${listingData?.columns.length}">
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
                          size: ${selectedPrintSize}; 
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

   const printModalAction = () => {
    if (
      selectedPrintSize === undefined ||
      selectedPrintSize === null ||
      selectedPrintSize === "" 
    ) {
      toastfunc("Please select page size");
    }
    else {
      exportToPrint();
      setSelectedPrintSize(null)
    }
  };

  const exportToExcel = () => {
    const titleContent = pagePermission?.title || reduxData?.title || "Default Title";

    // Get the HTML table content
    const tableHTML = tableRef?.current?.innerHTML || "";

    // Combine title and table content into a single div
    const combinedHTML = `<div id="tablecontainer" >
        <table><tr><td style="text-align:center;"colspan= "${listingData?.columns.length}" >${titleContent}</td></tr></table>
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
  const buildQueryString = (params) => {
    return queryString.stringify(params);
  };

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
      if (
        isSearching &&
        customerSearch?.length > 0 &&
        inputType === "text" &&
        customerSearch[0]?.label?.length > 0 &&
        customer == null
      ) {
        const searchKey = inputType === "number" ? "mob_num" : "name";
        dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
      }
      if (
        isSearching &&
        customerSearch?.length > 0 &&
        inputType === "number" &&
        customerSearch[0]?.label?.length >= 5 &&
        customer == null
      ) {
        const searchKey = inputType === "number" ? "mob_num" : "name";
        dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
      }
    }, [isSearching, customerSearch, customer, dispatch, inputType]);

  const columns = listingData?.columns?.map((col) => {
    let showCol = col?.showCol != undefined ? col?.showCol : true;
    col = { ...col, "showCol": showCol };
    if (col.accessor === "sno") {
      return {
        ...col,
        Cell: ({ cell }) => cell.row.index + 1,
      };
    }
    if (col.accessor === "image") {
      return {
        ...col,
        Cell: (cell) => (
          <>
            {cell.row.original.image != null ? (
              <img
                onClick={() => handleImagePreview(cell.row.original?.preview_images)}
                style={{
                  height: "44px",
                  width: "44px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                src={cell.row.original.image}
                alt="preview"
              />
            ) : (
              <UserAvatar text={cell.row.original.image_text} />
            )}
          </>
        ),
      };
    }
    if (col.accessor === "is_active") {
      return {
        ...col,
        Cell: (cell) => {
          const canChange = userInfo?.user?.allow_status_update === true;

          return (
            <Badge
              style={{
                cursor: canChange ? "pointer" : "not-allowed",
                opacity: canChange ? 1 : 0.5,
              }}
              className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
              color={cell.row.original.is_active ? "success" : "warning"}
              onClick={() => {
                if (!canChange) return;
                setSelectedStatusId(cell.row.original.pk_id);
                setStatusActionName(cell.row.original.is_active ? "Deactivate" : "Activate");
                toggleStatusModal();
              }}
            >
              {cell.row.original?.status_name ||
                (cell.row.original.is_active ? "Active" : "Inactive")}
            </Badge>
          );
        },
      };
    }    
    
    if (col.accessor === "invoice_no") {
      return {
        ...col,
        Cell: (cell) => (
          <button
            onClick={() => {
              const invoiceId = cell.row.original.erp_invoice_id;
              secureLocalStorage.setItem('invoiceId', invoiceId);
              secureLocalStorage.setItem('invoiceEdit', settings?.purchase_edit_billing);
              window.open(`${process.env.PUBLIC_URL}/billing/invoice_preview`, '_blank');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            {cell.row.original.invoice_no}
          </button>

        ),
      };
    }
    if (col.accessor === "supplier_name" && col?.hasLink === true) {
      return {
        ...col,
        Cell: (cell) => (
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => {
              navigate(
                {
                  pathname: `${process.env?.PUBLIC_URL}/reports/supplier_ledger/list`,
                },
                {
                  state: {
                    id_supplier: cell.row.original.id_supplier,
                    id_metal: filterMetal
                  },
                }
              );
            }}
          >
            {cell.row.original.supplier_name}
          </button>

        ),
      };
    }
    if (col.accessor === "account_no" && col?.hasLink === true) {
      return {
        ...col,
        Cell: (cell) => (
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => {
              navigate(
                {
                  pathname: `${process.env.PUBLIC_URL}/schememaster/schemeaccount/history`,
                },
                {
                  state: {
                    id: cell.row.original.sch_pk_id,
                    historyEditable: reduxData?.is_history_editable,
                  },
                }
              );
            }}
          >
            {cell.row.original.account_no}
          </button>

        ),
      };
    }
    if (col.accessor === "supplier_balance_weight") {
      return {
        ...col,
        Cell: ({ cell }) => (<span style={{ color: parseFloat(cell.row.original.supplier_balance_weight) > 0 ? "RED" : "BLUE" }}>{parseFloat(cell.row.original.supplier_balance_weight).toFixed(3)} {parseFloat(cell.row.original.supplier_balance_weight) > 0 ? "CR" : "DR"}</span>),
      };
    }
    if (col.accessor === "supplier_balance_amount") {
      return {
        ...col,
        Cell: ({ cell }) => (<span style={{ color: parseFloat(cell.row.original.supplier_balance_amount) > 0 ? "RED" : "BLUE" }}> <CurrencyDisplay value={parseFloat(cell.row.original.supplier_balance_amount).toFixed(3)} /> {parseFloat(cell.row.original.supplier_balance_amount) > 0 ? "CR" : "DR"}</span>),
      };
    }

    if (col.accessor === "payment_status") {
      return {
        ...col,
        Cell: (cell) => (
          <Badge className="badge-sm badge-dot has-bg d-none d-sm-inline-flex" color={cell.row.original.status_color}>
            {cell.row.original.payment_status}
          </Badge>
        ),
      };
    }

    if (col.accessor === "status") {
      return {
        ...col,
        Cell: (cell) => (
          <Badge className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
            style={{ cursor: reduxData?.updateStatusAction && "pointer" }}
            color={cell.row.original.status_color}
            onClick={() => {
              if (reduxData?.updateStatusAction) {
                changeStatus(cell.row.original.pk_id)
              }
              else {
                console.log("Invalid");

              }
            }}>
            {cell.row.original.status}
          </Badge>
        ),
      };
    }
    if (col?.accessor === "actions") {
      return {
        ...col,
        disableSortBy: true,
        Cell: ({ cell }) => (
          <div className="tb-odr-btns d-none d-sm-inline">
            {reduxData?.is_print_req && (
              <Button
                hidden={!pagePermission?.print}
                color="primary"
                size="sm"
                className="btn-icon btn-white btn-dim"
                onClick={() => {
                  downloadPDF(cell.row.original.pk_id, reduxData?.printPageURL,1);
                }}
              >
                <TooltipComponent
                  containerClassName="btn btn-sm btn-icon btn-trigger"
                  icon="printer-fill"
                  direction="top"
                  id={`print_tooltip${cell.row.original.pk_id}`}
                  text={"Print"}
                />
                {/* <Icon name="printer-fill"></Icon> */}
              </Button>
            )}
            {reduxData?.is_detail_print_req && (
              <Button
                hidden={!pagePermission?.print}
                color="primary"
                size="sm"
                className="btn-icon btn-white btn-dim"
                onClick={() => {
                  let printPageURL = reduxData?.detailPrintPageURL;

                  downloadPDF(cell.row.original.pk_id,printPageURL,2);
                }}
              >
                <TooltipComponent
                  containerClassName="btn btn-sm btn-icon btn-trigger"
                  icon="printer"
                  direction="top"
                  id={`detailed_print_tooltip${cell.row.original.pk_id}`}
                  text={"Detail Print"}
                />
                {/* <Icon name="printer-fill"></Icon> */}
              </Button>
            )}

            {reduxData?.is_qrprint_req && (
              <Button
                hidden={!pagePermission?.print}
                color="primary"
                size="sm"
                className="btn-icon btn-white btn-dim"
                onClick={() => {
                  downloadQr(cell.row.original.pk_id,reduxData?.qrPrintType);
                }}
              >
                <TooltipComponent
                  containerClassName="btn btn-sm btn-icon btn-trigger"
                  icon="qr"
                  direction="top"
                  id={`qr_tooltip${cell.row.original.pk_id}`}
                  text={"QR"}
                />
                {/* <Icon name="printer-fill"></Icon> */}
              </Button>
            )}

            {checkEditable(listingData, cell.row.original) && (
              <Button
                hidden={!pagePermission?.edit}
                color="primary"
                size="sm"
                className="btn-icon btn-white btn-dim"
                onClick={() => {
                  navigate(
                    {
                      pathname: `${process.env?.PUBLIC_URL}${reduxData?.editPageURL}`,
                    },
                    {
                      state: {
                        id: cell.row.original.pk_id,
                      },
                    }
                  );
                }}
              >
                <TooltipComponent
                  containerClassName="btn btn-sm btn-icon btn-trigger"
                  icon="edit"
                  direction="top"
                  id={`edit_tooltip${cell.row.original.pk_id}`}
                  text={"Edit"}
                />
              </Button>
            )}
            {cell.row.original?.paid_installments > 0 && (
              <Button
                hidden={!pagePermission?.edit}
                color="primary"
                size="sm"
                className="btn-icon btn-white btn-dim"
                onClick={() => {
                  navigate(
                    {
                      pathname: `${process.env.PUBLIC_URL}${reduxData?.closePageURL}`,
                    },
                    {
                      state: {
                        id: cell.row.original.pk_id,
                      },
                    }
                  );
                }}
              >
                <TooltipComponent
                  containerClassName="btn btn-sm btn-icon btn-trigger"
                  icon="ripple"
                  direction="top"
                  id={`close_tooltip${cell.row.original.pk_id}`}
                  text={"Close"}
                />
              </Button>
            )}
            {listingData?.actions?.is_delete_req && (
              <Button
                hidden={!pagePermission?.delete}
                color="primary"
                size="sm"
                className="btn-icon btn-white btn-dim"
                onClick={() => {
                  SetModalActionName("delete");
                  SetDeleteModal(true);
                  SetDelId(cell.row.original.pk_id);
                }}
              >
                <TooltipComponent
                  containerClassName="btn btn-sm btn-icon btn-trigger"
                  icon="trash-fill"
                  direction="top"
                  id={`delete_tooltip${cell.row.original.pk_id}`}
                  text={"Delete"}
                />
              </Button>
            )}
            {listingData?.actions?.is_revert_req && (
              <Button
                hidden={!pagePermission?.edit}
                color="primary"
                size="sm"
                className="btn-icon btn-white btn-dim"
                onClick={() => {
                  SetModalActionName("revert");
                  SetDeleteModal(true);
                  SetDelId(cell.row.original.pk_id);
                }}
              >
                <TooltipComponent
                  containerClassName="btn btn-sm btn-icon btn-trigger"
                  icon="undo"
                  direction="top"
                  id={`undo_tooltip${cell.row.original.pk_id}`}
                  text={"Revert"}
                />
              </Button>
            )}
            {listingData?.actions?.is_revert_close_req && cell.row.original?.is_revertable && (
              <Button
                hidden={!pagePermission?.edit}
                color="primary"
                size="sm"
                className="btn-icon btn-white btn-dim"
                onClick={() => {
                  SetModalActionName("revert");
                  SetDeleteModal(true);
                  SetDelId(cell.row.original.pk_id);
                }}
              >
                <TooltipComponent
                  containerClassName="btn btn-sm btn-icon btn-trigger"
                  icon="undo"
                  direction="top"
                  id={`undo_tooltip${cell.row.original.pk_id}`}
                  text={"Revert"}
                />
              </Button>
            )}

            {listingData?.actions?.is_cancel_req && cell.row.original?.is_cancelable && (
              <Button
                hidden={!pagePermission?.delete}
                color="primary"
                size="sm"
                className="btn-icon btn-white btn-dim"
                onClick={() => {
                  SetModalActionName("cancel");
                  SetCancelModal(true);
                  SetDelId(cell.row.original.pk_id);
                }}
              >
                <TooltipComponent
                  containerClassName="btn btn-sm btn-icon btn-trigger"
                  icon="icon ni ni-cross"
                  direction="top"
                  id={`undo_tooltip${cell.row.original.pk_id}`}
                  text={"Cancel"}
                />
              </Button>
            )}

            {reduxData?.is_history_req && (
              <Button
                hidden={!pagePermission?.edit}
                color="primary"
                size="sm"
                className="btn-icon btn-white btn-dim"
                onClick={() => {
                  navigate(
                    {
                      pathname: `${process.env.PUBLIC_URL}/schememaster/schemeaccount/history`,
                    },
                    {
                      state: {
                        id: cell.row.original.pk_id,
                        historyEditable: reduxData?.is_history_editable,
                      },
                    }
                  );
                }}
              >
                <TooltipComponent
                  containerClassName="btn btn-sm btn-icon btn-trigger"
                  icon="history"
                  direction="top"
                  id={`history_tooltip${cell.row.original.pk_id}`}
                  text={"History"}
                />
              </Button>
            )}
          </div>
        ),
      };
    }
    return col;
  });

  useEffect(() => {
    if (columns?.length > 0) {
      setExportSettings(listingData?.columns ? columns : [])
    }

  }, [listingData]);

  const printPageSizes = [
    { value: 1, label: "A4", size: "210mm x 297mm" },
    { value: 2, label: "A6", size: "101.6mm 297mm" },
    // { value: 2, label: "A6", size: "101.6mm 297mm" },
  ];

  return (
    <React.Fragment>
      <Head title={pagePermission?.title ? pagePermission?.title : reduxData?.title}></Head>
      {pagePermission?.view && (
        <Content>
          <OTPModal modal={otpModal} toggle={otpToggle} clickAction={OTPVerify} otp={inputOTP} setOtp={setInputOTP} otpFor={otpFor} />
          <PreviewImagesModal modal={imageModal} toggle={imageModalClose} files={previewImages} />
          <Block>
            <Card className="card-bordered card-preview">
              <Styles>
                <Table
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  itemPerPage={itemPerPage}
                  SetItemPerPage={SetItemPerPage}
                  modal={modal}
                  setModal={setModal}
                  loading={loadingData}
                  totalPages={listingData?.total_pages}
                  currentPage={page}
                  paginate={paginate}
                  showPagination={true}
                  toggleFilterModal={toggleFilterModal}
                  // FilterComponent={listingData?.is_filter_req == true ? FilterComponent : ""}
                  columns={listingData?.columns ? exportColumns : []}
                  data={listingData?.rows ? listingData?.rows : []}
                  pageTitle={pagePermission?.title ? pagePermission?.title : reduxData?.title}
                  is_filter_req={listingData?.is_filter_req}
                  isTotalReq={listingData?.actions?.is_total_req}
                  allowAdd={pagePermission?.add}
                  allowPrint={pagePermission?.print}
                  allowExport={pagePermission?.export}
                  addButtonDisable={listingData?.actions?.is_add_req}
                  isAddReq={listingData?.actions?.is_add_req}
                  addPageURL={reduxData?.addPageURL}
                  isGrouping={listingData?.groupingColumns?.length > 0 ? true : false}
                  groupingColumns={listingData?.groupingColumns?.length > 0 ? listingData.groupingColumns : []}
                  exportExcel={exportToExcel}
                  // exportToPrint={exportToPrint}
                  toggleExportModal={toggleExportModal}
                  togglePrintModal={togglePrintModal}
                  tableRef={tableRef}
                  disablePagination={reduxData?.disablePagination}
                />
              </Styles>
            </Card>
          </Block>
          <FilterSidebar
            sideBar={filterModal}
            toggle={toggleFilterModal}
            children={{
              isFilterWithTabs: false,
              register,
              selectedScheme,
              SetSelectedSchene,
              clearErrors,
              setValue,
              errors,
              selectedBranch,
              SetSelectedBranch,
              tagCode,
              setTagCode,
              startDate,
              SetStartDate,
              endDate,
              SetEndDate,
              getData,
              filterEmployee, 
              setFilterEmployee,
              is_group_by_req: false,
              is_multi_branch_filter_req: listingData?.filters?.isBranchFilterReq,
              is_scheme_filter_req: listingData?.filters?.isSchemeFilterReq,
              is_date_filter_req: true,
              isBranchFromToFilterReq: listingData?.filters?.isBranchFromToFilterReq,
              StockTransferFilterReq: listingData?.filters?.StockTransferFilterReq,
              is_finyear_filter_req: listingData?.filters?.is_finyear_filter_req,
              isProcessFilterReq: listingData?.filters?.isProcessFilterReq,
              isIssueReciptFilterReq: listingData?.filters?.isIssueReciptFilterReq,
              isProductFilterReq: listingData?.filters?.isProductFilterReq,
              isMetalFilterReq: listingData?.filters?.isMetalFilterReq,
              isEmployeeFilterReq: listingData?.filters?.isEmployeeFilterReq,
              isSectionFilterReq: listingData?.filters?.isSectionFilterReq,
              isTagCodeFilterReq: listingData?.filters?.isTagCodeFilterReq,
              isDeignFilterReq: listingData?.filters?.isDeignFilterReq,
              isSubDeignFilterReq: listingData?.filters?.isSubDeignFilterReq,
              isPurityFilterReq: listingData?.filters?.isPurityFilterReq,
              isSupplierFilterReq: listingData?.filters?.isSupplierFilterReq,
              isLotFilterReq: listingData?.filters?.isLotFilterReq,
              isMcTypeFilterReq: listingData?.filters?.isMcTypeFilterReq,
              isMcValueFilterReq: listingData?.filters?.isMcValueFilterReq,
              isVaPercentFilterReq: listingData?.filters?.isVaPercentFilterReq,
              isVaFromToFilterReq: listingData?.filters?.isVaFromToFilterReq,
              isGwtFromToFilterReq: listingData?.filters?.isGwtFromToFilterReq,
              isCustomerFilterReq: listingData?.filters?.isCustomerFilterReq,
              isVoucherIssueStatusFilter: listingData?.filters?.isVoucherIssueStatusFilter,
              isOpionalFilterReq: listingData?.filters?.isOpionalFilterReq,
              isCounterFilterReq: listingData?.filters?.isCounterFilterReq,
              SetOptionalId,
              optionalId,
              optionalType : listingData?.optionalType != undefined ? listingData?.optionalType : [],
              fromBranch,
              SetFromBranch,
              toBranch,
              SetToBranch,
              stockTransferType,
              SetStockTransferType,
              transferType,
              SetTransferType,
              filterVoucherIssueType,
              setFilterVoucherIssueType,
              filteredProducts,
              setFilteredProducts,
              filteredDesign,
              setFilteredDesign,
              filteredSubDesign,
              setFilteredSubDesign,
              filteredPurity,
              setFilteredPurity,
              filteredSupplier,
              setFilteredSupplier,
              filterLot,
              setFilterLot,
              filterMcType,
              setFilterMcType,
              filterMcValue,
              setFilterMcValue,
              filterVaPercent,
              setFilterVaPercent,
              filterVaFrom,
              setFilterVaFrom,
              filterVaTo,
              setFilterVaTo,
              filterGwtFrom,
              setFilterGwtFrom,
              filterGwtTo,
              setFilterGwtTo,
              setProcessId,
              processId,
              setIssueReciptType,
              issueReciptType,
              stockType,
              setStockType,
              stockTypeOption,
              setFilteredMetal,
              setFilteredSection,
              filterMetal,
              filterSection,
              customer,
              SetCustomer,
              customerSearch,
              SetCustomerSearch,
              inputType,
              setInputType,
              isSearching,
              setIsSearching,
              searchCustomerList,
              counterId,
              setCounterId,
              isStockTypeFilterReq: listingData?.filters?.isStockTypeFilterReq,
              setReportType,
              reportType,
              reportTypeOption,
              isReportTypeReq: listingData?.filters?.isReportTypeReq,
              isReportGroupByReq: listingData?.filters?.isReportGroupByReq,
              isLotTypeFilterReq: listingData?.filters?.isLotTypeFilterReq,
              setGroupBy,
              groupBy,
              lotType,
              setLotType,
              groupByOption: (listingData?.groupByOption != undefined ? listingData?.groupByOption : []),

            }}
          />
        </Content>
      )}
      <ExportPreviewModal
        modal={exportModal}
        toggle={toggleExportModal}
        columns={listingData?.columns ? exportSettings : []}
        reportColumns={listingData?.columns ? exportColumns : []}
        setColumns={setExportSettings}
        data={listingData?.rows}
        groupingColumns={listingData?.groupingColumns?.length > 0 ? listingData.groupingColumns : []}
        title={"TItle"}
        setTitle={() => { }}
        saveColumn={saveColumn}
        exportToPrint={exportToPrint}
        isGrouping={listingData?.groupingColumns?.length > 0 ? true : false}
      />
      <PrintSizeModal
        modal={printModal}
        toggle={togglePrintModal}
        printAction={printModalAction}
        sizes={printPageSizes}
        selectedPrintSize={selectedPrintSize}
        setSelectedPrintSize={setSelectedPrintSize}
      />
      <DeleteModal
        actionName={modalActionName}
        modal={deleteModal}
        toggle={toggle}
        name={pagePermission?.title ? pagePermission?.title : reduxData?.title}
        title={pagePermission?.title ? pagePermission?.title : reduxData?.title}
        clickAction={modalClickAction}
      />
      <CancelModel
        actionName={modalActionName}
        modal={cancelModal}
        toggle={cancelToggle}
        textValue={cancelReason}
        SetTextValue={cancelReasonSet}
        name={pagePermission?.title ? pagePermission?.title : reduxData?.title}
        title={pagePermission?.title ? pagePermission?.title : reduxData?.title}
        clickAction={modalClickAction}
      />
      <StatusChangeModel
        modal={statusModal}
        toggle={toggleStatusModal}
        title="Change Status"
        name={reduxData?.title}
        textValue={""}
        SetTextValue={() => { }}
        clickAction={handleStatusChange}
        actionName={statusActionName}
      />
    </React.Fragment>
  );
};

export default Listing;
