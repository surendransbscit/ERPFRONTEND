import React from "react";
import { Col, Icon } from "../../components/Component";
import { Button, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
import { BranchDropdown, SchemeDropdown } from "../../components/filters/retailFilters";
import DatePicker from "react-datepicker";

const ReportTableHeader = ({ children }) => {
  const {
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
  } = children;

  const setToday = () => {
    const today = new Date();
    SetStartDate(today);
    SetEndDate(today);
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    SetStartDate(yesterday);
    SetEndDate(yesterday);
  };

  const setLastWeek = () => {
    const today = new Date();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 7);
    SetStartDate(lastWeekStart);
    SetEndDate(today);
  };

  const setLastMonth = () => {
    const today = new Date();
    const lastMonthStart = new Date(today);
    lastMonthStart.setMonth(today.getMonth() - 1);
    SetStartDate(lastMonthStart);
    SetEndDate(today);
  };

  return (
  
        <><li className="btn-toolbar-sep"></li><li>
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
                          <Col lg="12">
                              <div className="form-group">
                                  <SchemeDropdown
                                      register={register}
                                      id={"id_scheme"}
                                      schemes={schemes}
                                      selectedScheme={selectedScheme}
                                      onSchemeChange={SetSelectedSchene}
                                      isRequired={true}
                                      clearErrors={clearErrors}
                                      setValue={setValue}
                                      message={errors.id_scheme && "Scheme is Required"} />
                              </div>
                          </Col>

                          <Col className="mt-2" lg="12">
                              <div className="form-group">
                                  <BranchDropdown
                                      register={register}
                                      id={"id_branch"}
                                      branches={branches}
                                      selectedBranch={selectedBranch}
                                      onBranchChange={SetSelectedBranch}
                                      isRequired={true}
                                      clearErrors={clearErrors}
                                      setValue={setValue}
                                      message={errors.id_branch && "Branch is Required"} />
                              </div>
                          </Col>

                          <>
                              <Col lg="6">
                                  <div className="form-control-wrap">
                                      <label className="overline-title overline-title-alt">From</label>
                                      <span style={{ zIndex: "999" }}>
                                          <DatePicker
                                              dateFormat="dd/MM/yyyy"
                                              selected={startDate}
                                              onChange={(date) => SetStartDate(date)}
                                              style={{ display: "inline-flex" }}
                                              className=" form-control date-picker" />
                                      </span>
                                  </div>

                                  <div className="form-control-wrap">
                                      <label className="overline-title overline-title-alt">To</label>
                                      <span style={{ zIndex: "999" }}>
                                          <DatePicker
                                              dateFormat="dd/MM/yyyy"
                                              selected={endDate}
                                              onChange={(date) => SetEndDate(date)}
                                              className=" form-control date-picker" />
                                      </span>
                                  </div>
                              </Col>
                              <Col size="6" className="">
                                  <div className="form-group">
                                      <Button className="m-1" color="primary" onClick={setToday}>
                                          Today
                                      </Button>
                                      <Button className="m-1" color="primary" onClick={setYesterday}>
                                          Yesterday
                                      </Button>
                                      <Button className="m-1" color="primary" onClick={setLastWeek}>
                                          Last Week
                                      </Button>
                                      <Button className="m-1" color="primary" onClick={setLastMonth}>
                                          Last Month
                                      </Button>
                                  </div>
                              </Col>
                          </>

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
      </li></>
   
  );
};

export default ReportTableHeader;
