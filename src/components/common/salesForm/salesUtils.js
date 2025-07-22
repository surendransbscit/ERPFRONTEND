import { toastfunc } from "../../sds-toast-style/toast-style";
import { calculateOtherMetalAmount, calculateSalesItemCost, getRatePerGram, isUndefined ,calculateStoneAmount} from "../calculations/ErpCalculations";


export const setTagDetails = (response) => {
    let initialState = {
        selectedCategory: response.cat_id,
        selectedPurity: response.tag_purity_id,
        selectedProduct: response.tag_product_id,
        selectedDesign: response.tag_design_id,
        selectedSubDesign: response.tag_sub_design_id,
        selectedSection:response.tag_section_id,
        piece:response.tag_pcs,
        uomId:response.tag_uom_id,
        grossWeight:response.tag_gwt,
        lessWeight:response.tag_lwt,
        stnWeight:response.tag_stn_wt,
        diaWeight:response.tag_dia_wt,
        netWeight:response.tag_nwt,
        sellRate:response.tag_sell_rate,
        otherMetalWeight:response.tag_other_metal_wt,
        wastagePercentage:response.tag_wastage_percentage,
        wastageWeight:response.tag_wastage_wt,
        purchaseTouch: response.tag_purchase_touch,
        purchaseWastage: response.tag_purchase_va,
        pureWeightCalType:response.tag_purchase_calc_type,
        pureWeight:response.tag_pure_wt,
        purchaseMcType:response.tag_purchase_mc_type,
        purchaseRate:0,
        purchaseRateType:response.tag_purchase_rate_calc_type,
        purchaseMc:0,
        purchaseCost:0,
        mcValue:response.tag_mc_value,
        mcType:response.tag_mc_type,
        ratePerGram:0,
        taxableAmount:0,
        tax_id:response.tax_id,
        tagId:response.tag_id,
        tagCode:response.tag_code,
        taxType:response.tax_type,
        taxPercentage:0,
        taxAmount:0,
        cgst:0,
        sgst:0,
        igst:0,
        discountAmount:0,
        itemCost:0,
        productCalculationType:response.tag_calculation_type,
        editIndex:'',
        stoneDetails: (response.stone_details.length>0 ? setEditStoneDetails(response.stone_details):[]),
        otherMetalDetails:(response.other_metal_details.length>0 ? setEditOtherMetalDetails(response.other_metal_details):[]),
        otherChargesDetails:(response.charges_details.length>0 ? setEditChargeDetails(response.charges_details):[]),
        tag_id:response.tag_id,
        est_item_id:response?.est_item_id,
        supplier:response?.supplier
        };

    return initialState;
}

