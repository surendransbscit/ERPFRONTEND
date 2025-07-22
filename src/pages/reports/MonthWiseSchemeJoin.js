import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import styled from "styled-components";
import { Block, Icon } from "../../components/Component";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { Card } from "reactstrap";
import { getMonthWiseSchemeJoin } from "../../redux/thunks/reports";
import { useForm } from "react-hook-form";
import "../../assets/css/datatable.css";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import ReportFilterComponent from "../reports/ReportFilterComponent";
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

const MonthWiseSchemeJoin = () => {
  const { register, clearErrors, setValue, errors } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const pathName = location?.pathname;
  const [filterModal, SetFilterModal] = useState(false);
  const toggleFilterModal = () => SetFilterModal(!filterModal);

  const { monthWiseSchemeJoinList, isLoading: loadingData } = useSelector((state) => state.reportReducer);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);
  const [selectedBranch, SetSelectedBranch] = useState([]);
  const [selectedScheme, SetSelectedSchene] = useState("");
  const [selectedYear, SetSelectedYear] = useState(new Date().getFullYear());
  const [selectedAddedThrough, SetSelectedAddedThrough] = useState(0);
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    dispatch(
      getMonthWiseSchemeJoin({
        year: selectedYear,
        added_through: selectedAddedThrough,
      })
    );
  }, [dispatch]);

  const getData = async () => {
    try {
      await dispatch(
        getMonthWiseSchemeJoin({
          year: selectedYear,
          added_through: selectedAddedThrough,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { accessor: "year", header: "Year" },
    { accessor: "jan_count", header: "Jan" },
    { accessor: "feb_count", header: "Feb" },
    { accessor: "mar_count", header: "Mar" },
    { accessor: "apr_count", header: "Apr" },
    { accessor: "may_count", header: "May" },
    { accessor: "jun_count", header: "Jun" },
    { accessor: "jul_count", header: "Jul" },
    { accessor: "aug_count", header: "Aug" },
    { accessor: "sep_count", header: "Sep" },
    { accessor: "oct_count", header: "Oct" },
    { accessor: "nov_count", header: "Nov" },
    { accessor: "dec_count", header: "Dec" },
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
        selectedYear,
        SetSelectedYear,
        selectedAddedThrough,
        SetSelectedAddedThrough,
        is_group_by_req: false,
        is_multi_branch_filter_req: false,
        is_scheme_filter_req: true,
        is_date_filter_req: false,
        is_year_filter_req: true,
        is_added_through_filter_req: true,
      }}
    />
  );

  return (
    <React.Fragment>
      <Head title={pagePermission?.title ? pagePermission?.title : "Monthly Scheme Joining Reports"}></Head>
      {pagePermission?.view && (
        <Content>
          <Block size="lg">
            <Card className="card-bordered card-preview">
              <Styles>
                <div className="card-inner">
                  <div className="card-title-group">
                    <div className="toggle-wrap nk-block-tools-toggle">
                      <h5>Monthly Scheme Joining Reports</h5>
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
                        {columns?.map((column, index) => (
                          <th key={index} style={{ textAlign: column?.textAlign }}>
                            {column.header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {monthWiseSchemeJoinList?.length > 0 &&
                        monthWiseSchemeJoinList?.map((item, rowIndex) => (
                          <>
                            <tr style={{ fontWeight: "bold" }}>
                              <td style={{ textAlign: "left" }}>{item?.scheme_name}</td>
                              <td colSpan={columns.length}></td>
                            </tr>
                            {item?.datas?.map((item, rowIndex) => (
                              <tr key={rowIndex}>
                                {columns?.map((column, colIndex) => (
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
                          </>
                        ))}
                    </tbody>

                    <tfoot></tfoot>
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
              selectedScheme,
              SetSelectedSchene,
              selectedBranch,
              SetSelectedBranch,
              startDate,
              SetStartDate,
              endDate,
              SetEndDate,
              getData,
              selectedYear,
              SetSelectedYear,
              selectedAddedThrough,
              SetSelectedAddedThrough,
              is_group_by_req: false,
              is_multi_branch_filter_req: false,
              is_scheme_filter_req: true,
              is_date_filter_req: false,
              is_year_filter_req: true,
              is_added_through_filter_req: true,
            }}
          />
        </Content>
      )}
    </React.Fragment>
  );
};

export default MonthWiseSchemeJoin;
