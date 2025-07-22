import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import { NumberInputField, TextInputField } from "../Component";
import Select from "react-select";
import {
  AccountAddedThroughDropdown,
  BranchDropdown,
  GroupByOptionsDropdown,
  ProductDropdown,
  SchemeDropdown,
  SelectDropdown,
  YearDropdown,
  SectionDropdown,
  MetalDropdown,
  DesignDropdown,
  SubDesignDropdown,
  PurityDropdown,
  SupplierDropdown,
  LotDropdown,
  ActiveEmployeeDropdown,
} from "../filters/retailFilters";
import BranchDropdownMulti from "../common/dropdown/BranchDropdownMulti";
import { DateRangePickerInput } from "../filters/dateRangeFilter";
import {
  useActiveLot,
  useDesigns,
  useMetals,
  useSections,
  useProducts,
  usePurities,
  useSchemes,
  useSubDesigns,
  useSupplierFilter,
  useCounters,
  useEmployeeDropdown
} from "../filters/filterHooks";
import { Typeahead } from "react-bootstrap-typeahead";

const FilterSidebarWithoutTabs = ({ toggle, children }) => {
  const {
    register,
    selectedScheme,
    SetSelectedSchene,
    clearErrors,
    setValue,
    errors,
    branches,
    selectedBranch,
    SetSelectedBranch,
    tagCode,
    setTagCode,
    filteredDesign,
    setFilteredDesign,
    filteredSubDesign,
    setFilteredSubDesign,
    filteredPurity,
    setFilteredPurity,
    filteredSupplier,
    setFilteredSupplier,
    filterLot,
    setFilterLot,
    filterMcType,
    setFilterMcType,
    filterMcValue,
    setFilterMcValue,
    filterVaPercent,
    setFilterVaPercent,
    filterVaFrom,
    setFilterVaFrom,
    filterVaTo,
    setFilterVaTo,
    filterGwtFrom,
    setFilterGwtFrom,
    filterGwtTo,
    setFilterGwtTo,
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
    is_year_filter_req,
    is_added_through_filter_req,
    is_finyear_filter_req,
    selectedYear,
    SetSelectedYear,
    selectedAddedThrough,
    SetSelectedAddedThrough,
    customer,
    SetCustomer,
    customerSearch,
    SetCustomerSearch,
    inputType,
    setInputType,
    isSearching,
    setIsSearching,
    searchCustomerList,
    filterEmployee, 
    setFilterEmployee,
    lotType,
    setLotType,
    ...props
  } = children;

  const { accessBranches } = useSelector((state) => state.coreCompReducer);
  const { designs } = useDesigns(props?.isDeignFilterReq);
  const { subDesigns } = useSubDesigns(props?.isSubDeignFilterReq);
  const { purities } = usePurities(props?.isPurityFilterReq);
  const { supplier } = useSupplierFilter(props?.isSupplierFilterReq);
  const { lot } = useActiveLot(props?.isLotFilterReq);
  const { schemes } = useSchemes(is_scheme_filter_req);
  const { metals } = useMetals(props?.isMetalFilterReq);
  const { products } = useProducts(props?.isProductFilterReq);
  const { sections } = useSections(props?.isSectionFilterReq);
  const { counters } = useCounters(props?.isCounterFilterReq);
  const { employees } = useEmployeeDropdown(props?.isEmployeeFilterReq);
  const { activeEmployeeDropdown } = useSelector((state) => state.employeeReducer);


  const calcTypeOptions = [
    { label: "Per Gram", value: 1, isDefault: true },
    { label: "Per Piece", value: 2 },
  ];


  const lotTypeOptions = [
    { label: "All", value: 0, isDefault: true },
    { label: "Normal", value: 1 },
    { label: "Sales Return", value: 2 },
    { label: "Partly Sale", value: 3 },
    { label: "Old Metal", value: 4 },
    { label: "Lot Merge", value: 5 },
  ];

  const currentYear = new Date().getFullYear();
  const pastYears = Array.from({ length: 40 }, (v, i) => currentYear - i);

  const yearData = pastYears?.map((obj) => {
    const container = {};
    container.label = obj;
    container.value = obj;
    return container;
  });

  const [selectedDates, setSelectedDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
    SetStartDate(selectedDates?.startDate);
    SetEndDate(selectedDates?.endDate);
    // console.log("Selected dates:", dates);
  };

  let branchData = accessBranches;

  const typeOption = [
    { value: 1, label: "Issue" },
    { value: 2, label: "Receipt" },
  ];

  const processTypeOption = [
    { value: 1, label: "Melting" },
    { value: 2, label: "Testing" },
    { value: 3, label: "Refining" },
  ];

  const invoiceTypeOption = [
    { value: 1, label: "Melting" },
    { value: 2, label: "Testing" },
    { value: 3, label: "Refining" },
  ];
  return (
    <>
      {" "}
      <Row className="g-gs" style={{ flexGrow: 1 }}>
        {is_date_filter_req && (
          <>
            {/* <Col lg="6">
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
                            </Col> */}
            <Col lg="12">
              <div className="form-group">
                <label className="form-label" htmlFor="dateranges">
                  Filter Date
                </label>
                <DateRangePickerInput
                  startDate={selectedDates?.startDate}
                  endDate={selectedDates?.endDate}
                  onChange={handleDateChange}
                />
              </div>
            </Col>
          </>
        )}
        {is_group_by_req && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="groupByVal">
                Group By
              </label>
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
        {is_year_filter_req && (
          <Col className="mt-2" lg="6">
            <div className="relative z-50 overflow visible">
              <label className="form-label" htmlFor="year_filter">
                Select Year
              </label>
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
                className="absolute w-full"
              />
            </div>
          </Col>
        )}

        {props?.isBranchFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="branch">
                Select Branch
              </label>
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
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="from_branch">
                Select From Branch
              </label>
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
                message={errors?.from_branch && "Branch is Required"}
                valueField={"id_branch"}
                labelField={"name"}
              />
            </div>
          </Col>
        )}
        {props?.isBranchFromToFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="toBranch">
                Select To Branch
              </label>
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
        {is_multi_branch_filter_req && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="id_branch">
                Select Branch
              </label>
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
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="id_branch">
                Select Branch
              </label>
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

        {is_scheme_filter_req && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="id_scheme">
                Select Scheme
              </label>
              <SchemeDropdown
                register={register}
                id={"id_scheme"}
                schemes={schemes}
                selectedScheme={selectedScheme}
                onSchemeChange={SetSelectedSchene}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors?.id_scheme && "Scheme is Required"}
              />
            </div>
          </Col>
        )}
        {is_added_through_filter_req && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="added_through_filter">
                Added Through
              </label>
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
        {props?.isEmployeeFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="employeeFilter">
                Select Employee
              </label>
              <ActiveEmployeeDropdown
                register={register}
                id={"employee"}
                selectedEmployee={filterEmployee}
                onEmployeeChange={setFilterEmployee}
                isRequired={false}
                options={activeEmployeeDropdown}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors.employee && "Employee is Required"}
                // classNamePrefix="custom-select"
                placeholder={"Employee"}
              />
            </div>
          </Col>
        )}
        {props?.isCounterFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="from_branch">
                Select Counter
              </label>
              <SelectDropdown
                register={register}
                id={"counter"}
                data={counters}
                selectedValue={props?.counterId}
                onChangeEvent={props?.setCounterId}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                placeholder={"Select Counter"}
                message={errors?.counter && "Counter is Required"}
                valueField={"id_counter"}
                labelField={"counter_name"}
              />
            </div>
          </Col>
        )}
        {props?.isProcessFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="from_branch">
                Select Process
              </label>
              <SelectDropdown
                register={register}
                id={"process"}
                data={processTypeOption}
                selectedValue={props?.processId}
                onChangeEvent={props?.setProcessId}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                placeholder={"Select Process"}
                message={errors?.process && "Process is Required"}
                valueField={"value"}
                labelField={"label"}
              />
            </div>
          </Col>
        )}
        {props?.isOpionalFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="from_branch">
                Select Type
              </label>
              <SelectDropdown
                register={register}
                id={"optionalType"}
                data={props.optionalType}
                selectedValue={props?.optionalId}
                onChangeEvent={props?.SetOptionalId}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                placeholder={"Select Type"}
                message={errors?.process && "Process is Required"}
                valueField={"value"}
                labelField={"label"}
              />
            </div>
          </Col>
        )}
        {props?.isIssueReciptFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="from_branch">
                Select Type
              </label>
              <SelectDropdown
                register={register}
                id={"issueReciptType"}
                data={typeOption}
                selectedValue={props?.issueReciptType}
                onChangeEvent={props?.setIssueReciptType}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                placeholder={"Select Type"}
                message={errors?.issueReciptType && "Type is Required"}
                valueField={"value"}
                labelField={"label"}
              />
            </div>
          </Col>
        )}
        {props?.isStockTypeFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="from_branch">
                Select Stock Type
              </label>
              <SelectDropdown
                register={register}
                id={"stockType"}
                data={props?.stockTypeOption}
                selectedValue={props?.stockType}
                onChangeEvent={props?.setStockType}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                placeholder={"Select Stock Type"}
                message={errors?.stockType && "Stock Type is Required"}
                valueField={"value"}
                labelField={"label"}
              />
            </div>
          </Col>
        )}

        {props?.isProductFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="filterProduct">
                Select Product
              </label>
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
                message={errors?.filterProduct && "Product is Required"}
              />
            </div>
          </Col>
        )}
        {props?.isDeignFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="selectedDesign">
                Design
              </label>
              <DesignDropdown
                register={register}
                id={"selectedDesign"}
                designs={designs}
                products={products}
                selectedProduct={filteredProducts}
                selectedDesign={filteredDesign}
                onDesignChange={(value) => {
                  setFilteredDesign(value);
                }}
                isRequired={false}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors?.selectedDesign && "Design is Required"}
              />
            </div>
          </Col>
        )}

        {props?.isSubDeignFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="selectedSubDesign">
                S.Design
              </label>
              <SubDesignDropdown
                register={register}
                id={"selectedSubDesign"}
                subDesigns={subDesigns}
                products={products}
                designs={designs}
                selectedProduct={filteredProducts}
                selectedDesign={filteredDesign}
                selectedSubDesign={filteredSubDesign}
                onSubDesignChange={(value) => {
                  setFilteredSubDesign(value);
                }}
                isRequired={false}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors.selectedSubDesign && "Sub Design is Required"}
              />
            </div>
          </Col>
        )}

        {props?.isPurityFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="selectedPurity">
                Purity
              </label>
              <PurityDropdown
                register={register}
                id={"selectedPurity"}
                purities={purities}
                onPurityChange={(value) => {
                  setFilteredPurity(value);
                }}
                selectedPurity={filteredPurity}
                isRequired={false}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors.selectedPurity && "Purity is Required"}
              />
            </div>
          </Col>
        )}

        {props?.isSupplierFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="idSupplier">
                Supplier
              </label>
              <SupplierDropdown
                register={register}
                id={"idSupplier"}
                supplier={supplier}
                selectedSupplier={filteredSupplier}
                onSupplierChange={(value) => {
                  setFilteredSupplier(value);
                }}
                isRequired={false}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors?.idSupplier && "Supplier is Required"}
              />
            </div>
          </Col>
        )}

        {props?.isSectionFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="filterSection">
                Select Section
              </label>
              <SectionDropdown
                register={register}
                id={"filterSection"}
                sections={sections}
                sectionOptions={sections}
                selectedSection={props?.filterSection}
                onSectionChange={(value) => {
                  props?.setFilteredSection(value);
                }}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors?.filterSection && "Section is Required"}
              />
            </div>
          </Col>
        )}
        {props?.isMetalFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="filterProduct">
                Select Metal
              </label>
              <MetalDropdown
                register={register}
                id={"filterMetal"}
                metals={metals}
                selectedMetal={props?.filterMetal}
                onMetalChange={(value) => {
                  props?.setFilteredMetal(value);
                }}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors?.filterMetal && "Metal is Required"}
              />
            </div>
          </Col>
        )}

        {props?.StockTransferFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="TransferType">
                Transfer Type
              </label>
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

        {props?.isVoucherIssueStatusFilter && (
          <Col className="mt-2" lg="12">
            <div className="form-group">
              <label className="form-label" htmlFor="filterVoucherIssueType">
                Voucher Type
              </label>
              <SelectDropdown
                register={register}
                id={"filterVoucherIssueType"}
                data={[
                  { value: 1, label: "Pending" },
                  { value: 2, label: "Redeemed" },
                ]}
                selectedValue={props?.filterVoucherIssueType}
                onChangeEvent={props?.setFilterVoucherIssueType}
                isRequired={false}
                clearErrors={clearErrors}
                setValue={setValue}
                placeholder={"Select Voucher Type"}
                message={
                  errors.filterVoucherIssueType && "Voucher type is Required"
                }
                valueField={"value"}
                labelField={"label"}
              />
            </div>
          </Col>
        )}

        {props?.isBankFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="TransferType">
                Bank
              </label>
              <SelectDropdown
                register={register}
                id={"selectBank"}
                data={props?.banks}
                selectedValue={props?.bank}
                onChangeEvent={(value) => {
                  props?.setBank(value);
                  clearErrors("selectBank");
                }}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors?.selectBank && "Bank is Required"}
                valueField="pk_id"
                labelField="bank_name"
              />
            </div>
          </Col>
        )}
        {/* {props?.isSupplierFilterReq && (
                          <Col className="mt-2" lg="12">
                            <div className="form-group">
                              <label className="form-label" htmlFor="stockTransferType">
                                Supplier
                              </label>
                              <SelectDropdown
                                register={register}
                                id={"selectSupplier"}
                                data={props?.supplier}
                                selectedValue={props?.selectedSupplier}
                                onChangeEvent={props?.SetSelectedSupplier}
                                isRequired={false}
                                clearErrors={clearErrors}
                                setValue={setValue}
                                placeholder={"Select Supplier"}
                                message={
                                  errors?.selectedSupplier && "Supplier is Required"
                                }
                                valueField={"id_supplier"}
                                labelField={"supplier_name"}
                              />
                            </div>
                          </Col>
                        )} */}

        {props?.isReportTypeReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="filterProduct">
                Select Report Type
              </label>
              <SelectDropdown
                register={register}
                id={"filterReportType"}
                data={props?.reportTypeOption}
                selectedValue={props?.reportType}
                onChangeEvent={(value) => {
                  props?.setReportType(value);
                }}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors?.filterReportType && "Report Type is Required"}
              />
            </div>
          </Col>
        )}
        {props?.isReportGroupByReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="filterProduct">
                Select Group By
              </label>
              <SelectDropdown
                register={register}
                id={"filterGroupBy"}
                data={props?.groupByOption}
                selectedValue={props?.groupBy}
                onChangeEvent={(value) => {
                  props?.setGroupBy(value);
                }}
                isRequired={true}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors?.filterGroupBy && "Group By is Required"}
              />
            </div>
          </Col>
        )}
        {props?.isTagCodeFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="tagCode">
                Tag Code
              </label>
              <TextInputField
                register={register}
                placeholder="Tag Code"
                id={"tagCode"}
                value={tagCode}
                isRequired={false}
                type={"text"}
                setValue={setValue}
                SetValue={(value) => {
                  setTagCode(value);
                }}
                message={errors.tagCode && errors.tagCode.message}
              />
            </div>
          </Col>
        )}

        {props?.isLotFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="lotId">
                Lot No
              </label>
              <LotDropdown
                register={register}
                id={"lotId"}
                lot={lot}
                selectedLot={filterLot}
                onLotChange={(value) => {
                  setFilterLot(value);
                }}
                isRequired={false}
                clearErrors={clearErrors}
                setValue={setValue}
                message={errors.lotId && "Lot is Required"}
              />
            </div>
          </Col>
        )}

        {props?.isMcTypeFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="mcType">
                MC type
              </label>
              <Select
                value={
                  calcTypeOptions?.find(
                    (option) => option.value == filterMcType
                  ) || null
                }
                options={calcTypeOptions}
                placeholder="Select Mc Type"
                id={"mcType"}
                onChange={(value) => setFilterMcType(value?.value)}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                    fontSize: "12px",
                  }),
                }}
              />
            </div>
          </Col>
        )}

        {props?.isMcValueFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="mc">
                MC
              </label>
              <NumberInputField
                register={register}
                placeholder="Mc"
                id={"mc"}
                value={filterMcValue}
                isRequired={false}
                min={0}
                type={"number"}
                setValue={setValue}
                handleKeyDownEvents={true}
                handleDecimalDigits={true}
                decimalValues={3}
                SetValue={(value) => {
                  setFilterMcValue(value);
                  clearErrors("mc");
                }}
                minError={"Mc should less than or equal to 0"}
                maxError={"Mc greater than or equal to 0"}
                reqValueError={"Mc is Required"}
                message={errors.mc && errors.mc.message}
              />
            </div>
          </Col>
        )}

        {props?.isVaPercentFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="site-name">
                VA(%)
              </label>
              <NumberInputField
                placeholder="Wastage"
                id={"wastage"}
                value={filterVaPercent}
                isRequired={false}
                min={0}
                type={"number"}
                setValue={setValue}
                handleKeyDownEvents={true}
                handleDecimalDigits={true}
                decimalValues={2}
                SetValue={(value) => {
                  setFilterVaPercent(value);
                  clearErrors("wastage");
                }}
                minError={"wastage should less than or equal to 0"}
                maxError={"wastage greater than or equal to 0"}
                reqValueError={"wastage is Required"}
                message={errors.wastage && errors.wastage.message}
                register={register}
              />
            </div>
          </Col>
        )}

        {props?.isVaFromToFilterReq && (
          <>
            <Col className="mt-2" lg="6">
              <div className="form-group">
                <label className="form-label" htmlFor="vaWeightFrom">
                  VA From
                </label>
                <NumberInputField
                  register={register}
                  placeholder="weight Weight"
                  id={"vaWeightFrom"}
                  value={filterVaFrom}
                  isRequired={false}
                  min={0}
                  type={"number"}
                  setValue={setValue}
                  handleKeyDownEvents={true}
                  handleDecimalDigits={true}
                  decimalValues={3}
                  SetValue={(value) => {
                    setFilterVaFrom(value);
                    clearErrors("vaWeightFrom");
                  }}
                  minError={"Va weight should less than or equal to 0"}
                  maxError={"Va Weight greater than or equal to 0"}
                  reqValueError={"Va weight is Required"}
                  message={errors.vaWeightFrom && errors.vaWeightFrom.message}
                />
              </div>
            </Col>
            <Col className="mt-2" lg="6">
              <div className="form-group">
                <label className="form-label" htmlFor="vaWeightTo">
                  VA To
                </label>
                <NumberInputField
                  register={register}
                  placeholder="Wastage wEIGHT"
                  id={"vaWeightTo"}
                  value={filterVaTo}
                  isRequired={false}
                  min={0}
                  type={"number"}
                  setValue={setValue}
                  handleKeyDownEvents={true}
                  handleDecimalDigits={true}
                  decimalValues={3}
                  SetValue={(value) => {
                    setFilterVaTo(value);
                    clearErrors("vaWeightTo");
                  }}
                  minError={"Va weight should less than or equal to 0"}
                  maxError={"Va Weight greater than or equal to 0"}
                  reqValueError={"Va weight is Required"}
                  message={errors.vaWeightTo && errors.vaWeightTo.message}
                />
              </div>
            </Col>
          </>
        )}

        {props?.isGwtFromToFilterReq && (
          <>
            <Col className="mt-2" lg="6">
              <div className="form-group">
                <label className="form-label" htmlFor="grossWeightFrom">
                  Gwt From
                </label>
                <NumberInputField
                  register={register}
                  placeholder="Gross weight From"
                  id={"grossWeightFrom"}
                  value={filterGwtFrom}
                  isRequired={false}
                  min={0}
                  type={"number"}
                  setValue={setValue}
                  handleKeyDownEvents={true}
                  handleDecimalDigits={true}
                  decimalValues={3}
                  SetValue={(value) => {
                    setFilterGwtFrom(value);
                    clearErrors("grossWeightFrom");
                  }}
                  minError={"Gross weight should less than or equal to 0"}
                  maxError={"Gross Weight greater than or equal to 0"}
                  reqValueError={"Gross weight is Required"}
                  message={
                    errors?.grossWeightFrom && errors?.grossWeightFrom?.message
                  }
                />
              </div>
            </Col>
            <Col className="mt-2" lg="6">
              <div className="form-group">
                <label className="form-label" htmlFor="grossWeightTo">
                  Gwt To
                </label>
                <NumberInputField
                  register={register}
                  placeholder="Gross weight To"
                  id={"grossWeightTo"}
                  value={filterGwtTo}
                  isRequired={false}
                  min={0}
                  type={"number"}
                  setValue={setValue}
                  handleKeyDownEvents={true}
                  handleDecimalDigits={true}
                  decimalValues={3}
                  SetValue={(value) => {
                    setFilterGwtTo(value);
                    clearErrors("grossWeightTo");
                  }}
                  minError={"Gross weight should less than or equal to 0"}
                  maxError={"Gross Weight greater than or equal to 0"}
                  reqValueError={"Gross weight is Required"}
                  message={
                    errors?.grossWeightTo && errors.grossWeightTo.message
                  }
                />
              </div>
            </Col>
          </>
        )}

        {props?.isLotTypeFilterReq && (
          <Col className="mt-2" lg="6">
            <div className="form-group">
              <label className="form-label" htmlFor="mcType">
                Lot type
              </label>
              <Select
                value={
                  lotTypeOptions?.find(
                    (option) => option.value == lotType
                  ) || null
                }
                options={lotTypeOptions}
                placeholder="Select Type"
                id={"lotType"}
                onChange={(value) => setLotType(value?.value)}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                    fontSize: "12px",
                  }),
                }}
              />
            </div>
          </Col>
        )}

        {props?.isCustomerFilterReq && (
          <>
            <Col className="mt-2" lg="6">
              <div className="form-group">
                <label className="form-label" htmlFor="customerSearch">
                  Customer
                </label>
                <Typeahead
                  id="customerSearch"
                  labelKey="label"
                  onChange={(e) => {
                    if (e?.length > 0) {
                      SetCustomer(e[0]?.value);
                      SetCustomerSearch(e);
                    } else {
                      SetCustomer(null);
                      SetCustomerSearch([]);
                      setInputType(null); // Reset input type when cleared
                    }
                  }}
                  options={searchCustomerList}
                  placeholder="Choose a customer..."
                  selected={customerSearch}
                  onInputChange={(text) => {
                    if (text?.length === 0) {
                      SetCustomerSearch([]);
                      setInputType(null);
                      return;
                    }

                    const firstChar = text.charAt(0);
                    if (!inputType) {
                      setInputType(/\d/.test(firstChar) ? "number" : "text");
                    }

                    if (inputType === "number" && /^\d*$/.test(text)) {
                      setIsSearching(text?.length >= 5);
                      SetCustomerSearch([{ label: text }]);
                    }
                    if (inputType === "text" && /^[a-zA-Z\s]*$/.test(text)) {
                      setIsSearching(text?.length > 0);
                      SetCustomerSearch([{ label: text }]);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (inputType === "number" && !/\d/.test(e.key)) {
                      if (
                        ![
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                        ].includes(e.key)
                      ) {
                        e.preventDefault(); // Prevent letters but allow backspace, delete, and arrows
                      }
                    }
                    if (inputType === "text" && /\d/.test(e.key)) {
                      e.preventDefault(); // Prevent typing numbers if inputType is text
                    }
                  }}
                />
              </div>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default FilterSidebarWithoutTabs;
