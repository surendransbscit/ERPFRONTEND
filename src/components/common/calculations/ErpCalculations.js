import { parse } from 'date-fns';
import React from 'react'
import { useSelector } from "react-redux";
import _ from 'lodash';
export const isUndefined = (value)=>{
    if(value!==undefined && value!==''  && !isNaN(value)){
        return value;
    }else{
        return 0;
    }
}

export const calculateStoneAmount = ({...props}) => {
    const stone_weight = isUndefined(props?.stone_weight);
    const stone_piece = isUndefined(props?.stone_piece);
    const stone_rate = isUndefined(props?.stone_rate);
    const stone_calc_type = isUndefined(props?.stone_calc_type);
    const stone_cost = parseFloat((parseFloat((stone_calc_type==1 ? stone_weight :stone_piece)*parseFloat(stone_rate)))).toFixed(2);
    return stone_cost;
};

export const calculateOtherMetalAmount = ({...props}) => {
    const weight = isUndefined(props?.weight);
    const wastage_weight = isUndefined(props?.wastage_weight);
    const piece = isUndefined(props?.piece);
    const rate = isUndefined(props?.rate);
    const rate_calc_type = isUndefined(props?.rate_calc_type);
    const mcType = isUndefined(props?.mcType);
    const mcValue = isUndefined(props?.mcValue);
    const weightAmount = parseFloat((parseFloat((rate_calc_type===1 ? parseFloat(weight)+parseFloat(wastage_weight) :piece)*parseFloat(rate)))).toFixed(2);
    const makingCharge = (mcType===1 ? parseFloat(parseFloat(mcValue)*parseFloat(weight)).toFixed(2) :parseFloat(parseFloat(mcValue)*parseFloat(piece)).toFixed(2));
    const itemCost = parseFloat(parseFloat(weightAmount)+parseFloat(makingCharge)).toFixed(2);
    return itemCost;
};

export const calculatePurchaseNetWeight = ({...props}) => {
    const gross_weight = isUndefined(props?.gross_weight);
    const less_weight = isUndefined(props?.less_weight);
    const wastageWeight = isUndefined(props?.wastageWeight);
    const dustWeight = isUndefined(props?.dustWeight);
    const net_weight = parseFloat(parseFloat(gross_weight)-parseFloat(less_weight)-parseFloat(wastageWeight)-parseFloat(dustWeight)).toFixed(3);
    return parseFloat(net_weight).toFixed(3);
};

export const calculateNetWeight = ({...props}) => {
    let net_weight = 0;
    const gross_weight = isUndefined(props?.gross_weight);
    const less_weight = isUndefined(props?.less_weight);
    const other_metal_weight = isUndefined(props?.other_metal_weight);
    net_weight = parseFloat(parseFloat(gross_weight)-parseFloat(less_weight)-parseFloat(other_metal_weight)).toFixed(3);
    return net_weight;
};

export const calculatePureWeight = ({...props}) => {
    const net_weight = isUndefined(props?.netWeight);
    const purchase_touch = isUndefined(props?.purchaseTouch);
    const purchase_wastage = isUndefined(props?.purchaseWastage);
    const pure_calc = isUndefined(props?.pureCalcType);
    let pure_weight = 0;
    if(parseInt(pure_calc)===1){
        pure_weight = parseFloat((parseFloat(net_weight)*parseFloat(purchase_touch))/100).toFixed(3);
    }else if(parseInt(pure_calc)===2){
        pure_weight = parseFloat(parseFloat((parseFloat(purchase_touch)+parseFloat(purchase_wastage))/100)*parseFloat(net_weight)).toFixed(3);
    }else{
        let net_weight_touch  = parseFloat(parseFloat((parseFloat(purchase_touch)+parseFloat(net_weight))/100)).toFixed(3);
        let wastage_touch = parseFloat((parseFloat(net_weight_touch)*parseFloat(purchase_wastage))/100).toFixed(3);
        pure_weight = parseFloat(parseFloat(net_weight_touch)+parseFloat(wastage_touch)).toFixed(3);
    }
    return pure_weight;
};

