import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Block } from "../../components/Component";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { Card } from "reactstrap";
import moment from "moment";
import { useForm } from "react-hook-form";
import { getAllScheme } from "../../redux/thunks/scheme";
import { Styles, Table } from "../../components/sds-table/ReactTable";
import ReportFilterComponent from "./ReportFilterComponent";
import { useBranches, useSchemes } from "../../components/filters/filterHooks";
import { matcherData } from "./reportReduxMatcher";
import FilterSidebar from "../../components/sidebar/FilterSidebar";

const ReportListing = () => {
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
  const [selectedScheme, SetSelectedSchene] = useState("");
  const [selectedBranch, SetSelectedBranch] = useState("");
  const [groupByVal, SetGroupByVal] = useState([]);
  const [groupByCols, SetGroupByCols] = useState([]);
  const { schemes } = useSchemes();
  const { branches } = useBranches();

  const [page, SetPage] = useState(1);
  const paginate = (pageNumber) => SetPage(pageNumber);

  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  const useDynamicSelector = (sliceName, key) => {
    return useSelector((state) => state[sliceName][key]);
  };

  const reduxData = matcherData?.find((element) => element?.url === pathName);
  const listingData = useDynamicSelector(reduxData.sliceName, reduxData.dataKey);
  const loadingData = useDynamicSelector(reduxData.sliceName, reduxData.loaderKey);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    dispatch(getAllScheme());
  }, [dispatch]);

  useEffect(() => {
    reduxData &&
      dispatch(
        reduxData?.action({
          from_date: moment(startDate).format("YYYY-MM-DD"),
          to_date: moment(endDate).format("YYYY-MM-DD"),
          id_scheme: selectedScheme,
          id_branch: selectedBranch,
        })
      );
  }, [dispatch]);

  useEffect(() => {
    let GroupCols = groupByVal?.map((obj) => {
      const container = obj.value;
      return container;
    });
    SetGroupByCols(GroupCols);
  }, [groupByVal]);

  const getData = async () => {
    try {
      await dispatch(
        reduxData?.action({
          from_date: moment(startDate).format("YYYY-MM-DD"),
          to_date: moment(endDate).format("YYYY-MM-DD"),
          id_scheme: selectedScheme,
          id_branch: selectedBranch,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

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
        is_group_by_req: true,
        is_branch_filter_req: listingData?.filters?.isBranchFilterReq,
        is_scheme_filter_req: listingData?.filters?.isSchemeFilterReq,
        is_date_filter_req: listingData?.filters?.isDateFilterReq,
      }}
    />
  );

  return (
    <React.Fragment>
      <Head title={pagePermission?.title ? pagePermission?.title : reduxData?.title}></Head>
      {pagePermission?.view && (
        <Content>
          <Block size="lg">
            <Card className="card-bordered card-preview">
              <Styles>
                <Table
                  columns={listingData?.columns ? listingData?.columns : []}
                  data={listingData?.rows ? listingData?.rows : []}
                  totalPages={listingData?.total_pages}
                  currentPage={page}
                  is_filter_req={listingData?.is_filter_req}
                  paginate={paginate}
                  toggleFilterModal={toggleFilterModal}
                  showPagination={true}
                  isTotalReq={true}
                  isGrouping={reduxData?.groupingColumns?.length > 0 ? true : false}
                  pageTitle={pagePermission?.title ? pagePermission?.title : reduxData?.title}
                  // FilterComponent={FilterComponent}
                  groupingColumns={reduxData?.groupingColumns}
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
              is_group_by_req: true,
              is_branch_filter_req: listingData?.filters?.isBranchFilterReq,
              is_scheme_filter_req: listingData?.filters?.isSchemeFilterReq,
              is_date_filter_req: listingData?.filters?.isDateFilterReq,
            }}
          />
        </Content>
      )}
    </React.Fragment>
  );
};

export default ReportListing;
