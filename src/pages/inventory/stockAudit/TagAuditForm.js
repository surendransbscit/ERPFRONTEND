import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Col,
  Row,
  PreviewCard,
  SaveButton,
  Icon,
} from "../../../components/Component";
import {
  NumberInputField,
  TextInputField,
} from "../../../components/form-control/InputGroup";
import Content from "../../../layout/content/Content";
import "../../../assets/css/sales_form.css";
import {
  BranchDropdown,
  SectionDropdown,
} from "../../../components/filters/retailFilters";
import {
  useSections,
  useBranches,
} from "../../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useDispatch } from "react-redux";
import {
  createTagScanAudit,
  closeTagScanAudit,
  createContainerScanAudit,
  closeContainerScanAudit,
} from "../../../redux/thunks/inventory";
import {
  getStockAuditDetailReport,
  getStockAuditDetailReportPrint,
} from "../../../redux/thunks/reports";
import IsRequired from "../../../components/erp-required/erp-required";
import styled from "styled-components";
import classnames from "classnames";
import moment from "moment";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Label,
} from "reactstrap";
import io from "socket.io-client";
import { isUndefined } from "../../../components/common/calculations/ErpCalculations";
import ReactDOMServer from "react-dom/server";
import TagAuditPrintTable from "../../../components/reports-print/TagAuditPrint";
import { getPagePermission } from "../../../redux/thunks/coreComponent";

const ScannedRow = styled.tr`
  && {
    background-color: ${(props) =>
      props.isScanned ? "green !important" : "transparent"};
  }
`;

