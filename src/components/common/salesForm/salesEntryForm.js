import React, { useEffect, forwardRef, useImperativeHandle, useState, useRef } from "react";
import { Button, Col, Row,Tooltip } from "reactstrap";
import { useForm, FormProvider } from "react-hook-form";
import { InputFieldWithDropdown, InputGroupField, NumberInputField, TextInputField } from "../../form-control/InputGroup";
import { useSelector, useDispatch } from "react-redux";
import { toastfunc } from "../../sds-toast-style/toast-style";
import { getReturnDetails } from "../../../redux/thunks/billing";
import DeleteModal from "../../modals/DeleteModal";
import { Icon, TooltipComponent } from "../../Component";
import { ActiveEmployeeDropdown, DesignDropdown, ProductDropdown, PurityDropdown, SectionDropdown, SizeDropdown, SubDesignDropdown } from "../../filters/retailFilters";
import CurrencyDisplay from "../moneyFormat/moneyFormat";
import { useCatPurityRate, useDesigns, useDiamondRate, useMcVaSetiings, useSubDesigns, useUom, useProductSections, useStone, useQualityCode, useSize } from "../../filters/filterHooks";
import { calculateNetWeight, calculatePureWeight, calculateSalesItemCost, calculateWastageWeight, getRatePerGram, isUndefined } from "../calculations/ErpCalculations";
import LessWeightInputField from "../../form-control/LessWeight";
import { calculateLessWeight, setReturnItemDetails, setSalesItem, validateSaleItemDetails } from "./salesUtils";
import { getPartlySoldTagDetailsByCode, getTagDetailsByCode } from "../../../redux/thunks/inventory";
import EmployeeModal from "../../modals/EmployeeModal";
import OtherChargesForm from "../../form-control/otherChargesInput";
import { getNonTagStock } from "../../../redux/thunks/inventory";
import { v4 as uuid } from "uuid";
import MultiImageDropzone from "../../modals/MultiImageDropzone";
import QuillEditorModal from "../../modals/QuillEditorModal";
import MultiVideoDropzone from "../../modals/MultiVideoDropzone";
import MultiVoiceRecordDropzone from "../../modals/MultiVoiceRecordDropzone";
import { useBillSettingContext } from "../../../contexts/BillSettingContext";


// The forwardRef function takes a render function as an argument.
// This render function receives the props and ref as arguments.

