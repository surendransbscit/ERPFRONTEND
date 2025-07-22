import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import { Block, Col, DropdownInputField, Icon, ReactDataTable, Row } from "../../components/Component";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { Button, DropdownMenu, DropdownToggle, UncontrolledDropdown, Card } from "reactstrap";
import { getReorderReportReport } from "../../redux/thunks/reports";
import moment from "moment";
import { useForm } from "react-hook-form";
import "../../assets/css/datatable.css";
import { tr } from "date-fns/locale";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import ReportFilterComponent from "./ReportFilterComponent";
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import FilterSidebar from "../../components/sidebar/FilterSidebar";

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

const SalesPrediction = () => {
  const { register, clearErrors, setValue, errors } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const pathName = location?.pathname;
  const { reorderReportList, isLoading: loadingData } = useSelector((state) => state.reportReducer);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);
  const [branch, SetBranch] = useState();
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());
  const [columns, SetColumns] = useState([]);
  const [reportList, SetReportList] = useState([]);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  // useEffect(() => {
  //   dispatch(
  //     getReorderReportReport({
  //       from_date: moment(startDate).format("YYYY-MM-DD"),
  //       to_date: moment(endDate).format("YYYY-MM-DD"),
  //       branch_id: branch,
  //     })
  //   );
  // }, [dispatch]);

  useEffect(() => {
    if (reorderReportList?.columns) {
      console.log(reorderReportList?.columns);
      SetColumns(reorderReportList.columns);
      SetReportList(reorderReportList.reorder_details);

      console.log(columns);
    }
  }, [reorderReportList]);

  useEffect(() => {
    console.log("Updated columns:", columns);
  }, [columns]);

  const getData = async () => {
    if (branch) {
      try {
        await dispatch(
          getReorderReportReport({
            from_date: moment(startDate).format("YYYY-MM-DD"),
            to_date: moment(endDate).format("YYYY-MM-DD"),
            branch_id: branch,
          })
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      toastfunc("Select Branch");
    }
  };

  const [filterModal, SetFilterModal] = useState(false);
  const toggleFilterModal = () => SetFilterModal(!filterModal);

  function calculateTotal(data, numericColumns) {
    const totals = {};

    numericColumns.forEach((column) => {
      totals[column] = data.reduce((sum, row) => sum + (Number(removeComma(row[column])) || 0), 0);
    });
    return totals;
  }

  const FilterComponent = (
    <ReportFilterComponent
      children={{
        register,
        clearErrors,
        setValue,
        errors,
        branch,
        SetBranch,
        startDate,
        SetStartDate,
        endDate,
        SetEndDate,
        getData,
        is_group_by_req: false,
        is_multi_branch_filter_req: false,
        isBranchFilterReq: true,
        is_scheme_filter_req: false,
        is_date_filter_req: true,
      }}
    />
  );
  const totals = calculateTotal(
    reportList,
    columns.map((col) => col.accessor)
  );

  console.log("total", totals);
  function removeComma(value) {
    if (value) return value.toString().replace(/,/g, "");
    else {
      return value;
    }
  }

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
                      <h5>Sales Prediction Reports</h5>
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
                <div className="table-responsive dataTables_wrapper">
                  <table className="table-wrapper react_table">
                    <thead>
                      <tr>
                        {columns.map((column) => {
                          console.log(column);
                          return (
                            <th key={column.Header} style={{ textAlign: column?.text_align }}>
                              {column.Header}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {reportList.map((row) => {
                        return (
                          <tr>
                            {columns.map((cell, index) => {
                              return <td style={{ textAlign: cell?.text_align }}>{row[cell.accessor]}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>

                    <tfoot>
                      <tr>
                        {columns?.map((column, index) => (
                          <td key={column.accessor} style={{ fontWeight: "bold", textAlign: column?.text_align }}>
                            {index === 0 ? "TOTAL" : ""}
                            {column?.is_total_req ? (
                              column?.is_money_format ? (
                                <CurrencyDisplay
                                  value={parseFloat(totals[column.accessor]).toFixed(column?.decimal_places)}
                                />
                              ) : (
                                parseFloat(totals[column.accessor]).toFixed(column?.decimal_places)
                              )
                            ) : (
                              ""
                            )}
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
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
              branch,
              SetBranch,
              startDate,
              SetStartDate,
              endDate,
              SetEndDate,
              getData,
              is_group_by_req: false,
              is_multi_branch_filter_req: false,
              isBranchFilterReq: true,
              is_scheme_filter_req: false,
              is_date_filter_req: true,
            }}
          />
        </Content>
      )}
    </React.Fragment>
  );
};

export default SalesPrediction;