export const setSalesItem = (response,categoryList,metalPurityRateList,metalRateInfo,activeProductList,catPurityRate=[],settings,activeDiamondRateList =  [],settingsBillingType=false) => {
    
    const ratePerGram = getRatePerGram(categoryList,metalPurityRateList,metalRateInfo,response.cat_id,response.id_purity,catPurityRate,settings)
    const productDetails = activeProductList.find((prod) => prod.pro_id === response.id_product);
    const calculation_based_on = productDetails?.calculation_based_on;
    const taxType = productDetails?.tax_type;
    const tax_id = productDetails?.tax_id;
    const taxPercentage = productDetails?.tax_percentage;
    let grossWeight = response.gross_wt;
    let wastageWeight = response.wastage_weight;
    let netWeight = response.net_wt;
    let flatMcValue = isUndefined(response?.flat_mc_value);
    let otherMetalAmount = 0;
    let stoneAmount =0;
    let stone_details = response.stone_details;
    if(response.other_metal_details.length>0)
    {
        response.other_metal_details.forEach(item => {
            let otherMetalItemCost = calculateOtherMetalAmount({
                "weight": item.weight,
                "piece": item.piece,
                "rate": item.rate_per_gram,
                "wastage_weight":item.wastage_weight,
                "rate_calc_type": item.calc_type,
                "mcType":item.mc_type,
                "mcValue":item.mc_value,
            });
            otherMetalAmount+=parseFloat(otherMetalItemCost)
            });
    }

    if(response.stone_details.length>0 && activeDiamondRateList.length>0)
      {
        stone_details =[]
          response.stone_details.forEach((stn, index) => {
              let rate = stn.stone_rate;
              let diamondRate = activeDiamondRateList.find((item)=> item.quality_code == stn.id_quality_code && item.from_cent <= stn.stone_wt &&  item.to_cent >= stn.stone_wt);
              if(diamondRate){
                rate = diamondRate.rate;
              }
              let stone_pcs = stn?.stone_piece == undefined ? stn.stone_pcs : stn.stone_piece;
              let stoneCost = calculateStoneAmount({
                stone_weight: stn.stone_wt,
                stone_piece: stone_pcs,
                stone_rate: rate,
                stone_calc_type: stn.stone_calc_type,
              });
              console.log("stonecost",stoneCost,stn);
              //stn.stone_amount = parseFloat(stoneCost).toFixed(2);
              stoneAmount+=parseFloat(stoneCost)
              stone_details.push({
                ...stn,
                stone_piece: stone_pcs,
                stn_calc_type: stn.stone_calc_type,
                stone_rate: parseFloat(rate).toFixed(2),
                stone_amount: parseFloat(stoneCost).toFixed(2),
              })
              });
      }else{
         stoneAmount = [...response.stone_details].reduce((sum, item) => parseFloat(sum) + parseFloat(item.stone_amount), 0);
      }
    
   // const stoneAmount = [...response.stone_details].reduce((sum, item) => parseFloat(sum) + parseFloat(item.stone_amount), 0);
    const otherChargesAmount = [...response.charges_details].reduce((sum, item) => parseFloat(sum) + parseFloat(item.charges_amount), 0);
    let rate_per_gram = (response?.rate_type && response?.rate_type===2 ? (parseFloat(response.rate_per_gram) > 0 ? response.rate_per_gram :ratePerGram) :ratePerGram);
    const itemCostDetails = calculateSalesItemCost({
        grossWeight: grossWeight,
        netWeight:netWeight,
        wastageWeight: wastageWeight,
        mcType: response.mc_type,
        mcValue: response.mc_value,
        taxType: taxType,
        taxPercentage: taxPercentage,
        productDetails: productDetails,
        ratePerGram: rate_per_gram,
        stoneAmount:stoneAmount,
        otherMetalAmount:otherMetalAmount,
        otherChargesAmount:otherChargesAmount,
        sellRate:response.sell_rate,
        settingsBillingType : settingsBillingType,
        flatMcValue:flatMcValue,
    });
    let salesItemData = {
        purchaseTouch: "",
        isGrossWeightDisable: response.item_type == 0 && response.is_partial_sale == 0 ? true : false,
        selectedCategory: response.cat_id,
        selectedPurity: response.id_purity,
        selectedProduct: response.id_product,
        selectedDesign: response.id_design,
        selectedSubDesign: response.id_sub_design,
        selectedSection:response.id_section,
        piece:response.pieces,
        uomId:response.uom_id,
        grossWeight:grossWeight,
        lessWeight:response.less_wt,
        stnWeight:response.stone_wt,
        diaWeight:response.dia_wt,
        netWeight:response.net_wt,
        sellRate:response.sell_rate,
        otherMetalWeight:response.other_metal_wt,
        wastagePercentage:response.wastage_percentage,
        wastageWeight:response.wastage_weight,
        purchaseTouch: "",
        purchaseWastage:"",
        pureWeightCalType:"",
        pureWeight:"",
        purchaseMcType:"",
        purchaseRate:0,
        purchaseRateType:"",
        purchaseMc:0,
        purchaseCost:0,
        mcValue:response.mc_value,
        flatMcValue:flatMcValue,
        totalMcValue:itemCostDetails.total_mc_value,
        mcType:response.mc_type,
        ratePerGram:rate_per_gram,
        taxableAmount:itemCostDetails.taxable_amount,
        tax_id:tax_id,
        tagId:response.tag_id,
        tagCode:response.tag_code,
        taxType:response.tax_type,
        taxPercentage:(settingsBillingType ? 0 : taxPercentage),
        taxAmount:itemCostDetails.taxAmount,
        cgst:itemCostDetails.cgst,
        sgst:itemCostDetails.sgst,
        igst:itemCostDetails.igst,
        discountAmount:0,
        itemCost:itemCostDetails.item_cost,
        productCalculationType:calculation_based_on,
        editIndex:'',
        stoneDetails: (response.stone_details.length>0 ? setEditStoneDetails(stone_details):[]),
        otherMetalDetails:(response.other_metal_details.length>0 ? setEditOtherMetalDetails(response.other_metal_details):[]),
        otherChargesDetails:(response.charges_details.length>0 ? setEditChargeDetails(response.charges_details):[]),
        productName:productDetails?.product_name,
        est_item_id:response?.est_item_id,
        item_type:response.item_type,
        rate_type:response?.rate_type,
        detail_id:response?.detail_id,
        isPartial:response?.is_partial_sale == 1 ? true: false ,
        settingsMcType : response.settingsMcType,
        settingsMinVa : response.settingsMinVa,
        settingsMinMc : response.settingsMinMc,
        settingsMaxVa : response.settingsMaxVa,
        settingsMaxMc : response.settingsMaxMc,
        settVaType : response.settVaType,
        settFlatMcMin : response.settFlatMcMin,
        settFlatMcMax : response.settFlatMcMax,
        setMrpSalesRateType : response?.setMrpSalesRateType,
        settingsSellRate : response?.settingsSellRate,
        settTouch : response.settTouch,
        designName:response?.design_name,
        employee: response?.ref_emp_id == undefined ? null:response?.ref_emp_id,
        subEmployee1: response?.ref_emp_id_1 == undefined ? null:response?.ref_emp_id_1,
        subEmployee2: response?.ref_emp_id_2 == undefined ? null:response?.ref_emp_id_2,
        maxGrossWeight:isUndefined(response?.maxGrossWeight),
        tagGrossWeight:isUndefined(response?.tagGrossWeight),
        tagStoneDetails:response?.tagStoneDetails== undefined ? []:response?.tagStoneDetails,
        id_tag_transfer:response?.id_tag_transfer,
        dealerName: response?.supplier_name == undefined ? '': response?.supplier_name,

    }
    return salesItemData;
}