const SalesEntryForm = forwardRef(({ imageToggle,videoToggle,voiceToggle, itemDetails, productFieldRef, setItemDetails, itemType = 0,orderImages, SetOrderImages, orderVideos, SetOrderVideos,orderVoices, SetOrderVoices,employee = '', ...props }, ref) => {
  const dispatch = useDispatch();
  const { billSettingType } = useBillSettingContext();
  const { nonTagStock } = useSelector((state) => state.lotReducer);
  const [billNo, setBillNo] = useState("");
  const [finYear, setFinYear] = useState("");
  const [finYearName, setFinYearName] = useState("");
  const [salesAmount, setSalesAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [delId, SetDelId] = useState();
  const [deleteModal, SetDeleteModal] = useState(false);
  const [modalActionName, SetModalActionName] = useState("");
  const toggle = () => SetDeleteModal(!deleteModal);
  const { financialYearList } = useSelector((state) => state.financialYearReducer);
  const lessWeightRef = useRef();
  const otherChargesRef = useRef();
  const inputRefs = useRef({}); // Store references to input fields
  const { userInfo, userInfo: { settings } } = useSelector((state) => state.authUserReducer);
  const { activeProductList } = useSelector((state) => state.productReducer);
  const { size } = useSize();
  const { activePurityList } = useSelector((state) => state.purityReducer);
  const { categoryList } = useSelector((state) => state.categoryReducer);
  const { metalPurityRateList } = useSelector((state) => state.metalPurityRateReducer);
  const { metalRateInfo } = useSelector((state) => state.metalRateReducer);
  const { estimationDetails } = useSelector((state) => state.authUserReducer);
  const { activeDiamondRateList } = useSelector((state) => state.diamondRateMasterReducer);
  const { activeEmployeeDropdown } = useSelector((state) => state.employeeReducer);  
  const { uom } = useUom();
  const { diamondRate } = useDiamondRate();
  const { mcVaSetiings } = useMcVaSetiings();
  const { designs } = useDesigns();
  const { subDesigns } = useSubDesigns();
  const { sections } = useProductSections();
  const { catPurityRate } = useCatPurityRate();
  const { stone } = useStone();
  const { quality_code } = useQualityCode();

  const [imageModal, setImageModal] = useState(false);
  const [videoModal, SetVideoModal] = useState(false);
  const [voiceModal, setVoiceModal] = useState(false);
  // const [orderImages, SetOrderImages] = useState([]);
  // const [orderVideos, SetOrderVideos] = useState([]);
  // const [orderVoices, SetOrderVoices] = useState([]); 
  const handleImageModal = (rowIndex) =>
  {
      setImageModal(!imageModal);
      setCurrentRowIndex(rowIndex);
  };

   
    const toggleVideoModal = () => {
      SetVideoModal(!videoModal);
    };
  
    const toggleVoiceModal = () => {
      setVoiceModal(!voiceModal);
    };

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

  const [currentRowIndex, setCurrentRowIndex] = useState("");
  const [employeeModal, SetEmployeeModal] = useState(false);
  const toggleEmployeeModal = () => SetEmployeeModal(!employeeModal);

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

  let billTypeOptions = [
    {
      label: "Tagged",
      value: 0,
    },
    {
      label: "Non Tagged",
      value: 1,
    },
    {
      label: "Home Bill",
      value: 2,
    },
  ]

  const PureCalcTypeOptions = [{ 'label': 'Touch+VA', 'value': 2, 'isDefault': true }, { 'label': 'Weight+VA', 'value': 1 }, { 'label': 'Wt * VA %', 'value': 3 }];



  const initialStateItemDetails = {
    id_sales_item_detail: uuid(),
    isPartial: 0,
    isGrossWeightDisable: false,
    maxGrossWeight: 0,
    invoice_sale_item_id: "",
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
    settFlatMcMin: '',
    settFlatMcMax: '',
    settTouch: '',
    wastage_calc_type: '',
    remarks: "",
    subEmployee1: "",
    subEmployee2: "",
    dealerName: "",
    employee: "",
    item_type: 0,
    tagGrossWeight: 0,
    tagStoneDetails: 0,
    vaDiscount: 0,
    mcDiscount: 0,
    itemDiscount: 0,
    wastageAfterDiscount: 0,
  };

  //const [itemDetails, setItemDetails] = useState([initialStateItemDetails]);

  const mcTypeOptions = [
    { label: "Per GM", value: 1, isDefault: true },
    { label: "Per Pcs", value: 2 },
  ];



  // useEffect(() => { 
  //       setItemDetails([initialStateItemDetails]);
  // }, [dispatch]);

  useEffect(() => {
    const getNonTagAvailableStockDetails = async () => {
      if (props?.idBranch !== null && props?.idBranch != '') {
        try {
          await dispatch(getNonTagStock(props?.idBranch)).unwrap();
        } catch (error) {
          console.error(error);
        }
      }
    };
    getNonTagAvailableStockDetails();
  }, [dispatch, props?.idBranch]);

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
      getBillDetails();
    }
  }



  const getBillDetails = async (tagCode) => {
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


  const [showReview, setShowReview] = useState(false);
  const [content, setContent] = useState(""); // Store the content for the Quill editor

  const handleSaveContent = (newContent) => {
    // Handle saved content (you can update state or make an API call here)
    setContent(newContent);
  };
  const toggleReviewModal = () => setShowReview((prev) => !prev);



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

  const handleWastageDetails = (index, item, value) => {
    let settingsMinVa = item?.settingsMinVa;
    let settingsMaxVa = item?.settingsMaxVa;

    if (settingsMinVa !== '' && settingsMinVa !== 0) {
      if (parseFloat(value) < parseFloat(settingsMinVa)) {
        toastfunc("Minimum V.A % is " + settingsMinVa);
        value = settingsMaxVa;
      }
    }
    if (settingsMaxVa !== '' && settingsMaxVa !== 0) {
      if (parseFloat(value) > parseFloat(settingsMaxVa)) {
        toastfunc("Maximum V.A % is " + settingsMaxVa);
        value = settingsMaxVa;
      }
    }
    setItemDetails((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject["wastagePercentage"] = value;
      updatedValues[index] = updatedObject;
      return updatedValues;
    });

  };

  const handleMakingChargeDetails = (index, item, value) => {
    let settingsMinMc = item?.settingsMinMc;
    let settingsMaxMc = item?.settingsMaxMc;

    if (settingsMinMc !== '' && settingsMinMc !== 0) {
      if (parseFloat(value) < parseFloat(settingsMinMc)) {
        toastfunc("Minimum MC is " + settingsMaxMc);
        value = settingsMaxMc;
      }
    }
    if (settingsMaxMc !== '' && settingsMaxMc !== 0) {
      if (parseFloat(value) > parseFloat(settingsMaxMc)) {
        toastfunc("Maximum MC is " + settingsMaxMc);
        value = settingsMaxMc;
      }
    }
    setItemDetails((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject["mcValue"] = value;
      updatedValues[index] = updatedObject;
      return updatedValues;
    });

  };

  const handleFormChange = (index, field, value) => {
    setItemDetails((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      if ((field === "selectedProduct" || field === "selectedPurity" || field === "selectedDesign" || field === "selectedSubDesign")) {
        if (updatedObject?.selectedCategory !== "" && updatedObject?.selectedPurity !== "") {
          updatedObject["ratePerGram"] = getRatePerGram(
            categoryList,
            metalPurityRateList,
            metalRateInfo,
            updatedObject?.selectedCategory,
            updatedObject?.selectedPurity,
            catPurityRate,
            settings
          );
        } else {
          updatedObject["ratePerGram"] = 0;
        }

        if (field == 'selectedProduct') {
          let product = activeProductList.find((val) => val.pro_id === value);
          if (parseInt(product?.sales_mode) == 1) {
            updatedObject['isMrpItem'] = false;
            updatedObject['isMrpWeightBasedItem'] = false;
          }
          else if (parseInt(product?.sales_mode) == 0) {
            if (parseInt(product?.fixed_rate_type) == 1) {
              updatedObject['isMrpItem'] = false;
              updatedObject['isMrpWeightBasedItem'] = true;
            } else {
              updatedObject['isMrpItem'] = true;
              updatedObject['isMrpWeightBasedItem'] = true;
            }
          } else {
            updatedObject['isMrpItem'] = false;
            updatedObject['isMrpWeightBasedItem'] = false;
          }
        }

      }
      if ((field === "grossWeight" || field === "selectedProduct" || field === "selectedPurity" || field === "selectedDesign" || field === "selectedSubDesign")) {

        let mcVaSettings = setMaxMcVaBasedOnSettings(updatedObject);
        updatedObject['settingsMcType'] = mcVaSettings.settMcType;
        updatedObject['settingsMinVa'] = isUndefined(mcVaSettings.settMinVa);
        updatedObject['settingsMinMc'] = isUndefined(mcVaSettings.settMinMc);
        updatedObject['settingsMaxVa'] = isUndefined(mcVaSettings.settMaxVa);
        updatedObject['settingsMaxMc'] = isUndefined(mcVaSettings.settMaxMc);
        updatedObject['settVaType'] = (mcVaSettings.settVaType);
        updatedObject['settFlatMcMin'] = isUndefined(mcVaSettings.settFlatMcMin);
        updatedObject['settFlatMcMax'] = isUndefined(mcVaSettings.settFlatMcMax);
        updatedObject['settTouch'] = isUndefined(mcVaSettings.settTouch);

        if (updatedObject['settingsMinMc'] !== '' && updatedObject['settingsMinMc'] !== 0) {
          if (parseFloat(isUndefined(updatedObject.flatMcValue)) < parseFloat(updatedObject['settFlatMcMin'])) {
          //  toastfunc("Minimum MC is " + updatedObject['settFlatMcMin']);
            updatedObject['flatMcValue'] = updatedObject['settFlatMcMax'];
          }
        }
        if (updatedObject['settingsMinMc'] !== '' && updatedObject['settingsMinMc'] !== 0) {
          if (parseFloat(isUndefined(updatedObject.mcValue)) < parseFloat(updatedObject['settingsMinMc'])) {
           // toastfunc("Minimum MC is " + settingsMaxMc);
            updatedObject['mcValue'] = updatedObject['settingsMaxMc'];
          }
        }
        if (updatedObject['settingsMinVa'] !== '' && updatedObject['settingsMinVa'] !== 0) {
          if (parseFloat(isUndefined(updatedObject.wastagePercentage)) < parseFloat(updatedObject['settingsMinVa'])) {
            //toastfunc("Minimum MC is " + settingsMaxMc);
            updatedObject['wastagePercentage'] = updatedObject['settingsMaxVa'];
          }
        }
        
      }

      if (updatedObject?.item_type == '1') {

        if (updatedObject?.selectedProduct !== "") {

          const totalSales = [...itemDetails]
            .filter(
              (item, key) =>
                key != index &&
                item.item_type == 1 &&
                item.selectedProduct === updatedObject.selectedProduct &&
                item.selectedDesign == updatedObject.selectedDesign &&
                (settings?.is_section_required === "1" ? item.selectedSection === updatedObject.selectedSection : true)
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
              val.id_product_id == updatedObject.selectedProduct &&
              val.id_design_id == updatedObject.selectedDesign &&
              (settings?.is_section_required == "1" ? val.id_section_id == updatedObject.selectedSection : true)
          );
          if (nonTagStockItems) {
            let actualStockWeight = parseFloat(
              parseFloat(nonTagStockItems?.gross_wt) - parseFloat(totalSales.totalGrossWeight)
            ).toFixed(3);
            let actualStockPcs = parseFloat(parseFloat(nonTagStockItems?.pieces) - parseFloat(totalSales.totalPieces));
            // setMaxGrossWeight(actualStockWeight);
            // setMaxPiece(actualStockPcs);
            updatedObject['maxGrossWeight'] = actualStockWeight;
            updatedObject['maxPiece'] = actualStockPcs;
          } else {
            updatedObject['maxGrossWeight'] = 0;
            updatedObject['maxPiece'] = 0;
            updatedObject['piece'] = 0;
          }

        }

      }
      if (field == 'isPartial') {
        console.log("updatedObject", updatedObject);
        if (value && updatedObject['item_type'] == 0) {
          // If partial, enable gross weight
          updatedObject['isGrossWeightDisable'] = false;
        } 
        else if (!value && updatedObject['item_type'] == 0) 
        {  
          // If not partial, disable gross weight and set it to tag gross weight
          updatedObject['isGrossWeightDisable'] = true;
          updatedObject['grossWeight'] = updatedObject['tagGrossWeight'];
          if (updatedObject['tagStoneDetails']?.length > 0) {
            updatedObject['stoneDetails'] = updatedObject['tagStoneDetails'];
            let calculatedStoneWeight = calculateLessWeight(updatedObject['tagStoneDetails']);
            updatedObject['stnWeight'] = calculatedStoneWeight.stnWeight;
            updatedObject['diaWeight'] = calculatedStoneWeight.diaWeight;
            updatedObject['lessWeight'] = calculatedStoneWeight.less_weight;
          }
        }
      }

      updatedValues[index] = updatedObject;
      return updatedValues;
    });
  };


  const handleStoneDetails = (index, field, data) => {
    handleFormChange(index, field, data);
  };

  const handleSetOtherChargesDetails = (index, field, data) => {
    handleFormChange(index, field, data);
  };



  // useEffect(() => {
  //   if(JSON.stringify(props?.initialSalesItem) !== JSON.stringify(itemDetails)){
  //     props?.onUpdateSalesItemData(itemDetails);
  //   }
  // }, [JSON.stringify(itemDetails)]);


  const handleTagSearch = (rowIndex, item, event) => {
    if (event.key === 'Enter') {

      const tagDetails = itemDetails?.filter((result, index) =>
        index !== rowIndex && result.tag_code === item.tagCode
      );
      if (item.tagCode === "") {
        toastfunc("Please Enter The Tag Code");
      } else if (props?.idBranch === "" || props?.idBranch === null) {
        toastfunc("Please Select Branch");
      } else if (tagDetails.length > 0) {
        toastfunc("Tag Code already exists");
      } else {
        getTagDetails(item, rowIndex, { tagCode: item.tagCode, idBranch: props?.idBranch });
      }
    }
  };

  const getTagDetails = async (item, rowIndex, requestData) => {
    try {
      let tagDetails = [];
      let response = {};
      if (item.item_type === 0) {
        response = await dispatch(getTagDetailsByCode(requestData)).unwrap();
      } else if (item.item_type === 2) {
        response = await dispatch(getPartlySoldTagDetailsByCode(requestData)).unwrap();
      }

      let mcVaSettings = setMaxMcVaBasedOnSettings(response);

      let tagResult = {
        ...response,
        id_product: response.tag_product_id,
        id_design: response.tag_design_id,
        id_purity: response.tag_purity_id,
        id_sub_design: response.tag_sub_design_id,
        id_section: response.tag_section_id,
        pieces: response.tag_pcs,
        gross_wt: response.tag_gwt,
        net_wt: response.tag_nwt,
        less_wt: response.tag_lwt,
        stone_wt: response.tag_stn_wt,
        dia_wt: response.tag_dia_wt,
        other_metal_wt: response.tag_other_metal_wt,
        wastage_weight: response.tag_wastage_wt,
        wastage_percentage: response.tag_wastage_percentage,
        mc_value: response.tag_mc_value,
        mc_type: response.tag_mc_type,
        sellRate: response.tag_sell_rate,
        maxGrossWeight: response.tag_gwt,
        tagGrossWeight: response.tag_gwt,
        tagStoneDetails: response.stone_details,
        // settingsMcType:mcVaSettings.settMcType,
        // settingsMinVa:isUndefined(mcVaSettings.settMinVa),
        // settingsMinMc:isUndefined(mcVaSettings.settMinMc),
        // settingsMaxVa:isUndefined(mcVaSettings.settMaxVa),
        // settingsMaxMc:isUndefined(mcVaSettings.settMaxMc),
        // settVaType:mcVaSettings.settVaType,
        // settFlatMc:isUndefined(mcVaSettings.settFlatMc),
        // settTouch:isUndefined(mcVaSettings.settTouch),
      }

      tagDetails.push(tagResult);
      setSalesItemDetails(tagDetails, rowIndex);
    } catch (error) {
      console.error(error);
    }
  };


  const setSalesItemDetails = (item_details, rowIndex) => {
    item_details.forEach((response) => {
      if (response.cat_id && response.id_purity && response.id_product) {
        const estItemDetails = itemDetails?.filter((result, index) => result.est_item_id === response.est_item_id && result.est_item_id && (index !== rowIndex));
        const estTagDetails = itemDetails?.filter((result, index) => result.tagCode === response.tag_code && (index !== rowIndex));
        let itemExists = false;
        if (estItemDetails.length > 0) {
          itemExists = true;
          toastfunc("Estimation already Exists");
        } else if (estTagDetails.length > 0) {
          itemExists = true;
          toastfunc("Tag No already Exists");
        }
        if (!itemExists) {
          let initialState = setSalesItem(
            response,
            categoryList,
            metalPurityRateList,
            metalRateInfo,
            activeProductList,
            catPurityRate,
            settings,
            activeDiamondRateList,
          );
          let mcVaSettings = setMaxMcVaBasedOnSettings(initialState);
          initialState.settingsMcType = mcVaSettings.settMcType;
          initialState.settingsMinVa = isUndefined(mcVaSettings.settMinVa);
          initialState.settingsMinMc = isUndefined(mcVaSettings.settMinMc);
          initialState.settingsMaxVa = isUndefined(mcVaSettings.settMaxVa);
          initialState.settingsMaxMc = isUndefined(mcVaSettings.settMaxMc);
          initialState.settVaType = mcVaSettings.settVaType;
          initialState.settFlatMcMin = isUndefined(mcVaSettings.settFlatMcMin);
          initialState.settFlatMcMax = isUndefined(mcVaSettings.settFlatMcMax);
          initialState.settTouch = isUndefined(mcVaSettings.settTouch);
          const updatedFormData = [...itemDetails];
          updatedFormData[rowIndex] = initialState;
          setItemDetails(updatedFormData);
          //setItemDetails((prevData) => [...prevData, initialState]);
        }
      }
    });
  };


  const handleOptionSelectChange = (value, fin_year_name) => {
    setFinYear(value);
    setFinYearName(fin_year_name);
  };



  const handleAddItem = (rowIndex) => {
    let allowAdd = true;
    let currentRowDetails = itemDetails[rowIndex];
    allowAdd = validateSaleItemDetails(activeProductList, currentRowDetails, props?.invoiceTo,settings);
    if (allowAdd) {
      setItemDetails((prevItemDetails) => [...prevItemDetails, { ...initialStateItemDetails, 'item_type': itemType,employee: employee }]);
    }
    // setInputRef(itemDetails.length)
  };
  const setInputRef = (lastIndex) => {
    setTimeout(() => {
      if (inputRefs.current[lastIndex]) {
        inputRefs.current[lastIndex].focus();
      } else {
        setTimeout(() => {
          if (inputRefs.current[lastIndex]) {
            inputRefs.current[lastIndex].focus();
          } else {
            console.error("Still not assigned after extra delay!");
          }
        }, 500);
      }
    }, 300);
  };
  useEffect(() => {
    setInputRef(itemDetails.length - 1);
  }, [itemDetails.length]); // Runs every time itemDetails changes

  const handleDelete = (index) => {
    const updatedFormData = [...itemDetails];
    updatedFormData.splice(index, 1);
    setItemDetails(updatedFormData);
  };

  const setMaxMcVaBasedOnSettings = (item) => {
    if (mcVaSetiings) {
      let idKarigar = props.initialState?.supplier
      let customerDetails = props?.customerDetails
      let isRetailer = customerDetails?.is_retailer
      let profileType = customerDetails?.profile_type
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
      if (mcVaSetiings?.retail || mcVaSetiings?.customer) {

        if (isRetailer == '1') {
          mc_va_setting = mcVaSetiings?.retail.find((sett) => { return sett.purity === item?.selectedPurity && sett.supplier.includes(parseInt(idKarigar)) && sett.id_product === item?.selectedProduct && sett.id_design === item?.selectedDesign && (settings?.is_sub_design_req == 1 ? sett.id_sub_design === item?.selectedSubDesign : true) && (sett.id_weight_range != null ? parseFloat(sett.from_weight) <= parseFloat(item?.grossWeight) && parseFloat(sett.to_weight) >= parseFloat(item?.grossWeight) : true) });
          if (mc_va_setting) {
            if (profileType == 1) { // RETAIL
              settMinMc = mc_va_setting.retail_mc
              settMinVa = mc_va_setting.retail_va
              settMcType = parseInt(mc_va_setting.retail_mc_type)
              settVaType = mc_va_setting.retail_va_type
              settTouch = mc_va_setting.retail_touch
              settFlatMcMax = mc_va_setting.retail_flat_mc
            } else if (profileType == 2) {// VIP RETAIL
              settMinMc = mc_va_setting.vip_retail_mc
              settMinVa = mc_va_setting.vip_retail_va
              settMcType = parseInt(mc_va_setting.vip_retail_mc_type)
              settVaType = mc_va_setting.vip_retail_va_type
              settTouch = mc_va_setting.vip_retail_touch
              settFlatMcMax = mc_va_setting.retail_flat_mc
            }
          }
        } else {
          mc_va_setting = mcVaSetiings?.customer.find((sett) => sett.purity === item?.selectedPurity && sett.id_product === item?.selectedProduct && sett.id_design === item?.selectedDesign && (settings?.is_sub_design_req == 1 ? sett.id_sub_design === item?.selectedSubDesign : true) && (sett.id_weight_range != null ? parseFloat(sett.from_weight) <= parseFloat(item?.grossWeight) && parseFloat(sett.to_weight) >= parseFloat(item?.grossWeight) : true));
          if (mc_va_setting) {
            settMinMc = mc_va_setting.min_mc_value
            settMinVa = mc_va_setting.min_va_value
            settMaxMc = mc_va_setting.max_mc_value
            settMaxVa = mc_va_setting.max_va_value
            settVaType = mc_va_setting.va_type
            settMcType = parseInt(mc_va_setting.mc_type)
            settFlatMcMin = mc_va_setting.flat_mc_min
            settFlatMcMax = mc_va_setting.flat_mc_max

          }
        }
      }
      return {
        "settMinMc": settMinMc,
        "settMinVa": settMinVa,
        "settMaxMc": settMaxMc,
        "settMaxVa": settMaxVa,
        "settVaType": settVaType,
        "settMcType": settMcType,
        "settFlatMcMin": settFlatMcMin,
        "settFlatMcMax": settFlatMcMax,
        "settTouch": settTouch,
      }

    }
  };


  useEffect(() => {
    const updatedItemDetails = itemDetails.map((item) => {
      let tax_type = '';
      let tax_id = '';
      let taxPercentage = '';
      let catId = '';
      let wastage_calc_type = '';
      let stone_details = item?.stoneDetails;
      let product = '';
      let pureWeight = 0;
      if (item?.selectedProduct !== '') {
        product = activeProductList.find((val) => val.pro_id === item?.selectedProduct);
        wastage_calc_type = product?.wastage_calc_type;



        tax_type = product?.tax_type;
        tax_id = product?.tax_id;
        taxPercentage = product?.tax_percentage;
        catId = product?.cat_id;

      }

      const net_weight = calculateNetWeight({
        gross_weight: item.grossWeight,
        less_weight: item.lessWeight,
        other_metal_weight: 0
      });

      const calculated_weight = calculateWastageWeight({
        grossWeight: item?.grossWeight,
        netWeight: item?.netWeight,
        wastagePercentage: item?.wastagePercentage,
        calculationType: wastage_calc_type
      });

      if (item?.purchaseTouch !== '' && item?.purchaseTouch !== 0 && item?.purchaseWastage !== 0 && item?.netWeight !== 0) {
        pureWeight = calculatePureWeight({
          netWeight: item?.netWeight,
          purchaseTouch: item?.purchaseTouch,
          pureCalcType: item?.pureWeightCalType,
          purchaseWastage: item?.purchaseWastage
        });
      }
      const calculated_min_weight = calculateWastageWeight({
        grossWeight: item?.grossWeight,
        netWeight: item?.netWeight,
        wastagePercentage: item?.settingsMinVa,
        calculationType: wastage_calc_type
      });


      const itemCostDetails = calculateSalesItemCost({
        piece: item?.piece,
        grossWeight: item?.grossWeight,
        netWeight: net_weight,
        wastageWeight: calculated_weight,
        pureWeight: pureWeight,
        mcType: item?.mcType,
        mcValue: item?.mcValue,
        flatMcValue: item?.flatMcValue,
        taxType: tax_type,
        taxPercentage: taxPercentage,
        productDetails: product,
        ratePerGram: item?.ratePerGram,
        stoneAmount: item?.stoneDetails.reduce((sum, item) => sum + parseFloat(item.stone_amount || 0), 0),
        otherMetalAmount: item?.otherMetalAmount,
        otherChargesAmount: item?.otherChargesAmount,
        sellRate: isUndefined(item?.sellRate),
        invoiceTo: props?.invoiceTo,
        settingsMcType: item?.settingsMcType,
        settingsBillingType: props?.settingsBillingType,
        deliveryLocation: props?.deliveryLocation,
        customerSearch: props?.customerSearch,
        idBranch: props?.idBranch,
        discountAmount: item?.discountAmount
      });

      // Calculate minimum item cost details

      

      
      
      const MinimumitemCostDetails = calculateSalesItemCost({
        piece: item?.piece,
        grossWeight: item?.grossWeight,
        netWeight: net_weight,
        wastageWeight: calculated_min_weight,
        pureWeight: pureWeight,
        mcType: item?.mcType,
        mcValue: item?.settingsMinMc,
        flatMcValue: item?.settFlatMcMin,
        taxType: tax_type,
        taxPercentage: taxPercentage,
        productDetails: product,
        ratePerGram: item?.ratePerGram,
        stoneAmount: item?.stoneDetails.reduce((sum, item) => sum + parseFloat(item.stone_amount || 0), 0),
        otherMetalAmount: item?.otherMetalAmount,
        otherChargesAmount: item?.otherChargesAmount,
        sellRate: isUndefined(item?.sellRate),
        invoiceTo: props?.invoiceTo,
        settingsMcType: item?.settingsMcType,
        settingsBillingType: props?.settingsBillingType,
        deliveryLocation: props?.deliveryLocation,
        customerSearch: props?.customerSearch,
        idBranch: props?.idBranch,
        discountAmount: 0,
        mrpItemDiscountPercentage : isUndefined(settings?.mrp_item_discount_percentage)
      });
      let minimumItemCost = MinimumitemCostDetails.item_cost;
      // if(parseInt(billSettingType) == 0 || product.id_metal == 2){
          if(parseInt(settings?.min_sales_amt_calculate_tax_percentage) == 0){
              minimumItemCost = MinimumitemCostDetails.taxable_amount;
          }   
      //} 

      return {
        ...item,
        netWeight: net_weight,
        pureWeight: pureWeight,
        wastageWeight: calculated_weight,
        wastagePercentage: item?.wastagePercentage,
        tax_id: tax_id,
        taxType: tax_type,
        taxPercentage: taxPercentage,
        selectedCategory: catId,
        itemCost: itemCostDetails.item_cost,
        taxAmount: itemCostDetails.taxAmount,
        totalMcValue: itemCostDetails.total_mc_value,
        discountAmount: itemCostDetails.discount_amount,
        taxableAmount: itemCostDetails.taxable_amount,
        cgst: itemCostDetails.cgst,
        sgst: itemCostDetails.sgst,
        igst: itemCostDetails.igst,
        minimumItemCost: minimumItemCost,
      };



    });


    // Only update state if there are changes
    if (JSON.stringify(updatedItemDetails) !== JSON.stringify(itemDetails)) {
      setItemDetails(updatedItemDetails);
    }

    setSalesAmount(itemDetails?.reduce((sum, item) => sum + parseFloat(item.itemCost || 0), 0))

  }, [itemDetails]); // Run whenever itemDetails changes


  const handleSalesSubEmployee = (index) => {
    SetEmployeeModal(true);
    setCurrentRowIndex(index);
  };

  const calculateTotal = (field,decimal_places) => {
    return itemDetails.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

    const handleDropChange = async (acceptedFiles, set) => {
  
      console.log(acceptedFiles);
        const filesWithPreview = await Promise.all(
            acceptedFiles?.map(async (file) => {
                let preview;
                let base64String;
    
                // Determine file type and create appropriate preview
                if (file.type.startsWith('image/')) {
                    preview = URL.createObjectURL(file); // Image preview
                } else if (file.type.startsWith('video/')) {
                    preview = URL.createObjectURL(file); // Video preview
                } else if (file.type.startsWith('audio/')) {
                    preview = URL.createObjectURL(file); // Audio preview
                } else {
                    preview = URL.createObjectURL(file); // Default preview (e.g., for other file types)
                }
    
                // Convert to base64 for backend
                try {
                    base64String = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
    
                        reader.onload = () => {
                            const base64 = reader.result.split(',')[1]; // Extract base64 part
                            resolve(base64);
                        };
    
                        reader.onerror = (error) => {
                            reject(error);
                        };
    
                        reader.readAsDataURL(file); // Read as data URL
                    });
                } catch (error) {
                    console.error('Error converting to base64:', error);
                    base64String = null; // Or handle the error as needed
                }
    
                return {
                    ...file,
                    preview: preview, // Preview URL (Blob URL)
                    base64: base64String, // Base64 string for backend
                    id: uuid(),
                    default: false,
                };
            })
        );
    
        // set(filesWithPreview);
        set((prev) => [...prev, ...filesWithPreview]);
        
    };

  return (
    <React.Fragment>
      <FormProvider {...methods}>

        <Row md={12}>
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="table table-bordered" style={{ marginBottom: 0 }}>
                <thead className="thead-light" style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>

                  <tr>
                    {parseInt(settings?.is_sales_emp_req) == 1 && (
                      <th  >Itm Emp</th>
                    )}
                    {/* <th>Type</th> */}
                    <th className="tableHeadFixed" >Product</th>
                    <th className="tableHeadFixed" >Design</th>
                    {settings?.is_sub_design_req === "1" && (
                      <th className="tableHeadFixed">S.Design</th>
                    )}
                    {props?.showSize && (
                      <th className="tableHeadFixed">Size</th>
                    )}
                    {settings?.is_section_required === "1" && (
                      <th className="tableHeadFixed">Section</th>
                    )}

                    <th className="tableHeadFixed">Purity</th>
                    {props?.showIsPartial && (
                      <th className="tableHeadFixed">Partial</th>
                    )}

                    <th className="tableHeadFixed">Tag No</th>
                    {props?.showdealerName === "1" && (
                      <th className="tableHeadFixed">Dealer</th>
                    )}
                    <th className="tableHeadFixed">Pcs</th>
                    <th className="tableHeadFixed">Gwt</th>
                    <th className="tableHeadFixed">Lwt</th>
                    <th className="tableHeadFixed">Nwt</th>
                    <th className="tableHeadFixed">V.A(%)</th>
                    <th className="tableHeadFixed">MRP Rate</th>
                    {parseInt(props?.invoiceTo) === 2 ? (<>
                      <th className="tableHeadFixed">Touch</th>
                      <th className="tableHeadFixed">Pure Wt</th>
                    </>) : ''}

                    <th className="tableHeadFixed">MC</th>
                    <th className="tableHeadFixed">Flat MC</th>
                    <th className="tableHeadFixed">Charges</th>
                    <th className="tableHeadFixed">Rate</th>
                    <th className="tableHeadFixed">Tax</th>
                    <th className="tableHeadFixed">Item Cost</th>
                    <th className="tableHeadFixed freeze-col" >Action</th>

                  </tr>
                </thead>
                <tbody>
                  {itemDetails?.length > 0 && itemDetails?.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                      {parseInt(settings?.is_sales_emp_req) == 1 && (
                        <td  >
                          <div className="form-control-wrap input-group" style={{ width: "161px" }} >
                            <div className="input-group-append" style={{ marginLeft: "0px" }}>
                              <ActiveEmployeeDropdown
                                register={register}
                                id={"employee_" + rowIndex}
                                selectedEmployee={item?.employee}
                                onEmployeeChange={(value) => {
                                  handleFormChange(rowIndex, "employee", value);
                                }}
                                isRequired={true}
                                options={activeEmployeeDropdown}
                                clearErrors={clearErrors}
                                setValue={setValue}
                                message={errors.employee && "Employee is Required"}
                                classNamePrefix={"custom-select"}
                              />
                            </div>{""}
                            {/* <div className="input-group-append" style={{ marginLeft: "0px"}}>
                              <Button
                                tabIndex={"-1"}
                                color="primary"
                                size="sm"
                                className="btn-icon btn-white btn-dim"
                                onClick={() => {
                                  handleSalesSubEmployee(rowIndex)
                                }}
                              >
                                <Icon name="plus-sm" />
                              </Button>
                            </div> */}

                          </div>
                        </td>
                      )}
                      <td>
                        <div style={{ width: "150px" }}>
                          <ProductDropdown
                            register={register}
                            id={"selectedProduct_" + rowIndex}
                            products={activeProductList}
                            selectedMetal={props?.metal}
                            selectedProduct={item?.selectedProduct}
                            readOnly={(item?.item_type == 0 ? true : false)}
                            onProductChange={(value) => {
                              handleFormChange(rowIndex, "selectedProduct", value);
                              handleFormChange(rowIndex, "selectedPurity", "");
                              handleFormChange(rowIndex, "selectedDesign", "");
                              handleFormChange(rowIndex, "selectedSubDesign", "");
                            }}
                            isRequired={false}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            classNamePrefix="custom-select"
                            ref={(el) => (inputRefs.current[rowIndex] = el)}
                          />


                        </div>
                      </td>
                      <td>
                        <div style={{ width: "150px" }}>
                          <DesignDropdown
                            register={register}
                            id={"selectedDesign_" + rowIndex}
                            designs={designs}
                            products={activeProductList}
                            selectedProduct={item?.selectedProduct}
                            selectedDesign={item?.selectedDesign}
                            readOnly={(item?.item_type == 0 ? true : false)}
                            onDesignChange={(value) => {
                              handleFormChange(rowIndex, "selectedDesign", value);
                              handleFormChange(rowIndex, "selectedSubDesign", "");
                            }}
                            isRequired={true}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            classNamePrefix="custom-select"
                            message={errors.selectedDesign && "Design is Required"}
                          ></DesignDropdown>
                        </div>
                      </td>
                      {props?.showSize && (

                        <td>
                          <div style={{ width: "150px" }}>
                            <SizeDropdown
                                                  register={register}
                                                  id={"selectedSize"}
                                                  size={size}
                                                  products={activeProductList}
                                                  selectedProduct={item?.selectedProduct}
                                                  selectedSize={item?.selectedSize}
                                                  onSizeChange={(value) => {
                                                    handleFormChange(rowIndex, "selectedSize", value);
                                                    // setValue("selectedSize", value);
                                                    // setSelectedSize(value);
                                                  }}
                                                  isRequired={true}
                                                  isRequiredBasedOnPro={true}
                                                  clearErrors={clearErrors}
                                                  setValue={setValue}
                                                  classNamePrefix="custom-select"
                                                  message={errors.selectedSize && "Size is Required"}
                                                />
                          </div>
                        </td>
                      )}
                      {settings?.is_sub_design_req === "1" && (
                        <td>
                          <div style={{ width: "150px" }}>
                            <SubDesignDropdown
                              register={register}
                              id={"selectedSubDesign_" + rowIndex}
                              subDesigns={subDesigns}
                              products={activeProductList}
                              designs={designs}
                              selectedProduct={item?.selectedProduct}
                              selectedDesign={item?.selectedDesign}
                              selectedSubDesign={item?.selectedSubDesign}
                              readOnly={(item?.item_type == 0 ? true : false)}
                              onSubDesignChange={(value) => {
                                handleFormChange(rowIndex, "selectedSubDesign", value);
                              }}
                              isRequired={true}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              classNamePrefix="custom-select"
                              message={errors.selectedSubDesign && "Sub Design is Required"}
                            ></SubDesignDropdown>
                          </div>
                        </td>
                      )}
                      {settings?.is_section_required == "1" && (
                        <td>
                          <div style={{ width: "150px" }}>
                            <SectionDropdown
                              register={register}
                              isRequired={true}
                              id={"selectedSection_" + rowIndex}
                              sectionOptions={sections}
                              products={activeProductList}
                              selectedProduct={item?.selectedProduct}
                              selectedSection={item?.selectedSection}
                              placeholder="Section"
                              optionLabel="Select Section"
                              readOnly={(item?.item_type == 0 ? true : false)}
                              setValue={setValue}
                              clearErrors={clearErrors}
                              onSectionChange={(value) => {
                                handleFormChange(rowIndex, "selectedSection", value);
                              }}
                              classNamePrefix="custom-select"
                              message={errors["selectedSection_" + rowIndex] && "Section is Required"}
                            />
                          </div>
                        </td>
                      )}
                      <td>

                        <div style={{ width: "120px" }}>
                          <PurityDropdown
                            register={register}
                            id={"selectedPurity_" + rowIndex}
                            purities={activePurityList}
                            categories={categoryList}
                            selectedCategory={item?.selectedCategory}
                            readOnly={(item?.item_type == 0 ? true : false)}
                            onPurityChange={(value) => {
                              handleFormChange(rowIndex, "selectedPurity", value);
                            }}
                            selectedPurity={item?.selectedPurity}
                            isRequired={true}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            message={errors.selectedPurity && "Purity is Required"}
                            classNamePrefix="custom-select"
                          ></PurityDropdown>
                        </div>
                      </td>
                      {props?.showIsPartial && (
                        <td>
                          <div className="form-group">
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className=""
                                id="isCredit"
                                name={item?.isPartial}
                                checked={item?.isPartial}
                                disabled={parseInt(item?.item_type) === 1 ? true : false}
                                onChange={(e) => handleFormChange(rowIndex, "isPartial", e.target.checked)}
                              />
                            </div>
                          </div>
                        </td>
                      )}
                      <td>
                        <div style={{ width: "100px" }}>
                          <TextInputField
                            register={register}
                            placeholder="Tag Code"
                            id={"tagCode_" + rowIndex}
                            value={item.tagCode}
                            isRequired={false}
                            isDisabled={parseInt(item.item_type) === 1 ? true : false}
                            type={"text"}
                            setValue={setValue}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "tagCode", value);
                            }}
                            handleKeyDown={(event) => handleTagSearch(rowIndex, item, event)}
                          />
                        </div>
                      </td>
                     {props?.showdealerName === "1" && ( <td> <div style={{ width: "125px",overflow:"hidden" }}>{item?.dealerName}</div></td> )}
                      <td>
                        <div style={{ width: "75px" }}>
                          <NumberInputField
                            placeholder="Pcs"
                            id={"piece_" + rowIndex}
                            value={item?.piece}
                            isRequired={true}
                            readOnly={item?.isGrossWeightDisable}
                            min={0}
                            max={parseFloat(item?.maxPiece) !== 0 ? item?.maxPiece : parseInt(item?.item_type) == 1 ? 0 : ''}
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
                          {parseInt(item?.item_type) == 1 ? <span style={{ fontSize: "10px" }}>Available Pcs : {item.maxPiece}</span> : ""}
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "75px" }}>

                        <NumberInputField
                            placeholder="Gross weight"
                            id={"grossWeight_" + rowIndex}
                            value={item?.grossWeight}
                            readOnly={item?.isMrpItem || item?.isGrossWeightDisable}
                            min={0}
                            max={parseFloat(item?.maxGrossWeight) !== 0 ? item?.maxGrossWeight : parseInt(item?.item_type) == 1 ? 0 : ''}
                            type={"number"}
                            setValue={setValue}
                            handleKeyDownEvents={true}
                            handleDecimalDigits={true}
                            decimalValues={0}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "grossWeight", value);
                            }}
                            minError={"Gross weight should less than or equal to 0"}
                            maxError={"Gross Weight greater than or equal to 0"}
                            reqValueError={"Gross weight is Required"}
                            register={register}
                          />

                          {/* <InputFieldWithDropdown
                            register={register}
                            placeholder="Gross weight"
                            id={"grossWeight_" + rowIndex}
                            value={item?.grossWeight}
                            readOnly={item?.isMrpItem || item?.isGrossWeightDisable}
                            min={0}
                            max={parseFloat(item?.maxGrossWeight) !== 0 ? item?.maxGrossWeight : parseInt(item?.item_type) == 1 ? 0 : ''}
                            setMaxValueExists={true}
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

                            minError={"Gross weight should less than or equal to 0"}
                            maxError={"Gross Weight greater than or equal to 0"}
                            reqValueError={"Gross weight is Required"}
                          ></InputFieldWithDropdown> */}
                          {parseInt(item?.item_type) == 1 ? <span style={{ fontSize: "10px" }} >Available Gwt : {item.maxGrossWeight}</span> : ""}

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
                            ref={lessWeightRef}
                            stone={stone}
                            quality_code={quality_code}
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
                            type={"number"}
                            setValue={setValue}
                            handleKeyDownEvents={true}
                            handleDecimalDigits={true}
                            readOnly = { (parseInt(userInfo?.settings?.is_wastage_and_mc_edit_in_est)==1 && parseInt(itemType)==0) ? true : false }
                            decimalValues={2}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "wastagePercentage", value);
                            }}
                            handleOnBlurEvent={(e) => {
                              handleWastageDetails(rowIndex, item, e.target.value)
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
                            register={register}
                            placeholder="MRP Rate"
                            id={"sellRate_" + rowIndex}
                            value={item?.sellRate}
                            isRequired={false}
                            readOnly={!item?.isMrpWeightBasedItem}
                            min={0}
                            handleKeyDownEvents={true}
                            handleDecimalDigits={true}
                            decimalValues={2}
                            setValue={setValue}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "sellRate", value);
                            }}
                            minError={"MRP Rate should greater than 0"}
                            reqValueError={"MRP Rate is Required"}
                            message={errors.sellRate && errors.sellRate.message}
                          ></NumberInputField>
                        </div>
                      </td>
                      {parseInt(props?.invoiceTo) === 2 ? (<>
                        <td>
                          <div style={{ width: "120px" }}>
                            <InputGroupField
                              register={register}
                              placeholder1="Touch"
                              inputId1={"purchaseTouch+" + rowIndex}
                              value1={item?.purchaseTouch}
                              isRequiredInput1={parseInt(props?.invoiceTo) === 2 ? true : false}
                              minInput1={0}
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
                              setValue1={setValue}
                              SetInputValue1={(value) => {
                                handleFormChange(rowIndex, "purchaseTouch", value);
                                clearErrors("purchaseTouch");
                              }}
                              placeholder2="%"
                              inputId2={"purchaseWastage+" + rowIndex}
                              value2={item?.purchaseWastage}
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
                              SetInputValue2={(value) => {
                                handleFormChange(rowIndex, "purchaseWastage", value);
                              }} />
                          </div>
                        </td>
                        <td>
                          <div style={{ width: "120px" }}>
                            <InputFieldWithDropdown
                              register={register}
                              placeholder="Pure Weight"
                              id={"pureWeight_" + rowIndex}
                              value={item?.pureWeight}
                              isRequired={false}
                              min={0}
                              type={"number"}
                              readOnly={true}
                              isDisabled={parseInt(props?.invoiceTo) === 1 ? true : false}
                              optionId={"pureWeightCalType_" + rowIndex}
                              name={"pureWeightCalType"}
                              options={PureCalcTypeOptions}
                              setValue={setValue}
                              onDropDownChange={(value) => {
                                handleFormChange(rowIndex, "pureWeightCalType", value);
                              }}
                              selectedOption={item?.pureWeightCalType}
                              SetValue={(value) => {
                                handleFormChange(rowIndex, "pureWeight", value);
                              }}
                              minError={"Rate should less than or equal to 0"}
                              maxError={"Rate should greater than or equal to 0"}
                              reqValueError={"Purchase Rate is Required"}
                              message={errors.pureWeight && errors.pureWeight.message}
                            ></InputFieldWithDropdown>
                          </div>
                        </td> </>
                      ) : ''}

                      <td>
                        <div style={{ width: "121px" }}>
                          <InputFieldWithDropdown
                            isDisabled={props?.isMcVaDisable}
                            isSelectDisabled={props?.isMcVaDisable}
                            register={register}
                            placeholder="MC"
                            id={"mcValue_" + rowIndex}
                            value={item?.mcValue}
                            isRequired={true}
                            min={0}
                            readOnly = { (parseInt(userInfo?.settings?.is_wastage_and_mc_edit_in_est)==1 && parseInt(itemType)==0) ? true : false }
                            type={"number"}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "mcValue", value);
                              clearErrors("mcValue");
                            }}
                            handleOnBlurEvent={(e) => {
                              handleMakingChargeDetails(rowIndex, item, e.target.value)
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
                        <div style={{ width: "75px" }}>
                          <NumberInputField
                            placeholder="MC"
                            id={"flatMcValue_" + rowIndex}
                            value={item?.flatMcValue}
                            isRequired={false}
                            min={0}
                            type={"number"}
                            setValue={setValue}
                            readOnly = { (parseInt(userInfo?.settings?.is_wastage_and_mc_edit_in_est)==1 && parseInt(itemType)==0) ? true : false }
                            handleKeyDownEvents={true}
                            handleDecimalDigits={true}
                            decimalValues={0}
                            SetValue={(value) => {
                              handleFormChange(rowIndex, "flatMcValue", value);
                            }}
                            minError={"Pcs should less than or equal to 0"}
                            maxError={"Pcs greater than or equal to 0"}
                            reqValueError={"Pcs is Required"}
                            register={register}
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "100px" }}>
                          <OtherChargesForm
                            register={register}
                            placeholder="Charges"
                            id={"otherChargesAmount_" + rowIndex}
                            value={item?.otherChargesAmount}
                            isRequired={false}
                            min={0}
                            uom={uom}
                            setValue={setValue}
                            otherChargesAmount={item?.otherChargesAmount}
                            SetValue={(value) => handleFormChange(rowIndex, "otherChargesAmount", value)}
                            SetOtherChargesDetails={(value) => {
                              handleSetOtherChargesDetails(rowIndex, "otherChargesDetails", value);
                            }}
                            otherChargesDetails={item?.otherChargesDetails}
                            ref={otherChargesRef}
                          ></OtherChargesForm>
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "90px" }}>
                          <NumberInputField
                            placeholder="Rate"
                            id={"ratePerGram_" + rowIndex}
                            value={item?.ratePerGram}
                            isRequired={true}
                            //readOnly={parseInt(props?.invoiceTo) === 1 ? true : false}
                            readOnly={true}
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
                      <td>{(item?.taxPercentage !== '' ? item?.taxPercentage + " %" : '')}</td>
                      <td>{<CurrencyDisplay value={item?.itemCost} />}</td>

                      <td class="freeze-col">
                        {rowIndex == itemDetails?.length - 1 && (
                          <Button
                            type="button"
                            color="primary"
                            size="sm"
                            className="btn-icon btn-white btn-dim"
                            onClick={() => handleAddItem(rowIndex)}
                            >
                              <TooltipComponent
                                containerClassName="btn btn-sm btn-icon btn-trigger"
                                icon="plus" 
                                direction="top"
                                id={`add_tooltip`}
                                text="Add"  
                              />
                            </Button>
                            )}
                            <Button
                            color="primary"
                            size="sm"
                            className="btn-icon btn-white btn-dim"
                            onClick={() => handleDelete(rowIndex)}
                            >
                          <TooltipComponent
                          containerClassName="btn btn-sm btn-icon btn-trigger"
                          icon="trash-fill"
                          direction="top"
                          id={`delete_tooltip`}
                           text={"Delete"}
                        />
                        </Button>
                        {props?.showIsOrder && (
                          <Button
                            type="button"
                            color="primary"
                            size="sm"
                            className="btn-icon btn-white btn-dim"
                            onClick={() => handleImageModal(rowIndex)}
                          >
                          <TooltipComponent
                              containerClassName="btn btn-sm btn-icon btn-trigger"
                              icon="img"  
                              direction="top" 
                              id="image_tooltip"
                              text="Image" 
                            />
                          </Button>
                        )}
                        
                        {/* {props?.showIsOrder && (
                          <Button
                            type="button"
                            color="primary"
                            size="sm"
                            className="btn-icon btn-white btn-dim"
                            onClick={() => toggleVideoModal}
                          >
                      <TooltipComponent
                        containerClassName="btn btn-sm btn-icon btn-trigger"
                        icon="video"  
                        direction="top" 
                        id="video_tooltip"
                        text="Video" 
                      />
                          </Button>
                        )}

                         {props?.showIsOrder && (
                          <Button
                            type="button"
                            color="primary"
                            size="sm"
                            className="btn-icon btn-white btn-dim"
                            onClick={() => toggleVoiceModal}
                          >
                          <TooltipComponent
                            containerClassName="btn btn-sm btn-icon btn-trigger"
                            icon="mic"  
                            direction="top" 
                            id="voice_tooltip"
                            text="Voice" 
                          />
                          </Button>
                        )} */}

                        {props?.showIsOrder && (

                        <Button  
                        type="button"
                        color="primary"
                        size="sm"
                        className="btn-icon btn-white btn-dim"
                        onClick={() => setShowReview((prevState) => !prevState)}
                      >
                      <TooltipComponent
                        containerClassName="btn btn-sm btn-icon btn-trigger"
                        icon="notes"
                        direction="top"
                        id={"history_tooltip"}
                        text={"Review"}
                      />
                       <QuillEditorModal
                          modal={showReview}
                          toggle={toggleReviewModal}
                          content={content}
                          setContent={setContent}
                          onSave={handleSaveContent}
                        />
                      </Button>
                        )}
                      </td>
                    </tr>

                    
                  ))}

                </tbody>
                <tfoot className="thead-light" style={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                    <tr style={{fontWeight: 'bold'}}>
                      <td className="tableHeadFixed" colSpan={2} >Total</td>
                      {parseInt(settings?.is_sales_emp_req) == 1 && (
                      <td className="tableHeadFixed"></td>
                      )}
                      {settings?.is_sub_design_req === "1" && (
                      <td className="tableHeadFixed"></td>
                      )}
                      {settings?.is_section_required === "1" && (
                      <td className="tableHeadFixed"></td>
                      )}
                      {props?.showIsPartial && (
                      <td className="tableHeadFixed"></td>
                      )}
                      {props?.showSize && (
                        <td className="tableHeadFixed"></td>
                      )}
                      <td className="tableHeadFixed"></td>
                      <td className="tableHeadFixed"></td>      
                       {props?.showdealerName === "1" && ( <td className="tableHeadFixed" ></td> )}                
                      <td className="tableHeadFixed" >{calculateTotal('piece',0)}</td>
                      <td className="tableHeadFixed" >{calculateTotal('grossWeight',3)}</td>
                      <td className="tableHeadFixed" >{calculateTotal('lessWeight',3)}</td>
                      <td className="tableHeadFixed" >{calculateTotal('netWeight',3)}</td>
                      <td className="tableHeadFixed"></td>
                      <td className="tableHeadFixed"></td>
                      {parseInt(props?.invoiceTo) === 2 ? (<>
                        <td className="tableHeadFixed" ></td>
                        <td className="tableHeadFixed" >{calculateTotal('pureWeight',3)}</td>
                      </>) : ''}
                      <td className="tableHeadFixed"></td>
                      <td className="tableHeadFixed" >{calculateTotal('flatMcValue',2)}</td>
                      <td className="tableHeadFixed" >{calculateTotal('otherChargesAmount',2)}</td>
                      <td className="tableHeadFixed"></td>
                      <td className="tableHeadFixed"></td>
                      <td className="tableHeadFixed" >{<CurrencyDisplay value={calculateTotal('itemCost',2)}></CurrencyDisplay>}</td>
                      <td className="tableHeadFixed"></td>
                    </tr>
                </tfoot>
              </table>
            </div>
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
      <EmployeeModal
        modal={employeeModal}
        toggle={toggleEmployeeModal}
        employees={activeEmployeeDropdown}
        data={itemDetails[currentRowIndex]}
        setData={(lable, value) => {
          handleFormChange(currentRowIndex, lable, value);
        }}
      />

          <MultiImageDropzone
              modal={imageModal}
              toggle={handleImageModal}
              files={orderImages}
              setFiles={SetOrderImages}
              handleDropChange={handleDropChange}
            />
            <MultiVideoDropzone
              modal={videoModal}
              toggle={toggleVideoModal}
              files={orderVideos}
              setFiles={SetOrderVideos}
              handleDropChange={handleDropChange}
            />
          <MultiVoiceRecordDropzone
            modal={voiceModal}
            toggle={toggleVoiceModal}
            files={orderVoices}
            setFiles={SetOrderVoices}
            handleDropChange={handleDropChange}
            />

    </React.Fragment>
  );
});

export default SalesEntryForm;
