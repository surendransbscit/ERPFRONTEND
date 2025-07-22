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
import styled from "styled-components";
import IsRequired from "../../components/erp-required/erp-required";
import {
  MetalDropdown,
  SupplierDropdown,
  ProductDropdown
} from "../../components/filters/retailFilters";
import { useProducts, useSupplierFilter, useMetals } from "../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { createPurchasePayment, getPurchasePayments, getPurchaseMetalAdvance } from "../../redux/thunks/purchase";
import { isUndefined } from "../../components/common/calculations/ErpCalculations";
import "../../assets/css/sales_form.css";
import { NumberInputField,} from "../../components/form-control/InputGroup";
import { useBillSettingContext } from "../../contexts/BillSettingContext";
import { getPagePermission } from "../../redux/thunks/coreComponent";

export const Styles = styled.div`
 /* Target the select input */
  .custom-select__control {
    min-height: 25px !important;
    font-size: 10px !important;
  }
  
  /* Target the selected value */
  .custom-select__single-value {
    font-size: 10px !important;
  }
  
  /* Target dropdown options */
  .custom-select__menu {
    font-size: 10px !important;
    z-index: 9999 !important;
  }
  
  /* Target dropdown indicator (caret icon) */
  .custom-select__indicator {
    padding: 3px !important;
  }
`;