const TagAuditForm = () => {
  const location = useLocation();
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
    reset,
  } = useForm();
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const navigate = useNavigate();
  const {
    isLoading: issubmitting,
    tagList,
    containerTagDetails,
  } = useSelector((state) => state.tagAuditReducer);
  const { StockAuditDetailsReportList } = useSelector(
    (state) => state.reportReducer
  );
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());
  const methods = useForm();
  const { sections } = useSections();
  const { branches } = useBranches();
  const dispatch = useDispatch();
  const filterValuesDefalut = {
    selectedBranch: 1,
    tagCode: "",

    selectedSection: "",
    containerCode: "",
    id_container: "",
    oldTagCode: "",
  };
  const [filterValues, setFilterValues] = useState(filterValuesDefalut);
  const [filterTagList, setFilterTagList] = useState([]);
  const [filterContainerList, setFilterContainerList] = useState([]);
  const [unScannedList, setUnScannedList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [with_height, setWith_height] = useState();
  const [scaleWeight, setScaleWeight] = useState("");

  const [activeTab, setActiveTab] = useState("tagScan");

  const onClickSave = () => {
    console.log(filterValues);
    if (
      filterValues?.selectedBranch === "" ||
      filterValues?.selectedBranch === null
    ) {
      toastfunc("Please Select From Branch");
    } else if (
      filterValues.selectedSection === "" ||
      filterValues.selectedSection === null
    ) {
      toastfunc("Please Select Section");
    } else {
      dispatch(
        closeTagScanAudit({
          id_branch: filterValues.selectedBranch,
          id_section: filterValues.selectedSection,
        })
      );
      reset_form();
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:7000", {
      transports: ["websocket"],
      secure: true,
      reconnectionAttempts: 5,
      timeout: 5000,
      // path: "/",
    }); // Connect to Flask WebSocket

    // Listen for weight updates
    socket.on("weight-update", (data) => {
      // console.log("Received Weight:", data.weight);
      // setWeight(data.weight);
      let weight = data.weight;
      let [numericValue, unit] = weight.replace("ST,", "").split(",");
      numericValue = parseFloat(numericValue);
      if (
        parseFloat(numericValue) > 0 &&
        parseFloat(numericValue) != parseFloat(scaleWeight)
      ) {
        setScaleWeight(numericValue);
        setValue("scaleWeight", numericValue);
        clearErrors("scaleWeight");
      }
      console.log("SOcket Data:", data);
    });

    return () => socket.disconnect(); // Cleanup on unmount
  }, []);

  const closeScan = (tagDetails = []) => {
    // console.log(filterValues);
    // if (filterValues?.tagCode === "" || filterValues?.tagCode === null) {
    //     toastfunc("Please Select Tag code");
    // }
    // else if (filterValues?.selectedSection === "" || filterValues?.selectedSection === null) {
    //     toastfunc("Please Select Section");
    // }
    // else {
    dispatch(
      closeTagScanAudit({
        id_section: filterValues.selectedSection,
        id_branch: filterValues.selectedBranch,
        tag_details: tagDetails,
      })
    );
    reset_form();
    // }
  };

  const handleFilterChange = (field, value) => {
    setFilterValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  // useEffect(() => {
  //     if (Object.keys(tagList).length > 0) {
  //         let data = [...filterTagList, tagList];
  //         setFilterTagList(data);
  //         updateStatus(tagList);
  //         console.log(filterTagList)
  //         handleFilterChange('tagCode', '');
  //     }

  // }, [tagList]);

  const pathName = location?.pathname;
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    if (
      pagePermission?.view === false ||
      pagePermission === undefined ||
      pagePermission === null
    ) {
      navigate(`${process.env.PUBLIC_URL}/`);
    }
  }, [pagePermission, navigate]);

  useEffect(() => {
    if (Object.keys(tagList).length > 0) {
      let newFilterTagList = [
        ...filterTagList,
        { ...tagList, scaleWeight: isUndefined(scaleWeight) },
      ];

      let updatedSearchList = searchList.filter(
        (item) =>
          !newFilterTagList.some(
            (filterItem) => filterItem.tag_code === item.tag_code
          )
      );

      setFilterTagList(newFilterTagList);
      setSearchList(updatedSearchList);
      updateStatus(tagList);
      console.log(newFilterTagList);
      handleFilterChange("tagCode", "");
      handleFilterChange("oldTagCode", "");
      setScaleWeight("");
    }
  }, [tagList]);

  // useEffect(() => {
  //     if (with_height && scaleWeight && filterTagList.length > 0) {
  //         setFilterTagList((prevList) => {
  //             return prevList.map((item, index) => {
  //                 if (index === prevList.length - 1) {
  //                     return { ...item, scaleWeight }; // Create a new object with scaleWeight
  //                 }
  //                 return item;
  //             });
  //         });
  //     }
  // }, [scaleWeight]);

  useEffect(() => {
    console.log(StockAuditDetailsReportList, "StockAuditDetailsReportList");
    if (StockAuditDetailsReportList?.rows) {
      setUnScannedList(StockAuditDetailsReportList.rows);
    }
  }, [StockAuditDetailsReportList]);

  useEffect(() => {
    if (StockAuditDetailsReportList?.rows) {
      setSearchList(StockAuditDetailsReportList.rows);
    }
  }, [StockAuditDetailsReportList]);

  const handleDeleteTag = (index) => {
    const updatedFormData = [...filterTagList];
    updatedFormData.splice(index, 1);
    setFilterTagList(updatedFormData);
  };

  const reset_form = async () => {
    reset("");
    setFilterTagList([]);
    setFilterValues(filterValuesDefalut);
    //  setContainerWt(0);
    setFilterContainerList([]);
    setUnScannedList([]);
    setSearchList([]);
  };

  useEffect(() => {
    if (
      filterValues.tagCode.length > 5 &&
      filterValues.tagCode !== "" &&
      !with_height
    ) {
      handleAddPreview();
    }
  }, [filterValues.tagCode]);

  useEffect(() => {
    if (
      filterValues.oldTagCode.length > 5 &&
      filterValues.oldTagCode !== "" &&
      !with_height
    ) {
      handleAddPreview();
    }
  }, [filterValues.oldTagCode]);

  useEffect(() => {
    if (
      filterValues.containerCode.length > 2 &&
      filterValues.containerCode !== ""
    ) {
      handleAddPreviewContainer();
    }
  }, [filterValues.containerCode]);
  const searchContainer = () => {
    dispatch(
      createContainerScanAudit({
        container_code: filterValues.containerCode,
        id_branch: filterValues.selectedBranch,
      })
    );
  };

  const searchTag = () => {
    dispatch(
      createTagScanAudit({
        tag_code: filterValues.tagCode,
        old_tag_code: filterValues.oldTagCode,
        is_wt_scanned: with_height ? true : false,
        scale_weight: isUndefined(scaleWeight),
        id_section: filterValues.selectedSection,
        id_branch: filterValues.selectedBranch,
      })
    );
  };
  const UnScanTag = () => {
    dispatch(
      getStockAuditDetailReport({
        id_section: filterValues.selectedSection,
        branch: [filterValues.selectedBranch],
        fromDate: moment(startDate).format("YYYY-MM-DD"),
        toDate: moment(endDate).format("YYYY-MM-DD"),
      })
    );
  };

  const handleAddPreview = () => {
    if (
      filterValues?.selectedBranch === "" ||
      filterValues?.selectedBranch === null
    ) {
      toastfunc("Please Select Branch");
    } else if (
      filterValues?.selectedSection === "" ||
      filterValues?.selectedSection === null
    ) {
      toastfunc("Please Select Section");
    } else if (
      (filterValues.tagCode === "" || filterValues.tagCode === null) &&
      (filterValues.oldTagCode === "" || filterValues.oldTagCode === null)
    ) {
      toastfunc("Please Enter Tag Code" + filterValues.tagCode);
    } else {
      searchTag();
    }
  };
  const exportToPrint = async (data, column, calculateTotal) => {
    console.log(data, column, calculateTotal, "data,column,calculateTotal");
    const titleContent = "Tag Audit Report";
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
    const tableHTML = ReactDOMServer.renderToStaticMarkup(
      <TagAuditPrintTable
        tagAuditReportList={data}
        columns={column}
        calculateTotal={calculateTotal}
      />
    );

    let filterRow = `<tr><td style="text-align:center;border: none;font-size:10px;text-transform: uppercase;font-weight:bold" colspan="${column.length}">GST IN ${userInfo?.user?.company_gst}`;

    // Combine title and table content into a single div
    const combinedHTML = `<div id="tablecontainer">
            <table><tr><td style="text-align:center;border: none;font-size:12px;text-transform: uppercase;font-weight:bold;" colspan="${
              column.length
            }">
            ${userInfo?.user?.company_fullname}<br/>
            <span style="font-size:10px;font-weight:normal;">${
              userInfo?.user?.company_address
            }</span><br/>
            ${
              userInfo?.user?.company_city
                ? `<span style="font-size:10px;font-weight:normal;">${userInfo?.user?.company_city}</span><br/>`
                : ""
            }
            ${
              userInfo?.user?.company_gst
                ? `<span style="font-size:10px;font-weight:normal;">GST IN : ${userInfo?.user?.company_gst}</span><br/>`
                : ""
            }
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
  };
  const handlePrint = async () => {
    try {
      let response = await dispatch(
        getStockAuditDetailReportPrint({
          id_section: filterValues.selectedSection,
          branch: [filterValues.selectedBranch],
          fromDate: moment(startDate).format("YYYY-MM-DD"),
          toDate: moment(endDate).format("YYYY-MM-DD"),
        })
      ).unwrap();
      // console.log(response, "response");
      // console.log(StockAuditDetailsReportList, "StockAuditDetailsReportList");
      exportToPrint(response, response?.columns, calculateTotal);
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  const getUnscannedDetails = () => {
    if (
      filterValues?.selectedBranch === "" ||
      filterValues?.selectedBranch === null
    ) {
      toastfunc("Please Select Branch");
    } else if (
      filterValues?.selectedSection === "" ||
      filterValues?.selectedSection === null
    ) {
      toastfunc("Please Select Section");
    } else {
      setUnScannedList([]);
      UnScanTag();
    }
  };

  const getSearchListDetails = () => {
    if (
      filterValues?.selectedBranch === "" ||
      filterValues?.selectedBranch === null
    ) {
      toastfunc("Please Select Branch");
    } else if (
      filterValues?.selectedSection === "" ||
      filterValues?.selectedSection === null
    ) {
      toastfunc("Please Select Section");
    } else {
      setSearchList([]);
      UnScanTag();
    }
  };

  const handleAddPreviewContainer = () => {
    if (
      filterValues?.selectedBranch === "" ||
      filterValues?.selectedBranch === null
    ) {
      toastfunc("Please Select From Branch");
    } else if (
      filterValues.containerCode === "" ||
      filterValues.containerCode === null
    ) {
      toastfunc("Please Enter Container Code" + filterValues.containerCode);
    } else {
      searchContainer();
    }
  };

  // const handleFormChange = (index, field, value) => {
  //     setFilterContainerList((prevValues) => {
  //         const updatedValues = [...prevValues];
  //         const updatedObject = { ...updatedValues[index] };
  //         updatedObject[field] = value;
  //         updatedValues[index] = updatedObject;
  //         return updatedValues;
  //     });

  // };

  const handleFormChange = (field, value) => {
    setFilterTagList((prevList) => {
      return prevList.map((item, index) => {
        if (index === prevList.length - 1) {
          return { ...item, [field]: value }; // Update the field dynamically
        }
        return item;
      });
    });
  };

  const updateStatus = (data) => {
    let index = filterContainerList.findIndex(
      (value) => value.tag_id === data.tag_id
    );
    handleFormChange(index, "isScanned", true);
    console.log(index, filterTagList[index]);
  };

  var totalPiece = filterTagList?.reduce(
    (sum, obj) =>
      sum + (obj?.tag_pcs != null || undefined ? parseFloat(obj?.tag_pcs) : 0),
    0
  );

  var totalGrsWt = filterTagList?.reduce(
    (sum, obj) =>
      sum + (obj?.tag_gwt != null || undefined ? parseFloat(obj?.tag_gwt) : 0),
    0
  );

  var totalscaleWeight = filterTagList?.reduce(
    (sum, obj) =>
      sum +
      (obj?.scaleWeight != null || undefined
        ? parseFloat(obj?.scaleWeight)
        : 0),
    0
  );

  var totalStWt = filterTagList?.reduce(
    (sum, obj) =>
      sum +
      (obj?.tag_stn_wt != null || undefined ? parseFloat(obj?.tag_stn_wt) : 0),
    0
  );

  var totalNetWt = filterTagList?.reduce(
    (sum, obj) =>
      sum + (obj?.tag_nwt != null || undefined ? parseFloat(obj?.tag_nwt) : 0),
    0
  );

  var totalDiaWt = filterTagList?.reduce(
    (sum, obj) =>
      sum +
      (obj?.tag_dia_wt != null || undefined ? parseFloat(obj?.tag_dia_wt) : 0),
    0
  );

  const calculateTotal = (field, data, decimal_places = 3) => {
    return data.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const totalPieces = searchList?.reduce((sum, item) => {
    return sum + parseFloat(item.tag_pcs || 0);
  }, 0);

  const unscanned = totalPieces - totalPiece;

  // useEffect(() => {
  //     if (add === undefined && id === undefined) {
  //         navigate(`${process.env.PUBLIC_URL}/inventory/stock_transfer/list`);
  //     }
  // }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title="Stock Transfer " />
      <Content>
        <PreviewCard className="h-100">
          <FormProvider {...methods}>
            <Row
              lg={12}
              className={"form-control-sm"}
              style={{ marginTop: "10px" }}
            >
              <Col md={9}>
                <ModifiedBreadcrumb></ModifiedBreadcrumb>
              </Col>

              <Col md={3} className="text-right">
                <Button
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(process.env.PUBLIC_URL)}
                >
                  Cancel
                </Button>{" "}
              </Col>
            </Row>
            <Row
              lg={12}
              className={"form-control-sm"}
              style={{ marginTop: "10px" }}
            >
              <Col md={12}>
                <div className="custom-grid">
                  <Nav
                    tabs
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "tagScan",
                          })}
                          onClick={() => setActiveTab("tagScan")}
                          style={{
                            cursor: "pointer",
                            fontWeight:
                              activeTab === "tagScan" ? "bold" : "normal",
                            padding: "10px 20px",
                            fontSize: "14px",
                          }}
                        >
                          Tag Scan
                        </NavLink>
                      </NavItem>

                      {settings?.show_unscanned_details == 1 && (
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "unScan",
                            })}
                            onClick={() => setActiveTab("unScan")}
                            style={{
                              cursor: "pointer",
                              fontWeight:
                                activeTab === "unScan" ? "bold" : "normal",
                              padding: "10px 20px",
                              fontSize: "14px",
                            }}
                          >
                            UnScanned Details
                          </NavLink>
                        </NavItem>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "1.5rem",
                        paddingRight: "10px",
                        fontSize: "16px",
                        fontWeight: "500",
                      }}
                    >
                      <div>Total Pieces: {totalPieces}</div>
                      <div>Scanned: {totalPiece}</div>
                      <div>Unscanned: {unscanned}</div>
                    </div>
                  </Nav>

                  <TabContent activeTab={activeTab}>
                    <TabPane tabId={"tagScan"}>
                      <Row lg={12} className={"form-control-sm"}>
                        <Col md={6}>
                          <div className="custom-grid">
                            <Row lg={12} className={"form-control-sm"}>
                              <Col md="4">
                                {/* <Label>Branch <IsRequired /></Label> */}
                                <BranchDropdown
                                  register={register}
                                  id={"idBranch"}
                                  branches={branches}
                                  selectedBranch={filterValues?.selectedBranch}
                                  onBranchChange={(value) => {
                                    handleFilterChange("selectedBranch", value);
                                  }}
                                  isRequired={false}
                                  clearErrors={clearErrors}
                                  setValue={setValue}
                                  message={
                                    errors.idBranch && "Branch is Required"
                                  }
                                />
                              </Col>
                              <Col md="4">
                                {/* <Label>Section <IsRequired /></Label> */}
                                <SectionDropdown
                                  register={register}
                                  sectionOptions={sections}
                                  id="selectedSection"
                                  selectedSection={
                                    filterValues?.selectedSection
                                  }
                                  onSectionChange={(e) => {
                                    handleFilterChange("selectedSection", e);
                                  }}
                                  isRequired={true}
                                  clearErrors={clearErrors}
                                  setValue={setValue}
                                  message={
                                    errors.selectedSection &&
                                    "Sections is Required"
                                  }
                                />
                              </Col>
                              <Col md="3">
                                <div
                                  className="form-group"
                                  style={{ marginTop: "-5px" }}
                                >
                                  <label
                                    className="form-label"
                                    htmlFor="site-name"
                                  ></label>
                                  <SaveButton
                                    disabled={issubmitting}
                                    size="md"
                                    color="primary"
                                    tabIndex={17}
                                    onClick={getSearchListDetails}
                                  >
                                    Search
                                  </SaveButton>
                                </div>
                              </Col>
                            </Row>
                            <Row
                              className="form-group row g-4"
                              style={{ marginTop: "20px" }}
                            >
                              <div
                                className="table-responsive"
                                style={{
                                  maxHeight: "300px",
                                  overflowY: "auto",
                                  overflowX: "auto",
                                }}
                              >
                                <table className="table table-bordered">
                                  <thead
                                    style={{
                                      position: "sticky",
                                      top: "0",
                                      zIndex: "1",
                                    }}
                                    className="table table-bordered"
                                  >
                                    <tr>
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        S.NO
                                      </th>
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Tag No
                                      </th>
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Product
                                      </th>
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Design
                                      </th>
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Piece
                                      </th>
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        GWt
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {searchList?.map((item, rowIndex) => (
                                      <tr key={rowIndex}>
                                        <td>{rowIndex + 1} </td>
                                        {settings?.show_unscanned_details ==
                                        1 ? (
                                          <td>{item.tag_code}</td>
                                        ) : (
                                          <td>-</td>
                                        )}

                                        <td>{item.product_name}</td>
                                        <td>{item.design_name}</td>
                                        <td style={{ textAlign: "right" }}>
                                          {" "}
                                          {item.tag_pcs}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                          {item.tag_gwt}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <td
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Total
                                      </td>
                                      <td
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      ></td>
                                      <td
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      ></td>
                                      <td
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      ></td>
                                      <td
                                        style={{
                                          textAlign: "right",
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        {parseInt(
                                          searchList?.reduce((sum, item) => {
                                            return (
                                              sum +
                                              parseFloat(item.tag_pcs || 0)
                                            );
                                          }, 0)
                                        )}
                                      </td>{" "}
                                      <td></td>
                                      {/* <td style={{ textAlign: "right",position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa"}}>{parseFloat(searchList?.reduce((sum, item) => {
      return sum + parseFloat(item.tag_gwt || 0);
    }, 0)).toFixed(3)}</td> */}
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </Row>
                          </div>
                        </Col>

                        <Col md={6}>
                          <div className="custom-grid">
                            <Row lg={12} className={"form-control-sm"}>
                              <Col md={7}>
                                <div className="form-control-wrap">
                                  {userInfo?.settings
                                    ?.tag_code_manually_tag_audit === "1" ? (
                                    <div
                                      className="input-group"
                                      style={{ width: "100%" }}
                                    >
                                      <div
                                        className="input-group-append"
                                        style={{ width: "40%" }}
                                      >
                                        <TextInputField
                                          register={register}
                                          isRequired={true}
                                          id={"tagCode"}
                                          placeholder="Tag Code"
                                          value={filterValues.tagCode}
                                          SetValue={(value) => {
                                            console.log("tagCode", value);
                                            handleFilterChange(
                                              "tagCode",
                                              value
                                            );
                                            clearErrors("tagCode");
                                          }}
                                          message={
                                            errors.tagCode &&
                                            errors.tagCode.message
                                          }
                                        />
                                      </div>
                                      <div
                                        className="input-group-append"
                                        style={{ width: "40%" }}
                                      >
                                        <TextInputField
                                          register={register}
                                          isRequired={true}
                                          id={"oldtagCode"}
                                          placeholder="Old Tag Code"
                                          value={filterValues.oldTagCode}
                                          SetValue={(value) => {
                                            console.log("oldTagCode", value);
                                            handleFilterChange(
                                              "oldTagCode",
                                              value
                                            );
                                            clearErrors("oldTagCode");
                                          }}
                                          message={
                                            errors.oldTagCode &&
                                            errors.oldTagCode.message
                                          }
                                        />
                                      </div>
                                      <div
                                        className="input-group-append"
                                        style={{ height: "29px", width: "20%" }}
                                      >
                                        <Button
                                          outline
                                          color="primary"
                                          className="btn-dim"
                                          onClick={handleAddPreview}
                                        >
                                          <Icon name="search" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className="input-group"
                                      style={{ width: "100%" }}
                                    >
                                      <div
                                        className="input-group-append"
                                        style={{ width: "40%" }}
                                      >
                                        <TextInputField
                                          register={register}
                                          isRequired={true}
                                          id={"tagCode"}
                                          placeholder="Tag Code"
                                          value={filterValues.tagCode}
                                          SetValue={(value) => {
                                            console.log("tagCode", value);
                                            handleFilterChange(
                                              "tagCode",
                                              value
                                            );
                                            clearErrors("tagCode");
                                          }}
                                          message={
                                            errors.tagCode &&
                                            errors.tagCode.message
                                          }
                                          handleKeyDown={(e) => {
                                            const isCtrlV =
                                              e.ctrlKey &&
                                              e.key.toLowerCase() === "v";
                                            if (!isCtrlV) {
                                              e.preventDefault();
                                            }
                                          }}
                                          handleOnBeforeInput={(e) =>
                                            e.preventDefault()
                                          }
                                        />
                                      </div>
                                      <div
                                        className="input-group-append"
                                        style={{ width: "40%" }}
                                      >
                                        <TextInputField
                                          register={register}
                                          isRequired={true}
                                          id={"oldtagCode"}
                                          placeholder="Old Tag Code"
                                          value={filterValues.oldTagCode}
                                          SetValue={(value) => {
                                            console.log("oldTagCode", value);
                                            handleFilterChange(
                                              "oldTagCode",
                                              value
                                            );
                                            clearErrors("oldTagCode");
                                          }}
                                          message={
                                            errors.oldTagCode &&
                                            errors.oldTagCode.message
                                          }
                                          handleKeyDown={(e) => {
                                            const isCtrlV =
                                              e.ctrlKey &&
                                              e.key.toLowerCase() === "v";
                                            if (!isCtrlV) {
                                              e.preventDefault();
                                            }
                                          }}
                                          handleOnBeforeInput={(e) =>
                                            e.preventDefault()
                                          }
                                        />
                                      </div>
                                      <div
                                        className="input-group-append"
                                        style={{ height: "29px", width: "20%" }}
                                      >
                                        <Button
                                          outline
                                          color="primary"
                                          className="btn-dim"
                                          onClick={handleAddPreview}
                                        >
                                          <Icon name="search" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col md={3}>
                                <div
                                  className="form-control-wrap"
                                  style={{ marginTop: "7px" }}
                                >
                                  <div className="form-group">
                                    <div className="custom-control custom-control-sm custom-checkbox">
                                      <input
                                        type="checkbox"
                                        checked={with_height}
                                        onChange={(e) =>
                                          setWith_height(e.target.checked)
                                        }
                                        className="custom-control-input"
                                        id="with_height"
                                      />
                                      <label
                                        className="custom-control-label font-bold"
                                        htmlFor="with_height"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        {"With Weight"}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col md={1}>
                                <SaveButton
                                  disabled={
                                    issubmitting || !pagePermission?.edit
                                  }
                                  size="md"
                                  color="warning"
                                  tabIndex={17}
                                  onClick={() => {
                                    closeScan();
                                  }}
                                >
                                  Close
                                </SaveButton>
                              </Col>
                            </Row>
                            <Row lg={12} className={"form-control-sm"}>
                              {with_height && (
                                <Col md="4">
                                  <div className="col">
                                    <label>Scale Weight (g)</label>
                                    <NumberInputField
                                      register={register}
                                      placeholder="Scale Weight (g)"
                                      id={"scaleWeight"}
                                      value={scaleWeight}
                                      min={0}
                                      setValue={setValue}
                                      SetValue={(value) => {
                                        setScaleWeight(value);
                                        clearErrors("scaleWeight");
                                      }}
                                      reqValueError={"Scale Weight is Required"}
                                      message={
                                        errors.scaleWeight &&
                                        errors.scaleWeight.message
                                      }
                                      tabIndex={9}
                                    />
                                  </div>
                                </Col>
                              )}
                            </Row>

                            <Row
                              className="form-group row g-4"
                              style={{ marginTop: "20px" }}
                            >
                              <Col md={12}>
                                <Row md={12}>
                                  <div
                                    className="table-responsive"
                                    style={{
                                      maxHeight: "300px",
                                      overflowX: "auto",
                                      overflowY: "auto",
                                    }}
                                  >
                                    <table className="table table-bordered">
                                      <thead
                                        style={{
                                          position: "sticky",
                                          top: "0",
                                          zIndex: "1",
                                        }}
                                      >
                                        <tr>
                                          <th
                                            style={{
                                              position: "sticky",
                                              top: 0,
                                              zIndex: 1,
                                              backgroundColor: "#f8f9fa",
                                            }}
                                          >
                                            Tag Code
                                          </th>
                                          <th
                                            style={{
                                              position: "sticky",
                                              top: 0,
                                              zIndex: 1,
                                              backgroundColor: "#f8f9fa",
                                            }}
                                          >
                                            Piece
                                          </th>
                                          <th
                                            style={{
                                              position: "sticky",
                                              top: 0,
                                              zIndex: 1,
                                              backgroundColor: "#f8f9fa",
                                            }}
                                          >
                                            Gwt
                                          </th>
                                          <th
                                            style={{
                                              position: "sticky",
                                              top: 0,
                                              zIndex: 1,
                                              backgroundColor: "#f8f9fa",
                                            }}
                                          >
                                            Scale Weight
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {filterTagList?.map(
                                          (item, rowIndex) => (
                                            <tr key={rowIndex}>
                                              <td>{item.tag_code}</td>
                                              <td
                                                style={{ textAlign: "right" }}
                                              >
                                                {" "}
                                                {item.tag_pcs}
                                              </td>
                                              <td
                                                style={{ textAlign: "right" }}
                                              >
                                                {item.tag_gwt}
                                              </td>
                                              <td
                                                style={{ textAlign: "right" }}
                                              >
                                                {parseFloat(
                                                  item.scaleWeight
                                                ).toFixed(3)}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                      <tfoot
                                        style={{
                                          position: "sticky",
                                          bottom: "0",
                                          zIndex: "1",
                                        }}
                                      >
                                        <tr
                                          style={{
                                            fontWeight: "bold",
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 1,
                                            backgroundColor: "#f8f9fa",
                                          }}
                                        >
                                          <td
                                            style={{
                                              position: "sticky",
                                              top: 0,
                                              zIndex: 1,
                                              backgroundColor: "#f8f9fa",
                                            }}
                                          >
                                            Total
                                          </td>
                                          <td
                                            style={{
                                              textAlign: "right",
                                              position: "sticky",
                                              top: 0,
                                              zIndex: 1,
                                              backgroundColor: "#f8f9fa",
                                            }}
                                          >
                                            {totalPiece}
                                          </td>
                                          <td
                                            style={{
                                              textAlign: "right",
                                              position: "sticky",
                                              top: 0,
                                              zIndex: 1,
                                              backgroundColor: "#f8f9fa",
                                            }}
                                          >
                                            {parseFloat(totalGrsWt).toFixed(3)}
                                          </td>
                                          <td
                                            style={{
                                              textAlign: "right",
                                              position: "sticky",
                                              top: 0,
                                              zIndex: 1,
                                              backgroundColor: "#f8f9fa",
                                            }}
                                          >
                                            {parseFloat(
                                              totalscaleWeight
                                            ).toFixed(3)}
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>
                                </Row>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                    {settings?.show_unscanned_details === true && (
                      <TabPane tabId={"unScan"}>
                        <Row lg={12} className={"form-control-sm"}>
                          <Col md="3">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Branch
                                <IsRequired />
                              </label>

                              <BranchDropdown
                                register={register}
                                id={"idBranch"}
                                branches={branches}
                                selectedBranch={filterValues?.selectedBranch}
                                onBranchChange={(value) => {
                                  handleFilterChange("selectedBranch", value);
                                }}
                                isRequired={false}
                                clearErrors={clearErrors}
                                setValue={setValue}
                                message={
                                  errors.idBranch && "Branch is Required"
                                }
                              />
                            </div>
                          </Col>

                          <Col md="3">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Section
                                <IsRequired />
                              </label>

                              <SectionDropdown
                                register={register}
                                sectionOptions={sections}
                                id="selectedSection"
                                selectedSection={filterValues?.selectedSection}
                                onSectionChange={(e) => {
                                  handleFilterChange("selectedSection", e);
                                }}
                                isRequired={true}
                                clearErrors={clearErrors}
                                setValue={setValue}
                                message={
                                  errors.selectedSection &&
                                  "Sections is Required"
                                }
                              />
                            </div>
                          </Col>

                          <Col md="3">
                            <div className="form-group">
                              <br />
                              <SaveButton
                                disabled={issubmitting}
                                size="md"
                                color="primary"
                                tabIndex={17}
                                onClick={getUnscannedDetails}
                              >
                                Search
                              </SaveButton>
                            </div>
                          </Col>

                          <Col md="3">
                            <div className="form-group">
                              <br />
                              <SaveButton
                                disabled={
                                  issubmitting || !pagePermission?.print
                                }
                                size="md"
                                color="success"
                                tabIndex={17}
                                onClick={handlePrint}
                              >
                                Print
                              </SaveButton>
                            </div>
                          </Col>
                        </Row>

                        <Row
                          className="form-group row g-4"
                          style={{ marginTop: "20px" }}
                        >
                          <Col md={12}>
                            <br />
                            <Row md={12} className="form-group row g-4">
                              <Col md={3}>
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  UNSCANNED DETAILS:
                                </div>
                              </Col>

                              <Col md={3}>
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  PCS :{" "}
                                  {calculateTotal("tag_pcs", unScannedList, 0)}
                                </div>
                              </Col>
                              <Col md={3}>
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  WT :{" "}
                                  {calculateTotal("tag_gwt", unScannedList)}
                                </div>
                              </Col>
                            </Row>
                            <Row md={12}>
                              <div
                                className="table-responsive"
                                style={{
                                  maxHeight: "300px",
                                  overflowY: "auto",
                                  overflowX: "hidden",
                                }}
                              >
                                <table className="table table-bordered">
                                  <thead
                                    style={{
                                      position: "sticky",
                                      top: "0",
                                      zIndex: "1",
                                    }}
                                  >
                                    <tr>
                                      {/* <th></th> */}
                                      {/* <th>S.NO</th> */}
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Tag Code
                                      </th>
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Product
                                      </th>
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Section
                                      </th>
                                      {/* <th>S.Design</th> */}

                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Piece
                                      </th>
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Gwt
                                      </th>
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Lwt
                                      </th>
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Nwt
                                      </th>
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Stn Wt
                                      </th>
                                      <th
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Dia Wt
                                      </th>
                                      {/* <th>Action</th> */}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {unScannedList?.map((item, rowIndex) => (
                                      <tr key={rowIndex}>
                                        {/* <td >
                                <input type="checkbox" style={{ cursor: "pointer" }}
                                    onChange={(event) => {
                                        handleFormChange(rowIndex, 'isChecked', event.target.checked)
                                    }}
                                    checked={item.isChecked}
                                />
                            </td> */}
                                        {/* <td>{rowIndex + 1} </td> */}
                                        <td>{item.tag_code}</td>
                                        <td>{item.product_name}</td>
                                        <td>{item.section_name}</td>
                                        {/*  <td>{item.sub_design_name}</td> */}

                                        <td style={{ textAlign: "right" }}>
                                          {" "}
                                          {item.tag_pcs}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                          {item.tag_gwt}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                          {item.tag_lwt}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                          {item.tag_nwt}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                          {item.tag_stn_wt}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                          {item.tag_dia_wt}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot
                                    style={{
                                      position: "sticky",
                                      bottom: "0",
                                      zIndex: "1",
                                    }}
                                  >
                                    <tr style={{ fontWeight: "bold" }}>
                                      <td
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        Total
                                      </td>
                                      {/* <td></td>
                            <td></td>
                            <td></td> */}
                                      <td
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      ></td>
                                      <td
                                        style={{
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      ></td>

                                      <td
                                        style={{
                                          textAlign: "right",
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        {calculateTotal(
                                          "tag_pcs",
                                          unScannedList,
                                          0
                                        )}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "right",
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        {calculateTotal(
                                          "tag_gwt",
                                          unScannedList
                                        )}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "right",
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        {calculateTotal(
                                          "tag_lwt",
                                          unScannedList
                                        )}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "right",
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        {calculateTotal(
                                          "tag_nwt",
                                          unScannedList
                                        )}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "right",
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        {calculateTotal(
                                          "tag_stn_wt",
                                          unScannedList
                                        )}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "right",
                                          position: "sticky",
                                          top: 0,
                                          zIndex: 1,
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        {calculateTotal(
                                          "tag_dia_wt",
                                          unScannedList
                                        )}
                                      </td>
                                      {/* <td></td>  */}
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </Row>
                          </Col>
                        </Row>
                      </TabPane>
                    )}
                  </TabContent>
                </div>
              </Col>
            </Row>
          </FormProvider>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default TagAuditForm;
