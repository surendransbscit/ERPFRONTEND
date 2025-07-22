import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, Row, Col, TabContent, TabPane, ButtonGroup } from "reactstrap";
import { Icon, PreviewCard } from "../Component";
import { useSelector } from "react-redux";
import classnames from "classnames";
import {
  AccountAddedThroughDropdown,
  BranchDropdown,
  GroupByOptionsDropdown,
  ProductDropdown,
  SchemeDropdown,
  SelectDropdown,
  YearDropdown,
} from "../filters/retailFilters";
import BranchDropdownMulti from "../common/dropdown/BranchDropdownMulti";
import DatePicker from "react-datepicker";

const FilterModal = ({ modal, toggle, children }) => {
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
  const [verticalTab, setVerticalTab] = useState("1");
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
    <Modal isOpen={modal} className="modal-dialog-centered text-center" size="lg">
      <ModalHeader
        tag="h6"
        className="bg-light"
        toggle={toggle}
        close={
          <button
            className="close"
            style={{
              position: "absolute",
              right: "1rem",
            }}
            onClick={toggle}
          >
            <Icon name="cross" />
          </button>
        }
      >
        <span style={{ fontSize: "small" }}>Filters</span>
      </ModalHeader>
      <ModalBody className="text-center ">
        <Row className="g-gs">
          <Col md={4}>
            <ul className="nav link-list-menu border border-light round m-0">
              <li>
                <a
                  href="#tab"
                  className={classnames({ active: verticalTab === "1" })}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setVerticalTab("1");
                  }}
                >
                  Personal
                </a>
              </li>
              <li>
                <a
                  href="#tab"
                  className={classnames({ active: verticalTab === "2" })}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setVerticalTab("2");
                  }}
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  href="#tab"
                  className={classnames({ active: verticalTab === "3" })}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setVerticalTab("3");
                  }}
                >
                  Notifications
                </a>
              </li>
              <li>
                <a
                  href="#tab"
                  className={classnames({ active: verticalTab === "4" })}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setVerticalTab("4");
                  }}
                >
                  Connect
                </a>
              </li>
            </ul>
          </Col>
          <Col md={8}>
            <TabContent activeTab={verticalTab}>
              <TabPane tabId="1">
                <Row>
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
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <p>
                  Culpa dolor voluptate do laboris laboris irure reprehenderit id incididunt duis pariatur mollit aute
                  magna pariatur consectetur. Eu veniam duis non ut dolor deserunt commodo et minim in quis laboris
                  ipsum velit id veniam. Quis ut consectetur adipisicing officia excepteur non sit. Ut et elit aliquip
                  labore Lorem enim eu. Ullamco mollit occaecat dolore ipsum id officia mollit qui esse anim eiusmod do
                  sint minim consectetur qui.
                </p>
                <p>
                  Cillum ad ut irure tempor velit nostrud occaecat ullamco aliqua anim Lorem sint. Veniam sint duis
                  incididunt do esse magna mollit excepteur laborum qui. Id id reprehenderit sit est eu aliqua occaecat
                  quis et velit excepteur laborum mollit dolore eiusmod. Ipsum dolor in occaecat commodo et voluptate
                  minim reprehenderit mollit pariatur. Deserunt non laborum enim et cillum eu deserunt excepteur ea
                  incid.
                </p>
              </TabPane>
              <TabPane tabId="3">
                <p>
                  Fugiat id quis dolor culpa eiusmod anim velit excepteur proident dolor aute qui magna. Ad proident
                  laboris ullamco esse anim Lorem Lorem veniam quis Lorem irure occaecat velit nostrud magna nulla.
                  Velit et et proident Lorem do ea tempor officia dolor. Reprehenderit Lorem aliquip labore est magna
                  commodo est ea veniam consectetur.
                </p>
                <p>
                  Cillum ad ut irure tempor velit nostrud occaecat ullamco aliqua anim Lorem sint. Veniam sint duis
                  incididunt do esse magna mollit excepteur laborum qui. Id id reprehenderit sit est eu aliqua occaecat
                  quis et velit excepteur laborum mollit dolore eiusmod. Ipsum dolor in occaecat commodo et voluptate
                  minim reprehenderit mollit pariatur. Deserunt non laborum enim et cillum eu deserunt excepteur ea
                  incid.
                </p>
              </TabPane>
              <TabPane tabId="4">
                <p>
                  Eu dolore ea ullamco dolore Lorem id cupidatat excepteur reprehenderit consectetur elit id dolor
                  proident in cupidatat officia. Voluptate excepteur commodo labore nisi cillum duis aliqua do. Aliqua
                  amet qui mollit consectetur nulla mollit velit aliqua veniam nisi id do Lorem deserunt amet. Culpa
                  ullamco sit adipisicing labore officia magna elit nisi in aute tempor commodo eiusmod.
                </p>
                <p>
                  Cillum ad ut irure tempor velit nostrud occaecat ullamco aliqua anim Lorem sint. Veniam sint duis
                  incididunt do esse magna mollit excepteur laborum qui. Id id reprehenderit sit est eu aliqua occaecat
                  quis et velit excepteur laborum mollit dolore eiusmod. Ipsum dolor in occaecat commodo et voluptate
                  minim reprehenderit mollit pariatur. Deserunt non laborum enim et cillum eu deserunt excepteur ea
                  incid.
                </p>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
        <Col size="12">
          <div className="form-group">
            <Button type="button" onClick={() => handleFilterClick()} className="btn btn-secondary">
              Filter
            </Button>
          </div>
        </Col>
      </ModalBody>
    </Modal>
  );
};

export default FilterModal;
