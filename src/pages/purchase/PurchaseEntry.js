import React, { useEffect, useState, useRef } from "react";
import Head from "../../layout/head/Head";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Row, PreviewCard, SaveButton } from "../../components/Component";
import {
  DateInputField,
  InputFieldWithDropdown,
  InputGroupField,
  NumberInputField,
  TextInputField,
} from "../../components/form-control/InputGroup";
import Content from "../../layout/content/Content";
import "../../assets/css/sales_form.css";
import {
  BranchDropdown,
  CategoryDropdown,
  DesignDropdown,
  ProductDropdown,
  PurityDropdown,
  SectionDropdown,
  SubDesignDropdown,
  SupplierDropdown,
} from "../../components/filters/retailFilters";
import {
  useCategories,
  usePurities,
  useProducts,
  useDesigns,
  useSubDesigns,
  useUom,
  useSupplierFilter,
  useBranches,
  useProductSections,
  useTaxGroup,
  useMetalPurityRate,
  useMcVaSetiings,
  useDiamondRate,
  useStone,
  useQualityCode
} from "../../components/filters/filterHooks";
import IsRequired from "../../components/erp-required/erp-required";
import PreviewTable from "../../components/sds-table/PreviewTable";
import { Button, Label } from "reactstrap";
import LessWeightInputField from "../../components/form-control/LessWeight";
import usePurchaseEntryFormHandling from "./usePurchaseEntryFormHandling";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import DeleteModal from "../../components/modals/DeleteModal";
import OtherMetalWeightInputField from "../../components/form-control/otherMetalInput";
import moment from "moment";
import OtherChargesForm from "../../components/form-control/otherChargesInput";
import { useHotkeys } from "react-hotkeys-hook";
import { Icon } from "@mui/material";

