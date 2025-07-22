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
import { getCashAbstractReport, getModeWiseCollectionReport, getSchemeAbstract } from "../../redux/thunks/reports";
import moment from "moment";
import { useForm } from "react-hook-form";
import "../../assets/css/datatable.css";
import ReportFilterComponent from "../reports/ReportFilterComponent";
import FilterSidebar from "../../components/sidebar/FilterSidebar";
import SchemeAbstractTable from "../../components/reports-print/SchemeAbstractTable";
import html2pdf from "html2pdf.js";

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

const SchemeAbstract = () => {
  const { register, clearErrors, setValue, errors } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathName = location?.pathname;
  const [fromDate, SetFromDate] = useState(new Date());
  const [toDate, SetToDate] = useState(new Date());
  const [scheme, SetScheme] = useState("");
  const tableRef = useRef();

  const { schemeAbstractReportList, isLoading: loadingData } = useSelector((state) => state.reportReducer);
  const { modeWiseCollectionReportList, isLoading: loadingModeWiseData } = useSelector((state) => state.reportReducer);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const [selectedBranch, SetSelectedBranch] = useState("");
  const [selectedScheme, SetSelectedSchene] = useState("");
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());

  console.log(schemeAbstractReportList);
  console.log(modeWiseCollectionReportList);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    dispatch(
      getSchemeAbstract({
        from_date: moment(startDate).format("YYYY-MM-DD"),
        to_date: moment(endDate).format("YYYY-MM-DD"),
        id_branch: selectedBranch,
      })
    );
    dispatch(
      getModeWiseCollectionReport({
        fromDate: moment(startDate).format("YYYY-MM-DD"),
        toDate: moment(endDate).format("YYYY-MM-DD"),
        id_scheme: "",
        branch: selectedBranch,
      })
    );
  }, [dispatch]);

  const getData = async () => {
    try {
      await dispatch(
        getSchemeAbstract({
          from_date: moment(startDate).format("YYYY-MM-DD"),
          to_date: moment(endDate).format("YYYY-MM-DD"),
          id_branch: selectedBranch,
        })
      );
      await dispatch(
        getModeWiseCollectionReport({
          fromDate: moment(startDate).format("YYYY-MM-DD"),
          toDate: moment(endDate).format("YYYY-MM-DD"),
          id_scheme: "",
          branch: selectedBranch,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [filterModal, SetFilterModal] = useState(false);
  const toggleFilterModal = () => SetFilterModal(!filterModal);

  const calculateTotal = (field, data) => {
    return data?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns?.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const columns = [
    { accessor: "receipt_no", header: "RECEIPT NO", is_total_req: false, textAlign: "center" },
    { accessor: "cus_name", header: "CUSTOMER", is_total_req: false, textAlign: "center" },
    { accessor: "amount", header: "AMOUNT", isCurrency: true, isTotalReq: true, textAlign: "left", decimal_places: 2 },
    { accessor: "rate", header: "RATE", isCurrency: true, isTotalReq: true, textAlign: "left", decimal_places: 3 },
    { accessor: "weight", header: "WEIGHT", isTotalReq: true, textAlign: "left", decimal_places: 3 },
    { accessor: "entry_date", header: "DATE", is_total_req: false, textAlign: "center", width: "10%;" },
    { accessor: "scheme_name", header: "SCHEME", is_total_req: false, textAlign: "center", width: "10%;" },
    { accessor: "mobile", header: "MOBILE", is_total_req: false, textAlign: "center" },
    { accessor: "scheme_acc_number", header: "ACC NO", is_total_req: false, textAlign: "center" },
    {
      accessor: "discountAmt",
      header: "DISCOUNT",
      is_total_req: true,
      decimal_places: 2,
      isCurrency: true,
      textAlign: "right",
      is_money_format: true,
    },
    {
      accessor: "net_amount",
      header: "NET AMOUNT",
      is_total_req: true,
      isCurrency: true,
      decimal_places: 2,
      textAlign: "right",
      is_money_format: true,
    },
    { accessor: "paid_through", header: "PAID FROM", is_total_req: false, textAlign: "center" },
    { accessor: "emp_name", header: "EMPLOYEE", is_total_req: false, textAlign: "center" },
  ];

  const FilterComponent = (
    <ReportFilterComponent
      children={{
        register,
        clearErrors,
        setValue,
        errors,
        selectedScheme,
        SetSelectedSchene,
        selectedBranch,
        SetSelectedBranch,
        startDate,
        SetStartDate,
        endDate,
        SetEndDate,
        getData,
        is_group_by_req: false,
        is_multi_branch_filter_req: false,
        is_scheme_filter_req: true,
        is_date_filter_req: true,
        is_branch_filter_req: true,
      }}
    />
  );

  const printReport = () => {
    const printUrl = `${process.env.PUBLIC_URL}/reports/scheme_abstract/print`;
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
        fromDate:startDate,
        toDate:endDate,
        modewiseData: modeWiseCollectionReportList,
      })
    );

    const newWindow = window.open(printUrl, "_blank");

    newWindow.onload = () => {
      newWindow.postMessage(reportData, "*");
    };
  };

  const componentRef = useRef();
  const handleGeneratePdf = () => {
    const element = tableRef.current;

    // Generate the PDF and create a Blob
    html2pdf()
      .from(element)
      .toPdf()
      .outputPdf("blob")
      .then((pdfBlob) => {
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(pdfBlob);

        // Open the PDF in a new window or tab
        window.open(url, "_blank");

        // Optionally, release the Blob URL after use (you can delay this to avoid the URL getting revoked too soon)
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
      });
  };

  return (
    <React.Fragment>
      <Head title={pagePermission?.title ? pagePermission?.title : "Scheme Abstract Reports"}></Head>
      {pagePermission?.view && (
        <Content>
          <Block size="lg">
            <Card className="card-bordered card-preview">
              <Styles>
                <div className="card-inner">
                  <div className="card-title-group">
                    <div className="toggle-wrap nk-block-tools-toggle">
                      <h5>Scheme Abstract Reports</h5>
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
                              //   onClick={() => exportExcel()}
                            >
                              <span>Excel</span>
                            </button>{" "}
                            <button className="btn btn-secondary " type="button" onClick={printReport}>
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
                <SchemeAbstractTable
                  ref={tableRef}
                  modeWiseCollectionReportList={modeWiseCollectionReportList}
                  schemeAbstractReportList={schemeAbstractReportList}
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
              selectedScheme,
              SetSelectedSchene,
              selectedBranch,
              SetSelectedBranch,
              startDate,
              SetStartDate,
              endDate,
              SetEndDate,
              getData,
              is_group_by_req: false,
              is_multi_branch_filter_req: false,
              is_scheme_filter_req: true,
              is_date_filter_req: true,
              is_branch_filter_req: true,
            }}
          />
        </Content>
      )}
    </React.Fragment>
  );
};

export default SchemeAbstract;
