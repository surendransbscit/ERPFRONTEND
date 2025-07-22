import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Block } from "../../components/Component";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { Card } from "reactstrap";
import { getModeWiseCollectionReport } from "../../redux/thunks/reports";
import moment from "moment";
import { useForm } from "react-hook-form";
import { getAllScheme } from "../../redux/thunks/scheme";
import { Styles, Table } from "../../components/sds-table/ReactTable";
import ReportFilterComponent from "./ReportFilterComponent";
import { useBranches, useSchemes } from "../../components/filters/filterHooks";

const ModeWiseCollection = () => {
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
  const { schemes } = useSchemes();
  const { branches } = useBranches();

  const [page, SetPage] = useState(1);
  const paginate = (pageNumber) => SetPage(pageNumber);

  const { modeWiseCollectionReportList, isLoading: loadingData } = useSelector((state) => state.reportReducer);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    dispatch(getAllScheme());
    dispatch(
      getModeWiseCollectionReport({
        from_date: moment(startDate).format("YYYY-MM-DD"),
        to_date: moment(endDate).format("YYYY-MM-DD"),
        id_scheme: selectedScheme,
        id_branch: "",
      })
    );
  }, [dispatch, startDate, endDate, selectedScheme]);

  const getData = async () => {
    try {
      await dispatch(
        getModeWiseCollectionReport({
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
      }}
    />
  );

  const columns = modeWiseCollectionReportList?.columns?.map((col, index) => {
    if (col.selector === "sno") {
      return { name: col.name, selector: (row) => index + 1, sortable: false };
    }
    return { name: col.name, selector: (row) => row[col.selector], sortable: false };
  });

  return (
    <React.Fragment>
      <Head title={pagePermission?.title ? pagePermission?.title : "Mode Wise Collection Report"}></Head>
      {pagePermission?.view && (
        <Content>
          <Block size="lg">
            <Card className="card-bordered card-preview">
              <Styles>
                <Table
                  columns={modeWiseCollectionReportList?.columns ? modeWiseCollectionReportList?.columns : []}
                  data={modeWiseCollectionReportList?.rows ? modeWiseCollectionReportList?.rows : []}
                  totalPages={modeWiseCollectionReportList?.total_pages}
                  currentPage={page}
                  paginate={paginate}
                  showPagination={true}
                  isGrouping={false}
                  pageTitle={pagePermission?.title ? pagePermission?.title : "Mode Wise Collection Report"}
                  FilterComponent={FilterComponent}
                  groupingColumns={[]}
                />
              </Styles>
            </Card>
          </Block>
        </Content>
      )}
    </React.Fragment>
  );
};

export default ModeWiseCollection;
