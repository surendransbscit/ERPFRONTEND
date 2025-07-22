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
import { getCashAbstractReport } from "../../redux/thunks/reports";
import moment from "moment";
import { useForm } from "react-hook-form";
import "../../assets/css/datatable.css";
import { tr } from "date-fns/locale";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import ReportFilterComponent from "../reports/ReportFilterComponent";
import FilterSidebar from "../../components/sidebar/FilterSidebar";
import CashAbstractPrintComponent from "../../components/reports-print/CashAbstractPrintComponent";
import CashAbstractTable from "../../components/reports-print/CashAbstractTable";
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

const CashAbstract = () => {
  const { register, clearErrors, setValue, errors } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathName = location?.pathname;
  const [fromDate, SetFromDate] = useState(new Date());
  const [toDate, SetToDate] = useState(new Date());
  const [scheme, SetScheme] = useState("");
  const tableRef = useRef();
  const { billSettingType } = useBillSettingContext();
  const { cashAbstractReportList, isLoading: loadingData } = useSelector((state) => state.reportReducer);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const [selectedBranch, SetSelectedBranch] = useState([]);
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    getData();
  }, [dispatch, fromDate, toDate, billSettingType]);

  const getData = async () => {
    try {
      await dispatch(
        getCashAbstractReport({
          from_date: moment(startDate).format("YYYY-MM-DD"),
          to_date: moment(endDate).format("YYYY-MM-DD"),
          bill_setting_type : billSettingType,
          id_branch: selectedBranch?.map((obj) => {
            const container = obj.value;
            return container;
          }),
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

  const columns = [
    { accessor: "product_name", header: "PRODUCT", isTotalReq: false, textAlign: "left" },
    { accessor: "pcs", header: "PCS", isTotalReq: true, textAlign: "right" },
    { accessor: "grosswt", header: "GRS.WT", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "netwt", header: "NET.WT", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "lesswt", header: "LESS.WT", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "diawt", header: "DIA.WT", isTotalReq: true, decimal_places: 3, textAlign: "right" },
    { accessor: "stonewt", header: "STN.WT", isTotalReq: true, decimal_places: 3, textAlign: "right" },
    { accessor: "taxable", header: "TAXABLE AMT", isTotalReq: true, decimal_places: 2, textAlign: "right",isCurrency:true },
    { accessor: "tax", header: "TAX AMT", isTotalReq: true, decimal_places: 2, textAlign: "right",isCurrency:true },
    { accessor: "tot_amount", header: "TOTAL AMT", isTotalReq: true, decimal_places: 2, textAlign: "right",isCurrency:true },
  ];

  const FilterComponent = (
    <ReportFilterComponent
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
      }}
    />
  );

  const printReport = () => {
    const printUrl = `${process.env.PUBLIC_URL}/reports/cash_abstract/print`;
    const reportData = {
      columns: columns,
      data: cashAbstractReportList,
      company_name: userInfo?.user?.company_fullname,
    };
    localStorage.setItem(
      "cashAbstractData",
      JSON.stringify({
        columns: columns,
        data: cashAbstractReportList,
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
    // navigate(
    //   {
    //     pathname: `${process.env.PUBLIC_URL}/reports/cash_abstract/print`,
    //   },
    //   {
    //     state: {
    //       columns: columns,
    //       data: cashAbstractReportList,
    //       company_name: userInfo?.user?.company_fullname,
    //     },
    //   }
    // );
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
                      <h5>Cash Abstract Reports</h5>
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
                <CashAbstractTable
                  ref={tableRef}
                  calculateTotal={calculateTotal}
                  cashAbstractReportList={cashAbstractReportList}
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
              is_group_by_req: false,
              is_multi_branch_filter_req: true,
              is_scheme_filter_req: false,
              is_date_filter_req: true,
            }}
          />
        </Content>
      )}
    </React.Fragment>
  );
};

export default CashAbstract;
