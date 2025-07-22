/* eslint-disable no-unused-expressions */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Content from "../../../layout/content/Content";
import { Icon, PreviewCard } from "../../../components/Component";
import { secureStorage_login_branches } from "../../../redux/configs";
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
  MetalDropdown,
} from "../../../components/filters/retailFilters";
import { useForm, FormProvider } from "react-hook-form";
import {
  TextInputField,
  GstInputField,
  PanInputField,
  NumberInputField,
} from "../../../components/form-control/InputGroup";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";

import {
  useBranches,
  useEmployeeDropdown,
  useMetals,
  useProducts,
} from "../../../components/filters/filterHooks";
import { useNavigate } from "react-router-dom";
import PreviewTable from "../../../components/sds-table/PreviewTable";
import Select from "react-select";
import useBillingFormWholesaleHandling from "./useBillingFormWholesaleHandling";
import PaymentModeComponent from "../../../components/common/payment/PaymentModeComponent";
import getCurrencySymbol from "../../../components/common/moneyFormat/currencySymbol";
import DeleteModal from "../../../components/modals/DeleteModal";
import ReturnForm from "../../../components/common/salesForm/returnForm";
import { getAllFinancialYear } from "../../../redux/thunks/retailMaster";
import CreateCustomerConfirmation from "../../../components/modals/CreateCustomerConfirmation";
import { Typeahead } from "react-bootstrap-typeahead";
import { searchCustomer } from "../../../redux/thunks/customer";
import { useHotkeys } from "react-hotkeys-hook";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import Head from "../../../layout/head/Head";
import { isUndefined } from "../../../components/common/calculations/ErpCalculations";
import EmployeeModal from "../../../components/modals/EmployeeModal";
import SalesReturnForm from "../../../components/common/salesForm/salesReturnForm";
import SalesEntryForm from "../../../components/common/salesForm/salesEntryForm";
import MultiImageDropzone from "../../../components/modals/MultiImageDropzone";
import "../../../assets/css/billing_form.css";
import { employee_id } from "../../../redux/configs";
import PurchaseEntryForm from "../../purchase/PurchaseEntry";