export const calculatePurchaseCost = ({...props}) => {
    let purchaseCost = 0;
    let taxAmount = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    const piece = isUndefined(props?.piece);
    const netWeight = isUndefined(props?.netWeight);
    const pureWeight = isUndefined(props?.pureWeight);
    const purchaseMcType = isUndefined(props?.purchaseMcType);
    const purchaseMc = isUndefined(props?.purchaseMc);
    const flatMcValue = isUndefined(props?.flatMcValue);
    const purchaseRate = isUndefined(props?.purchaseRate);
    const taxType = isUndefined(props?.taxType);
    const taxPercentage = isUndefined(props?.taxPercentage);
    const rateCalcType = isUndefined(props?.rateCalcType);
    const otherMetalAmount = isUndefined(props?.otherMetalAmount);
    const stoneAmount = isUndefined(props?.stoneAmount);
    const grossWeight = isUndefined(props?.grossWeight);
    const otherChargesAmount = isUndefined(props?.otherChargesAmount);
    const purchaseCountry = props?.purchaseCountry;
    const purchaseState = props?.purchaseState;
    const branchState = props?.branchState;
    const branchCountry = props?.branchCountry;
    let tax_required_in_purchase = props?.tax_required_in_purchase;
    let mc = 0
    if(props?.settingsMcType == 1){
        mc = (purchaseMcType===1 ? parseFloat(parseFloat(purchaseMc)*parseFloat(grossWeight)).toFixed(2) :parseFloat(purchaseMc*piece).toFixed(2))

    }else{
        mc = (purchaseMcType===1 ? parseFloat(parseFloat(purchaseMc)*parseFloat(netWeight)).toFixed(2) :parseFloat(purchaseMc*piece).toFixed(2))
    }
    mc =parseFloat(flatMcValue) + parseFloat(mc)
    if (parseInt(rateCalcType)===2){
        purchaseCost = parseFloat((parseFloat(piece)*parseFloat(purchaseRate))+parseFloat(mc)).toFixed(2);
    }else{
        purchaseCost = parseFloat((parseFloat(pureWeight)*parseFloat(purchaseRate))+parseFloat(mc)).toFixed(2);
    }
    purchaseCost = parseFloat(parseFloat(purchaseCost)+parseFloat(stoneAmount)+parseFloat(otherMetalAmount) +parseFloat(otherChargesAmount)).toFixed(2) ;
    if(taxType!=='' && taxType!==0 && taxPercentage>0 && parseInt(tax_required_in_purchase)==1 ){
        if(taxType===1){ //Inclusive of Tax
            taxAmount = calculateInclusiveTax(purchaseCost,taxPercentage);
        }else{ // Exclusive of tax
            taxAmount = calculateExclusiveTax(purchaseCost,taxPercentage);
        }
        if(taxAmount>0){
            if(parseInt(purchaseCountry)===parseInt(branchCountry) && parseInt(purchaseState)===parseInt(branchState)){
                cgst = parseFloat(taxAmount/2).toFixed(2);
                sgst = parseFloat(taxAmount/2).toFixed(2);
            }else{ 
                igst = taxAmount;
            }
        }
        purchaseCost = parseFloat(parseFloat(purchaseCost)+parseFloat(taxAmount)).toFixed(2);
    }
    return {
        "purchaseCost":purchaseCost,
        "taxAmount":taxAmount,
        "totalPurchaseMc":mc,
        "cgst":cgst,
        "sgst":sgst,
        "igst":igst,
    }
};

export const calculateWastageWeight = ({...props}) => {
    let calculated_weight = 0;
    const calculationType = isUndefined(props?.calculationType);
    const grossWeight = isUndefined(props?.grossWeight);
    const netWeight = isUndefined(props?.netWeight);
    const wastagePercentage = isUndefined(props?.wastagePercentage);
    
    //Calculate Wastage weight
    if(calculationType===1){
        calculated_weight = parseFloat(parseFloat(parseFloat(grossWeight)*parseFloat(wastagePercentage))/100).toFixed(3); //Based on Gross weight
    }else{
        calculated_weight = parseFloat(parseFloat(parseFloat(netWeight)*parseFloat(wastagePercentage))/100).toFixed(3); // Based on net weight
    }
    return calculated_weight;
}

export const calculateWastagePercentage = ({...props}) => {
    let calculated_percentage = 0;
    let calculated_weight = isUndefined(props?.wastageWeight);
    const calculationType = isUndefined(props?.calculationType);
    const grossWeight = isUndefined(props?.grossWeight);
    const netWeight = isUndefined(props?.netWeight);
    
    //Calculate wastage Percentage
    if(calculationType===1){
        calculated_percentage = parseFloat(parseFloat(parseFloat(calculated_weight)*100)/parseFloat(grossWeight)).toFixed(2);
    }else{
        calculated_percentage = parseFloat(parseFloat(parseFloat(calculated_weight)*100)/parseFloat(netWeight)).toFixed(2);
    }
    return calculated_percentage;
}