export const setEditStoneDetails = (data) =>{
    let stone_details = [];
    if(data.length>0){
      stone_details = data.map(item=>({
        "est_stn_id":item?.est_stn_id,
        "id_tag_stn_detail":item?.id_tag_stn_detail,
        "stone_name":item.stone_name,
        "id_stone":item.id_stone,
        "uom_id":item.uom_id,
        "divided_by_value":item.divided_by_value,
        "piece":item.stone_pcs,
        "weight":item.stone_wt,
        "stone_type":item.stone_type,
        "stn_calc_type":item.stone_calc_type,
        "stone_rate":item.stone_rate,
        "stone_amount":item.stone_amount,
        "id_quality_code":item.id_quality_code,
        "show_in_lwt":item.show_in_lwt
      }));
    }
    return stone_details;
  }

export const setEditOtherMetalDetails = (data) =>{
    let other_metal_details = [];
    if (data.length > 0) {
      other_metal_details = data.map((item) => ({
        id_est_other_metal:item?.id_est_other_metal,
        id_tag_other_metal:item?.id_tag_other_metal,
        cat_name: item.cat_name,
        piece: item.piece,
        weight: item.weight,
        wastagePercentage: item.wastage_percentage,
        wastageWeight: item.wastage_weight,
        mcType: item.mc_type,
        mcValue: item.mc_value,
        ratePerGram: item.rate_per_gram,
        amount: item.other_metal_cost,
        selectedCategory: item.id_category,
        selectedPurity: item.id_purity,
        calc_type:item.calc_type,
      }));
    }
    return other_metal_details;
  }

export const setEditChargeDetails = (data) =>{
    let charge_details = [];
    if (data.length > 0) {
      charge_details = data.map((item) => ({
        name: item.charge_name,
        selectedCharge: item.id_charges,
        amount: item.charges_amount,
      }));
    }
    return charge_details;
  }


