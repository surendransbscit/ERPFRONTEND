/* eslint-disable no-unused-expressions */
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import moment from "moment/moment";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import {
  createPayment,
  getNBType,
  getPayDevices,
  getPaymentGateways,
  getPaymentModes,
} from "../../../redux/thunks/payment";
import { getAllCustomer, searchCustomer } from "../../../redux/thunks/customer";
import { getAccessBranches } from "../../../redux/thunks/coreComponent";
import { getAllBank } from "../../../redux/thunks/retailMaster";
import secureLocalStorage from "react-secure-storage";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Col, Icon, PreviewCard, Row } from "../../../components/Component";
import { Typeahead } from "react-bootstrap-typeahead";
import BranchDropdown from "../../../components/common/dropdown/BranchDropdown";
import { Button } from "reactstrap";
import { getCustomerAccount } from "../../../redux/thunks/scheme";
import PaymentAmountDropdown from "../../../components/common/dropdown/PaymentAmountDropdown";
import SchemeAccountDetailModal from "../../../components/modals/SchemeAccountDetails";
import {
  calculateExclusiveTax,
  calculateInclusiveTax,
  isUndefined,
} from "../../../components/common/calculations/ErpCalculations";
import CreateCustomerConfirmation from "../../../components/modals/CreateCustomerConfirmation";
import { useHotkeys } from "react-hotkeys-hook";
import ShortCutKeys from "../../../components/shortCutKeys/ShortCutKeys";
import PaymentModeComponent from "../../../components/common/payment/PaymentModeComponent";
import { downloadPDF } from "../../../components/common/pdfDownLoad/pdfDownLoad";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";

const CreateSchemePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const title = location?.state?.title;
  const customerSearchValue = location?.state?.customerSearchValue;
  const customerId = location?.state?.customerId;
  const branchId = location?.state?.branchId;
  const accountSearchValue = location?.state?.accountSearchValue;
  const accountId = location?.state?.accountId;
  const loginpref = secureLocalStorage.getItem("pref").pref;
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [navigateModal, setNavigateModal] = useState(false);
  const [createMobNum, setCreateMobNum] = useState();
  const [navigateModalOpened, setNavigateModalOpened] = useState(false);
  const toggle = () => setOpenDetailModal(!openDetailModal);
  const toggleNavigateModal = () => setNavigateModal(!navigateModal);
  const paymentFormRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const { searchCustomerList } = useSelector((state) => state.customerReducer);
  const { customerAccountList, isError: cusAccountError } = useSelector(
    (state) => state.schemeAccountReducer
  );
  const { isLoading: isSubmitting } = useSelector(
    (state) => state.paymentMasterReducer
  );

  const [customer, setCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState(null);
  const [inputType, setInputType] = useState();
  const [schemeAccNumber, setSchemeAccNumber] = useState("Scheme A/c No");
  const [srchSchemeAccNumber, setSrchSchemeAccNumber] = useState("");
  const [idBranch, setIdBranch] = useState("");
  const [paymentDate, SetPaymentDate] = useState(new Date());
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
  const [Advance, setAdvance] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [installment, setInstallment] = useState();
  const [todaysRate, setTodaysRate] = useState("");
  const [payableAmount, setPayableAmount] = useState(0);
  const [payableWeight, setPayableWeight] = useState(0);
  const [discountType, setDiscountType] = useState(2);
  const [discount, setDiscount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [bonusMetalWeight, setBonusMetalWeight] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [modeBalanceAmount, setModeBalanceAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalNetAmount, setTotalNetAmount] = useState(0);

  // useEffect(() => {
  //   if (isSearching && customerSearch?.length > 0 && customerSearch[0]?.label.length >= 5 && customer == null) {
  //     dispatch(searchCustomer({ mob_num: customerSearch[0]?.label }));
  //   }
  // }, [isSearching, customerSearch, customer, dispatch]);

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

  useEffect(() => {
    if (customerSearchValue && customerId && accountSearchValue && branchId) {
      setCustomerSearch(customerSearchValue);
      setCustomer(customerId);
      setIdBranch(branchId);
      setValue("idBranch", branchId);
      setSrchSchemeAccNumber(accountSearchValue);
      dispatch(
        getCustomerAccount({
          customer: customerId,
        })
      );
    }
  }, [customerSearchValue, accountSearchValue, customerId, dispatch]);

  // useEffect(() => {
  //   if (
  //     isSearching &&
  //     customerSearch?.length > 0 &&
  //     customerSearch[0]?.label.length >= 9 &&
  //     customer == null &&
  //     searchCustomerList?.length === 0
  //   ) {
  //     setCreateMobNum(customerSearch[0]?.label);
  //     setNavigateModal(true);
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
        setCreateMobNum(inputValue);
        setNavigateModal(true);
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
          navigateLink: `/payments/schemepayment/add`,
        },
      }
    );
  };

  const [IndiSchemeAccDetails, setIndiSchemeAccDetails] = useState();
  const [PaymentConstraint, setPaymentConstraint] = useState();

  const [id, SetId] = useState(0);

  const [paymentModeDetails, SetPaymentModeDetails] = useState([]);

  const [isSavePaymentDisabled, SetIsSavePaymentDisabled] = useState(false);
  const [isSaveButtonDisabled, SetIsSaveButtonDisabled] = useState(true);

  const [payAmountOptions, SetPayAmountOptions] = useState([]);

  useEffect(() => {
    if (customerId && customerAccountList?.data?.length > 0) {
      let selectedAccount = customerAccountList?.data?.filter(
        (val) => val.id_scheme_account == accountId
      );
      setSchemeAccNumber(accountId);
      setPaymentConstraint(selectedAccount[0]),
        setIndiSchemeAccDetails(selectedAccount[0]);
      setInstallment(selectedAccount[0]?.paid_installments),
        setTodaysRate(selectedAccount[0]?.todays_rate);
    }
  }, [customerId, customerAccountList, customerAccountList?.data, accountId]);

  useEffect(() => {
    if (
      PaymentConstraint?.maximum_payable?.max_amount &&
      PaymentConstraint?.denom_type === 1
    ) {
      let quotient =
        PaymentConstraint?.maximum_payable?.max_amount /
        PaymentConstraint?.denom_value;
      let arr = [];
      for (let index = 1; index <= quotient; index++) {
        const element = PaymentConstraint?.denom_value * index;
        arr.push(element);
      }
      SetPayAmountOptions(arr);
    } else if (
      PaymentConstraint?.amount_denom.length > 0 &&
      PaymentConstraint?.denom_type === 2 &&
      PaymentConstraint?.limit_type === 1
    ) {
      const options = PaymentConstraint?.amount_denom?.map((denom) => ({
        value: denom.value,
      }));
      SetPayAmountOptions(options);
    } else if (
      PaymentConstraint?.weight_denom.length > 0 &&
      PaymentConstraint?.denom_type === 2 &&
      PaymentConstraint?.limit_type === 2
    ) {
      const options = PaymentConstraint?.weight_denom?.map((denom) => ({
        value: denom.value,
      }));
      SetPayAmountOptions(options);
    } else {
      return;
    }
  }, [
    PaymentConstraint?.maximum_payable?.max_amount,
    PaymentConstraint?.denom_value,
    PaymentConstraint?.denom_type,
    PaymentConstraint?.amount_denom,
  ]);

  var paymentArrAmount = paymentModeDetails?.reduce(
    (sum, obj) =>
      sum +
      (obj?.payment_amount != null || obj?.payment_amount != ""
        ? parseFloat(obj?.payment_amount)
        : 0),
    0
  );

  const IncreaseAdvance = (advance,paid_installments,total_installments) => {
    if (Advance < parseInt(advance)) {
      setAdvance((previousCount) => previousCount + 1);
      let total_payable_installments = parseInt(paid_installments) + parseInt(advance);
      if (parseInt(total_payable_installments) > parseInt(total_installments)) {
        toastfunc("Advance months should not be greater than total installments");
        setAdvance(1);
      }
    }
  };

  // decrease Advance
  const DecreaseAdvance = (advance) => {
    if (Advance > 1 && Advance <= parseInt(advance)) {
      setAdvance((previousCount) => previousCount - 1);
    }
  };

  useEffect(() => {
    dispatch(getPaymentGateways());
    dispatch(getAllCustomer());
    dispatch(getAccessBranches(loginpref));
    dispatch(getPaymentModes());
    dispatch(getAllBank());
    dispatch(getPayDevices());
    dispatch(getNBType());
  }, [dispatch, loginpref]);

  useEffect(() => {
    if (IndiSchemeAccDetails?.scheme_type == 2) {
      if (payableAmount !== 0 && payableAmount != undefined) {
        let metal_weight =
          parseFloat(payableAmount) /
          parseFloat(IndiSchemeAccDetails?.todays_rate);
        let digi_interest_value =
          (metal_weight *
            parseFloat(IndiSchemeAccDetails?.digi_interest_percent)) /
          100;
        let bonus_weight = parseFloat(digi_interest_value).toFixed(3);
        setBonusMetalWeight(bonus_weight);
      }
    }
  }, [IndiSchemeAccDetails, payableAmount]);

  useEffect(() => {
    if (payableAmount !== 0) {
      // if (PaymentConstraint?.limit_type === 1) {
      //   if (parseFloat(payableAmount) > parseFloat(PaymentConstraint?.maximum_payable?.max_amount)) {
      //     toastfunc("Selected Amount is greater than the Maximum Amount");
      //     SetPayableAmount(0);
      //     SetPayableWeight(0);
      //   }
      //   if (parseFloat(payableAmount) < parseFloat(PaymentConstraint?.minimum_payable?.min_amount)) {
      //     toastfunc("Selected Amount is greater than the Minimum Amount");
      //     SetPayableAmount(0);
      //     SetPayableWeight(0);
      //   }
      // }

      if (discountType === 1) {
        let amount = (discount / 100) * payableAmount;
        setDiscountAmount(parseFloat(amount).toFixed(2));
        let net = parseFloat(payableAmount) - parseFloat(discountAmount);
        setNetAmount(parseFloat(net).toFixed(2));
        setTotalNetAmount(parseFloat(net).toFixed(2));
      } else if (discountType === 2) {
        let amount = discount;
        setDiscountAmount(parseFloat(amount).toFixed(2));
        let net = parseFloat(payableAmount) - parseFloat(discountAmount);
        setNetAmount(parseFloat(net).toFixed(2));
        setTotalNetAmount(parseFloat(net).toFixed(2));
      }
      if (IndiSchemeAccDetails?.tax_id != null) {
        if (IndiSchemeAccDetails?.tax_type === 1) {
          let tax_amount = calculateInclusiveTax(
            payableAmount,
            IndiSchemeAccDetails?.tax_percentage
          );
          setTaxAmount(parseFloat(tax_amount).toFixed(2));
          setNetAmount(parseFloat(payableAmount).toFixed(2));
        } else if (IndiSchemeAccDetails?.tax_type === 2) {
          let tax_amount = calculateExclusiveTax(
            payableAmount,
            IndiSchemeAccDetails?.tax_percentage
          );
          let amount =
            parseFloat(payableAmount) -
            parseFloat(discountAmount) +
            parseFloat(tax_amount);
          setNetAmount(parseFloat(amount).toFixed(2));
          setTotalNetAmount(parseFloat(amount).toFixed(2));
          setTaxAmount(parseFloat(tax_amount).toFixed(2));
        }
      }
      if (
        PaymentConstraint?.advance_months > 0 &&
        PaymentConstraint?.allow_advance === true
      ) {
        setTotalNetAmount(
          parseFloat(
            parseFloat(netAmount) * parseFloat(isUndefined(Advance))
          ).toFixed(2)
        );
      }
    } else {
      setTaxAmount(0.0);
      setDiscountAmount(0.0);
      setNetAmount(0.0);
      setTotalNetAmount(0.0);
    }
  }, [
    payableAmount,
    discount,
    discountAmount,
    discountType,
    Advance,
    netAmount,
    totalNetAmount,
  ]);

  useEffect(() => {
    if (IndiSchemeAccDetails) {
      setDiscountType(IndiSchemeAccDetails?.discount_type);
      setDiscount(IndiSchemeAccDetails?.discount_value);
    }
  }, [IndiSchemeAccDetails]);

  useEffect(() => {
    if (paymentModeDetails.length > 0 && paymentArrAmount > 0) {
      let amount = parseFloat(totalNetAmount) - parseFloat(paymentArrAmount);
      setModeBalanceAmount(amount);
    } else {
      setModeBalanceAmount(0);
    }
  }, [totalNetAmount, paymentArrAmount, paymentModeDetails]);

  useEffect(() => {
    if (
      paymentModeDetails?.length > 0 &&
      parseFloat(totalNetAmount).toFixed(2) == paymentArrAmount
    ) {
      SetIsSavePaymentDisabled(true);
      SetIsSaveButtonDisabled(false);
    } else {
      SetIsSavePaymentDisabled(false);
      SetIsSaveButtonDisabled(true);
    }
  }, [
    paymentArrAmount,
    payableAmount,
    totalNetAmount,
    paymentModeDetails?.length,
  ]);
  console.log(PaymentConstraint);

  useEffect(() => {
    srchSchemeAccNumber == "" &&
      customer == "" &&
      customer == null &&
      setSchemeAccNumber("");
  }, [srchSchemeAccNumber, customer, setSchemeAccNumber]);

  useEffect(() => {
    customer != "" && customer != null && setSchemeAccNumber(null);
  }, [customer]);

  const setPaymentDetails = (data) => {
    let paymentModeDetails = [];
    data.forEach((val) => {
      if (val.payment_amount > 0) {
        paymentModeDetails.push({
          payment_type: 1,
          payment_mode: val.id_mode,
          payment_amount: val.payment_amount,
          card_no: val.card_no !== "" ? val.card_no : null,
          card_holder: val.card_holder !== "" ? val.card_holder : null,
          payment_ref_number:
            val.payment_ref_number !== "" ? val.payment_ref_number : null,
          card_type: val.card_type,
          NB_type: val.id_nb_type !== "" ? val.id_nb_type : null,
          id_bank: val.id_bank !== "" ? val.id_bank : null,
          id_pay_device: val.id_pay_device,
        });
      }
    });
    return paymentModeDetails;
  };

  const postData = async () => {
    const formData = [
      {
        advance: Advance,
        id_scheme_account: schemeAccNumber,
        trans_date: moment(paymentDate).format("YYYY-MM-DD"),
        date_payment: moment(new Date()).format("YYYY-MM-DD"),
        payment_charges: 0,
        payment_status: 1,
        paid_through: 1,
        installment: installment,
        id_branch: idBranch,
        id_payGateway: null,
        payment_amount: payableAmount,
        tax_amount: taxAmount,
        net_amount: netAmount,
        total_net_amount: totalNetAmount,
        discountAmt: discountAmount,
        actual_trans_amt: 0,
        ref_trans_id: null,
        trans_id: null,
        metal_weight: payableWeight,
        metal_rate: todaysRate,
        payment_mode_details: setPaymentDetails(paymentModeDetails),
        tax_type: IndiSchemeAccDetails?.tax_type,
        tax_id: IndiSchemeAccDetails?.tax_id,
      },
    ];
    // console.log(formData);

    try {
      const response = await dispatch(createPayment(formData)).unwrap();

      downloadPDF(response.data.pdf_path, response.data.id_payment);

      toastsuccess("Payment Group Added successfully");
      navigate(`${process.env.PUBLIC_URL}/payments/schemepayment/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (location?.state?.add === undefined) {
      navigate(`${process.env.PUBLIC_URL}/payments/schemepayment/list`);
    }
  }, [location?.state?.add, navigate]);

  const handlePaymentData = (data) => {
    SetPaymentModeDetails(data);
    const totalPaidAmount = data?.reduce((sum, item) => {
      return sum + parseFloat(item.payment_amount || 0);
    }, 0);
    setTotalPaymentAmount(totalPaidAmount);
  };

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (!isSubmitting && !isSaveButtonDisabled) {
      handleSubmit(postData)();
    }
  });

  // Reload Shortcut (Ctrl+R)
  // useHotkeys("ctrl+r", (event) => {
  //   event.preventDefault();
  //   window.location.reload();
  // });

  // Cancel Shortcut (Esc)
  useHotkeys("esc", () => {
    navigate(`${process.env.PUBLIC_URL}/payments/schemepayment/list`);
  });

  return (
    <React.Fragment>
      <Head title={title ? title : "Payment"} />

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
            md={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={4}>
              <ModifiedBreadcrumb />
            </Col>

            <Col md={8} className="text-right">
              <br></br>
              <Button
                disabled={isSubmitting}
                color="danger"
                size="md"
                onClick={() =>
                  navigate(
                    `${process.env.PUBLIC_URL}/payments/schemepayment/list`
                  )
                }
              >
                Cancel
              </Button>{" "}
              <Button
                color="primary"
                disabled={isSubmitting || isSaveButtonDisabled}
                size="md"
                onClick={handleSubmit(postData)}
              >
                {isSubmitting ? "Saving" : "Save[Ctrl+s]"}
              </Button>
            </Col>
          </Row>

          <Row className="gy-3 ">
            <Col lg="4" md="12">
              <PreviewCard className="h-100">
                <Row>
                  <Col lg="12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="customerSearch">
                        Customer
                      </label>
                      <div className="form-control-wrap">
                        <Typeahead
                          id="customerSearch"
                          labelKey="label"
                          onChange={(e) => {
                            if (e?.length > 0) {
                              setCustomer(e[0]?.value),
                                e[0]?.value &&
                                  dispatch(
                                    getCustomerAccount({
                                      customer: e[0]?.value,
                                    })
                                  );
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

                            if (inputType === "number" && /^\d*$/.test(text)) {
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
                    </div>
                  </Col>

                  {schemeAccNumber == "" &&
                  customer == "" &&
                  customer == null ? (
                    <Col lg="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="customerSearch">
                          Scheme A/C No
                        </label>
                        <div className="form-control-wrap">
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            placeholder="Name"
                            disabled
                          />
                        </div>
                      </div>
                    </Col>
                  ) : cusAccountError == false &&
                    customer != "" &&
                    customer != null ? (
                    <Col lg="12">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="srchSchemeAccNumber"
                        >
                          Scheme A/C No
                        </label>
                        <div className="form-control-wrap input-group">
                          {/* <Select
                          value={schemeAccNumber}
                          onChange={(e) => {
                            SetSchemeAccNumber(e[0]?.id_scheme_account),
                              SetSrchSchemeAccNumber(e),
                              setPaymentConstraint(e[0]),
                              setIndiSchemeAccDetails(e[0]);
                            SetInstallment(e[0]?.paid_installments),
                              SetTodaysRate(e[0]?.todays_rate);
                          }}
                          options={customerAccountList?.data}
                          placeholder="Choose a Scheme Account..."
                          id="srchSchemeAccNumber"
                          labelKey="for_search"
                          selected={srchSchemeAccNumber}
                        />
                        <input type="hidden" value={schemeAccNumber} /> */}

                          <Typeahead
                            style={{
                              width: PaymentConstraint != undefined ? 283 : 370,
                            }}
                            id="srchSchemeAccNumber"
                            labelKey="for_search"
                            onChange={(e) => {
                              setSchemeAccNumber(e[0]?.id_scheme_account),
                                setSrchSchemeAccNumber(e),
                                setPaymentConstraint(e[0]),
                                setIndiSchemeAccDetails(e[0]);
                              setInstallment(e[0]?.paid_installments),
                                setTodaysRate(e[0]?.todays_rate);
                            }}
                            options={customerAccountList?.data}
                            placeholder="Choose a Scheme Account..."
                            // defaultSelected={customerSearch}
                            selected={srchSchemeAccNumber}
                          />
                          {IndiSchemeAccDetails != undefined && (
                            <Button onClick={() => setOpenDetailModal(true)}>
                              <Icon name="eye" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Col>
                  ) : (
                    <Col lg="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="customerSearch">
                          Scheme A/C no
                        </label>
                        <div className="form-control-wrap">
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            placeholder="scheme_acc_number"
                            disabled
                            value={schemeAccNumber}
                          />
                        </div>
                      </div>
                    </Col>
                  )}
                  <Col lg="12">
                    <div className="form-group">
                      <BranchDropdown
                        id={"idBranch"}
                        optionLabel={"Choose a branch..."}
                        register={register}
                        label={"Select Branch"}
                        value={idBranch}
                        SetValue={setIdBranch}
                      />
                      {errors?.idBranch && (
                        <span className="text-danger">
                          This field is required
                        </span>
                      )}
                    </div>
                  </Col>

                  <Col lg="12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="todays_rate">
                        Today's Rate
                      </label>
                      <div className="form-control-wrap">
                        <input
                          readOnly
                          name="todays_rate"
                          id="todays_rate"
                          value={IndiSchemeAccDetails?.todays_rate}
                          className=" form-control"
                          placeholder="Today's rate"
                          type="text"
                        />
                      </div>
                    </div>
                  </Col>

                  <Col lg="12">
                    <p className="mt-3">
                      Payment Date : {moment(new Date()).format("DD-MM-yyyy")}
                    </p>
                    {/* {IndiSchemeAccDetails?.scheme_type == 2 && (
                      <p className="mt-3">
                        Maturity Date : {IndiSchemeAccDetails?.maturity_date}
                      </p>
                    )} */}
                  </Col>
                </Row>
              </PreviewCard>
            </Col>

            <Col lg="8" md="12">
              <PreviewCard className="h-100">
                <div className="gy-3">
                  <Row className="g-3 align-center">
                    <Col lg="2">
                      <div className="form-group">
                        <label className="form-label">Can pay ? :</label>
                      </div>
                    </Col>
                    <Col lg="3">
                      <div className="form-control-wrap">
                        {PaymentConstraint?.allow_pay != undefined ? (
                          <div
                            className={`flex flex-col ${
                              PaymentConstraint?.allow_pay == true
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            {PaymentConstraint?.allow_pay == true
                              ? "Yes"
                              : "No"}
                          </div>
                        ) : (
                          <div className="flex flex-col text-danger">NIL</div>
                        )}
                      </div>
                    </Col>
                    <Col lg="2">
                      <div className="form-group">
                        <label className="form-label">Advance :</label>
                      </div>
                    </Col>
                    <Col lg="3">
                      <div className="form-control-wrap">
                        <div className="form-control-wrap  number-spinner-wrap">
                          <Button
                            outline
                            color="light"
                            style={{ height: "30px" }}
                            disabled={
                              PaymentConstraint?.allow_advance === false ||
                              PaymentConstraint?.allow_pay === false
                            }
                            className="btn-icon  number-spinner-btn number-minus"
                            onClick={() =>
                              DecreaseAdvance(PaymentConstraint?.advance_months)
                            }
                          >
                            <Icon name="minus"></Icon>
                          </Button>
                          <input
                            type="number"
                            className="form-control form-control-sm number-spinner"
                            value={Advance}
                          />{" "}
                          <Button
                            outline
                            color="light"
                            style={{ height: "30px" }}
                            disabled={
                              PaymentConstraint?.allow_advance === false ||
                              PaymentConstraint?.allow_pay === false
                            }
                            className="btn-icon number-spinner-btn number-plus"
                            onClick={() =>
                              IncreaseAdvance(PaymentConstraint?.advance_months,PaymentConstraint?.paid_installments,PaymentConstraint?.total_installments)
                            }
                          >
                            <Icon name="plus"></Icon>
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row className="g-3 align-center">
                    {PaymentConstraint?.minimum_payable?.min_amount != 0 &&
                      PaymentConstraint?.minimum_payable?.min_amount !=
                        undefined && (
                        <>
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">
                                Min Payable Amount :
                              </label>
                            </div>
                          </Col>
                          <Col lg="3">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                defaultValue={
                                  PaymentConstraint?.minimum_payable?.min_amount
                                }
                                disabled
                              />
                            </div>
                          </Col>
                        </>
                      )}

                    {PaymentConstraint?.maximum_payable?.max_amount != 0 &&
                      PaymentConstraint?.maximum_payable?.max_amount !=
                        undefined && (
                        <>
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">
                                Max Payable Amount :
                              </label>
                            </div>
                          </Col>
                          <Col lg="3">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                defaultValue={
                                  PaymentConstraint?.maximum_payable?.max_amount
                                }
                                disabled
                              />
                            </div>
                          </Col>
                        </>
                      )}
                  </Row>

                  <Row className="g-3 align-center">
                    {PaymentConstraint?.minimum_payable?.min_weight != 0 &&
                      PaymentConstraint?.minimum_payable?.min_weight !=
                        undefined && (
                        <>
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">
                                Min Payable Weight :
                              </label>
                            </div>
                          </Col>
                          <Col lg="3">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                defaultValue={
                                  PaymentConstraint?.minimum_payable?.min_weight
                                }
                                disabled
                              />
                            </div>
                          </Col>
                        </>
                      )}

                    {PaymentConstraint?.maximum_payable?.max_weight != 0 &&
                      PaymentConstraint?.maximum_payable?.max_weight !=
                        undefined && (
                        <>
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">
                                Max Payable Weight :
                              </label>
                            </div>
                          </Col>
                          <Col lg="3">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                defaultValue={
                                  PaymentConstraint?.maximum_payable?.max_weight
                                }
                                disabled
                              />
                            </div>
                          </Col>
                        </>
                      )}
                  </Row>
                  {((PaymentConstraint?.minimum_payable?.min_amount != 0 &&
                    PaymentConstraint?.maximum_payable?.max_amount != 0) ||
                    (PaymentConstraint?.minimum_payable?.min_weight != 0 &&
                      PaymentConstraint?.maximum_payable?.max_weight != 0)) &&
                    PaymentConstraint?.allow_pay == true && (
                      <>
                        <h4 className="mt-4">Payment Breakdown :</h4>
                        <Row className="g-3 align-center">
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">Amount</label>
                            </div>
                          </Col>
                          <Col lg="3">
                            {(PaymentConstraint?.denom_type !== 2 ||
                              PaymentConstraint?.limit_type == 2) && (
                              <div className="form-group">
                                <div className="form-control-wrap">
                                  <input
                                    {...register("payable_amount", {
                                      required: {
                                        value:
                                          PaymentConstraint?.allow_pay &&
                                          PaymentConstraint?.minimum_payable
                                            ?.min_amount != 0,
                                        message: "Payable Amount is required",
                                      },
                                    })}
                                    readOnly={
                                      PaymentConstraint?.allow_pay &&
                                      PaymentConstraint?.minimum_payable
                                        ?.min_weight != 0
                                    }
                                    name="payable_amount"
                                    placeholder="Payable Amount"
                                    className=" form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    type="number"
                                    value={payableAmount}
                                    onChange={(e) => {
                                      setPayableAmount(
                                        parseFloat(e.target.value)
                                      );
                                      if (
                                        IndiSchemeAccDetails?.convert_to_weight ||
                                        IndiSchemeAccDetails?.scheme_type == 2
                                      ) {
                                        // SetPayableWeight(
                                        //   parseFloat(
                                        //     parseFloat(e.target.value) / parseFloat(IndiSchemeAccDetails?.todays_rate)
                                        //   ).toFixed(2)
                                        // );
                                        setPayableWeight(
                                          (
                                            parseFloat(e.target.value) /
                                            parseFloat(
                                              IndiSchemeAccDetails?.todays_rate
                                            )
                                          ).toFixed(3)
                                        );
                                      }
                                    }}
                                    onBlur={() => {
                                      if (PaymentConstraint?.denom_type === 1) {
                                        const denomValue = parseFloat(
                                          PaymentConstraint?.denom_value
                                        );
                                        const enteredValue =
                                          parseFloat(payableAmount);

                                        if (
                                          denomValue &&
                                          enteredValue % denomValue !== 0
                                        ) {
                                          toastfunc(
                                            `Amount should be a multiple of ${denomValue}`
                                          );
                                          setPayableAmount(0);
                                          setPayableWeight(0);
                                        }
                                      }
                                      if (PaymentConstraint?.limit_type === 1) {
                                        if (
                                          parseFloat(payableAmount) >
                                          parseFloat(
                                            PaymentConstraint?.maximum_payable
                                              ?.max_amount
                                          )
                                        ) {
                                          toastfunc(
                                            "Selected Amount is greater than the Maximum Amount"
                                          );
                                          setPayableAmount(0);
                                          setPayableWeight(0);
                                        }
                                        if (
                                          parseFloat(payableAmount) <
                                          parseFloat(
                                            PaymentConstraint?.minimum_payable
                                              ?.min_amount
                                          )
                                        ) {
                                          toastfunc(
                                            "Selected Amount is less than the Minimum Amount"
                                          );
                                          setPayableAmount(0);
                                          setPayableWeight(0);
                                        }
                                      }
                                    }}
                                    onKeyDown={(evt) => {
                                      if (
                                        (evt.keyCode > 57 ||
                                          evt.keyCode < 48) &&
                                        !["Backspace", "Tab"].includes(evt.key)
                                      ) {
                                        evt.preventDefault();
                                      }
                                    }}
                                  />
                                </div>
                                {errors?.payable_amount && (
                                  <span className="invalid">
                                    {errors.payable_amount.message}
                                  </span>
                                )}
                              </div>
                            )}
                            {PaymentConstraint?.denom_type == 2 &&
                              PaymentConstraint?.limit_type == 1 && (
                                <div className="form-group">
                                  <PaymentAmountDropdown
                                    register={register}
                                    id={"payableAmount"}
                                    schemeDetails={IndiSchemeAccDetails}
                                    DropdownOptions={payAmountOptions}
                                    selectedValue={payableAmount}
                                    onDropDownChange={setPayableAmount}
                                    SetPayableWeight={setPayableWeight}
                                    SetPayableAmount={setPayableAmount}
                                    isRequired={true}
                                    clearErrors={clearErrors}
                                    setValue={setValue}
                                    message={
                                      errors.payableAmount &&
                                      "Amount is Required"
                                    }
                                    type={"amountDropDown"}
                                  />
                                </div>
                              )}
                          </Col>

                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">Weight</label>
                            </div>
                          </Col>
                          <Col lg="3">
                            {(PaymentConstraint?.denom_type !== 2 ||
                              PaymentConstraint?.limit_type == 1) && (
                              <div className="form-group">
                                <div className="form-control-wrap">
                                  <input
                                    {...register("payable_weight", {
                                      required: {
                                        value:
                                          PaymentConstraint?.allow_pay &&
                                          PaymentConstraint?.minimum_payable
                                            ?.min_weight != 0,
                                        message: "Payable Weight is required",
                                      },
                                    })}
                                    id="payable_weight"
                                    readOnly={
                                      PaymentConstraint?.allow_pay &&
                                      PaymentConstraint?.minimum_payable
                                        ?.min_amount != 0
                                    }
                                    name="payable_weight"
                                    placeholder="Payable Weight"
                                    className=" form-control"
                                    type="text"
                                    value={payableWeight}
                                    onChange={(e) => {
                                      let value = e.target.value;
                                      if (PaymentConstraint?.limit_type === 2) {
                                        if (
                                          parseFloat(value) >
                                          parseFloat(
                                            PaymentConstraint?.maximum_payable
                                              ?.max_weight
                                          )
                                        ) {
                                          toastfunc(
                                            "You have entered more than the Maximum Weight"
                                          );
                                          value = 0;
                                        } else if (
                                          parseFloat(value) <
                                          parseFloat(
                                            PaymentConstraint?.minimum_payable
                                              ?.min_weight
                                          )
                                        ) {
                                          toastfunc(
                                            "You have entered less than the Minimum Weight"
                                          );
                                          value = 0;
                                        }
                                      }

                                      setPayableWeight(value),
                                        setPayableAmount(
                                          (
                                            parseFloat(
                                              value !== "" ? value : 0
                                            ) *
                                            parseFloat(
                                              IndiSchemeAccDetails?.todays_rate
                                            )
                                          ).toFixed(2)
                                        );
                                    }}
                                    onKeyDown={(evt) => {
                                      let value = evt.target.value;
                                      if (
                                        (evt.keyCode > 57 ||
                                          evt.keyCode < 48) &&
                                        !["Backspace", "Tab", "."].includes(
                                          evt.key
                                        )
                                      ) {
                                        evt.preventDefault();
                                      }
                                      const decimalIndex = value.indexOf(".");
                                      const digitsAfterDecimal =
                                        value.length - decimalIndex - 1;
                                      if (
                                        evt.key === "Backspace" ||
                                        evt.key === "Delete" ||
                                        evt.key === "ArrowLeft" ||
                                        evt.key === "ArrowRight" ||
                                        evt.key === "Tab"
                                      ) {
                                        return;
                                      }
                                      if (decimalIndex >= 1) {
                                        if (
                                          parseFloat(digitsAfterDecimal) >= 3
                                        ) {
                                          console.log(digitsAfterDecimal);
                                          evt.preventDefault();
                                        }
                                      }
                                    }}
                                  />
                                </div>
                                {errors?.payable_weight && (
                                  <span className="invalid">
                                    {errors.payable_weight.message}
                                  </span>
                                )}
                              </div>
                            )}
                            {PaymentConstraint?.denom_type == 2 &&
                              PaymentConstraint?.limit_type == 2 && (
                                <div className="form-group">
                                  <PaymentAmountDropdown
                                    register={register}
                                    id={"payableWeight"}
                                    schemeDetails={IndiSchemeAccDetails}
                                    DropdownOptions={payAmountOptions}
                                    selectedValue={payableWeight}
                                    onDropDownChange={setPayableWeight}
                                    SetPayableWeight={setPayableWeight}
                                    SetPayableAmount={setPayableAmount}
                                    isRequired={true}
                                    clearErrors={clearErrors}
                                    setValue={setValue}
                                    message={
                                      errors.payableAmount &&
                                      "Amount is Required"
                                    }
                                    type={"weightDropDown"}
                                  />
                                </div>
                              )}
                          </Col>
                        </Row>
                        {IndiSchemeAccDetails?.scheme_type == 2 && (
                          <Row className="g-3 align-center">
                            <Col lg="2">
                              <div className="form-group">
                                <label className="form-label">
                                  Bonus Metal Weight
                                </label>
                              </div>
                            </Col>
                            <Col lg="3">
                              <div className="form-control-wrap">
                                <input
                                  className="form-control form-control-sm"
                                  type="text"
                                  // defaultValue={parseFloat(
                                  //   bonusMetalWeight
                                  // ).toFixed(2)}
                                  // value={parseFloat(bonusMetalWeight).toFixed(
                                  //   2
                                  // )}
                                  value={bonusMetalWeight}
                                  disabled
                                />
                              </div>
                            </Col>
                            <Col lg="2">
                              <div className="form-group">
                                <label className="form-label">
                                  Total Weight
                                </label>
                              </div>
                            </Col>
                            <Col lg="3">
                              <div className="form-control-wrap">
                                <input
                                  className="form-control form-control-sm"
                                  type="text"
                                  // defaultValue={parseFloat(
                                  //   bonusMetalWeight
                                  // ).toFixed(2)}
                                  // value={parseFloat(bonusMetalWeight).toFixed(
                                  //   2
                                  // )}
                                  value={parseFloat(
                                    parseFloat(bonusMetalWeight) +
                                      parseFloat(payableWeight)
                                  ).toFixed(3)}
                                  disabled
                                />
                              </div>
                            </Col>
                          </Row>
                        )}
                        <Row className="g-3 align-center">
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">Discount</label>
                            </div>
                          </Col>
                          <Col lg="3">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                defaultValue={parseFloat(
                                  discountAmount
                                ).toFixed(2)}
                                value={parseFloat(discountAmount).toFixed(2)}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">Net Amount</label>
                            </div>
                          </Col>
                          <Col lg="3">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                defaultValue={parseFloat(netAmount).toFixed(2)}
                                value={parseFloat(netAmount).toFixed(2)}
                                disabled
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className="g-3 align-center">
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">Recieved</label>
                            </div>
                          </Col>
                          <Col lg="3">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                defaultValue={parseFloat(
                                  isUndefined(paymentArrAmount)
                                ).toFixed(2)}
                                value={parseFloat(
                                  isUndefined(paymentArrAmount)
                                ).toFixed(2)}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">
                                Total Net Payment
                              </label>
                            </div>
                          </Col>
                          <Col lg="3">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                defaultValue={parseFloat(
                                  totalNetAmount
                                ).toFixed(2)}
                                value={parseFloat(totalNetAmount).toFixed(2)}
                                disabled
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className="g-3 align-center">
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">Tax Amount</label>
                            </div>
                          </Col>
                          <Col lg="3">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                defaultValue={parseFloat(taxAmount).toFixed(2)}
                                value={parseFloat(taxAmount).toFixed(2)}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">Balance</label>
                            </div>
                          </Col>
                          <Col lg="3">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                defaultValue={parseFloat(
                                  modeBalanceAmount
                                ).toFixed(2)}
                                value={parseFloat(modeBalanceAmount).toFixed(2)}
                                disabled
                              />
                            </div>
                          </Col>
                        </Row>
                      </>
                    )}
                </div>

                {PaymentConstraint?.allow_pay == true && (
                  <PaymentModeComponent
                    ref={paymentFormRef}
                    onUpdateFormData={handlePaymentData}
                    // onUpdateAdvanceFormData={handleAdvanceAdjustmentData}
                    // onUpdateChitFormData={handleChitAdjustmentData}
                    customer={customer}
                    initialAmountReceived={parseFloat(totalNetAmount).toFixed(
                      2
                    )}
                    isAdvanceAdjustment={false}
                    isChitAdjustment={false}
                  />
                )}
              </PreviewCard>
            </Col>
          </Row>
        </PreviewCard>
      </Content>
      <ShortCutKeys Save={true} Reload={true} Cancel={true} />

      <SchemeAccountDetailModal
        modal={openDetailModal}
        toggle={toggle}
        PaymentConstraint={PaymentConstraint}
        IndiSchemeAccDetails={IndiSchemeAccDetails}
        IncreaseAdvance={IncreaseAdvance}
        DecreaseAdvance={DecreaseAdvance}
        Advance={Advance}
      />
    </React.Fragment>
  );
};

export default CreateSchemePayment;