export const getRatePerGram = (categories,metalPurityRate,metalRates,cat_id,id_purity,metalCatPurityRate,settings) =>{
    let ratePerGram = 0;
    if(parseInt(settings?.metal_rate_type) == 1){
        const rateDetails = metalCatPurityRate?.find((val) => val.category == cat_id && val.purity == id_purity);
        ratePerGram = isNaN(rateDetails?.rate_per_gram) ? 0 : rateDetails?.rate_per_gram  ;
    }else if (parseInt(settings?.metal_rate_type) == 2){
        const categoryDetails = categories?.find((cat) => cat.id_category ===cat_id);
        const rateDetails = metalPurityRate?.find((val) => val.id_metal == categoryDetails?.id_metal && val.id_purity == id_purity);
        let rate_field = rateDetails?.rate_field;
        if (rate_field) {
          ratePerGram = metalRates[rate_field];
        }
    }
    return ratePerGram;
}


export const calculateSalesItemCost = ({...props}) => {
    let item_cost = 0;
    let total_mc_value = 0;
    let taxAmount = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let item_rate = 0;
    const piece = isUndefined(props?.piece);
    const grossWeight = isUndefined(props?.grossWeight);
    const netWeight = isUndefined(props?.netWeight);
    const pureWeight = isUndefined(props?.pureWeight);
    const wastageWeight = isUndefined(props?.wastageWeight);
    const mcType = parseInt(isUndefined(props?.mcType));
    const mcValue = isUndefined(props?.mcValue);
    const flatMcValue = isUndefined(props?.flatMcValue);
    const ratePerGram = isUndefined(props?.ratePerGram);
    const taxType = isUndefined(props?.taxType);
    const taxPercentage = isUndefined(props?.taxPercentage);
    const productDetails = props?.productDetails;
    const stoneAmount = isUndefined(props?.stoneAmount);
    const otherMetalAmount = isUndefined(props?.otherMetalAmount);
    const otherChargesAmount = isUndefined(props?.otherChargesAmount);
    const discountAmount = isUndefined(props?.discountAmount);
    let sellRate = isUndefined(props?.sellRate);
    let mrpMarginAmount = isUndefined(props?.mrpMarginAmount);
    const mcCalculationType = (isUndefined(props?.settingsMcType) ? isUndefined(productDetails?.settingsMcType) : isUndefined(productDetails?.mc_calc_type));
    const salesMode = (productDetails?.sales_mode);
    const fixedRateType = isUndefined(productDetails?.fixed_rate_type);
    const invoiceTo = isUndefined(props?.invoiceTo);
    const mrpItemDiscountPercentage = isUndefined(props?.mrpItemDiscountPercentage);
    const settingsBillingType = (props?.settingsBillingType == undefined ? false : props.settingsBillingType);
    const idBranch = props?.idBranch;
    const deliveryLocation = props?.deliveryLocation;
    const accessBranches = props?.accessBranches;
    const selectedCustomer = props?.selectedCustomer;

    console.log("props",props);
    
    if(mcCalculationType===1){
        total_mc_value = parseFloat(mcType===1 ? parseFloat(grossWeight)*parseFloat(mcValue):parseFloat(piece)*parseFloat(mcValue)).toFixed(2);
    }else{
        total_mc_value = parseFloat(mcType===1 ? parseFloat(netWeight)*parseFloat(mcValue):parseFloat(piece)*parseFloat(mcValue)).toFixed(2);
    }
    if(parseInt(salesMode) === 1){
        if(parseInt(invoiceTo)===2){
            
            item_rate = (parseFloat(parseFloat(pureWeight))*parseFloat(ratePerGram)).toFixed(2);
        }else{
            item_rate = (parseFloat(parseFloat(netWeight)+parseFloat(wastageWeight))*parseFloat(ratePerGram)).toFixed(2);
        }
        
    }else{
        // sellRate = parseFloat(sellRate) + parseFloat(mrpMarginAmount);
        // if(parseInt(fixedRateType)===2){
        //     item_rate = sellRate;
        // }else{
        //     item_rate = parseFloat(parseFloat(sellRate)*parseFloat(netWeight)).toFixed(2);
        // }
        // if(parseFloat(mrpItemDiscountPercentage) > 0){
        //     let mrp_item_discount = parseFloat(parseFloat(item_rate) * parseFloat(mrpItemDiscountPercentage))/100
        //     item_rate = parseFloat(parseFloat(item_rate) - parseFloat(mrp_item_discount));
        // }

        item_rate = sellRate;
    }
  
   
    total_mc_value = parseFloat(flatMcValue)+parseFloat(total_mc_value)
    
    let taxable_amount = parseFloat(parseFloat(item_rate)+parseFloat(total_mc_value)+parseFloat(otherMetalAmount)+parseFloat(stoneAmount)+parseFloat(otherChargesAmount)-parseFloat(discountAmount)).toFixed(2);

    if(taxType!=='' && taxType!==0 && taxPercentage>0){
        if(taxType===1){ //Inclusive of Tax
            taxAmount = calculateInclusiveTax(taxable_amount,taxPercentage);
            item_cost = parseFloat(taxable_amount);
            taxable_amount = parseFloat(parseFloat(taxable_amount)-parseFloat(taxAmount)).toFixed(2);
        }else{ // Exclusive of tax
            taxAmount = calculateExclusiveTax(taxable_amount,taxPercentage);
            item_cost = parseFloat(parseFloat(taxAmount)+parseFloat(taxable_amount)).toFixed(2);
        }
        if(taxAmount>0){
            
            if(parseInt(deliveryLocation)===2){
                let selectedBranch = accessBranches.find((val)=>val.id_branch===idBranch);
                let customerState = selectedCustomer?.address_details.state;
                if(parseInt(customerState)===parseInt(selectedBranch.state)){
                    cgst = parseFloat(taxAmount/2).toFixed(2);
                    sgst = parseFloat(taxAmount/2).toFixed(2);
                }else{
                    igst = taxAmount;
                }
            }else{
                cgst = parseFloat(taxAmount/2).toFixed(2);
                sgst = parseFloat(taxAmount/2).toFixed(2);
            }
            
        }
    }else{
        item_cost = taxable_amount;
    }
    return {
        "item_cost":item_cost,
        "taxAmount":taxAmount,
        "taxable_amount":taxable_amount,
        "cgst":cgst,
        "sgst":sgst,
        "igst":igst,
        "total_mc_value":total_mc_value,
        "discount_amount":discountAmount,
    }
}

