import { useState, useEffect, useRef } from "react";
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import { useDispatch, useSelector } from "react-redux";
import { getTagDetailsByCode, getPartlySoldTagDetailsByCode } from "../../redux/thunks/inventory";
import {
  createEstimation,
  getEstimationDetailsById,
  getEstimationDetailsByNo,
  updateEstimation,
} from "../../redux/thunks/estimation";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createPurchaseItemData,
  createSalesItemData,
  createSalesReturnItemData,
  setPurchaseItemDetails,
  setReturnItemDetails,
  setSalesItem,
  validateSaleItemDetails,
} from "../../components/common/salesForm/salesUtils";
import { useHotkeys } from "react-hotkeys-hook";
import { calculateSalesItemCost, isUndefined, calculateItemDiscountAmount } from "../../components/common/calculations/ErpCalculations";
import { getAllFinancialYear } from "../../redux/thunks/retailMaster";
import { v4 as uuid } from "uuid";
import { el } from "date-fns/locale";
import secureLocalStorage from "react-secure-storage";
import EstPrintTemplateTwo from "./estPrintTemplate/estPrintTemplateTwo";
import EstPrintTemplateTwoSilver from "./estPrintTemplate/estPrintTemplateTwoSilver";
const useEstimationFormHandling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { estimationDetails } = useSelector((state) => state.estReducer);
  const { metalPurityRateList } = useSelector((state) => state.metalPurityRateReducer);
  const { categoryList } = useSelector((state) => state.categoryReducer);
  const { metalRateInfo } = useSelector((state) => state.metalRateReducer);
  const { activeProductList } = useSelector((state) => state.productReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const { activeDiamondRateList } = useSelector((state) => state.diamondRateMasterReducer);
  const { catPurityRateList } = useSelector((state) => state.metalPurityRateReducer);
  const { userInfo: { settings } } = useSelector((state) => state.authUserReducer);
  const location = useLocation();
  const add = location?.state?.add;
  const id = location?.state?.id;
  const [estimationId, SetEstimationId] = useState(null);
  const [delId, SetDelId] = useState();
  const [delItem, SetDelItem] = useState("");
  const [deleteModal, SetDeleteModal] = useState(false);
  const [modalActionName, SetModalActionName] = useState("");
  const toggle = () => SetDeleteModal(!deleteModal);
  const [idBranch, setIdBranch] = useState("");
  const [customer, SetCustomer] = useState();
  const [employee, SetEmployee] = useState(null);
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [purchaseFormValues, setPurchaseFormValues] = useState({});
  const [itemType, setItemType] = useState(0);
  const [isPartialSale, setIsPartialSale] = useState("0");
  const [isEstimationApproveReq, setIsEstimationApproveReq] = useState("0");
  const [salesItemData, setSalesItemData] = useState([]);
  const [tagSearchSelectedDetails, setTagSearchDetails] = useState([]);
  const [purchaseItemData, setPurchaseItemData] = useState([]);
  const [tagCode, setTagCode] = useState("");
  const [oldTagCode, setOldTagCode] = useState("");
  const [metal, SetMetal] = useState();
  const salesFormRef = useRef(null); // Child component reference
  const purchaseFormRef = useRef(null); // Child component reference
  const [editIndex, setEditIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalTaxableAmount, setTotalTaxableAmount] = useState(0);
  const [totalSalesGrossWeight, setTotalSalesGrossWeight] = useState(0);
  const [totalSalesLessWeight, setTotalSalesLessWeight] = useState(0);
  const [totalSalesNetWeight, setTotalSalesNetWeight] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [igst, setIgst] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [totalReturnAmount, setTotalReturnAmount] = useState(0);
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const [totalBillAmount, setTotalBillAmount] = useState(0);
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [roundOff, setRoundOffAmount] = useState(0);
  const [estFor, setEstFor] = useState(1);
  const [estNo, setEstNo] = useState("");
  const [is_enquiry, setIs_enquiry] = useState(false);
  const [send_to_approval, setSend_to_approval] = useState(false);
  const [sendToApprovalDisabled, setSendToApprovalDisabled] = useState(false);

  const [isMcVaDisable, setIsMcVaDisable] = useState(false);
  const [allowRetailerBilling, setAllowRetailerBilling] = useState("0");

  const [allowMinSalesAmount, setAllowMinSalesAmount] = useState("0");


  const [customerDetails, setCustomerDetails] = useState({});
  const customerSearchValue = location?.state?.customerSearchValue;
  const customerId = location?.state?.customerId;

  const [finYear, setFinYear] = useState("");
  const [finYearName, setFinYearName] = useState("");

  const [navigateModal, SetNavigateModal] = useState(false);
  const [inputType, setInputType] = useState();
  const [navigateModalOpened, setNavigateModalOpened] = useState(false);
  const [createMobNum, SetCreateMobNum] = useState();
  const [isSearching, setIsSearching] = useState(false);
  const toggleNavigateModal = () => SetNavigateModal(!navigateModal);
  const [employeeModal, SetEmployeeModal] = useState(false);
  const toggleEmployeeModal = () => SetEmployeeModal(!employeeModal);
  const [empItemId, SetEmpItemId] = useState("");
  const [empItemData, SetEmpItemData] = useState("");
  const [lastInputTime, setLastInputTime] = useState(Date.now());
  const [isEstDiscountApplied, setIsEstDiscountApplied] = useState(false);
  const [isEstSalesDetailsApplied, setIsEstSalesDetails] = useState(false);
  
  const initialsalesReruntStateItemDetails = {
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
    employee: "",
    item_type: 0,
    tagGrossWeight: 0,
    tagStoneDetails: 0,
    vaDiscount: 0,
    mcDiscount: 0,
    itemDiscount: 0,
    wastageAfterDiscount: 0,
  };
  const [returnItemData, setReturnItemData] = useState([initialsalesReruntStateItemDetails]);

  const columns = [
    { header: "Tag No", accessor: "tagCode", textAlign: "center" },
    { header: "Product", accessor: "productName", textAlign: "center" },
    { header: "Piece", accessor: "piece", decimal_places: 0, textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "grossWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Lwt", accessor: "lessWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Nwt", accessor: "netWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "VA(%)", accessor: "wastagePercentage", decimal_places: 2, textAlign: "right", isTotalReq: false },
    { header: "VA After Disc(%)", accessor: "wastageAfterDiscount", decimal_places: 2, textAlign: "right", isTotalReq: false },
    { header: "VA(g)", accessor: "wastageWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "MC", accessor: "mcValue", decimal_places: 2, textAlign: "right", isTotalReq: true, isCurrency: true },
    {
      header: "Taxable",
      accessor: "taxableAmount",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
    { header: "Tax(%)", accessor: "taxPercentage", decimal_places: 2, textAlign: "right" },
    {
      header: "Item Cost",
      accessor: "itemCost",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
    { header: "Employee", accessor: "employee", textAlign: "center" },
    { header: "Add Employee", accessor: "subEmployee", textAlign: "center" },
  ];

  const purchaseColumns = [
    { header: "Product", accessor: "productName", textAlign: "center" },
    { header: "Piece", accessor: "piece", decimal_places: 0, textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "grossWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Lwt", accessor: "lessWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Nwt", accessor: "netWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Dia Wt", accessor: "diaWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "VA", accessor: "wastageWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Touch", accessor: "touch", decimal_places: 2, textAlign: "right", isTotalReq: true },
    { header: "Pure", accessor: "pureWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    {
      header: "Item Cost",
      accessor: "itemCost",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
  ];

  const estColumns = [
    { header: "Is Delivered", accessor: "is_delivered", textAlign: "center", type: "checkbox" },
    { header: "Tag No", accessor: "tagCode", textAlign: "center" },
    { header: "Product", accessor: "productName", textAlign: "center" },
    { header: "Piece", accessor: "piece", decimal_places: 0, textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "grossWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Lwt", accessor: "lessWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Nwt", accessor: "netWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "VA(%)", accessor: "wastagePercentage", decimal_places: 2, textAlign: "right", isTotalReq: true },
    { header: "VA(G)", accessor: "wastageWeight", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "MC", accessor: "mcValue", decimal_places: 2, textAlign: "right", isTotalReq: true, isCurrency: true },
    {
      header: "Taxable",
      accessor: "taxableAmount",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
    { header: "Tax(%)", accessor: "taxPercentage", decimal_places: 2, textAlign: "right" },
    {
      header: "Item Cost",
      accessor: "itemCost",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
  ];

  const options = [
    { label: "Tag", value: 0 },
    { label: "Non Tag", value: 1 },
    { label: "Home Bill", value: 2 },
  ];

  useEffect(() => {
    const getFinYear = async () => {
      try {
        const finYearDetails = await dispatch(getAllFinancialYear()).unwrap();
        let defaultFinYear = finYearDetails?.rows.find((val) => val.fin_status === true);
        setFinYearName(defaultFinYear.fin_year_name);
        setFinYear(defaultFinYear.fin_id);
      } catch (error) {
        console.error("Error fetching financial years:", error);
      }
    };

    getFinYear(); // Call the async function inside useEffect
  }, [dispatch]);



  const handleEstNoSearch = () => {
    if (estNo === "") {
      toastfunc("Please Enter the Est No");
    } else if (idBranch === "") {
      toastfunc("Please Select the Branch");
    } else {
      getEstimationDetails();
    }
  };

  useEffect(() => {
    if (salesItemData?.length == 1 && settings?.is_metal_wise_billing == '1') {
      let pro = activeProductList.find((item) => item.pro_id == salesItemData[0].selectedProduct);
      if (pro && !metal) {
        SetMetal(pro.id_metal)
      }
    }
  }, [salesItemData]);

  const getEstimationDetails = async () => {
    try {
      let requestData = { est_no: estNo, id_branch: idBranch };
      const estimationDetails = await dispatch(getEstimationDetailsByNo(requestData)).unwrap();
      const item_details = estimationDetails.sales_details;
      const purchase_details = estimationDetails.purchase_details;
      const return_details = estimationDetails.return_details;
      SetMetal(estimationDetails.metal);
      SetCustomer(estimationDetails.id_customer);
      SetEmployee(estimationDetails.id_employee);
      SetEstimationId(estimationDetails.estimation_id);
      SetCustomerSearch([{ label: estimationDetails.customer_name + " " + estimationDetails.customer_mobile, value: estimationDetails.id_customer }]);
      setIsEstDiscountApplied(true);
      setTotalDiscount(estimationDetails.total_discount_amount);
      if (settings?.is_metal_wise_billing == '1') {
        SetMetal(estimationDetails.metal);
      }

      if (item_details.length > 0) {
        item_details.forEach((response) => {
          if (response.cat_id && response.id_purity && response.id_product) {

            const estItemDetails = salesItemData?.filter((result) => result.est_item_id === response.est_item_id && result.est_item_id);
            const estTagDetails = salesItemData?.filter((result) => result.tagId === response.tag_id);
            let itemExists = false;
            if (estItemDetails.length > 0) {
              itemExists = true;
              toastfunc("Estimation already Exists");
            } else if (response.tag_id != null && estTagDetails.length > 0) {
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
                catPurityRateList,
                settings,
                activeDiamondRateList,
              );
              setSalesItemData((prevData) => [...prevData, initialState]);
            }
          }
        });
        setIsEstSalesDetails(true);
      }
      if (purchase_details.length > 0) {
        purchase_details.forEach((response) => {
          // let initialState = setPurchaseItemDetails(response);
          // setPurchaseItemData((prevData) => [...prevData, initialState]);
          let itemExists = false;
          const estItemDetails = purchaseItemData?.filter(
            (result) => result.est_old_metal_item_id === response.est_old_metal_item_id
          );
          if (estItemDetails.length > 0) {
            itemExists = true;
            toastfunc("Estimation already Exists");
          }
          if (!itemExists) {
            let initialState = setPurchaseItemDetails(response);
            setPurchaseItemData((prevData) => [...prevData, initialState]);
          }
        });
      }

      if (return_details.length > 0) {
        return_details.forEach(response => {
          const estItemDetails = returnItemData?.filter((result) => result.est_return_item_id === response.est_return_item_id);
          let itemExists = false;
          if (estItemDetails.length > 0) {
            itemExists = true;
            toastfunc("Item already Exists");
          }
          if (!itemExists) {
            const returnItemDetails = setReturnItemDetails(response);
            setReturnItemData((prevItemDetails) => [...prevItemDetails, returnItemDetails]);
          }
        });
      }


    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setAllowRetailerBilling(userInfo?.user?.retailer_billing);
  }, [userInfo])


  useEffect(() => {
    setAllowMinSalesAmount(userInfo?.settings?.allow_min_sales_amount);
  }, [userInfo])

  useEffect(() => {
    if (isEstSalesDetailsApplied && isEstDiscountApplied) {
      calculateDiscountAmount();
      setIsEstDiscountApplied(false);
      setIsEstSalesDetails(false);
    }
  },[isEstSalesDetailsApplied])

  useEffect(() => {
    const totalTaxableAmount = [...salesItemData].reduce(
      (sum, item) => parseFloat(sum) + parseFloat(item.taxableAmount),
      0
    );
    const totalSalesGrossWeight = [...salesItemData].reduce(
      (sum, item) => parseFloat(sum) + parseFloat(item.grossWeight),
      0
    );
    const totalSalesLessWeight = [...salesItemData].reduce(
      (sum, item) => parseFloat(sum) + parseFloat(item.lessWeight),
      0
    );
    const totalSalesNetWeight = [...salesItemData].reduce(
      (sum, item) => parseFloat(sum) + parseFloat(item.netWeight),
      0
    );
    const cgst = [...salesItemData].reduce((sum, item) => parseFloat(sum) + parseFloat(item.cgst), 0);
    const sgst = [...salesItemData].reduce((sum, item) => parseFloat(sum) + parseFloat(item.sgst), 0);
    const igst = [...salesItemData].reduce((sum, item) => parseFloat(sum) + parseFloat(item.igst), 0);
    const taxAmount = [...salesItemData].reduce((sum, item) => parseFloat(sum) + parseFloat(item.taxAmount), 0);
    const totalSalesAmount = [...salesItemData].reduce((sum, item) => parseFloat(sum) + parseFloat(item.itemCost), 0);
    const totalPurchaseAmount = purchaseItemData.reduce((sum, item) => parseFloat(sum) + parseFloat(item.itemCost), 0);
    const totalBillAmount = parseFloat(parseFloat(totalSalesAmount) - parseFloat(totalPurchaseAmount) - parseFloat(totalReturnAmount)).toFixed(2);
    let billAmount = Math.round(totalBillAmount);
    const roundOff = parseFloat(billAmount) - parseFloat(totalBillAmount);
    setTotalTaxableAmount(parseFloat(totalTaxableAmount).toFixed(2));
    setTotalSalesGrossWeight(parseFloat(totalSalesGrossWeight).toFixed(3));
    setTotalSalesLessWeight(parseFloat(totalSalesLessWeight).toFixed(3));
    setTotalSalesNetWeight(parseFloat(totalSalesNetWeight).toFixed(3));
    setCgst(parseFloat(cgst).toFixed(2));
    setSgst(parseFloat(sgst).toFixed(2));
    setIgst(parseFloat(igst).toFixed(2));
    setTaxAmount(parseFloat(taxAmount).toFixed(2));
    setTotalSalesAmount(parseFloat(totalSalesAmount).toFixed(2));
    setTotalPurchaseAmount(parseFloat(totalPurchaseAmount).toFixed(2));
    setTotalBillAmount(parseFloat(billAmount).toFixed(2));
    setRoundOffAmount(parseFloat(roundOff).toFixed(2));
    // if (billAmount > 0) {
    setTotalAmountReceived(parseFloat(billAmount).toFixed(2));
    //}
  }, [salesItemData, purchaseItemData,returnItemData]);

  const handleInputChange = (field, value) => {
    if (field === "totalAmountReceived") {
      if (parseFloat(value) > parseFloat(totalBillAmount)) {
        toastfunc("Received Amount Is Exceed than the Bill Amount");
        setTotalAmountReceived(totalBillAmount);
        setTotalDiscount(0);
      } else {
        let discount = parseFloat(parseFloat(totalBillAmount) - parseFloat(value)).toFixed(2);
        setTotalDiscount(discount);
        setTotalAmountReceived(value);
      }
    }
    if (field === "totalDiscount") {
      if (value < 0) {
        setTotalDiscount(0);
      } else {
        let netAmount = parseFloat(parseFloat(totalBillAmount) - parseFloat(value)).toFixed(2);
        setTotalDiscount(value);
        setTotalAmountReceived(netAmount);
      }
    }
  };


  useEffect(() => {
    if (id !== undefined) {
      SetEstimationId(id);
      try {
        dispatch(getEstimationDetailsById(id)).unwrap();
      } catch (error) {
        console.error(error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (id !== undefined && estimationDetails?.estimation_id) {
      setPurchaseItemData([]);
      setSalesItemData([]);
      setReturnItemData([]);
      const item_details = estimationDetails.sales_details;
      const purchase_details = estimationDetails.purchase_details;
      const return_details = estimationDetails.return_details;
      setIsEstDiscountApplied(true);
      setTotalDiscount(estimationDetails.total_discount_amount);
      SetMetal(estimationDetails.metal);
      setIdBranch(estimationDetails.id_branch);
      SetCustomer(estimationDetails.id_customer);
      SetEmployee(estimationDetails.id_employee)
      SetCustomerSearch([{ label: estimationDetails.customer_name + " " + estimationDetails.customer_mobile, value: estimationDetails.id_customer }]);
      if (item_details.length > 0) {
        item_details.forEach((response) => {
          if (response.cat_id && response.id_purity && response.id_product) {
            let initialState = setSalesItem(
              response,
              categoryList,
              metalPurityRateList,
              metalRateInfo,
              activeProductList,
              catPurityRateList,
              settings,
              activeDiamondRateList,
            );
            setSalesItemData((prevData) => [...prevData, initialState]);
          }
        });
        setIsEstSalesDetails(true);

      }
      if (purchase_details.length > 0) {
        purchase_details.forEach((response) => {
          let initialState = setPurchaseItemDetails(response);
          setPurchaseItemData((prevData) => [...prevData, initialState]);
        });
      }
      if (return_details.length > 0) {
        return_details.forEach(response => {
          const returnItemDetails = setReturnItemDetails(response);
          setReturnItemData((prevItemDetails) => [...prevItemDetails, returnItemDetails]);
        });
      }
    }
  }, [dispatch,estimationDetails]);

  const handleItemTypeChange = (selectedOption) => {
    if (selectedOption != null) {
      setIsPartialSale("0");
      setItemType(selectedOption.value);
      if (selectedOption.value == 1 || selectedOption.value == 2) {
        handleSalesAddItem(selectedOption.value);
      }
    } else {
      setItemType(null);
    }
  };

  const handleAddPreview = () => {
    if (salesFormRef.current) {
      salesFormRef.current.submit();
    } else {
      console.log("salesFormRef.current is null");
    }
    setEditIndex(null);
  };

  const handlePurchaseAddPreview = () => {
    if (purchaseFormRef.current) {
      purchaseFormRef.current.submit();
    } else {
      console.log("purchaseFormRef.current is null");
    }
    setEditIndex(null);
  };

  const handleSalesItemData = (data) => {
    setSalesItemData(data);
  };

  const handleSalesAddItem = (item_type = null) => {
    let allowAdd = true;
    let type = item_type == null ? itemType : item_type;
    console.log(settings,"settings");
    for (const value of salesItemData) {
      if (value.selectedProduct !== '' && value.selectedProduct !== null) {
        let allowSubmit = validateSaleItemDetails(activeProductList, value, 1, settings);
        if (!allowSubmit) {
          // return postData; // Early return if validation fails
          allowAdd = false
          break;
        }
      } else {
        allowAdd = false
        toastfunc("Fill all Sales Item Details")
      }
    }
    if (allowAdd) {
      setSalesItemData((prevItemDetails) => [...prevItemDetails, { ...initialStateItemDetails, id_sales_item_detail: uuid(), item_type: type,employee: employee}]);
      console.log("employee",employee);
    }
  };

  const handleReturnData = (data) => {
    setReturnItemData(data);
  };

  const handleReturnItemCost = (returnItemCost) => {
    setTotalReturnAmount(returnItemCost);
  };

  const resetForm = () => {
    if (salesFormRef.current) {
      salesFormRef.current.resetForm();
    }
  };

  const handleEdit = (index) => {
    setFormValues({ ...salesItemData[index], editIndex: index });
    //handleSetStoneDetails(item.stoneDetails);
    setEditIndex(index);
  };

  const handelChange = (index, field, value) => {

    setSalesItemData((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      let updateValue = {
        [field]: value,
      }
      updatedValues[index] = { ...updatedObject, ...updateValue };
      return updatedValues;
    });
  };

  const handlePurchaseEdit = (index) => {
    setPurchaseFormValues({ ...purchaseItemData[index], editIndex: index });
    setEditIndex(index);
  };

  const handleSalesDelete = (index) => {
    SetModalActionName("delete");
    SetDeleteModal(true);
    SetDelId(index);
    SetDelItem("sales");
  };

  const handleSalesSubEmployee = (index) => {
    SetEmployeeModal(true);
    SetEmpItemId(index);
    //SetEmpItemData()
  };
  const handlePurchaseDelete = (index) => {
    SetModalActionName("delete");
    SetDeleteModal(true);
    SetDelId(index);
    SetDelItem("purchase");
  };

  const deleteSaleItem = (index) => {
    if (delItem === "sales") {
      const updatedFormData = [...salesItemData];
      updatedFormData.splice(index, 1);
      setSalesItemData(updatedFormData);
    } else if (delItem === "purchase") {
      const updatedFormData = [...purchaseItemData];
      updatedFormData.splice(index, 1);
      setPurchaseItemData(updatedFormData);
    }
    toggle();
    SetDelItem("");
  };

  const getTagDetails = async (requestData) => {
    try {
      let tagDetails = [];
      let allowAdd = true;
      // let requestData = { tagCode: tagCode, idBranch: idBranch };
      let response = {};
      if (itemType === 0) {
        response = await dispatch(getTagDetailsByCode(requestData)).unwrap();
      } else if (itemType === 2) {
        response = await dispatch(getPartlySoldTagDetailsByCode(requestData)).unwrap();
      }

      if (settings?.is_metal_wise_billing == '1') {
        let product = activeProductList.find((item) => item.pro_id == response.tag_product_id);
        if (metal == product.id_metal) {
          allowAdd = true;
        } else if (metal == null || metal == "") {
          if (salesItemData?.length == 0) {
            allowAdd = true;
          } else {
            toastfunc("Select Product ...");
            allowAdd = false;
          }

        }
        else {
          toastfunc("InValid Metal ...");
          allowAdd = false;
        }
      }
      if (allowAdd) {
        let tagResult = {
          ...response,
          id_product: response.tag_product_id,
          id_design: response.tag_design_id,
          id_purity: response.tag_purity_id,
          id_sub_design: response.tag_sub_design_id,
          id_section: response.tag_section_id,
          pieces: response.tag_pcs,
          tagGrossWeight: response.tag_gwt,
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
          sell_rate: response.tag_sell_rate,
          supplier_name:response.supplier_name,
          ref_emp_id: employee,
          item_type : itemType,
        }

        tagDetails.push(tagResult);
        setSalesItemDetails(tagDetails);
        setTagCode("");
        setOldTagCode("");
      }

      // let initialState = setTagDetails(response);
      // setFormValues(initialState);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (tagSearchSelectedDetails.length > 0) {
      setSalesItemDetails(tagSearchSelectedDetails);
    }
  }, [tagSearchSelectedDetails])

  const setSalesItemDetails = (item_details) => {
    item_details.forEach((response) => {
      if (response.cat_id && response.id_purity && response.id_product) {
        const estItemDetails = salesItemData?.filter((result) => result.est_item_id === response.est_item_id && result.est_item_id);
        const estTagDetails = salesItemData?.filter((result) => result.tagCode === response.tag_code);
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
            catPurityRateList,
            settings,
            activeDiamondRateList,
          );
          setSalesItemData((prevData) => [...prevData, initialState]);
        }
      }
    });
  };

  const handleFormSubmit = (formData) => {
    const tagDetails = salesItemData?.filter(
      (result) => result.tag_code !== "" && result.tag_code === formData.tagCode
    );
    if (tagDetails.length > 0) {
      toastfunc("Tag Code already exists");
    } else {
      const newItem = {
        ...formData,
        item_type: itemType,
        isPartial: itemType === 2 && formValues.tagId ? 1 : isPartialSale,
        tag_id: itemType === 2 && formValues.tagId ? formValues.tagId : "",
        tag_code: formData?.tagCode,
        mcvatotal: parseFloat(parseFloat(parseFloat(formData.wastageWeight) * parseFloat(formData.ratePerGram)) + parseFloat(formData.totalMcValue)).toFixed(2),
      };
      if (editIndex !== "" && editIndex !== null) {
        const updatedFormData = [...salesItemData];
        updatedFormData[editIndex] = newItem;
        setSalesItemData(updatedFormData);
      } else {
        setSalesItemData((prevData) => [...prevData, newItem]);
      }
      setTagCode("");
    }
  };

  const handlePurchaseItem = (formData) => {
    const newItem = {
      ...formData,
    };
    if (editIndex !== "" && editIndex !== null) {
      const updatedFormData = [...purchaseItemData];
      updatedFormData[editIndex] = newItem;
      setPurchaseItemData(updatedFormData);
    } else {
      setPurchaseItemData((prevData) => [...prevData, newItem]);
    }
  };

  useEffect(() => {
    if (tagCode.length > 5 ) {
      handleTagSearch();
    }

  }, [tagCode]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && tagCode.length > 0) {
      handleTagSearch(); // Trigger for manual enter
    }
    if (e.key === 'Enter' && oldTagCode.length > 0) {
      handleOldTagSearch(); // Trigger for manual enter
    }
  };

  const handleSearch = async () => {
    if (tagCode === "") {
      handleOldTagSearch();
    } else {
      handleTagSearch();
    }
  };

  const handleTagSearch = async () => {
    const tagDetails = salesItemData?.filter((result) => result.tag_code === tagCode);

    if (tagCode === "") {
      toastfunc("Please Enter The Tag Code");
    } else if (idBranch === "") {
      toastfunc("Please Select Branch");
    } else if (tagDetails.length > 0) {
      toastfunc("Tag Code already exists");
    } else {
      getTagDetails({ tagCode: tagCode, idBranch: idBranch });
    }
  };

  useEffect(() => {
    if (oldTagCode && oldTagCode.length > 5) {
      handleOldTagSearch();
    }
  }, [oldTagCode]);

  const handleOldTagSearch = async () => {
    const tagDetails = salesItemData?.filter((result) => result.old_tag_code === oldTagCode);

    if (oldTagCode === "") {
      toastfunc("Please Enter The Tag Code");
    } else if (idBranch === "") {
      toastfunc("Please Select Branch");
    } else if (tagDetails.length > 0) {
      toastfunc("Tag already exists");
    } else {
      getTagDetails({ oldTagCode: oldTagCode, idBranch: idBranch });
    }
  };

  const saveEstimationDataToStorage = () => {
    const estimationData = {
      estimation: {
        totalAmountReceived,
        item_type : itemType,
        id_branch: idBranch,
        estimation_for: estFor,
        id_customer: customer,
        sales_amount: totalSalesAmount,
        purchase_amount: totalPurchaseAmount,
        return_amount: totalReturnAmount,
        total_discount_amount: totalDiscount,
        net_amount: totalBillAmount,
        round_off: roundOff,
        id_employee: employee,
        metal: metal,
        is_enquiry,
        send_to_approval,
        is_estimation_approve_req: isEstimationApproveReq,
      },
      sales_details: salesItemData.length > 0 ? salesItemData : [],
      purchase_details: purchaseItemData.length > 0 ? purchaseItemData : [],
      return_details: returnItemData.length > 0 ? returnItemData : [],
    };

    localStorage.setItem(
      "estimation_form_data",
      JSON.stringify(estimationData)
    );
  };

  const clearEstimationDataFromStorage = ()=>{
    localStorage.removeItem("estimation_form_data");
  }


  const onClickSave = (formData) => {
    if (salesItemData.length > 0) {
      for (const value of salesItemData) {
        if (value.selectedProduct !== '' && value.selectedProduct !== null) {
          let allowSubmit = validateSaleItemDetails(activeProductList, value, 1,settings);
          if (!allowSubmit) {
            return value; // Early return if validation fails
            //  break;
          }
        }
      }
    }
    if (idBranch === "" || idBranch === null) {
      toastfunc("Please Select Branch");
    } else if ((customer === "" || customer === null || customer === undefined) && estFor === 1) {
      toastfunc("Please Select the Customer");
    } else if (employee === "" || employee === null || employee === undefined) {
      toastfunc("Please Select the Employee");
    } else if (salesItemData.length === 0 && purchaseItemData.length === 0 && returnItemData.length === 0) {
      toastfunc("Please Add the Item Details");
    } else {
      setIsSubmitted(true);
      const postData = {
        estimation: {
          id_branch: idBranch,
          estimation_for: estFor,
          id_customer: customer,
          sales_amount: totalSalesAmount,
          purchase_amount: totalPurchaseAmount,
          return_amount: totalReturnAmount,
          total_discount_amount: totalDiscount,
          net_amount: totalBillAmount,
          round_off: roundOff,
          id_employee: employee,
          metal: metal,
          is_enquiry,
          send_to_approval,
          is_estimation_approve_req: isEstimationApproveReq
        },
        sales_details: salesItemData.length > 0 ? createSalesItemData(salesItemData, employee, activeProductList) : [],
        purchase_details: purchaseItemData.length > 0 ? createPurchaseItemData(purchaseItemData) : [],
        return_details: returnItemData.length > 0 ? createSalesReturnItemData(returnItemData) : [],
      };
      saveEstimation(postData);
    }
  };

  const saveEstimation = async (postData) => {
    try {
      let response = "";
      if (estimationId !== "" && estimationId !== undefined && estimationId != null) {
        const update_data = { id: estimationId, putData: postData };
        response = await dispatch(updateEstimation(update_data)).unwrap();
      } else {
        response = await dispatch(createEstimation(postData)).unwrap();
      }
      // console.log(response.data.pdf_url);
      //navigate(`${process.env.PUBLIC_URL}/estimation/list`);
      // resetBillingForm();
      let data = {
        settings: settings,
        itemDetails: response.response_data,
      };
      secureLocalStorage.setItem("pageState", JSON.stringify(data));
      window.location.reload();
      window.open(`${process.env.PUBLIC_URL}/estimation/print`, "_blank");
      //window.open(response.data.pdf_url, "_blank");
      //handlePrint(data.itemDetails, settings, userInfo.user);
      setIsSubmitted(false);
      clearEstimationDataFromStorage()
    } catch (error) {
      console.error(error);
      setIsSubmitted(false);
    }
  };

  // useEffect(()=>{
  //   const estimationFormData = localStorage.getItem('estimation_form_data') 
  //   if(estimationFormData){
  //     const estimationFormDataObj = JSON.parse(estimationFormData)
  //     setIdBranch(estimationFormDataObj?.id_branch)
  //     setItemType(estimationFormDataObj?.item_type)
  //     setTotalAmountReceived(estimationFormDataObj?.totalAmountReceived)
  //     setEstFor(estimationFormDataObj?.estimation_for)
  //     SetCustomer(estimationFormDataObj?.id_customer)
  //     setTotalSalesAmount(estimationFormDataObj?.sales_amount)
  //     setTotalPurchaseAmount(estimationFormDataObj?.purchase_amount)
  //     setTotalReturnAmount(estimationFormDataObj?.return_amount)
  //     setTotalDiscount(estimationFormDataObj?.total_discount_amount)
  //     setTotalBillAmount(estimationFormDataObj?.net_amount)
  //     setRoundOffAmount(estimationFormDataObj?.round_off)
  //     SetEmployee(estimationFormDataObj?.id_employee)
  //     SetMetal(estimationFormDataObj?.metal)
  //     setIs_enquiry(estimationFormDataObj?.is_enquiry)
  //     setSend_to_approval(estimationFormDataObj?.send_to_approval)
  //     setIsEstimationApproveReq(estimationFormDataObj?.is_estimation_approve_req)
  //     setSalesItemData(estimationFormDataObj?.sales_details)
  //     setPurchaseItemData(estimationFormDataObj?.purchase_details)
  //     setReturnItemData(estimationFormDataObj?.return_details)
  //   }

  // },[])

  const resetBillingForm = () => {
    SetCustomerSearch([]);
    setCustomerDetails({});
    setSalesItemData([]);
    setPurchaseItemData([]);
    setReturnItemData([]);
    setIsSubmitted(false);
    setItemType(0);
    SetCustomer('');
    setIsPartialSale("0");
    setTotalDiscount(0);
  }

  const navigateCreateCustomer = () => {
    saveEstimationDataToStorage()
    navigate(
      {
        pathname: `${process.env.PUBLIC_URL}/master/customer/add`,
      },
      {
        state: { add: true, createMobNum: createMobNum, navigateLink: `/estimation/add` },
      }
    );
  };

  // const calculateDiscountAmount = () => {
  //   const salesAmount = salesItemData.reduce((sum, item) => sum + parseFloat(item.itemCost || 0), 0);
  //   let updateSalesItemData = calculateItemDiscountAmount(salesItemData, totalDiscount, activeProductList, salesAmount);
  //   let minSaleAmount = 0
  //   let saleAmount = 0;
  //   updateSalesItemData.forEach(val => {
  //     console.log('val', val)
  //     minSaleAmount += parseFloat(isUndefined(val.minimumItemCost))
  //     saleAmount = parseFloat(saleAmount) + parseFloat(isUndefined(val.itemCost))
  //     console.log('saleAmount', saleAmount);
  //     console.log('itemCost', val.itemCost);
  //   })
  //   //setSalesItemData(updateSalesItemData);
  //   // let minSaleAmount = updateSalesItemData.reduce((sums, itemp) => sums + parseFloat(itemp.minimumItemCost || 0), 0);
  //   // let saleAmount = updateSalesItemData.reduce((su, itemk) => su + parseFloat(itemk.itemCost || 0), 0);
  //   console.log('updateSalesItemData', updateSalesItemData)
  //   console.log('saleAmount1', saleAmount)
  //   console.log('minSaleAmount', minSaleAmount)
  //   if (parseFloat(saleAmount) >= parseFloat(minSaleAmount)) {
  //     setSalesItemData(updateSalesItemData);
  //   } else {
  //     toastfunc("Discount Cannot be Applied Bellow Minimum Sale Amount" + minSaleAmount);

  //     handleInputChange("totalDiscount", 0);
  //     updateSalesItemData = calculateItemDiscountAmount(salesItemData, 0, activeProductList, salesAmount);
  //     setSalesItemData(updateSalesItemData);
  //   }
  // };


  const calculateDiscountAmount = () => {
    const salesAmount = salesItemData.reduce((sum, item) => sum + parseFloat(item.itemCost || 0), 0);
    let updateSalesItemData = calculateItemDiscountAmount(salesItemData, totalDiscount, activeProductList, salesAmount);
    let minSaleAmount = 0;
    let saleAmount = 0;

    updateSalesItemData.forEach(val => {
      minSaleAmount += parseFloat(isUndefined(val.minimumItemCost));
      saleAmount += parseFloat(isUndefined(val.itemCost));
    });

    setSend_to_approval(false);
    setSendToApprovalDisabled(false);

    if (allowMinSalesAmount === false) {
      if (parseFloat(saleAmount) >= parseFloat(minSaleAmount)) {
        setSalesItemData(updateSalesItemData);
      } else {
        toastfunc("Discount Cannot be Applied Below Minimum Sale Amount " + minSaleAmount);
        handleInputChange("totalDiscount", 0);
        updateSalesItemData = calculateItemDiscountAmount(salesItemData, 0, activeProductList, salesAmount);
        setSalesItemData(updateSalesItemData);
      }
    } else if (allowMinSalesAmount === true) {
      // setSend_to_approval(false);
      // setSendToApprovalDisabled(true);
        setSalesItemData(updateSalesItemData);
    }
  };


  return {
    add,
    id,
    idBranch,
    setIdBranch,
    itemType,
    setItemType,
    isPartialSale,
    setIsPartialSale,
    customer,
    SetCustomer,
    customerSearch,
    SetCustomerSearch,
    columns,
    purchaseColumns,
    options,
    salesFormRef,
    purchaseFormRef,
    getTagDetails,
    tagCode,
    setTagCode,
    handleInputChange,
    handleEdit,
    handlePurchaseEdit,
    handleAddPreview,
    handlePurchaseAddPreview,
    resetForm,
    handleFormSubmit,
    handlePurchaseItem,
    handleTagSearch,
    handleItemTypeChange,
    salesItemData,
    purchaseItemData,
    returnItemData,
    formValues,
    purchaseFormValues,
    editIndex,
    onClickSave,
    isSubmitted,
    totalTaxableAmount,
    totalSalesGrossWeight,
    totalSalesLessWeight,
    totalSalesNetWeight,
    cgst,
    sgst,
    igst,
    taxAmount,
    totalSalesAmount,
    totalPurchaseAmount,
    totalReturnAmount,
    totalBillAmount,
    totalAmountReceived,
    totalDiscount,
    deleteModal,
    toggle,
    handleSalesDelete,
    handlePurchaseDelete,
    deleteSaleItem,
    employee,
    SetEmployee,
    toggleNavigateModal,
    isSearching,
    setIsSearching,
    createMobNum,
    SetCreateMobNum,
    navigateModal,
    SetNavigateModal,
    navigateCreateCustomer,
    customerSearchValue,
    customerId,
    estFor,
    setEstFor,
    customerDetails,
    setCustomerDetails,
    handleEstNoSearch,
    estNo,
    setEstNo,
    is_enquiry,
    setIs_enquiry,
    isMcVaDisable,
    setIsMcVaDisable,
    calculateDiscountAmount,
    allowRetailerBilling,
    allowMinSalesAmount,
    oldTagCode,
    setOldTagCode,
    handleSearch,
    handelChange,
    SetEmpItemData,
    empItemData,
    SetEmpItemId,
    empItemId,
    toggleEmployeeModal,
    employeeModal,
    SetEmployeeModal,
    handleSalesSubEmployee,
    finYearName,
    finYear,
    handleReturnData,
    handleSalesItemData,
    handleReturnItemCost,
    handleSalesAddItem,
    metal,
    SetMetal,
    inputType,
    setInputType,
    navigateModalOpened,
    setNavigateModalOpened,
    setTagSearchDetails,
    send_to_approval,
    setSend_to_approval,
    sendToApprovalDisabled,
    handleKeyDown,
    saveEstimationDataToStorage
  };
};
export default useEstimationFormHandling;