export const setPurchaseItemDetails = (value) =>{
    // purchaseItemData.forEach(value => {
      let purchase_details = {
        "productName":value.product_name,
        "selectedProduct": value.id_product,
        "selectedOldMetalItem" : value.item_type,
        "selectedCategory":value.cat_id,
        "touch":value.touch,
        "piece": value.pieces,
        "grossWeight": value.gross_wt,
        "lessWeight": value.less_wt,
        "netWeight": value.net_wt,
        "diaWeight": value.dia_wt,
        "stnWeight": value.stone_wt,
        "dustWeight":value.dust_wt,
        "wastagePercentage":value.wastage_percentage,
        "wastageWeight": value.wastage_weight,
        "pureWeight": value.pure_weight,
        "ratePerGram": value.rate_per_gram,
        "itemCost": value.amount,
        "stoneDetails": (value.stone_details!==undefined ?setEditStoneDetails(value.stone_details) :[]),
        "est_old_metal_item_id":value?.est_old_metal_item_id ? value?.est_old_metal_item_id : ""
      }
   // });
    return purchase_details;
  }


  export const setReturnItemDetails = (response) =>{
    // purchaseItemData.forEach(value => {
      let purchase_details = {
        invoice_sale_item_id:response?.invoice_sale_item_id,
        est_return_item_id:response?.est_return_item_id,
        selectedCategory: "",
        selectedPurity: response?.id_purity,
        selectedProduct: response?.id_product,
        selectedDesign: response?.id_design,
        selectedSubDesign: response?.id_sub_design,
        selectedSection:response?.id_section,
        selectedSize:response?.size,
        huId1:"",
        huId2:"",
        piece: response?.pieces,
        uomId: response?.uom_id,
        grossWeight: response?.gross_wt,
        lessWeight: response?.less_wt,
        stnWeight: response?.stone_wt,
        diaWeight: response?.dia_wt,
        netWeight: response?.net_wt,
        sellRate:response?.sell_rate,
        otherMetalWeight:0.000,
        wastagePercentage: response?.wastage_percentage,
        wastageWeight: response?.wastage_weight,
        purchaseTouch: 0,
        purchaseWastage: 0,
        pureWeightCalType:2,
        pureWeight:0.000,
        purchaseMcType:1,
        purchaseRate:0,
        purchaseRateType:1,
        purchaseMc:0,
        purchaseCost:0,
        mcValue: response?.mc_value,
        totalMcValue : 0,
        flatMcValue: 0,
        mcType: response?.mc_type,
        ratePerGram: response?.rate_per_gram,
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
        rate_type:1,
      }
   // });
    return purchase_details;
  }


  export const validateSaleItemDetails = (activeProductList,currentRowDetails,invoiceTo,settings) =>{
    let allowSubmit = true;
    let product = activeProductList.find((val) => val.pro_id === currentRowDetails?.selectedProduct);
    console.log(currentRowDetails.employee,settings,"validateSaleItemDetails");
    if(currentRowDetails.selectedProduct==='' || currentRowDetails.selectedProduct==null){
      toastfunc("Product is Missing");
      allowSubmit = false;
    }
    else if(currentRowDetails.selectedPurity==='' || currentRowDetails.selectedPurity==null){
      toastfunc("Purity is Missing");
      allowSubmit = false;
    }
    else if((currentRowDetails.piece)===''){
      toastfunc("Piece is Required..");
      allowSubmit = false;
    }else if(parseInt(currentRowDetails.piece)===0){
      toastfunc("Piece should be greater than 0..");
      allowSubmit = false;
    }
    else if(parseInt(currentRowDetails.piece) < 0){
      toastfunc("Piece should not less than 0..");
      allowSubmit = false;
    }
    else if (parseInt(product.sales_mode) == 1 && parseInt(product.weight_show_in_print) == 1 && parseFloat(currentRowDetails.grossWeight)==0){
      toastfunc("Gross weight should be greater than 0..");
      allowSubmit = false;
    }
    else if (parseInt(product.sales_mode) == 1 && parseInt(invoiceTo)==2 && parseFloat(currentRowDetails.pureWeight)==0){
      toastfunc("Pure weight is missing");
      allowSubmit = false;
    }
    // else if (parseInt(product.fixed_rate_type) == 1 && parseInt(product.sales_mode) == 0 && parseFloat(currentRowDetails.grossWeight)==0){
    //   toastfunc("Gross weight should be greater than 0..");
    //   allowSubmit = false;
    // }
    // else if (parseInt(product.fixed_rate_type) == 2 && parseInt(product.sales_mode) == 0 && parseFloat(currentRowDetails.sellRate)==0){
    //   toastfunc("MRP should be greater than 0..");
    //   allowSubmit = false;
    // }
    // else if(parseInt(currentRowDetails.grossWeight) < 0){
    //   toastfunc("Gross weight should be greater than 0..");
    //   allowSubmit = false;
    // }
    else if(currentRowDetails.isMrpItem && (parseFloat(currentRowDetails.sellRate)==0 || currentRowDetails.sellRate=='')){
      toastfunc("MRP Rate is required..");
      allowSubmit = false;
    }
    // else if(currentRowDetails.isMrpWeightBasedItem && ((parseFloat(currentRowDetails.grossWeight)==0) || currentRowDetails.grossWeight=='')){
    //   toastfunc("Gross weight should be greater than 0..");
    //   allowSubmit = false;
    // }
    else if(parseFloat(currentRowDetails.itemCost)==0 || currentRowDetails.itemCost==''){
      toastfunc("Cost is required..");
      allowSubmit = false;
    }
    else if((currentRowDetails.employee ==null || currentRowDetails.employee=='') && parseInt(settings?.is_sales_emp_req)==1){
      toastfunc("Employee is missing..");
      allowSubmit = false;
    }
    return allowSubmit;
  }

  export const createSalesItemData = (sales_details, employee = "", activeProductList, invoiceTo="") => {
    let postData = [];
  
    for (const value of sales_details) {
      if (value.selectedProduct !== '' && value.selectedProduct !== null) {
        let allowSubmit = false;
        allowSubmit = validateSaleItemDetails(activeProductList, value, invoiceTo);
        if(allowSubmit){
          postData.push({
            item_type: value.item_type,
            is_partial_sale: value.isPartial == true ? 1 : 0,
            id_purity: value.selectedPurity,
            uom_id: value.uomId,
            tag_id: value.tagId,
            id_product: value.selectedProduct,
            id_design: value.selectedDesign,
            id_sub_design: value.selectedSubDesign,
            id_section: value.selectedSection,
            size: value?.selectedSize,
            pieces: value.piece,
            gross_wt: isUndefined(value.grossWeight),
            less_wt: isUndefined(value.lessWeight),
            net_wt: isUndefined(value.netWeight),
            dia_wt: isUndefined(value.diaWeight),
            stone_wt: isUndefined(value.stnWeight),
            other_metal_wt: isUndefined(value.otherMetalWeight),
            calculation_type: isUndefined(value.productCalculationType),
            wastage_percentage: parseFloat(isUndefined(value.wastagePercentage)).toFixed(2),
            wastage_weight: isUndefined(value.wastageWeight),
            mc_type: value.mcType,
            mc_value: isUndefined(value.mcValue),
            flat_mc_value: isUndefined(value.flatMcValue),
            total_mc_value: isUndefined(value.totalMcValue),
            other_charges_amount: 0.0,
            other_metal_amount: 0.0,
            rate_per_gram: isUndefined(value.ratePerGram),
            taxable_amount: isUndefined(value.taxableAmount),
            tax_id: value.tax_id,
            tax_type: value.taxType,
            id_tag_transfer: value?.id_tag_transfer,
            tax_percentage: isUndefined(value.taxPercentage),
            tax_amount: isUndefined(value.taxAmount),
            cgst_cost: isUndefined(value.cgst),
            sgst_cost: isUndefined(value.sgst),
            igst_cost: isUndefined(value.igst),
            discount_amount: isUndefined(value.discountAmount),
            item_cost: isUndefined(value.itemCost),
            wastage_discount: parseFloat(isUndefined(value.vaDiscount)).toFixed(2),
            mc_discount_amount: parseFloat(isUndefined(value.mcDiscount)).toFixed(2),
            wastage_percentage_after_disc: parseFloat(isUndefined(value.wastageAfterDiscount)) > 0 ? parseFloat(isUndefined(value.wastageAfterDiscount)).toFixed(2):0 ,
            status: 1,
            stone_details: value.stoneDetails ? setStoneDetails(value.stoneDetails) : [],
            other_metal_detail: value.otherMetalDetails.length > 0 ? setOtherMetalDetails(value.otherMetalDetails) : [],
            charges_details: value.otherChargesDetails,
            sell_rate: isUndefined(value.sellRate),
            est_item_id: value?.est_item_id || "",
            rate_type: value?.rate_type,
            order_detail: value?.detail_id || "",
            is_delivered: value?.is_delivered,
            product_name: value?.productName || "",
            design_name: value?.designName || "",
            tag_code: value?.tagCode || "",
            ref_emp_id: value?.employee || null,
            ref_emp_id_1: value?.subEmployee1 || null,
            ref_emp_id_2: value?.subEmployee2 || null,
          });
        }
        
      }else{
        toastfunc("Product is Missing");
      }
    }
    return postData;
  }