const PurchaseEntryForm = () => {
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
  const { isLoading: issubmitting, isError } = useSelector((state) => state.metalReducer);
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  // console.log(errors,"errors");
  const methods = useForm();
  const { categories } = useCategories();
  const { purities } = usePurities();
  const { products } = useProducts();
  const { designs } = useDesigns();
  const { subDesigns } = useSubDesigns();
  const { sections } = useProductSections();
  const { uom } = useUom();
  const { supplier } = useSupplierFilter();
  const { branches } = useBranches();
  const { taxGroup } = useTaxGroup();
  const { metalPurityRate } = useMetalPurityRate();
  const { diamondRate } = useDiamondRate();
  const { stone } = useStone();
  const { quality_code } = useQualityCode();

  const dispatch = useDispatch();
  const [idBranch, setIdBranch] = useState("");
  const [idSupplier, setIdSupplier] = useState("");
  const [remarks, setRemarks] = useState("");
  const { mcVaSetiings } = useMcVaSetiings();
  const otherChargesRef = useRef();
  const productRef = useRef(null);
  


  let UomOptions = [];
  if (uom.length > 0) {
    UomOptions = uom.map((val) => ({
      value: val.uom_id,
      label: val.uom_name,
      isDefault: val.is_default,
    }));
  }
  // console.log(errors);
  const {
    selectedBranchId,
    selectedSupplierID,
    formValues,
    formData,
    lessWeightRef,
    otherMetalWeightRef,
    handleInputChange,
    handleSetStoneDetails,
    handleSetOtherMetalDetails,
    addToPreview,
    handleEdit,
    handleDelete,
    resetPurity,
    resetProduct,
    resetDesign,
    resetSubDesign,
    resetSection,
    numericFields,
    columns,
    calcTypeOptions,
    PureCalcTypeOptions,
    onClickSave,
    isSubmitted,
    deleteModal,
    toggle,
    deleteItem,
    isSectionRequired,
    isMrpItem,
    fixedRateCalc,
    setSupplierBillRefNo,
    setSupplierBillRefDate,
    supplierBillRefNo,
    supplierBillRefDate,
    daysOfPayment,
    setDaysOfPayment,
    paymentDate,
    setPaymentDate,
    isPurchaseDetailsDisable,
    isTaxRequired,
    setEntryDate,
    entryDate,
    totalItemCost,
    tdsPercentage,
    totalBillAmount,
    billSettingType,
    setTdsPercentage,
    taxableAmount,
    cgstCost,
    sgstCost,
    igstCost,
    otherChargesDetails,
    setOtherChargesDetails,
    otherChargesAmount,
    setOtherChargesAmount,
  } = usePurchaseEntryFormHandling(products, designs, subDesigns, id, idBranch, idSupplier, mcVaSetiings , remarks);

  useEffect(() => {
    setIdSupplier(selectedSupplierID);
    setIdBranch(selectedBranchId);
    reset();
  }, [setIdSupplier, setIdBranch, selectedBranchId, selectedSupplierID, reset]);

  useEffect(() => {
    setValue("id_purchase_entry_detail", formValues.id_purchase_entry_detail);
  });

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/purchase/purchase_entry/list`);
    }
  }, [add, id, navigate]);



  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    onClickSave(0);
  },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  useHotkeys(
    "ctrl+d",
    (event) => {
      event.preventDefault();
      console.log("function called");
  
      handleSubmit((data) => {
        addToPreview(data); // Ensure this function is working as expected
        if (productRef.current) {
          productRef.current.focus(); // Focus on the product input field
        }
      })(); // Call handleSubmit properly by invoking it
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );


  return (
    <React.Fragment>
      <Head title="Purchase Add" />
      <Content>
        <PreviewCard className="h-100">
          <FormProvider {...methods}>
            <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
             
              <Col md={2}>
                <div className="form-group">
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
                  />
                </div>
              </Col>
              <Col md={2}>
                <SupplierDropdown
                  register={register}
                  id={"idSupplier"}
                  supplier={supplier}
                  isRequired={true}
                  selectedSupplier={idSupplier}
                  onSupplierChange={setIdSupplier}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.idSupplier && "Supplier is Required"}
                  tabIndex={1}
                />
              </Col>
              <Col md={6} className="text-right">
                <Button
                  disabled={isSubmitted}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/purchase/purchase_entry/list`)}
                >
                  Cancel
                </Button>{" "}
                <Button color="primary" disabled={isSubmitted} size="md" onClick={() => onClickSave(0)}>
                  {isSubmitted ? "Saving" : "Save[Ctrl+s]"}
                </Button>{" "}

                <Button color="primary" disabled={isSubmitted} size="md" onClick={() => onClickSave(0,1)}>
                  {isSubmitted ? "Saving & Lot Generate" : "Save & Lot Generate"}
                </Button>{" "}

                {/* {settings?.is_qc_required === "0" && (
                  <Button color="primary" disabled={isSubmitted} size="md" onClick={() => onClickSave(1)}>
                  {isSubmitted ? "Saving" : "Rate fix & Pay"}
                  </Button>
                )} */}

                 <Button color="primary" disabled={isSubmitted} size="md" onClick={() => onClickSave(1)}>
                  {isSubmitted ? "Saving" : "Rate fix & Pay"}
                  </Button>


              </Col>
            </Row>

            <Row lg={12} className={"form-control-sm"}>
              <Col md={2}>
                <Label>
                  Ref Bill No
                </Label>
                <TextInputField
                  register={register}
                  isRequired={false}
                  id={"supplierBillRefNo"}
                  placeholder="Ref No"
                  value={supplierBillRefNo}
                  SetValue={(value) => {
                    setSupplierBillRefNo(value);
                    clearErrors("supplierBillRefNo");
                  }}
                  tabIndex={1}
                />
                {errors?.supplierBillRefNo && <span className="text-danger">{errors?.supplierBillRefNo.message}</span>}
              </Col>
              <Col md={2}>
                <Label>
                  Ref Bill Date
                  <IsRequired />
                </Label>
                <DateInputField
                  maxDate={new Date()}
                  showYearDropdown={true}
                  showMonthDropdown={true}
                  id={"supplierBillRefDate"}
                  selected={supplierBillRefDate}
                  SetValue={setSupplierBillRefDate}
                />
              </Col>
              <Col md={2}>
                <Label>
                  Days of Pay
                  <IsRequired />
                </Label>
                <TextInputField
                  register={register}
                  isRequired={true}
                  id={"daysOfPayment"}
                  placeholder="No. of days"
                  value={daysOfPayment}
                  SetValue={(value) => {
                    setDaysOfPayment(value);
                    const inputDays = value;

                    // Calculate future date if input is a valid number
                    if (!isNaN(inputDays) && inputDays !== "") {
                      const resultDate = new Date();
                      resultDate.setDate(resultDate.getDate() + parseInt(inputDays));
                      setPaymentDate(moment(resultDate).format("DD-MM-YYYY"));
                    } else {
                      setPaymentDate(); // Clear if input is invalid
                    }

                    clearErrors("daysOfPayment");
                  }}
                  tabIndex={1}
                />
                {errors?.daysOfPayment && <span className="text-danger">{errors?.daysOfPayment.message}</span>}
              </Col>
              <Col md={2}>
                <Label>Payment Date</Label>
                <div className="form-control-wrap">
                  <input
                    disabled
                    className="form-control form-control-sm"
                    id={"payementDate"}
                    type="text"
                    placeholder={"Payment Date"}
                    value={paymentDate}

                  />
                </div>
              </Col>
              <Col md={2}>
                <Label>
                  Entry Date
                  <IsRequired />
                </Label>
                <DateInputField
                  maxDate={new Date()}
                  showYearDropdown={true}
                  showMonthDropdown={true}
                  id={"entryDate"}
                  selected={entryDate}
                  SetValue={setEntryDate}
                />
              </Col>
              
            </Row>

            <Row lg={12} className={"form-control-sm"}>
              <Col md={4}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="cus_type">
                          Halmarked
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                {...register("isHalMarked", { required: true })}
                                id="yes"
                                type="radio"
                                name={"isHalMarked"}
                                value={"1"}
                                className="custom-control-input"
                                checked={formValues.isHalMarked == "1"}
                                onChange={(e) => {
                                  handleInputChange("isHalMarked", e.target.value);
                                }}
                              />
                              <label className="custom-control-label" htmlFor="yes">
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                {...register("isHalMarked", { required: true })}
                                id="no"
                                type="radio"
                                value={"0"}
                                name={"isHalMarked"}
                                className="custom-control-input "
                                checked={formValues.isHalMarked == "0"}
                                onChange={(e) => {
                                  handleInputChange("isHalMarked", e.target.value);
                                }}
                              />
                              <label className="custom-control-label" htmlFor="no">
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Product
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <ProductDropdown
                        register={register}
                        id={"selectedProduct"}
                        products={products}
                        categories={categories}
                        selectedCategory={formValues.selectedCategory}
                        selectedPurity={formValues.selectedPurity}
                        selectedProduct={formValues.selectedProduct}
                        selectedSection={formValues.selectedSection}
                        onProductChange={(value) => {
                          handleInputChange("selectedProduct", value);
                          handleInputChange("selectedSize", "");
                          resetDesign();
                          resetSubDesign();
                          resetSection();
                        }}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.selectedProduct && "Product is Required"}
                        tabIndex={5}
                        ref={productRef}
                      />
                      <input
                        type="hidden"
                        id={"id_purchase_entry_detail"}
                        value={formValues.id_purchase_entry_detail}
                        {...register("id_purchase_entry_detail")}
                      />
                      <input
                        type="hidden"
                        id={"taxType"}
                        value={formValues.taxType}
                        {...register("taxType")}
                        setValue={setValue}
                      />
                      <input
                        type="hidden"
                        id={"tax_id"}
                        value={formValues.tax_id}
                        {...register("tax_id")}
                        setValue={setValue}
                      />
                      <input
                        type="hidden"
                        id={"taxPercentage"}
                        value={formValues.taxPercentage}
                        {...register("taxPercentage")}
                      />
                      <input type="hidden" id={"cgst"} value={formValues.cgst} {...register("cgst")} />
                      <input type="hidden" id={"sgst"} value={formValues.sgst} {...register("sgst")} />
                      <input type="hidden" id={"igst"} value={formValues.igst} {...register("igst")} />
                    </Col>
                  </Row>
                  {settings?.pur_entry_des_and_sub_des_req === "1" && (
                    <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            Design
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <DesignDropdown
                          register={register}
                          id={"selectedDesign"}
                          designs={designs}
                          products={products}
                          selectedProduct={formValues.selectedProduct}
                          selectedDesign={formValues.selectedDesign}
                          onDesignChange={(value) => {
                            handleInputChange("selectedDesign", value);
                            resetSubDesign();
                          }}
                          isRequired={true}
                          clearErrors={clearErrors}
                          setValue={setValue}
                          message={errors.selectedDesign && "Design is Required"}
                          tabIndex={6}
                        />
                      </Col>
                    </Row>
                  )}

                  {settings?.pur_entry_des_and_sub_des_req === "1" && (
                    <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            Sub Design
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <SubDesignDropdown
                          register={register}
                          id={"selectedSubDesign"}
                          subDesigns={subDesigns}
                          products={products}
                          designs={designs}
                          selectedProduct={formValues.selectedProduct}
                          selectedDesign={formValues.selectedDesign}
                          selectedSubDesign={formValues.selectedSubDesign}
                          onSubDesignChange={(value) => {
                            handleInputChange("selectedSubDesign", value);
                          }}
                          isRequired={true}
                          clearErrors={clearErrors}
                          setValue={setValue}
                          message={errors.selectedSubDesign && "Sub Design is Required"}
                          tabIndex={7}
                        />
                      </Col>
                    </Row>
                  )}
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Piece
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <NumberInputField
                        register={register}
                        placeholder="Piece"
                        id={"piece"}
                        value={formValues.piece}
                        isRequired={true}
                        min={0}
                        setValue={setValue}
                        SetValue={(value) => {
                          handleInputChange("piece", value);
                          clearErrors("piece");
                        }}
                        handleKeyDownEvents={true}
                        handleDot={true}
                        minError={"Pieces Should greater than or equal to 0"}
                        reqValueError={"Pieces is Required"}
                        message={errors.piece && errors.piece.message}
                        tabIndex={9}
                      />
                    </Col>
                  </Row>

                

                </div>
                <br></br>
              </Col>
              <Col md={4}>
                <div className="custom-grid">
                    <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Gross Wt{!isMrpItem && <IsRequired />}
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <InputFieldWithDropdown
                        register={register}
                        placeholder="Gross weight"
                        id={"grossWeight"}
                        value={formValues.grossWeight}
                        isRequired={!isMrpItem}
                        readOnly={isMrpItem}
                        min={!isMrpItem ? 0.001 : 0}
                        type={"number"}
                        optionId={"uomId"}
                        name={"uomId"}
                        options={UomOptions}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={3}
                        onDropDownChange={(value) => {
                          handleInputChange("uomId", value);
                        }}
                        selectedOption={formValues.uomId}
                        SetValue={(value) => {
                          handleInputChange("grossWeight", value);
                          clearErrors("grossWeight");
                        }}
                        minError={"Gross weight Greater than or equal 1"}
                        maxError={""}
                        requiredMessage={"Gross weight is Required"}
                        message={errors.grossWeight && errors.grossWeight.message}
                        tabIndex={10}
                      />
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Less Wt
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <LessWeightInputField
                        register={register}
                        placeholder="Less Weight"
                        id={"lessWeight"}
                        value={formValues.lessWeight}
                        isRequired={false}
                        min={0}
                        uom={uom}
                        gross_weight={formValues.grossWeight}
                        less_weight={formValues.lessWeight}
                        SetValue={(value) => handleInputChange("lessWeight", value)}
                        SetStnWeight={(value) => handleInputChange("stnWeight", value)}
                        SetDiaWeight={(value) => handleInputChange("diaWeight", value)}
                        SetStoneDetails={handleSetStoneDetails}
                        stone_details={formValues.stoneDetails}
                        ref={lessWeightRef}
                        stone={stone}
                        quality_code={quality_code}
                        tabIndex={11}
                      />
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Other M.Wt
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <OtherMetalWeightInputField
                        register={register}
                        placeholder="Other Metal Weight"
                        id={"otherMetalWeight"}
                        value={formValues.otherMetalWeight}
                        isRequired={false}
                        min={0}
                        uom={uom}
                        setValue={setValue}
                        gross_weight={formValues.grossWeight}
                        less_weight={formValues.lessWeight}
                        SetValue={(value) => handleInputChange("otherMetalWeight", value)}
                        SetOtherMetalDetails={handleSetOtherMetalDetails}
                        otherMetalDetails={formValues.otherMetalDetails}
                        ref={otherMetalWeightRef}
                      />
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Stn/Dia Wt
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <InputGroupField
                        register={register}
                        placeholder1="Stone"
                        inputId1="stnWeight"
                        value1={parseFloat(formValues.stnWeight).toFixed(3)}
                        isRequiredInput1={false}
                        minInput1={0}
                        maxInput1={100}
                        minErrorInput1={"Stone weight Should greater than 0"}
                        messageInput1={errors.stnWeight && errors.stnWeight.message}
                        setValue={setValue}
                        SetInputValue1={(value) => {
                          handleInputChange("stnWeight", value);
                          clearErrors("stnWeight");
                        }}
                        placeholder2="Dia"
                        inputId2="diaWeight"
                        isRequiredInput2={false}
                        value2={parseFloat(formValues.diaWeight).toFixed(3)}
                        minInput2={0}
                        minErrorInput2={"Dia Weight should be greater than or equal to 0"}
                        maxErrorInput2={"Dia Weight should be less than or equal to 100"}
                        reqValueErrorInput2={"Weight is required"}
                        messageInput2={errors.diaWeight && errors.diaWeight.message}
                        SetInputValue2={(value) => {
                          handleInputChange("diaWeight", value);
                          clearErrors("diaWeight");
                        }}
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                        Stn/Dia Amt
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <InputGroupField

                        register={register}
                        placeholder1="Stn Amt"
                        inputId1="stnAmount"
                        isRequired1={false}
                        value1={parseFloat([...formValues.stoneDetails].reduce((sum, item) => (parseInt(item.stone_type) === 2 || parseInt(item.stone_type) === 3) ? parseFloat(sum) + parseFloat(item.stone_amount) : parseFloat(sum), 0)).toFixed(2)}
                        setValue1={setValue}
                        minErrorInput1={"Amount should be greater than or equal to 0"}
                        maxErrorInput1={"Amount should be less than or equal to 100"}
                        reqValueErrorInput1={"Amount is required"}
                        messageInput1={errors.stnAmount && errors.stnAmount.message}
                        SetInputValue1={(value) => {
                          handleInputChange("stnAmount", value);
                          clearErrors("stnAmount");
                        }}


                        placeholder2="Dia Amt"
                        inputId2="diaAmount"
                        value2={parseFloat([...formValues.stoneDetails].reduce((sum, item) => (parseInt(item.stone_type) === 1) ? parseFloat(sum) + parseFloat(item.stone_amount) : parseFloat(sum), 0)).toFixed(2)}
                        isRequired={false}
                        minErrorInput2={"Dia greater than or equal to 0"}
                        messageInput2={errors.diaAmount && errors.diaAmount.message}
                        setValue2={setValue}
                        SetInputValue2={(value) => {
                          handleInputChange("diaAmount", value);
                          clearErrors("diaAmount");
                        }}

                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Net Wt
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <NumberInputField
                        register={register}
                        id="netWeight"
                        placeholder="Net Weight"
                        value={formValues.netWeight}
                        isRequired={false}
                        readOnly
                        min={0}
                        minError="Net weight must be greater than 0"
                        reqValueError="Net weight is Required"
                        message={errors.netWeight && errors.netWeight.message}
                      />
                    </Col>
                  </Row>
                  {/* <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Charges
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <OtherChargesForm
                        register={register}
                        placeholder="Charges"
                        id={"otherChargesAmount"}
                        value={formValues.otherChargesAmount}
                        isRequired={false}
                        min={0}
                        uom={uom}
                        setValue={setValue}
                        otherChargesAmount={formValues.otherChargesAmount}
                        SetValue={(value) => handleInputChange("otherChargesAmount", value)}
                        SetOtherChargesDetails={(value) => handleInputChange("otherChargesDetails", value)}
                        otherChargesDetails={formValues.otherChargesDetails}
                        ref={otherChargesRef}
                        tabIndex={14}
                      ></OtherChargesForm>
                    </Col>
                  </Row> */}
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          MRP Rate
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <NumberInputField
                        register={register}
                        placeholder="MRP Rate"
                        id={"sellRate"}
                        value={formValues.sellRate}
                        isRequired={false}
                        readOnly={!fixedRateCalc}
                        min={0}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={2}
                        setValue={setValue}
                        SetValue={(value) => handleInputChange("sellRate", value)}
                        minError={"Sell Should greater than 0"}
                        reqValueError={"Sell weight is Required"}
                        message={errors.sellRate && errors.sellRate.message}
                        tabIndex={15}
                      />
                    </Col>
                  </Row>
                 
                 
                </div>

              </Col>
              <Col md={4}>
                <div className="custom-grid">
                   <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Pur Touch & VA
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="4">
                      <NumberInputField
                        register={register}
                        placeholder="Purchase Touch"
                        id="purchaseTouch"
                        value={formValues.purchaseTouch}
                        isRequired={!isPurchaseDetailsDisable}
                        readOnly={isPurchaseDetailsDisable}
                        min={(formValues?.settTouch)}
                        max={100}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={3}
                        SetValue={(value) => {
                          handleInputChange("purchaseTouch", value);
                          clearErrors("purchaseTouch");
                        }}
                        minError={"Purchase Touch should be greater than or equal to " + formValues?.settTouch}
                        maxError={"Purchase Touch should be less than or equal to 100"}
                        reqValueError={"Purchase Touch is required"}
                        message={errors.purchaseTouch && errors.purchaseTouch.message}
                        tabIndex={16}
                      />
                    </Col>
                    <Col lg="4">
                      <NumberInputField
                        register={register}
                        placeholder="Purchase Va"
                        id={"purchaseWastage"}
                        value={formValues.purchaseWastage}
                        isRequired={!isPurchaseDetailsDisable}
                        readOnly={isPurchaseDetailsDisable}
                        min={(formValues?.settingsMinVa)}
                        max={100}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={2}
                        setValue={setValue}
                        SetValue={(value) => {
                          handleInputChange("purchaseWastage", value);
                          clearErrors("purchaseWastage");
                        }}
                        minError={"VA should less than or equal to 0"}
                        maxError={"VA should greater than or equal to 0"}
                        reqValueError={"Purchase VA is Required"}
                        message={errors.purchaseWastage && errors.purchaseWastage.message}
                        tabIndex={17}
                      />
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Pure Wt
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <InputFieldWithDropdown
                        register={register}
                        placeholder="Pure Weight"
                        id={"pureWeight"}
                        value={formValues.pureWeight}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        readOnly={true}
                        optionId={"pureCalcType"}
                        name={"pureCalcType"}
                        options={PureCalcTypeOptions}
                        setValue={setValue}
                        onDropDownChange={(value) => {
                          handleInputChange("pureCalcType", value);
                        }}
                        selectedOption={(formValues.setPureCalcType) || parseInt(formValues.pureCalcType)}
                        SetValue={(value) => {
                          handleInputChange("purchaseRate", value);
                          clearErrors("purchaseRate");
                        }}
                        minError={"Rate should less than or equal to 0"}
                        maxError={"Rate should greater than or equal to 0"}
                        reqValueError={"Purchase Rate is Required"}
                        message={errors.pureWeight && errors.pureWeight.message}
                      />
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col md="3">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          MC
                        </label>
                      </div>
                    </Col>
                    <Col lg="9">
                      <InputFieldWithDropdown
                        register={register}
                        placeholder="Purchase MC"
                        id={"purchaseMc"}
                        value={formValues.purchaseMc}
                        isRequired={false}
                        min={(formValues?.settingsMinMc)}
                        type={"number"}
                        readOnly={isPurchaseDetailsDisable}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={2}
                        tabIndex={18}
                        SetValue={(value) => {
                          handleInputChange("purchaseMc", value);
                          clearErrors("purchaseMc");
                        }}
                        optionId={"purchaseMcType"}
                        name={"purchaseMcType"}
                        options={calcTypeOptions}
                        setValue={setValue}
                        onDropDownChange={(value) => {
                          handleInputChange("purchaseMcType", value);
                        }}
                        selectedOption={formValues.purchaseMcType}
                        minError={"MC should less than or equal to 0"}
                        maxError={"MC should greater than or equal to 0"}
                        reqValueError={"Purchase MC is Required"}
                        message={errors.purchaseMc && errors.purchaseMc.message}
                      />
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col md="3">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Flat Mc
                        </label>
                      </div>
                    </Col>
                    <Col lg="9">
                      <NumberInputField
                        register={register}
                        placeholder="Flat Mc"
                        id={"flatMcValue"}
                        value={formValues.flatMcValue}
                        isRequired={false}
                        readOnly={isPurchaseDetailsDisable}
                        min={0}
                        setValue={setValue}
                        SetValue={(value) => {
                          handleInputChange("flatMcValue", value);
                          clearErrors("flatMcValue");
                        }}
                        minError={"Flat Mc Should greater than or equal to 0"}
                        reqValueError={"Flat Mc is Required"}
                        tabIndex={19}
                        message={errors.flatMcValue && errors.flatMcValue.message}
                      ></NumberInputField>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col md="3">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Rate
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="9">
                      <InputFieldWithDropdown
                        register={register}
                        placeholder="Purchase Rate"
                        id={"purchaseRate"}
                        value={formValues.purchaseRate}
                        isRequired={false}
                        readOnly={isPurchaseDetailsDisable}
                        min={0}
                        type={"number"}
                        optionId={"rateCalcType"}
                        name={"rateCalcType"}
                        options={calcTypeOptions}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleFormKeyDownEvents={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addToPreview(formValues);
                          }
                        }}
                        handleDecimalDigits={true}
                        decimalValues={2}
                        onDropDownChange={(value) => {
                          handleInputChange("rateCalcType", value);
                        }}
                        selectedOption={formValues.rateCalcType}
                        SetValue={(value) => {
                          handleInputChange("purchaseRate", value);
                          clearErrors("purchaseRate");
                        }}
                        minError={"Rate should less than or equal to 0"}
                        maxError={"Rate should greater than or equal to 0"}
                        reqValueError={"Purchase MC is Required"}
                        message={errors.purchaseRate && errors.purchaseRate.message}
                        tabIndex={20}
                      />
                    </Col>
                  </Row>
                  {isTaxRequired && (
                    <Row className="form-group row g-4">
                      <Col md="3">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            Tax
                          </label>
                        </div>
                      </Col>
                      <Col lg="9">
                        <InputGroupField
                          register={register}
                          placeholder1="Tax"
                          inputId1="taxAmount"
                          isRequiredInput1={false}
                          minInput1={0}
                          readOnly1
                          value1={formValues.taxAmount}
                          minErrorInput1={"Amount should be greater than or equal to 0"}
                          maxErrorInput1={"Amount Touch should be less than or equal to 100"}
                          reqValueErrorInput1={"Amount is required"}
                          setValue1={setValue}
                          messageInput1={errors.taxAmount && errors.taxAmount.message}
                          SetInputValue1={(value) => {
                            handleInputChange("taxAmount", value);
                            clearErrors("taxAmount");
                          }}
                          placeholder2="%"
                          inputId2="taxPercentage"
                          isRequiredInput2={false}
                          minInput2={0}
                          readOnly2
                          value2={formValues.taxPercentage}
                          minErrorInput2={"% should be greater than or equal to 0"}
                          maxErrorInput2={"% should be less than or equal to 100"}
                          reqValueErrorInput2={"Weight is required"}
                          setValue2={setValue}
                          messageInput2={errors.taxPercentage && errors.taxPercentage.message}
                          SetInputValue2={(value) => {
                            handleInputChange("taxPercentage", value);
                            clearErrors("taxPercentage");
                          }}
                        />
                      </Col>
                    </Row>
                  )}


                  <Row className="form-group row g-4">
                    <Col md="3">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Pur Cost
                        </label>
                      </div>
                    </Col>
                    <Col lg="5">
                      <NumberInputField
                        register={register}
                        placeholder="Purchase Cost"
                        id={"purchaseCost"}
                        value={formValues.purchaseCost}
                        isRequired={false}
                        min={0}
                        setValue={setValue}
                        tabIndex={20}
                        SetValue={(value) => handleInputChange("purchaseCost", value)}
                        minError={"Purchase Cost Should greater than 0"}
                        message={errors.purchaseCost && errors.purchaseCost.message}
                      />
                    </Col>
                    <Col lg="4">
                        <SaveButton
                      disabled={issubmitting}
                      size="md"
                      color="primary"
                      tabIndex={21}
                      onClick={handleSubmit((data) => addToPreview(data))}
                    >
                      Add Item
                    </SaveButton>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>


            <Row lg={12} className="form-group row">
              <Col md={12}>
                <Row md={12}></Row>
                <Row md={12}>
                  <PreviewTable
                    columns={columns}
                    data={formData}
                    numericFields={numericFields}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </Row>
              </Col>
            </Row>

            <Row lg={12} className="form-group row">
             
            <Row lg={12} className={"form-control-sm"}>
              <Col md={2}>
                 <Label>
                    Charges
                  </Label>
                   <OtherChargesForm
                        register={register}
                        placeholder="Charges"
                        id={"otherChargesAmount"}
                        value={otherChargesAmount}
                        isRequired={false}
                        min={0}
                        uom={uom}
                        setValue={setValue}
                        otherChargesAmount={otherChargesAmount}
                        SetValue={(value) => setOtherChargesAmount(value)}
                        SetOtherChargesDetails={(value) => setOtherChargesDetails(value)}
                        otherChargesDetails={otherChargesDetails}
                        ref={otherChargesRef}
                      ></OtherChargesForm>
              </Col>
              <Col md={2}>
                <Label>
                  Net Amount
                </Label>
                <NumberInputField
                  register={register}
                  id="taxableAmount"
                  placeholder="Total Amount"
                  value={taxableAmount}
                  isRequired={false}
                  setValue={setValue}
                  readOnly
                  min={0}
                  minError="Amount must be greater than 0"
                  reqValueError="Amount is Required"
                  message={errors.taxableAmount && errors.taxableAmount.message}
                />
              </Col>
              <Col md={2}>
                <Label>
                  CGST
                </Label>
                <NumberInputField
                            register={register}
                            id="cgstCost"
                            placeholder="CGST"
                            value={cgstCost}
                            isRequired={false}
                            min={0}
                            max={100}
                            setValue={setValue}
                            readOnly={true}
                            minError="CGST must be greater than 0"
                            reqValueError="CGST is Required"
                            message={errors.cgstPercentage && errors.cgstPercentage.message}
                          />
              </Col>
              <Col md={2}>
                <Label>
                  SGST
                </Label>
                <NumberInputField
                            register={register}
                            id="sgstCost"
                            placeholder="SGST"
                            value={sgstCost}
                            isRequired={false}
                            min={0}
                            max={100}
                            setValue={setValue}
                            readOnly={true}
                            minError="SGST must be greater than 0"
                            reqValueError="SGST is Required"
                            message={errors.sgstPercentage && errors.sgstPercentage.message}
                          />
              </Col>
              <Col md={1}>
                <Label>
                  IGST
                </Label>
                <NumberInputField
                            register={register}
                            id="igstCost"
                            placeholder="IGST"
                            value={igstCost}
                            isRequired={false}
                            min={0}
                            max={100}
                            setValue={setValue}
                            readOnly={true}
                            minError="IGST must be greater than 0"
                            reqValueError="IGST is Required"
                            message={errors.igstPercentage && errors.igstPercentage.message}
                          />
              </Col>
              <Col md={1}>
                <Label>
                  TDS
                </Label>
                <NumberInputField
                            register={register}
                            id="tdsPercentage"
                            placeholder="TDS"
                            value={tdsPercentage}
                            isRequired={false}
                            min={0}
                            max={100}
                            setValue={setValue}
                            SetValue={(value) => {
                              setTdsPercentage(value);
                            }}
                            minError="TDS must be greater than 0"
                            reqValueError="TDS is Required"
                            message={errors.tdsPercentage && errors.tdsPercentage.message}
                          />
              </Col>
              <Col md={2}>
                <Label>
                  Total Amount
                </Label>
                <NumberInputField
                            register={register}
                            id="totalBillAmount"
                            placeholder="Total Amount"
                            value={totalBillAmount}
                            isRequired={false}
                            readOnly
                            min={0}
                            minError="TDS must be greater than 0"
                            reqValueError="TDS is Required"
                            message={errors.totalBillAmount && errors.totalBillAmount.message}
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
            
            </Row>

          </FormProvider>
        </PreviewCard>
      </Content>
      <DeleteModal
        actionName={"Delete"}
        modal={deleteModal}
        toggle={toggle}
        name={"Item"}
        title={"Lot"}
        clickAction={deleteItem}
      />
    </React.Fragment>
  );
};

export default PurchaseEntryForm;