export const calculateInclusiveTax  = (taxable_amount,taxPercentage)=>{
    let amt_without_gst = (parseFloat(taxable_amount)*100)/(100+parseFloat(taxPercentage));
	let inclusiveTaxAmount = parseFloat(parseFloat(taxable_amount)	- parseFloat(amt_without_gst)).toFixed(2);
    return inclusiveTaxAmount;
}

export const calculateExclusiveTax  = (taxable_amount,taxPercentage)=>{
    const exclusiveTaxAmount = parseFloat(parseFloat(parseFloat(taxable_amount)*parseFloat(taxPercentage))/100).toFixed(2);
    return exclusiveTaxAmount;
}

export const calculatePurchaseItemCost = ({...props}) => {
    let item_cost = 0;
    const grossWeight = isUndefined(props?.grossWeight);
    const netWeight = isUndefined(props?.netWeight);
    const ratePerGram = isUndefined(props?.ratePerGram);
    const touch = isUndefined(props?.touch);
    const id_metal = isUndefined(props?.id_metal);
    let purWeight = parseFloat(parseFloat(netWeight)*parseFloat(touch)/100).toFixed(3);
    if(parseInt(id_metal)==2){
        

        let intPart = Math.floor(purWeight);
        let decimalPart = purWeight - intPart;
        if (decimalPart <= 0.25) {
            intPart;
        } else if (decimalPart > 0.25 && decimalPart <= 0.75) {
            intPart += 0.5;
        } else {
            intPart += 1;
        }
        purWeight = intPart;

    }
    if(parseInt(props?.calculationType)===3)
    {
        item_cost = parseFloat(parseFloat(grossWeight)*parseFloat(ratePerGram)).toFixed(2);
    }else if(parseInt(props?.calculationType)===2){
        item_cost = parseFloat(parseFloat(purWeight)*parseFloat(ratePerGram)).toFixed(2);
    }
    else{
        item_cost = parseFloat(parseFloat(netWeight)*parseFloat(ratePerGram)).toFixed(2);
    } 
        return {
        "item_cost":item_cost,
        "pure_weight":purWeight
    }
}