export const createSalesReturnItemData  = (sales_details,employee="") => {
  let postData = [];
  sales_details.forEach(value => {
    if(value?.selectedProduct!=='' && value?.selectedProduct!==null){
      postData.push({
          "id_purity": value.selectedPurity,
          "uom_id": value.uomId,
          "tag_id": value?.tagId,
          "id_product": value?.selectedProduct,
          "id_design": value?.selectedDesign,
          "id_sub_design": value?.selectedSubDesign,
          "id_section":value?.selectedSection,
          "pieces": value?.piece,
          "gross_wt": isUndefined(value.grossWeight),
          "less_wt": isUndefined(value.lessWeight),
          "net_wt": isUndefined(value.netWeight),
          "dia_wt": isUndefined(value.diaWeight),
          "stone_wt":isUndefined(value.stnWeight),
          "wastage_percentage": isUndefined(value.wastagePercentage),
          "wastage_weight": isUndefined(value.wastageWeight),
          "mc_type":value?.mcType,
          "mc_value": isUndefined(value?.mcValue),
          "flat_mc_value": isUndefined(value?.flatMcValue),
          "total_mc_value": 0,
          "other_charges_amount": 0.00,
          "other_metal_amount": 0.00,
          "rate_per_gram": isUndefined(value?.ratePerGram),
          "taxable_amount": isUndefined(value?.taxableAmount),
          "tax_id": value?.tax_id,
          "tax_type": value?.taxType,
          "tax_percentage": isUndefined(value?.taxPercentage),
          "tax_amount": isUndefined(value?.taxAmount),
          "cgst_cost": isUndefined(value?.cgst),
          "sgst_cost": isUndefined(value?.sgst),
          "igst_cost": isUndefined(value?.igst),
          "discount_amount": isUndefined(value?.discountAmount),
          "item_cost": isUndefined(value?.itemCost),
          "status": 1,
          "stone_details":(value.stoneDetails!==undefined ?setStoneDetails(value.stoneDetails) :[]),
          "sell_rate": isUndefined(value?.sellRate),
          "invoice_sale_item_id": value?.invoice_sale_item_id!=='' ? value?.invoice_sale_item_id : null,
      });
    }
    });

    return postData;
}

