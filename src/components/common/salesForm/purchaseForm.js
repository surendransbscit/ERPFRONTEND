import React, { forwardRef, useEffect, useImperativeHandle, useState,useRef } from "react";
import { Col, Row } from "reactstrap";
import { useForm, FormProvider } from "react-hook-form";
import { useCategories, useOldMetalItem, useProducts, usePurities, useUom } from "../../filters/filterHooks";
import { OldMetalItemDropdown, ProductDropdown } from "../../filters/retailFilters";
import { NumberInputField } from "../../Component";
import { InputFieldWithDropdown, InputGroupField, NumberInputFieldWithRef } from "../../form-control/InputGroup";
import LessWeightInputField from "../../form-control/LessWeight";
import usePurchaseFormHandling from "../hooks/usePurchaseFormHandling";
import IsRequired from "../../../components/erp-required/erp-required";
import { useDispatch, useSelector } from "react-redux";
const PurchaseForm = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const methods = useForm();
  const { categories } = useCategories();
  const { purities } = usePurities();
  const { products } = useProducts();
  const { oldMetalItems } = useOldMetalItem();
  const { uom } = useUom();
  const [isOldMetalReq, setIsOldMetalReq] = useState(false);
  const [isOldMetalCostEditable, setIsOldMetalCostEditable] = useState(false);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const { oldMetalItemInfo } = useSelector((state) => state.oldMetalItemReducer);
  const { activeQualityCodeList } = useSelector((state) => state.qualityCodeReducer);
  const { activeStoneList } = useSelector((state) => state.stoneReducer);
  const productRef = useRef(null);
  const itemCostRef = useRef(null);


  useEffect(() => {
    setIsOldMetalReq(parseInt(userInfo?.settings?.is_old_metal_item_req) === 0 ? false : true);
    setIsOldMetalCostEditable(parseInt(userInfo?.settings?.is_old_metal_cost_editable) === 1 ? false : true);
  }, [userInfo?.settings?.is_old_metal_cost_editable]);

  let UomOptions = [];
  if (uom.length > 0) {
    UomOptions = uom.map((val) => ({
      value: val.uom_id,
      label: val.uom_name,
      isDefault: val.is_default,
    }));
  }
  const { formValues, lessWeightRef, handleInputChange, handleSetStoneDetails, resetPurity, resetProduct, resetForm,lastTabIndex } =
    usePurchaseFormHandling(categories, products, oldMetalItems,userInfo?.settings?.old_metal_calculation,isOldMetalReq,isOldMetalCostEditable,userInfo?.settings?.dust_wt_auto_calculate,props);

  useImperativeHandle(ref, () => ({
    submit: handleSubmit((data) => {
      data.stoneDetails = formValues.stoneDetails;
      data.lessWeight = formValues.lessWeight;
      data.wastageWeight = formValues.wastageWeight;
      const productDetails = products.find((val) => val.pro_id === data.selectedProduct);
      data.productName = productDetails.product_name;
      props.onSubmit(data);
      resetForm();
      if (productRef.current){
        productRef.current.focus();
      }
    }),
    resetForm: () => {
      resetForm();
    },
  }));

  useEffect(() => {
    if (props?.billTypeTab && props?.billTypeTab === "2") {
      if (productRef.current) {
        productRef.current.focus();
      }
    }
  }, [productRef, props?.billTypeTab]);

  return (
    <FormProvider {...methods}>
      <Row lg={12} className={"form-control-sm"}>
        <Col md={4}>
          <div className="custom-grid">
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
                  selectedProduct={formValues.selectedProduct}
                  onProductChange={(value) => {
                    handleInputChange("selectedProduct", value);
                  }}
                  isRequired={true}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  
                  message={errors.selectedProduct && "Product is Required"}
                  classNamePrefix={"custom-select"}
                  ref={productRef}
                  productType = {5}
                ></ProductDropdown>
              </Col>
            </Row>
            {isOldMetalReq && (
            <>
              <Row className="form-group row g-4">
                <Col md="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                      Item Type
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <OldMetalItemDropdown
                    register={register}
                    id={"selectedOldMetalItem"}
                    oldMetalItems={oldMetalItems}
                    selectedOldMetalItem={formValues.selectedOldMetalItem}
                    onOldMetalItemChange={(value) => {
                      handleInputChange("selectedOldMetalItem", value);
                    }}
                    isRequired={isOldMetalReq}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectedOldMetalItem && "Old Metal Item is Required"}
                    
                    classNamePrefix={"custom-select"}
                  />
                </Col>
              </Row>
           
            
            <Row className="form-group row g-4">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Touch
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <NumberInputField
                  register={register}
                  placeholder="Touch"
                  id={"touch"}
                  value={formValues.touch}
                  isRequired={true}
                  min={0}
                  max={999}
                  handleKeyDownEvents={true}
                  handleDecimalDigits={true}
                  decimalValues={2}
                  setValue={setValue}
                  
                  SetValue={(value) => {
                    handleInputChange("touch", value);
                    clearErrors("touch");
                  }}
                  minError={"Touch Should greater than or equal to 0"}
                  reqValueError={"Touch is Required"}
                  message={errors.touch && errors.touch.message}
                ></NumberInputField>
              </Col>
            </Row>
            </>
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
                  placeholder="Pcs"
                  id={"piece"}
                  value={formValues.piece}
                  isRequired={true}
                  min={"1"}
                  setValue={setValue}
                  
                  SetValue={(value) => {
                    handleInputChange("piece", value);
                    clearErrors("piece");
                  }}
                  minError={"Pieces Should greater than or equal to 0"}
                  reqValueError={"Pieces is Required"}
                  message={errors.piece && errors.piece.message}
                ></NumberInputField>
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
                    Gross Wt
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="8">
                  <NumberInputField
                  register={register}
                  placeholder="Gross weight"
                  id={"grossWeight"}
                  value={formValues.grossWeight}
                  isRequired={true}
                  min={0}
                  type={"number"}
                  handleKeyDownEvents={true}
                  handleDecimalDigits={true}
                  decimalValues={3}
                  setValue={setValue}
                  SetValue={(value) => {
                    handleInputChange("grossWeight", value);
                    clearErrors("grossWeight");
                  }}
                  minError={"Gross weight should less than or equal to 0"}
                  maxError={"Gross Weight greater than or equal to 0"}
                  reqValueError={"Gross weight is Required"}
                  message={errors.grossWeight && errors.grossWeight.message}
                  handleformKeyDown = {
                    (event)=>{
                      if ([ "Tab"].includes(event.key)){
                            console.log("Tab",itemCostRef);
                            if( itemCostRef?.current){
                              event.preventDefault(); 
                              itemCostRef.current.select();
                              console.log(itemCostRef.current);
                            }
                          }
                    }
                  }
                ></NumberInputField>
                {/* <InputFieldWithDropdown
                  register={register}
                  placeholder="Gross weight"
                  id={"grossWeight"}
                  value={formValues.grossWeight}
                  isRequired={true}
                  min={0}
                  type={"number"}
                  handleKeyDownEvents={true}
                  handleDecimalDigits={true}
                  decimalValues={3}
                  optionId={"uomId"}
                  name={"uomId"}
                  options={UomOptions}
                  setValue={setValue}
                  
                  onDropDownChange={(value) => {
                    handleInputChange("uomId", value);
                  }}
                  selectedOption={formValues.uomId}
                  SetValue={(value) => {
                    handleInputChange("grossWeight", value);
                    clearErrors("grossWeight");
                  }}
                  minError={"Gross weight should less than or equal to 0"}
                  maxError={"Gross Weight greater than or equal to 0"}
                  requiredMessage={"Gross weight is Required"}
                  message={errors.grossWeight && errors.grossWeight.message}
                ></InputFieldWithDropdown> */}
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
                  quality_code = {activeQualityCodeList}
                  stone={activeStoneList}
                  tabIndex="-1"
                ></LessWeightInputField>
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Stn Wt
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <InputGroupField
                  register={register}
                  placeholder1="Dia Weight"
                  inputId1="diaWeight"
                  value1={formValues.diaWeight}
                  isRequiredInput1={false}
                  minInput1={0}
                  maxInput1={100}
                  minErrorInput1={"Dia greater than or equal to 0"}
                  messageInput1={errors.diaWeight && errors.diaWeight.message}
                  setValue1={setValue}
                  SetInputValue1={(value) => {
                    handleInputChange("diaWeight", value);
                    clearErrors("diaWeight");
                  }}
                  placeholder2="Stn Weight"
                  inputId2="stnWeight"
                  isRequiredInput2={false}
                  value2={formValues.stnWeight}
                  minInput2={0}
                  setValue2={setValue}
                  minErrorInput2={"Weight should be greater than or equal to 0"}
                  maxErrorInput2={"Weight should be less than or equal to 100"}
                  reqValueErrorInput2={"Weight is required"}
                  messageInput2={errors.stnWeight && errors.stnWeight.message}
                  SetInputValue2={(value) => {
                    handleInputChange("stnWeight", value);
                    clearErrors("stnWeight");
                  }}
                  tabIndex1="-1"
                  tabIndex2="-1"
                />
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Dust Wt
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <NumberInputField
                  register={register}
                  id="dustWeight"
                  placeholder="Dust Weight"
                  value={formValues.dustWeight}
                  isRequired={false}
                  min={0}
                  handleKeyDownEvents={true}
                  handleDecimalDigits={true}
                  decimalValues={3}
                  setValue={setValue}
                  SetValue={(value) => {
                    handleInputChange("dustWeight", value);
                    clearErrors("dustWeight");
                  }}
                  minError="Dust weight must be greater than 0"
                  reqValueError="Dust weight is Required"
                  message={errors.dustWeight && errors.dustWeight.message}
                  tabIndex="-1"
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
                    Wastage
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <InputGroupField
                  register={register}
                  placeholder1="%"
                  inputId1="wastagePercentage"
                  value1={formValues.wastagePercentage}
                  isRequiredInput1={false}
                  minInput1={0}
                  maxInput1={100}
                  maxLength1={999}
                  handleKeyDownEvents1={true}
                  handleDecimalDigits={true}
                  decimalValues={2}
                  minErrorInput1={"VA should be greater than or equal to 0"}
                  maxErrorInput1={"VA Touch should be less than or equal to 100"}
                  reqValueErrorInput1={"VA is required"}
                  messageInput1={errors.wastagePercentage && errors.wastagePercentage.message}
                  setValue={setValue}
                  SetInputValue1={(value) => {
                    handleInputChange("wastagePercentage", value);
                    clearErrors("wastagePercentage");
                  }}
                  placeholder2="Weight"
                  inputId2="wastageWeight"
                  isRequiredInput2={false}
                  value2={formValues.wastageWeight}
                  minInput2={0}
                  minErrorInput2={"Weight should be greater than or equal to 0"}
                  maxErrorInput2={"Weight should be less than or equal to 100"}
                  reqValueErrorInput2={"Weight is required"}
                  messageInput2={errors.wastageWeight && errors.wastageWeight.message}
                  SetInputValue2={(value) => {
                    handleInputChange("wastageWeight", value);
                    clearErrors("wastageWeight");
                  }}
                  tabIndex1="-1"
                  tabIndex2="-1"
                />
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Net / Pure Wt
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <InputGroupField
                  register={register}
                  placeholder1="Net Weight"
                  inputId1="netWeight"
                  value1={formValues.netWeight}
                  isRequiredInput1={false}
                  readOnly1
                  minInput1={0}
                  handleKeyDownEvents1={true}
                  handleDecimalDigits={true}
                  decimalValues={3}
                  messageInput1={errors.netWeight && errors.netWeight.message}
                  setValue1={setValue}
                  SetInputValue1={(value) => {
                    handleInputChange("netWeight", value);
                    clearErrors("netWeight");
                  }}
                  placeholder2="Pure Weight"
                  inputId2="pureWeight"
                  isRequiredInput2={false}
                  value2={formValues.pureWeight}
                  minInput2={0}
                  minErrorInput2={"Weight should be greater than or equal to 0"}
                  maxErrorInput2={"Weight should be less than or equal to 100"}
                  reqValueErrorInput2={"Weight is required"}
                  messageInput2={errors.pureWeight && errors.pureWeight.message}
                  setValue2={setValue}
                  SetInputValue2={(value) => {
                    handleInputChange("pureWeight", value);
                    clearErrors("pureWeight");
                  }}
                  tabIndex1="-1"
                  tabIndex2="-1"
                />
              </Col>
            </Row>

            <Row className="form-group row g-4">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Rate / C Rate
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <InputGroupField
                  register={register}
                  placeholder1="Rate"
                  inputId1="ratePerGram"
                  value1={formValues.ratePerGram}
                  isRequiredInput1={false}
                  minInput1={0}
                  handleKeyDownEvents1={true}
                  handleDecimalDigits={true}
                  decimalValues={2}
                  messageInput1={errors.ratePerGram && errors.ratePerGram.message}
                  setValue1={setValue}
                  // tabIndex1={lastTabIndex}
                  SetInputValue1={(value) => {
                    handleInputChange("ratePerGram", value);
                    clearErrors("ratePerGram");
                  }}
                  onKeyDown1={(e) => {
                    if (e.key === "Enter") {
                      ref?.current?.submit();
                    }
                  }}
                  placeholder2="C Rate"
                  inputId2="customerRate"
                  isRequiredInput2={false}
                  value2={formValues.customerRate}
                  minInput2={0}
                  minErrorInput2={"Weight should be greater than or equal to 0"}
                  maxErrorInput2={"Weight should be less than or equal to 100"}
                  reqValueErrorInput2={"Weight is required"}
                  messageInput2={errors.customerRate && errors.customerRate.message}
                  setValue2={setValue}
                  SetInputValue2={(value) => {
                    handleInputChange("customerRate", value);
                    clearErrors("customerRate");
                  }}
                />
              </Col>
            </Row>

            <Row className="form-group row g-4">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Item Cost
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <NumberInputFieldWithRef
                  register={register}
                  placeholder="Purchase Cost"
                  id={"itemCost"}
                  value={formValues.itemCost}
                  isRequired={true}
                  min={0}
                  readOnly={true}
                  setValue={setValue}
                  
                  SetValue={(value) => handleInputChange("itemCost", value)}
                  minError={"Cost Should greater than 0"}
                  message={errors.itemCost && errors.itemCost.message}
                  ref={itemCostRef}
                ></NumberInputFieldWithRef>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* <Row>
            <Col md={12}>
                <Row md={12}>
                    <PreviewTable columns={columns}  data={formData} numericFields={numericFields}  onDelete={handleDelete} onEdit = {handleEdit} />
                </Row>
            </Col>
        </Row> */}
    </FormProvider>
  );
});
export default PurchaseForm;
