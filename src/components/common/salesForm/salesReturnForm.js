import React, { useEffect, forwardRef, useImperativeHandle, useState, useRef } from "react";
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledButtonDropdown } from "reactstrap";
import { useForm, FormProvider } from "react-hook-form";
import { InputFieldWithDropdown, NumberInputField, TextInputField } from "../../form-control/InputGroup";
import { useSelector, useDispatch } from "react-redux";
import { toastfunc } from "../../sds-toast-style/toast-style";
import { getReturnDetails } from "../../../redux/thunks/billing";
import PreviewTable from "../../sds-table/PreviewTable";
import DeleteModal from "../../modals/DeleteModal";
import { Icon } from "../../Component";
import { getAllFinancialYear } from "../../../redux/thunks/retailMaster";
import { ProductDropdown, PurityDropdown } from "../../filters/retailFilters";
import CurrencyDisplay from "../moneyFormat/moneyFormat";
import { useProducts, useQualityCode, useStone, useUom } from "../../filters/filterHooks";
import { calculateNetWeight, calculateSalesItemCost, calculateWastageWeight, getRatePerGram, isUndefined } from "../calculations/ErpCalculations";
import LessWeightInputField from "../../form-control/LessWeight";
import { setReturnItemDetails } from "./salesUtils";


// The forwardRef function takes a render function as an argument.
// This render function receives the props and ref as arguments.

