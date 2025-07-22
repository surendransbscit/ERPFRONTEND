import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Block } from "../../components/Component";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { Card } from "reactstrap";
import { getCustomerOutstandingReport } from "../../redux/thunks/reports";
import moment from "moment";
import { useForm } from "react-hook-form";
import { getAllScheme } from "../../redux/thunks/scheme";
import { Styles, Table } from "../../components/sds-table/ReactTable";
import ReportFilterComponent from "./ReportFilterComponent";
import { useBranches, useSchemes } from "../../components/filters/filterHooks";
import ReportTableHeader from "./ReportTableHeader";
import FilterSidebar from "../../components/sidebar/FilterSidebar";

const CustomerOutstanding = () => {
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const pathName = location?.pathname;
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());
  const [selectedScheme, SetSelectedSchene] = useState();
  const [selectedBranch, SetSelectedBranch] = useState();
  const [groupByVal, SetGroupByVal] = useState([]);
  const [groupByCols, SetGroupByCols] = useState([]);
  const { schemes } = useSchemes();
  const { branches } = useBranches();

  const [page, SetPage] = useState(1);
  const paginate = (pageNumber) => SetPage(pageNumber);

  const { customerOutstandingReportList, isLoading: loadingData } = useSelector((state) => state.reportReducer);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    dispatch(getAllScheme());
    dispatch(
      getCustomerOutstandingReport({
        from_date: moment(startDate).format("YYYY-MM-DD"),
        to_date: moment(endDate).format("YYYY-MM-DD"),
        id_scheme: selectedScheme,
      })
    );
  }, [dispatch, startDate, endDate, selectedScheme, groupByCols]);

  const getData = async () => {
    try {
      await dispatch(
        getCustomerOutstandingReport({
          from_date: moment(startDate).format("YYYY-MM-DD"),
          to_date: moment(endDate).format("YYYY-MM-DD"),
          id_scheme: selectedScheme,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const group_by = [
    { label: "cus_name", value: "cus_name" },
    { label: "mobile", value: "mobile" },
  ];

  useEffect(() => {
    let GroupCols = groupByVal?.map((obj) => {
      const container = obj.value;
      return container;
    });
    SetGroupByCols(GroupCols);
  }, [groupByVal]);

  const [filterModal, SetFilterModal] = useState(false);
  const toggleFilterModal = () => SetFilterModal(!filterModal);

  const FilterComponent = (
    <ReportFilterComponent
      children={{
        register,
        schemes,
        selectedScheme,
        SetSelectedSchene,
        clearErrors,
        setValue,
        errors,
        branches,
        selectedBranch,
        SetSelectedBranch,
        startDate,
        SetStartDate,
        endDate,
        SetEndDate,
        getData,
        groupByOptions: group_by,
        groupByVal,
        SetGroupByVal,
        is_branch_filter_req: customerOutstandingReportList?.filters?.branch_filter,
        is_scheme_filter_req: customerOutstandingReportList?.filters?.scheme_filter,
        is_date_filter_req: customerOutstandingReportList?.filters?.date_filter,
      }}
    />
  );

  const columns = customerOutstandingReportList?.columns?.map((col, index) => {
    if (col.selector === "sno") {
      return { name: col.name, selector: (row) => index + 1, sortable: false };
    }
    return { name: col.name, selector: (row) => row[col.selector], sortable: false };
  });

  return (
    <React.Fragment>
      <Head title={pagePermission?.title ? pagePermission?.title : "Customer Outstanding Report"}></Head>
      {pagePermission?.view && (
        <Content>
          <Block size="lg">
            <Card className="card-bordered card-preview">
              <Styles>
                <Table
                  columns={customerOutstandingReportList?.columns ? customerOutstandingReportList?.columns : []}
                  data={customerOutstandingReportList?.rows ? customerOutstandingReportList?.rows : []}
                  totalPages={customerOutstandingReportList?.total_pages}
                  currentPage={page}
                  toggleFilterModal={toggleFilterModal}
                  is_filter_req={customerOutstandingReportList?.is_filter_req}
                  paginate={paginate}
                  showPagination={true}
                  isGrouping={groupByCols?.length > 0 ? true : false}
                  pageTitle={pagePermission?.title ? pagePermission?.title : "Customer Outstanding Reports"}
                  // FilterComponent={FilterComponent}
                  groupingColumns={groupByCols}
                />
              </Styles>
            </Card>
          </Block>
          <FilterSidebar
            sideBar={filterModal}
            toggle={toggleFilterModal}
            children={{
              register,
              schemes,
              selectedScheme,
              SetSelectedSchene,
              clearErrors,
              setValue,
              errors,
              branches,
              selectedBranch,
              SetSelectedBranch,
              startDate,
              SetStartDate,
              endDate,
              SetEndDate,
              getData,
              groupByOptions: group_by,
              groupByVal,
              SetGroupByVal,
              is_branch_filter_req: customerOutstandingReportList?.filters?.branch_filter,
              is_scheme_filter_req: customerOutstandingReportList?.filters?.scheme_filter,
              is_date_filter_req: customerOutstandingReportList?.filters?.date_filter,
            }}
          />
        </Content>
      )}
    </React.Fragment>
  );
};

export default CustomerOutstanding;
