import React, { useState } from "react";
import { Col, Icon } from "../../components/Component";
import { Button, ButtonGroup, Dropdown, DropdownMenu, DropdownToggle, Row } from "reactstrap";
import {
  AccountAddedThroughDropdown,
  BranchDropdown,
  GroupByOptionsDropdown,
  ProductDropdown,
  SchemeDropdown,
  SelectDropdown,
  YearDropdown,
} from "../../components/filters/retailFilters";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import BranchDropdownMulti from "../../components/common/dropdown/BranchDropdownMulti";

const ReportFilterComponent = ({ children }) => {
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
    groupByVal,
    SetGroupByVal,
    is_branch_filter_req,
    is_scheme_filter_req,
    is_date_filter_req,
    groupByOptions,
    is_group_by_req,
    is_multi_branch_filter_req,
    filteredProducts,
    setFilteredProducts,
    products,
    is_year_filter_req,
    is_added_through_filter_req,
    selectedYear,
    SetSelectedYear,
    selectedAddedThrough,
    SetSelectedAddedThrough,
    ...props
  } = children;

  const { accessBranches } = useSelector((state) => state.coreCompReducer);

  const currentYear = new Date().getFullYear();
  const pastYears = Array.from({ length: 40 }, (v, i) => currentYear - i);

  const yearData = pastYears?.map((obj) => {
    const container = {};
    container.label = obj;
    container.value = obj;
    return container;
  });

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

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleFilterClick = () => {
    getData();
    closeDropdown();
  };

  let branchData = accessBranches;

  const stockTransferTypeData = [
    { label: "Tagged Item", value: 1 },
    { label: "Non Tag", value: 2 },
    { label: "Old Metal", value: 3 },
    { label: "Sales Return", value: 4 },
    { label: "Partly Sale", value: 5 },
  ];

  return (
    <>
      <li className="btn-toolbar-sep"></li>
      <li>
        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
          <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
            <div className="dot dot-primary"></div>
            Filters<Icon name="filter-alt"></Icon>
          </DropdownToggle>
          <DropdownMenu end className="filter-wg dropdown-menu-xl" style={{ overflowY: "scroll" }}>
            <div className="dropdown-head">
              <span className="sub-title dropdown-title">Advanced Filter</span>
            </div>
            <div className="dropdown-body dropdown-body-rg">
              <Row className="gx-6 gy-4">
                {is_group_by_req && (
                  <Col lg="12">
                    <div className="form-group">
                      <GroupByOptionsDropdown
                        register={register}
                        id={"groupByVal"}
                        groupByOpts={groupByOptions}
                        groupByVal={groupByVal}
                        onGroupByChange={SetGroupByVal}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.id_branch && "Group by is Required"}
                      />
                    </div>
                  </Col>
                )}
                {is_scheme_filter_req && (
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
                        message={errors.id_scheme && "Scheme is Required"}
                      />
                    </div>
                  </Col>
                )}
                {is_multi_branch_filter_req && (
                  <Col size="12">
                    <div className="form-group">
                      <BranchDropdownMulti
                        id={"id_branch"}
                        optionLabel={"Choose Branch..."}
                        register={register}
                        value={selectedBranch}
                        SetValue={SetSelectedBranch}
                      />
                    </div>
                  </Col>
                )}
                {is_branch_filter_req && (
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
                        message={errors?.id_branch && "Branch is Required"}
                      />
                    </div>
                  </Col>
                )}
                {is_year_filter_req && (
                  <Col className="mt-2" lg="12">
                    <div className="form-group">
                      <YearDropdown
                        register={register}
                        id={"year_filter"}
                        data={yearData}
                        selectedValue={selectedYear}
                        onChangeEvent={SetSelectedYear}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        placeholder={"Select Year"}
                        valueField={"year_filter"}
                        labelField={"Year"}
                      />
                    </div>
                  </Col>
                )}
                {is_added_through_filter_req && (
                  <Col className="mt-2" lg="12">
                    <div className="form-group">
                      <AccountAddedThroughDropdown
                        register={register}
                        id={"added_through_filter"}
                        selectedValue={selectedAddedThrough}
                        onChangeEvent={SetSelectedAddedThrough}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        placeholder={"Select"}
                        labelField={"added_through_filter"}
                      />
                    </div>
                  </Col>
                )}
                {props?.isBranchFilterReq && (
                  <Col className="mt-2" lg="12">
                    <div className="form-group">
                      <SelectDropdown
                        register={register}
                        id={"branch"}
                        data={branchData}
                        selectedValue={props?.branch}
                        onChangeEvent={props?.SetBranch}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        placeholder={"Select Branch"}
                        message={errors?.branch && "Branch is Required"}
                        valueField={"id_branch"}
                        labelField={"name"}
                      />
                    </div>
                  </Col>
                )}
                {props?.isBranchFromToFilterReq && (
                  <Col className="mt-2" lg="12">
                    <div className="form-group">
                      <SelectDropdown
                        register={register}
                        id={"from_branch"}
                        data={branchData}
                        selectedValue={props?.fromBranch}
                        onChangeEvent={props?.SetFromBranch}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        placeholder={"Select From Branch"}
                        message={errors.from_branch && "Branch is Required"}
                        valueField={"id_branch"}
                        labelField={"name"}
                      />
                    </div>
                  </Col>
                )}
                {props?.isProductFilterReq && (
                  <Col className="mt-2" lg="12">
                    <div className="form-group">
                      <ProductDropdown
                        register={register}
                        id={"filterProduct"}
                        products={products}
                        selectedProduct={filteredProducts}
                        onProductChange={(value) => {
                          setFilteredProducts(value);
                        }}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.filterProduct && "Product is Required"}
                      />
                    </div>
                  </Col>
                )}
                {props?.isBranchFromToFilterReq && (
                  <Col className="mt-2" lg="12">
                    <div className="form-group">
                      <SelectDropdown
                        register={register}
                        id={"toBranch"}
                        data={branchData}
                        selectedValue={props?.toBranch}
                        onChangeEvent={props?.SetToBranch}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        placeholder={"Select To Branch"}
                        message={errors.id_branch && "Branch is Required"}
                        valueField={"id_branch"}
                        labelField={"name"}
                      />
                    </div>
                  </Col>
                )}
                {props?.StockTransferFilterReq && (
                  <Col className="mt-2" lg="12">
                    <div className="form-group">
                      <SelectDropdown
                        register={register}
                        id={"TransferType"}
                        data={[
                          { value: 1, label: "Inward" },
                          { value: 2, label: "Outward" },
                        ]}
                        selectedValue={props?.transferType}
                        onChangeEvent={props?.SetTransferType}
                        isRequired={false}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        placeholder={"Select Transfer Type"}
                        message={errors.stockTransferType && "Branch is Required"}
                        valueField={"value"}
                        labelField={"label"}
                      />
                    </div>
                  </Col>
                )}

                {props?.StockTransferFilterReq && (
                  <Col className="mt-2" lg="12">
                    <div className="form-group">
                      <SelectDropdown
                        register={register}
                        id={"stockTransferType"}
                        data={stockTransferTypeData}
                        selectedValue={props?.stockTransferType}
                        onChangeEvent={props?.SetStockTransferType}
                        isRequired={false}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        placeholder={"Select Stock Transfer Item Type"}
                        message={errors.stockTransferType && "Branch is Required"}
                        valueField={"value"}
                        labelField={"label"}
                      />
                    </div>
                  </Col>
                )}

                {is_date_filter_req && (
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
                            className=" form-control date-picker"
                          />
                        </span>
                      </div>

                      <div className="form-control-wrap">
                        <label className="overline-title overline-title-alt">To</label>
                        <span style={{ zIndex: "999" }}>
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={endDate}
                            onChange={(date) => SetEndDate(date)}
                            className=" form-control date-picker"
                          />
                        </span>
                      </div>
                    </Col>
                    <Col size="6" className="">
                      <ButtonGroup size="sm" style={{ display: "block" }}>
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
                      </ButtonGroup>
                    </Col>
                  </>
                )}
                <Col size="12">
                  <div className="form-group">
                    <Button type="button" onClick={() => handleFilterClick()} className="btn btn-secondary">
                      Filter
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </DropdownMenu>
        </Dropdown>
      </li>
    </>
  );
};

export default ReportFilterComponent;