export const createPurchaseItemData = (purchaseItemData) => {
    let postData = [];
    purchaseItemData.forEach(value => {
        postData.push({
          "id_product": value.selectedProduct,
          "touch":value.touch,
          "pieces": value.piece,
          "item_type" : value.selectedOldMetalItem,
          "gross_wt": isUndefined(value.grossWeight),
          "less_wt": isUndefined(value.lessWeight),
          "net_wt": isUndefined(value.netWeight),
          "dia_wt": isUndefined(value.diaWeight),
          "stone_wt": isUndefined(value.stnWeight),
          "dust_wt":isUndefined(value.dustWeight),
          "wastage_percentage":isUndefined(value.wastagePercentage),
          "wastage_weight": isUndefined(value.wastageWeight),
          "pure_weight": isUndefined(value.pureWeight),
          "rate_per_gram": isUndefined(value.ratePerGram),
          "customer_rate": isUndefined(value.customerRate),
          "amount": isUndefined(value.itemCost),
          "stone_details": (value.stoneDetails!==undefined ?setStoneDetails(value.stoneDetails) :[]),
          "est_old_metal_item_id":value?.est_old_metal_item_id ? value?.est_old_metal_item_id : ""
        })
      });
    return postData;
}

export const setStoneDetails = (data) =>{
    let stone_details = [];
    if(data.length>0){
      stone_details = data.map(item=>({
        "id_stone":item.id_stone,
        "id_quality_code":item.id_quality_code,
        "uom_id":item.uom_id,
        "stone_pcs":item.piece,
        "stone_wt":item.weight,
        "stone_type":item.stone_type,
        "stone_calc_type":item.stn_calc_type,
        "stone_rate":item.stone_rate,
        "stone_amount":item.stone_amount,
        "show_in_lwt":item.show_in_lwt,
        "id_tag_stn_detail":item?.id_tag_stn_detail,
        "est_stn_id":item?.est_stn_id,
      }));
    }
    return stone_details;
 };