export const calculateItemDiscountAmount = (salesItemData,totalDiscount,activeProductList,totalSalesAmount,settingsBillingType=false) => {
    let updatedFormData = [...salesItemData];  
    salesItemData.forEach((formValues, index) => {
        let disc_per = 0
        let discount = 0;
        if(formValues.selectedProduct!=='' && formValues.selectedProduct!==null)
        {
            const productDetails = activeProductList.find((prod) => prod.pro_id === formValues.selectedProduct);
            let taxableamount = formValues.taxType == 1? formValues.itemCost : formValues.taxableAmount;
            if (parseFloat(totalSalesAmount) > 0) {
                disc_per = parseFloat(parseFloat(parseFloat(isUndefined(totalDiscount)) / parseFloat(isUndefined(totalSalesAmount))) * 100);
                discount = parseFloat(parseFloat(parseFloat(taxableamount) * parseFloat(disc_per)) / 100).toFixed(2);
            }else{
                disc_per = 0
                discount = 0;
            }

            formValues.discountAmount = discount;
            const stoneAmount = formValues.stoneDetails.reduce((sum, item) => sum + parseFloat(item.stone_amount || 0), 0);
            const itemCostDetails = calculateSalesItemCost({
                piece: formValues?.piece,
                grossWeight: formValues.grossWeight,
                netWeight: formValues.netWeight,
                wastageWeight: formValues.wastageWeight,
                mcType: formValues.mcType,
                mcValue: formValues.mcValue,
                taxType: formValues.taxType,
                flatMcValue: formValues.flatMcValue,
                taxPercentage: productDetails.tax_percentage,
                productCalculationType: formValues.calculation_based_on,
                ratePerGram: formValues.ratePerGram,
                stoneAmount: stoneAmount,
                discountAmount: discount,
                otherMetalAmount: formValues.otherMetalAmount,
                otherChargesAmount: formValues.otherChargesAmount,
                sellRate: formValues.sellRate,
                productDetails: productDetails,
                settingsMcType: formValues.settingsMcType,
                invoiceTo: '',
                settingsBillingType:settingsBillingType
            });
            let item_rate = (parseFloat(parseFloat(formValues.netWeight)+parseFloat(formValues.wastageWeight))*parseFloat(formValues.ratePerGram)).toFixed(2);
            item_rate = parseFloat(parseFloat(item_rate)+parseFloat(formValues.totalMcValue)).toFixed(2);
            formValues.itemCost = itemCostDetails.item_cost;
            formValues.taxableAmount = itemCostDetails.taxable_amount;
            formValues.taxAmount = itemCostDetails.taxAmount;
            formValues.itemDiscAvg = disc_per;
            formValues.vaDiscount = 0;
            formValues.mcDiscount = 0;
            formValues.itemDiscount = discount;
            let balanceDiscount = 0;
            formValues.taxPercentage = (settingsBillingType ? 0 : productDetails.tax_percentage);
            let wastageAmount = parseFloat(parseFloat(formValues.wastageWeight)*parseFloat(formValues.ratePerGram)).toFixed(2);
            if(parseFloat(formValues.itemDiscount) > 0){
                if(parseFloat(wastageAmount)<parseFloat(formValues.itemDiscount)){
                    formValues.vaDiscount = parseFloat(wastageAmount).toFixed(2);
                }else{
                    formValues.vaDiscount = parseFloat(parseFloat(formValues.itemDiscount)).toFixed(2);
                }
            }
            balanceDiscount = parseFloat(parseFloat(formValues.itemDiscount) - parseFloat(formValues.vaDiscount)).toFixed(2);
            //formValues.mcDiscount = parseFloat(parseFloat(formValues.itemDiscount)-parseFloat(formValues.vaDiscount)).toFixed(2);
            formValues.mcDiscount = balanceDiscount;
            formValues.itemAmount = parseFloat(parseFloat(itemCostDetails.item_cost) - parseFloat(parseFloat(formValues.itemDiscount))).toFixed(2);
            formValues.cgst = itemCostDetails.cgst;
            formValues.sgst = itemCostDetails.sgst;
            formValues.igst = itemCostDetails.igst;

            //Need to calculate wastage percentage after discount

            let wastageWeightAfterDiscount = parseFloat(parseFloat(formValues.vaDiscount)/parseFloat(formValues.ratePerGram)).toFixed(3)
            let wastageAfterDiscount = calculateWastagePercentage({
                wastageWeight:wastageWeightAfterDiscount,
                calculationType:formValues.wastage_calc_type,
                grossWeight: formValues.grossWeight,
                netWeight: formValues.netWeight,
            });
            formValues.wastageAfterDiscount = parseFloat(parseFloat(formValues.wastagePercentage)-parseFloat(isUndefined(wastageAfterDiscount))).toFixed(2);
            // updatedFormData = [...salesItemData];
            updatedFormData[index] = formValues;
        }
    });
    return updatedFormData;
};