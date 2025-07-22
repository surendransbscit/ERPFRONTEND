import React, { useEffect, forwardRef, useImperativeHandle, useState,useRef } from "react";
import { Button, Col, Row } from "reactstrap";
import { useForm, FormProvider } from "react-hook-form";
import useSalesFormHandling from "../hooks/useSalesFormHandling";
import {
  CategoryDropdown,
  DesignDropdown,
  ProductDropdown,
  PurityDropdown,
  SectionDropdown,
  SubDesignDropdown,
  SizeDropdown,
  ActiveEmployeeDropdown
} from "../../filters/retailFilters";
import { NumberInputField } from "../../Component";
import { InputFieldWithDropdown, InputGroupField, TextInputField } from "../../form-control/InputGroup";
import LessWeightInputField from "../../form-control/LessWeight";
import IsRequired from "../../../components/erp-required/erp-required";
import { useSelector, useDispatch } from "react-redux";
import OtherMetalWeightInputField from "../../form-control/otherMetalInput";
import OtherChargesForm from "../../form-control/otherChargesInput";
import AttributeModalForm from "../modal/attributeModal";
import { getNonTagStock } from "../../../redux/thunks/inventory";
import EmployeeModal from "../../modals/EmployeeModal";
import io from "socket.io-client";
import { useQualityCode, useStone } from "../../filters/filterHooks";
import { isUndefined } from "../calculations/ErpCalculations";
// The forwardRef function takes a render function as an argument.
// This render function receives the props and ref as arguments.