export const setOtherMetalDetails = (data) => {
  let other_metal_details = [];
  if (data.length > 0) {
    other_metal_details = data.map((item) => ({
      piece: item.piece,
      weight: item.weight,
      wastage_percentage: item.wastagePercentage,
      wastage_weight: item.wastageWeight,
      mc_type: item.mcType,
      mc_value: item.mcValue,
      other_metal_cost: item.amount,
      id_category: item.selectedCategory,
      id_purity: item.selectedPurity,
      rate_per_gram:item.ratePerGram,
      id_tag_other_metal:item?.id_tag_other_metal,
      id_est_other_metal:item?.id_est_other_metal
    }));
  }
  return other_metal_details;
};


export const calculateLessWeight = (data) =>{
  let stnWeight = 0;
  let diaWeight = 0;
  let less_weight = 0;
  data.forEach((val) => {
    let wt = 0;
    if (val.weight > 0) {
      if (parseInt(val.stone_type)==2 || parseInt(val.stone_type)==3) 
      {
        
        if(val.divided_by_value > 0){
          wt = parseFloat(val.weight / val.divided_by_value)
          
        }else{
          wt = parseFloat(val.weight);
        }
        stnWeight+= wt;

      }else{
        if(val.divided_by_value > 0){
          wt= parseFloat(val.weight / val.divided_by_value);
        }else{
          wt= parseFloat(val.weight);
        }
        diaWeight+= wt;

      }

      if (parseInt(val.show_in_lwt) == 1) {
        less_weight += parseFloat(wt);
      }
      
   
  }
  });
  return {"less_weight":less_weight,"stnWeight":stnWeight,"diaWeight":diaWeight};

}


export const validatePurchaseItemDetails = (currentRowDetails) =>{
  let allowSubmit = true;
  if(currentRowDetails.selectedProduct==='' || currentRowDetails.selectedProduct==null){
    toastfunc("Product is Missing");
    allowSubmit = false;
  }
 
  else if((currentRowDetails.piece)===''){
    toastfunc("Piece is Required..");
    allowSubmit = false;
  }else if(parseInt(currentRowDetails.piece)===0){
    toastfunc("Piece should be greater than 0..");
    allowSubmit = false;
  }
  else if(parseInt(currentRowDetails.piece) < 0){
    toastfunc("Piece should not less than 0..");
    allowSubmit = false;
  }
  else if (parseFloat(currentRowDetails.pureWeight)==0){
    toastfunc("Pure weight is missing");
    allowSubmit = false;
  }
  else if(parseFloat(currentRowDetails.grossWeight) < 0){
    toastfunc("Gross weight should be greater than 0..");
    allowSubmit = false;
  }
  else if(parseFloat(currentRowDetails.grossWeight) < 0){
    toastfunc("MRP Rate is required..");
    allowSubmit = false;
  }
  
  return allowSubmit;
}