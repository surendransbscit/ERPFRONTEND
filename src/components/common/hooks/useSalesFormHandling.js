import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import {
  calculateNetWeight,
  calculateOtherMetalAmount,
  calculatePurchaseCost,
  calculatePureWeight,
  calculateSalesItemCost,
  calculateWastageWeight,
  getRatePerGram,
  isUndefined
} from "../../../components/common/calculations/ErpCalculations";
import {
  useCategories,
  useCurrentMetalRate,
  useDesigns,
  useMetalPurityRate,
  useProducts,
  useProductSections,
  usePurities,
  useSubDesigns,
  useTaxGroup,
  useUom,
  useSize,
  useMcVaSetiings,
  useDiamondRate,
  useCatPurityRate,
  useEmployeeDropdown
} from "../../filters/filterHooks";
import { useForm } from "react-hook-form";
import { toastfunc } from "../../sds-toast-style/toast-style";

const useSalesFormHandling = (props,actualGrossWeight) => {
  const { setValue } = useForm();
  const { userInfo: { settings } } = useSelector((state) => state.authUserReducer);
  const { accessBranches } = useSelector((state) => state.coreCompReducer);
  const { searchCustomerList } = useSelector((state) => state?.customerReducer);
  const { categories } = useCategories();
  const { purities } = usePurities();
  const { products } = useProducts();
  const { designs } = useDesigns();
  const { subDesigns } = useSubDesigns();
  const { size } = useSize();
  const { uom } = useUom();
  const { mcVaSetiings } = useMcVaSetiings();
  const {sections} = useProductSections();
  const {diamondRate} = useDiamondRate();
  const { employees } = useEmployeeDropdown();
  const inputRefs = useRef(null); // Store references to input fields
  const [lastTabIndex,setLastTabIndex]  = useState(props?.tabIndex);

  let UomOptions = [];
  if (uom.length > 0) {
    UomOptions = uom.map((val) => ({
      value: val.uom_id,
      label: val.uom_name,
      isDefault: val.is_default,
      divided_by_value: val.divided_by_value,
    }));
  }

  const initialState = {
    selected: "",
    selectedCategory: "",
    selectedPurity: "",
    selectedProduct: "",
    selectedDesign: "",
    selectedSubDesign: "",
    selectedSection:"",
    selectedSize:"",
    idLotInwardDetail:"",
    huId1:"",
    huId2:"",
    piece: 1,
    uomId: 1,
    grossWeight: 0,
    lessWeight: 0,
    stnWeight: 0,
    diaWeight: 0,
    netWeight: 0,
    sellRate:0,
    otherMetalWeight:0.000,
    wastagePercentage: 0,
    wastageWeight: 0,
    purchaseTouch: 0,
    purchaseWastage: 0,
    pureWeightCalType:2,
    pureWeight:0.000,
    purchaseMcType:1,
    purchaseRate:0,
    purchaseRateType:1,
    purchaseMc:0,
    purchaseCost:0,
    mcValue: 0,
    totalMcValue : 0,
    flatMcValue: 0,
    mcType: 1,
    ratePerGram: 0,
    taxableAmount: 0,
    otherChargesAmount:0.00,
    tax_id: 0,
    taxType: "",
    taxPercentage: 0,
    taxAmount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    discountAmount: 0,
    itemCost: 0,
    productCalculationType: "",
    editIndex: "",
    stoneDetails: [],
    otherMetalDetails: [],
    otherChargesDetails: [],
    attributeDetails:[],
    tagId:"",
    tagCode:"",
    est_item_id:"",
    detail_id:"",
    rate_type:1, //1-Current Rate , 2- Order Rate
    settingsMcType : '',
    settingsMinVa : '',
    settingsMinMc : '',
    settingsMaxVa : '',
    settingsMaxMc : '',
    settVaType : '',
    settFlatMcMin : '',
    settFlatMcMax : '',
    settTouch : '',
    wastage_calc_type : '',
    remarks:"",
    subEmployee1:"",
    subEmployee2:"",
    employee:"",
    setMrpSalesRateType :'' ,
    settingsSellRate:0,
    lotInwardDetail:{},
    mrpMarginAmount : 0,
  };

  const [formValues, setFormValues] = useState(initialState);
  const [isMrpItem, setIsMrpItem] = useState(false);
  const [isSizeReq, setIsSizeReq] = useState(false);
  const [fixedRateCalc, setFixedRateItem] = useState(false);
  const [customerType, setCustomerType] = useState("1");
  const [formData, setFormData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const lessWeightRef = useRef();
  const otherMetalWeightRef = useRef();
  const otherChargesRef = useRef();
  const attributeRef = useRef();
  const { metalRates } = useCurrentMetalRate();
  const { metalPurityRate } = useMetalPurityRate();
  const { catPurityRate } = useCatPurityRate();
  const { taxGroup } = useTaxGroup();
  
  useEffect(() => {
    if (props.initialState?.selectedProduct) {
      setFormValues(props?.initialState);
    }
  }, [props.initialState]);

  useEffect(() => {
   if(props.customerType){
    setCustomerType(props.customerType);
   }
  }, [props?.customerType]);

  useEffect(() => {
    const net_weight = calculateNetWeight({
      gross_weight: formValues.grossWeight,
      less_weight: formValues.lessWeight,
      other_metal_weight: formValues.otherMetalWeight,
    });

    if (parseFloat(net_weight) < 0) {
        toastfunc("Net Weight Should Not Be Less Than Zero");
    } else {
        if (net_weight !== formValues.netWeight) {
            setFormValues((prevValues) => ({
                ...prevValues,
                netWeight: net_weight,
            }));
            setValue("netWeight", net_weight);
        }
    }
}, [
    setValue,
    formValues.grossWeight, 
    formValues.lessWeight,
    formValues.otherMetalWeight,
    formValues.netWeight,
]);

  useEffect(() => {
    if(formValues.purchaseTouch!=='' && formValues.purchaseTouch!==0 && formValues.purchaseWastage!==0 && formValues.netWeight!==0)
    {
      const pureWeight = calculatePureWeight({
        netWeight: formValues.netWeight,
        purchaseTouch: formValues.purchaseTouch,
        pureCalcType: formValues.pureWeightCalType,
        purchaseWastage:formValues.purchaseWastage
      });
      setFormValues(prevValues => ({
        ...prevValues,
        pureWeight: pureWeight,
      }));  
    }
    
  }, [formValues.purchaseTouch,formValues.purchaseWastage, formValues.netWeight,formValues.pureWeightCalType]);


  useEffect(() => {
    const productDetails = products.find((prod) => prod.pro_id === formValues.selectedProduct);
    if (productDetails) {
      const calculation_based_on = productDetails.calculation_based_on;
      const wastage_calc_type = ( isUndefined(formValues.settVaType) ? isUndefined(formValues.settVaType):isUndefined(productDetails.wastage_calc_type));

      if (productDetails) {
        const calculated_weight = calculateWastageWeight({
          grossWeight: formValues.grossWeight,
          netWeight: formValues.netWeight,
          wastagePercentage: formValues.wastagePercentage,
          calculationType : wastage_calc_type
        });
        setFormValues((prevValues) => ({
          ...prevValues,
          wastageWeight: calculated_weight,
          wastage_calc_type:wastage_calc_type,
        }));
      }
      if(productDetails.sales_mode==="1"){
        setFixedRateItem(false);
      }else{
        setFixedRateItem(true);
      }     
      
      if (parseInt(productDetails.fixed_rate_type) === 2 && parseInt(productDetails.sales_mode)===0) {
        setIsMrpItem(true);
        formValues.grossWeight = 0;
      } else {
        setIsMrpItem(false);
      }
      if(parseInt(productDetails.has_size)===1){
        setIsSizeReq(true);
      }else{
        setIsSizeReq(false);
      }
      

    }
  }, [
    products,
    formValues.selectedProduct,
    formValues.grossWeight,
    formValues.netWeight,
    formValues.wastagePercentage,
  ]);

  //Calculate Purchase Cost
  
  useEffect(() => {
    if(formValues.pureWeight!==0 && formValues.purchaseRate!==0 && formValues.purchaseRate!=='' && formValues.purchaseRate!==null){
      const purchaseCost = calculatePurchaseCost({
        pureWeight: formValues.pureWeight,
        purchaseMcType: formValues.purchaseMcType,
        purchaseMc: formValues.purchaseMc,
        purchaseRate:formValues.purchaseRate,
        netWeight:formValues.netWeight,
        piece:formValues.piece,
        rateCalcType:formValues.purchaseRateType
      });
      setFormValues(prevValues => ({
        ...prevValues,
        purchaseCost: purchaseCost,
      }));
    }
   
  }, [formValues.piece,formValues.netWeight,formValues.pureWeight,formValues.purchaseMcType,formValues.purchaseMc,formValues.purchaseRate,formValues.purchaseRateType]);

  //Calculate Purchase Cost



  //Calculating Item Cost
  useEffect(() => {
    let ratePerGram = 0;
    const productDetails = products?.find((prod) => prod.pro_id === formValues.selectedProduct);
    if (productDetails) {
      let otherMetalAmount = 0;
      const calculation_based_on = productDetails.calculation_based_on;
      const taxType = productDetails.tax_type;
      const tax_id = productDetails.tax_id;
      const taxPercentage = productDetails.tax_percentage;
      let mrpMarginAmount = 0;
      ratePerGram = getRatePerGram(categories,metalPurityRate,metalRates,formValues.selectedCategory,formValues.selectedPurity,catPurityRate,settings)
      ratePerGram = (formValues?.rate_type && formValues?.rate_type===2 ? (parseFloat(formValues.ratePerGram) > 0 ? formValues.ratePerGram :ratePerGram) :ratePerGram);

      if(formValues?.otherMetalDetails?.length>0)
      {
          formValues?.otherMetalDetails?.forEach(item => {
            let otherMetalItemCost = calculateOtherMetalAmount({
              "weight": item.weight,
              "piece": item.piece,
              "rate": item.ratePerGram,
              "wastage_weight":item.wastageWeight,
              "rate_calc_type": item.calc_type,
              "mcType":item.mcType,
              "mcValue":item.mcValue,
            });
            otherMetalAmount+=parseFloat(otherMetalItemCost)
          });
      }
      

      const stoneAmount = [...formValues.stoneDetails].reduce((sum, item) => parseFloat(sum) + parseFloat(item.stone_amount), 0);
      let otherMetalWeight = [...formValues.otherMetalDetails].reduce((sum, item) => parseFloat(sum) + parseFloat(item.weight), 0);
      const otherChargesAmount = [...formValues.otherChargesDetails].reduce((sum, item) => parseFloat(sum) + parseFloat(item.amount), 0);
      let selectedCustomer = {};
      if(props?.customerSearch){
          selectedCustomer = searchCustomerList.find((val)=>val.id_customer ===props?.customerSearch[0]['id_customer'])
      }

      if(formValues.settingsSellRate > 0){
            if(parseInt(formValues.setMrpSalesRateType) == 2){ // if setMrpSalesRateType is 2 means need add percentage for mrp item . percentage is taken from customer mc va ssettings (sales_rate_type)
                mrpMarginAmount = (parseFloat(parseFloat(formValues.sellRate) * parseFloat(formValues.settingsSellRate)) / 100);

            }
        }
      const itemCostDetails = calculateSalesItemCost({
        piece :formValues.piece,
        grossWeight: formValues.grossWeight,
        netWeight: formValues.netWeight,
        wastageWeight: formValues.wastageWeight,
        pureWeight:formValues.pureWeight,
        mcType: formValues.mcType,
        mcValue: formValues.mcValue,
        flatMcValue: formValues.flatMcValue,
        taxType: taxType,
        taxPercentage: taxPercentage,
        productDetails: productDetails,
        ratePerGram: ratePerGram,
        stoneAmount:stoneAmount,
        otherMetalAmount:otherMetalAmount,
        otherChargesAmount:otherChargesAmount,
        sellRate:formValues.sellRate,
        mrpMarginAmount:mrpMarginAmount,
        invoiceTo:props?.invoiceTo,
        settingsMcType:formValues.settingsMcType,
        setMrpSalesRateType : formValues.setMrpSalesRateType,
        settingsSellRate : formValues.settingsSellRate,
        settingsBillingType:props?.settingsBillingType,
        deliveryLocation:props?.deliveryLocation,
        customerSearch:props?.customerSearch,
        idBranch:props?.idBranch,
        accessBranches:accessBranches,
        selectedCustomer:selectedCustomer,
      });
      const updatedValues = {
        taxPercentage: taxPercentage,
        taxType: taxType,
        tax_id: tax_id,
        otherChargesAmount:otherChargesAmount,
        otherMetalWeight:otherMetalWeight,
        productCalculationType: calculation_based_on,
        itemCost: itemCostDetails.item_cost,
        taxAmount: itemCostDetails.taxAmount,
        totalMcValue:itemCostDetails.total_mc_value,
        discountAmount:itemCostDetails.discount_amount,
        ratePerGram: ratePerGram,
        taxableAmount: itemCostDetails.taxable_amount,
        cgst: itemCostDetails.cgst,
        sgst: itemCostDetails.sgst,
        igst: itemCostDetails.igst,
        mrpMarginAmount : mrpMarginAmount,
        productName: productDetails.product_name,
      };

      setFormValues((prevValues) => ({
        ...prevValues,
        ...updatedValues,
      }));
      setValue("ratePerGram", ratePerGram);
      setValue("itemCost", itemCostDetails.item_cost);
      setValue("netWeight", formValues.netWeight);
      setValue("otherMetalWeight",otherMetalWeight);
      setValue("mrpMarginAmount",mrpMarginAmount);
    }
  }, [
    setValue,
    formValues.selectedProduct,
    formValues.selectedCategory,
    formValues.selectedPurity,
    metalPurityRate,
    metalRates,
    formValues.piece,
    formValues.grossWeight,
    formValues.netWeight,
    formValues.wastagePercentage,
    formValues.wastageWeight,
    categories,
    products,
    taxGroup,
    formValues.mcType,
    formValues.mcValue,
    formValues.otherChargesAmount,
    formValues.otherChargesDetails,
    formValues.otherMetalDetails,
    formValues.stoneDetails,
    formValues.sellRate,
    props?.invoiceTo,
    formValues.pureWeight,
    formValues.flatMcValue,
    props?.deliveryLocation,
  ]);

  //Calculating Item Cost

  // Validate Mc Va Based on Settings

  useEffect(() => {
    setMaxMcVaBasedOnSettings()
  }, [
    setValue,
    formValues.grossWeight,
    formValues.selectedDesign,
    formValues.selectedSubDesign,
  ]);

  useEffect(() => {
    validateMcVaSettings()
  }, [
    formValues.purchaseTouch,
    formValues.flatMcValue,
    formValues.mcValue,
    formValues.wastagePercentage,
  ]);
  // Validate Mc Va Based on Settings

  const setMaxMcVaBasedOnSettings= ( ) => {
    if (mcVaSetiings) {
      let idKarigar = props.initialState?.supplier
      let customerDetails =    props?.customerDetails
      let isRetailer = customerDetails?.is_retailer
      let profileType = customerDetails?.profile_type
      if(mcVaSetiings?.retail || mcVaSetiings?.customer){
        let mc_va_setting = '';
        let settMinMc = ''
        let settMinVa = ''
        let settMaxMc = ''
        let settMaxVa = ''
        let settVaType = ''
        let settMcType = ''
        let settFlatMcMin = ''
        let settFlatMcMax = ''
        let settTouch = ''
        let setMrpSalesRateType = ''
        let settingsSellRate = 0
        if(isRetailer == '1'){
          mc_va_setting = mcVaSetiings?.retail.find((sett) =>{  return sett.purity === formValues.selectedPurity && sett.supplier.includes(parseInt(idKarigar)) && sett.id_product === formValues.selectedProduct && sett.id_design === formValues.selectedDesign && ( settings?.is_sub_design_req == 1 ?  sett.id_sub_design === formValues.selectedSubDesign : true) && (sett.id_weight_range != null ? parseFloat(sett.from_weight) <= parseFloat(formValues.grossWeight) && parseFloat(sett.to_weight) >= parseFloat(formValues.grossWeight) : true)});
          if (mc_va_setting) {
            if(profileType == 1){ // RETAIL
              settMinMc = mc_va_setting.retail_mc
              settMinVa = mc_va_setting.retail_va
              settMcType = parseInt(mc_va_setting.retail_mc_type)
              settVaType = mc_va_setting.retail_va_type
              settTouch = mc_va_setting.retail_touch
              settFlatMcMax = mc_va_setting.retail_flat_mc
            }else if(profileType == 2){// VIP RETAIL
              settMinMc = mc_va_setting.vip_retail_mc
              settMinVa = mc_va_setting.vip_retail_va
              settMcType = parseInt(mc_va_setting.vip_retail_mc_type)
              settVaType = mc_va_setting.vip_retail_va_type
              settTouch = mc_va_setting.vip_retail_touch
              settFlatMcMax = mc_va_setting.retail_flat_mc
            }
            // handleInputChange("purchaseTouch",settTouch)
            // handleInputChange("wastagePercentage",settMaxVa)
            // handleInputChange("mcValue",settMaxMc)
            // handleInputChange("flatMcValue",settFlatMc)
          }
        }else{
          mc_va_setting = mcVaSetiings?.customer.find((sett) =>sett.purity === formValues.selectedPurity  && sett.id_product === formValues.selectedProduct && sett.id_design === formValues.selectedDesign && ( settings?.is_sub_design_req == 1 ?  sett.id_sub_design === formValues.selectedSubDesign : true) && (sett.id_weight_range != null ? parseFloat(sett.from_weight) <= parseFloat(formValues.grossWeight) && parseFloat(sett.to_weight) >= parseFloat(formValues.grossWeight) : true));
          if (mc_va_setting) {
            settMinMc = mc_va_setting.min_mc_value
            settMinVa = mc_va_setting.min_va_value
            settMaxMc = mc_va_setting.max_mc_value
            settMaxVa = mc_va_setting.max_va_value
            settVaType = mc_va_setting.va_type
            settMcType = parseInt(mc_va_setting.mc_type)
            setMrpSalesRateType = mc_va_setting.sales_rate_type
            settingsSellRate = mc_va_setting.sales_rate
            settFlatMcMax = mc_va_setting.flat_mc_max
            settFlatMcMin = mc_va_setting.flat_mc_min
          }
        }
  
        if (mc_va_setting) {
  
          handleInputChange('settingsMinVa',settMinVa)
          handleInputChange('settingsMinMc',settMinMc)
          handleInputChange('settingsMaxVa',settMaxVa)
          handleInputChange('settingsMaxMc',settMaxMc)
          handleInputChange('settingsMcType',settMcType)
          handleInputChange('settVaType',settVaType)
          handleInputChange('settFlatMcMin',settFlatMcMin)
          handleInputChange('settFlatMcMax',settFlatMcMax)
          handleInputChange('settTouch',settTouch)
          handleInputChange("purchaseTouch",settTouch)
          handleInputChange("wastagePercentage",settMaxVa)
          handleInputChange("mcValue",settMaxMc)
          handleInputChange("flatMcValue",settFlatMcMax)
          handleInputChange('setMrpSalesRateType',setMrpSalesRateType)
          handleInputChange('settingsSellRate',settingsSellRate)

          
        }else{
          handleInputChange('settingsMinVa',0)
          handleInputChange('settingsMinMc',0)
          handleInputChange('settingsMaxVa',100)
          handleInputChange('settingsMaxMc','')
          handleInputChange('settingsMcType','')
          handleInputChange('settVaType','')
          handleInputChange('settFlatMcMin','')
          handleInputChange('settFlatMcMax','')
          handleInputChange('settTouch','')
          handleInputChange("purchaseTouch",0)
          handleInputChange("wastagePercentage",0)
          handleInputChange("mcValue",0)
          handleInputChange("flatMcValue",0)
          handleInputChange("settingsSellRate",0)
          handleInputChange("setMrpSalesRateType",'')
    
        }
        
      }

    }else{
      handleInputChange('settingsMinVa',0)
      handleInputChange('settingsMinMc',0)
      handleInputChange('settingsMaxVa',100)
      handleInputChange('settingsMaxMc','')
      handleInputChange('settingsMcType','')
      handleInputChange('settVaType','')
      handleInputChange('settFlatMcMin','')
      handleInputChange('settFlatMcMax','')
      handleInputChange('settTouch','')

    }
  };

  const validateMcVaSettings= () => {
    if(parseFloat(formValues.settFlatMcMin) > parseFloat(formValues.flatMcValue) ){
      toastfunc("Flat Mc Should be Greater than "+formValues.settFlatMcMin)
     // handleInputChange("flatMcValue",formValues.settFlatMc)
      return false;

    }  
    
    if(parseFloat(formValues.settingsMinMc) > parseFloat(formValues.mcValue) ){
      toastfunc("Mc Should be Greater than "+formValues.settingsMinMc)
     // handleInputChange("mcValue",formValues.settingsMaxMc)
      return false;

    }
   
      if(parseFloat(formValues.settingsMinVa) > parseFloat(formValues.wastagePercentage)){
        toastfunc("Wastage Should be Greater than "+formValues.settingsMinVa)
      //  handleInputChange("wastagePercentage",formValues.settingsMinVa)
        return false;
      }
   
      if(parseFloat(formValues.settTouch) > parseFloat(formValues.purchaseTouch)){
        toastfunc("Touch Should be Greater than "+formValues.settTouch)
       // handleInputChange("purchaseTouch",formValues.settTouch)
        return false;
      }
      return true;
  }

  //Handling Form Input fields
  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
    setLastTabIndex(lastTabIndex+1);
  };

  const handleSetStoneDetails = (data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      stoneDetails: data,
    }));
  };

  const handleSetOtherMetalDetails = (data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      otherMetalDetails: data,
    }));
  };

  const handleSetOtherChargesDetails = (data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      otherChargesDetails: data,
    }));
  };


  const handleAttributeDetails = (data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      attributeDetails: data,
    }));
  };

  const resetForm = (type =1) => {
    let productId = formValues.selectedProduct;
    let purityId = formValues.selectedPurity;
    let catId = formValues.selectedCategory;
    let idLotInwardDetailId = formValues.idLotInwardDetail;
    let sectionId = formValues.selectedSection;
    let designId =formValues.selectedDesign;
    let subDesignId =formValues.selectedSubDesign;
    let sizeId = formValues.selectedSize;
    setFormValues(initialState);

    if(props?.isTagging && type === 1){
      initialState.selectedProduct = productId;
      initialState.idLotInwardDetail = idLotInwardDetailId;
      initialState.selectedPurity = purityId;
      initialState.selectedCategory = catId;
      initialState.selectedSection = sectionId;
      initialState.selectedDesign = designId;
      initialState.selectedSubDesign = subDesignId;
      initialState.selectedSize = sizeId;

      if(inputRefs.current && productId != '' && productId != null){
        inputRefs.current.focus();
      }
    }
    if (lessWeightRef.current) {
      lessWeightRef.current.resetForm();
    }
    if (otherMetalWeightRef.current) {
      otherMetalWeightRef.current.resetForm();
    }
    if (otherChargesRef.current) {
      otherChargesRef.current.resetForm();
    }
    
  };

 
  const handleEdit = (index) => {
    //const item = formData[index];
    setFormValues({ ...formData[index], editIndex: index });
    //handleSetStoneDetails(item.stoneDetails);
    setEditIndex(index);
  };


  const handleDelete = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
  };

  const resetPurity = () => setFormValues((prevValues) => ({ ...prevValues, selectedPurity: null }));
  const resetProduct = () => setFormValues((prevValues) => ({ ...prevValues, selectedProduct: null }));
  const resetDesign = () => setFormValues((prevValues) => ({ ...prevValues, selectedDesign: null }));
  const resetSubDesign = () => setFormValues((prevValues) => ({ ...prevValues, selectedSubDesign: null }));


  const mcTypeOptions = [
    { label: "Per Gram", value: 1, isDefault: true },
    { label: "Per Piece", value: 2 },
  ];
  const PureCalcTypeOptions = [{'label':'Touch+VA','value':2,'isDefault':true},{'label':'Weight+VA','value':1},{'label':'Wt * VA %','value':3}];

  
  return {
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
    formData,
    editIndex,
    lessWeightRef,
    otherMetalWeightRef,
    attributeRef,
    handleInputChange,
    handleSetStoneDetails,
    handleSetOtherMetalDetails,
    handleSetOtherChargesDetails,
    handleAttributeDetails,
    resetForm,
    handleEdit,
    handleDelete,
    resetPurity,
    resetProduct,
    resetDesign,
    resetSubDesign,
    mcTypeOptions,
    PureCalcTypeOptions,
    initialState,
    isMrpItem,
    fixedRateCalc,
    lastTabIndex,
    setMaxMcVaBasedOnSettings,
    diamondRate,
    validateMcVaSettings,
    employees,
    isSizeReq,
    inputRefs
  };
};

export default useSalesFormHandling;
