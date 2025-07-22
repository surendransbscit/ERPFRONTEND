/* eslint-disable no-unused-expressions */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Content from "../../layout/content/Content";
import { Icon, PreviewCard } from "../../components/Component";
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  UncontrolledButtonDropdown,
} from "reactstrap";
import {
  ActiveEmployeeDropdown,
  BranchDropdown,
  ProductDropdown,
  MetalDropdown,
  SelectDropdown,
} from "../../components/filters/retailFilters";
import { useForm, FormProvider } from "react-hook-form";
import {
  TextInputField,
  GstInputField,
  PanInputField,
  NumberInputField,
} from "../../components/form-control/InputGroup";
import CurrencyDisplay, {
  formatCurrencyInINR,
} from "../../components/common/moneyFormat/moneyFormat";
import PurchaseForm from "../../components/common/salesForm/purchaseForm";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  useBranches,
  useEmployeeDropdown,
  useMetals,
  useCounters,
} from "../../components/filters/filterHooks";
import { useLocation, useNavigate } from "react-router-dom";
import PreviewTable from "../../components/sds-table/PreviewTable";
import Select from "react-select";
import useBillingFormFormHandling from "./useBillingFormHandling";
import PaymentModeComponent from "../../components/common/payment/PaymentModeComponent";
import getCurrencySymbol from "../../components/common/moneyFormat/currencySymbol";
import DeleteModal from "../../components/modals/DeleteModal";
import ReturnForm from "../../components/common/salesForm/returnForm";
import { getAllFinancialYear } from "../../redux/thunks/retailMaster";
import CreateCustomerConfirmation from "../../components/modals/CreateCustomerConfirmation";
import { Typeahead } from "react-bootstrap-typeahead";
import { searchCustomer } from "../../redux/thunks/customer";
import { useHotkeys } from "react-hotkeys-hook";
import { secureStorage_login_branches } from "../../redux/configs";
import {
  toastfunc,
  toastsuccess,
} from "../../components/sds-toast-style/toast-style";
import Head from "../../layout/head/Head";
import { isUndefined } from "../../components/common/calculations/ErpCalculations";
import EmployeeModal from "../../components/modals/EmployeeModal";
import SalesReturnForm from "../../components/common/salesForm/salesReturnForm";
import SalesEntryForm from "../../components/common/salesForm/salesEntryForm";
import MultiImageDropzone from "../../components/modals/MultiImageDropzone";
import "../../assets/css/billing_form.css";
import { employee_id } from "../../redux/configs";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import BillingSaveModal from "../../components/modals/BillingSaveModal";
import secureLocalStorage from "react-secure-storage";

