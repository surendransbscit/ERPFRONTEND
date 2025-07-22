import React, { useEffect, useState, useRef } from "react";
import Head from "../../layout/head/Head";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Col,
  Row,
  PreviewCard,
  SaveButton,
  Icon,
} from "../../components/Component";
import {
  InputFieldWithDropdown,
  NumberInputField,
} from "../../components/form-control/InputGroup";
import Content from "../../layout/content/Content";
import "../../assets/css/sales_form.css";
import "../../assets/css/datatable.css";
import { BranchDropdown } from "../../components/filters/retailFilters";
import {
  useBranches,
  useFinYears,
  useProducts,
} from "../../components/filters/filterHooks";
import IsRequired from "../../components/erp-required/erp-required";
import { Button, Label } from "reactstrap";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  calculatePureWeight,
  isUndefined,
} from "../../components/common/calculations/ErpCalculations";
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import { OrderNoWithFinYear } from "../../components/form-control/InputGroup";
import { useHotkeys } from "react-hotkeys-hook";
import {
  getPurchaseEntryByRefNo,
  updatePurchaseEntry,
} from "../../redux/thunks/purchase";
import { useBillSettingContext } from "../../contexts/BillSettingContext";
import { getPagePermission } from "../../redux/thunks/coreComponent";
const PurchaseTouchUpdate = () => {
  const location = useLocation();
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.metalReducer
  );
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const methods = useForm();
  const { branches } = useBranches();
  const [isChecked, setIsChecked] = useState(true);
  const dispatch = useDispatch();
  const [idBranch, setIdBranch] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [purchaseOrderNO, SetPurchaseOrderNO] = useState("");
  const [finYear, setFinYear] = useState("");
  const [itemDetails, setItemDetails] = useState([]);
  const [purchaseTouch, setPurchaseTouch] = useState();
  const [purchaseCalType, setPurchaseCalType] = useState(1);
  const [purchaseVa, setPurchaseVa] = useState();
  const [purchaseMc, setPurchaseMc] = useState();
  const [purchaseMcType, setPurchaseMcType] = useState(1);
  const [purchaseFlatMc, setPurchaseFlatMc] = useState();
  const { products } = useProducts();
  const { finYears } = useFinYears();
  const { billSettingType } = useBillSettingContext();
  const { purchaseInfo } = useSelector((state) => state.purchaseReducer);
  const PureCalcTypeOptions = [
    { label: "Touch+VA", value: 2, isDefault: true },
    { label: "Touch", value: 1 },
    { label: "Wt * VA %", value: 3 },
  ];
  const calcTypeOptions = [
    { label: "Per Gm", value: 1, isDefault: true },
    { label: "Per Pcs", value: 2 },
  ];

  const pathName = location?.pathname;
  const { pagePermission } = useSelector((state) => state.coreCompReducer);
  // console.log(pagePermission);

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

  // useEffect(() => {
  //   if (add === undefined && id === undefined) {
  //     navigate(`${process.env.PUBLIC_URL}/purchase//list`);
  //   }
  // }, [add, id, navigate]);

  const handleFormChange = (index, field, value) => {
    setItemDetails((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;
      return updatedValues;
    });
  };

  useEffect(() => {
    const updatedItemDetails = itemDetails.map((item) => {
      let product = products.find((pro) => pro.pro_id === item.id_product);

      let mc = 0;

      if (product.mc_calc_type == 1) {
        mc =
          item.purchase_mc_type === 1
            ? parseFloat(
                parseFloat(item.purchase_mc) * parseFloat(item.gross_wt)
              ).toFixed(2)
            : parseFloat(
                parseFloat(item.purchase_mc) * parseFloat(item.pieces)
              ).toFixed(2);
      } else {
        mc =
          item.purchase_mc_type === 1
            ? parseFloat(
                parseFloat(item.purchase_mc) * parseFloat(item.net_wt)
              ).toFixed(2)
            : parseFloat(
                parseFloat(item.purchase_mc) * parseFloat(item.pieces)
              ).toFixed(2);
      }

      let pureWeight = calculatePureWeight({
        netWeight: item.net_wt,
        purchaseTouch: item.purchase_touch,
        purchaseWastage: item.purchase_va,
        pureCalcType: item.pure_wt_cal_type,
      });

      return {
        ...item,
        pure_wt: pureWeight,
        total_mc_value: mc,
      };
    });

    if (JSON.stringify(updatedItemDetails) !== JSON.stringify(itemDetails)) {
      setItemDetails(updatedItemDetails);
    }
  }, [JSON.stringify(itemDetails)]);

  useEffect(() => {
    const updatedItemDetails = itemDetails.map((item) => {
      if (item.isChecked == true) {
        let product = products.find((pro) => pro.pro_id === item.id_product);

        let mc = 0;

        if (product.mc_calc_type == 1) {
          mc =
            purchaseMcType === 1
              ? parseFloat(
                  parseFloat(isUndefined(purchaseMc)) *
                    parseFloat(item.gross_wt)
                ).toFixed(2)
              : parseFloat(
                  parseFloat(isUndefined(purchaseMc)) * parseFloat(item.pieces)
                ).toFixed(2);
        } else {
          mc =
            purchaseMcType === 1
              ? parseFloat(
                  parseFloat(isUndefined(purchaseMc)) * parseFloat(item.net_wt)
                ).toFixed(2)
              : parseFloat(
                  parseFloat(isUndefined(purchaseMc)) * parseFloat(item.pieces)
                ).toFixed(2);
        }
        let pureWeight = calculatePureWeight({
          netWeight: item.net_wt,
          purchaseTouch: isUndefined(purchaseTouch),
          purchaseWastage: isUndefined(purchaseVa),
          pureCalcType: isUndefined(purchaseCalType),
        });
        return {
          ...item,
          pure_wt_cal_type: purchaseCalType,
          purchase_va: isUndefined(purchaseVa),
          purchase_touch: isUndefined(purchaseTouch),
          pure_wt: pureWeight,
          purchase_mc: isUndefined(purchaseMc),
          total_mc_value: isUndefined(mc),
          purchase_mc_type: purchaseMcType,
          purchase_flat_mc: isUndefined(purchaseFlatMc),
        };
      } else {
        return {
          ...item,
        };
      }
    });
    setItemDetails(updatedItemDetails);
  }, [
    purchaseCalType,
    purchaseVa,
    purchaseTouch,
    purchaseMc,
    purchaseMcType,
    purchaseFlatMc,
  ]); // Run whenever itemDetails changes

  useEffect(() => {
    const updatedItemDetails = itemDetails.map((item) => {
      return {
        ...item,
        isChecked: isChecked,
      };
    });
    setItemDetails(updatedItemDetails);
  }, [isChecked]);

  useEffect(() => {
    if (purchaseInfo?.item_details != undefined) {
      const updatedItemDetails = purchaseInfo.item_details.map((item) => {
        return {
          ...item,
          isChecked: isChecked,
        };
      });
      setItemDetails(updatedItemDetails);
    }
  }, [purchaseInfo]);

  const calculateTotal = (field, decimal_places) => {
    return itemDetails.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const reset_data = () => {
    setPurchaseVa("");
    setPurchaseTouch("");
    setItemDetails([]);
    SetPurchaseOrderNO("");
    setIdBranch("");
    setIsSubmitted(false);
    setPurchaseMc("");
    setPurchaseCalType("1");
    setPurchaseTouch("");
    setPurchaseVa("");
    setPurchaseFlatMc("");
    setPurchaseMcType("1");
  };

  useEffect(() => {
    console.log("Updated itemDetails:", itemDetails); // Logs whenever itemDetails changes
  }, [itemDetails]);

  const getOrderDetails = () => {
    if (purchaseOrderNO == "" || !purchaseOrderNO || !idBranch) {
      if (!idBranch) {
        toastfunc("Select Branch !!");
      } else {
        toastfunc("Enter Po No " + purchaseOrderNO);
      }
    } else {
      dispatch(
        getPurchaseEntryByRefNo({
          id_branch: idBranch,
          po_no: purchaseOrderNO,
          fin_id: finYear,
          billSettingType: billSettingType,
        })
      );
    }
  };

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    onClickSave();
  });

  const validateItemDetails = (currentRowDetails) => {
    let allowSubmit = true;
    if (
      currentRowDetails.purchase_touch === "" ||
      currentRowDetails.purchase_touch == 0
    ) {
      toastfunc("Purchase Touch is Required");
      allowSubmit = false;
    } else if (parseFloat(currentRowDetails.purchase_touch) >= 100) {
      toastfunc("Purchase Touch cannot Be Grater Than 100..");
      allowSubmit = false;
    } else if (parseFloat(currentRowDetails.purchase_va) >= 100) {
      toastfunc("Purchase Va cannot Be Grater Than 100..");
      allowSubmit = false;
    } else if (
      currentRowDetails.pure_wt === "" ||
      currentRowDetails.pure_wt <= 0
    ) {
      toastfunc("Pure Wt is Required..");
      allowSubmit = false;
    }

    return allowSubmit;
  };

  const onClickSave = async () => {
    let allowSubmit = true;

    for (let i = 0; i < itemDetails.length; i++) {
      const isValid = validateItemDetails(itemDetails[i]);
      if (!isValid) {
        allowSubmit = false;
        break;
      }
    }
    let data = itemDetails
      .filter((item) => item.isChecked === true)
      .map((item) => ({
        id_purchase_entry_detail: item.id_purchase_entry_detail,
        purchase_touch: item.purchase_touch,
        purchase_va: item.purchase_va,
        pure_wt_cal_type: item.pure_wt_cal_type,
        pure_wt: item.pure_wt,
        purchase_mc: isUndefined(item.purchase_mc),
        total_mc_value: isUndefined(item.total_mc_value),
        purchase_mc_type: item.purchase_mc_type,
        purchase_flat_mc: item.purchase_flat_mc,
      }));

    console.log(data);

    if (idBranch === "" || idBranch == null) {
      toastfunc("Please select the Branch.");
      allowSubmit = false;
    } else if (purchaseInfo?.item_details == undefined) {
      toastfunc("Invalid Details");
      allowSubmit = false;
    }

    if (allowSubmit) {
      setIsSubmitted(true);
      try {
        let postData = {
          ...purchaseInfo,
          item_details: data,
          is_delete_req: 0,
        };
        let response = "";
        response = await dispatch(
          updatePurchaseEntry({
            id: purchaseInfo.id_purchase_entry,
            putData: postData,
          })
        ).unwrap();
        reset_data();
        // navigate(`${process.env.PUBLIC_URL}/purchase/purchase_return/list`);
      } catch (error) {
        setIsSubmitted(false);
      }
    }
  };

  return (
    <React.Fragment>
      <Head title="Touch Update" />
      <Content>
        <PreviewCard className="h-100">
          <FormProvider {...methods}>
            <Row
              lg={12}
              className={"form-control-sm"}
              style={{ marginTop: "10px" }}
            >
              <Col md={5}>
                <ModifiedBreadcrumb />
              </Col>
              <Col md={4}></Col>
              <Col md={3} className="text-right">
                <Button
                  disabled={isSubmitted}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/purchase/purchase_entry/list`
                    )
                  }
                >
                  Cancel
                </Button>{" "}
                <Button
                  color="primary"
                  disabled={isSubmitted || !pagePermission?.edit}
                  size="md"
                  onClick={onClickSave}
                >
                  {isSubmitted ? "Saving" : "Save(Ctrl+s)"}
                </Button>
              </Col>
            </Row>

            <Row md={12} className="form-control-sm">
              <Col md={2}>
                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor="selectedDesign"
                    style={{ marginBottom: "0px" }}
                  >
                    Branch
                    <IsRequired />
                  </label>
                  <BranchDropdown
                    register={register}
                    id={"idBranch"}
                    branches={branches}
                    selectedBranch={idBranch}
                    isRequired={true}
                    onBranchChange={setIdBranch}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.idBranch && "Branch is Required"}
                    tabIndex={1}
                  ></BranchDropdown>
                </div>
              </Col>
              <Col md={3}>
                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor="selectedDesign"
                    style={{ marginBottom: "0px" }}
                  >
                    Po No
                    <IsRequired />
                  </label>
                  <OrderNoWithFinYear
                    register={register}
                    placeholder="Po No"
                    id={"purchaseOrderNO"}
                    value={purchaseOrderNO}
                    isRequired={true}
                    readOnly={false}
                    type={"text"}
                    setValue={setValue}
                    SetValue={(value) => {
                      SetPurchaseOrderNO(value);
                    }}
                    optionId={"finYear"}
                    name={"finYear"}
                    options={finYears}
                    onDropDownChange={(value) => {
                      setFinYear(value);
                    }}
                    selectedOption={finYear}
                    message={
                      errors.purchaseOrderNO && errors.purchaseOrderNO.message
                    }
                  />
                </div>
              </Col>
              <Col md={1}>
                <div className="form-group" style={{ marginTop: "20px" }}>
                  <Button
                    color="warning"
                    disabled={isSubmitted}
                    size="md"
                    onClick={getOrderDetails}
                  >
                    {isSubmitted ? "Searching" : "Search"}
                  </Button>
                </div>
              </Col>

              {/* <Col lg="1"></Col> */}
              <Col lg="5">
                <Row lg="12">
                  <Col lg="6">
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="selectedDesign"
                        style={{ marginBottom: "0px" }}
                      >
                        Mc
                        <IsRequired />
                      </label>
                      <InputFieldWithDropdown
                        register={register}
                        placeholder="Mc"
                        id={"mc"}
                        value={purchaseMc}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        optionId={"purchaseMcType"}
                        name={"purchaseMcType"}
                        options={calcTypeOptions}
                        setValue={setValue}
                        onDropDownChange={(value) => {
                          setPurchaseMcType(value);
                        }}
                        selectedOption={purchaseMcType}
                        SetValue={(value) => {
                          setPurchaseMc(value);
                        }}
                        minError={"Mc should less than or equal to 0"}
                        maxError={"Mc should greater than or equal to 0"}
                        reqValueError={"Mc is Required"}
                      />
                    </div>
                  </Col>

                  <Col lg="6">
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="selectedDesign"
                        style={{ marginBottom: "0px" }}
                      >
                        Flat Mc
                        <IsRequired />
                      </label>
                      <NumberInputField
                        placeholder="Flat Mc"
                        id={"purchaseFlatMc"}
                        value={purchaseFlatMc}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={2}
                        SetValue={(value) => {
                          setPurchaseFlatMc(value);
                        }}
                        minError={
                          "Purchase Flat Mc should less than or equal to 0"
                        }
                        maxError={"Purchase Flat Mc greater than or equal to 0"}
                        reqValueError={"Purchase Flat Mc is Required"}
                        register={register}
                      />
                    </div>
                  </Col>
                </Row>
                <Row lg="12">
                  <Col lg="6">
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="selectedDesign"
                        style={{ marginBottom: "0px" }}
                      >
                        Va
                        <IsRequired />
                      </label>
                      <NumberInputField
                        placeholder="Va"
                        id={"purchaseVa"}
                        value={purchaseVa}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={2}
                        SetValue={(value) => {
                          setPurchaseVa(value);
                        }}
                        minError={"Purchase Va should less than or equal to 0"}
                        maxError={"Purchase Va greater than or equal to 0"}
                        reqValueError={"Purchase Va is Required"}
                        register={register}
                      />
                    </div>
                  </Col>

                  <Col lg="6">
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="selectedDesign"
                        style={{ marginBottom: "0px" }}
                      >
                        Touch
                        <IsRequired />
                      </label>
                      <InputFieldWithDropdown
                        register={register}
                        placeholder="Touch"
                        id={"touch"}
                        value={purchaseTouch}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        optionId={"pure_calc_type"}
                        name={"pure_calc_type"}
                        options={PureCalcTypeOptions}
                        setValue={setValue}
                        onDropDownChange={(value) => {
                          setPurchaseCalType(value);
                        }}
                        selectedOption={purchaseCalType}
                        SetValue={(value) => {
                          setPurchaseTouch(value);
                        }}
                        minError={"Touch should less than or equal to 0"}
                        maxError={"Touch should greater than or equal to 0"}
                        reqValueError={"Touch is Required"}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="form-group row g-4">
              <Col md={12}>
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
                      <tr>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          #
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(!isChecked)}
                          />
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Ref No
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
                          Pcs
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Gwt
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Lwt
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Nwt
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Dia.wt
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Stn.wt
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Mc
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Flat Mc
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Touch
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Wastage
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Pure
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemDetails.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>
                            {parseInt(rowIndex) + 1}{" "}
                            <input
                              type="checkbox"
                              checked={item["isChecked"]}
                              onChange={(e) =>
                                handleFormChange(
                                  rowIndex,
                                  "isChecked",
                                  e.target.checked
                                )
                              }
                            />
                          </td>
                          <td>
                            {purchaseInfo.ref_code +
                              "- " +
                              parseInt(rowIndex) +
                              1}
                          </td>
                          <td>{item.product_name}</td>
                          <td>{item.pieces}</td>
                          <td>{item.gross_wt}</td>
                          <td>{item.less_wt}</td>
                          <td>{item.net_wt}</td>
                          <td>{item.dia_wt}</td>
                          <td>{item.stone_wt}</td>
                          <td>
                            <div style={{ width: "200px" }}>
                              <InputFieldWithDropdown
                                register={register}
                                placeholder="MC"
                                id={"mc_" + rowIndex}
                                value={item.purchase_mc}
                                isRequired={false}
                                min={0}
                                type={"number"}
                                optionId={"purchase_mc_type" + rowIndex}
                                name={"purchase_mc_type"}
                                options={calcTypeOptions}
                                setValue={setValue}
                                onDropDownChange={(value) => {
                                  handleFormChange(
                                    rowIndex,
                                    "purchase_mc_type",
                                    value
                                  );
                                }}
                                selectedOption={item.purchase_mc_type}
                                SetValue={(value) => {
                                  handleFormChange(
                                    rowIndex,
                                    "purchase_mc_type",
                                    value
                                  );
                                }}
                                minError={
                                  "Purchase Mc should less than or equal to 0"
                                }
                                maxError={
                                  "Purchase Mc should greater than or equal to 0"
                                }
                                reqValueError={"Purchase Mc is Required"}
                                isMaxWidthReq={0}
                              />
                            </div>
                          </td>
                          <td>
                            <div style={{ width: "100px" }}>
                              <NumberInputField
                                placeholder="Flat Mc"
                                id={"purchase_flat_mc_" + rowIndex}
                                value={item.purchase_flat_mc}
                                isRequired={false}
                                min={0}
                                type={"number"}
                                setValue={setValue}
                                handleKeyDownEvents={true}
                                handleDecimalDigits={true}
                                decimalValues={2}
                                SetValue={(value) => {
                                  handleFormChange(
                                    rowIndex,
                                    "purchase_flat_mc",
                                    value
                                  );
                                }}
                                minError={
                                  "Purchase Flat Mc should less than or equal to 0"
                                }
                                maxError={
                                  "Purchase Flat Mc greater than or equal to 0"
                                }
                                reqValueError={"Purchase Touch is Required"}
                                register={register}
                              />
                            </div>
                          </td>
                          <td>
                            <div style={{ width: "200px" }}>
                              <InputFieldWithDropdown
                                register={register}
                                placeholder="Touch"
                                id={"touch_" + rowIndex}
                                value={item.purchase_touch}
                                isRequired={false}
                                min={0}
                                type={"number"}
                                optionId={"pure_calc_type" + rowIndex}
                                name={"pure_calc_type"}
                                options={PureCalcTypeOptions}
                                setValue={setValue}
                                onDropDownChange={(value) => {
                                  handleFormChange(
                                    rowIndex,
                                    "pure_wt_cal_type",
                                    value
                                  );
                                }}
                                selectedOption={item.pure_wt_cal_type}
                                SetValue={(value) => {
                                  handleFormChange(
                                    rowIndex,
                                    "purchase_touch",
                                    value
                                  );
                                }}
                                minError={
                                  "Touch should less than or equal to 0"
                                }
                                maxError={
                                  "Touch should greater than or equal to 0"
                                }
                                reqValueError={"Touch is Required"}
                                isMaxWidthReq={0}
                              />
                            </div>
                          </td>
                          <td>
                            <div style={{ width: "100px" }}>
                              <NumberInputField
                                placeholder="Va"
                                id={"va_" + rowIndex}
                                value={item.purchase_va}
                                isRequired={false}
                                min={0}
                                type={"number"}
                                setValue={setValue}
                                handleKeyDownEvents={true}
                                handleDecimalDigits={true}
                                decimalValues={2}
                                SetValue={(value) => {
                                  handleFormChange(
                                    rowIndex,
                                    "purchase_va",
                                    value
                                  );
                                }}
                                minError={
                                  "Purchase Va should less than or equal to 0"
                                }
                                maxError={
                                  "Purchase Va greater than or equal to 0"
                                }
                                reqValueError={"Purchase Va is Required"}
                                register={register}
                              />
                            </div>
                          </td>
                          <td>{item.pure_wt}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="thead-light" style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                      <tr style={{ fontWeight: "bold" }}>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Total</td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>{calculateTotal("pieces", 0)}</td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>{calculateTotal("gross_wt", 3)}</td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>{calculateTotal("less_wt", 3)}</td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>{calculateTotal("net_wt", 3)}</td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>

                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>{calculateTotal("pure_wt", 3)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Col>
            </Row>
          </FormProvider>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default PurchaseTouchUpdate;
