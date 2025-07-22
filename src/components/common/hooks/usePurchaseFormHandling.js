import { useState, useEffect, useRef } from 'react';
import { calculatePurchaseItemCost, calculatePurchaseNetWeight, isUndefined } from '../../../components/common/calculations/ErpCalculations';
import { useCurrentMetalRate, useMetalPurityRate } from '../../filters/filterHooks';
import { toastfunc } from '../../sds-toast-style/toast-style';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const usePurchaseFormHandling = ( categories,products,oldMetalItems,old_metal_calculation,isOldMetalReq,isOldMetalCostEditable,dust_wt_auto_calculate,props) => {
const initialState = {
    selectedCategory: '',
    selectedPurity: '',
    selectedProduct: '',
    selectedOldMetalItem:'',
    touch:'92',
    piece:1,
    uomId:1,
    grossWeight:0.000,
    lessWeight:0.000,
    stnWeight:0.000,
    diaWeight:0.00,
    dustWeight:0.000,
    netWeight:0.00,
    wastagePercentage:0,
    wastageWeight:0,
    pureWeight:0.000,
    ratePerGram:0,
    customerRate:0,
    itemCost:0,
    editIndex:'',
    stoneDetails: [],
    est_old_metal_item_id:''
    };
    const { setValue } = useForm();
  const [formValues, setFormValues] = useState(initialState);
  const lessWeightRef = useRef();
  const {metalRates} = useCurrentMetalRate();
  const { catPurityRateList } = useSelector(
    (state) => state.metalPurityRateReducer
  );

  const {metalPurityRate} = useMetalPurityRate();

  const [lastTabIndex,setLastTabIndex]  = useState(props?.tabIndex);
  const {
    userInfo,
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  useEffect(() => {
    if (props.initialState?.selectedProduct) {
      setFormValues(props?.initialState);
    }
  }, [props.initialState]);

  useEffect(() => {
    if(parseFloat(formValues.dustWeight)>parseFloat(formValues.grossWeight)){
      toastfunc("Dust Weight is Greater than the gross Weight");
      setFormValues(prevValues => ({
        ...prevValues,
        dustWeight: 0,
      }));
    }
    const net_weight = calculatePurchaseNetWeight({
      gross_weight: formValues.grossWeight,
      less_weight: formValues.lessWeight,
      dustWeight: formValues.dustWeight,
      wastageWeight:formValues.wastageWeight
    });
    setFormValues(prevValues => ({
      ...prevValues,
      netWeight: net_weight,
    }));
  }, [formValues.dustWeight,formValues.grossWeight, formValues.lessWeight,formValues.wastagePercentage,formValues.wastageWeight]);


  // useEffect(()=>{
  //     if(parseFloat(formValues.itemCost) > 0 && (!isOldMetalCostEditable)){
  //         let rate = parseFloat(parseFloat(formValues.itemCost)/parseFloat(formValues.netWeight)).toFixed(2);
  //         setFormValues(prevValues => ({
  //           ...prevValues,
  //           ratePerGram: rate,
  //         }));  
  //     }
  // },[formValues.itemCost])

  //Calculating Item Cost
  useEffect(() => {
    const productDetails        = products.find((prod)=>prod.pro_id===formValues.selectedProduct)
    if(productDetails && formValues.est_old_metal_item_id == ''){ 
      let old_metal_item = oldMetalItems.find((val)=>val.id_item_type===formValues.selectedOldMetalItem)
      if(old_metal_item?.touch){
        formValues.touch = old_metal_item?.touch;
      }
      if(settings?.metal_rate_type == 1){
        const rateDetails = catPurityRateList?.find((val) => val.category == productDetails.cat_id);
        let ratePerGram = isNaN(rateDetails?.rate_per_gram) ? 0 : rateDetails?.rate_per_gram  ;
        console.log("ratePerGram",ratePerGram,catPurityRateList, productDetails.cat_id);
        formValues.ratePerGram = ratePerGram;
        formValues.customerRate = ratePerGram;
      }else{
        formValues.ratePerGram = parseFloat(parseFloat((productDetails['id_metal']===1 ? metalRates['gold_22ct'] :metalRates['silver_G']))-parseFloat(isUndefined(old_metal_item?.rate_deduction))).toFixed(2);
        formValues.customerRate = productDetails['id_metal']===1 ? metalRates['gold_22ct'] : metalRates['silver_G']
      }

      setFormValues(prevValues => ({
        ...prevValues,
        ratePerGram:formValues.ratePerGram,
        touch:formValues.touch,
      }));
    }
    
  },[formValues.selectedProduct,formValues.selectedOldMetalItem]);

  useEffect(() => {
    const productDetails        = products.find((prod)=>prod.pro_id===formValues.selectedProduct)
    if(productDetails){ 
      let old_metal_item = oldMetalItems.find((val)=>val.id_item_type===formValues.selectedOldMetalItem)
      formValues.wastagePercentage = old_metal_item?.wasteage_percentage;
      
      if(!isOldMetalCostEditable){
        formValues.ratePerGram = parseFloat(parseFloat((productDetails['id_metal']===1 ? metalRates['gold_22ct'] :metalRates['silver_G']))-parseFloat(isUndefined(old_metal_item?.rate_deduction))).toFixed(2);
      }
      
      setFormValues(prevValues => ({
        ...prevValues,
        ratePerGram:formValues.ratePerGram
      }));
    }
    
  },[formValues.selectedOldMetalItem]);

  useEffect(() => {
      let dustWeight = 0;
      const productDetails        = products.find((prod)=>prod.pro_id===formValues.selectedProduct)
      if(productDetails){
       
        // old metal calculation 3 means need to take customer rate
        const itemCostDetails       = calculatePurchaseItemCost({
              grossWeight     : formValues.grossWeight,
              netWeight     : formValues.netWeight,
              wastageWeight : formValues.wastageWeight,
              ratePerGram : formValues.ratePerGram,
              touch:formValues.touch,
              calculationType : old_metal_calculation,
              id_metal : productDetails.id_metal
        });
        if(isUndefined(formValues.customerRate) > 0 && parseInt(dust_wt_auto_calculate)==1){
          let actualValue = parseFloat(parseFloat(formValues.grossWeight)*parseFloat(formValues.ratePerGram));
          let customerRateWeight = parseFloat(parseFloat(actualValue)/parseFloat(formValues.customerRate)).toFixed(3);
          dustWeight = parseFloat(parseFloat(isUndefined(formValues.grossWeight)-parseFloat(customerRateWeight))).toFixed(3);
          formValues.dustWeight = customerRateWeight;
        }
        setFormValues(prevValues => ({
          ...prevValues,
          itemCost:Math.round(itemCostDetails.item_cost),
          pureWeight:itemCostDetails.pure_weight,
          dustWeight:dustWeight
        }));
        
        setValue("itemCost", Math.round(itemCostDetails.item_cost));
    }
    }, [formValues.selectedProduct,
    formValues.grossWeight,
   // formValues.netWeight,
    formValues.wastageWeight,
    formValues.touch,
    formValues.customerRate,
    formValues.pureWeight,
    products,
    oldMetalItems,
    formValues.selectedOldMetalItem]);

//Calculating Item Cost

  const handleInputChange = (field, value) => {
    if(field==='itemCost'){     
      let ratePerGram = 0;
      if(parseInt(old_metal_calculation)===3){
          let netWeight = parseFloat(parseFloat(value)/isUndefined(formValues.customerRate)).toFixed(2);
          let dustWeight = parseFloat(parseFloat(formValues.grossWeight)-parseFloat(netWeight)).toFixed(2);
          ratePerGram = parseFloat(parseFloat(value)/parseFloat(formValues.grossWeight)).toFixed(2);
        setFormValues((prevValues) => ({ ...prevValues,"netWeight":netWeight,"dustWeight":dustWeight,'ratePerGram': ratePerGram,[field]: value  }));
      }
      if(parseInt(old_metal_calculation)==2){
          // ratePerGram = parseFloat(parseFloat(value) / parseFloat(formValues.pureWeight)).toFixed(2);
          setFormValues((prevValues) => ({ ...prevValues,'itemCost': value  }));
      }
    }else if(field==='ratePerGram'){
      let dustWeight = 0;
      const productDetails        = products.find((prod)=>prod.pro_id===formValues.selectedProduct)
      const itemCostDetails = calculatePurchaseItemCost({
            grossWeight     : formValues.grossWeight,
            netWeight     : formValues.netWeight,
            wastageWeight : formValues.wastageWeight,
            ratePerGram : value,
            touch:formValues.touch,
            calculationType : old_metal_calculation,
            id_metal : productDetails.id_metal
      });
      if(isUndefined(formValues.customerRate) > 0){
        let actualValue = parseFloat(parseFloat(formValues.grossWeight)*parseFloat(value));
        let customerRateWeight = parseFloat(parseFloat(actualValue)/parseFloat(formValues.customerRate)).toFixed(3);
        dustWeight = parseFloat(parseFloat(isUndefined(formValues.grossWeight)-parseFloat(customerRateWeight))).toFixed(3);
        formValues.dustWeight = customerRateWeight;
      }
      setFormValues(prevValues => ({
        ...prevValues,
        itemCost:Math.round(itemCostDetails.item_cost),
        pureWeight:itemCostDetails.pure_weight,
        dustWeight:dustWeight,
        [field]: value 
      }));
        setValue("itemCost", Math.round(itemCostDetails.item_cost));

    }else{
      setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
    }
  };

  const handleSetStoneDetails = (data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      stoneDetails: data,
    }));
  };

  const resetForm = () => {
    setFormValues(initialState);
    if (lessWeightRef.current) {
      lessWeightRef.current.resetForm();
    }
  };


  const resetPurity = () => setFormValues((prevValues) => ({ ...prevValues, selectedPurity: null }));
  const resetProduct = () => setFormValues((prevValues) => ({ ...prevValues, selectedProduct: null }));

  return {
    formValues,
    lessWeightRef,
    handleInputChange,
    handleSetStoneDetails,
    resetForm,
    resetPurity,
    resetProduct,
    lastTabIndex
  };
};

export default usePurchaseFormHandling;