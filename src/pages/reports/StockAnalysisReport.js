import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import {
  Block,
  Col,
  Icon,
  PreviewCard,
  ReactDataTable,
  Row,
} from "../../components/Component";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { Button, Label } from "reactstrap";
import { useForm } from "react-hook-form";
import { SelectDropdown } from "../../components/filters/retailFilters";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { getStockAnalysisReport } from "../../redux/thunks/reports";

const StockAnalysisReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  let title = location?.state?.title;
  const pathName = location?.pathname;

  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();

  let stockAnalysisTypeOptions = [
    {
      label: "Age",
      value: 1,
    },
    {
      label: "Gross Wt",
      value: 2,
    },
    {
      label: "Net Wt",
      value: 3,
    },
    {
      label: "MRP Rate",
      value: 4,
    },
  ];

  // const filterValues = [
  //   { id_filter_value: 1, condition: "Less Than", value1: 0, value2: 0 },
  //   { id_filter_value: 2, condition: "Greater Than", value1: 0, value2: 0 },
  //   { id_filter_value: 3, condition: "Between", value1: 0, value2: 0 },
  // ];

  const { paymentStockAnalysisReport, isLoading: loadingData } = useSelector(
    (state) => state.reportReducer
  );
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  const [filterType, setFilterType] = useState("");

  const [stockAnalysisFilter, setStockAnalysisFilter] = useState([
    {
      id_filter_value: 1,
      condition: "Less Than",
      condition_value: "less_than",
      value1: 0,
      value2: 0,
    },
    {
      id_filter_value: 2,
      condition: "Greater Than",
      condition_value: "greather_than",
      value1: 0,
      value2: 0,
    },
    {
      id_filter_value: 3,
      condition: "Between",
      condition_value: "between",
      value1: 0,
      value2: 0,
    },
  ]);

  const columns = paymentStockAnalysisReport?.columns?.map((col, index) => {
    // if (col.accessor === "sno") {
    //   return {
    //     name: col.Header,
    //     selector: (row) => index + 1,
    //     sortable: false,
    //   };
    // }
    return {
      name: col.Header,
      selector: (row) => row[col.accessor],
      sortable: false,
    };
  });

  const editStockAnalysisList = ({ name, val, ids, ...params }) => {
    setStockAnalysisFilter((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id_filter_value === ids) {
          setValue(`${name + obj.id_filter_value}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const handleSearch = async () => {
    const filterDetails = stockAnalysisFilter?.map((obj) => {
      const container = {};
      container.condition = obj.condition_value;
      container.value1 = obj.value1;
      container.value2 = obj.value2;
      return container;
    });
    const postData = {
      filter_by: filterType,
      filter_details: filterDetails,
    };
    try {
      await dispatch(getStockAnalysisReport(postData));
    } catch (error) {
      console.log(error);
    }
  };

  const FilterComponent = () => {
    return <div className="card-inner"></div>;
  };

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  return (
    <React.Fragment>
      <Head
        title={pagePermission?.title ? pagePermission?.title : "Stock Analysis"}
      ></Head>
      {pagePermission?.view && (
        <Content>
          <PreviewCard className="h-100">
            <Row
              lg={12}
              className={"form-control-sm"}
              style={{ marginTop: "10px" }}
            >
              <Col md={5}>
                <ModifiedBreadcrumb />
              </Col>
              <Col md={2}></Col>
              <Col md={5} className="text-right flex">
                <Button
                  // disabled={isSearchingCustomer || isSearchingSupplier}
                  color="secondary"
                  size="md"
                  onClick={() => handleSearch()}
                >
                  {loadingData ? "Searching.." : "Search"}
                </Button>
              </Col>
            </Row>

            <div className="custom-grid">
              <Row lg={12}>
                <Col lg="3">
                  <Label htmlFor="filterType">Filter by</Label>
                  <div className="form-group">
                    <SelectDropdown
                      register={register}
                      id={"filterType"}
                      data={stockAnalysisTypeOptions}
                      selectedValue={filterType}
                      setValue={setValue}
                      clearErrors={clearErrors}
                      onChangeEvent={(value) => {
                        console.log(value);
                        setFilterType(value);
                      }}
                      placeholder={"Filter By"}
                      valueField={"value"}
                      labelField={"label"}
                    />
                  </div>
                </Col>
                <Col md={9}>
                  <div
                    className="table-responsive"
                    style={{ marginTop: "16px" }}
                  >
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Condition</th>
                          <th>Value 1</th>
                          <th>Value 2</th>
                          {/* <th>Actions</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {stockAnalysisFilter?.map((obj, index) => {
                          return (
                            <tr key={index}>
                              <td>{obj?.condition}</td>
                              <td>
                                <input
                                  {...register(`value1${obj.id_filter_value}`, {
                                    required: "Required",
                                  })}
                                  name="value1"
                                  placeholder="Value 1"
                                  className="form-control form-control-sm"
                                  type="text"
                                  value={obj?.value1}
                                  onChange={(e) =>
                                    editStockAnalysisList({
                                      ids: obj?.id_filter_value,
                                      name: e.target.name,
                                      val: e.target.value,
                                    })
                                  }
                                />
                                {errors?.[
                                  `value1` + `${String(obj.id_filter_value)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors?.[
                                          `value1` +
                                          `${String(obj.id_filter_value)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>
                              <td>
                                <input
                                  {...register(`value2${obj.id_filter_value}`, {
                                    required: "Required",
                                  })}
                                  name="value2"
                                  placeholder="value 2"
                                  className="form-control form-control-sm"
                                  type="text"
                                  value={obj?.value2}
                                  onChange={(e) =>
                                    editStockAnalysisList({
                                      ids: obj?.id_filter_value,
                                      name: e.target.name,
                                      val: e.target.value,
                                    })
                                  }
                                />
                                {errors?.[
                                  `value2` + `${String(obj.id_filter_value)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors?.[
                                          `value2` +
                                          `${String(obj.id_filter_value)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>
                              {/* 
                            <td>
                              <Button
                                color="primary"
                                size="sm"
                                className="btn-icon btn-white btn-dim"
                                onClick={() =>
                                  deleteStockAnalysisList(obj.id_stock_analysis)
                                }
                              >
                                <Icon name="trash-fill" />
                              </Button>
                              {index == stockAnalysis_list?.length - 1 && (
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() => addStockAnalysisList()}
                                >
                                  <Icon name="plus" />
                                </Button>
                              )}
                            </td> */}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="custom-grid" style={{ marginTop: "10px" }}>
              <Content>
                <Block size="lg">
                  <ReactDataTable
                    title={
                      pagePermission?.title
                        ? pagePermission?.title
                        : "Stock Analysis Report"
                    }
                    columns={paymentStockAnalysisReport?.columns ? columns : []}
                    data={
                      paymentStockAnalysisReport?.rows
                        ? paymentStockAnalysisReport?.rows
                        : []
                    }
                    selectableRows={false}
                    pagination={true}
                    FilterComponent={FilterComponent}
                    showFilter={true}
                    expandableRows
                    actions={true}
                    fixedHeader={true}
                  />
                </Block>
              </Content>
            </div>
          </PreviewCard>
        </Content>
      )}
    </React.Fragment>
  );
};

export default StockAnalysisReport;
