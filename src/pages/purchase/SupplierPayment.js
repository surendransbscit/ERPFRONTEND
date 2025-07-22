import React, { useEffect, useRef, useState } from "react";
import Head from "../../layout/head/Head";
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import Content from "../../layout/content/Content";
import { PreviewCard, SaveButton, Icon } from "../../components/Component";
import { Col, Row } from "../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Label } from "reactstrap";
import getCurrencySymbol from "../../components/common/moneyFormat/currencySymbol";
import {
  SupplierDropdown,
  BranchDropdown,
  SelectDropdown,
  MetalDropdown,
} from "../../components/filters/retailFilters";
import {
  useBranches,
  useSupplierFilter,
  useMetals,
} from "../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import PaymentModeComponent from "../../components/common/payment/PaymentModeComponent";
import {
  createSupplierPayment,
  getSupplierPayments,
  getSupplierOpeningDetails,
  getPurchaseCashAdvance,
} from "../../redux/thunks/purchase";
import { isUndefined } from "../../components/common/calculations/ErpCalculations";
import "../../assets/css/sales_form.css";
import { NumberInputField } from "../../components/form-control/InputGroup";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import { getCashBalance } from "../../redux/thunks/retailMaster";
import { useBillSettingContext } from "../../contexts/BillSettingContext";
import { useHotkeys } from "react-hotkeys-hook";
const SupplierPayment = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    reset,
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const { branches } = useBranches();
  const navigate = useNavigate()
  const add = location?.state?.add;
  const { supplierId, metalId } = location.state || {};
  const { id_purchase_entry } = location.state || {};
  const {
    isLoading: issubmitting,
    supplierPaymentList,
    supplierOpeningDetails,
    supplierCashVaravu,
  } = useSelector((state) => state.purchaseReducer);
  const {
    userInfo,
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const { supplier } = useSupplierFilter();
  const { metals } = useMetals();
  const [metal, SetMetal] = useState();
  const [isSingleMetal, setIsSingleMetal] = useState(false);
  const [paymentList, setPaymentList] = useState([]);
  const [selectSupplier, setSelectSupplier] = useState();
  const [selectType, setSelectType] = useState(1);
  const [paymentModeDetails, SetPaymentModeDetails] = useState([]);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
  const [isSaveButtonDisabled, SetIsSaveButtonDisabled] = useState(true);
  const [selectedPaidAmount, setSelectedPaidAmount] = useState(0.0);
  const [deductionAmount, setDeductionAmount] = useState(0.0);
  const [selectedCreditOpening, setSelectedCreditOpening] = useState(0.0);
  const [balanceAmount, setBalanceAmount] = useState(0.0);
  const [receivedAmount, setReceivedAmount] = useState(0.0);
  const paymentFormRef = useRef(null);
  const [rateCutCashDetails, setRateCashCutDetails] = useState([]);
  const [maxCash, setMaxCash] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState();
  const [remarks, setRemarks] = useState();
  const { cashBalanceInfo } = useSelector((state) => state.bankDepositReducer);
  const initialCashVaravuState = {
    id_metal: null,
    balance_amt: 0,
    balance_wt: 0,
  };
  const [cashVaravuDetails, setCashVaravuDetails] = useState(
    initialCashVaravuState
  );
  const [cashVaravu, setCashVaravu] = useState(0.0);
  const [cashVaravuUtilized, setCashVaravuUtilized] = useState(false);
  const { billSettingType } = useBillSettingContext();

  const typeOptionInstialState = [
    { label: "Payment", value: 1 },
    { label: "Advance", value: 5 }, //3
    { label: "Credit Received from Supplier", value: 6 }, //4
  ];
  const [typeOption, setTypeOption] = useState(typeOptionInstialState);

  const setRateCash = (data) => {
    let details = [];
    if (data.length > 0) {
      console.log(data);
      details = data.map((item) => ({
        metal: metal,
        paid_amount: parseFloat(item.amount).toFixed(2),
        ref_id: item.ref_id,
        discount_amount: 0,
        type: item.type,
        net_amount: parseFloat(item.amount).toFixed(2),
        remarks: remarks,
        id_supplier: selectSupplier,
      }));
    }
    return details;
  };
  useEffect(() => {
    if (supplierCashVaravu != null) {
      setCashVaravuDetails(supplierCashVaravu);
      if (supplierCashVaravu?.balance_amt > 0) {
        setCashVaravu(supplierCashVaravu?.balance_amt);
      }
    }
  }, [supplierCashVaravu]);

  useEffect(() => {
    if (metal && selectSupplier) {
      dispatch(
        getPurchaseCashAdvance({ id_metal: metal, id_supplier: selectSupplier })
      );
    }
  }, [selectSupplier, metal]);

  const reset_data = () => {
    setPaymentList([]);
    setRateCashCutDetails([]);
    setSelectSupplier();
    SetPaymentModeDetails([]);
    setTotalPaymentAmount(0);
    setReceivedAmount(0);
    setDeductionAmount(0);
    setSelectType(1);
    setCashVaravu(0);
    setCashVaravuDetails(initialCashVaravuState);
    setCashVaravuUtilized(false);
    setRemarks(null);
    paymentFormRef.current.resetForm();
    setRemarks("");
    reset();
  };

  const validateCashLimit = () => {
    let validate = false;
    console.log(userInfo);

    paymentModeDetails.forEach((element) => {
      if (element.short_code == "Csh") {
        let max_cash = maxCash;

        if (parseFloat(max_cash) < parseFloat(element.payment_amount)) {
          toastfunc(`Max Cash limit is : ${max_cash}`);

          // element['payment_amount'] = max_cash;

          // setValue(`${element.short_code}_payment_amount`, max_cash);

          validate = true;
        }
      }
    });
    //setPaymentModeData(paymentModeData)

    return validate;
  };

  useEffect(() => {
    if (supplierId !== "" && supplier.length > 0) {
      setSelectSupplier(supplierId);
      SetMetal(metalId);
      setValue("metal", metalId);
      let sup = supplier.find((item) => item.id_supplier == supplierId);
      if (sup) {
        if (sup.id_metal.length == 1) {
          setIsSingleMetal(true);
          SetMetal(sup.id_metal[0]);
          getOrderDetails({
            karigar: supplierId,
            metal: sup.id_metal[0],
            billSettingType: billSettingType,
          });
        } else {
          setIsSingleMetal(false);
          getOrderDetails({
            karigar: supplierId,
            metal: metal,
            billSettingType: billSettingType,
          });
        }
      }
      //   getOrderDetails({ karigar: supplierId, metal: metalId, "billSettingType": billSettingType });
    }
  }, [supplierId, supplier, billSettingType]);

  useEffect(() => {
    if (
      id_purchase_entry !== "" &&
      id_purchase_entry !== undefined &&
      paymentList.length > 0
    ) {
      console.log(id_purchase_entry);
      if (paymentList.length > 0) {
        const updatedPaymentList = paymentList.map((item) =>
          item.purchase_entry_id === id_purchase_entry
            ? { ...item, isChecked: true } // Create a new object with updated isChecked
            : item
        );
        setPaymentList(updatedPaymentList);
        dispatch({
          type: "RESET_STATE",
          payload: { supplierId: null, id_purchase_entry: null },
        });
      }
    }
  }, [id_purchase_entry, paymentList]);

  const addRateCutCash = (value) => {
    let purchaseEntry = [];
    let list = paymentList.filter((item) => item.isChecked);
    let amount = value;
    for (const payment of list) {
      let balanceAmt = parseFloat(payment.balance_amount);

      if (balanceAmt > 0) {
        let amt = parseFloat(balanceAmt) - parseFloat(amount);
        if (amt < 0) {
          amount -= parseFloat(balanceAmt);
          purchaseEntry.push({
            ref_no: payment.ref_no,
            purchase_entry: payment.purchase_entry_id,
            amount: balanceAmt,
            id_metal: payment.id_metal_id,
            type: payment.type,
            ref_id: payment.ref_id,
          });
        } else {
          purchaseEntry.push({
            ref_no: payment.ref_no,
            purchase_entry: payment.purchase_entry_id,
            amount: amount,
            id_metal: payment.id_metal_id,
            type: payment.type,
            ref_id: payment.ref_id,
          });
          amount = 0;
          break;
        }
      }
      console.log(purchaseEntry, balanceAmt, receivedAmount);
    }
    if (purchaseEntry.length > 0) {
      setRateCashCutDetails(purchaseEntry);
    } else {
      toastfunc("Invalid Amount");
    }
  };
  const handleRateCutCashRemove = (indexToRemove) => {
    setRateCashCutDetails((prevArray) =>
      prevArray.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    setPaymentList(supplierPaymentList);
  }, [supplierPaymentList]);

  useEffect(() => {
    if (supplierOpeningDetails != null) {
      if (parseFloat(supplierOpeningDetails.balance_amount) > 0) {
        setSelectedCreditOpening(supplierOpeningDetails.balance_amount);
      } else {
        toastfunc("Supplier Does Not Have Credit Amount");
      }
    }
  }, [supplierOpeningDetails]);

  const handlePaymentData = (data) => {
    SetPaymentModeDetails(data);
    const totalPaidAmount = data?.reduce((sum, item) => {
      return sum + parseFloat(item.payment_amount || 0);
    }, 0);
    setTotalPaymentAmount(totalPaidAmount);
  };

  const calculateTotal = (field, decimal_places) => {
    return paymentList?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };
  const calculateTotalData = (field, decimal_places, data) => {
    return data?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  useEffect(() => {
    let balanceRateCutAmount = parseFloat(
      parseFloat(isUndefined(receivedAmount)) -
        parseFloat(totalPaymentAmount) -
        (cashVaravuUtilized ? parseFloat(cashVaravu) : 0)
    ).toFixed(2);
    setBalanceAmount(balanceRateCutAmount);
  }, [totalPaymentAmount, selectedPaidAmount, receivedAmount]);

  const getOrderDetails = (value) => {
    console.log(value);
    if (value.karigar && value.metal) {
      dispatch(getSupplierPayments(value));
    }
  };

  const handelChange = (index, field, value) => {
    setPaymentList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

  const selectAll = (value) => {
    const updatedData = paymentList.map((item) => ({
      ...item,
      isChecked: value,
    }));
    setPaymentList(updatedData);
  };

  const setPaymentDetails = (data) => {
    let paymentModeDetails = [];
    data.forEach((val) => {
      if (val.payment_amount > 0) {
        paymentModeDetails.push({
          payment_type: 1,
          id_mode: val.id_mode,
          payment_mode: val.id_mode,
          payment_amount: val.payment_amount,
          card_no: val.card_no !== "" ? val.card_no : null,
          card_holder: val.card_holder !== "" ? val.card_holder : null,
          payment_ref_number:
            val.payment_ref_number !== "" ? val.payment_ref_number : null,
          card_type: val.card_type,
          id_nb_type: val.id_nb_type !== "" ? val.id_nb_type : null,
          id_bank: val.id_bank !== "" ? val.id_bank : null,
          id_pay_device: val.id_pay_device,
          metal: metal,
        });
      }
    });
    return paymentModeDetails;
  };

  const form_submit = async (data, actionType) => {
    let paymentData = paymentList.filter((item) => item.isChecked === true);
    console.log(paymentList);

    if (remarks == "" && remarks != null) {
      toastfunc("Enter Remarks !!");
      return;
    }
    if (selectType == 1 ? paymentData.length > 0 : true) {
      const addData = {
        id_supplier: selectSupplier,
        type: selectType,
        paid_amount: receivedAmount,
        deduction_amount : deductionAmount,
        cashVaravu: cashVaravuUtilized ? cashVaravu : 0,
        payment_mode_details: setPaymentDetails(paymentModeDetails),
        payment_details: setRateCash(rateCutCashDetails),
        metal: metal,
        remarks: remarks,
        setting_bill_type: billSettingType,
      };
      try {
        await dispatch(createSupplierPayment(addData)).unwrap();
        reset_data();
        // toastsuccess("Payment done successfully.");
      } catch (error) {
        console.error(error);
      }
    } else if (paymentData.length == 0) {
      toastfunc("Select Item");
    }
  };

  // useEffect(() => {
  //   if (balanceAmount === 0) {
  //     SetIsSaveButtonDisabled(false);
  //   } else {
  //     SetIsSaveButtonDisabled(true);
  //   }
  // }, [balanceAmount, totalPaymentAmount, paymentModeDetails?.length]);

  useEffect(() => {
    let totalAmount = paymentList?.reduce(
      (sum, obj) =>
        sum + (obj?.isChecked === true ? parseFloat(obj?.balance_amount) : 0),
      0
    );
    totalAmount = parseFloat(totalAmount) - parseFloat(isUndefined(deductionAmount));
    setSelectedPaidAmount(parseFloat(totalAmount).toFixed(2));
    //setReceivedAmount(parseFloat(totalAmount).toFixed(2));
    if (selectType == 1) {
      setReceivedAmount(totalAmount);
      if (totalAmount > 0) {
        addRateCutCash(totalAmount);
      } else {
        setRateCashCutDetails([]);
      }
    } else if (selectType == 4) {
      if (parseFloat(selectedCreditOpening) >= parseFloat(totalAmount)) {
        setReceivedAmount(totalAmount);
      }
    } else if (selectType == 5 || selectType == 6) {
      setReceivedAmount(totalAmount);
    }
  }, [paymentList , deductionAmount]);

  useEffect(() => {
    SetIsSaveButtonDisabled(parseFloat(balanceAmount) !== 0);
  }, [balanceAmount]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      if (isSaveButtonDisabled || issubmitting) return;
      handleSubmit((data) => form_submit(data, "saveAndNew"))();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  useEffect(() => {
    if (add === undefined) {
      navigate(`${process.env.PUBLIC_URL}/purchase/supplier_payment/list`);
    }
  }, [add, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Purchase Payment"} />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"}>
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <SaveButton
                disabled={isSaveButtonDisabled || issubmitting}
                size="md"
                color="primary"
                onClick={handleSubmit((data) =>
                  form_submit(data, "saveAndNew")
                )}
              >
                {issubmitting ? "Saving" : "Save[ctrl+s]"}
              </SaveButton>
            </Col>
          </Row>
          <div className="custom-grid">
            <Row
              lg={12}
              className={"form-control-sm"}
              style={{ marginTop: "20px" }}
            >
              <Col md={4}>
                <Row className="form-group">
                  <Col md="4">
                    <Label className="floating-label" id={"supplier"}>
                      Supplier
                    </Label>
                  </Col>
                  <Col lg="8">
                    <SupplierDropdown
                      register={register}
                      id={"supplier"}
                      selectedSupplier={selectSupplier}
                      supplier={supplier}
                      setValue={setValue}
                      onSupplierChange={(value) => {
                        setSelectSupplier(value);
                        //getOrderDetails({karigar : value,metal:metal});
                        let sup = supplier.find(
                          (item) => item.id_supplier == value
                        );
                        if (sup) {
                          if (sup.id_metal.length == 1) {
                            setIsSingleMetal(true);
                            SetMetal(sup.id_metal[0]);
                            getOrderDetails({
                              karigar: value,
                              metal: sup.id_metal[0],
                              billSettingType: billSettingType,
                            });
                          } else {
                            setIsSingleMetal(false);
                            getOrderDetails({
                              karigar: value,
                              metal: metal,
                              billSettingType: billSettingType,
                            });
                          }
                        }
                      }}
                      clearErrors={clearErrors}
                      placeholder={"Supplier"}
                      classNamePrefix="custom-select"
                    />
                  </Col>
                </Row>
                {!isSingleMetal && (
                  <Row className="form-group">
                    <Col md="4">
                      <Label className="floating-label" id={"supplier"}>
                        Metal
                      </Label>
                    </Col>
                    <Col lg="8">
                      <MetalDropdown
                        register={register}
                        id={"metal"}
                        metals={metals}
                        selectedMetal={metal}
                        onMetalChange={(value) => {
                          SetMetal(value);
                          getOrderDetails({
                            karigar: selectSupplier,
                            metal: value,
                            billSettingType: billSettingType,
                          });
                        }}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        tabIndex={1}
                        classNamePrefix="custom-select"
                        message={errors.metal && "Metal is Required"}
                      />
                    </Col>
                  </Row>
                )}
                {selectType == 1 && (<>
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <Label>
                        Selected ({" "}
                        {getCurrencySymbol(userInfo?.user?.currency_code)} )
                      </Label>
                    </Col>
                    <Col lg="8">
                      <input
                        id={"selectedPaidAmount"}
                        {...register("selectedPaidAmount")}
                        placeholder="Rate"
                        className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                        type="number"
                        style={{ textAlign: "right" }}
                        value={selectedPaidAmount}
                        onChange={(event) => {}}
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <Label>
                        Deduction ({" "}
                        {getCurrencySymbol(userInfo?.user?.currency_code)} )
                      </Label>
                    </Col>
                    <Col lg="8">
                      <input
                        id={"deductionAmount"}
                        {...register("deductionAmount")}
                        placeholder="Rate"
                        className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                        type="number"
                        style={{ textAlign: "right" }}
                        value={deductionAmount}
                        onChange={(event) => {setDeductionAmount(event.target.value)}}
                      />
                    </Col>
                  </Row>

                </>
              )}

                <Row className="form-group row g-4">
                  <Col md="4">
                    <Label>
                      Balance ({" "}
                      {getCurrencySymbol(userInfo?.user?.currency_code)} )
                    </Label>
                  </Col>
                  <Col lg="8">
                    <input
                      id={"balanceAmount"}
                      {...register("balanceAmount")}
                      placeholder="Weight"
                      className="form-control form-control-sm"
                      type="text"
                      style={{ textAlign: "right" }}
                      value={balanceAmount}
                      setValue={balanceAmount}
                    />
                  </Col>
                </Row>

                <Row className="form-group row g-4">
                  <Col md="4">
                    <Label>
                      Payment Amount ({" "}
                      {getCurrencySymbol(userInfo?.user?.currency_code)} )
                    </Label>
                  </Col>
                  <Col lg="8">
                    <NumberInputField
                      register={register}
                      placeholder={
                        "Received" +
                        " ( " +
                        getCurrencySymbol(userInfo?.user?.currency_code) +
                        " )"
                      }
                      id={"received"}
                      value={receivedAmount}
                      minValue={0}
                      type={"number"}
                      isRequired={true}
                      SetValue={(value) => {
                        if (selectType == 1) {
                          if (
                            parseFloat(selectedPaidAmount) >= parseFloat(value)
                          ) {
                            setReceivedAmount(value);
                            addRateCutCash(value);
                          } else {
                            setReceivedAmount(0);
                            setRateCashCutDetails([]);
                            toastfunc("Invalid Amount");
                          }
                        } else if (selectType == 4) {
                          if (
                            parseFloat(selectedCreditOpening) >=
                            parseFloat(value)
                          ) {
                            setReceivedAmount(value);
                          }
                        } else if (selectType == 5 || selectType == 6) {
                          setReceivedAmount(value);
                        }
                      }}
                      setValue={setValue}
                      clearErrors={clearErrors}
                      reqValueError={"Received is Required"}
                      handleKeyDownEvents={true}
                      textAlign={"right"}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md={4}>
                <Row className="form-group">
                  <Col md="4">
                    <Label className="floating-label" id={"supplier"}>
                      Type
                    </Label>
                  </Col>
                  <Col lg="8">
                    <SelectDropdown
                      register={register}
                      id={"type"}
                      data={typeOption}
                      selectedValue={selectType}
                      onChangeEvent={(value) => {
                        setSelectType(value);
                        clearErrors("type");
                      }}
                      isRequired={true}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      message={errors.type && "Type is Required"}
                      classNamePrefix="custom-select"
                    />
                  </Col>
                </Row>
                {selectType == 1 && (
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <Label>
                        Advance ({" "}
                        {getCurrencySymbol(userInfo?.user?.currency_code)} )
                        &nbsp;&nbsp;
                        <span style={{ marginTop: "3px" }}>
                          <input
                            type="checkbox"
                            onChange={(event) => {
                              setCashVaravuUtilized(event.target.checked);
                            }}
                            checked={cashVaravuUtilized}
                          />
                        </span>
                      </Label>
                    </Col>
                    <Col md="8">
                      <NumberInputField
                        register={register}
                        placeholder={
                          "Cash Varavu " +
                          " ( " +
                          getCurrencySymbol(userInfo?.user?.currency_code) +
                          " )"
                        }
                        id={"cashVaravu"}
                        value={cashVaravu}
                        readOnly={cashVaravuUtilized == false}
                        min={0}
                        max={cashVaravuDetails.balance_amt}
                        setValue={setValue}
                        SetValue={(value) => {
                          setCashVaravu(value);
                          clearErrors("cashVaravu");
                        }}
                        minError={
                          "Metal Varavu Should greater than or equal to 0"
                        }
                        reqValueError={"Metal Varavu is Required"}
                        message={errors.cashVaravu && errors.cashVaravu.message}
                        tabIndex={9}
                      />
                    </Col>
                  </Row>
                )}

                <Row className="form-group row g-4">
                  <Col md="4">
                    <div className="form-group">
                      <Label>Remarks</Label>
                    </div>
                  </Col>
                  <Col lg="8">
                    <div className="form-control-wrap">
                      <textarea
                        {...register("remarks")}
                        id="remarks"
                        style={{ minHeight: "5vw" }}
                        rows="3"
                        className="form-control form-control-sm"
                        value={remarks}
                        defaultValue={remarks || ""}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col md={4}>
                <PaymentModeComponent
                  ref={paymentFormRef}
                  onUpdateFormData={handlePaymentData}
                  isAdvanceAdjustment={false}
                  isChitAdjustment={false}
                />
              </Col>
            </Row>
            {selectType == 1 && (
              <Row
                lg={12}
                className={"form-control-sm"}
                style={{ marginTop: "10px" }}
              >
                <Col md={8} className="">
                  <div
                    className="table-responsive"
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                  >
                    <table className="table table-bordered">
                      <thead
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        <tr
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            S.NO
                            <input
                              type="checkbox"
                              onChange={(event) => {
                                selectAll(event.target.checked);
                              }}
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
                            Des
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            PO No
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Payment Date
                          </th>
                          {/* <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Piece
                          </th> */}
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Pure Wt
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Charges
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Amount
                          </th>
                          {/* <th>Paid Wt</th> */}
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Paid Amt
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Blc Amt
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentList?.length > 0 &&
                          paymentList?.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                              <td
                                style={{
                                  color:
                                    parseFloat(item.balance_amount) == 0
                                      ? "red"
                                      : "#36fb36",
                                }}
                              >
                                {rowIndex + 1}{" "}
                                {parseFloat(item.balance_amount) != 0 && (
                                  <input
                                    type="checkbox"
                                    onChange={(event) => {
                                      handelChange(
                                        rowIndex,
                                        "isChecked",
                                        event.target.checked
                                      );
                                    }}
                                    checked={item.isChecked}
                                  />
                                )}
                              </td>
                              <td style={{ color: "" }}>{item.metal_name}</td>
                              <td style={{ color: "" }}>{item.ref_no}</td>
                              <td style={{ color: "" }}>{item.payment_date}</td>
                              {/* <td style={{ textAlign: "right", color: "" }}>
                                {item.pieces}
                              </td> */}
                              <td style={{ textAlign: "right", color: "" }}>
                                {parseFloat(item.pure_wt).toFixed(3)}
                              </td>
                              <td style={{ textAlign: "right", color: "" }}>
                                <CurrencyDisplay
                                  value={parseFloat(
                                    item.mc_and_other_charges
                                  ).toFixed(2)}
                                ></CurrencyDisplay>
                              </td>
                              <td style={{ textAlign: "right", color: "" }}>
                                <CurrencyDisplay
                                  value={isUndefined(
                                    parseFloat(item.total_amount).toFixed(2)
                                  )}
                                ></CurrencyDisplay>
                              </td>
                              {/* <td style={{ textAlign: "right",color: "" }}>{parseFloat(item.paid_weight).toFixed(3)}</td> */}
                              <td style={{ textAlign: "right", color: "" }}>
                                <CurrencyDisplay
                                  value={isUndefined(
                                    parseFloat(item.paid_amount).toFixed(2)
                                  )}
                                ></CurrencyDisplay>
                              </td>
                              <td style={{ textAlign: "right", color: "" }}>
                                {" "}
                                <CurrencyDisplay
                                  value={isUndefined(
                                    parseFloat(item.balance_amount).toFixed(2)
                                  )}
                                ></CurrencyDisplay>
                              </td>
                            </tr>
                          ))}
                      </tbody>

                      <tfoot
                        className="thead-light"
                        style={{
                          position: "sticky",
                          bottom: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        <tr
                          style={{
                            fontWeight: "bold",
                            position: "sticky",
                            bottom: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <td
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Total
                          </td>
                          <td
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          ></td>
                          <td
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          ></td>
                          <td
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          ></td>
                          {/* <td
                            style={{
                              textAlign: "right",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            {calculateTotal("pieces", 0)}
                          </td> */}
                          <td
                            style={{
                              textAlign: "right",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            {calculateTotal("pure_wt", 3)}
                          </td>
                          <td
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          ></td>
                          <td
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          ></td>
                          <td
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          ></td>
                          <td
                            style={{
                              textAlign: "right",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            <CurrencyDisplay
                              value={calculateTotal("balance_amount", 3)}
                            />
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </Col>
                <Col md={4}>
                  <Row>
                    <div className="row">
                      <div className="col-md-6" style={{ paddingRight: "0px" }}>
                        <h6>Payment Adjusted</h6>{" "}
                      </div>
                      <div className="col-md-3" style={{ paddingRight: "0px" }}>
                        Amount ({" "}
                        {getCurrencySymbol(userInfo?.user?.currency_code)} ) :
                      </div>
                      <div
                        className="col-md-3"
                        style={{ paddingRight: "0px", paddingLeft: "0px" }}
                      >
                        <input
                          type="text"
                          style={{ textAlign: "right" }}
                          className="form-control form-control-sm"
                          readOnly
                          placeholder=" Pure Wt (g)"
                          value={calculateTotalData(
                            "amount",
                            3,
                            rateCutCashDetails
                          )}
                        />
                      </div>
                    </div>
                    <div className="mt-1 table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th
                              style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                backgroundColor: "#f8f9fa",
                              }}
                            >
                              SNo
                            </th>
                            <th
                              style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                backgroundColor: "#f8f9fa",
                              }}
                            >
                              Po.No
                            </th>
                            <th
                              style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                backgroundColor: "#f8f9fa",
                              }}
                            >
                              Amount{" "}
                              {getCurrencySymbol(userInfo?.user?.currency_code)}{" "}
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
                          {rateCutCashDetails?.length > 0 &&
                            rateCutCashDetails?.map((item, rowIndex) => (
                              <tr key={rowIndex}>
                                <td>{rowIndex + 1}</td>
                                <td style={{ textAlign: "left" }}>
                                  {item.ref_no}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {parseFloat(item.amount).toFixed(2)}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {" "}
                                  <Icon
                                    name={"trash-fill"}
                                    onClick={() =>
                                      handleRateCutCashRemove(rowIndex)
                                    }
                                  ></Icon>
                                </td>
                              </tr>
                            ))}
                          {rateCutCashDetails?.length == 0 && (
                            <tr>
                              <td colSpan={4} style={{ textAlign: "center" }}>
                                {" "}
                                No Data
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Row>
                </Col>
              </Row>
            )}
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default SupplierPayment;
