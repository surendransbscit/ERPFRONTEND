import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import DatePicker from "react-datepicker";
import { Block, Col, DropdownInputField, Icon, ReactDataTable, Row } from "../../components/Component";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { Button, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { getUnpaidReport } from "../../redux/thunks/reports";
import moment from "moment";
import { useForm } from "react-hook-form";
import { getAllScheme } from "../../redux/thunks/scheme";

const UnpaidReport = () => {
  const { register } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const pathName = location?.pathname;
  const [fromDate, SetFromDate] = useState(new Date());
  const [toDate, SetToDate] = useState(new Date());
  const [scheme, SetScheme] = useState("");

  const { unpaidReportList, isLoading: loadingData } = useSelector((state) => state.reportReducer);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    dispatch(getAllScheme());
    dispatch(
      getUnpaidReport({
        from_date: moment(fromDate).format("YYYY-MM-DD"),
        to_date: moment(toDate).format("YYYY-MM-DD"),
        id_scheme: scheme,
      })
    );
  }, [dispatch, fromDate, toDate, scheme]);

  const { schemeList } = useSelector((state) => state.schemesReducer);

  const schemeOptions = schemeList?.rows?.map((obj) => {
    const container = {};
    container.label = obj.name;
    container.value = obj.scheme_id;
    return container;
  });

  const getData = async () => {
    try {
      await dispatch(
        getUnpaidReport({
          from_date: moment(fromDate).format("YYYY-MM-DD"),
          to_date: moment(toDate).format("YYYY-MM-DD"),
          id_scheme: scheme,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const FilterComponent = () => {
    return (
      <div className="card-inner">
        <div className="card-tools">
          <ul className="btn-toolbar">
            <li>
              <UncontrolledDropdown>
                <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                  <div className="dot dot-primary"></div>
                  <Icon name="filter-alt"></Icon>
                </DropdownToggle>
                <DropdownMenu end className="filter-wg dropdown-menu-xl" style={{ overflowY: "scroll" }}>
                  <div className="dropdown-head">
                    <span className="sub-title dropdown-title">Advanced Filter</span>
                  </div>
                  <div className="dropdown-body dropdown-body-rg">
                    <Row className="gx-6 gy-4">
                      <Col size="12">
                        <div className="form-control-wrap">
                          <label className="overline-title overline-title-alt">From</label>
                          <span style={{ zIndex: "999" }}>
                            <DatePicker
                              dateFormat="dd/MM/yyyy"
                              selected={fromDate}
                              onChange={(date) => SetFromDate(date)}
                              style={{ display: "inline-flex" }}
                              className=" form-control date-picker"
                            />
                          </span>
                        </div>
                      </Col>
                      <Col size="12">
                        <div className="form-control-wrap">
                          <label className="overline-title overline-title-alt">To</label>
                          <span style={{ zIndex: "999" }}>
                            <DatePicker
                              dateFormat="dd/MM/yyyy"
                              selected={toDate}
                              onChange={(date) => SetToDate(date)}
                              className=" form-control date-picker"
                            />
                          </span>
                        </div>
                      </Col>
                      <Col size="12">
                        <div className="form-group">
                          <DropdownInputField
                            register={register}
                            isRequired={false}
                            id={"scheme"}
                            placeholder="Select scheme"
                            optionLabel="Select scheme"
                            value={scheme}
                            SetValue={SetScheme}
                            selectOptions={schemeOptions}
                          />
                        </div>
                      </Col>

                      <Col size="12">
                        <div className="form-group">
                          <Button type="button" onClick={() => getData()} className="btn btn-secondary">
                            Filter
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </DropdownMenu>
              </UncontrolledDropdown>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const columns = unpaidReportList?.columns?.map((col, index) => {
    if (col.selector === "sno") {
      return { name: col.name, selector: (row) => index + 1, sortable: false };
    }
    return { name: col.name, selector: (row) => row[col.selector], sortable: false };
  });
  return (
    <React.Fragment>
      <Head title={pagePermission?.title ? pagePermission?.title : "Unpaid Reports"}></Head>
      {pagePermission?.view && (
        <Content>
          <Block size="lg">
            <ReactDataTable
              title={pagePermission?.title ? pagePermission?.title : "Unpaid Reports"}
              columns={unpaidReportList?.columns ? columns : []}
              data={unpaidReportList?.rows ? unpaidReportList?.rows : []}
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
      )}
    </React.Fragment>
  );
};

export default UnpaidReport;
