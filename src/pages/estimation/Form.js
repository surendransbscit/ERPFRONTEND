/* eslint-disable no-unused-expressions */
import React, { useEffect, useState, useRef } from "react";
import Content from "../../layout/content/Content";
import { useDispatch, useSelector } from "react-redux";
import {
  BlockTitle,
  Icon,
  PreviewCard,
  SaveButton,
} from "../../components/Component";
import {
  Button,
  Col,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";

import {
  ActiveEmployeeDropdown,
  BranchDropdown,
  MetalDropdown,
  SelectDropdown,
} from "../../components/filters/retailFilters";
import { useForm, FormProvider } from "react-hook-form";
import {
  NumberInputField,
  TextareaInputField,
  TextInputField,
} from "../../components/form-control/InputGroup";
import SalesForm from "../../components/common/salesForm/salesForm";
import useEstimationFormHandling from "./useEstimationFormHandling";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import PurchaseForm from "../../components/common/salesForm/purchaseForm";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  useBranches,
  useEmployeeDropdown,
  useMetals,
  useSupplierFilter,
} from "../../components/filters/filterHooks";
import { useNavigate, useLocation } from "react-router-dom";
import PreviewTable from "../../components/sds-table/PreviewTable";
import useSalesFormHandling from "../../components/common/hooks/useSalesFormHandling";
import Select from "react-select";
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import CustomerAutoComplete from "../../components/common/autoComplete/CustomerAutoComplete";
import DeleteModal from "../../components/modals/DeleteModal";
import ReturnForm from "../../components/common/salesForm/returnForm";
import { searchCustomer } from "../../redux/thunks/customer";
import CreateCustomerConfirmation from "../../components/modals/CreateCustomerConfirmation";
import { Typeahead } from "react-bootstrap-typeahead";
import { useHotkeys } from "react-hotkeys-hook";
import { isUndefined } from "../../components/common/calculations/ErpCalculations";
import EmployeeModal from "../../components/modals/EmployeeModal";
import SalesReturnForm from "../../components/common/salesForm/salesReturnForm";
import SalesEntryForm from "../../components/common/salesForm/salesEntryForm";
import "../../assets/css/estimation_form.css";
import { employee_id } from "../../redux/configs";
import TagSearchModal from "../../components/modals/TagSearchModal";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { getAllMetalPurityRate } from "../../redux/thunks/retailMaster";
import { getCurrentMetalRate } from "../../redux/thunks/retailMaster";
function EstimationForm(props) {
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [billTypeTab, setBillTypeTab] = useState("1");
  const { searchCustomerList } = useSelector((state) => state.customerReducer);
  const { activeDiamondRateList } = useSelector(
    (state) => state.diamondRateMasterReducer
  );
  const { isLoading } = useSelector((state) => state.estReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const [tagSearchModal, setExtraSearchModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tagsearch_toggle = () => {
    setExtraSearchModal(!tagSearchModal);
    setIsModalOpen(true);
  };

  const dispatch = useDispatch();

  const { branches } = useBranches();
  const { metals } = useMetals();
  const { employees } = useEmployeeDropdown();
  const { supplier } = useSupplierFilter();
  const { activeEmployeeDropdown } = useSelector(
    (state) => state.employeeReducer
  );
  const methods = useForm();
  const estFieldRef = useRef(null);
  const tagFieldRef = useRef(null);
  const branchRef = useRef(null);
  const receivedAmountRef = useRef(null);

  let estForOptions = [
    {
      label: "Customer",
      value: 1,
    },
    {
      label: "Branch",
      value: 2,
    },
  ];

  let partialSaleOptions = [
    {
      label: "Yes",
      value: 1,
    },
    {
      label: "No",
      value: 0,
    },
  ];

  const {
    add,
    id,
    idBranch,
    setIdBranch,
    itemType,
    isPartialSale,
    setIsPartialSale,
    customer,
    SetCustomer,
    customerSearch,
    SetCustomerSearch,
    columns,
    purchaseColumns,
    options,
    salesFormRef,
    purchaseFormRef,
    tagCode,
    setTagCode,
    handleInputChange,
    handleEdit,
    handlePurchaseEdit,
    handleAddPreview,
    handlePurchaseAddPreview,
    handleFormSubmit,
    handlePurchaseItem,
    handleTagSearch,
    handleItemTypeChange,
    salesItemData,
    purchaseItemData,
    returnItemData,
    formValues,
    purchaseFormValues,
    onClickSave,
    isSubmitted,
    totalTaxableAmount,
    totalSalesGrossWeight,
    totalSalesLessWeight,
    totalSalesNetWeight,
    cgst,
    sgst,
    igst,
    taxAmount,
    totalSalesAmount,
    totalPurchaseAmount,
    totalReturnAmount,
    totalBillAmount,
    totalDiscount,
    totalAmountReceived,
    deleteModal,
    toggle,
    handleSalesDelete,
    handlePurchaseDelete,
    deleteSaleItem,
    employee,
    SetEmployee,
    handleReturntData,
    toggleNavigateModal,
    isSearching,
    setIsSearching,
    createMobNum,
    SetCreateMobNum,
    navigateModal,
    SetNavigateModal,
    navigateCreateCustomer,
    customerSearchValue,
    customerId,
    estFor,
    setEstFor,
    customerDetails,
    setCustomerDetails,
    estNo,
    setEstNo,
    handleEstNoSearch,
    is_enquiry,
    setIs_enquiry,
    send_to_approval,
    setSend_to_approval,
    sendToApprovalDisabled,
    isMcVaDisable,
    setIsMcVaDisable,
    calculateDiscountAmount,
    allowRetailerBilling,
    allowMinSalesAmount,
    oldTagCode,
    setOldTagCode,
    handleSearch,
    handelChange,
    SetEmpItemData,
    empItemData,
    SetEmpItemId,
    empItemId,
    toggleEmployeeModal,
    employeeModal,
    SetEmployeeModal,
    handleSalesSubEmployee,
    finYearName,
    finYear,
    handleReturnData,
    handleReturnItemCost,
    handleSalesItemData,
    handleSalesAddItem,
    SetMetal,
    metal,
    inputType,
    setInputType,
    navigateModalOpened,
    setNavigateModalOpened,
    setTagSearchDetails,
    handleKeyDown,
  } = useEstimationFormHandling();

  useHotkeys("f1", (event) => {
    event.preventDefault();
    setBillTypeTab("1");
  },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
    });

  useHotkeys("f2", (event) => {
    event.preventDefault();
    setBillTypeTab("2");
  },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
    });
  useHotkeys("f3", (event) => {
    event.preventDefault();
    setBillTypeTab("3");
  },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
    });
  useHotkeys(
    "+",
    (event) => {
      event.preventDefault();
      if (billTypeTab === "1" && itemType != 0) {
        handleSalesAddItem();
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useHotkeys(
    "enter",
    (e) => {
      if (receivedAmountRef.current) {
        // Optionally check if it's focused
        if (document.activeElement === receivedAmountRef.current) {
          e.preventDefault();
          console.log("receivedAmountRef is focused!");

          calculateDiscountAmount();
        }
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
    }
  );

  useHotkeys(
    "insert",
    (event) => {
      if (idBranch == "" || idBranch == null) {
        toastfunc("Please select the Branch");
      } else {
        event.preventDefault();
        tagsearch_toggle();
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
    }
  );

  useEffect(() => {
    if (customerSearchValue && customerId) {
      SetCustomerSearch(customerSearchValue);
      SetCustomer(customerId);
    }
  }, [customerSearchValue, customerId]);

  
  useEffect(() => {
   if(customer){
        dispatch(getAllMetalPurityRate());
        dispatch(getCurrentMetalRate());
    }
  }, [customer]);

  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      customerSearch[0]?.label.length >= 5 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
  }, [isSearching, customerSearch, customer, dispatch, inputType]);

  // useEffect(() => {
  //   if (
  //     isSearching &&
  //     customerSearch?.length > 0 &&
  //     customerSearch[0]?.label.length >= 9 &&
  //     customer == null &&
  //     searchCustomerList?.length == 0
  //   ) {
  //     SetCreateMobNum(customerSearch[0]?.label);
  //     SetNavigateModal(true);
  //   }
  // }, [isSearching, customerSearch, customer, searchCustomerList]);

  useEffect(() => {
    if (customerSearch?.length > 0) {
      const inputValue = customerSearch[0]?.label;

      // Detect input type when user starts typing
      if (!inputType) {
        setInputType(/^\d/.test(inputValue) ? "number" : "text");
      }

      if (
        inputType === "number" &&
        isSearching &&
        inputValue.length >= 10 &&
        customer == null &&
        searchCustomerList?.length == 0 &&
        !navigateModalOpened
      ) {
        console.log("Opening Modal...");
        SetCreateMobNum(inputValue);
        SetNavigateModal(true);
        setNavigateModalOpened(true);
      }

      if (inputValue.length < 10) {
        setNavigateModalOpened(false);
      }
    }
  }, [isSearching, customerSearch, customer, searchCustomerList, inputType]);

  const calculateTotal = (field) => {
    return salesItemData.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      onClickSave();
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useEffect(() => {
    if (employee_id !== undefined) {
      SetEmployee(employee_id);
    }
  }, [employee_id]);

  useEffect(() => {
    if (branchRef.current) {
      branchRef.current.focus();
    }
  }, [dispatch]);

  useHotkeys(
    "alt",
    (event) => {
      event.preventDefault(); // prevent default page refresh
      receivedAmountRef.current?.select(); // focus the input
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  //   useEffect(() => {
  //   if (add === undefined && id === undefined) {
  //     navigate(`${process.env.PUBLIC_URL}/estimation/list`);
  //   }
  // }, [add, id, navigate]);

  const pathName = location?.pathname;
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
       if (id !== undefined) {
         dispatch(getPagePermission({ path: '/estimation/list' }));
       }else {
         dispatch(getPagePermission({ path: pathName }));
       }
  }, [pathName, dispatch]);

  useEffect(() => {
    if (
      pagePermission?.view === false ||
      pagePermission === undefined ||
      pagePermission === null
    ) {
      navigate(`${process.env.PUBLIC_URL}/estimation/list`);
    }
  }, [pagePermission, navigate]);

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <Content>
          <CreateCustomerConfirmation
            modal={navigateModal}
            toggle={toggleNavigateModal}
            title={"Create Customer"}
            mobNum={createMobNum}
            clickAction={navigateCreateCustomer}
          />
          <PreviewCard className="h-100">
            <Row
              lg={12}
              className={"form-control-sm"}
              style={{ marginTop: "10px" }}
            >
              {/* <Col md={2}>
                <ModifiedBreadcrumb />
              </Col> */}
              <Col md={2}>
                <div className="form-group">
                  <BranchDropdown
                    register={register}
                    id={"idBranch"}
                    branches={branches}
                    selectedBranch={idBranch}
                    onBranchChange={setIdBranch}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    classNamePrefix="custom-select"
                    message={errors.branch && "Branch is Required"}
                    ref={branchRef}
                  />
                </div>
              </Col>

              {/* <Col md={2}>
                <div className="form-group" >
                  <MetalDropdown
                    register={register}
                    id={"metal"}
                    metals={metals}
                    selectedMetal={metal}
                    onMetalChange={SetMetal}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.metal && "Metal is Required"}
                    classNamePrefix="custom-select"
                  />
                </div>
              </Col> */}

              <Col md="2">
                <div className="form-group">
                  <SelectDropdown
                    register={register}
                    id={"estmation_for"}
                    data={estForOptions}
                    selectedValue={estFor}
                    onChangeEvent={setEstFor}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    valueField="value"
                    labelField="label"
                    classNamePrefix="custom-select"
                    message={
                      errors.estmation_for && "Estimation For is Required"
                    }
                  />
                </div>
              </Col>

              <Col md={3}>
                <div className="form-control-wrap">
                  <Typeahead
                    id="customerSearch"
                    labelKey="label"
                    onChange={(e) => {
                      if (e?.length > 0) {
                        console.log("Selected Customer:", e);
                        SetCustomer(e[0]?.value), SetCustomerSearch(e);
                        let invTo = e[0].is_retailer == 0 ? "1" : "2";
                        setCustomerDetails(e[0]);

                        if (parseInt(e[0].is_retailer) === 1) {
                          if (!allowRetailerBilling) {
                            toastfunc(
                              "You don't have access to billing for this customer.Please contact Your Admin"
                            );
                            SetCustomer(null);
                            SetCustomerSearch([]);
                            setCustomerDetails({});
                          }
                        }
                      } else {
                        SetCustomer(null);
                        SetCustomerSearch([]);
                        setCustomerDetails({});
                      }
                    }}
                    options={searchCustomerList}
                    placeholder="Choose a customer..."
                    selected={customerSearch}
                    onInputChange={(text) => {
                      if (text.length === 0) {
                        SetCustomerSearch([]);
                        setInputType(null);
                        return;
                      }

                      const firstChar = text.charAt(0);
                      if (!inputType) {
                        setInputType(/\d/.test(firstChar) ? "number" : "text");
                      }

                      if (
                        (inputType === "number" && /^\d*$/.test(text)) ||
                        (inputType === "text" && /^[a-zA-Z\s]*$/.test(text))
                      ) {
                        setIsSearching(text.length >= 5);
                        SetCustomerSearch([{ label: text }]);
                      }
                    }}
                    onKeyDown={(e) => {
                      // if (inputType === "number" && !/\d/.test(e.key)) {
                      //   if (
                      //     ![
                      //       "Backspace",
                      //       "Delete",
                      //       "ArrowLeft",
                      //       "ArrowRight",
                      //     ].includes(e.key)
                      //   ) {
                      //     e.preventDefault(); // Prevent letters but allow backspace, delete, and arrows
                      //   }
                      // }
                      // if (inputType === "text" && /\d/.test(e.key)) {
                      //   e.preventDefault(); // Prevent typing numbers if inputType is text
                      // }
                    }}
                  />
                </div>
              </Col>

              <Col md={3}>
                <ActiveEmployeeDropdown
                  register={register}
                  id={"employee"}
                  selectedEmployee={employee}
                  onEmployeeChange={(value)=>{
                    SetEmployee(value);
                    if (estFieldRef.current && value) {
                      estFieldRef.current.focus();
                    }
                  }}
                  isRequired={true}
                  options={activeEmployeeDropdown}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.employee && "Employee is Required"}
                  classNamePrefix="custom-select"
                  placeholder={"Employee"}
                />
              </Col>

              <Col md={1} className="text-right">
                <Button
                  color="primary"
                  disabled={isSubmitted}
                  size="md"
                  onClick={onClickSave}
                >
                  {isSubmitted ? "Saving" : "Save[Ctrl+s]"}
                </Button>
              </Col>
            </Row>
            <Row>
              <div className="">
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={billTypeTab === "1" ? "active" : ""}
                      onClick={(ev) => {
                        ev.preventDefault();
                        setBillTypeTab("1");
                      }}
                    >
                      Sales(F1)
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={billTypeTab === "2" ? "active" : ""}
                      onClick={(ev) => {
                        ev.preventDefault();
                        setBillTypeTab("2");
                      }}
                    >
                      Purchase(F2)
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={billTypeTab === "3" ? "active" : ""}
                      onClick={(ev) => {
                        ev.preventDefault();
                        setBillTypeTab("3");
                      }}
                    >
                      Sales Return(F3)
                    </NavLink>
                  </NavItem>
                  <Col md={2}>
                    <div
                      className="form-control-wrap"
                      style={{ marginTop: "10px" }}
                    >
                      <div className="input-group">
                        <div
                          className="input-group-append"
                          style={{ width: "70%" }}
                        >
                          <TextInputField
                            register={register}
                            isRequired={true}
                            id={"estNo"}
                            placeholder="Est No"
                            value={estNo}
                            SetValue={(value) => {
                              setEstNo(value);
                            }}
                          />
                        </div>
                        <div
                          className="input-group-append"
                          style={{ height: "29px", width: "30%" }}
                        >
                          <Button
                            disabled={isLoading}
                            outline
                            color="primary"
                            className="btn-dim"
                            onClick={handleEstNoSearch}
                          >
                            <em class="icon ni ni-search"></em>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col
                    md={2}
                    className="form-control-sm mt-1"
                    style={{ marginLeft: "10px" }}
                  >
                    <Select
                      options={options}
                      placeholder="Select Type"
                      id="itemType"
                      onChange={handleItemTypeChange}
                      value={
                        options.find((option) => option.value === itemType) ||
                        null
                      }
                      menuPortalTarget={document.body}
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "25px", // Reduce height
                          fontSize: "10px", // Reduce font size
                        }),
                        input: (base) => ({
                          ...base,
                          fontSize: "10px", // Adjust input font size
                        }),
                        singleValue: (base) => ({
                          ...base,
                          fontSize: "10px", // Adjust selected value font size
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          padding: "3px", // Reduce padding around dropdown icon
                        }),
                        option: (base) => ({
                          ...base,
                          fontSize: "10px", // Reduce option font size
                          padding: "3px", // Reduce option padding
                        }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                          fontSize: "12px",
                        }),
                      }}
                    />
                  </Col>
                  {/* {((itemType === 1 || itemType === 2) && billTypeTab === "1") && (
                    <Col md={1} className="form-control-sm mt-1" >
                      <Button
                        color="primary"
                        className="btn-sm"
                        onClick={handleSalesAddItem}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Sales Add
                      </Button>
                    </Col>
                  )} */}
                  {itemType === 0 || itemType === 2 ? (
                    <Col
                      md={2}
                      className="form-control-sm"
                      style={{ marginTop: "10px" }}
                    >
                      <div className="form-control-wrap">
                        <div className="input-group">
                          <div
                            className="input-group-append"
                            style={{ width: "45%" }}
                          >
                            {/* <TextInputField
                              register={register}
                              isRequired={true}
                              id={"tagCode"}
                              ref={tagFieldRef}
                              placeholder="Tag Code"
                              value={tagCode}
                              handleKeyDown={handleKeyDown}
                              SetValue={(value) => {
                                setTagCode(value);
                                clearErrors("tagCode");
                              }}
                              message={errors.line1 && "address is Required"}

                            /> */}
                                  <div className="form-control-wrap">
                                    <input
                                      className="form-control form-control-sm"
                                      id={"tagCode"}
                                      type="text"
                                      placeholder={"Tag Code"}
                                      {...register(`tagCode`)}
                                      value={tagCode}
                                      onChange={(e) => {
                                        let inputValue = e.target.value;
                                        setValue("tagCode",inputValue);
                                        setTagCode(inputValue);
                                         clearErrors("tagCode");
                                        
                                      }}
                                      ref={estFieldRef}
                                    />
                                  </div>
                          </div>
                          <div
                            className="input-group-append"
                            style={{ width: "45%" }}
                          >
                            <TextInputField
                              register={register}
                              isRequired={true}
                              id={"oldTagCode"}
                              placeholder="Old Tag Code"
                              value={oldTagCode}
                              handleKeyDown={handleKeyDown}
                              SetValue={(value) => {
                                setOldTagCode(value);
                                clearErrors("oldTagCode");
                              }}
                            />
                          </div>
                          <div
                            className="input-group-append"
                            style={{ height: "29px", width: "10%" }}
                          >
                            <Button
                              outline
                              color="primary"
                              className="btn-dim"
                              onClick={handleSearch}
                            >
                              <em class="icon ni ni-search"></em>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ) : (
                    ""
                  )}
                  &nbsp;&nbsp;
                  <div
                    className="d-flex align-items-center"
                    style={{ marginTop: "1px", marginLeft: "25px" }}
                  >
                    <div className="custom-control custom-control-sm custom-checkbox mr-3">
                      <input
                        type="checkbox"
                        checked={is_enquiry}
                        onChange={(e) => setIs_enquiry(e.target.checked)}
                        className="custom-control-input"
                        id="is_enquiry"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="is_enquiry"
                      >
                        Is Enquiry
                      </label>
                    </div>
                    &nbsp;&nbsp;
                    <div className="custom-control custom-control-sm custom-checkbox">
                      <input
                        type="checkbox"
                        checked={send_to_approval}
                        onChange={(e) => setSend_to_approval(e.target.checked)}
                        disabled={sendToApprovalDisabled}
                        className="custom-control-input"
                        id="send_to_approval"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="send_to_approval"
                      >
                        Send To Approval
                      </label>
                    </div>
                  </div>
                </Nav>
                <Row></Row>

                <Row md={12} className="g-gs">
                  <Col className="" md={12}>
                    <TabContent activeTab={billTypeTab}>
                      <TabPane tabId="1">
                        {/* <SalesForm
                            ref={salesFormRef}
                            isSizeReq={true}
                            onSubmit={handleFormSubmit}
                            initialState={formValues}
                            isPartialSale={isPartialSale}
                            readOnly={parseInt(itemType) === 0 && parseInt(isPartialSale) === 0 ? true : false}
                            itemType={itemType}
                            idBranch={idBranch}
                            salesItemData={salesItemData}
                            customerDetails={customerDetails}
                            tabIndex={7}
                            isMcVaDisable={isMcVaDisable}
                            allowRetailerBilling={allowRetailerBilling}
                            isEmployeeSupport = {true}
                            isEmployee={true}
                          /> */}
                        <SalesEntryForm
                          idBranch={idBranch}
                          ref={salesFormRef}
                          finYearName={finYearName}
                          finYear={finYear}
                          customer={customer}
                          setItemDetails={handleSalesItemData}
                          itemDetails={salesItemData}
                          totalDiscount={totalDiscount}
                          metal={metal}
                          itemType={itemType}
                          showIsPartial={true}
                          showIsOrder={false}
                          employee={employee}
                          showdealerName ={"1"}
                        ></SalesEntryForm>
                      </TabPane>
                      <TabPane tabId="2">
                        <PurchaseForm
                          billTypeTab={billTypeTab}
                          ref={purchaseFormRef}
                          onSubmit={handlePurchaseItem}
                          initialState={purchaseFormValues}
                          tabIndex={""}
                          metal={metal}
                        ></PurchaseForm>
                         <Row md={12}>
                          <Col md={10} className="form-control-sm"></Col>
                          <Col md={2} className="form-control-sm">
                          <Button
                            color="primary"
                            tabIndex={""}
                            className="btn"
                            onClick={handlePurchaseAddPreview}
                          >
                            Add to Preview
                          </Button>
                        </Col>
                         </Row>

                        <Row md={12}>
                          <PreviewTable
                            columns={purchaseColumns}
                            data={purchaseItemData}
                            onDelete={handlePurchaseDelete}
                            onEdit={handlePurchaseEdit}
                            tabIndex={""}
                          />
                        </Row>
                      </TabPane>
                      <TabPane tabId="3">
                        <SalesReturnForm
                          idBranch={idBranch}
                          ref={salesFormRef}
                          finYearName={finYearName}
                          finYear={finYear}
                          customer={customer}
                          handleReturnItemCost={handleReturnItemCost}
                          onUpdateReturnItemData={handleReturnData}
                          initialReturnData={returnItemData}
                        ></SalesReturnForm>
                      </TabPane>

                      <TabPane tabId="4"></TabPane>
                    </TabContent>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <table className="table table-bordered">
                      <tr>
                        <th>Sales Nwt</th>
                        <th style={{ textAlign: "right" }}>
                          {totalSalesNetWeight}
                        </th>
                      </tr>
                      <tr>
                        <th>Taxable Amount</th>
                        <th style={{ textAlign: "right" }}>
                          <CurrencyDisplay value={totalTaxableAmount} />
                        </th>
                      </tr>
                      <tr>
                        <th>Tax Amount</th>
                        <th style={{ textAlign: "right" }}>
                          <CurrencyDisplay value={taxAmount} />
                        </th>
                      </tr>
                      <tr>
                        <th>Sales Amount</th>
                        <th
                          style={{
                            textAlign: "right",
                            fontSize: "20px !important",
                            color: "#34a853",
                          }}
                        >
                          <CurrencyDisplay value={totalSalesAmount} />
                        </th>
                      </tr>
                    </table>
                  </Col>

                  <Col md={4}>
                    <table className="table table-bordered">
                      {userInfo?.settings?.is_show_min_sales_amount == true && (
                        <tr>
                          <th>Minimum Sales Amount</th>
                          <th
                            style={{
                              textAlign: "right",
                              fontSize: "20px !important",
                              color: "#34a853",
                            }}
                          >
                            <CurrencyDisplay
                              value={salesItemData.reduce(
                                (sum, item) =>
                                  sum + parseFloat(item.minimumItemCost || 0),
                                0
                              )}
                            />
                          </th>
                        </tr>
                      )}

                      {totalPurchaseAmount > 0 && (
                        <tr>
                          <th>Pur Amount</th>
                          <th style={{ textAlign: "right", color: "red" }}>
                            <CurrencyDisplay value={totalPurchaseAmount} />
                          </th>
                        </tr>
                      )}

                      {totalReturnAmount > 0 && (
                        <tr>
                          <th>Ret Amount</th>
                          <th style={{ textAlign: "right", color: "red" }}>
                            <CurrencyDisplay value={totalReturnAmount} />
                          </th>
                        </tr>
                      )}

                      <tr>
                        <th>Bill Amount</th>
                        <th style={{ textAlign: "right" }}>
                          <CurrencyDisplay value={totalBillAmount} />
                        </th>
                      </tr>

                      <tr>
                        <th>Discount Amount</th>
                        <td>
                          <div className="input-group">
                            <input
                              id={`totalDiscount`}
                              type="number"
                              className="form-control no-spinner"
                              value={totalDiscount}
                              setValue={setValue}
                              min={0}
                              style={{ textAlign: "right" }}
                              disabled={parseFloat(totalSalesAmount) === 0}
                              {...register(`totalDiscount`)}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("totalDiscount", value);
                              }}
                              onBlur={calculateDiscountAmount}
                              onWheel={(e) => e.target.blur()}
                            />
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <th style={{ fontSize: "15px", color: "Red" }}>
                          Recd Amount (alt)
                        </th>
                        <td>
                          <input
                            id={`totalAmountReceived`}
                            type="number"
                            className="form-control form-control-md no-spinner"
                            onWheel={(e) => e.target.blur()}
                            value={totalAmountReceived}
                            setValue={setValue}
                            style={{ textAlign: "right" }}
                            min={0}
                            {...register(`totalAmountReceived`)}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleInputChange("totalAmountReceived", value);
                            }}
                            onBlur={calculateDiscountAmount}
                            ref={receivedAmountRef}
                          />
                        </td>
                      </tr>
                    </table>
                  </Col>
                </Row>
              </div>
            </Row>
          </PreviewCard>
        </Content>
      </FormProvider>
      <DeleteModal
        actionName={"Delete"}
        modal={deleteModal}
        toggle={toggle}
        name={"Item"}
        title={"Estimation"}
        clickAction={deleteSaleItem}
      />
      <EmployeeModal
        modal={employeeModal}
        toggle={toggleEmployeeModal}
        employees={activeEmployeeDropdown}
        data={salesItemData[empItemId]}
        setData={(lable, value) => {
          handelChange(empItemId, lable, value);
          //SetEmpItemData({...salesItemData[empItemId],lable:value})
        }}
      />

      <TagSearchModal
        idBranch={idBranch}
        isOpen={isModalOpen}
        modal={tagSearchModal}
        toggle={tagsearch_toggle}
        metal={metal}
        selectedItemDetails={setTagSearchDetails}
      />
    </React.Fragment>
  );
}

export default EstimationForm;