const SalesReturnForm = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billNo, setBillNo] = useState("");
  const [finYear, setFinYear] = useState("");
  const [finYearName, setFinYearName] = useState("");
  const [returnAmount, setReturnAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [delId, SetDelId] = useState();
  const [deleteModal, SetDeleteModal] = useState(false);
  const [modalActionName, SetModalActionName] = useState("");
  const toggle = () => SetDeleteModal(!deleteModal);
  const { financialYearList } = useSelector((state) => state.financialYearReducer);
  const lessWeightRef = useRef();
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const { activeProductList } = useSelector((state) => state.productReducer);
  const { activePurityList } = useSelector((state) => state.purityReducer);
  const { categoryList } = useSelector((state) => state.categoryReducer);
  const { metalPurityRateList } = useSelector((state) => state.metalPurityRateReducer);
  const { metalRateInfo } = useSelector((state) => state.metalRateReducer);
  const { catPurityRateList } = useSelector((state) => state.metalPurityRateReducer);
  const { userInfo: { settings } } = useSelector((state) => state.authUserReducer);
  const { estimationDetails } = useSelector((state) => state.authUserReducer);
  const { uom } = useUom();
  const { stone } = useStone();
  const { quality_code } = useQualityCode();
  const productRefs = useRef({}); // Store references to input fields
  
  let UomOptions = [];
  if (uom.length > 0) {
    UomOptions = uom.map((val) => ({
      value: val.uom_id,
      label: val.uom_name,
      isDefault: val.is_default,
    }));
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const methods = useForm();

  const columns = [
    { 'header': 'Product', 'accessor': 'product_name', 'textAlign': 'center' },
    { 'header': 'Piece', 'accessor': 'pieces', decimal_places: 0, 'textAlign': 'right', isTotalReq: true },
    { 'header': 'Gwt', 'accessor': 'gross_wt', decimal_places: 3, 'textAlign': 'right', isTotalReq: true },
    { 'header': 'Lwt', 'accessor': 'less_wt', decimal_places: 3, 'textAlign': 'right', isTotalReq: true },
    { 'header': 'Nwt', 'accessor': 'net_wt', decimal_places: 3, 'textAlign': 'right', isTotalReq: true },
    { 'header': 'VA', 'accessor': 'wastage_weight', decimal_places: 3, 'textAlign': 'right', isTotalReq: true },
    { 'header': 'MC', 'accessor': 'mc_value', decimal_places: 2, 'textAlign': 'right', isTotalReq: true, "isCurrency": true },
    { 'header': 'Taxable', 'accessor': 'taxable_amount', decimal_places: 2, 'textAlign': 'right', isTotalReq: true, "isCurrency": true },
    { 'header': 'Tax(%)', 'accessor': 'tax_percentage', decimal_places: 2, 'textAlign': 'right' },
    { 'header': 'Item Cost', 'accessor': 'item_cost', decimal_places: 2, 'textAlign': 'right', isTotalReq: true, "isCurrency": true },
  ];

  const initialStateItemDetails = {
    invoice_sale_item_id: "",
    est_return_item_id: "",
    isMrpItem: false,
    isMrpWeightBasedItem: false,
    selectedCategory: "",
    selectedPurity: "",
    selectedProduct: "",
    selectedDesign: "",
    selectedSubDesign: "",
    selectedSection: "",
    selectedSize: "",
    huId1: "",
    huId2: "",
    piece: 1,
    uomId: 1,
    grossWeight: 0,
    lessWeight: 0,
    stnWeight: 0,
    diaWeight: 0,
    netWeight: 0,
    sellRate: 0,
    otherMetalWeight: 0.000,
    wastagePercentage: 0,
    wastageWeight: 0,
    purchaseTouch: 0,
    purchaseWastage: 0,
    pureWeightCalType: 2,
    pureWeight: 0.000,
    purchaseMcType: 1,
    purchaseRate: 0,
    purchaseRateType: 1,
    purchaseMc: 0,
    purchaseCost: 0,
    mcValue: 0,
    totalMcValue: 0,
    flatMcValue: 0,
    mcType: 1,
    ratePerGram: 0,
    taxableAmount: 0,
    otherChargesAmount: 0.00,
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
    attributeDetails: [],
    tagId: "",
    tagCode: "",
    est_item_id: "",
    detail_id: "",
    rate_type: 1, //1-Current Rate , 2- Order Rate
    settingsMcType: '',
    settingsMinVa: '',
    settingsMinMc: '',
    settingsMaxVa: '',
    settingsMaxMc: '',
    settVaType: '',
    settFlatMc: '',
    settTouch: '',
    wastage_calc_type: '',
    remarks: "",
    subEmployee1: "",
    subEmployee2: "",
    employee: "",
  };

  const [itemDetails, setItemDetails] = useState([initialStateItemDetails]);

  const mcTypeOptions = [
    { label: "Per GM", value: 1, isDefault: true },
    { label: "Per Pcs", value: 2 },
  ];
  const inputRefs = useRef({}); // Store references to input fields



  useEffect(() => {
    setItemDetails(props?.initialReturnData);
  }, [props?.initialReturnData]);

  useImperativeHandle(ref, () => ({
    submit: handleSubmit((data) => {


    }),
    resetForm: () => {

    },
  }));

  useEffect(() => {
    setFinYear(props?.finYear);
    setFinYearName(props?.finYearName);
  }, [props?.finYear, props?.finYearName])



  const handleBillSearch = () => {
    if (props?.idBranch === '' || props?.idBranch === null) {
      toastfunc("Please Select the Branch..");
    }
    else if (props?.customer === '' || props?.customer === null) {
      toastfunc("Please Select the Customer..");
    }
    else if (billNo === '') {
      toastfunc("Please enter the Bill No..");
    }
    else {
      getTagDetails();
    }
  }

  const getTagDetails = async (tagCode) => {
    try {
      let requestData = { "fin_year_id": finYear, "bill_no": billNo, "id_branch": props?.idBranch, "id_customer": props?.customer };
      const response = await dispatch(getReturnDetails(requestData)).unwrap();
      const salesDetails = response.data.sales_details;
      const invoice_data = response.data.invoice_data;
      let allowSalesReturn = true;
      if (userInfo.settings?.sales_return_limit) {
        if (parseInt(userInfo.settings?.sales_return_limit_days) < parseInt(invoice_data.days_difference)) {
          allowSalesReturn = false;
          toastfunc("Unable to Do Sales return for this bill.Maximum sales return days is " + userInfo.settings?.sales_return_limit);
        }
      }
      if (allowSalesReturn) {
        let due_amount = invoice_data.due_amount;
        setDueAmount(due_amount);
        salesDetails.forEach(response => {
          const estItemDetails = itemDetails?.filter((result) => result.invoice_sale_item_id === response.invoice_sale_item_id);
          let itemExists = false;
          if (estItemDetails.length > 0) {
            itemExists = true;
            toastfunc("Item already Exists");
          }
          if (!itemExists) {
            const returnItemDetails = setReturnItemDetails(response);
            setItemDetails((prevItemDetails) => [...prevItemDetails, returnItemDetails]);
          }
        });
      }

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (itemDetails.length === 0) {
      setDueAmount(0);
    }
    let itemCost = 0;
    if (itemDetails.length > 0) {
      itemCost = itemDetails.reduce((sum, item) => sum + parseFloat(item.itemCost || 0), 0);
    }

    let returnAmount = parseFloat(parseFloat(dueAmount) - parseFloat(itemCost)).toFixed(2);
    if (parseFloat(returnAmount) < 0) {
      returnAmount = parseFloat(returnAmount * -1);
    }
    setReturnAmount(returnAmount);
  }, [dueAmount, itemDetails])

  const handlesDelete = (index) => {
    SetModalActionName("delete");
    SetDeleteModal(true);
    SetDelId(index);
  };

  const deleteSaleItem = (index) => {
    const updatedFormData = [...itemDetails];
    updatedFormData.splice(index, 1);
    setItemDetails(updatedFormData);
    toggle();
  }

  const handleFormChange = (index, field, value) => {
    let currentItem = itemDetails[index];
    if (field == 'selectedProduct' && currentItem?.selectedCategory !== '') {
      let ratePerGram = getRatePerGram(categoryList, metalPurityRateList, metalRateInfo, currentItem?.selectedCategory, currentItem?.selectedPurity, catPurityRateList, settings)
      setItemDetails((prevValues) => {
        const updatedValues = [...prevValues];
        const updatedObject = { ...updatedValues[index] };
        updatedObject['ratePerGram'] = ratePerGram;
        updatedValues[index] = updatedObject;
        return updatedValues;
      });
    }
    if (field == 'selectedPurity' && currentItem?.selectedProduct) {
        let product = activeProductList.find((val) => val.pro_id === currentItem?.selectedProduct);

      let ratePerGram = getRatePerGram(categoryList, metalPurityRateList, metalRateInfo, product?.cat_id, value, catPurityRateList, settings)
      setItemDetails((prevValues) => {
        const updatedValues = [...prevValues];
        const updatedObject = { ...updatedValues[index] };
        updatedObject['ratePerGram'] = ratePerGram;
        updatedValues[index] = updatedObject;
        return updatedValues;
      });
    }
    if (field == 'grossWeight') {
        let product = activeProductList.find((val) => val.pro_id === currentItem?.selectedProduct);

        let wastage_calc_type = product?.wastage_calc_type;

        let  tax_type = product?.tax_type;
        let  tax_id = product?.tax_id;
          //taxPercentage = product?.tax_percentage;
        let  catId = product?.cat_id;

        const net_weight = calculateNetWeight({
          gross_weight: value,
          less_weight: currentItem.lessWeight,
          other_metal_weight: 0
        });

        let taxPercentage = isUndefined(currentItem?.taxPercentage);

        const itemCostDetails = calculateSalesItemCost({
          piece: currentItem?.piece,
          grossWeight: value,
          netWeight: net_weight,
          wastageWeight: currentItem?.wastageWeight,
          pureWeight: currentItem?.pureWeight,
          mcType: currentItem?.mcType,
          mcValue: currentItem?.mcValue,
          flatMcValue: currentItem?.flatMcValue,
          taxType: tax_type,
          taxPercentage: taxPercentage,
          productDetails: product,
          ratePerGram: currentItem?.ratePerGram,
          stoneAmount: currentItem?.stoneAmount,
          otherMetalAmount: currentItem?.otherMetalAmount,
          otherChargesAmount: currentItem?.otherChargesAmount,
          sellRate: (currentItem?.isMrpItem || currentItem?.isMrpWeightBasedItem ? currentItem?.ratePerGram : 0),
          invoiceTo: props?.invoiceTo,
          settingsMcType: currentItem?.settingsMcType,
          settingsBillingType: props?.settingsBillingType,
          deliveryLocation: props?.deliveryLocation,
          customerSearch: props?.customerSearch,
          idBranch: props?.idBranch,
        });
      setItemDetails((prevValues) => {
        const updatedValues = [...prevValues];
        const updatedObject = { ...updatedValues[index] };
        updatedObject['netWeight'] = net_weight;
        updatedObject['tax_id'] = tax_id;
        updatedObject['taxType'] = tax_type;
        updatedObject['selectedCategory'] = catId;
        updatedObject['itemCost'] = itemCostDetails.item_cost;
        updatedObject['taxAmount'] = itemCostDetails.taxAmount;
        updatedObject['total_mc_value'] = itemCostDetails.total_mc_value;
        updatedObject['discountAmount'] = 0;
        updatedObject['taxableAmount'] = itemCostDetails.taxable_amount,
        updatedObject['cgst'] = itemCostDetails.cgst;
        updatedObject['igst'] = itemCostDetails.igst;
        updatedObject['sgst'] = itemCostDetails.sgst;
        updatedValues[index] = updatedObject;
        return updatedValues;
      });
    }
     if (field == 'ratePerGram') {
        let product = activeProductList.find((val) => val.pro_id === currentItem?.selectedProduct);

        const itemCostDetails = calculateSalesItemCost({
          piece: currentItem?.piece,
          grossWeight: currentItem?.grossWeight,
          netWeight: currentItem?.netWeight,
          wastageWeight: currentItem?.wastageWeight,
          pureWeight: currentItem?.pureWeight,
          mcType: currentItem?.mcType,
          mcValue: currentItem?.mcValue,
          flatMcValue: currentItem?.flatMcValue,
          taxType: currentItem.taxType,
          taxPercentage: currentItem.taxPercentage,
          productDetails: product,
          ratePerGram: value,
          stoneAmount: currentItem?.stoneAmount,
          otherMetalAmount: currentItem?.otherMetalAmount,
          otherChargesAmount: currentItem?.otherChargesAmount,
          sellRate: (currentItem?.isMrpItem || currentItem?.isMrpWeightBasedItem ? currentItem?.ratePerGram : 0),
          invoiceTo: props?.invoiceTo,
          settingsMcType: currentItem?.settingsMcType,
          settingsBillingType: props?.settingsBillingType,
          deliveryLocation: props?.deliveryLocation,
          customerSearch: props?.customerSearch,
          idBranch: props?.idBranch,
        });
      setItemDetails((prevValues) => {
        const updatedValues = [...prevValues];
        const updatedObject = { ...updatedValues[index] };
        updatedObject['itemCost'] = itemCostDetails.item_cost;
        updatedObject['taxAmount'] = itemCostDetails.taxAmount;
        updatedObject['total_mc_value'] = itemCostDetails.total_mc_value;
        updatedObject['discountAmount'] = 0;
        updatedObject['taxableAmount'] = itemCostDetails.taxable_amount,
        updatedObject['cgst'] = itemCostDetails.cgst;
        updatedObject['igst'] = itemCostDetails.igst;
        updatedObject['sgst'] = itemCostDetails.sgst;
        updatedValues[index] = updatedObject;
        return updatedValues;
      });
     }

    if (field == 'itemCost') {
 
      let rate  = parseFloat(isUndefined(parseFloat(value)/  parseFloat(currentItem.grossWeight))).toFixed(2)

      setItemDetails((prevValues) => {
        const updatedValues = [...prevValues];
        const updatedObject = { ...updatedValues[index] };
        updatedObject['ratePerGram'] = rate;
        updatedValues[index] = updatedObject;
        return updatedValues;
      });
     }

    setItemDetails((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;
      return updatedValues;
    });
  };


  const handleStoneDetails = (index, field, data) => {
    handleFormChange(index, field, data);
  };

  useEffect(() => {
    //if(returnData.length > 0){
    props?.onUpdateReturnItemData(itemDetails);
    props?.handleReturnItemCost(returnAmount);
    //}
  }, [returnAmount]);



  const handleOptionSelectChange = (value, fin_year_name) => {
    setFinYear(value);
    setFinYearName(fin_year_name);
  };

  const validateItemDetails = (currentRowDetails) => {
    let allowSubmit = true;
    let product = activeProductList.find((val) => val.pro_id === currentRowDetails?.selectedProduct);
    if (currentRowDetails.selectedProduct === '' || currentRowDetails.selectedProduct == null) {
      toastfunc("Product is Missing");
      allowSubmit = false;
    }
    else if (currentRowDetails.selectedPurity === '' || currentRowDetails.selectedPurity == null) {
      toastfunc("Purity is Missing");
      allowSubmit = false;
    }
    else if ((currentRowDetails.piece) === '') {
      toastfunc("Piece is Required..");
      allowSubmit = false;
    } else if (parseInt(currentRowDetails.piece) === 0) {
      toastfunc("Piece should be greater than 0..");
      allowSubmit = false;
    }
    else if (parseInt(currentRowDetails.piece) < 0) {
      toastfunc("Piece should not less than 0..");
      allowSubmit = false;
    }
    else if (parseInt(product.sales_mode) == 1 && parseFloat(currentRowDetails.grossWeight) == 0) {
      toastfunc("Gross weight should be greater than 0..");
      allowSubmit = false;
    }
    else if (parseInt(product.fixed_rate_type) == 1 && parseInt(product.sales_mode) == 0 && parseFloat(currentRowDetails.grossWeight) == 0) {
      toastfunc("Gross weight should be greater than 0..");
      allowSubmit = false;
    }
    else if (parseInt(product.fixed_rate_type) == 2 && parseInt(product.sales_mode) == 0 && parseFloat(currentRowDetails.ratePerGram) == 0) {
      toastfunc("MRP should be greater than 0..");
      allowSubmit = false;
    }
    else if (parseInt(currentRowDetails.grossWeight) < 0) {
      toastfunc("Gross weight should be greater than 0..");
      allowSubmit = false;
    }
    else if (parseInt(currentRowDetails.item_cost) === 0 || currentRowDetails.item_cost === '') {
      toastfunc("Cost is required..");
      allowSubmit = false;
    }
    return allowSubmit;
  }

  const handleAddItem = (rowIndex) => {
    let allowAdd = true;
    let currentRowDetails = itemDetails[rowIndex];
    allowAdd = validateItemDetails(currentRowDetails);
    if (allowAdd) {
      setItemDetails((prevItemDetails) => [...prevItemDetails, initialStateItemDetails]);
    }
    // inputRefs.current.push(null);
  };
  useEffect(() => {
    // Focus on the last input field when a new row is added
    if (props?.billTypeTab && props?.billTypeTab == "3") {
      console.log("billTypeTab",productRefs,props);
      if (productRefs?.current  ) {
        const lastIndex = itemDetails.length - 1;
        productRefs.current[lastIndex]?.focus();
      }
    }
  }, [itemDetails.length,props?.billTypeTab]); // Runs every time itemDetails changes

  const handleDelete = (index) => {
    const updatedFormData = [...itemDetails];
    updatedFormData.splice(index, 1);
    setItemDetails(updatedFormData);
  };


  // useEffect(() => {
  //   if (itemDetails.length > 0) {
  //     const updatedItemDetails = itemDetails.map((item) => {
  //       let tax_type = '';
  //       let tax_id = '';
  //       let taxPercentage = isUndefined(item?.taxPercentage);
  //       let catId = '';
  //       let wastage_calc_type = '';
  //       let stone_details = item?.stoneDetails;
  //       let product = '';
  //       let isMrpItem = false;
  //       let isMrpWeightBasedItem = false;
  //       if (item?.selectedProduct !== '') {
  //         product = activeProductList.find((val) => val.pro_id === item?.selectedProduct);
  //         let wastage_calc_type = product?.wastage_calc_type;



  //         tax_type = product?.tax_type;
  //         tax_id = product?.tax_id;
  //         //taxPercentage = product?.tax_percentage;
  //         catId = product?.cat_id;

  //         if (parseInt(product?.fixed_rate_type) === 2 && parseInt(product?.sales_mode) === 0) {
  //           isMrpItem = true;
  //         }
  //         if (parseInt(product?.sales_mode) === 0 && parseInt(product?.fixed_rate_type) === 1) {
  //           isMrpWeightBasedItem = true;
  //         }


  //       }

  //       const net_weight = calculateNetWeight({
  //         gross_weight: item.grossWeight,
  //         less_weight: item.lessWeight,
  //         other_metal_weight: 0
  //       });

  //       const calculated_weight = calculateWastageWeight({
  //         grossWeight: item?.grossWeight,
  //         netWeight: item?.netWeight,
  //         wastagePercentage: item?.wastagePercentage,
  //         calculationType: wastage_calc_type
  //       });

  //       const itemCostDetails = calculateSalesItemCost({
  //         piece: item?.piece,
  //         grossWeight: item?.grossWeight,
  //         netWeight: item?.netWeight,
  //         wastageWeight: item?.wastageWeight,
  //         pureWeight: item?.pureWeight,
  //         mcType: item?.mcType,
  //         mcValue: item?.mcValue,
  //         flatMcValue: item?.flatMcValue,
  //         taxType: tax_type,
  //         taxPercentage: taxPercentage,
  //         productDetails: product,
  //         ratePerGram: item?.ratePerGram,
  //         stoneAmount: item?.stoneAmount,
  //         otherMetalAmount: item?.otherMetalAmount,
  //         otherChargesAmount: item?.otherChargesAmount,
  //         sellRate: (item?.isMrpItem || item?.isMrpWeightBasedItem ? item?.ratePerGram : 0),
  //         invoiceTo: props?.invoiceTo,
  //         settingsMcType: item?.settingsMcType,
  //         settingsBillingType: props?.settingsBillingType,
  //         deliveryLocation: props?.deliveryLocation,
  //         customerSearch: props?.customerSearch,
  //         idBranch: props?.idBranch,
  //       });

  //       return {
  //         ...item,
  //         isMrpItem: isMrpItem,
  //         isMrpWeightBasedItem: isMrpWeightBasedItem,
  //         netWeight: net_weight,
  //         wastageWeight: calculated_weight,
  //         tax_id: tax_id,
  //         taxType: tax_type,
  //         taxPercentage: taxPercentage,
  //         selectedCategory: catId,
  //         itemCost: itemCostDetails.item_cost,
  //         taxAmount: itemCostDetails.taxAmount,
  //         totalMcValue: itemCostDetails.total_mc_value,
  //         discountAmount: itemCostDetails.discount_amount,
  //         taxableAmount: itemCostDetails.taxable_amount,
  //         cgst: itemCostDetails.cgst,
  //         sgst: itemCostDetails.sgst,
  //         igst: itemCostDetails.igst,
  //       };
  //     });
  //     // Only update state if there are changes
  //     if (JSON.stringify(updatedItemDetails) !== JSON.stringify(itemDetails)) {
  //       setItemDetails(updatedItemDetails);
  //     }
  //   }

  // }, [itemDetails]); // Run whenever itemDetails changes

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <Row md={12} className={"form-control-sm"}>
          <Col md={4} className="form-control-sm">
            <div className="form-control-wrap">
              <div className="input-group">
                <div className="input-group-append">
                  <UncontrolledButtonDropdown style={{ height: "29px" }} >
                    <DropdownToggle tag="button" className="btn btn-outline-primary btn-dim dropdown-toggle">
                      <span>{finYearName}</span>
                      <Icon name="chevron-down" className="mx-n1"></Icon>
                    </DropdownToggle>
                    <DropdownMenu>
                      <ul className="link-list-opt no-bdr">
                        {financialYearList.rows?.map((option) => (
                          <li key={option.fin_id}>
                            <DropdownItem key={option.fin_id} onClick={() => handleOptionSelectChange(option.fin_id, option.fin_year_name)}>
                              {option.fin_year_name}
                            </DropdownItem>
                          </li>
                        ))}
                      </ul>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                </div>
                <div className="input-group-append"  >
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"billNo"}
                    placeholder="Bill No"
                    value={billNo}
                    SetValue={(value) => {
                      setBillNo(value);
                    }}
                  />
                </div>
                <div className="input-group-append" style={{ height: "29px" }}>
                  <Button outline color="primary" className="btn-dim" onClick={handleBillSearch}>
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row md={12} className="form-group row g-4">
          <Col md={12}>
            <div className="table-responsive" style={{ marginTop: "16px", overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
              <table className="table table-bordered">
                <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#fff' }}>
                  <tr>
                    <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Product</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Purity</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Pcs</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Gwt</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Lwt</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Nwt</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>V.A(%)</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>MC</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Rate</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Tax</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Item Cost</th>
                    <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {itemDetails.length > 0 && itemDetails.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>
                        <div style={{ width: "150px" }}>
                          <ProductDropdown
                            register={register}
                            id={"selectedProduct_" + rowIndex}
                            products={activeProductList}
                            selectedProduct={item?.selectedProduct}
                            onProductChange={(value) => {
                              handleFormChange(rowIndex, "selectedProduct", value);
                              handleFormChange(rowIndex, "selectedPurity", "");
                            }}
                            isRequired={false}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            classNamePrefix={"custom-select"}
                             ref={(el) => (productRefs.current[rowIndex] = el)}
                          ></ProductDropdown>



                        </div>
                      </td>
                      <td>
                        <div style={{ width: "120px" }}>
                          <PurityDropdown
                            register={register}
                            id={"selectedPurity_" + rowIndex}
                            purities={activePurityList}
                            categories={categoryList}
                            selectedCategory={item?.selectedCategory}
                            onPurityChange={(value) => {
                              handleFormChange(rowIndex, "selectedPurity", value);
                            }}
                            selectedPurity={item?.selectedPurity}
                            isRequired={true}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            message={errors.selectedPurity && "Purity is Required"}
                            readOnly={props?.readOnly}
                            classNamePrefix={"custom-select"}
                          ></PurityDropdown>
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "60px" }}>
                          <NumberInputField
                            placeholder="Pcs"
                            id={"piece_" + rowIndex}
                            value={item?.piece}
                            isRequired={true}
                            min={0}
                            type={"number"}
                            setValue={setValue}
                            handleKeyDownEvents={true}
                            handleDecimalDigits={true}
                            decimalValues={0}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "piece", value);
                            }}
                            minError={"Pcs should less than or equal to 0"}
                            maxError={"Pcs greater than or equal to 0"}
                            reqValueError={"Pcs is Required"}
                            register={register}
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "120px" }}>
                          <InputFieldWithDropdown
                            register={register}
                            placeholder="Gross weight"
                            id={"grossWeight_" + rowIndex}
                            value={item?.grossWeight}
                            isRequired={true}
                            min={0}
                            readOnly={item?.isMrpItem}
                            type={"number"}
                            optionId={"uom_id_" + rowIndex}
                            name={"uom_id_" + rowIndex}
                            options={UomOptions}
                            setValue={setValue}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "grossWeight", value);
                            }}
                            handleKeyDownEvents={true}
                            handleDecimalDigits={true}
                            decimalValues={3}
                            onDropDownChange={(value) => {
                              handleFormChange(rowIndex, "uom_id", value);
                            }}
                            selectedOption={item?.uom_id}
                            handleFormKeyDownEvents= {(event)=>{
                               if ([ "Tab"].includes(event.key)){
                                  if( inputRefs?.current && inputRefs?.current[rowIndex]){
                                    event.preventDefault(); 
                                    inputRefs.current[rowIndex].select();
                                    console.log(inputRefs.current);
                                  }
                               }
                            }}
                            minError={"Gross weight should less than or equal to 0"}
                            maxError={"Gross Weight greater than or equal to 0"}
                            reqValueError={"Gross weight is Required"}
                          ></InputFieldWithDropdown>{" "}
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "100px" }}>
                          <LessWeightInputField
                            register={register}
                            placeholder="Less Weight"
                            id={"lessWeight_" + rowIndex}
                            value={item?.lessWeight}
                            isRequired={false}
                            min={0}
                            uom={uom}
                            gross_weight={item?.grossWeight}
                            less_weight={item?.lessWeight}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "lessWeight", value);
                            }}
                            SetStnWeight={(value) => handleFormChange(rowIndex, "stnWeight", value)}
                            SetDiaWeight={(value) => handleFormChange(rowIndex, "diaWeight", value)}
                            SetStoneDetails={(value) => {
                              handleStoneDetails(rowIndex, "stoneDetails", value);
                            }}
                            stone_details={item?.stoneDetails}
                            stone={stone}
                            quality_code={quality_code}
                            ref={lessWeightRef}
                          />
                        </div>
                      </td>
                      <td>{item?.netWeight}</td>
                      <td>
                        <div style={{ width: "70px" }}>
                          <NumberInputField
                            placeholder="V.A(%)"
                            id={"wastagePercentage_" + rowIndex}
                            value={item?.wastagePercentage}
                            isRequired={true}
                            min={0}
                            max={100}
                            type={"number"}
                            setValue={setValue}
                            handleKeyDownEvents={true}
                            handleDecimalDigits={true}
                            decimalValues={0}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "wastagePercentage", value);
                            }}
                            minError={"Pcs should less than or equal to 0"}
                            maxError={"Pcs greater than or equal to 0"}
                            reqValueError={"Pcs is Required"}
                            register={register}
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "120px" }}>
                          <InputFieldWithDropdown
                            isDisabled={props?.isMcVaDisable}
                            isSelectDisabled={props?.isMcVaDisable}
                            register={register}
                            placeholder="MC"
                            id={"mcValue_" + rowIndex}
                            value={item?.mcValue}
                            isRequired={true}
                            min={0}
                            type={"number"}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "mcValue", value);
                              clearErrors("mcValue");
                            }}
                            optionId={"mcType_" + rowIndex}
                            name={"mcType"}
                            options={mcTypeOptions}
                            setValue={setValue}
                            onDropDownChange={(value) => {
                              handleFormChange(rowIndex, "mcType", value);
                            }}
                            selectedOption={item?.mcType}
                            message={errors.mcValue && errors.mcValue.message}
                          ></InputFieldWithDropdown>
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "90px" }}>
                                {/* <div className="form-control-wrap">
                                  <input
                                    className="form-control form-control-sm no-spinner"
                                    id={"ratePerGram_" + rowIndex}
                                    type="number"
                                    readOnly={false}
                                    placeholder={"Rate"}
                                    {...register("ratePerGram_" + rowIndex)}
                                    value={item?.ratePerGram}
                                    onChange={(e) => {
                                      let inputValue = e.target.value;
                                      handleFormChange(rowIndex, "ratePerGram", inputValue);
                                    }}
                                    onWheel={(e) => e.target.blur()}
                                    ref={(el) => (inputRefs.current[rowIndex] = el)}
                                  />
                                </div> */}
                          <NumberInputField
                            placeholder="Rate"
                            id={"ratePerGram_" + rowIndex}
                            value={item?.ratePerGram}
                            isRequired={true}
                            min={0}
                            type={"number"}
                            setValue={setValue}
                            handleKeyDownEvents={true}
                            handleDecimalDigits={true}
                            decimalValues={0}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "ratePerGram", value);
                            }}
                            minError={"Pcs should less than or equal to 0"}
                            maxError={"Pcs greater than or equal to 0"}
                            reqValueError={"Pcs is Required"}
                            register={register}
                             
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "90px" }}>
                          <NumberInputField
                            placeholder="Tax"
                            id={"tax_" + rowIndex}
                            value={item?.taxPercentage}
                            isRequired={true}
                            min={0}
                            type={"number"}
                            setValue={setValue}
                            handleKeyDownEvents={true}
                            handleDecimalDigits={true}
                            decimalValues={0}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "taxPercentage", value);
                            }}
                            minError={"Tax should less than or equal to 0"}
                            maxError={"Tax greater than or equal to 0"}
                            reqValueError={"Tax is Required"}
                            register={register}
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "90px" }}>
                                <input
                                    className="form-control form-control-sm no-spinner"
                                    id={"itemCost_" + rowIndex}
                                    type="number"
                                    readOnly={false}
                                    placeholder={"Item Cost"}
                                    {...register("itemCost_" + rowIndex)}
                                    value={item?.itemCost}
                                    onChange={(e) => {
                                      let inputValue = e.target.value;
                                      handleFormChange(rowIndex, "itemCost", inputValue);

                                    }}
                                    onWheel={(e) => e.target.blur()}
                                    ref={(el) => (inputRefs.current[rowIndex] = el)}
                                  />
                          {/* <NumberInputField
                            placeholder="Item Cost"
                            id={"itemCost_" + rowIndex}
                            value={item?.itemCost}
                            isRequired={true}
                            min={0}
                            type={"number"}
                            setValue={setValue}
                            handleKeyDownEvents={true}
                            handleDecimalDigits={true}
                            decimalValues={2}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "itemCost", value);
                            }}
                            minError={"Item Cost should less than or equal to 0"}
                            maxError={"Item Cost greater than or equal to 0"}
                            reqValueError={"Item Cost is Required"}
                            register={register}
                          /> */}
                        </div>
                      </td>
                      {/* <td>{(item?.taxPercentage!=='' ? item?.taxPercentage+" %" :'') }</td> */}
                      {/* <td>{<CurrencyDisplay value={item?.itemCost} />}</td> */}
                      <td>
                        {rowIndex == itemDetails?.length - 1 && (
                          <Button
                            color="primary"
                            size="sm"
                            className="btn-icon btn-white btn-dim"
                            onClick={() => handleAddItem(rowIndex)}
                          >
                            <Icon name="plus" />
                          </Button>
                        )}
                        <Button
                          color="primary"
                          size="sm"
                          className="btn-icon btn-white btn-dim"
                          onClick={() => handleDelete(rowIndex)}
                        >
                          <Icon name="trash-fill" />
                        </Button>

                      </td>
                    </tr>
                  ))}

                </tbody>
                <tfoot style={{ position: 'sticky', bottom: 0, zIndex: 10, backgroundColor: '#fff' }}>
                  <tr style={{ fontWeight: 'bold' }}>
                    <td style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Total</td>
                    {/* {columns.map((column, index) => (
                          <td key={index} style={{ "textAlign": column?.textAlign }}>
                            {column.isTotalReq ? column.isCurrency ? <CurrencyDisplay value={calculateTotal(column.accessor)} /> : (calculateTotal(column.accessor)) : ''}
                          </td>
                        ))} */}
                    <th style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}></th>
                    <th style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#f8f9fa', textAlign:"left" }}>0.00</th>
                    <th style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#f8f9fa' ,textAlign:"left"}}>0.00</th>
                    <th style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#f8f9fa' ,textAlign:"left"}}>0.00</th>
                    <th style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#f8f9fa' ,textAlign:"left"}}>0.00</th>
                    <th style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}></th>
                    <th style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}></th>
                    <th style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#f8f9fa' ,textAlign:"left"}}>0.00</th>
                    <th style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}></th>
                    <th style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#f8f9fa' ,textAlign:"left"}}>0.00</th>
                    <th ></th>
                    
                  </tr>
                </tfoot>
              </table>
            </div>
          </Col>
        </Row>
      </FormProvider>
      <DeleteModal
        actionName={"Delete"}
        modal={deleteModal}
        toggle={toggle}
        name={"Item"}
        title={"Billing"}
        clickAction={deleteSaleItem}
      />
    </React.Fragment>
  );
});

export default SalesReturnForm;