const SalesForm = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const { nonTagStock } = useSelector((state) => state.lotReducer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [filteredSubDesigns, setFilteredSubDesigns] = useState([]);
  const [filteredPurities, setFilteredPurities] = useState([]);
  const [maxGrossWeight, setMaxGrossWeight] = useState("");
  const [maxPiece, setMaxPiece] = useState("");
  const [maxWeightTolarance, setMaxWeightTolarance] = useState(0);

  const [actualGrossWeight, setActualGrossWeight] = useState(0);
  const [isStoneRestrict, setIsStoneRestrict] = useState(false);
  const [isOtherMetalRestrict, setIsOtherMetalRestrict] = useState(false);
  const [isSectionReq, setIsSectionRequired] = useState(settings?.is_section_required);
  const [employeeModal, SetEmployeeModal] = useState(false);
  const { stone } = useStone();
  const { quality_code } = useQualityCode();
  const filteredProductsRef = useRef(filteredProducts);
  const toggleEmployeeModal = () => SetEmployeeModal(!employeeModal);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    getValues,
    trigger,
  } = useForm();
  const methods = useForm();
  const {
    categories,
    products,
    designs,
    subDesigns,
    sections,
    size,
    purities,
    uom,
    UomOptions,
    formValues,
    lessWeightRef,
    otherMetalWeightRef,
    otherChargesRef,
    handleInputChange,
    handleSetStoneDetails,
    handleSetOtherMetalDetails,
    handleSetOtherChargesDetails,
    handleAttributeDetails,
    resetPurity,
    resetProduct,
    resetDesign,
    resetSubDesign,
    mcTypeOptions,
    resetForm,
    PureCalcTypeOptions,
    isMrpItem,
    fixedRateCalc,
    lastTabIndex,
    setMaxMcVaBasedOnSettings,
    validateMcVaSettings,
    employees,
    isSizeReq,
    inputRefs
  } = useSalesFormHandling(props, actualGrossWeight); //Custom Hook for Handling Form logics
  const formValuesRef = useRef(formValues);
  useEffect(() => {
    formValuesRef.current = formValues;
  } , [formValues]);
    useEffect(() => {
    filteredProductsRef.current = filteredProducts;
  } , [filteredProducts]);
  useEffect(() => {
    // if(props?.isTagging){
    console.log('socket connnect start');
    const socket = io("http://localhost:7000",{
      transports: ["websocket"],
      secure: false,
      reconnectionAttempts: 5,
      timeout: 5000,
      path: "/socket.io", 
    }); // Connect to Flask WebSocket

    socket.on("connect_error", (err) => {
      console.error("Connection failed:", err.message);
    });

    // Listen for weight updates
    socket.on("weight-update", (data) => {
        // setWeight(data.weight);
        let weight = data.weight;
        console.log('socket weight' , weight);
        let [numericValue,unit] = weight.replace("ST,","").split(",");
        numericValue = parseFloat(numericValue)
        const currentFormValues = formValuesRef?.current;
        const productDetails = filteredProductsRef?.current?.find((prod) => prod.id_lot_inward_detail === currentFormValues?.idLotInwardDetail);
        if(parseFloat(numericValue) >0 && parseFloat(numericValue) != parseFloat(currentFormValues.grossWeight) ){
          if(productDetails){
            if(productDetails.id_metal == 2 ){
              let intPart = Math.floor(numericValue);
              let decimalPart = numericValue - intPart;
              if (decimalPart <= 0.25) {
                intPart;
              } else if (decimalPart > 0.25 && decimalPart <= 0.75) {
                intPart += 0.5;
              } else {
                intPart += 1;
              }
              handleInputChange("grossWeight", intPart);
              clearErrors("grossWeight");
              setMaxMcVaBasedOnSettings();
            }else{
              handleInputChange("grossWeight", numericValue);
              clearErrors("grossWeight");
              setMaxMcVaBasedOnSettings();
            }

          }

        }
    });

    socket.on("connect", () => {
  console.log("Socket connected");
});

    return () => socket.disconnect(); // Cleanup on unmount
  // }
}, []);

  useEffect(()=>{
    if(props?.isSectionReq){
      setIsSectionRequired(props?.isSectionReq);
    }else if(settings?.is_section_required){
        setIsSectionRequired(settings?.is_section_required);
      } 
  },[props?.isSectionReq,settings?.is_section_required])
  
  useEffect(() => {
    setMaxGrossWeight("");
    setMaxPiece("");
    setMaxWeightTolarance(isUndefined(props?.maxWeightTolarance));
    if (props?.maxPiece != undefined) {
      setMaxPiece(props.maxPiece);
      if(parseFloat(props.maxPiece)> 0){
        handleInputChange("piece", 1);
      }else{
        handleInputChange("piece", 0);
      }
    }
    if (props?.maxGrossWeight != undefined) {
      setMaxGrossWeight(props.maxGrossWeight);
      handleInputChange("grossWeight", 0);
    }
  }, [props?.maxGrossWeight, props?.maxPiece]);
  //For Tagging form Need to pass the selected catalog details to check the available pieces and weight
  useEffect(() => {
    if (
      props?.selectedCatalog &&
      formValues.selectedCategory !== "" &&
      formValues.selectedProduct !== "" &&
      formValues.selectedDesign !== "" &&
      (settings?.is_sub_design_req === "1" ? formValues.selectedSubDesign !== "" : true)
    ) {
      let item = {
        idLotInwardDetail:formValues.idLotInwardDetail,
        selectedCategory: formValues.selectedCategory,
        selectedProduct: formValues.selectedProduct,
        selectedDesign: formValues.selectedDesign,
        selectedSubDesign: formValues.selectedSubDesign,
      };
      props?.selectedCatalog(item);
    }
  }, [
    props,
    props?.selectedCatalog,
    formValues.selectedCategory,
    formValues.selectedProduct,
    formValues.selectedDesign,
    formValues.selectedSubDesign,
  ]);

  useEffect(()=>{
      if(props?.singleLotItem?.cat_id){
        formValues.selectedCategory = props?.singleLotItem?.cat_id;
        formValues.selectedProduct = props?.singleLotItem?.id_product;
        formValues.selectedPurity = props?.singleLotItem?.id_purity;
      }
  },[props?.singleLotItem])

  useEffect(() => {
    if (props?.lotItemDetails) {
      // For Tagged Items
      let lotItemDetails = props?.lotItemDetails;
      if (lotItemDetails.length > 0) {
        let lotCategory = categories.filter((val) => lotItemDetails.some((item) => val.id_category === item.cat_id));
        let lotProducts = products.filter((val) =>
          lotItemDetails.some((item) => val.pro_id === item.id_product && val.stock_type === "0")
        );
        lotProducts = []
        for(let item of lotItemDetails){
          let pro = products.find((val) => val.pro_id ==  item.id_product && val.stock_type === "0")
          if(pro){
            lotProducts.push({...item,...pro,"product_name": pro.product_name + "-" + item.item_code,pro_id : item.id_lot_inward_detail})
          }
        }
        
        // let lotDesigns = designs.filter((val) => lotItemDetails.some((item) => val.id_design === item.id_design));
        // let lotSubDesigns = subDesigns.filter((val) =>
        //   lotItemDetails.some((item) => val.id_sub_design === item.id_sub_design)
        // );
        // let lotPurity = purities.filter((val) => lotItemDetails.some((item) => val.id_purity === item.id_purity));

        setFilteredProducts(lotProducts);
        setFilteredCategories(lotCategory);
        setFilteredDesigns([]);
        setFilteredSubDesigns([]);
        setFilteredPurities(purities);
      }
    } else if (props?.itemType && props?.itemType === 1) {
      //For Non Tag item
      let lotProducts = products.filter((val) => val.stock_type === "1");
      setFilteredProducts(lotProducts);
      setFilteredPurities(purities);
    } else {
      setFilteredProducts(products);
      setFilteredPurities(purities);
    }
  }, [props?.lotItemDetails, props?.itemType, products, categories, designs, subDesigns]);

  useImperativeHandle(ref, () => ({
    getValues: () => {
      const formData = getValues();
      let data = setDataWithOtherDetails({...formData,selectedProduct :formValues.selectedProduct});
      return data;
    },
    validate: async () => {
      // Trigger validation on all fields
      const isValid = await trigger();
      return isValid;
    },
    submit: handleSubmit((data) => {
      let details = setDataWithOtherDetails({...data,selectedProduct :formValues.selectedProduct});
      let response = props.onSubmit(details);
      if (response!== undefined) {
        if (typeof response.then === 'function') {
          response.then(result => {
              if (result === undefined || result === true) {
                  // Code to execute if result is truthy
                  setActualGrossWeight(0);
                  setMaxGrossWeight("");
                  setMaxPiece("");
                  resetForm();
              } 
          }).catch(error => {
              // Handle any errors
              console.error('Error handling response:', error);
          });
        }
      }else{
        setActualGrossWeight(0);
        setMaxGrossWeight("");
        setMaxPiece("");
        resetForm();
      }
      // }
    }),
    resetForm: (type = 1) => {
      resetForm(type);
      setActualGrossWeight(0);
      setMaxGrossWeight("");
      setMaxPiece("");
    },
  }));

  const setDataWithOtherDetails = (data) => {
    const productDetails = products.find((val) => val.pro_id === data.selectedProduct);
    const designDetails = designs.find((val) => val.id_design === data.selectedDesign);
    const subDesignDetails = subDesigns.find((val) => val.id_sub_design === data.selectedSubDesign);
    const updatedData = {
      ...data,
      productName: productDetails.product_name || "",
      designName: designDetails.design_name || "",
      subDesignName: subDesignDetails?.sub_design_name || "",
      stoneDetails: formValues?.stoneDetails || [],
      otherMetalDetails: formValues?.otherMetalDetails || [],
      otherChargesDetails: formValues?.otherChargesDetails || [],
      attributeDetails: formValues?.attributeDetails || [],
      subEmployee1: formValues?.subEmployee1,
      subEmployee2: formValues?.subEmployee2,
      isMrpItem: isMrpItem,
      fixedRateCalc: fixedRateCalc,
    };
    return updatedData;
  };

  useEffect(() => {
    const getNonTagAvailableStockDetails = async () => {
      if (props?.idBranch !== null && props?.itemType === 1) {
        try {
          await dispatch(getNonTagStock(props?.idBranch)).unwrap();
        } catch (error) {
          console.error(error);
        }
      }
    };
    getNonTagAvailableStockDetails();
  }, [dispatch, props?.idBranch, props?.itemType]);

  useEffect(() => {
    setValue("lessWeight", formValues.lessWeight);
    setValue("netWeight", formValues.netWeight);
    setValue("otherMetalWeight", formValues.otherMetalWeight);
    setValue("itemCost", formValues.itemCost);
    setValue("totalMcValue", formValues.totalMcValue);
    setValue("ratePerGram", formValues.ratePerGram);
    setValue("sgst", formValues.sgst);
    setValue("cgst", formValues.sgst);
    setValue("igst", formValues.igst);
    setValue("mrpMarginAmount", formValues.mrpMarginAmount);
    setValue("taxPercentage", formValues.taxPercentage);
    setValue("taxType", formValues.taxType);
    setValue("tax_id", formValues.tax_id);
    setValue("productCalculationType", formValues.productCalculationType);
    setValue("taxAmount", formValues.taxAmount);
    setValue("taxableAmount", formValues.taxableAmount);
    setValue("tagId", formValues.tagId);
    setValue("tagCode", formValues.tagCode);
    setValue("est_item_id", formValues.est_item_id);
    setValue("purchaseMcType", props?.purchaseMcType);
    setValue("purchaseMc", props?.purchaseMc);
    setValue("purchaseRate", props?.purchaseRate);
    setValue("purchaseRateType", props?.purchaseRateType);
    setValue("purchaseCost", formValues.purchaseCost);
    setValue("rate_type", formValues.rate_type);
    setValue("detail_id", formValues.detail_id);
    setValue("settingsMcType", formValues.settingsMcType);
    setValue("settingsMinVa", formValues.settingsMinVa);
    setValue("settingsMinMc", formValues.settingsMinMc);
    setValue("settingsMaxVa", formValues.settingsMaxVa);
    setValue("settingsMaxMc", formValues.settingsMaxMc);
    setValue("settVaType", formValues.settVaType);
    setValue("wastage_calc_type", formValues.wastage_calc_type);
    if (props?.purchaseTouch > 0 && formValues.purchaseTouch === 0) {
      formValues.purchaseTouch = props?.purchaseTouch;
    }
    if (props?.purchaseWastage > 0 && formValues.purchaseWastage === 0) {
      formValues.purchaseWastage = props?.purchaseWastage;
    }
    if (props?.pureWeightCalType !== "" && formValues.pureWeightCalType === "") {
      formValues.pureWeightCalType = props?.pureWeightCalType;
    }
    formValues.purchaseRate = props?.purchaseRate;
    formValues.purchaseRateType = props?.purchaseRateType;
    formValues.purchaseMcType = props?.purchaseMcType;
    formValues.purchaseMc = props?.purchaseMc;
  }, [
    setValue,
    formValues,
    props?.purchaseMc,
    props?.purchaseMcType,
    props?.purchaseRate,
    props?.purchaseRateType,
    props?.purchaseTouch,
    props?.purchaseWastage,
    props?.pureWeightCalType,
  ]);

  useEffect(() => {
    setIsStoneRestrict(false);
    setIsOtherMetalRestrict(false);

    if (props?.isPartialSale && props?.itemType === 0) {
      if (actualGrossWeight === 0) {
        setActualGrossWeight(formValues.grossWeight);
      }
      if (props.isPartialSale === "1") {
        setMaxGrossWeight(actualGrossWeight);
        if (formValues.lessWeight === 0) {
          setIsStoneRestrict(true);
        }
        if (formValues.otherMetalDetails.length === 0) {
          setIsOtherMetalRestrict(true);
        }
      } else {
        formValues.grossWeight = actualGrossWeight;
      }
    } else if (props?.itemType === 1) {
      // Non Tag Items
      const salesItemData = props?.salesItemData ? props.salesItemData : [];

      const totalSales = [...salesItemData]
        .filter(
          (item) =>
            item.item_type === 1 &&
            item.selectedProduct === formValues.selectedProduct &&
            item.selectedDesign === formValues.selectedDesign &&
            item.selectedSubDesign === formValues.selectedSubDesign &&
            item.selectedSection === formValues.selectedSection
        )
        .reduce(
          (sum, val) => {
            return {
              totalGrossWeight: parseFloat(sum.totalGrossWeight) + parseFloat(val.grossWeight),
              totalPieces: parseFloat(sum.totalPieces) + parseFloat(val.piece),
            };
          },
          { totalGrossWeight: 0, totalPieces: 0 }
        );
      let nonTagStockItems = nonTagStock.find(
        (val) =>
          val.id_product_id === formValues.selectedProduct &&
          val.id_design_id === formValues.selectedDesign &&
          (settings?.is_section_required === "1" ? val.id_section_id === formValues.selectedSection : true)
      );

      if (nonTagStockItems) {
        let actualStockWeight = parseFloat(
          parseFloat(nonTagStockItems?.gross_wt) - parseFloat(totalSales.totalGrossWeight)
        ).toFixed(3);
        let actualStockPcs = parseFloat(parseFloat(nonTagStockItems?.pieces) - parseFloat(totalSales.totalPieces));
        setMaxGrossWeight(actualStockWeight);
        setMaxPiece(actualStockPcs);
      } else {
        setMaxGrossWeight(0);
        setMaxPiece(0);
        //formValues.piece = 0;
      }
    }
  }, [
    formValues,
    nonTagStock,
    actualGrossWeight,
    props?.maxGrossWeight,
    props?.maxPiece,
    props?.isPartialSale,
    props?.itemType,
  ]);


  return (
    <FormProvider {...methods}>
      <Row md={12} className={"form-control-sm"}>
        <Col md={4}>
          <div className="custom-grid">
          { props?.lotItemDetails != undefined && (
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
                  products={filteredProducts}
                  categories={categories}
                  selectedPurity={formValues.selectedPurity}
                  selectedProduct={(props?.lotItemDetails ? formValues.idLotInwardDetail:formValues.selectedProduct)}
                  onProductChange={(value) => {
                    resetDesign();
                    resetSubDesign();
                    let lotItemDetails = props?.lotItemDetails;
                    if (lotItemDetails?.length > 0 && value ) {
                      let pro = filteredProducts.find((item) => item.id_lot_inward_detail == value )
                      handleInputChange("idLotInwardDetail", value);
                      handleInputChange("lotInwardDetail", pro);

                      if(pro?.cat_id != null && pro?.cat_id != undefined){
                        handleInputChange("selectedCategory", pro.cat_id);
                        setValue("selectedCategory",pro.cat_id)
                        clearErrors("selectedCategory");
                      }

                      if(pro?.id_purity != null && pro?.id_purity != undefined){
                        handleInputChange("selectedPurity", pro.id_purity);
                        setValue("selectedPurity",pro.id_purity)
                        clearErrors("selectedPurity");
                      }

                      if(pro?.id_product){
                        handleInputChange("selectedProduct", pro.id_product);

                      }
                      if(pro?.id_section != null && pro?.id_section != undefined){
                        handleInputChange("selectedSection", pro.id_section);
                        setValue("selectedSection",pro.id_section)
                        clearErrors("selectedSection");
                      }

                      if(pro?.id_design != null && pro?.id_design != undefined){
                        handleInputChange("selectedDesign", pro.id_design);
                        setValue("selectedDesign",pro.id_design)
                        clearErrors("selectedDesign");
                      }

                      if(pro?.size != null && pro?.size != undefined){
                        handleInputChange("selectedSize", pro.size);
                        setValue("selectedSize",pro.size)
                        clearErrors("selectedSize");
                      }

                      if(pro?.id_sub_design != null && pro?.id_sub_design != undefined){
                        handleInputChange("selectedSubDesign", pro.id_sub_design);
                        setValue("selectedSubDesign",pro.id_sub_design)
                        clearErrors("selectedSubDesign");
                      }
                        
                    }else if(!value){
                      handleInputChange("idLotInwardDetail", "");
                      handleInputChange("selectedProduct", "");
                      handleInputChange("selectedSize", "");
                      handleInputChange("selectedSection", "");
                      handleInputChange("selectedCategory", "");
                      handleInputChange("selectedPurity", "");
                    }else{
                      handleInputChange("selectedProduct", value);
                      handleInputChange("selectedSize", "");
                    }

                  }}
                  isRequired={true}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.selectedProduct && "Product is Required"}
                  tabIndex={lastTabIndex}
                  readOnly={props?.readOnly}
                ></ProductDropdown>
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
                  id={"productCalculationType"}
                  value={formValues.productCalculationType}
                  {...register("productCalculationType")}
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
                <input
                  type="hidden"
                  id={"totalMcValue"}
                  value={formValues.totalMcValue}
                  {...register("totalMcValue")}
                />
                <input
                  type="hidden"
                  id={"stoneDetails"}
                  value={formValues.stoneDetails}
                  {...register("stoneDetails")}
                />
                <input
                  type="hidden"
                  id={"otherMetalDetails"}
                  value={formValues.otherMetalDetails}
                  {...register("otherMetalDetails")}
                />
                <input
                  type="hidden"
                  id={"otherChargesDetails"}
                  value={formValues.otherChargesDetails}
                  {...register("otherChargesDetails")}
                />
                <input
                  type="hidden"
                  id={"attributeDetails"}
                  value={formValues.attributeDetails}
                  {...register("attributeDetails")}
                />
                <input
                  type="hidden"
                  id={"purchaseMcType"}
                  value={formValues.purchaseMcType}
                  {...register("purchaseMcType")}
                />
                <input type="hidden" id={"purchaseMc"} value={formValues.purchaseMc} {...register("purchaseMc")} />
                <input
                  type="hidden"
                  id={"purchaseRate"}
                  value={formValues.purchaseRate}
                  {...register("purchaseRate")}
                />
                <input
                  type="hidden"
                  id={"purchaseRateType"}
                  value={formValues.purchaseRateType}
                  {...register("purchaseRateType")}
                />
                <input
                  type="hidden"
                  id={"purchaseCost"}
                  value={formValues.purchaseCost}
                  {...register("purchaseCost")}
                />
                <input type="hidden" id={"tagId"} value={formValues.tagId} {...register("tagId")} />
                <input type="hidden" id={"tagCode"} value={formValues.tagCode} {...register("tagCode")} />
                <input type="hidden" id={"est_item_id"} value={formValues.est_item_id} {...register("est_item_id")} />
                <input type="hidden" id={"mrpMarginAmount"} value={formValues.mrpMarginAmount} {...register("mrpMarginAmount")} />
              </Col>
            </Row>
            )}
            
            <Row className="form-group row g-4" style={props?.lotItemDetails == undefined ? {} : { display: "none" }}>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Category
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <CategoryDropdown
                  register={register}
                  id="selectedCategory"
                  categories={filteredCategories.length > 0 ? filteredCategories : categories}
                  selectedCategory={formValues.selectedCategory}
                  onCategoryChange={(value) => {
                    handleInputChange("selectedCategory", value);
                    resetPurity();
                    resetProduct();
                    resetDesign();
                    resetSubDesign();
                  }}
                  isRequired={true}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.selectedCategory && "Category is Required"}
                  tabIndex={lastTabIndex}
                  readOnly={props?.readOnly}
                />
              </Col>
            </Row>
            <Row className="form-group row g-4" style={props?.lotItemDetails == undefined  ? {} : formValues?.lotInwardDetail != undefined && formValues.lotInwardDetail?.id_purity != undefined &&formValues.lotInwardDetail.id_purity != null && formValues.lotInwardDetail.id_purity  ? { display: "none" } : {}} >
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Purity
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <PurityDropdown
                  register={register}
                  id={"selectedPurity"}
                  purities={filteredPurities}
                  categories={categories}
                  selectedCategory={formValues.selectedCategory}
                  onPurityChange={(value) => {
                    handleInputChange("selectedPurity", value);
                  }}
                  selectedPurity={formValues.selectedPurity}
                  isRequired={true}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.selectedPurity && "Purity is Required"}
                  tabIndex={lastTabIndex}
                  readOnly={props?.readOnly}
                ></PurityDropdown>
              </Col>
            </Row>
            
            { props?.lotItemDetails == undefined && (
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
                  products={filteredProducts}
                  categories={categories}
                  selectedCategory={formValues.selectedCategory}
                  selectedPurity={formValues.selectedPurity}
                  selectedProduct={formValues.selectedProduct}
                  onProductChange={(value) => {
                    handleInputChange("selectedProduct", value);
                    handleInputChange("selectedSize", "");
                    resetDesign();
                    resetSubDesign();
                  }}
                  isRequired={true}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.selectedProduct && "Product is Required"}
                  tabIndex={lastTabIndex}
                  readOnly={props?.readOnly}
                ></ProductDropdown>
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
                  id={"productCalculationType"}
                  value={formValues.productCalculationType}
                  {...register("productCalculationType")}
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
                <input
                  type="hidden"
                  id={"totalMcValue"}
                  value={formValues.totalMcValue}
                  {...register("totalMcValue")}
                />
                <input
                  type="hidden"
                  id={"stoneDetails"}
                  value={formValues.stoneDetails}
                  {...register("stoneDetails")}
                />
                <input
                  type="hidden"
                  id={"otherMetalDetails"}
                  value={formValues.otherMetalDetails}
                  {...register("otherMetalDetails")}
                />
                <input
                  type="hidden"
                  id={"otherChargesDetails"}
                  value={formValues.otherChargesDetails}
                  {...register("otherChargesDetails")}
                />
                <input
                  type="hidden"
                  id={"attributeDetails"}
                  value={formValues.attributeDetails}
                  {...register("attributeDetails")}
                />
                <input
                  type="hidden"
                  id={"purchaseMcType"}
                  value={formValues.purchaseMcType}
                  {...register("purchaseMcType")}
                />
                <input type="hidden" id={"purchaseMc"} value={formValues.purchaseMc} {...register("purchaseMc")} />
                <input
                  type="hidden"
                  id={"purchaseRate"}
                  value={formValues.purchaseRate}
                  {...register("purchaseRate")}
                />
                <input
                  type="hidden"
                  id={"purchaseRateType"}
                  value={formValues.purchaseRateType}
                  {...register("purchaseRateType")}
                />
                <input
                  type="hidden"
                  id={"purchaseCost"}
                  value={formValues.purchaseCost}
                  {...register("purchaseCost")}
                />
                <input type="hidden" id={"tagId"} value={formValues.tagId} {...register("tagId")} />
                <input type="hidden" id={"tagCode"} value={formValues.tagCode} {...register("tagCode")} />
                <input type="hidden" id={"est_item_id"} value={formValues.est_item_id} {...register("est_item_id")} />
              </Col>
            </Row>
            )}
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
                  designs={filteredDesigns.length > 0 ? filteredDesigns : designs}
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
                  tabIndex={lastTabIndex}
                  readOnly={props?.readOnly}
                ></DesignDropdown>
              </Col>
            </Row>
            {settings?.is_sub_design_req === "1" && (
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
                    subDesigns={filteredSubDesigns.length > 0 ? filteredSubDesigns : subDesigns}
                    products={products}
                    designs={designs}
                    selectedProduct={formValues.selectedProduct}
                    selectedDesign={formValues.selectedDesign}
                    selectedSubDesign={formValues.selectedSubDesign}
                    onSubDesignChange={(value) => {
                      handleInputChange("selectedSubDesign", value);
                      setMaxMcVaBasedOnSettings();
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectedSubDesign && "Sub Design is Required"}
                    tabIndex={lastTabIndex}
                    readOnly={props?.readOnly}
                  ></SubDesignDropdown>
                </Col>
              </Row>
            )}
            {isSizeReq && (
              <Row className="form-group row g-4">
                <Col md="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                      Size
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <SizeDropdown
                    register={register}
                    id={"selectedSize"}
                    size={size}
                    products={products}
                    selectedProduct={formValues.selectedProduct}
                    selectedSize={formValues.selectedSize}
                    onSizeChange={(value) => {
                      handleInputChange("selectedSize", value);
                    }}
                    isRequired={false}
                    isRequiredBasedOnPro={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectedSize && "Size is Required"}
                    tabIndex={lastTabIndex}
                    readOnly={props?.readOnly}
                  />
                </Col>
              </Row>
            )}
            {isSectionReq === "1" && (
              <Row className="form-group row g-4">
                <Col md="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                      Section{settings?.is_section_required && <IsRequired />}
                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <SectionDropdown
                    isMulti={false}
                    register={register}
                    products={products}
                    isRequired={settings?.is_section_required}
                    id={"selectedSection"}
                    placeholder="Section"
                    value={formValues.selectedSection}
                    selectedSection={formValues.selectedSection}
                    selectedProduct={formValues.selectedProduct}
                    optionLabel="Select Section"
                    sectionOptions={sections}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    onSectionChange={(value) => {
                      handleInputChange("selectedSection", value);
                      clearErrors("selectedSection");
                    }}
                    message={errors.selectedSection && "Section is Required"}
                    tabIndex={lastTabIndex}
                    readOnly={props?.readOnly}
                  />
                </Col>
              </Row>
            )}
            {props?.isHuidReq && (
              <>
                <Row className="form-group row g-4">
                  <Col md="4">
                    <div className="form-group">
                      <label className="form-label" htmlFor="huId1">
                        HUID1
                        {props?.isHuidMandatory == 1 && (<IsRequired />)}
                      </label>
                    </div>
                  </Col>
                  <Col lg={8}>
                    <TextInputField
                      register={register}
                      isRequired={(props?.isHuidMandatory == 1 ? true :false )}
                      id={"huId1"}
                      placeholder="HUID1"
                      value={formValues.huId1}
                      setValue={setValue}
                      tabIndex={lastTabIndex}
                      maxLength={6}
                      SetValue={(value) => {
                        handleInputChange("huId1", value);
                        clearErrors("huId1");
                      }}
                      pattern={"/^[A-Za-z0-9]{6,7}$/"}
                      message={errors.huId1 && "HUID is Required"}
                    />
                  </Col>
                </Row>
                <Row className="form-group row g-4">
                  <Col md="4">
                    <div className="form-group">
                      <label className="form-label" htmlFor="huId2">
                        HUID2
                      </label>
                    </div>
                  </Col>
                  <Col lg={8}>
                    <TextInputField
                      register={register}
                      isRequired={false}
                      id={"huId2"}
                      placeholder="HUID2"
                      value={formValues.huId2}
                      setValue={setValue}
                      tabIndex={lastTabIndex}
                      maxLength={6}
                      SetValue={(value) => {
                        handleInputChange("huId2", value);
                        clearErrors("huId2");
                      }}
                      pattern={"/^[A-Za-z0-9]{6,7}$/"}
                      // message={errors.huId1 && "HUID is Required"}
                    />
                  </Col>
                </Row>
              </>
            )}

            <Row className="form-group row g-4">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Attribute
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <Button color="primary" size="md" onClick={toggleModal}>
                  Add Attribute
                </Button>
              </Col>
            </Row>
            {props?.isEmployee == true && (
            <Row className="form-group row g-4">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Employee
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <ActiveEmployeeDropdown
                  register={register}
                  id={"employee"}
                  selectedEmployee={formValues.employee}
                  onEmployeeChange={(value) => {
                    handleInputChange("employee", value);
                    clearErrors("employee");
                  }}
                  isRequired={true}
                  options={employees}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.employee && "Employee is Required"}
                />
              </Col>
            </Row>)}
            {props?.isEmployeeSupport == true && (
            <Row className="form-group row g-4">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Support Employee
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <Button color="primary" size="md" onClick={toggleEmployeeModal}>
                  Add Support Employee
                </Button>
              </Col>
            </Row>
            )}
          </div>
        </Col>
        <Col md={4}>
          <div className="custom-grid">
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
                  max={maxPiece !== "" ? (formValues?.lotInwardDetail?.add_lot_excess_weight == 1 ? '':maxPiece) : ""}
                  setValue={setValue}
                  handleDot={true}
                  handleKeyDownEvents={true}
                  SetValue={(value) => {
                    handleInputChange("piece", value);
                    clearErrors("piece");
                  }}
                  minError={"Pieces Should greater than or equal to 0"}
                  maxError={"Pieces Should greater than or equal to " + maxPiece}
                  reqValueError={"Pieces is Required"}
                  message={errors.piece && errors.piece.message}
                  tabIndex={lastTabIndex}
                  readOnly={props?.readOnly}
                ></NumberInputField>
                {maxPiece !== "" ? <span>Available Piece :{maxPiece}</span> : ""}
              </Col>
            </Row>
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
                  readOnly={isMrpItem || props?.readOnly}
                  min={!isMrpItem ? 0.1 : 0}
                  //max={ maxGrossWeight ? parseFloat(parseFloat(maxGrossWeight)-parseFloat(props?.maxGrossWeight ? formValues.grossWeight :0)).toFixed(3) : ''}
                  max={maxGrossWeight !== "" ? (formValues?.lotInwardDetail ? parseFloat(isUndefined(maxGrossWeight)) + parseFloat(isUndefined(maxWeightTolarance)): '' ) : ""}
                  type={"number"}
                  handleKeyDownEvents={true}
                  handleDecimalDigits={true}
                  decimalValues={3}
                  setValue={setValue}
                  SetValue={(value) => {
                    handleInputChange("grossWeight", value);
                    clearErrors("grossWeight");
                    setMaxMcVaBasedOnSettings();
                  }}
                  optionId={"uomId"}
                  name={"uomId"}
                  options={UomOptions}
                  onDropDownChange={(value) => {
                    handleInputChange("uomId", value);
                  }}
                  selectedOption={formValues.uomId}
                  minError={"Gross weight should Greater than or equal to 0"}
                  maxError={"Gross Weight Less than or equal to " + props?.maxGrossWeight}
                  requiredMessage={"Gross weight is Required"}
                  message={errors.grossWeight && errors.grossWeight.message}
                  tabIndex={lastTabIndex}
                  ref={inputRefs}
                ></InputFieldWithDropdown>
                {maxGrossWeight !== "" ? <span>Available Gwt : {parseFloat(isUndefined(maxGrossWeight)).toFixed(3)}</span> : ""}
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
                  setValue={setValue}
                  gross_weight={formValues.grossWeight}
                  less_weight={formValues.lessWeight}
                  other_metal_weight={formValues.otherMetalWeight}
                  SetValue={(value) => handleInputChange("lessWeight", value)}
                  SetStnWeight={(value) => handleInputChange("stnWeight", value)}
                  SetDiaWeight={(value) => handleInputChange("diaWeight", value)}
                  SetStoneDetails={handleSetStoneDetails}
                  stone_details={formValues.stoneDetails}
                  ref={lessWeightRef}
                  stone={stone}
                  quality_code={quality_code}
                  readOnly={isStoneRestrict}
                  isDisabled={props?.isPartialSale === "1" ? true : false}
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
                  readOnly={isOtherMetalRestrict}
                  isDisabled={props?.isPartialSale === "1" ? true : false}
                ></OtherMetalWeightInputField>
              </Col>
            </Row>

            <Row className="form-group row g-4">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Dia/Stn Wt
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <InputGroupField
                  register={register}
                  placeholder1="Dia Weight"
                  inputId1="diaWeight"
                  value1={parseFloat(formValues.diaWeight).toFixed(3)}
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
                  value2={parseFloat(formValues.stnWeight).toFixed(3)}
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
                />
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Dia/Stn Amt
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <InputGroupField
                  register={register}
                  placeholder1="Dia Amt"
                  inputId1="diaAmount"
                  value1={parseFloat([...formValues.stoneDetails].reduce((sum, item) => (parseInt(item.stone_type) === 1 ) ?  parseFloat(sum) + parseFloat(item.stone_amount): parseFloat(sum), 0)).toFixed(2)}
                  isRequired={false}
                  minErrorInput1={"Dia greater than or equal to 0"}
                  messageInput1={errors.diaAmount && errors.diaAmount.message}
                  setValue1={setValue}
                  SetInputValue1={(value) => {
                    handleInputChange("diaAmount", value);
                    clearErrors("diaAmount");
                  }}
                  placeholder2="Stn Amt"
                  inputId2="stnAmount"
                  isRequired2={false}
                  value2={parseFloat([...formValues.stoneDetails].reduce((sum, item) => (parseInt(item.stone_type) === 3 || parseInt(item.stone_type) === 2 ) ?  parseFloat(sum) + parseFloat(item.stone_amount): parseFloat(sum), 0)).toFixed(2)}
                  setValue2={setValue}
                  minErrorInput2={"Amount should be greater than or equal to 0"}
                  maxErrorInput2={"Amount should be less than or equal to 100"}
                  reqValueErrorInput2={"Amount is required"}
                  messageInput2={errors.stnAmount && errors.stnAmount.message}
                  SetInputValue2={(value) => {
                    handleInputChange("stnAmount", value);
                    clearErrors("stnAmount");
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
                  setValue={setValue}
                  SetValue={(value) => handleInputChange("netWeight", value)}
                  minError="Net weight must be greater than 0"
                  reqValueError="Net weight is Required"
                  message={errors.netWeight && errors.netWeight.message}
                />
              </Col>
            </Row>
            { props?.lotItemDetails == undefined && (
              <>
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
                  isDisabled1={props?.isMcVaDisable}
                  placeholder1="%"
                  inputId1="wastagePercentage"
                  value1={formValues.wastagePercentage}
                  isRequiredInput1={false}
                  minInput1={formValues.settingsMinVa}
                  // minInput1={''}
                  maxInput1={100}
                  maxLength1={999}
                  handleKeyDownEvents1={true}
                  handleDecimalDigits={true}
                  decimalValues={2}
                  minErrorInput1={"VA should be greater than or equal to " + formValues.settingsMinVa}
                  maxErrorInput1={"VA Touch should be less than or equal to 100"}
                  reqValueErrorInput1={"VA is required"}
                  messageInput1={errors.wastagePercentage && errors.wastagePercentage.message}
                  setValue1={setValue}
                  SetInputValue1={(value) => {
                    handleInputChange("wastagePercentage", value);
                    clearErrors("wastagePercentage");
                  }}
                  placeholder2="Weight"
                  inputId2="wastageWeight"
                  isDisabled2={props?.isMcVaDisable}
                  isRequiredInput2={false}
                  value2={formValues.wastageWeight}
                  setValue2={setValue}
                  minErrorInput2={"Weight should be greater than or equal to 0"}
                  maxErrorInput2={"Weight should be less than or equal to 100"}
                  reqValueErrorInput2={"Weight is required"}
                  messageInput2={errors.wastageWeight && errors.wastageWeight.message}
                  SetInputValue2={(value) => {
                    handleInputChange("wastageWeight", value);
                    clearErrors("wastageWeight");
                  }}
                  tabIndex1={lastTabIndex}
                />
                {errors.wastagePercentage ? (
                  <span className="text-danger">{errors.wastagePercentage.message}</span>
                ) : (
                  ""
                )}
                {formValues.settingsMinVa!=='' && formValues.settingsMinVa!==0 ? <span className="text-warning">Min V.A(%) - {formValues.settingsMinVa}</span> :''}
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    MRP Rate{fixedRateCalc && <IsRequired />}
                  </label>
                </div>
              </Col>
              <Col lg="8">
                <NumberInputField
                  register={register}
                  placeholder="MRP Rate"
                  id={"sellRate"}
                  value={formValues.sellRate}
                  isRequired={fixedRateCalc}
                  readOnly={!fixedRateCalc}
                  min={fixedRateCalc ? 1 : 0}
                  handleKeyDownEvents={true}
                  handleDecimalDigits={true}
                  decimalValues={2}
                  setValue={setValue}
                  SetValue={(value) => {
                    handleInputChange("sellRate", value);
                    clearErrors("sellRate");
                  }}
                  minError={"MRP Rate should greater than 0"}
                  reqValueError={"MRP Rate is Required"}
                  message={errors.sellRate && errors.sellRate.message}
                  tabIndex={lastTabIndex}
                ></NumberInputField>
              </Col>
            </Row>
            </>
            )}
          </div>
        </Col>
       
        <Col md={4}>
          <div className="custom-grid">

          {
            ((props?.allowRetailerBilling===true) ? 
              <Row className="form-group row g-4">
                <Col md="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                      Touch/V.A {parseInt(props?.invoiceTo) === 2 && <IsRequired />}
                    </label>
                  </div>
                </Col>
                <Col lg="9">
                  <InputGroupField
                    register={register}
                    placeholder1="Touch"
                    inputId1="purchaseTouch"
                    value1={formValues.purchaseTouch}
                    isRequiredInput1={parseInt(props?.invoiceTo) === 2 ? true : false}
                    minInput1={parseInt(props?.invoiceTo) === 2 ? (formValues.settTouch > 1 ? formValues.settTouch: 1) : formValues.settTouch}
                    maxInput1={100}
                    maxLength1={999}
                    readOnly1={parseInt(props?.invoiceTo) === 1 ? true : false}
                    isDisabled1={parseInt(props?.invoiceTo) === 1 ? true : false}
                    handleKeyDownEvents1={true}
                    handleDecimalDigits={true}
                    decimalValues={2}
                    minErrorInput1={"Touch should be greater than or equal to 0"}
                    maxErrorInput1={"Touch should be less than or equal to 100"}
                    reqValueErrorInput1={"VA is required"}
                    messageInput1={errors.purchaseTouch && errors.purchaseTouch.message}
                    setValue1={setValue}
                    SetInputValue1={(value) => {
                      handleInputChange("purchaseTouch", value);
                      clearErrors("purchaseTouch");
                    }}
                    tabIndex1={lastTabIndex}
                    placeholder2="%"
                    inputId2="purchaseWastage"
                    value2={formValues.purchaseWastage}
                    minInput2={0}
                    maxInput2={100}
                    maxLength2={999}
                    setValue2={setValue}
                    isRequiredInput2={parseInt(props?.invoiceTo) === 2 ? true : false}
                    readOnly2={parseInt(props?.invoiceTo) === 1 ? true : false}
                    isDisabled2={parseInt(props?.invoiceTo) === 1 ? true : false}
                    handleKeyDownEvents2={true}
                    handleDecimalDigits2={true}
                    decimalValues2={2}
                    minErrorInput2={"VA should be greater than or equal to 0"}
                    maxErrorInput2={"VA should be less than or equal to 100"}
                    reqValueErrorInput2={"Weight is required"}
                    messageInput2={errors.purchaseWastage && errors.purchaseWastage.message}
                    SetInputValue2={(value) => {
                      handleInputChange("purchaseWastage", value);
                      clearErrors("purchaseWastage");
                    }}
                    tabIndex2={lastTabIndex}
                  />
                  {errors.purchaseTouch ? <span className="text-danger">{errors.purchaseTouch.message}</span> : ""}
                  {errors.purchaseWastage ? <span className="text-danger">{errors.purchaseWastage.message}</span> : ""}
                </Col>
              </Row> :'')
          }

          {
            ((props?.allowRetailerBilling===true) ? 
              <Row className="form-group row g-4">
              <Col md="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Pure Wt{parseInt(props?.invoiceTo) === 2 && <IsRequired />}
                  </label>
                </div>
              </Col>
              <Col lg="9">
                <InputFieldWithDropdown
                  register={register}
                  placeholder="Pure Weight"
                  id={"pureWeight"}
                  value={formValues.pureWeight}
                  isRequired={false}
                  min={0}
                  type={"number"}
                  readOnly={true}
                  isDisabled={parseInt(props?.invoiceTo) === 1 ? true : false}
                  optionId={"pureWeightCalType"}
                  name={"pureWeightCalType"}
                  options={PureCalcTypeOptions}
                  setValue={setValue}
                  onDropDownChange={(value) => {
                    handleInputChange("pureWeightCalType", value);
                  }}
                  selectedOption={formValues.pureWeightCalType}
                  SetValue={(value) => {
                    handleInputChange("pureWeight", value);
                    clearErrors("pureWeight");
                  }}
                  minError={"Rate should less than or equal to 0"}
                  maxError={"Rate should greater than or equal to 0"}
                  reqValueError={"Purchase Rate is Required"}
                  message={errors.pureWeight && errors.pureWeight.message}
                  tabIndex={lastTabIndex}
                ></InputFieldWithDropdown>
              </Col>
            </Row> :'')
          }
            
            
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
                  isDisabled={props?.isMcVaDisable}
                  isSelectDisabled={props?.isMcVaDisable}
                  register={register}
                  placeholder="MC"
                  id={"mcValue"}
                  value={formValues.mcValue}
                  isRequired={true}
                  min={formValues.settingsMinMc}
                  type={"number"}
                  SetValue={(value) => {
                    handleInputChange("mcValue", value);
                    clearErrors("mcValue");
                  }}
                  optionId={"mcType"}
                  name={"mcType"}
                  options={mcTypeOptions}
                  setValue={setValue}
                  onDropDownChange={(value) => {
                    handleInputChange("mcType", value);
                  }}
                  selectedOption={formValues.mcType}
                  minError={"MC should greater than or equal to " + formValues.settingsMinMc}
                  maxError={"MC should less than or equal to 0"}
                  reqValueError={"Purchase MC is Required"}
                  message={errors.mcValue && errors.mcValue.message}
                  tabIndex={lastTabIndex}
                ></InputFieldWithDropdown>
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col md="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Charges
                  </label>
                </div>
              </Col>
              <Col lg="9">
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
                  SetOtherChargesDetails={handleSetOtherChargesDetails}
                  otherChargesDetails={formValues.otherChargesDetails}
                  ref={otherChargesRef}
                  tabIndex={lastTabIndex}
                ></OtherChargesForm>
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
                  min={formValues.settFlatMcMin}
                  setValue={setValue}
                  SetValue={(value) => {
                    handleInputChange("flatMcValue", value);
                    clearErrors("flatMcValue");
                  }}
                  minError={"Flat Mc Should greater than or equal to "+formValues.settFlatMcMin}
                  reqValueError={"Flat Mc is Required"}
                  message={errors.flatMcValue && errors.flatMcValue.message}
                  tabIndex={lastTabIndex}
                ></NumberInputField>
              </Col>
            </Row>

              { props?.lotItemDetails != undefined && (
              <>
              <Row className="form-group row g-4">
              <Col md="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Wastage
                  </label>
                </div>
              </Col>
              <Col lg="9">
                <InputGroupField
                  register={register}
                  isDisabled1={props?.isMcVaDisable}
                  placeholder1="%"
                  inputId1="wastagePercentage"
                  value1={formValues.wastagePercentage}
                  isRequiredInput1={false}
                  minInput1={formValues.settingsMinVa}
                  // minInput1={''}
                  maxInput1={100}
                  maxLength1={999}
                  handleKeyDownEvents1={true}
                  handleDecimalDigits={true}
                  decimalValues={2}
                  minErrorInput1={"VA should be greater than or equal to " + formValues.settingsMinVa}
                  maxErrorInput1={"VA Touch should be less than or equal to 100"}
                  reqValueErrorInput1={"VA is required"}
                  messageInput1={errors.wastagePercentage && errors.wastagePercentage.message}
                  setValue1={setValue}
                  SetInputValue1={(value) => {
                    handleInputChange("wastagePercentage", value);
                    clearErrors("wastagePercentage");
                  }}
                  placeholder2="Weight"
                  inputId2="wastageWeight"
                  isDisabled2={props?.isMcVaDisable}
                  isRequiredInput2={false}
                  value2={formValues.wastageWeight}
                  setValue2={setValue}
                  minErrorInput2={"Weight should be greater than or equal to 0"}
                  maxErrorInput2={"Weight should be less than or equal to 100"}
                  reqValueErrorInput2={"Weight is required"}
                  messageInput2={errors.wastageWeight && errors.wastageWeight.message}
                  SetInputValue2={(value) => {
                    handleInputChange("wastageWeight", value);
                    clearErrors("wastageWeight");
                  }}
                  tabIndex1={lastTabIndex}
                />
                {errors.wastagePercentage ? (
                  <span className="text-danger">{errors.wastagePercentage.message}</span>
                ) : (
                  ""
                )}
                {formValues.settingsMinVa!=='' && formValues.settingsMinVa!==0 ? <span className="text-warning">Min V.A(%) - {formValues.settingsMinVa}</span> :''}
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col md="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    MRP Rate{fixedRateCalc && <IsRequired />}
                  </label>
                </div>
              </Col>
              <Col lg="9">
                <NumberInputField
                  register={register}
                  placeholder="MRP Rate"
                  id={"sellRate"}
                  value={formValues.sellRate}
                  isRequired={fixedRateCalc}
                  readOnly={!fixedRateCalc}
                  min={fixedRateCalc ? 1 : 0}
                  handleKeyDownEvents={true}
                  handleDecimalDigits={true}
                  decimalValues={2}
                  setValue={setValue}
                  SetValue={(value) => {
                    handleInputChange("sellRate", value);
                    clearErrors("sellRate");
                  }}
                  minError={"MRP Rate should greater than 0"}
                  reqValueError={"MRP Rate is Required"}
                  message={errors.sellRate && errors.sellRate.message}
                  tabIndex={lastTabIndex}
                ></NumberInputField>
              </Col>
            </Row>
              </>)}
            { props?.lotItemDetails == undefined && (
              <>
            <Row className="form-group row g-4">
              <Col md="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Rate
                  </label>
                </div>
              </Col>
              <Col lg="9">
                <NumberInputField
                  register={register}
                  placeholder="Rate"
                  id={"ratePerGram"}
                  value={formValues.ratePerGram}
                  isRequired={false}
                  min={0}
                  readOnly
                  setValue={setValue}
                  SetValue={(value) => {
                    handleInputChange("ratePerGram", value);
                    clearErrors("ratePerGram");
                  }}
                  minError={"Rate Should greater than or equal to 0"}
                  reqValueError={"Rate is Required"}
                  message={errors.ratePerGram && errors.ratePerGram.message}
                  tabIndex={lastTabIndex}
                ></NumberInputField>
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col md="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Taxable
                  </label>
                </div>
              </Col>
              <Col lg="9">
                <NumberInputField
                  register={register}
                  placeholder="Taxable Cost"
                  id={"taxableAmount"}
                  value={formValues.taxableAmount}
                  isRequired={false}
                  min={0}
                  readOnly
                  setValue={setValue}
                  SetValue={(value) => handleInputChange("taxableAmount", value)}
                  minError={"Cost Should greater than 0"}
                  message={errors.taxableAmount && errors.taxableAmount.message}
                ></NumberInputField>
              </Col>
            </Row>
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
            <Row className="form-group row g-4" style={{ display: "none" }}>
              <Col md="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Disc
                  </label>
                </div>
              </Col>
              <Col lg="9">
                <NumberInputField
                  register={register}
                  placeholder="Discount"
                  id={"discountAmount"}
                  value={formValues.discountAmount}
                  isRequired={false}
                  min={0}
                  readOnly
                  setValue={setValue}
                  minError={"Discount Should greater than 0"}
                  message={errors.discountAmount && errors.discountAmount.message}
                  tabIndex={lastTabIndex}
                ></NumberInputField>
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col md="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Item Cost
                  </label>
                </div>
              </Col>
              <Col lg="9">
                <NumberInputField
                  register={register}
                  placeholder="Item Cost"
                  id={"itemCost"}
                  value={formValues.itemCost}
                  isRequired={false}
                  min={0}
                  readOnly
                  setValue={setValue}
                  SetValue={(value) => handleInputChange("itemCost", value)}
                  minError={"Cost Should greater than 0"}
                  message={errors.itemCost && errors.itemCost.message}
                ></NumberInputField>
              </Col>
            </Row>
            </>
            )}

            {props.hasOwnProperty("isRemarksReq") && props?.isRemarksReq && (
              <Row className="form-group row g-4">
                <Col md="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                      Remarks
                    </label>
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
                    value={formValues.remarks}
                    defaultValue={formValues.remarks || ""}
                    onChange={(e) => handleInputChange("remarks", e.target.value)}
                    tabIndex={lastTabIndex}
                  />
                  </div>
                </Col>
              </Row>
            )}
          </div>
        </Col>
      </Row>

      <AttributeModalForm
        isOpen={isModalOpen}
        toggle={toggleModal}
        onSave={handleAttributeDetails}
        initialAttribute={formValues.attributeDetails}
      />
      <EmployeeModal
        modal={employeeModal}
        toggle={toggleEmployeeModal}
        employees = {employees}
        data = {formValues}
        setData = {(lable,value)=>{
          handleInputChange(lable,value);
        }}
      />
    </FormProvider>
  );
});

export default SalesForm;