const RateCutAndMetalIssue = () => {
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: issubmitting, purchasePaymentListDetails, supplierAdvanceDetails } = useSelector((state) => state.purchaseReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const { products } = useProducts();
  const { supplier } = useSupplierFilter();
  const { metals } = useMetals();
  const [metal, SetMetal] = useState();
  const [paymentList, setPaymentList] = useState([]);
  const [selectSupplier, setSelectSupplier] = useState();
  const [metalAdvanceUtilized, setMetalAdvanceUtilized] = useState(false);
  const [netAmount, setNetAmount] = useState(0);
  const [selectedPaidWeight, setSelectedPaidWeight] = useState(0.0);
  const [selectedPaidAmount, setSelectedPaidAmount] = useState(0.0);
  const [balanceWeight, setBalanceWeight] = useState(0.0);
  const [balanceAmount, setBalanceAmount] = useState(0.0);
  const [metalAdvance, setMetalAdv] = useState(0.0);
  const [isSingleMetal, setIsSingleMetal] = useState(false);
  const initialMetalAdvanceState = {
    "id_metal": null,
    "balance_amt": 0,
    "balance_wt": 0,
  }
  const [metalAdvanceDetails, setMetalAdvanceDetails] = useState(initialMetalAdvanceState);
  const paymentFormRef = useRef(null);
  const initialState = {
    "discount": '',
    "discount_wt": '',
    "pureWt": 0,
    "rate": 0,
    "amount": 0,
  }
  const [rateCutCash, setRateCutCash] = useState(initialState);
  const [remarks, setRemarks] = useState();
  const [rateCutCashDetails, setRateCashCutDetails] = useState([]);
  const { billSettingType } = useBillSettingContext();

  const handleRateCutCashChange = (field, value) => {
    setRateCutCash((prevValues) => ({ ...prevValues, [field]: value }));
  };

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
      navigate(`${process.env.PUBLIC_URL}/`);
    }
  }, [pagePermission, navigate]);

  const setRateCash = (data) => {
    let details = [];
    if (data.length > 0) {
      console.log(data);
      details = data.map((item) => ({
        rate_per_gram: parseFloat(item.rate).toFixed(2),
        id_metal: item.id_metal,
        amount: parseFloat(item.amount).toFixed(2),
        pure_wt: parseFloat(item.pureWt).toFixed(3),
        purchase_entry: item?.purchase_entry,
        remarks: remarks,
        "type": item.type,
        "discount": item.discount,
        "dicount_wt": item.dicount_wt,
        "setting_bill_type": billSettingType,

      }));
    }
    return details;
  }
  const setMetalAdvance = () => {

    let data = [];

    if (metalAdvanceUtilized) {

      let metalAdvWt = metalAdvance;
      let list = paymentList.filter((item) => item.isChecked)
      for (const payment of list) {
        let usedWt = rateCutCashDetails?.reduce(
          (sum, obj) => sum + (obj?.purchase_entry == payment.purchase_entry_id && obj?.id_metal == payment.id_metal_id ? parseFloat(obj?.pureWt) : 0),
          0
        );
        usedWt += rateCutMetalDetails?.reduce(
          (sum, obj) => sum + (obj?.purchase_entry == payment.purchase_entry_id && obj?.id_metal == payment.id_metal_id ? parseFloat(obj?.pureWt) : 0),
          0
        );
        let balanceWt = parseFloat(payment.balance_weight) - parseFloat(usedWt);

        if (balanceWt > 0) {
          let wt = parseFloat(balanceWt) - parseFloat(metalAdvWt)
          if (wt < 0) {
            metalAdvWt = parseFloat(metalAdvWt) - parseFloat(balanceWt);
            data.push({ "ref_no": payment.ref_no, "ref_id": payment.purchase_entry_id, "weight": balanceWt, "id_metal": payment.id_metal_id, "id_supplier": selectSupplier, "type": 2, "adj_type": 1, "remarks": remarks,"setting_bill_type":billSettingType })
          } else {
            data.push({ "ref_no": payment.ref_no, "ref_id": payment.purchase_entry_id, "weight": metalAdvWt, "id_metal": payment.id_metal_id, "id_supplier": selectSupplier, "type": 2, "adj_type": 1, "remarks": remarks,"setting_bill_type":billSettingType })
            break;
          }
        }

      }

    }

    return data;

  }
  const setRateMetal = (data) => {
    let details = [];
    if (data.length > 0) {
      console.log(data);
      details = data.map((item) => ({
        pure_wt: parseFloat(item.pureWt).toFixed(3),
        issue_weight: parseFloat(item.metalWt,).toFixed(3),
        touch: item.touch,
        purchase_entry: item.purchase_entry,
        type: item.type,
        id_product: item.id_product,
        gross_wt: parseFloat(item.metalWt,).toFixed(3),
        net_wt: parseFloat(item.metalWt,).toFixed(3),
        stone_wt: 0,
        pieces: 0,
        dia_wt: 0,
        less_wt: 0,
        stone_details: [],
        remarks: remarks,
        discount: item.discount,
        "type": item.type,
      }));
    }
    return details;
  }

  const reset_data = () => {
    setPaymentList([]);
    setRateCashCutDetails([]);
    setRateMetalCutDetails([]);
    setRateCash(initialState);
    setRateMetal(initialStateMetal);
    setSelectSupplier("");
    SetMetal("");
    setMetalAdvanceDetails(initialMetalAdvanceState);
    setMetalAdv(0);
    setMetalAdvanceUtilized(false);
    reset();
  }

  const addRateCutCash = () => {
    if (rateCutCash.rate == '') {
      toastfunc("Enter Rate Cut-Cash Rate")
    } else if (rateCutCash.pureWt <= 0) {
      toastfunc("Enter Rate Cut-Cash Pure Weight")
    } else {
      let purchaseEntry = []
      let rateCutWt = rateCutCash.pureWt;
      let list = paymentList.filter((item) => item.isChecked)
      for (const payment of list) {
        let usedWt = rateCutCashDetails?.reduce(
          (sum, obj) => sum + (obj?.purchase_entry == payment.purchase_entry_id && obj?.id_metal == payment.id_metal_id ? parseFloat(obj?.pureWt) : 0),
          0
        );
        let balanceWt = parseFloat(payment.balance_weight) - parseFloat(usedWt);

        if (balanceWt > 0) {
          let wt = parseFloat(balanceWt) - parseFloat(rateCutWt)
          if (wt < 0) {
            rateCutWt = parseFloat(rateCutWt) - parseFloat(balanceWt)
            purchaseEntry.push({ "type": payment.type, "ref_no": payment.ref_no, "purchase_entry_id": payment.purchase_entry_id, "weight": balanceWt, "id_metal_id": payment.id_metal_id })
          } else {
            purchaseEntry.push({ "type": payment.type, "purchase_entry_id": payment.purchase_entry_id, "weight": rateCutWt, "id_metal_id": payment.id_metal_id })
            break;
          }
        }

      }
      if (purchaseEntry.length > 0) {
        for (const item of purchaseEntry) {
          let rateCutRate = rateCutCash.rate
          let discount = (parseFloat(item.weight) / parseFloat(rateCutCash.pureWt)) * isUndefined(rateCutCash.discount);
          let dicount_wt = (parseFloat(item.weight) / parseFloat(rateCutCash.pureWt)) * isUndefined(rateCutCash.discount_wt);
          let amount = ((parseFloat(item.weight)- parseFloat(dicount_wt))* parseFloat(rateCutCash.rate)) - parseFloat(isUndefined(discount));

          setRateCashCutDetails((prevValues) => ([...prevValues, { ...rateCutCash, "id_metal": item.id_metal_id, "ref_no": item.ref_no, "purchase_entry": item.purchase_entry_id, "amount": amount, "pureWt": item.weight, "discount": isUndefined(discount),"dicount_wt": isUndefined(dicount_wt), "type": item.type, }]));
          setRateCutCash(initialState);
        }
      }else if (purchaseEntry.length === 0){
        setRateCashCutDetails((prevValues) => ([...prevValues, { ...rateCutCash, "id_metal": metal, "ref_no": '', "purchase_entry": null, "amount": rateCutCash.amount, "pureWt": rateCutCash.pureWt, "discount": isUndefined(rateCutCash.discount),"dicount_wt": isUndefined(rateCutCash.discount_wt), "type": 3, }]));
        setRateCutCash(initialState);
      } else {
        toastfunc("Invalid Wt")
      }

    }
  };
  const handleRateCutCashRemove = (indexToRemove) => {
    setRateCashCutDetails((prevArray) => prevArray.filter((_, index) => index !== indexToRemove));
  };
  const initialStateMetal = {
    "id_metal": '',
    "id_product": '',
    "metalWt": 0,
    "pureWt": 0,
    "touch": 0,
    "discount": 0,
    "discountedPureWt": 0,
  }
  const [rateCutMetal, setRateCutMetal] = useState(initialStateMetal);
  const [rateCutMetalDetails, setRateMetalCutDetails] = useState([]);

  const handleRateCutMetalChange = (field, value) => {
    setRateCutMetal((prevValues) => ({ ...prevValues, [field]: value }));
  };
  const addRateCutMetal = () => {
    if (rateCutMetal.metalWt <= 0) {
      toastfunc("Enter Rate Cut-Metal Weight")
    } else if (rateCutMetal.pureWt <= 0) {
      toastfunc("Enter Rate Cut-Metal Pure Weight")
    }
    else if (rateCutMetal.id_product == '' || rateCutMetal.id_product == null || rateCutMetal.id_product == undefined) {
      toastfunc("Select Product");
    }
    else {
      let purchaseEntry = []
      let metalId = metal
      let rateCutWt = rateCutMetal.pureWt;
      let list = paymentList.filter((item) => item.isChecked)
      for (const payment of list) {
        let usedMetalWt = rateCutMetalDetails?.reduce(
          (sum, obj) => sum + (obj?.purchase_entry == payment.purchase_entry_id && obj?.id_metal == payment.id_metal_id ? parseFloat(obj?.pureWt) : 0),
          0
        );
        let usedWt = rateCutCashDetails?.reduce(
          (sum, obj) => sum + (obj?.purchase_entry == payment.purchase_entry_id && obj?.id_metal == payment.id_metal_id ? parseFloat(obj?.pureWt) : 0),
          0
        );
        let balanceWt = parseFloat(payment.balance_weight) - parseFloat(usedWt) - parseFloat(usedMetalWt);
        if (balanceWt > 0) {
          let wt = parseFloat(balanceWt) - parseFloat(rateCutWt)
          if (wt < 0) {
            rateCutWt = parseFloat(rateCutWt) - parseFloat(balanceWt)
            purchaseEntry.push({ "type": payment.type == 1 ? 1 : 4, "ref_no": payment.ref_no, "purchase_entry_id": payment.purchase_entry_id, "weight": balanceWt, "id_metal_id": payment.id_metal_id })
          } else {
            purchaseEntry.push({ "type": payment.type == 1 ? 1 : 4, "ref_no": payment.ref_no, "purchase_entry_id": payment.purchase_entry_id, "weight": rateCutWt, "id_metal_id": payment.id_metal_id })
            rateCutWt = 0
            break;
          }
        }

      }
      if (purchaseEntry.length > 0) {
        if (rateCutWt > 0) {
          purchaseEntry.push({ "ref_no": "Advance", "purchase_entry_id": null, "weight": rateCutWt, "id_metal_id": metalId, "type": 3 })
        }
        for (const item of purchaseEntry) {
          let discount = (parseFloat(item.weight) / parseFloat(rateCutMetal.pureWt)) * isUndefined(rateCutMetal.discount)
          let amount = (parseFloat(item.weight) * parseFloat(rateCutMetal.rate)) - parseFloat(isUndefined(discount))
          let metalWt = parseFloat((parseFloat(item.weight) * 100) / parseFloat(rateCutMetal.touch)).toFixed(3);
          setRateMetalCutDetails((prevValues) => ([...prevValues, { ...rateCutMetal, "id_metal": item.id_metal_id, "ref_no": item.ref_no, "purchase_entry": item.purchase_entry_id, "type": item.type, "amount": amount, "metalWt": metalWt, "pureWt": item.weight, "discount": isUndefined(discount), "type": item.type, }]));
          setRateCutMetal(initialStateMetal);
        }
      } else {
        toastfunc("Invalid Wt")
      }
      // setRateMetalCutDetails((prevValues) => ([ ...prevValues, {...rateCutMetal,"discount": isUndefined(rateCutMetal.discount)} ]));
      // setRateCutMetal(initialStateMetal);
    }
  };
  const handleRateCutMetalRemove = (indexToRemove) => {
    setRateMetalCutDetails((prevArray) => prevArray.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    setPaymentList(purchasePaymentListDetails);
  }, [purchasePaymentListDetails]);

  useEffect(() => {
    if (supplierAdvanceDetails != null) {
      setMetalAdvanceDetails(supplierAdvanceDetails);
      if (supplierAdvanceDetails?.balance_wt > 0) {
        setMetalAdv(supplierAdvanceDetails?.balance_wt);
      }
    }
  }, [supplierAdvanceDetails]);


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
    let totalAmount = parseFloat((parseFloat(isUndefined(rateCutCash.pureWt)) - parseFloat(isUndefined(rateCutCash.discount_wt))) * parseFloat(isUndefined(rateCutCash.rate)) - isUndefined(rateCutCash.discount)).toFixed(2);
    handleRateCutCashChange("amount", totalAmount);

  }, [rateCutCash.pureWt, rateCutCash.rate, rateCutCash.discount,rateCutCash.discount_wt]);

  useEffect(() => {
    let pureWt = parseFloat((parseFloat(isUndefined(rateCutMetal.metalWt)) * parseFloat(isUndefined(rateCutMetal.touch))) / 100).toFixed(3);
    let discountedWeight = parseFloat(parseFloat(isUndefined(pureWt)) - isUndefined(rateCutMetal.discount))
    let enteredWeight = pureWt;
    let usedWt = parseFloat(calculateTotalData('pureWt', 3, rateCutCashDetails)) + parseFloat(calculateTotalData('pureWt', 3, rateCutMetalDetails));
    let bal = parseFloat(selectedPaidWeight) - parseFloat(usedWt)
    console.log(selectedPaidWeight);
    if (parseFloat(selectedPaidWeight) < 0) {
      toastfunc("Please enter the Valid weight");
      enteredWeight = 0;
      handleRateCutMetalChange("metalWt", enteredWeight);
    }
    handleRateCutMetalChange("pureWt", enteredWeight);
    handleRateCutMetalChange("discountedPureWt", discountedWeight);

  }, [rateCutMetal.metalWt, rateCutMetal.touch, rateCutMetal.discount]);

  useEffect(() => {

    if (parseFloat(selectedPaidWeight) === 0) {
      handleRateCutCashChange("discount", '');
      handleRateCutCashChange("rate", 0);
      handleRateCutCashChange("pureWt", 0);
      handleRateCutCashChange("amount", 0);
      handleRateCutCashChange("discount_wt", '');

    }
    let usedWt = parseFloat(calculateTotalData('pureWt', 3, rateCutCashDetails)) + parseFloat(calculateTotalData('pureWt', 3, rateCutMetalDetails));
    let advanceWt = metalAdvanceUtilized == true ? parseFloat(metalAdvance) : 0;
    let balancePureWeight = parseFloat(
      parseFloat(isUndefined(selectedPaidWeight)) -
      parseFloat(isUndefined(usedWt))
      -parseFloat(isUndefined(advanceWt))
    ).toFixed(3);
    let balanceRateCutAmount = selectedPaidAmount
    setBalanceWeight(balancePureWeight);
    setBalanceAmount(balanceRateCutAmount);
  }, [selectedPaidWeight, selectedPaidAmount, rateCutMetalDetails, rateCutCashDetails,metalAdvanceUtilized,metalAdvance]);

  useEffect(() => {
    let totalWeight = paymentList?.reduce(
      (sum, obj) => sum + (obj?.isChecked === true ? parseFloat(obj?.balance_weight) : 0),
      0
    );
    let totalAmount = paymentList?.reduce(
      (sum, obj) => sum + (obj?.isChecked === true ? parseFloat(obj?.balance_amount) : 0),
      0
    );
    setSelectedPaidWeight(parseFloat(totalWeight).toFixed(3));
    setSelectedPaidAmount(parseFloat(totalAmount).toFixed(2));
    setNetAmount(totalAmount);

  }, [paymentList]);

  useEffect(() => {
    getOrderDetails({ karigar: selectSupplier, metal: metal, billSettingType });
  }, [billSettingType]);
  const getOrderDetails = (filters) => {
    if (filters.karigar && filters.metal) {
      dispatch(getPurchasePayments(filters));
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

  const form_submit = async (data, actionType) => {
    let paymentData = paymentList.filter((item) => item.isChecked === true);
    console.log(paymentList);
    if (remarks == "" || remarks == null) {
      toastfunc("Enter Remarks !!");
      return;
    }
    // if (paymentData.length > 0) {
      const addData = {
        id_supplier: selectSupplier,
        id_metal: metal,
        type: 1,
        paid_amount: selectedPaidAmount,
        net_amount: netAmount,
        poDetails: paymentData,
        rate_cut_details: setRateCash(rateCutCashDetails),
        metal_issue_details: setRateMetal(rateCutMetalDetails),
        metal_varavu_details: setMetalAdvance(),
        remarks: remarks,
        setting_bill_type: (billSettingType)
      };
      try {
        await dispatch(createPurchasePayment(addData)).unwrap();
        reset_data();
        navigate(`${process.env.PUBLIC_URL}/purchase/supplier_payment/list`, { state: { supplierId: selectSupplier, metalId: metal } });
        // toastsuccess("Payment done successfully.");
      } catch (error) {
        console.error(error);
      }
    // } else {
    //   toastfunc("Select Item");
    // }
  };

  useEffect(() => {
    if (metal && selectSupplier) {
      dispatch(getPurchaseMetalAdvance({ "id_metal": metal, "id_supplier": selectSupplier }));
    }
  }, [metal, selectSupplier]);

  const selectAll = (value) => {
    const updatedData = paymentList.map(item => ({
      ...item,
      isChecked: value
    }));
    setPaymentList(updatedData);
  }

  return (
    <React.Fragment>
      <Head title={title ? title : "Rate Cut And Metal Issue"} />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"}>
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <SaveButton
                disabled={issubmitting || !pagePermission?.add}
                size="md"
                color="primary"
                onClick={handleSubmit((data) => form_submit(data, "saveAndNew"))}
              >
                {issubmitting ? "Saving" : "Save"}
              </SaveButton>
            </Col>
          </Row>
          <div className="custom-grid" >
            <Row lg={12} className={"form-control-sm"} style={{ marginTop: "20px" }}>
              <Col md={4}>
                <Row className="form-group" >
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
                        setPaymentList([]);
                        setMetalAdvanceDetails(initialMetalAdvanceState);
                        setMetalAdv(0);
                        setMetalAdvanceUtilized(false);
                       // getOrderDetails({karigar : value,metal:metal,billSettingType});
                        let sup = supplier.find((item) => item.id_supplier == value);
                        if (sup) {
                           if(sup.id_metal.length == 1){
                            setIsSingleMetal(true);
                            SetMetal(sup.id_metal[0]);
                            getOrderDetails({karigar : value,metal:sup.id_metal[0],billSettingType});
                           }else{
                            setIsSingleMetal(false);
                            getOrderDetails({karigar : value,metal:metal,billSettingType});
                           }
                        }
                      }}
                      clearErrors={clearErrors}
                      placeholder={"Supplier"}
                      classNamePrefix="custom-select"
                      tabIndex = {1}
                    />
                  </Col>
                </Row>
                { !isSingleMetal && (
                <Row className="form-group" >
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
                        setPaymentList([]);
                        setMetalAdvanceDetails(initialMetalAdvanceState);
                        setMetalAdv(0);
                        setMetalAdvanceUtilized(false);
                        getOrderDetails({ karigar: selectSupplier, metal: value, billSettingType });
                      }}
                      isRequired={true}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      tabIndex={2}
                      classNamePrefix="custom-select"
                      message={errors.metal && "Metal is Required"}
                    />
                  </Col>
                </Row>
                )}
                <Row className="form-group row g-4">
                  <Col md="4">
                    <Label>Selected ( {getCurrencySymbol(userInfo?.user?.currency_code)} )</Label>
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
                      onChange={(event) => { }}
                    />
                  </Col>
                </Row>

                <Row className="form-group">
                  <Col md="4" className="">
                    <Label className="floating-label" id={"selectedPaidWeight"}>
                      Selected ( G )
                    </Label>
                  </Col>
                  <Col lg="8">
                    <input
                      id={"selectedPaidWeight"}
                      {...register("selectedPaidWeight")}
                      placeholder="Weight"
                      className="form-control form-control-sm"
                      type="text"
                      style={{ textAlign: "right" }}
                      value={selectedPaidWeight}

                    />
                  </Col>
                </Row>

                <Row className="form-group row g-4">
                  <Col md="4">
                    <Label>Balance ( {getCurrencySymbol(userInfo?.user?.currency_code)} )</Label>
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
                    <Label>Balance ( G )</Label>
                  </Col>
                  <Col lg="8">
                    <input
                      id={"balanceWeight"}
                      {...register("balanceWeight")}
                      placeholder="Weight"
                      className="form-control form-control-sm"
                      type="text"
                      style={{ textAlign: "right" }}
                      value={balanceWeight}
                      setValue={balanceWeight}
                    />
                  </Col>
                </Row>

              </Col>
              <Col md={5}>
                <div >

                  <div className="row " style={{ borderLeft: "1px solid #ddd" }} >
                    {/* Rate Cut - Metal */}
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-4">
                          <h6>Rate Cut - Cash</h6>
                        </div> <div className="col-md-2" ><button className="btn btn-primary" onClick={addRateCutCash} tabIndex={8} > Add</button></div>
                        <div className="col-md-3" style={{ "padding-left": "0px" }} >

                          <NumberInputField
                            register={register}
                            placeholder={"Discount (" + getCurrencySymbol(userInfo?.user?.currency_code) + ")"}
                            id={"rateCutDiscount"}
                            value={rateCutCash.discount}
                            setValue={setValue}
                            SetValue={(value) => {
                              handleRateCutCashChange("discount", value);
                              clearErrors("discount");
                            }}
                            minError={"Discount Should greater than or equal to 0"}
                            reqValueError={"Discount is Required"}
                            message={errors.rateCutDiscount && errors.rateCutDiscount.message}
                            tabIndex={7}

                          />
                        </div>
                        <div className="col-md-3" style={{ "padding-left": "0px" }}>

                          <NumberInputField
                            register={register}
                            placeholder={"Discount (g)"}
                            id={"rateCutDiscountWt"}
                            value={rateCutCash.discount_wt}
                            setValue={setValue}
                            SetValue={(value) => {
                              handleRateCutCashChange("discount_wt", value);
                              clearErrors("rateCutDiscountWt");
                            }}
                            minError={"Discount Should greater than or equal to 0"}
                            reqValueError={"Discount is Required"}
                            message={errors.rateCutDiscountWt && errors.rateCutDiscountWt.message}
                            tabIndex={7}

                          />
                          </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <label>Pure Weight (g)</label>
                          <NumberInputField
                            register={register}
                            placeholder="Pure Weight (g)"
                            id={"rateCutPureWt"}
                            value={rateCutCash.pureWt}

                            min={0}
                            setValue={setValue}
                            SetValue={(value) => {

                              let enteredWeight = value;
                              // let usedWt = parseFloat(calculateTotalData('pureWt', 3, rateCutCashDetails)) + parseFloat(calculateTotalData('pureWt', 3, rateCutMetalDetails));
                              // let bal = parseFloat(selectedPaidWeight) - parseFloat(usedWt)
                              // console.log(selectedPaidWeight);
                              // if (parseFloat(bal) < parseFloat(enteredWeight)) {
                              //   toastfunc("You have Entered More than the Selected Weight");
                              //   enteredWeight = 0;
                              // } else if (parseFloat(selectedPaidWeight) < 0) {
                              //   toastfunc("Please enter the Valid weight");
                              //   enteredWeight = 0;
                              // }
                              handleRateCutCashChange("pureWt", enteredWeight);
                              clearErrors("pureWt");
                            }}
                            minError={"Pure Weight Should greater than or equal to 0"}
                            reqValueError={"Pure Weight is Required"}
                            message={errors.rateCutPureWt && errors.rateCutPureWt.message}
                            tabIndex={4}
                          />
                        </div>
                        <div className="col">
                          <label>Rate ({getCurrencySymbol(userInfo?.user?.currency_code)})</label>
                          <NumberInputField
                            register={register}
                            placeholder={"Rate (" + getCurrencySymbol(userInfo?.user?.currency_code) + ")"}
                            id={"rateCutRate"}
                            value={rateCutCash.rate}

                            min={0}
                            setValue={setValue}
                            SetValue={(value) => {
                              handleRateCutCashChange("rate", value);
                              clearErrors("rate");
                            }}
                            minError={"Rate Should greater than or equal to 0"}
                            reqValueError={"Rate is Required"}
                            message={errors.rateCutRate && errors.rateCutRate.message}
                            tabIndex={5}
                          />
                        </div>
                        <div className="col">
                          <label>Amount ({getCurrencySymbol(userInfo?.user?.currency_code)})</label>
                          <NumberInputField
                            register={register}
                            placeholder={"Amount (" + getCurrencySymbol(userInfo?.user?.currency_code) + ")"}
                            id={"rateCutAmount"}
                            value={rateCutCash.amount}

                            min={0}
                            setValue={setValue}
                            SetValue={(value) => {
                              handleRateCutCashChange("amount", value);
                              clearErrors("amount");
                            }}
                            minError={"Amount Should greater than or equal to 0"}
                            reqValueError={"Amount is Required"}
                            message={errors.rateCutAmount && errors.rateCutAmount.message}
                            tabIndex={6}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Rate Cut - Cash */}
                    <hr style={{ marginTop: '10px' }} />
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-5">
                          <h6>Rate Cut - Metal</h6>
                           
                        </div> <div className="col-md-3" ><button className="btn btn-primary" onClick={addRateCutMetal} tabIndex={14}> Add</button></div>
                        <div className="col-md-4" style={{ "display": "none" }}>
                          <NumberInputField
                            register={register}
                            placeholder="Discount (g)"
                            id={"rateCutMetalDiscount"}
                            value={rateCutMetal.discount}
                            min={0}
                            setValue={setValue}
                            SetValue={(value) => {
                              handleRateCutMetalChange("discount", value);
                              clearErrors("rateCutMetalDiscount");
                            }}
                            minError={"Discount Should greater than or equal to 0"}
                            reqValueError={"Discount is Required"}
                            message={errors.rateCutMetalDiscount && errors.rateCutMetalDiscount.message}
                            tabIndex={13}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <label>Product</label>
                          <ProductDropdown
                            register={register}
                            id={"rateCutProduct"}
                            selectedProduct={rateCutMetal.id_product}
                            products={products}
                            setValue={setValue}
                            onProductChange={(value) => {
                              handleRateCutMetalChange("id_product", value);
                              let productsDetails = products.find((pro) => pro.pro_id == value);
                              console.log(productsDetails)
                              handleRateCutMetalChange("id_metal", productsDetails?.id_metal);
                            }}
                            clearErrors={clearErrors}
                            placeholder={"Product"}
                            classNamePrefix="custom-select"
                            selectedMetal={metal}
                            productType = {2}
                            tabIndex={9}
                          />
                        </div>
                        <div className="col">
                          <label>Metal Weight</label>
                          <NumberInputField
                            register={register}
                            placeholder="Metal Weight (g)"
                            id={"rateCutMetalWeight"}
                            value={rateCutMetal.metalWt}
                            min={0}
                            setValue={setValue}
                            SetValue={(value) => {
                              handleRateCutMetalChange("metalWt", value);
                              clearErrors("rateCutMetalWeight");
                            }}
                            minError={"Metal Weight Should greater than or equal to 0"}
                            reqValueError={"Metal Weight is Required"}
                            message={errors.rateCutMetalWeight && errors.rateCutMetalWeight.message}
                            tabIndex={10}
                          />
                        </div>
                        <div className="col">
                          <label>Pure calculations</label>
                          <NumberInputField
                            register={register}
                            placeholder="Pure Calculations"
                            id={"rateCutMetalTouch"}
                            value={rateCutMetal.touch}

                            min={0}
                            setValue={setValue}
                            SetValue={(value) => {
                              handleRateCutMetalChange("touch", value);
                              clearErrors("rateCutMetalTouch");
                            }}
                            minError={"Pure Calculations Should greater than or equal to 0"}
                            reqValueError={"Pure Calculations is Required"}
                            message={errors.rateCutMetalTouch && errors.rateCutMetalTouch.message}
                            tabIndex={11}
                          />
                        </div>
                        <div className="col">
                          <label>Pure Weight (g)</label>
                          <NumberInputField
                            register={register}
                            placeholder="Pure Weight (g)"
                            id={"rateCutMetalPureWt"}
                            value={rateCutMetal.discountedPureWt}

                            min={0}
                            setValue={setValue}
                            SetValue={(value) => {
                              handleRateCutMetalChange("pureWt", value);
                              clearErrors("rateCutMetalPureWt");
                            }}
                            minError={"Pure Weight Should greater than or equal to 0"}
                            reqValueError={"Pure Weight is Required"}
                            message={errors.rateCutMetalPureWt && errors.rateCutMetalPureWt.message}
                            tabIndex={12}
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </Col>
              <Col md={3}>
                <div >
                  <div className="row " style={{ borderLeft: "1px solid #ddd" }} >
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col">
                          <label>Metal Advance (g) &nbsp;&nbsp;&nbsp;
                            <input
                              type="checkbox"
                              onChange={(event) => {
                                setMetalAdvanceUtilized(event.target.checked);
                              }}
                              checked={metalAdvanceUtilized}
                              tabIndex={15}

                            /></label>
                          <NumberInputField
                            register={register}
                            placeholder="Metal Advance (g)"
                            id={"metalAdvance"}
                            value={metalAdvance}
                            readOnly={metalAdvanceUtilized == false}
                            min={0}
                            max={metalAdvanceDetails.balance_wt}
                            setValue={setValue}
                            SetValue={(value) => {
                              setMetalAdv(value);
                              clearErrors("metalAdvance");
                            }}
                            minError={"Metal Advance Should greater than or equal to 0"}
                            reqValueError={"Metal Advance is Required"}
                            message={errors.metalAdvance && errors.metalAdvance.message}
                            tabIndex={16}
                          />
                        </div>
                      </div>
                      <Row className="form-group row g-4 mt-2">
                        <Col md="3">
                          <div className="form-group">
                            <Label >
                              Remarks<IsRequired/>
                            </Label>
                          </div>
                        </Col>
                        <Col lg="9">
                          <div className="form-control-wrap">
                            <textarea
                              {...register("remarks")}
                              id="remarks"
                              style={{ minHeight: "4vw" }}
                              rows="3"
                              className="form-control form-control-sm"
                              value={remarks}
                              defaultValue={remarks || ""}
                              onChange={(e) => setRemarks(e.target.value)}
                              tabIndex={17}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>

                </div>
              </Col>
            </Row>
            <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
              <Col md={8} className="">

                <div className="mt-1 table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>S.NO
                          <input
                            type="checkbox"
                            onChange={(event) => {
                              selectAll(event.target.checked);
                            }}
                          /> </th>
                        <th>Metal</th>
                        <th>PO No</th>
                        <th>Pay Date</th>
                        <th>Pcs</th>
                        <th>Pure Wt</th>
                        <th>Charges</th>
                        <th>Amount</th>
                        <th>Paid Wt</th>
                        <th>Bal Pure Wt</th>
                        <th>Paid Amt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentList?.length > 0 &&
                        paymentList?.map((item, rowIndex) => (
                          <tr key={rowIndex}  >
                            <td style={{ color: parseFloat(item.balance_weight) == 0 ? 'red' : '#36fb36' }}  >
                              {rowIndex + 1}{" "}
                              {parseFloat(item.balance_weight) != 0 && (
                                <input
                                  type="checkbox"
                                  onChange={(event) => {
                                    handelChange(rowIndex, "isChecked", event.target.checked);
                                  }}
                                  checked={item.isChecked}
                                />)}
                            </td>
                            <td style={{ color: "" }} >{item.metal_name}</td>
                            <td style={{ color: "" }} >{item.ref_no}</td>
                            <td style={{ color: "" }} >{item.payment_date}</td>
                            <td style={{ textAlign: "right", color: "" }}>{item.pieces}</td>
                            <td style={{ textAlign: "right", color: "" }}>{parseFloat(item.pure_wt).toFixed(3)}</td>
                            <td style={{ textAlign: "right", color: "" }}>{parseFloat(item.mc_and_other_charges).toFixed(2)}</td>
                            <td style={{ textAlign: "right", color: "" }}>{parseFloat(item.total_amount).toFixed(2)}</td>
                            <td style={{ textAlign: "right", color: "" }}>{parseFloat(item.paid_weight).toFixed(3)}</td>
                            <td style={{ textAlign: "right", color: "" }}>{parseFloat(item.balance_weight).toFixed(3)}</td>
                            <td style={{ textAlign: "right", color: "" }}>{parseFloat(item.paid_amount).toFixed(2)}</td>
                          </tr>
                        ))}
                    </tbody>

                    <tfoot>
                      <tr style={{ fontWeight: "bold" }}>
                        <td>Total</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: "right" }}>{calculateTotal("pieces", 0)}</td>
                        <td style={{ textAlign: "right" }}>{calculateTotal("pure_wt", 3)}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: "right" }}>{calculateTotal("balance_weight", 3)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Col>
              <Col md={4}>
                <Row>
                  <div className="row">
                    <div className="col-md-5" style={{ paddingRight: "0px" }} ><h6>Rate Cut - Cash</h6> </div>
                    <div className="col-md-3" style={{ paddingRight: "0px" }}>
                      Pure Wt (g)
                    </div>
                    <div className="col-md-4">
                      <input type="text" className="form-control form-control-sm" readOnly placeholder=" Pure Wt (g)" value={calculateTotalData('pureWt', 3, rateCutCashDetails)} />

                    </div>
                  </div>
                  <div className="mt-1 table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>SNo</th>
                          <th>Po.No</th>
                          <th>Pure.Wt</th>
                          <th>Rate / g</th>
                          <th>Rate Cut {getCurrencySymbol(userInfo?.user?.currency_code)} </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rateCutCashDetails?.length > 0 &&
                          rateCutCashDetails?.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                              <td>
                                {rowIndex + 1}
                              </td>
                              <td style={{ textAlign: "left" }}>{item.ref_no}</td>
                              <td style={{ textAlign: "right" }}>{parseFloat(item.pureWt).toFixed(3)}</td>
                              <td style={{ textAlign: "right" }}>{parseFloat(item.rate).toFixed(2)}</td>
                              <td style={{ textAlign: "right" }}>{parseFloat(item.amount).toFixed(2)}</td>
                              <td style={{ textAlign: "center" }} >  <Icon name={"trash-fill"} onClick={() => handleRateCutCashRemove(rowIndex)} ></Icon></td>
                            </tr>
                          ))}
                        {rateCutCashDetails?.length == 0 &&
                          <tr>
                            <td colSpan={6} style={{ textAlign: "center" }}> No Data</td>
                          </tr>}
                      </tbody>
                    </table>
                  </div>
                </Row>
                <Row className="mt-2">
                  <div className="row">
                    <div className="col-md-5" style={{ paddingRight: "0px" }} ><h6>Rate Cut - Metal</h6> </div>
                    <div className="col-md-3" style={{ paddingRight: "0px" }}>
                      Pure Wt (g)
                    </div>
                    <div className="col-md-4">
                      <input type="text" className="form-control form-control-sm" readOnly placeholder=" Pure Wt (g)" value={calculateTotalData('pureWt', 3, rateCutMetalDetails)} />

                    </div>
                  </div>
                  <div className="mt-2 table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>SNo</th>
                          <th>Po.No</th>
                          <th>Metal.Wt</th>
                          <th>Touch</th>
                          <th>Pure.Wt</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rateCutMetalDetails?.length > 0 &&
                          rateCutMetalDetails?.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                              <td>
                                {rowIndex + 1}
                              </td>
                              <td style={{ textAlign: "left" }}>{(item.ref_no)}</td>
                              <td style={{ textAlign: "right" }}>{parseFloat(item.metalWt).toFixed(3)}</td>
                              <td style={{ textAlign: "right" }}>{parseFloat(item.touch).toFixed(2)}</td>
                              <td style={{ textAlign: "right" }}>{parseFloat(item.pureWt).toFixed(3)}</td>
                              <td style={{ textAlign: "center" }} >  <Icon name={"trash-fill"} onClick={() => handleRateCutMetalRemove(rowIndex)} ></Icon></td>
                            </tr>
                          ))}
                        {rateCutMetalDetails?.length == 0 &&
                          <tr>
                            <td colSpan={6} style={{ textAlign: "center" }}> No Data</td>
                          </tr>}
                      </tbody>
                    </table>
                  </div>
                </Row>
              </Col>
            </Row>

          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default RateCutAndMetalIssue;