function BillingFormWholesale(props) {
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [billTypeTab, setBillTypeTab] = useState("1");
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const { financialYearList } = useSelector(
    (state) => state.financialYearReducer
  );
  const { searchCustomerList } = useSelector((state) => state.customerReducer);
  const { activeProductList } = useSelector((state) => state.productReducer);
  const [billNo, setBillNo] = useState("");
  const { branches } = useBranches();
  const { employees } = useEmployeeDropdown();
  const { metals } = useMetals();
  const { products } = useProducts();
  const { activeEmployeeDropdown } = useSelector(
    (state) => state.employeeReducer
  );
  const methods = useForm();
  const productFieldRef = useRef(null);
  const estFieldRef = useRef(null);
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
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
    totalSalesPureWeight,
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
    SetMetal,
    metal,
    navigateModalOpened,
    setNavigateModalOpened,
    ratePerGram,
    setRatePerGram,
    setPurchaseItemData,
    handlePurchaseAddItem,
    totalPurchasePureWeight,
  } = useBillingFormWholesaleHandling(setBillTypeTab);

  useHotkeys("f1", (event) => {
    event.preventDefault();
    setBillTypeTab("1");
  });

  useHotkeys("f2", (event) => {
    event.preventDefault();
    setBillTypeTab("2");
  });

  useHotkeys("f3", (event) => {
    event.preventDefault();
    setBillTypeTab("3");
  });

  useHotkeys("f4", (event) => {
    event.preventDefault();
    setBillTypeTab("4");
  });

  useHotkeys(
    "ctrl+a",
    (event) => {
      event.preventDefault();
      if (billTypeTab === "1") {
        handleSalesAddItem();
      }
      if (billTypeTab === "2") {
        handlePurchaseAddItem();
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
        let defaultFinYear = finYearDetails?.rows.find(
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
        console.log("Opening Modal...");
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
      let column = columns.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    onClickSave();
  });

  useEffect(() => {
    if (employee_id !== undefined) {
      SetEmployee(employee_id);
    }
  }, [employee_id]);

  useEffect(() => {
    console.log("Item Type Changed:", itemType);
    if (itemType === 2) {
      setTimeout(() => {
        console.log("Checking ref before focus:", productFieldRef.current);
        if (productFieldRef?.current) {
          console.log("Focusing on Product Dropdown...");
          productFieldRef.current.focus();
        } else {
          console.error("Ref is still not assigned! Waiting more time...");
          setTimeout(() => {
            if (productFieldRef?.current) {
              console.log("Focusing on Product Dropdown (after waiting)...");
              productFieldRef.current.focus();
            } else {
              console.error("Still not assigned after extra delay!");
            }
          }, 100);
        }
      }, 100);
    }
  }, [itemType, salesItemData?.length]);

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
                    secureStorage_login_branches.length == 1 ? "none" : "",
                }}
              >
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
                    message={errors.branch && "Branch is Required"}
                    classNamePrefix="custom-select"
                  />
                </div>
              </Col>
              {settings?.is_metal_wise_billing == "1" && (
                <Col md={1} style={{ padding: "0px", display: "none" }}>
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
              )}
              {/* <Col md="2"  style={{ paddingRight:"0px"}} >
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
              </Col> */}

              <Col md={2}>
                <div className="form-control-wrap">
                  <Typeahead
                    id="customerSearch"
                    labelKey="label"
                    onChange={(e) => {
                      if (e?.length > 0) {
                        console.log("Selected Customer:", e);
                        SetCustomer(e[0]?.value), SetCustomerSearch(e);
                        //setFirstname(e[0]?.firstname);
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
                <div className={"form-group"}>
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
                    message={errors.employee && "Employee is Required"}
                    classNamePrefix="custom-select"
                  />
                </div>
              </Col>

              <Col md={2} style={{ display: "none" }}>
                <div className={"form-control-sm"}>
                  <select
                    className="form-control form-select"
                    id="deliveryLocation"
                    {...register("deliveryLocation", {
                      required: true,
                    })}
                    value={deliveryLocation}
                    onChange={(e) => {
                      setDeliveryLocation(e.target.value);
                    }}
                  >
                    {deliveryLocationOptions?.map((item, index) => (
                      <option value={item?.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
              </Col>

              <Col md={3} className="text-right">
                <Button
                  disabled={isSubmitted}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/estimation/list`)
                  }
                >
                  Cancel
                </Button>{" "}
                <Button
                  color="primary"
                  disabled={isSubmitted || parseFloat(balanceAmount) !== 0}
                  size="md"
                  onClick={onClickSave}
                >
                  {isSubmitted ? "Saving" : "Save[ctrl+s]"}
                </Button>
              </Col>
            </Row>

            <Row></Row>

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
                  {/* <NavItem>
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
                  </NavItem> */}
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

                  <Col md={1}>
                    <div
                      className="form-control-wrap"
                      style={{ marginTop: "10px" }}
                    >
                      <div className="input-group">
                        <div
                          className="input-group-append"
                          style={{ width: "70%" }}
                        >
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
                            onChange={(e) => {
                              let inputValue = e.target.value;
                              setEstNo(inputValue);
                              clearErrors("estNo");
                            }}
                          />
                        </div>
                        <div
                          className="input-group-append"
                          style={{ height: "29px", width: "30%" }}
                        >
                          <Button
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
                          options.find((option) => option.value === itemType) ||
                          null
                        }
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
                        ref={estFieldRef} // Apply the ref
                      />
                    </Col>
                  )}
                  {(itemType === 1 || itemType === 2) &&
                    billTypeTab === "1" && (
                      <Col md={1} className="form-control-sm mt-1">
                        <Button
                          color="primary"
                          className="btn-sm"
                          onClick={() => handleSalesAddItem()}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Sales Add
                        </Button>
                      </Col>
                    )}

                  {billTypeTab === "2" && (
                    <Col md={1} className="form-control-sm mt-1 ms-3">
                      <Button
                        color="primary"
                        className="btn-sm"
                        onClick={() => handlePurchaseAddItem()}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Purchase Add
                      </Button>
                    </Col>
                  )}

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
                          productFieldRef={productFieldRef}
                          metal={metal}
                          ratePerGram={ratePerGram}
                          itemType={itemType}
                        />
                      </TabPane>
                      <TabPane tabId="2">
                        {/* <PurchaseForm
                          ref={purchaseFormRef}
                          onSubmit={handlePurchaseItem}
                          initialState={purchaseFormValues}
                          tabIndex={11}
                        />
                        <Col md={3} className="form-control-sm">
                          <Button
                            color="primary"
                            className="btn"
                            onClick={handlePurchaseAddPreview}
                          >
                            Add to Preview
                          </Button>
                        </Col>
                        <Row md={12}>
                          <PreviewTable
                            columns={purchaseColumns}
                            data={purchaseItemData}
                            onDelete={handlePurchaseDelete}
                            onEdit={handlePurchaseEdit}
                          />
                        </Row> */}
                        <PurchaseEntryForm
                          setItemDetails={setPurchaseItemData}
                          itemDetails={purchaseItemData}
                          metal={metal}
                          ratePerGram={ratePerGram}
                        />
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
                        />
                      </TabPane>
                    </TabContent>
                  </Col>
                </Row>
                <Row>
                  <Col md={3}>
                    <table className="table table-bordered">
                      <tr>
                        <th>Sales Pure wt</th>
                        <th style={{ textAlign: "right" }}>
                          {totalSalesPureWeight}
                        </th>
                      </tr>
                      <tr>
                        <th>Purchase Pure wt</th>
                        <th style={{ textAlign: "right" }}>
                          {totalPurchasePureWeight}
                        </th>
                      </tr>
                      <tr>
                        <th>Balance Pure wt</th>
                        <th style={{ textAlign: "right" }}>
                          {parseFloat(
                            totalSalesPureWeight - totalPurchasePureWeight
                          ).toFixed(3)}
                        </th>
                      </tr>
                      <tr>
                        <th>Rate </th>
                        <td style={{ textAlign: "right" }}>
                          <NumberInputField
                            placeholder="Rate"
                            id={"ratePerGram"}
                            value={ratePerGram}
                            isRequired={true}
                            readOnly={false}
                            min={0}
                            type={"number"}
                            setValue={setValue}
                            handleKeyDownEvents={true}
                            handleDecimalDigits={true}
                            decimalValues={0}
                            SetValue={(value) => {
                              setRatePerGram(value);
                            }}
                            minError={"Rate should less than or equal to 0"}
                            maxError={"Rate greater than or equal to 0"}
                            reqValueError={"Rate is Required"}
                            register={register}
                            textAlign={"right"}
                          />
                        </td>
                      </tr>
                      {/* <tr>
                        <th>Taxable Amount</th>
                        <th style={{ textAlign: "right" }}>
                          <CurrencyDisplay value={totalTaxableAmount} />
                        </th>
                      </tr> */}

                      {/* <tr>
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
                        <th>Purchase Amount</th>
                        <th style={{ textAlign: "right", color: "red" }}>
                          <CurrencyDisplay value={totalPurchaseAmount} />
                        </th>
                      </tr>
                      <tr>
                        <th>Return Amount</th>
                        <th style={{ textAlign: "right" }}>
                          <CurrencyDisplay value={totalReturnAmount} />
                        </th>
                      </tr> */}
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
                        <th>Net Amount</th>
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
                            />
                          </div>
                        </td>
                      </tr>
                      {/* <tr>
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
                      </tr> */}
                    </table>
                  </Col>
                  <Col md={4}>
                    <table className="table table-bordered">
                      {/* <tr>
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
                              className="form-control"
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
                      </tr> */}

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
                              <div className="input-group-text">
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
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>

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

                      {/* <tr>
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
                              className="form-control"
                              value={totalAdjustedAmount}
                              setValue={setValue}
                              readOnly={true}
                              min={0}
                              {...register(`totalAdjustedAmount`)}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("totalAdjustedAmount", value);
                              }}
                            />
                          </div>
                        </td>
                      </tr> */}

                      {/* <tr>
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
                              className="form-control"
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
                      </tr> */}

                      {/* <tr>
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
                              className="form-control"
                              value={totalDepositAdjustedAmount}
                              min={0}
                              {...register(`depositAmount`)}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("depositAmount", value);
                              }}
                            />
                          
                          </div>
                        </td>
                      </tr> */}
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
                                console.log(value);
                                setValue(`balanceAmount`, value);
                                clearErrors(`balanceAmount`);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    </table>
                  </Col>
                  <Col md={5}>
                    <PaymentModeComponent
                      ref={paymentFormRef}
                      onUpdateFormData={handlePaymentData}
                      onUpdateAdvanceFormData={handleAdvanceAdjustmentData}
                      onUpdateDepositFormData={handleDepositAdjustmentData}
                      onUpdateChitFormData={handleChitAdjustmentData}
                      customer={customer}
                      isAdvanceAdjustment
                      isChitAdjustment
                      isSchemeAccountSearchReq
                      isDepositAdjustment
                      totalVA={totalVA}
                      totalMC={totalMC}
                      totalWeight={totalGrossWeight}
                      metalPurityRateList={metalPurityRateList}
                      metalRateInfo={metalRateInfo}
                      initialAmountReceived={totalAmountReceived}
                    />
                  </Col>
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
            prevDetails.map((item, index) =>
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

export default BillingFormWholesale;