function BillingForm(props) {
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [billTypeTab, setBillTypeTab] = useState("1");
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const { financialYearList } = useSelector(
    (state) => state.financialYearReducer
  );
  const { counters } = useCounters();
  const { searchCustomerList } = useSelector((state) => state.customerReducer);
  const { activeProductList } = useSelector((state) => state.productReducer);
  const [billNo, setBillNo] = useState("");
  const { branches } = useBranches();
  const { employees } = useEmployeeDropdown();
  const { metals } = useMetals();
  const { activeEmployeeDropdown } = useSelector(
    (state) => state.employeeReducer
  );
  const methods = useForm();
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const { isLoading } = useSelector((state) => state.estReducer);

  const productFieldRef = useRef(null);
  const branchFieldRef = useRef(null);
  const netAmountRef = useRef(null);

  const [inputType, setInputType] = useState();

  const {
    add,
    id,
    idBranch,
    setIdBranch,
    itemType,
    isPartialSale,
    allowRetailerBilling,
    setIsPartialSale,
    SetCustomer,
    customer,
    customerSearch,
    SetCustomerSearch,
    columns,
    purchaseColumns,
    options,
    salesFormRef,
    purchaseFormRef,
    paymentFormRef,
    tagCode,
    setTagCode,
    orderNo,
    setOrderNo,
    estNo,
    setEstNo,
    handleInputChange,
    handleEdit,
    handlePurchaseEdit,
    handleAddPreview,
    handlePurchaseAddPreview,
    handleSalesFormSubmit,
    handlePurchaseItem,
    handleTagSearch,
    handleOrderNoSearch,
    handleEstNoSearch,
    handleItemTypeChange,
    salesItemData,
    purchaseItemData,
    formValues,
    purchaseFormValues,
    onClickSave,
    isSubmitted,
    totalTaxableAmount,
    totalNetAmount,
    totalSalesGrossWeight,
    totalSalesLessWeight,
    totalSalesNetWeight,
    estFieldRef,
    cgst,
    sgst,
    igst,
    taxAmount,
    totalSalesAmount,
    totalPurchaseAmount,
    totalReturnAmount,
    totalBillAmount,
    totalAmountReceived,
    totalDiscount,
    balanceAmount,
    handlePaymentData,
    handleAdvanceAdjustmentData,
    handleDepositAdjustmentData,
    handleChitAdjustmentData,
    handleGiftFormData,
    handleReturnData,
    handleReturnItemCost,
    totalPaymentAmount,
    totalAdjustedAmount,
    totalDepositAdjustedAmount,
    refundAmount,
    depositAmount,
    calculateDiscountAmount,
    deleteModal,
    toggle,
    handleSalesDelete,
    handlePurchaseDelete,
    deleteSaleItem,
    employee,
    SetEmployee,
    setIsCredit,
    isCredit,
    finYear,
    finYearName,
    setFinYear,
    setFinYearName,
    totalChitAdjustedAmount,
    invoiceFor,
    setInvoiceFor,
    invoiceTo,
    setInvoiceTo,
    setMiscBilling,
    miscBilling,
    panNumber,
    setPanNumber,
    gstNumber,
    setGstNumber,
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
    setSalesItemData,
    customerDetails,
    setCustomerDetails,
    totalMC,
    totalVA,
    totalGrossWeight,
    metalPurityRateList,
    metalRateInfo,
    settingsBillingType,
    setSettingsBillingType,
    oldTagCode,
    setOldTagCode,
    handleSearch,
    deliveryLocationOptions,
    setDeliveryLocation,
    deliveryLocation,
    handelChange,
    SetEmpItemId,
    empItemId,
    toggleEmployeeModal,
    employeeModal,
    SetEmployeeModal,
    handleSalesSubEmployee,
    returnItemData,
    setReturnItemData,
    handleSalesItemData,
    itemDeliveredDetails,
    setItemDeliveredDetails,
    handelItemDeliverChange,
    addItemDelivered,
    deleteItemDelivery,
    handleDropChange,
    imageModal,
    SetImageModal,
    activeRow,
    setActiveRow,
    toggleImageModal,
    imageToggle,
    selectAllItemDelivered,
    setSelectAllItemDelivered,
    selectAllItemDeliveredCol,
    handleSalesAddItem,
    metal,
    SetMetal,
    firstName,
    setFirstname,
    navigateModalOpened,
    setNavigateModalOpened,
    giftVoucherAmount,
    setGiftVoucherAmount,
    handleKeyDown,
    handleTransCodeSearch,
    transCode,
    setTransCode,
    paymentModeData,
    billingToggle,
    SetBillingSaveModel,
    billingSaveModel,
    submitForm,
    billModalActionName,
    billModalName,
    handelBillSaveThroughModel,
    counterId,
    setCounterId,
    remarks,
    setRemarks
  } = useBillingFormFormHandling(setBillTypeTab);

  useHotkeys(
    "f1",
    (event) => {
      event.preventDefault();
      setBillTypeTab("1");
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useHotkeys(
    "f2",
    (event) => {
      event.preventDefault();
      setBillTypeTab("2");
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useHotkeys(
    "f3",
    (event) => {
      event.preventDefault();
      setBillTypeTab("3");
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useHotkeys(
    "f4",
    (event) => {
      event.preventDefault();
      setBillTypeTab("4");
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useHotkeys(
    "ctrl+a",
    (event) => {
      event.preventDefault();
      if (billTypeTab === "1") {
        handleSalesAddItem();
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useEffect(() => {
    const getFinYear = async () => {
      try {
        const finYearDetails = await dispatch(getAllFinancialYear()).unwrap();
        let defaultFinYear = finYearDetails?.rows?.find(
          (val) => val.fin_status === true
        );
        setFinYearName(defaultFinYear.fin_year_name);
        setFinYear(defaultFinYear.fin_id);
      } catch (error) {
        console.error("Error fetching financial years:", error);
      }
    };

    getFinYear(); // Call the async function inside useEffect
  }, [dispatch]);

  const handleOptionSelectChange = (value, fin_year_name) => {
    setFinYear(value);
    setFinYearName(fin_year_name);
  };

  const handleBillSearch = () => {};

  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      inputType === "text" &&
      customerSearch[0]?.label.length > 0 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      inputType === "number" &&
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
        inputValue.length >= 10 && // Open only when it reaches 10 digits
        customer == null &&
        searchCustomerList?.length == 0 &&
        !navigateModalOpened
      ) {
        SetCreateMobNum(inputValue);
        SetNavigateModal(true);
        setNavigateModalOpened(true);
      }

      if (inputValue.length < 10) {
        setNavigateModalOpened(false); // Reset when deleting digits
      }
    }
  }, [isSearching, customerSearch, customer, searchCustomerList, inputType]);

  useEffect(() => {
    if (customerSearchValue && customerId) {
      SetCustomerSearch(customerSearchValue);
      SetCustomer(customerId);
      setFirstname(customerSearchValue[0].firstname);
    }
  }, [customerSearchValue, customerId]);

  // useEffect(() => {
  //     if (add === undefined && id === undefined) {
  //       navigate(`${process.env.PUBLIC_URL}/billing/list`);
  //     }
  // }, [add, id, navigate]);

  const calculateTotal = (field) => {
    return salesItemData.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns?.find((item) => item.accessor === field);
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
      if (netAmountRef.current) {
        // Optionally check if it's focused
        if (document.activeElement !== netAmountRef.current) {
          if (
            (!isSubmitted && parseFloat(balanceAmount) == 0) ||
            !pagePermission?.add
          ) {
            onClickSave();
          }
        }
      } else {
        if (
          (!isSubmitted && parseFloat(balanceAmount) == 0) ||
          !pagePermission?.add
        ) {
          onClickSave();
        }
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useHotkeys(
    "alt",
    (event) => {
      event.preventDefault();
      netAmountRef.current.select();
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useHotkeys(
    "enter",
    (event) => {
      if (netAmountRef.current) {
        // Optionally check if it's focused
        if (document.activeElement === netAmountRef.current) {
          event.preventDefault();
          calculateDiscountAmount();
        } else {
          console.log("Focus failed.");
        }
      }
      if (estFieldRef.current) {
        if (document.activeElement === estFieldRef.current) {
          event.preventDefault();
          handleEstNoSearch();
        } else {
          console.log("Focus failed.");
        }
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
    }
  );

  useEffect(() => {
    if (employee_id !== undefined) {
      SetEmployee(employee_id);
    }
  }, [employee_id]);

  useEffect(() => {
    if (estFieldRef.current) {
      estFieldRef.current.focus();
    }
  }, [dispatch]);

  useEffect(() => {
    if (itemType === 2) {
      setTimeout(() => {
        if (productFieldRef?.current) {
          productFieldRef.current.focus();
        } else {
          console.error("Ref is still not assigned! Waiting more time...");
          setTimeout(() => {
            if (productFieldRef?.current) {
              productFieldRef.current.focus();
            } else {
              console.error("Still not assigned after extra delay!");
            }
          }, 300);
        }
      }, 300);
    }
  }, [itemType]);

  const pathName = location?.pathname;
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    if (
      pagePermission?.view === false ||
      pagePermission === undefined ||
      pagePermission === null
    ) {
      navigate(`${process.env.PUBLIC_URL}/billing/list`);
    }
  }, [pagePermission, navigate]);

  return (
    <React.Fragment>
      <Head title="Billing Add" />
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
              <Col
                md={2}
                style={{
                  display:
                    secureStorage_login_branches?.length <= 1
                      ? "none"
                      : "block",
                }}
              >
                <BranchDropdown
                  register={register}
                  id={"idBranch"}
                  branches={branches}
                  selectedBranch={idBranch}
                  onBranchChange={setIdBranch}
                  isRequired={true}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.branch && "Branch is Required"}
                  classNamePrefix="custom-select"
                  ref={branchFieldRef}
                />
              </Col>
              {parseInt(settings?.is_counter_req_in_billing) == 1 && (
              <Col md={2}>
                <SelectDropdown
                  register={register}
                  id={"counter"}
                  data={counters}
                  selectedValue={counterId}
                  onChangeEvent={(value) => {
                    setCounterId(value);
                    secureLocalStorage.setItem("counterId", value);
                  }}
                  isRequired={true}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  placeholder={"Select Counter"}
                  message={errors?.counter && "Counter is Required"}
                  valueField={"id_counter"}
                  labelField={"counter_name"}
                  classNamePrefix="custom-select"
                />
              </Col>
               )}
              {/* {settings?.is_metal_wise_billing == '1' && (
                <Col md={1} style={{ padding: "0px" }}>

                  <MetalDropdown
                    register={register}
                    id={"metal"}
                    metals={metals}
                    selectedMetal={metal}
                    onMetalChange={SetMetal}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    classNamePrefix="custom-select"
                    placeholder={"Metal"}
                    message={errors.metal && "Metal is Required"}
                  />

                </Col>
              )} */}

              <Col md="2" style={{ paddingRight: "0px" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="cus_type">
                    Bill To:&nbsp;
                  </label>
                  <div
                    style={{ marginLeft: "5px" }}
                    className="custom-control custom-control-sm custom-radio"
                  >
                    <input
                      type="radio"
                      id="inv_for_cus"
                      name={"invoice_for"}
                      value={"1"}
                      className="custom-control-input"
                      checked={invoiceFor === "1"}
                      {...register("invoice_for", { required: true })}
                      onChange={(e) => {
                        setInvoiceFor(e.target.value);
                      }}
                    />
                    <label
                      htmlFor="inv_for_cus"
                      className="custom-control-label"
                    >
                      {" "}
                      Cust
                    </label>
                  </div>
                  &nbsp;
                  <div className="custom-control custom-control-sm custom-radio">
                    <input
                      type="radio"
                      id="inv_for_bussiness"
                      name={"invoice_for"}
                      value={"2"}
                      className="custom-control-input"
                      {...register("invoice_for", { required: true })}
                      checked={invoiceFor === "2"}
                      onChange={(e) => {
                        setInvoiceFor(e.target.value);
                      }}
                    />
                    <label
                      htmlFor="inv_for_bussiness"
                      className="custom-control-label"
                    >
                      Business
                    </label>
                  </div>
                </div>
              </Col>

              <Col md={2}>
                <div className="form-control-wrap">
                  <Typeahead
                    id="customerSearch"
                    labelKey="label"
                    onChange={(e) => {
                      if (e?.length > 0) {
                        SetCustomer(e[0]?.value),
                          SetCustomerSearch(e),
                          setFirstname(e[0]?.firstname);
                        let invTo = e[0].is_retailer == 0 ? "1" : "2";
                        setInvoiceTo(invTo);
                        setCustomerDetails(e[0]);
                        if (estFieldRef.current) {
                          estFieldRef.current.focus();
                        }
                        if (parseInt(e[0].is_retailer) === 1) {
                          if (!allowRetailerBilling) {
                            toastfunc(
                              "You don't have access to billing for this customer.Please contact Your Admin"
                            );
                            SetCustomer(null);
                            SetCustomerSearch([]);
                            setCustomerDetails({});
                            setInvoiceTo("1");
                          }
                        }
                      } else {
                        SetCustomer(null);
                        SetCustomerSearch([]);
                        setCustomerDetails({});
                        setInvoiceTo("1");
                      }
                    }}
                    options={searchCustomerList}
                    placeholder="Choose a customer..."
                    // defaultSelected={customerSearch}
                    selected={customerSearch}
                    // onInputChange={(text) => {
                    //   if (text?.length >= 5) {
                    //     setIsSearching(true);
                    //     SetCustomerSearch([{ label: text }]);
                    //   } else {
                    //     SetCustomerSearch([]);
                    //   }
                    // }}
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

                      if (inputType === "number" && /^\d*$/.test(text)) {
                        setIsSearching(text.length >= 5);
                        SetCustomerSearch([{ label: text }]);
                      }
                      if (inputType === "text" && /^[a-zA-Z\s]*$/.test(text)) {
                        setIsSearching(text.length > 0);
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
                    className={
                      settingsBillingType === true
                        ? "retailer-bg small-typeahead"
                        : "small-typeahead"
                    }
                  />
                </div>
              </Col>
              <Col md={2}>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Customer Name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                  onKeyDown={(evt) => {
                    const invalidChars = /[^a-zA-Z\s]/; // Allows only letters and spaces
                    if (invalidChars.test(evt.key) || evt.key === "Shift") {
                      evt.preventDefault();
                    }
                  }}
                  className="form-control-sm form-control"
                />
                {/* </span>
                    </span>
                  </div> */}
              </Col>

              <Col
                md={1}
                style={{
                  paddingRight: "1px",
                  paddingLeft: "1px",
                  display: "none",
                }}
              >
                <SelectDropdown
                  register={register}
                  id={"deliveryLocation"}
                  data={deliveryLocationOptions}
                  selectedValue={deliveryLocation}
                  onChangeEvent={setDeliveryLocation}
                  isRequired={true}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  classNamePrefix="custom-select"
                  message={
                    errors.deliveryLocation && "Delivery Location is Required"
                  }
                />
              </Col>

              <Col md={2} style={{ paddingRight: "1px", paddingLeft: "1px" }}>
                <ActiveEmployeeDropdown
                  register={register}
                  id={"employee"}
                  placeholder={"Employee"}
                  selectedEmployee={employee}
                  onEmployeeChange={SetEmployee}
                  isRequired={true}
                  options={activeEmployeeDropdown}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  classNamePrefix="custom-select"
                  message={errors.employee && "Employee is Required"}
                />
              </Col>
              <Col md={1} className="text-right">
                <Button
                  color="primary"
                  disabled={
                    isSubmitted ||
                    parseFloat(balanceAmount) !== 0 ||
                    !pagePermission?.add
                  }
                  size="md"
                  onClick={() => {
                    onClickSave();
                  }}
                >
                  {isSubmitted ? "Saving" : "Save[crtl+s]"}
                </Button>
              </Col>

              <Row></Row>
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
                      Return(F3)
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={billTypeTab === "4" ? "active" : ""}
                      onClick={(ev) => {
                        ev.preventDefault();
                        setBillTypeTab("4");
                      }}
                    >
                      Not Deliver(F4)
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
                          <div className="form-control-wrap">
                            <input
                              className="form-control form-control-sm"
                              id={"estNo"}
                              type="text"
                              placeholder={"Est No"}
                              {...register(`estNo`, {
                                required: {
                                  value: true,
                                  message: "This field is Required",
                                },
                              })}
                              value={estNo}
                              autoComplete="off"
                              onChange={(e) => {
                                let inputValue = e.target.value;
                                setEstNo(inputValue);
                                clearErrors("estNo");
                              }}
                              ref={estFieldRef} // Apply the ref
                            />
                          </div>
                        </div>
                        <div
                          className="input-group-append"
                          style={{ height: "29px", width: "30%" }}
                        >
                          <Button
                            outline
                            color="primary"
                            className="btn-dim"
                            disabled={isLoading}
                            onClick={handleEstNoSearch}
                          >
                            <em class="icon ni ni-search"></em>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                  {billTypeTab === "1" && (
                    <Col
                      md={itemType == 0 ? 1 : 2}
                      className="form-control-sm"
                      style={{ marginLeft: "10px", marginTop: "5px" }}
                    >
                      <Select
                        options={options}
                        placeholder="Select Type"
                        id="itemType"
                        onChange={handleItemTypeChange}
                        value={
                          options?.find(
                            (option) => option.value === itemType
                          ) || null
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
                            fontSize: "10px",
                          }),
                        }}
                      />
                    </Col>
                  )}
                  {/* {((itemType === 1 || itemType === 2) && billTypeTab === "1") && (
                    <Col md={1} className="form-control-sm mt-1" >
                      <Button
                        color="primary"
                        className="btn-sm"
                        onClick={() => handleSalesAddItem()}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Sales Add
                      </Button>
                    </Col>
                  )} */}

                  {(itemType === 0 || itemType === 2) && billTypeTab === "1" ? (
                    <Col
                      md={2}
                      className="form-control-sm"
                      style={{ marginTop: "5px" }}
                    >
                      <div className="form-control-wrap">
                        <div className="input-group">
                          <div
                            className="input-group-append"
                            style={{ width: "45%" }}
                          >
                            <TextInputField
                              register={register}
                              isRequired={true}
                              id={"tagCode"}
                              placeholder="Tag Code"
                              value={tagCode}
                              SetValue={(value) => {
                                setTagCode(value);
                                clearErrors("tagCode");
                              }}
                              handleKeyDown={handleKeyDown}
                              message={errors.line1 && "address is Required"}
                            />
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

                  {itemType === 0 ? (
                    <Col
                      md={3}
                      className="form-control-sm"
                      style={{ marginLeft: "10px", marginTop: "5px" }}
                    >
                      <div className="form-control-wrap">
                        <div className="input-group">
                          <div className="input-group-append">
                            <UncontrolledButtonDropdown
                              className="input-group-append"
                              style={{ height: "29px" }}
                            >
                              <DropdownToggle
                                tag="button"
                                className="btn btn-outline-primary btn-dim dropdown-toggle"
                              >
                                <span>{finYearName}</span>
                                <Icon
                                  name="chevron-down"
                                  className="mx-n1"
                                ></Icon>
                              </DropdownToggle>
                              <DropdownMenu>
                                <ul className="link-list-opt no-bdr">
                                  {financialYearList.rows?.map((option) => (
                                    <li key={option.fin_id}>
                                      <DropdownItem
                                        key={option.fin_id}
                                        onClick={() =>
                                          handleOptionSelectChange(
                                            option.fin_id,
                                            option.fin_year_name
                                          )
                                        }
                                      >
                                        {option.fin_year_name}
                                      </DropdownItem>
                                    </li>
                                  ))}
                                </ul>
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </div>
                          <div
                            className="input-group-append"
                            style={{ width: "45%" }}
                          >
                            <TextInputField
                              register={register}
                              isRequired={true}
                              id={"orderNo"}
                              placeholder="Order No"
                              value={orderNo}
                              SetValue={(value) => {
                                setOrderNo(value);
                              }}
                            />
                          </div>
                          <div
                            className="input-group-append"
                            style={{ height: "29px" }}
                          >
                            <Button
                              outline
                              color="primary"
                              className="btn-dim"
                              onClick={handleOrderNoSearch}
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
                  {settings?.show_trans_code_search_in_billing == "1" &&
                    billTypeTab == "1" && (
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
                              <div className="form-control-wrap">
                                <input
                                  className="form-control form-control-sm"
                                  id={"transcode"}
                                  type="text"
                                  placeholder={"Trans Code"}
                                  {...register(`transcode`, {
                                    required: {
                                      value: true,
                                      message: "This field is Required",
                                    },
                                  })}
                                  value={transCode}
                                  onChange={(e) => {
                                    let inputValue = e.target.value;
                                    setTransCode(inputValue);
                                    clearErrors("transcode");
                                  }}
                                />
                              </div>
                            </div>
                            <div
                              className="input-group-append"
                              style={{ height: "29px", width: "30%" }}
                            >
                              <Button
                                outline
                                color="primary"
                                className="btn-dim"
                                disabled={isLoading}
                                onClick={handleTransCodeSearch}
                              >
                                <em class="icon ni ni-search"></em>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )}
                  {userInfo?.user?.promotional_billing == "1" && (
                    <Col md="2" style={{ marginLeft: "25px" }}>
                      <div className="form-group" style={{ marginTop: "15px" }}>
                        <label className="form-label" htmlFor="invoice_to">
                          Misc Bill :{" "}
                        </label>
                        <div
                          style={{ marginLeft: "10px" }}
                          className="custom-control custom-control-sm custom-radio"
                        >
                          <input
                            type="radio"
                            id="misc_billing_yes"
                            name={"misc_billing"}
                            value={"1"}
                            className="custom-control-input"
                            checked={miscBilling === "1"}
                            {...register("misc_billing", { required: true })}
                            onChange={(e) => {
                              setMiscBilling(e.target.value);
                            }}
                          />
                          <label
                            htmlFor="misc_billing_yes"
                            className="custom-control-label"
                          >
                            {" "}
                            Yes
                          </label>
                        </div>
                        &nbsp;
                        <div className="custom-control custom-control-sm custom-radio">
                          <input
                            type="radio"
                            id="misc_billing_no"
                            name={"misc_billing"}
                            value={"0"}
                            className="custom-control-input"
                            {...register("misc_billing", { required: true })}
                            checked={miscBilling === "0"}
                            onChange={(e) => {
                              setMiscBilling(e.target.value);
                            }}
                          />
                          <label
                            htmlFor="misc_billing_no"
                            className="custom-control-label"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </Col>
                  )}
                </Nav>

                <Row className="g-gs">
                  <Col className="" md={12}>
                    <TabContent activeTab={billTypeTab}>
                      <TabPane tabId="1">
                        {/* <Row md={12}>
                          <SalesForm
                            ref={salesFormRef}
                            onSubmit={handleSalesFormSubmit}
                            initialState={formValues}
                            isPartialSale={isPartialSale}
                            readOnly={parseInt(itemType) === 0 && parseInt(isPartialSale) === 0 ? true : false}
                            itemType={itemType}
                            idBranch={idBranch}
                            salesItemData={salesItemData}
                            isSizeReq={true}
                            invoiceTo={invoiceTo}
                            allowRetailerBilling={allowRetailerBilling}
                            customerDetails={customerDetails}
                            settingsBillingType={settingsBillingType}
                            deliveryLocation={deliveryLocation}
                            customerSearch={customerSearch}
                            isEmployeeSupport = {true}
                            isEmployee={true}
                          />
                         
                        </Row> */}

                        <SalesEntryForm
                          idBranch={idBranch}
                          ref={salesFormRef}
                          finYearName={finYearName}
                          finYear={finYear}
                          customer={customer}
                          setItemDetails={handleSalesItemData}
                          itemDetails={salesItemData}
                          customerDetails={customerDetails}
                          invoiceTo={invoiceTo}
                          settingsBillingType={settingsBillingType}
                          metal={metal}
                          productFieldRef={productFieldRef}
                          itemType={itemType}
                          employee={employee}
                        />
                      </TabPane>
                      <TabPane tabId="2">
                        <PurchaseForm
                          ref={purchaseFormRef}
                          onSubmit={handlePurchaseItem}
                          initialState={purchaseFormValues}
                          metal={metal}
                          tabIndex={11}
                          billTypeTab={billTypeTab}
                        />
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
                          />
                        </Row>
                      </TabPane>
                      <TabPane tabId="3">
                        <SalesReturnForm
                          ref={salesFormRef}
                          handleReturnItemCost={handleReturnItemCost}
                          onUpdateReturnItemData={handleReturnData}
                          idBranch={idBranch}
                          customer={customer}
                          finYearName={finYearName}
                          finYear={finYear}
                          initialReturnData={returnItemData}
                          billTypeTab={billTypeTab}
                        />
                      </TabPane>
                      <TabPane tabId="4">
                        <Row md={12} className="form-group row g-4 mb-3">
                          <Col md={12}>
                            <div
                              className="table-responsive"
                              style={{
                                marginTop: "16px",
                                overflowX: "auto",
                                maxHeight: "400px",
                                overflowY: "auto",
                              }}
                            >
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    {/* <th>Branch</th> */}
                                    <th>
                                      S.No
                                      <input
                                        type="checkbox"
                                        onChange={(event) => {
                                          selectAllItemDeliveredCol(
                                            event.target.checked
                                          );
                                          setSelectAllItemDelivered(
                                            event.target.checked
                                          );
                                        }}
                                        checked={selectAllItemDelivered}
                                      />{" "}
                                    </th>
                                    <th
                                      style={{
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 1,
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      Product
                                    </th>
                                    <th
                                      style={{
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 1,
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      Piece
                                    </th>
                                    <th
                                      style={{
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 1,
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      Weight
                                    </th>
                                    <th
                                      style={{
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 1,
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      Remarks
                                    </th>
                                    <th
                                      style={{
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 1,
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      Image
                                    </th>
                                    <th
                                      style={{
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 1,
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {itemDeliveredDetails?.length > 0 &&
                                    itemDeliveredDetails?.map(
                                      (item, rowIndex) => (
                                        <tr key={rowIndex}>
                                          {/* <td>
                                            <div
                                              className="form-group"
                                              style={{ width: "150px" }}
                                            >
                                              <BranchDropdown
                                                register={register}
                                                id={"branch" + rowIndex}
                                                branches={branches}
                                                selectedBranch={item?.branch}
                                                onBranchChange={(value) => {
                                                  handelItemDeliverChange(
                                                    rowIndex,
                                                    "branch",
                                                    value
                                                  );
                                                }}
                                                isRequired={true}
                                                clearErrors={clearErrors}
                                                setValue={setValue}
                                                message={
                                                  errors.branch &&
                                                  "Branch is Required"
                                                }
                                              />
                                            </div>
                                          </td> */}
                                          <td>
                                            {rowIndex + 1}
                                            <input
                                              type="checkbox"
                                              onChange={(event) => {
                                                handelItemDeliverChange(
                                                  rowIndex,
                                                  "isChecked",
                                                  event.target.checked
                                                );
                                              }}
                                              checked={item.isChecked}
                                            />{" "}
                                          </td>
                                          <td>
                                            <div style={{ width: "150px" }}>
                                              <ProductDropdown
                                                register={register}
                                                id={"product" + rowIndex}
                                                products={activeProductList}
                                                selectedProduct={item?.product}
                                                onProductChange={(value) => {
                                                  handelItemDeliverChange(
                                                    rowIndex,
                                                    "product",
                                                    value
                                                  );
                                                }}
                                                isRequired={false}
                                                clearErrors={clearErrors}
                                                setValue={setValue}
                                                classNamePrefix={
                                                  "custom-select"
                                                }
                                              />
                                            </div>
                                          </td>

                                          <td>
                                            <div style={{ width: "100px" }}>
                                              <NumberInputField
                                                placeholder="Pcs"
                                                id={"piece" + rowIndex}
                                                value={item?.piece}
                                                isRequired={true}
                                                min={0}
                                                type={"number"}
                                                setValue={setValue}
                                                handleKeyDownEvents={true}
                                                handleDecimalDigits={true}
                                                decimalValues={0}
                                                SetValue={(value) => {
                                                  handelItemDeliverChange(
                                                    rowIndex,
                                                    "piece",
                                                    value
                                                  );
                                                }}
                                                minError={
                                                  "Pcs should less than or equal to 0"
                                                }
                                                maxError={
                                                  "Pcs greater than or equal to 0"
                                                }
                                                reqValueError={
                                                  "Pcs is Required"
                                                }
                                                register={register}
                                              />
                                            </div>
                                          </td>
                                          <td>
                                            <div style={{ width: "100px" }}>
                                              <NumberInputField
                                                placeholder="Weight"
                                                id={"weight" + rowIndex}
                                                value={item?.weight}
                                                isRequired={true}
                                                min={0}
                                                type={"number"}
                                                setValue={setValue}
                                                handleKeyDownEvents={true}
                                                handleDecimalDigits={true}
                                                decimalValues={0}
                                                SetValue={(value) => {
                                                  handelItemDeliverChange(
                                                    rowIndex,
                                                    "weight",
                                                    value
                                                  );
                                                }}
                                                minError={
                                                  "Weight should less than or equal to 0"
                                                }
                                                maxError={
                                                  "Weight greater than or equal to 0"
                                                }
                                                reqValueError={
                                                  "Weight is Required"
                                                }
                                                register={register}
                                              />
                                            </div>
                                          </td>
                                          <td>
                                            <textarea
                                              id={"remarks" + rowIndex}
                                              placeholder="Remarks"
                                              style={{ minHeight: "2vw" }}
                                              rows="3"
                                              className="form-control form-control-sm"
                                              value={item.remarks}
                                              onChange={(e) => {
                                                handelItemDeliverChange(
                                                  rowIndex,
                                                  "remarks",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                            {/* <TextInputField
                                              register={register}
                                              placeholder="Remarks"
                                              id={"remarks" + rowIndex}
                                              value={item.remarks}
                                              isRequired={false}
                                              type={"text"}
                                              SetValue={(value) => {
                                                handelItemDeliverChange(
                                                  rowIndex,
                                                  "remarks",
                                                  value
                                                );
                                              }}
                                            /> */}
                                          </td>
                                          <td>
                                            <Button
                                              onClick={() =>
                                                imageToggle(rowIndex)
                                              }
                                            >
                                              Add Images
                                            </Button>
                                          </td>

                                          <td>
                                            {rowIndex ==
                                              itemDeliveredDetails?.length -
                                                1 && (
                                              <Button
                                                color="primary"
                                                size="sm"
                                                className="btn-icon btn-white btn-dim"
                                                onClick={() =>
                                                  addItemDelivered(rowIndex)
                                                }
                                              >
                                                <Icon name="plus" />
                                              </Button>
                                            )}
                                            {/* <Button
                                              color="primary"
                                              size="sm"
                                              className="btn-icon btn-white btn-dim"
                                              onClick={() =>
                                                deleteItemDelivery(
                                                  item?.id_item_delivered
                                                )
                                              }
                                            >
                                              <Icon name="trash-fill" />
                                            </Button> */}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                </tbody>
                                <tfoot></tfoot>
                              </table>
                            </div>
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                  </Col>
                </Row>
                <Row>
                  <Col md={3}>
                    <table
                      className="table table-bordered"
                      style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                      {parseFloat(totalSalesAmount) > 0 && (
                        <>
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
                        </>
                      )}
                      {parseFloat(totalPurchaseAmount) > 0 && (
                        <>
                          <tr>
                            <th>Purchase Amount</th>
                            <th style={{ textAlign: "right", color: "red" }}>
                              <CurrencyDisplay value={totalPurchaseAmount} />
                            </th>
                          </tr>
                        </>
                      )}
                      {parseFloat(totalReturnAmount) > 0 && (
                        <>
                          <tr>
                            <th>Return Amount</th>
                            <th style={{ textAlign: "right" }}>
                              <CurrencyDisplay value={totalReturnAmount} />
                            </th>
                          </tr>
                        </>
                      )}
                      {parseFloat(totalChitAdjustedAmount) > 0 && (
                        <>
                          <tr>
                            <th>Chit Amount</th>
                            <th style={{ textAlign: "right" }}>
                              <CurrencyDisplay
                                value={totalChitAdjustedAmount}
                              />
                            </th>
                          </tr>
                        </>
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
                              onWheel={(e) => e.target.blur()}
                              value={totalDiscount}
                              setValue={setValue}
                              min={0}
                              disabled={parseFloat(totalSalesAmount) === 0}
                              {...register(`totalDiscount`)}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("totalDiscount", value);
                              }}
                              onBlur={calculateDiscountAmount}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th style={{ fontSize: "15px", color: "Red" }}>
                          Net Amount ( Alt )
                        </th>
                        <td>
                          <div className="input-group">
                            <input
                              id={`totalNetAmount`}
                              type="number"
                              className="form-control no-spinner"
                              onWheel={(e) => e.target.blur()}
                              value={totalNetAmount}
                              setValue={setValue}
                              min={0}
                              {...register(`totalNetAmount`)}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("totalNetAmount", value);
                              }}
                              onBlur={calculateDiscountAmount}
                              ref={netAmountRef}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>Gst No</th>
                        <td>
                          <GstInputField
                            register={register}
                            isRequired={false}
                            id={"gstNumber"}
                            placeholder="GST Number"
                            value={gstNumber}
                            SetValue={(value) => {
                              setGstNumber(value);
                              clearErrors("gstNumber");
                            }}
                          />
                          {errors?.gstNumber && (
                            <span className="text-danger">
                              {errors?.gstNumber.message}
                            </span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>Pan No</th>
                        <td>
                          <PanInputField
                            register={register}
                            isRequired={false}
                            id={"panNumber"}
                            placeholder="Pan Number"
                            value={panNumber}
                            SetValue={(value) => {
                              setPanNumber(value);
                              clearErrors("panNumber");
                            }}
                          />
                          {errors?.panNumber && (
                            <span className="text-danger">
                              {errors?.panNumber.message}
                            </span>
                          )}
                        </td>
                      </tr>
                    </table>
                  </Col>
                  <Col md={4}>
                    <table
                      className="table table-bordered"
                      style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                      {parseFloat(refundAmount) > 0 && (
                        <>
                          <tr>
                            <th>Refund Amount</th>
                            <td>
                              <div className="input-group">
                                <div className="input-group-append">
                                  <span className="input-group-text">
                                    {getCurrencySymbol(
                                      userInfo?.user?.currency_code
                                    )}
                                  </span>
                                </div>
                                <input
                                  id={`refundAmount`}
                                  type="number"
                                  className="form-control no-spinner"
                                  onWheel={(e) => e.target.blur()}
                                  value={refundAmount}
                                  setValue={setValue}
                                  min={0}
                                  {...register(`refundAmount`)}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    handleInputChange("refundAmount", value);
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        </>
                      )}
                      <tr>
                        <th>Received Amount</th>
                        <td>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                {getCurrencySymbol(
                                  userInfo?.user?.currency_code
                                )}
                              </span>
                            </div>
                            <input
                              id={`totalAmountReceived`}
                              type="number"
                              className="form-control no-spinner"
                              onWheel={(e) => e.target.blur()}
                              value={totalAmountReceived}
                              min={0}
                              readOnly={!isCredit}
                              setValue={setValue}
                              {...register(`totalAmountReceived`)}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("totalAmountReceived", value);
                              }}
                            />
                            <div className="input-group-append">
                              {/* <div className="input-group-text">
                                <input
                                  type="checkbox"
                                  className=""
                                  id="isCredit"
                                  name={isCredit}
                                  checked={isCredit}
                                  disabled={totalBillAmount < 0}
                                  onChange={(e) =>
                                    setIsCredit(e.target.checked)
                                  }
                                />
                              </div> */}
                              <div className="input-group-text">
                                <input
                                  type="checkbox"
                                  className=""
                                  id="isCredit"
                                  name={isCredit}
                                  checked={isCredit}
                                  disabled={totalBillAmount < 0}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setIsCredit(checked);
                                    setBillTypeTab(checked ? "4" : "1");
                                    selectAllItemDeliveredCol(checked);
                                    setSelectAllItemDelivered(checked);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {isCredit && (
                        <>
                          <tr>
                            <th>Due Amount</th>
                            <td>
                              <div className="input-group">
                                <div className="input-group-append">
                                  <span className="input-group-text">
                                    {getCurrencySymbol(
                                      userInfo?.user?.currency_code
                                    )}
                                  </span>
                                </div>
                                <input
                                  id={`dueamount`}
                                  readOnly={true}
                                  type="number"
                                  className="form-control no-spinner"
                                  onWheel={(e) => e.target.blur()}
                                  value={
                                    parseFloat(isUndefined(totalNetAmount)) > 0
                                      ? parseFloat(
                                          parseFloat(
                                            isUndefined(totalNetAmount)
                                          ) -
                                            parseFloat(
                                              isUndefined(totalAmountReceived)
                                            )
                                        ).toFixed(2)
                                      : 0
                                  }
                                  min={0}
                                  {...register(`dueamount`)}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    handleInputChange("dueamount", value);
                                  }}
                                />
                                {/* <input
                                      id={`depositAmount`}
                                      type="number"
                                      className="form-control"
                                      value={depositAmount}
                                      min={0}
                                      {...register(`depositAmount`)}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        handleInputChange("depositAmount", value);
                                      }}
                                    /> */}
                              </div>
                            </td>
                          </tr>
                        </>
                      )}

                      <tr>
                        <th>Payment Amount</th>
                        <td>
                          <div className="input-group">
                            <div className="input-group-append">
                              <span className="input-group-text">
                                {getCurrencySymbol(
                                  userInfo?.user?.currency_code
                                )}
                              </span>
                            </div>
                            <input
                              id={`totalPaymentAmount`}
                              type="number"
                              className="form-control no-spinner"
                              onWheel={(e) => e.target.blur()}
                              value={totalPaymentAmount}
                              setValue={setValue}
                              min={0}
                              {...register(`totalPaymentAmount`)}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("totalPaymentAmount", value);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                      {parseFloat(totalAdjustedAmount) > 0 && (
                        <>
                          <tr>
                            <th>Adjusted Amount</th>
                            <td>
                              <div className="input-group">
                                <div className="input-group-append">
                                  <span className="input-group-text">
                                    {getCurrencySymbol(
                                      userInfo?.user?.currency_code
                                    )}
                                  </span>
                                </div>
                                <input
                                  id={`totalAdjustedAmount`}
                                  type="number"
                                  className="form-control no-spinner"
                                  onWheel={(e) => e.target.blur()}
                                  value={totalAdjustedAmount}
                                  setValue={setValue}
                                  readOnly={true}
                                  min={0}
                                  {...register(`totalAdjustedAmount`)}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    handleInputChange(
                                      "totalAdjustedAmount",
                                      value
                                    );
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        </>
                      )}
                      {parseFloat(giftVoucherAmount) > 0 && (
                        <>
                          <tr>
                            <th>Gift Amount</th>
                            <td>
                              <div className="input-group">
                                <div className="input-group-append">
                                  <span className="input-group-text">
                                    {getCurrencySymbol(
                                      userInfo?.user?.currency_code
                                    )}
                                  </span>
                                </div>
                                <input
                                  id={`giftVoucherAmount`}
                                  type="number"
                                  className="form-control no-spinner"
                                  onWheel={(e) => e.target.blur()}
                                  value={giftVoucherAmount}
                                  setValue={setValue}
                                  readOnly={true}
                                  min={0}
                                  {...register(`giftVoucherAmount`)}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    handleInputChange(
                                      "giftVoucherAmount",
                                      value
                                    );
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        </>
                      )}
                      {/* {parseFloat(totalChitAdjustedAmount) > 0 && (
                        <>
                          <tr>
                            <th>Chit Amount</th>
                            <td>
                              <div className="input-group">
                                <div className="input-group-append">
                                  <span className="input-group-text">
                                    {getCurrencySymbol(
                                      userInfo?.user?.currency_code
                                    )}
                                  </span>
                                </div>
                                <input
                                  id={`totalChitAdjustedAmount`}
                                  type="number"
                                  className="form-control no-spinner"
                                  onWheel={(e) => e.target.blur()}
                                  value={totalChitAdjustedAmount}
                                  setValue={setValue}
                                  readOnly={true}
                                  min={0}
                                  {...register(`totalChitAdjustedAmount`)}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    handleInputChange(
                                      "totalChitAdjustedAmount",
                                      value
                                    );
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        </>
                      )} */}
                      {parseFloat(totalDepositAdjustedAmount) > 0 && (
                        <>
                          <tr>
                            <th>Deposit Adj. Amount</th>
                            <td>
                              <div className="input-group">
                                <div className="input-group-append">
                                  <span className="input-group-text">
                                    {getCurrencySymbol(
                                      userInfo?.user?.currency_code
                                    )}
                                  </span>
                                </div>
                                <input
                                  id={totalDepositAdjustedAmount}
                                  type="number"
                                  className="form-control no-spinner"
                                  onWheel={(e) => e.target.blur()}
                                  value={totalDepositAdjustedAmount}
                                  setValue={setValue}
                                  readOnly={true}
                                  min={0}
                                  {...register(totalDepositAdjustedAmount)}
                                  // onChange={(e) => {
                                  //   const value = e.target.value;
                                  //   handleInputChange(
                                  //     "totalDepositAdjustedAmount",
                                  //     value
                                  //   );
                                  // }}
                                />
                              </div>
                            </td>
                          </tr>
                        </>
                      )}
                      {parseFloat(refundAmount) > 0 && (
                        <>
                          <tr>
                            <th>Deposit Amount</th>
                            <td>
                              <div className="input-group">
                                <div className="input-group-append">
                                  <span className="input-group-text">
                                    {getCurrencySymbol(
                                      userInfo?.user?.currency_code
                                    )}
                                  </span>
                                </div>
                                <input
                                  id={`depositAmount`}
                                  type="number"
                                  className="form-control no-spinner"
                                  onWheel={(e) => e.target.blur()}
                                  value={depositAmount}
                                  min={0}
                                  {...register(`depositAmount`)}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    handleInputChange("depositAmount", value);
                                  }}
                                />
                                {/* <input
                                      id={`depositAmount`}
                                      type="number"
                                      className="form-control"
                                      value={depositAmount}
                                      min={0}
                                      {...register(`depositAmount`)}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        handleInputChange("depositAmount", value);
                                      }}
                                    /> */}
                              </div>
                            </td>
                          </tr>
                        </>
                      )}
                      <tr>
                        <th>Balance Amount</th>
                        <td>
                          <div className="input-group">
                            <div className="input-group-append">
                              <span className="input-group-text">
                                {getCurrencySymbol(
                                  userInfo?.user?.currency_code
                                )}
                              </span>
                            </div>
                            <input
                              id={`balanceAmount`}
                              type="number"
                              className="form-control no-spinner"
                              onWheel={(e) => e.target.blur()}
                              value={balanceAmount}
                              {...register(`balanceAmount`)}
                              onChange={(e) => {
                                const value = e.target.value;
                                setValue(`balanceAmount`, value);
                                clearErrors(`balanceAmount`);
                              }}
                            />
                          </div>
                        </td>
                      </tr>

                      {paymentModeData?.map((payItem, payIdx) => (
                        <>
                          {payItem?.payment_amount > 0 && (
                            <tr key={payIdx}>
                              <th>{payItem?.mode_name}</th>
                              <td>
                                <div className="input-group">
                                  <div className="input-group-append">
                                    <span className="input-group-text">
                                      {getCurrencySymbol(
                                        userInfo?.user?.currency_code
                                      )}
                                    </span>
                                  </div>
                                  <input
                                    disabled
                                    type="number"
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    value={payItem?.payment_amount}
                                  />
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </table>
                  </Col>
                  <Col md={5}>
                    <PaymentModeComponent
                      ref={paymentFormRef}
                      onUpdateFormData={handlePaymentData}
                      onUpdateAdvanceFormData={handleAdvanceAdjustmentData}
                      onUpdateDepositFormData={handleDepositAdjustmentData}
                      onUpdateChitFormData={handleChitAdjustmentData}
                      onUpdateGiftFormData={handleGiftFormData}
                      onUpdateLoyaltyFormData={handleGiftFormData}
                      customer={customer}
                      isAdvanceAdjustment
                      isChitAdjustment
                      isSchemeAccountSearchReq
                      isGift
                      isLoyalty
                      isDepositAdjustment={true}
                      totalVA={totalVA}
                      totalMC={totalMC}
                      totalWeight={totalGrossWeight}
                      metalPurityRateList={metalPurityRateList}
                      metalRateInfo={metalRateInfo}
                      initialAmountReceived={totalAmountReceived}
                      totalSalesAmount={totalSalesAmount}
                      salesItemData={salesItemData}
                      metalId={metal}
                    />
                  </Col>
                </Row>
                 <Row lg={12}>
                    <div className="form-group">
                      <label className="form-label">
                        Remarks
                      </label>
                    </div>
                    <div className="form-control-wrap">
                      <textarea
                        {...register("remarks")}
                        rows="4"
                        className="form-control form-control-sm"
                        type="text"
                        value={remarks}
                        onChange={(e) => {
                          setRemarks(e.target.value);
                          if (clearErrors) {
                            clearErrors("remarks");
                          }
                        }}
                      />
                      
                    </div>
                </Row>
              </div>
            </Row>
          </PreviewCard>
        </Content>
      </FormProvider>
      <MultiImageDropzone
        modal={imageModal}
        toggle={toggleImageModal}
        files={itemDeliveredDetails[activeRow]?.images || []}
        setFiles={(files) => {
          setItemDeliveredDetails((prevDetails) =>
            prevDetails?.map((item, index) =>
              index === activeRow ? { ...item, images: files } : item
            )
          );
        }}
        handleDropChange={handleDropChange}
        rowImageUpload={true}
        activeRow={activeRow}
      />
      <DeleteModal
        actionName={"Delete"}
        modal={deleteModal}
        toggle={toggle}
        name={"Item"}
        title={"Billing"}
        clickAction={deleteSaleItem}
      />
      <BillingSaveModal
        modal={billingSaveModel}
        toggle={billingToggle}
        actionName={billModalActionName}
        title={billModalName}
        clickAction={handelBillSaveThroughModel}
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
    </React.Fragment>
  );
}

export default BillingForm;
