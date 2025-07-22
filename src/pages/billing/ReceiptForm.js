import React, { useEffect, useRef, useState } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Icon, PreviewCard } from "../../components/Component";
import { Button, Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import {
  useBranches,
  useEmployeeDropdown,
  useAccountHeadDropdown,
  useSchemes,
} from "../../components/filters/filterHooks";
import {
  ActiveEmployeeDropdown,
  BranchDropdown,
  CreditTypeDropdown,
  IssueToDropdown,
  IssueTypeDropdown,
  ReceiptTypeDropdown,
  SchemeDropdown,
  SelectDropdown,
} from "../../components/filters/retailFilters";
import { Typeahead } from "react-bootstrap-typeahead";
import { searchCustomer } from "../../redux/thunks/customer";
import CreateCustomerConfirmation from "../../components/modals/CreateCustomerConfirmation";
import PaymentModeComponent from "../../components/common/payment/PaymentModeComponent";
import getCurrencySymbol from "../../components/common/moneyFormat/currencySymbol";
import {
  toastfunc,
  toastsuccess,
} from "../../components/sds-toast-style/toast-style";
import {
  createIssueReceipt,
  getAdvanceDetails,
  getIssueCreditList,
} from "../../redux/thunks/billing";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import IsRequired from "../../components/erp-required/erp-required";
import {
  InputGroupDropdown,
  NumberInputField,
} from "../../components/form-control/InputGroup";
import { getAllFinancialYear } from "../../redux/thunks/retailMaster";
import ReceiptCreditModal from "../../components/modals/ReceiptCreditModal";
import AdvanceRefundModal from "../../components/modals/AdvanceRefundModal";
import {
  getOrderDropdown,
  getRepairOrderDeliveryDetails,
} from "../../redux/thunks/Order";
import { useHotkeys } from "react-hotkeys-hook";
import { useBillSettingContext } from "../../contexts/BillSettingContext";
import { getAllScheme } from "../../redux/thunks/scheme";
import secureLocalStorage from "react-secure-storage";

const ReceiptForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const title = location?.state?.title;
  const { customerId } = location.state || {};
  const customerSearchValue = location?.state?.customerSearchValue;
  const { isLoading: isSubmitting } = useSelector(
    (state) => state.paymentMasterReducer
  );
  const { searchCustomerList } = useSelector((state) => state.customerReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const { metalRateInfo } = useSelector((state) => state.metalRateReducer);
  const { billSettingType } = useBillSettingContext();
  const loginpref = secureLocalStorage.getItem("pref")?.pref;

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();
  const { branches } = useBranches();
  const { employees } = useEmployeeDropdown();
  const { schemes } = useSchemes();

  const [navigateModal, SetNavigateModal] = useState(false);
  const [createMobNum, SetCreateMobNum] = useState();
  const toggleNavigateModal = () => SetNavigateModal(!navigateModal);
  const { financialYearList } = useSelector(
    (state) => state.financialYearReducer
  );
  const { orderDropdown } = useSelector((state) => state.orderReducer);
  const { issueCreditsList } = useSelector((state) => state.receiptReducer);
  const { advanceDetails } = useSelector((state) => state.billingReducer);
  const { repairOrderList } = useSelector((state) => state.orderReducer);
  const { bankList } = useSelector((state) => state.bankReducer);
  const {
    userInfo: { settings, issue_reciept_settings },
  } = useSelector((state) => state.authUserReducer);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [idBranch, setIdBranch] = useState(location?.state?.id_branch || "");
  const [remarks, setRemarks] = useState("");
  const [type, setType] = useState(2);
  const [receiptType, setReceiptType] = useState(
    location?.state?.receipt_type || null
  );
  const [creditType, setCreditType] = useState(1);
  const [issueType, setIssueType] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [scheme, SetScheme] = useState(null);
  const [issueTo, setIssueTo] = useState(null);
  const [accHead, setAccHead] = useState(null);
  const [idBank, setIdBank] = useState(null);
  const [depositBill, setDepositBill] = useState(null);
  const [customer, setCustomer] = useState(location?.state?.customer || null);
  const [customerSearch, setCustomerSearch] = useState(
    location?.state?.customerSearch || null
  );
  const [payableAmount, setPayableAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [creditDataAmount, setCreditDataAmount] = useState(0);
  const [refundDataAmount, setRefundDataAmount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [checkAmount, setCheckAmount] = useState(false);
  const [paymentModeData, setPaymentModeData] = useState([]);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [finYear, setFinYear] = useState(0);
  const [orderno, setOrderno] = useState(location?.state?.orderId || null);
  const [advanceAdjustedData, setAdvanceAdjustedData] = useState([]);
  const [chitAdjustedData, setChitAdjustedData] = useState([]);
  const [totalAdjustedAmount, setTotalAdjustedAmount] = useState(0);
  const [totalChitAdjustedAmount, setTotalChitAdjustedAmount] = useState(0);
  const [weight, setWeight] = useState(0);
  const [chitweight, setChitWeight] = useState(0);
  const [inputType, setInputType] = useState();
  const [navigateModalOpened, setNavigateModalOpened] = useState(false);
  const customerInputRef = useRef();
  const { accountHead } = useAccountHeadDropdown({filterOptions:true, filterType:type});
  const paymentFormRef = useRef(null);
  let bankingOptions = [];

  if (bankList?.rows?.length > 0) {
    bankingOptions = bankList?.rows.map((val) => ({
      value: val.id_bank,
      label: val.bank_name,
    }));
  }

  console.log(location, "location");

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      handleSubmit(postData)();
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  // useEffect(() => {
  //   if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
  //     if (location.state) {
  //       const updatedState = { ...location.state, customer: '', orderId: '', receipt_type: '', customerSearch: [], id_branch: "" };
  //       navigate(location.pathname, { state: updatedState, replace: true });

  //       setReceiptType(null);
  //       setCustomer(null);
  //       setCustomerSearch(null);
  //       setIdBranch(null);
  //       setOrderno(null);

  //     }

  //   }
  // }, [dispatch]);

  const handlePaymentData = (data) => {
    setPaymentModeData(data);
    const totalPaidAmount = data.reduce((sum, item) => {
      return sum + parseFloat(item.payment_amount || 0);
    }, 0);
    if (parseFloat(totalPaidAmount) > parseFloat(payableAmount)) {
      setCheckAmount(true);
      toastfunc("Entered amount exceeded Payable amount");

      let blnc = parseFloat(payableAmount) - parseFloat(totalPaidAmount);
      setBalanceAmount(blnc);
    } else {
      let blnc = parseFloat(payableAmount) - parseFloat(totalPaidAmount);
      setBalanceAmount(blnc);

      setTotalPaymentAmount(totalPaidAmount);
    }
  };

  const handleAdvanceAdjustmentData = (data) => {
    setAdvanceAdjustedData(data);
    const advanceAdjAmount = data?.reduce((sum, item) => {
      return sum + parseFloat(item.utilized_amount || 0);
    }, 0);
    setTotalAdjustedAmount(advanceAdjAmount);
  };

  useEffect(() => {
    if (customer !== "" && customer !== null && receiptType === 6) {
      if (repairOrderList.length > 0) {
        const totalAmount = repairOrderList?.reduce((sum, item) => {
          return sum + parseFloat(item.total_charges || 0);
        }, 0);
        setPayableAmount(totalAmount);
      } else {
        toastfunc("Repair Order Details Not Available");
      }
    }
  }, [repairOrderList]);

  const handleChitAdjustmentData = (data) => {
    setChitAdjustedData(data);
    const chitAdjAmount = data?.reduce((sum, item) => {
      return sum + parseFloat(item.closing_amount || 0);
    }, 0);
    setTotalChitAdjustedAmount(chitAdjAmount);
  };

  useEffect(() => {
    let currentFinYear = financialYearList?.rows?.find(
      (option) => option.is_active == true
    );
    setFinYear(currentFinYear?.fin_id);
  }, [financialYearList?.rows]);

  useEffect(() => {
    if (receiptType === 2 && finYear !== 0) {
      if (idBranch === "" || idBranch === null) {
        toastfunc("Please select the Branch");
      } else if (customer === "" || customer === null) {
        toastfunc("Please select the Customer");
      } else if (receiptType === "" || receiptType === null) {
        toastfunc("Please select the REceipt Type");
      } else {
        dispatch(
          getOrderDropdown({
            branch: idBranch,
            customer: customer,
            fin_year: finYear,
          })
        );
      }
    }
  }, [receiptType, finYear, dispatch, idBranch, customer]);

  useEffect(() => {
    if (
      (issueType === 2 || receiptType === 5) &&
      totalPaymentAmount === 0 &&
      payableAmount === 0
    ) {
      setIsSaveButtonDisabled(false);
    }
    if (
      issueType !== 2 &&
      receiptType !== 5 &&
      totalPaymentAmount !== 0 &&
      payableAmount !== 0
    ) {
      if (parseFloat(payableAmount).toFixed(2) === totalPaymentAmount) {
        setIsSaveButtonDisabled(false);
      } else {
        setIsSaveButtonDisabled(true);
      }
    }
    let blnc = parseFloat(payableAmount) - parseFloat(totalPaymentAmount);
    setBalanceAmount(blnc);
    if (blnc === 0) {
      setIsSaveButtonDisabled(false);
    }
  }, [totalPaymentAmount, payableAmount, issueType, receiptType]);

  useEffect(() => {
    dispatch(getAllFinancialYear());
    dispatch(getAllScheme());
  }, [dispatch]);

  useEffect(() => {
    if (type == 2) {
      setIssueType(null);
    }
    if (type == 1) {
      setReceiptType(null);
    }
  }, [type]);

  // useEffect(() => {
  //   if (
  //     isSearching &&
  //     customerSearch?.length > 0 &&
  //     customerSearch[0]?.label.length >= 5 &&
  //     customer == null
  //   ) {
  //     const searchKey = inputType === "number" ? "mob_num" : "name";
  //     dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
  //   }
  // }, [isSearching, customerSearch, customer, dispatch, inputType]);

  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      inputType === "text" &&
      customerSearch[0]?.label?.length > 0 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      inputType === "number" &&
      customerSearch[0]?.label?.length >= 5 &&
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
  //     searchCustomerList?.length === 0
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

  const navigateCreateCustomer = () => {
    navigate(
      {
        pathname: `${process.env.PUBLIC_URL}/master/customer/add`,
      },
      {
        state: {
          add: true,
          createMobNum: createMobNum,
          navigateLink: `/receipt/add`,
        },
      }
    );
  };

  useEffect(() => {
    if (customerSearchValue && customerId) {
      setCustomer(customerId);
      setCustomerSearch(customerSearchValue);
    }
  }, [customerId, customerSearchValue]);

  const [modal, setModal] = useState(false);
  const [creditData, setCreditData] = useState([]);
  const toggle = () => {
    setModal(!modal);
  };

  const [advanceModal, setAdvanceModal] = useState(false);
  const [advanceRefundData, setAdvanceRefundData] = useState([]);
  const advanceRefundtoggle = () => {
    setAdvanceModal(!advanceModal);
  };
  const [repairOrderModal, setRepairOrderModal] = useState(false);
  const repairOrdertoggle = () => {
    setRepairOrderModal(!repairOrderModal);
  };

  useEffect(() => {
    if (parseInt(receiptType) == 5) {
      setCreditData(issueCreditsList?.data);
      if (issueCreditsList?.data?.length > 0) {
        setModal(true);
      } else if (customer !== null && customer !== "") {
        toastfunc("No Credit details available.");
      }
    }
  }, [issueCreditsList]);

  useEffect(() => {
    if (
      advanceDetails?.data &&
      advanceDetails?.data?.length === 0 &&
      parseInt(issueType) == 2
    ) {
      toastfunc("Refund details not available.");
    }
    if (
      advanceDetails?.data &&
      advanceDetails?.data?.length > 0 &&
      parseInt(issueType) == 2
    ) {
      setAdvanceRefundData(advanceDetails?.data);
    }
  }, [advanceDetails]);

  useEffect(() => {
    if (creditData?.length > 0) {
      let creditAmount = creditData?.reduce(
        (sum, obj) =>
          sum +
          (obj?.amount != null || undefined ? parseFloat(obj?.amount) : 0),
        0
      );

      let creditDiscountAmount = creditData?.reduce(
        (sum, obj) =>
          sum +
          (obj?.discount != null || undefined ? parseFloat(obj?.discount) : 0),
        0
      );
      setCreditDataAmount(creditAmount);
      setDiscountAmount(creditDiscountAmount);
      setPayableAmount(creditAmount);
    }
  }, [creditData]);

  useEffect(() => {
    if (advanceRefundData?.length > 0) {
      let creditRefundAmount = advanceRefundData?.reduce(
        (sum, obj) =>
          sum +
          (obj?.amount != null || undefined ? parseFloat(obj?.amount) : 0),
        0
      );

      setRefundDataAmount(creditRefundAmount);
      setPayableAmount(creditRefundAmount);
    }
  }, [advanceRefundData]);

  useEffect(() => {
    if (
      receiptType === 6 &&
      idBranch !== null &&
      customer !== null &&
      idBranch !== "" &&
      customer !== ""
    ) {
      dispatch(
        getRepairOrderDeliveryDetails({
          id_branch: idBranch,
          id_customer: customer,
          status: 4,
        })
      );
    }
  }, [receiptType, idBranch, customer]);

  useEffect(() => {
    if (customer) {
      if (receiptType === 5) {
        dispatch(
          getIssueCreditList({
            type: creditType,
            id_customer: customer,
            settings_bill_type: billSettingType,
          })
        );
      }
      if (issueType === 2) {
        dispatch(
          getAdvanceDetails({
            id_customer: customer,
            settings_bill_type: billSettingType,
          })
        );
      }
    }
  }, [billSettingType, customer, receiptType, issueType]);

  const postData = async () => {
    let allowAdd = true;
    if (balanceAmount !== 0 || isSaveButtonDisabled) {
      toastfunc("Please check the payment amount.");
      allowAdd = false;
    }
    if (allowAdd == true) {
      const filteredPaymentMode = paymentModeData?.filter(
        (item) => item.payment_amount !== 0
      );
      const filteredCreditData = creditData?.filter(
        (item) => item.amount !== 0 || item.discount !== 0
      );
      const payment_mode_details = filteredPaymentMode?.map((obj) => {
        const container = {};
        container.type = type;
        container.payment_mode = obj?.id_mode;
        container.pay_device = obj.id_pay_device;
        container.nb_type = obj.id_nb_type !== "" ? obj.id_nb_type : null;
        container.bank = obj.id_bank;
        container.payment_amount = obj.payment_amount;
        container.card_no = obj.card_no !== "" ? obj.card_no : null;
        container.card_holder = obj.card_holder !== "" ? obj.card_holder : null;
        container.card_type = obj.card_type;
        container.cheque_no = null;
        container.ref_no =
          obj.payment_ref_number !== "" ? obj.payment_ref_number : null;
        return container;
      });

      const credit_details = filteredCreditData?.map((obj) => {
        const container = {};
        container.issue_id = obj.id;
        container.invoice_bill_id = obj.erp_invoice_id;
        container.discount_amount = obj.discount ? obj.discount : 0;
        container.received_amount = obj.amount ? obj.amount : 0;
        return container;
      });

      const addData = {
        type,
        issue_type: issueType,
        receipt_type: receiptType,
        branch: idBranch,
        issue_to: issueTo,
        id_bank: idBank,
        order: orderno,
        remarks,
        deposit_bill: depositBill,
        employee: employee,
        scheme: scheme,
        chit_weight: chitweight,
        customer: customer,
        account_head: accHead,
        weight: 0,
        amount: payableAmount,
        credit_type: creditType,
        setting_bill_type: billSettingType,
        payment_details: payment_mode_details,
        credit_details: credit_details?.length > 0 ? credit_details : [],
        refund_details:
          advanceRefundData?.length > 0 ? setAdvRefund(advanceRefundData) : [],
        repair_details: repairOrderList?.length > 0 ? repairOrderList : [],
        id_counter : loginpref?.id_counter,
      };

      try {
        let response = await dispatch(createIssueReceipt(addData)).unwrap();
        let data = {
          settings: settings,
          itemDetails: response.data.response_data,
          userInfo: userInfo,
        };
        console.log(data, "response");
        toastsuccess("Issue / Receipt created successfully");
        secureLocalStorage.setItem("pageState", JSON.stringify(data));
        window.open(
          `${process.env.PUBLIC_URL}/billing/issue_receipt/print`,
          "_blank"
        );
        navigate(`${process.env.PUBLIC_URL}/receipt/list`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const setAdvRefund = (data) => {
    return data.filter((obj) => parseFloat(obj.amount) > 0);
  };

  useEffect(() => {
    if (customerInputRef.current) {
      customerInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (location?.state?.add === undefined) {
      navigate(`${process.env.PUBLIC_URL}/receipt/list`);
    }
  }, [location?.state?.add, navigate]);

  return (
    <React.Fragment>
      <ReceiptCreditModal
        modal={modal}
        toggle={toggle}
        title={"Credit Details"}
        data={creditData}
        creditDataAmount={creditDataAmount}
        discountAmount={discountAmount}
        // clickAction={dayCloseAction}
        SetData={setCreditData}
      />

      <AdvanceRefundModal
        modal={advanceModal}
        toggle={advanceRefundtoggle}
        title={"Advance Refund Details"}
        data={advanceRefundData}
        totalAdvanceRefundAmount={refundDataAmount}
        // clickAction={dayCloseAction}
        SetData={setAdvanceRefundData}
      />
      <AdvanceRefundModal
        modal={advanceModal}
        toggle={advanceRefundtoggle}
        title={"Advance Refund Details"}
        data={advanceRefundData}
        totalAdvanceRefundAmount={refundDataAmount}
        // clickAction={dayCloseAction}
        SetData={setAdvanceRefundData}
      />
      <Head title={title ? title : "Receipt"} />
      <Content>
        <CreateCustomerConfirmation
          modal={navigateModal}
          toggle={toggleNavigateModal}
          title={"Create Customer"}
          mobNum={createMobNum}
          clickAction={navigateCreateCustomer}
        />
        <PreviewCard className="h-100">
          <Row lg={12}>
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col lg="4">
              <div className="form-group form-control-sm">
                <BranchDropdown
                  register={register}
                  id={"idBranch"}
                  branches={branches}
                  selectedBranch={idBranch}
                  onBranchChange={setIdBranch}
                  isRequired={true}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.idBranch && "Branch is Required"}
                />
              </div>
            </Col>
            <Col md={3} className="text-right flex">
              <Button
                color="primary"
                disabled={isSubmitting || isSaveButtonDisabled}
                size="md"
                onClick={handleSubmit(postData)}
              >
                {isSubmitting ? "Saving" : "Save [Ctrl + S]"}
              </Button>{" "}
              <Button
                disabled={isSubmitting}
                color="danger"
                size="md"
                onClick={() =>
                  navigate(`${process.env.PUBLIC_URL}/receipt/list`)
                }
              >
                Cancel
              </Button>
            </Col>
          </Row>
          <Row className="gy-3 form-control-sm" style={{ marginTop: "6px" }}>
            <Col lg="5" md="12">
              {/* <PreviewCard className="h-100"> */}
              <Row>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="form_type">
                          Type
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="issue_type"
                                value={1}
                                className="custom-control-input"
                                checked={type == 1}
                                onChange={(e) => {
                                  setType(e.target.value);
                                }}
                              />
                              <label
                                htmlFor="issue_type"
                                className="custom-control-label"
                              >
                                {" "}
                                Issue
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="receipt_type"
                                value={2}
                                className="custom-control-input"
                                checked={type == 2}
                                onChange={(e) => {
                                  setType(e.target.value);
                                }}
                              />
                              <label
                                htmlFor="receipt_type"
                                className="custom-control-label"
                              >
                                Receipt
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  {type == 2 && (
                    <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="receiptType">
                            Receipt Type
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <ReceiptTypeDropdown
                            register={register}
                            id={"receiptType"}
                            selectedType={receiptType}
                            onTypeChange={setReceiptType}
                            isRequired={true}
                            typeVal={type}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            message={
                              errors?.receiptType && "Receipt type is Required"
                            }
                          />
                        </div>
                      </Col>
                    </Row>
                  )}

                  {type == 1 && (
                    <>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="issueType">
                              Issue Type
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <div className="form-group">
                            <IssueTypeDropdown
                              register={register}
                              id={"issueType"}
                              selectedType={issueType}
                              onTypeChange={setIssueType}
                              isRequired={true}
                              typeVal={type}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={
                                errors.issueType && "Issue type is Required"
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                      {issueType != 5 && (
                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="issueTo">
                                Issue To
                                <IsRequired />
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <div className="form-group">
                              <IssueToDropdown
                                register={register}
                                id={"issueTo"}
                                selectedType={issueTo}
                                onTypeChange={setIssueTo}
                                isRequired={true}
                                clearErrors={clearErrors}
                                setValue={setValue}
                                message={
                                  errors.issueTo && "Issue type is Required"
                                }
                              />
                            </div>
                          </Col>
                        </Row>
                      )}

                      {issueType == 5 && (
                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="issueTo">
                                Bank
                                <IsRequired />
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <SelectDropdown
                              register={register}
                              id={"idBank"}
                              data={bankingOptions}
                              setValue={setValue}
                              clearErrors={clearErrors}
                              selectedValue={idBank}
                              onChangeEvent={(value) => {
                                setIdBank(value);
                              }}
                              placeholder={"Select Bank"}
                              valueField={"value"}
                              labelField={"label"}
                            />
                          </Col>
                        </Row>
                      )}
                    </>
                  )}

                  {/* {type == 1 && issueType == 3 && ( */}
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="issueType">
                          Account Head
                          {/* <IsRequired /> */}
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <SelectDropdown
                          register={register}
                          id={"accountHead"}
                          data={accountHead}
                          selectedValue={accHead}
                          onChangeEvent={setAccHead}
                          isRequired={false}
                          typeVal={type}
                          clearErrors={clearErrors}
                          setValue={setValue}
                          placeholder={"Select Account Head"}
                          labelField={"name"}
                          valueField={"id_account_head"}
                          message={
                            errors.accountHead && "Account Head is Required"
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                  {/* )} */}

                  {receiptType == 5 && (
                    <Row
                      className="form-group row g-4"
                      style={{ display: "none" }}
                    >
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="creditType">
                            Credit Type
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <CreditTypeDropdown
                            register={register}
                            id={"creditType"}
                            selectedType={creditType}
                            onTypeChange={setCreditType}
                            isRequired={true}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            message={
                              errors.creditType && "Credit type is Required"
                            }
                          />
                        </div>
                      </Col>
                    </Row>
                  )}

                  {(type == 2 || issueTo == 1) && receiptType != 7 && receiptType != 9 && (
                    <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label
                            className="form-label"
                            htmlFor="customerSearch"
                          >
                            Customer
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <Typeahead
                              ref={customerInputRef}
                              id="customerSearch"
                              labelKey="label"
                              onChange={(e) => {
                                if (e?.length > 0) {
                                  setCustomer(e[0]?.value);

                                  setCustomerSearch(e);
                                } else {
                                  setCustomer(null);
                                  setCustomerSearch([]);
                                }
                              }}
                              options={searchCustomerList}
                              placeholder="Choose a customer..."
                              // defaultSelected={customerSearch}
                              selected={customerSearch}
                              onInputChange={(text) => {
                                if (text?.length === 0) {
                                  setCustomerSearch([]);
                                  setInputType(null);
                                  return;
                                }

                                const firstChar = text.charAt(0);
                                if (!inputType) {
                                  setInputType(
                                    /\d/.test(firstChar) ? "number" : "text"
                                  );
                                }

                                if (
                                  inputType === "number" &&
                                  /^\d*$/.test(text)
                                ) {
                                  setIsSearching(text?.length >= 5);
                                  setCustomerSearch([{ label: text }]);
                                }
                                if (
                                  inputType === "text" &&
                                  /^[a-zA-Z\s]*$/.test(text)
                                ) {
                                  setIsSearching(text?.length > 0);
                                  setCustomerSearch([{ label: text }]);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (
                                  inputType === "number" &&
                                  !/\d/.test(e.key)
                                ) {
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
                              className={"typeahead"}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  )}

                  {parseInt(receiptType) == 2 && (
                    <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="orderno">
                            Order
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <InputGroupDropdown
                          register={register}
                          mainDropdownOptions={orderDropdown}
                          placeholder="Select order no"
                          dropdownId={"orderno"}
                          value={orderno}
                          selectedType={orderno}
                          onTypeChange={setOrderno}
                          isRequired={true}
                          clearErrors={clearErrors}
                          type={"text"}
                          optionId={"finYear"}
                          name={"finYear"}
                          options={financialYearList?.rows}
                          setValue={setValue}
                          handleKeyDownEvents={true}
                          handleDecimalDigits={true}
                          decimalValues={3}
                          width={"74%"}
                          onDropDownChange={(value) => {
                            setFinYear(value);
                          }}
                          selectedOption={finYear}
                          SetValue={(value) => {
                            setOrderno(value);
                            clearErrors("orderno");
                          }}
                          minError={"Gross weight Greater than or equal 1"}
                          maxError={""}
                          requiredMessage={"Gross weight is Required"}
                          message={
                            errors.grossWeight && errors.grossWeight.message
                          }
                          tabIndex={10}
                        />
                      </Col>
                    </Row>
                  )}

                  {/* {(type == 2 || issueTo == 2) && ( */}
                    <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="employee">
                            Employee
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <ActiveEmployeeDropdown
                            // tabIndex={1}
                            register={register}
                            id={"employee"}
                            selectedEmployee={employee}
                            onEmployeeChange={setEmployee}
                            isRequired={true}
                            options={employees}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            message={errors.employee && "Employee is Required"}
                          />
                        </div>
                      </Col>
                    </Row>
                  {/* )} */}

                  {receiptType == 8 && (
                    <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="scheme">
                            Scheme
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <SchemeDropdown
                            register={register}
                            id={"scheme"}
                            schemes={schemes}
                            selectedScheme={scheme}
                            onSchemeChange={SetScheme}
                            isRequired={false}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            message={errors.scheme && "Scheme is Required"}
                          ></SchemeDropdown>
                        </div>
                      </Col>
                    </Row>
                  )}

                  {receiptType == 8 && (
                    <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="creditType">
                            Weight
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <NumberInputField
                            register={register}
                            placeholder="Weight"
                            id={"chitweight"}
                            value={chitweight}
                            isRequired={false}
                            type={"number"}
                            setValue={setValue}
                            decimalValues={3}
                            SetValue={(value) => {
                              setChitWeight(value);
                              clearErrors("chitweight");
                            }}
                            reqValueError={"chitweight is Required"}
                            message={
                              errors.chitweight && errors.chitweight.message
                            }
                          />
                        </div>
                      </Col>
                    </Row>
                  )}

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="payable_amount">
                          Amount
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="input-group">
                        <div className="input-group-append">
                          <span className="input-group-text">
                            {getCurrencySymbol(userInfo?.user?.currency_code)}
                          </span>
                        </div>
                        <input
                          {...register("payable_amount", {
                            required: {
                              value: true,
                              message: "Amount is required",
                            },
                          })}
                          readOnly={
                            (receiptType == 5 && creditData?.length > 0) ||
                            receiptType == 6 ||
                            (issueType == 2 && advanceRefundData?.length > 0)
                          }
                          onWheel={(e) => e.target.blur()}
                          name="payable_amount"
                          placeholder="Amount"
                          className=" form-control no-spinner"
                          type="number"
                          value={payableAmount}
                          onChange={(e) => {
                            setPayableAmount(e.target.value);
                          }}
                          // onKeyDown={(evt) => {
                          //   if (
                          //     (evt.keyCode > 57 || evt.keyCode < 48) &&
                          //     !["Backspace", "Tab"].includes(evt.key)
                          //   ) {
                          //     evt.preventDefault();
                          //   }
                          // }}
                        />
                      </div>
                    </Col>
                  </Row>

                  {customer &&
                    customer != null &&
                    receiptType == 5 &&
                    issueCreditsList?.data?.length > 0 && (
                      <Button color="primary" size="md" onClick={toggle}>
                        Credit Details
                      </Button>
                    )}
                  {customer &&
                    customer != null &&
                    issueType === 2 &&
                    advanceDetails?.data?.length > 0 && (
                      <Button
                        color="primary"
                        size="md"
                        onClick={advanceRefundtoggle}
                      >
                        Advance refund Details
                      </Button>
                    )}
                </div>
              </Row>
            </Col>

            <Col className="form-control-sm" lg="7" md="12">
              <div className="custom-grid">
                <Col lg="12">
                  <table className="table">
                    <tr>
                      <th>Net Amount</th>
                      <td>
                        <div className="input-group">
                          <div className="input-group-append">
                            <span className="input-group-text">
                              {getCurrencySymbol(userInfo?.user?.currency_code)}
                            </span>
                          </div>
                          <input
                            id={`netAmount`}
                            type="number"
                            className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                            readOnly
                            value={payableAmount}
                            setValue={setValue}
                            min={0}
                            {...register(`netAmount`)}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Balance Amount</th>
                      <td>
                        <div className="input-group">
                          <div className="input-group-append">
                            <span className="input-group-text">
                              {getCurrencySymbol(userInfo?.user?.currency_code)}
                            </span>
                          </div>
                          <input
                            id={`balanceAmount`}
                            type="number"
                            className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                            value={balanceAmount}
                            min={0}
                            {...register(`balanceAmount`)}
                          />
                        </div>
                      </td>
                    </tr>
                  </table>
                </Col>
                {/* <PreviewCard className="h-100"> */}
                <PaymentModeComponent
                  ref={paymentFormRef}
                  initialAmountReceived={payableAmount}
                  onUpdateFormData={handlePaymentData}
                  onUpdateAdvanceFormData={handleAdvanceAdjustmentData}
                  onUpdateChitFormData={handleChitAdjustmentData}
                  customer={customer}
                  metalRateInfo={metalRateInfo}
                />
                {/* </PreviewCard> */}
                <Col lg="12">
                  <div className="form-group">
                    <label className="form-label" style={{ marginTop: "10px" }}>
                      Remarks <IsRequired />
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <textarea
                      {...register("remarks", {
                        required: "Remarks is required",
                      })}
                      style={{ minHeight: "4vw" }}
                      rows="1"
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
                    {errors?.remarks && (
                      <span className="invalid">
                        <Icon className={"sm"} name="alert-circle" />
                        {errors.remarks.message}
                      </span>
                    )}
                  </div>
                </Col>
              </div>
            </Col>
          </Row>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default ReceiptForm;
