import { useState, useEffect, useRef } from "react";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import { useDispatch, useSelector } from "react-redux";
import {
  getTagDetailsByCode,
  getPartlySoldTagDetailsByCode,
} from "../../../redux/thunks/inventory";
import {
  calculateItemDiscountAmount,
  calculateSalesItemCost,
  isUndefined,
} from "../../../components/common/calculations/ErpCalculations";
import { getEstimationDetailsByNo } from "../../../redux/thunks/estimation";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createInvoice,
  createDiscountInvoice,
  getOrderDelivery,
} from "../../../redux/thunks/billing";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import {
  createPurchaseItemData,
  createSalesItemData,
  createSalesReturnItemData,
  setPurchaseItemDetails,
  setReturnItemDetails,
  setSalesItem,
  setTagDetails,
  validatePurchaseItemDetails,
  validateSaleItemDetails,
} from "../../../components/common/salesForm/salesUtils";
import { getAllFinancialYear } from "../../../redux/thunks/retailMaster";
import { v4 as uuid } from "uuid";

const useBillingFormWholesaleHandling = (setBillTypeTab) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { metalPurityRateList } = useSelector(
    (state) => state.metalPurityRateReducer
  );
  const { catPurityRateList } = useSelector(
    (state) => state.metalPurityRateReducer
  );

  const { categoryList } = useSelector((state) => state.categoryReducer);
  const { metalRateInfo } = useSelector((state) => state.metalRateReducer);
  const { activeProductList } = useSelector((state) => state.productReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const { activeDiamondRateList } = useSelector(
    (state) => state.diamondRateMasterReducer
  );
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const [metal, SetMetal] = useState();
  const [ratePerGram, setRatePerGram] = useState(0);

  const initialStateItemDetails = {
    id_sales_item_detail: uuid(),
    isPartial: 0,
    isGrossWeightDisable: false,
    maxGrossWeight: 0,
    invoice_sale_item_id: "",
    isMrpItem: false,
    isPurchaseItem: false,
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
    otherMetalWeight: 0.0,
    wastagePercentage: 0,
    wastageWeight: 0,
    purchaseTouch: 0,
    purchaseWastage: 0,
    pureWeightCalType: 2,
    pureWeight: 0.0,
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
    otherChargesAmount: 0.0,
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
    settingsMcType: "",
    settingsMinVa: "",
    settingsMinMc: "",
    settingsMaxVa: "",
    settingsMaxMc: "",
    settVaType: "",
    settFlatMc: "",
    settTouch: "",
    wastage_calc_type: "",
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

  const initialStatePurchase = {
    selectedProduct: "",
    selectedOldMetalItem: "",
    touch: "92",
    piece: 1,
    uomId: 1,
    grossWeight: 0.0,
    lessWeight: 0.0,
    stnWeight: 0.0,
    diaWeight: 0.0,
    dustWeight: 0.0,
    netWeight: 0.0,
    wastagePercentage: 0,
    wastageWeight: 0,
    pureWeight: 0.0,
    ratePerGram: 0,
    customerRate: 0,
    itemCost: 0,
    editIndex: "",
    stoneDetails: [],
    est_old_metal_item_id: "",
  };

  const location = useLocation();
  const add = location?.state?.add;
  const id = location?.state?.id;
  const estDetails = location?.state?.estDetails;
  const [idBranch, setIdBranch] = useState("");
  const [customer, SetCustomer] = useState();
  const [finYear, setFinYear] = useState("");
  const [finYearName, setFinYearName] = useState("");
  const [employee, SetEmployee] = useState(null);
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [navigateModalOpened, setNavigateModalOpened] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [purchaseFormValues, setPurchaseFormValues] = useState({});
  const [itemType, setItemType] = useState(2);
  const [isPartialSale, setIsPartialSale] = useState("0");
  const [invoiceFor, setInvoiceFor] = useState("1");
  const [invoiceTo, setInvoiceTo] = useState("1");
  const [miscBilling, setMiscBilling] = useState("0");
  const [allowRetailerBilling, setAllowRetailerBilling] = useState("0");
  const [panNumber, setPanNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [delId, SetDelId] = useState();
  const [delItem, SetDelItem] = useState("");
  const [deleteModal, SetDeleteModal] = useState(false);
  const [modalActionName, SetModalActionName] = useState("");
  const toggle = () => SetDeleteModal(!deleteModal);
  const [isCredit, setIsCredit] = useState(false);
  const [salesItemData, setSalesItemData] = useState([]);
  const [purchaseItemData, setPurchaseItemData] = useState([]);
  const [returnItemData, setReturnItemData] = useState([]);
  const [paymentModeData, setPaymentModeData] = useState([]);
  const [advanceAdjustedData, setAdvanceAdjustedData] = useState([]);
  const [depositAdjustedData, setDepositAdjustedData] = useState([]);
  const [chitAdjustedData, setChitAdjustedData] = useState([]);
  const [settingsBillingType, setSettingsBillingType] = useState(false); //Is Eda
  const [oldTagCode, setOldTagCode] = useState("");
  const [tagCode, setTagCode] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [estNo, setEstNo] = useState("");
  const salesFormRef = useRef(null); // Child component reference
  const purchaseFormRef = useRef(null); // Child component reference
  const paymentFormRef = useRef(null); // Child component reference
  const [editIndex, setEditIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalTaxableAmount, setTotalTaxableAmount] = useState(0);
  const [totalSalesGrossWeight, setTotalSalesGrossWeight] = useState(0);
  const [totalSalesLessWeight, setTotalSalesLessWeight] = useState(0);
  const [totalSalesNetWeight, setTotalSalesNetWeight] = useState(0);
  const [totalSalesPureWeight, setTotalSalesPureWeight] = useState(0);
  const [totalPurchasePureWeight, setTotalPurchasePureWeight] = useState(0);

  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [igst, setIgst] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const [totalGrossWeight, setTotalGrossWeight] = useState(0);
  const [totalVA, setTotalVA] = useState(0);
  const [totalMC, settotalMC] = useState(0);
  const [totalReturnAmount, setTotalReturnAmount] = useState(0);
  const [totalBillAmount, setTotalBillAmount] = useState(0);
  const [totalNetAmount, setTotalNetAmount] = useState(0);
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [avgDiscount, setAvgDiscount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
  const [totalAdjustedAmount, setTotalAdjustedAmount] = useState(0);
  const [totalDepositAdjustedAmount, setTotalDepositAdjustedAmount] =
    useState(0);
  const [totalChitAdjustedAmount, setTotalChitAdjustedAmount] = useState(0);

  const customerSearchValue = location?.state?.customerSearchValue;
  const customerId = location?.state?.customerId;

  const [navigateModal, SetNavigateModal] = useState(false);
  const [createMobNum, SetCreateMobNum] = useState();
  const [isSearching, setIsSearching] = useState(false);
  const [isEstDiscountApplied, setIsEstDiscountApplied] = useState(false);
  const toggleNavigateModal = () => SetNavigateModal(!navigateModal);

  const [imageModal, SetImageModal] = useState(false);
  const toggleImageModal = () => {
    SetImageModal(!imageModal);
  };

  const [activeRow, setActiveRow] = useState(null);

  const imageToggle = (rowIndex) => {
    setActiveRow(rowIndex); // Set the active row before opening the modal
    toggleImageModal(); // Your existing modal toggle function
  };

  const [refundAmount, setRefundAmount] = useState(0);
  const [roundOff, setRoundOffAmount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [deliveryLocation, setDeliveryLocation] = useState(1);
  const [employeeModal, SetEmployeeModal] = useState(false);
  const toggleEmployeeModal = () => SetEmployeeModal(!employeeModal);
  const [empItemId, SetEmpItemId] = useState("");
  const handleSalesSubEmployee = (index) => {
    SetEmployeeModal(true);
    SetEmpItemId(index);
  };
  const handelChange = (index, field, value) => {
    setSalesItemData((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      let updateValue = {
        [field]: value,
      };
      updatedValues[index] = { ...updatedObject, ...updateValue };
      console.log(updateValue);

      return updatedValues;
    });
  };
  console.log(salesItemData);
  console.log(purchaseItemData);

  const convert64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const intialItemDeliveredState = {
    id_item_delivered: uuid(),
    isChecked: false,
    branch: "",
    customer: "",
    product: "",
    piece: 0,
    weight: 0,
    remarks: "",
    images: [],
  };

  const [itemDeliveredDetails, setItemDeliveredDetails] = useState([
    intialItemDeliveredState,
  ]);
  const [selectAllItemDelivered, setSelectAllItemDelivered] = useState(false);

  const addItemDelivered = () => {
    setItemDeliveredDetails([
      ...itemDeliveredDetails,
      intialItemDeliveredState,
    ]);
    // setids((prevState) => prevState - 1);
  };

  const handleSalesAddItem = (item_type = null) => {
    let allowAdd = true;
    let type = item_type == null ? itemType : item_type;
    for (const value of salesItemData) {
      if (value.selectedProduct !== "" && value.selectedProduct !== null) {
        let allowSubmit = validateSaleItemDetails(
          activeProductList,
          value,
          invoiceTo,
          settings
        );
        if (!allowSubmit) {
          // return postData; // Early return if validation fails
          allowAdd = false;
          break;
        }
      } else {
        allowAdd = false;
        toastfunc("Fill all Sales Item Details");
      }
    }
    if (allowAdd) {
      setSalesItemData((prevItemDetails) => [
        ...prevItemDetails,
        {
          ...initialStateItemDetails,
          id_sales_item_detail: uuid(),
          item_type: type,
        },
      ]);
    }
  };

  const handlePurchaseAddItem = () => {
    let allowAdd = true;
    for (const value of purchaseItemData) {
      if (value.selectedProduct !== "" && value.selectedProduct !== null) {
        let allowSubmit = validatePurchaseItemDetails(value);
        if (!allowSubmit) {
          allowAdd = false;
          break;
        }
      } else {
        allowAdd = false;
        toastfunc("Fill all Sales Item Details");
      }
    }
    if (allowAdd) {
      setPurchaseItemData((prevItemDetails) => [
        ...prevItemDetails,
        { ...initialStatePurchase, id_sales_item_detail: uuid() },
      ]);
    }
  };

  const handleDropChange = async (acceptedFiles) => {
    const filesWithPreview = await Promise.all(
      acceptedFiles?.map(async (file) => {
        const base64String = await convert64(file);
        return {
          ...file,
          preview: base64String,
          id: uuid(),
          default: false,
        };
      })
    );

    setItemDeliveredDetails((prevDetails) =>
      prevDetails.map((item, index) =>
        index === activeRow
          ? { ...item, images: [...item.images, ...filesWithPreview] }
          : item
      )
    );
  };

  useEffect(() => {
    setItemDeliveredDetails((prevDetails) => {
      return salesItemData.map((salesItem, index) => {
        const existingItem = prevDetails[index] || {
          ...intialItemDeliveredState,
          id_item_delivered: uuid(),
        };
        return {
          ...existingItem, // Keep manually updated values
          // branch: salesItem.branch ?? existingItem.branch,
          // customer: salesItem.customer ?? existingItem.customer,
          product: salesItem.selectedProduct ?? existingItem.product,
          piece: salesItem.piece ?? existingItem.piece,
          weight: salesItem.grossWeight ?? existingItem.weight,
          remarks: salesItem.remarks ?? existingItem.remarks,
          // images: salesItem.images ?? existingItem.images,
        };
      });
    });
  }, [salesItemData]);

  // useEffect(() => {
  //   setItemDeliveredDetails((prevDetails) => {
  //     // Ensure existing product IDs are tracked properly
  //     const existingProductSet = new Set(prevDetails.map((item) => item.product));

  //     const newItems = salesItemData
  //       .filter((salesItem) => !existingProductSet.has(salesItem.selectedProduct)) // Prevent duplicates based on product
  //       .map((salesItem) => ({
  //         id_item_delivered: uuid(), // Unique ID for delivered item
  //         product: salesItem.selectedProduct || "",
  //         piece: salesItem.piece || 0,
  //         weight: salesItem.grossWeight || 0,
  //         remarks: salesItem.remarks || "",
  //         images: salesItem.images || [],
  //       }));

  //     return [...prevDetails, ...newItems]; // Append new sales items without modifying old ones
  //   });
  // }, [salesItemData]); // Runs only when salesItemData updates

  useEffect(() => {
    setSalesItemData((prevSales) => {
      // const filteredSales = prevSales?.filter(item => !item.isPurchaseItem);
      const movedToPurchase = prevSales?.filter((item) => item.isPurchaseItem);

      setPurchaseItemData((prevPurchase) => [
        ...prevPurchase?.filter(
          (pItem) =>
            !movedToPurchase.some(
              (mItem) =>
                mItem.id_sales_item_detail === pItem.id_sales_item_detail
            )
        ),
        ...movedToPurchase,
      ]);

      return prevSales;
    });

    setPurchaseItemData((prevPurchase) => {
      const filteredPurchase = prevPurchase?.filter(
        (item) => item.isPurchaseItem
      );
      const movedToSales = prevPurchase?.filter((item) => !item.isPurchaseItem);

      setSalesItemData((prevSales) => [
        ...prevSales.filter(
          (sItem) =>
            !movedToSales?.some(
              (mItem) =>
                mItem.id_sales_item_detail === sItem.id_sales_item_detail
            )
        ),
        ...movedToSales,
      ]);

      return filteredPurchase;
    });
  }, [salesItemData]);

  const handelItemDeliverChange = (index, field, value) => {
    setItemDeliveredDetails((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index] = { ...updatedValues[index], [field]: value };
      return updatedValues;
    });
  };

  const selectAllItemDeliveredCol = (value) => {
    itemDeliveredDetails?.map((item, rowIndex) => {
      handelItemDeliverChange(rowIndex, "isChecked", value);
    });
  };

  // const handelItemDeliverChange = (index, field, value) => {
  //   setItemDeliveredDetails((prevValues) => {
  //     const updatedValues = [...prevValues];
  //     const updatedObject = { ...updatedValues[index] };
  //     updatedObject[field] = value;
  //     updatedValues[index] = updatedObject;

  //     return updatedValues;
  //   });
  // };

  const deleteItemDelivery = (ids) => {
    setItemDeliveredDetails((prevState) =>
      prevState?.filter((obj) => obj.id_item_delivered != ids)
    );
  };

  const columns = [
    {
      header: "Is Delivered",
      accessor: "is_delivered",
      textAlign: "center",
      type: "checkbox",
    },
    { header: "Tag No", accessor: "tagCode", textAlign: "center" },
    { header: "Product", accessor: "productName", textAlign: "center" },
    {
      header: "Piece",
      accessor: "piece",
      decimal_places: 0,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Gwt",
      accessor: "grossWeight",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Lwt",
      accessor: "lessWeight",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Nwt",
      accessor: "netWeight",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "VA(%)",
      accessor: "wastagePercentage",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: false,
    },
    {
      header: "VA After Disc(%)",
      accessor: "wastageAfterDiscount",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: false,
    },
    {
      header: "VA(g)",
      accessor: "wastageWeight",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "MC",
      accessor: "mcValue",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
    {
      header: "Taxable",
      accessor: "taxableAmount",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
    {
      header: "Tax(%)",
      accessor: "taxPercentage",
      decimal_places: 2,
      textAlign: "right",
    },
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
    {
      header: "Piece",
      accessor: "piece",
      decimal_places: 0,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Gwt",
      accessor: "grossWeight",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Lwt",
      accessor: "lessWeight",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Nwt",
      accessor: "netWeight",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Dia Wt",
      accessor: "diaWeight",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "VA",
      accessor: "wastageWeight",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Touch",
      accessor: "touch",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Pure",
      accessor: "pureWeight",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
    },
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

  const deliveryLocationOptions = [
    { value: 1, label: "ShowRoom Address" },
    { value: 2, label: "Customer Address" },
  ];

  useEffect(() => {
    setAllowRetailerBilling(userInfo?.user?.retailer_billing);
  }, [userInfo]);

  useEffect(() => {
    // Calculate totals using reduce
    const filteredSalesItemData = salesItemData?.filter(
      (item) => !item?.isPurchaseItem
    );
    const totalTaxableAmount = filteredSalesItemData.reduce(
      (sum, item) => sum + parseFloat(item.taxableAmount || 0),
      0
    );
    const totalSalesGrossWeight = filteredSalesItemData.reduce(
      (sum, item) => sum + parseFloat(item.grossWeight || 0),
      0
    );
    const totalSalesLessWeight = filteredSalesItemData.reduce(
      (sum, item) => sum + parseFloat(item.lessWeight || 0),
      0
    );
    const totalSalesNetWeight = filteredSalesItemData.reduce(
      (sum, item) => sum + parseFloat(item.netWeight || 0),
      0
    );
    const totalSalesPureWeight = filteredSalesItemData.reduce(
      (sum, item) => sum + parseFloat(item.pureWeight || 0),
      0
    );
    const cgst = filteredSalesItemData.reduce(
      (sum, item) => sum + parseFloat(item.cgst || 0),
      0
    );
    const sgst = filteredSalesItemData.reduce(
      (sum, item) => sum + parseFloat(item.sgst || 0),
      0
    );
    const igst = filteredSalesItemData.reduce(
      (sum, item) => sum + parseFloat(item.igst || 0),
      0
    );
    const taxAmount = filteredSalesItemData.reduce(
      (sum, item) => sum + parseFloat(item.taxAmount || 0),
      0
    );
    const salesAmount = filteredSalesItemData.reduce(
      (sum, item) => sum + parseFloat(item.itemCost || 0),
      0
    );
    const purchaseAmount = purchaseItemData?.reduce(
      (sum, item) => sum + parseFloat(item.itemCost || 0),
      0
    );
    const grossWeight = filteredSalesItemData?.reduce(
      (sum, item) => sum + parseFloat(item.grossWeight || 0),
      0
    );
    const VA = filteredSalesItemData.reduce(
      (sum, item) => sum + parseFloat(item.wastageWeight || 0),
      0
    );
    const MC = filteredSalesItemData.reduce(
      (sum, item) => sum + parseFloat(item.mcValue || 0),
      0
    );
    const totalPurchasePureWeight = purchaseItemData.reduce(
      (sum, item) => sum + parseFloat(item.pureWeight || 0),
      0
    );

    // Calculate bill amounts
    // const billAmount = parseFloat(
    //   parseFloat(salesAmount) - parseFloat(purchaseAmount) - parseFloat(totalReturnAmount)
    // ).toFixed(2);
    const billAmount = parseFloat(
      (totalSalesPureWeight - totalPurchasePureWeight) * ratePerGram
    ).toFixed(2);
    const roundOffBillAmount = Math.round(billAmount);
    const roundOffAmount = parseFloat(billAmount) - roundOffBillAmount;

    // Update state
    setTotalTaxableAmount(parseFloat(totalTaxableAmount).toFixed(2));
    setTotalSalesGrossWeight(parseFloat(totalSalesGrossWeight).toFixed(3));
    setTotalSalesLessWeight(parseFloat(totalSalesLessWeight).toFixed(3));
    setTotalSalesNetWeight(parseFloat(totalSalesNetWeight).toFixed(3));
    setTotalSalesPureWeight(parseFloat(totalSalesPureWeight).toFixed(3));
    setTotalPurchasePureWeight(parseFloat(totalPurchasePureWeight).toFixed(3));

    setCgst(parseFloat(cgst).toFixed(2));
    setSgst(parseFloat(sgst).toFixed(2));
    setIgst(parseFloat(igst).toFixed(2));
    setTaxAmount(parseFloat(taxAmount).toFixed(2));
    setTotalSalesAmount(parseFloat(salesAmount).toFixed(2));
    setTotalPurchaseAmount(parseFloat(purchaseAmount).toFixed(2));
    setTotalBillAmount(parseFloat(roundOffBillAmount).toFixed(2));
    setTotalNetAmount(parseFloat(roundOffBillAmount).toFixed(2));
    setRoundOffAmount(parseFloat(roundOffAmount).toFixed(2));
    setTotalGrossWeight(parseFloat(grossWeight).toFixed(2));
    setTotalVA(parseFloat(VA).toFixed(2));
    settotalMC(parseFloat(MC).toFixed(2));
    // Conditional logic based on bill amount
    if (parseFloat(roundOffBillAmount) > 0) {
      setTotalAmountReceived(parseFloat(roundOffBillAmount).toFixed(2));
      setRefundAmount(0);
      setDepositAmount(0);
    } else {
      setRefundAmount(Math.abs(parseFloat(roundOffBillAmount)).toFixed(2));
      setTotalAmountReceived(0);
    }
    // if (isEstDiscountApplied){
    //   calculateDiscountAmount(salesAmount);
    //   setIsEstDiscountApplied(false);
    // }
  }, [JSON.stringify(salesItemData), purchaseItemData, totalReturnAmount]);

  const handleInputChange = (field, value) => {
    if (field === "totalAmountReceived" && parseFloat(totalBillAmount) > 0) {
      if (parseFloat(value) > parseFloat(totalBillAmount)) {
        toastfunc("Received Amount Is Exceed than the Bill Amount");
        setTotalAmountReceived(totalBillAmount);
        setTotalDiscount(0);
      } else if (value === "") {
        setTotalAmountReceived(0);
        setTotalDiscount(0);
      } else {
        setTotalAmountReceived(value);
      }
    }
    if (field === "totalNetAmount") {
      if (parseFloat(totalBillAmount) > 0) {
        if (parseFloat(value) > parseFloat(totalBillAmount)) {
          toastfunc("Net Amount Is Exceed than the Bill Amount");
          setTotalNetAmount(totalBillAmount);
          setTotalDiscount(0);
          setTotalAmountReceived(totalBillAmount);
        } else {
          let discount = parseFloat(
            parseFloat(totalBillAmount) - parseFloat(value)
          ).toFixed(2);
          setTotalDiscount(discount);
          setTotalAmountReceived(value);
          setTotalNetAmount(value);
        }
      }
    }
    if (field === "totalDiscount") {
      if (value < 0) {
        setTotalDiscount(0);
      } else {
        let netAmount = parseFloat(
          parseFloat(totalBillAmount) - parseFloat(value)
        ).toFixed(2);
        setTotalDiscount(value);
        setTotalAmountReceived(netAmount);
        setTotalNetAmount(netAmount);
      }
    }
    if (field === "depositAmount") {
      if (parseFloat(totalBillAmount) < 0) {
        setDepositAmount(value);
      } else {
        setDepositAmount(0);
      }
    }
  };

  useEffect(() => {
    if (!isCredit && parseFloat(totalNetAmount) > 0) {
      setTotalAmountReceived(totalNetAmount);
    }
  }, [isCredit, totalNetAmount]);

  useEffect(() => {
    if (itemDeliveredDetails?.length == 0) {
      addItemDelivered();
    }
  }, [itemDeliveredDetails]);

  useEffect(() => {
    if (salesItemData?.length == 1 && settings?.is_metal_wise_billing == "1") {
      let pro = activeProductList.find(
        (item) => item.pro_id == salesItemData[0].selectedProduct
      );
      if (pro) {
        SetMetal(pro.id_metal);
      }
    }
  }, [salesItemData]);

  useEffect(() => {
    let billAmount = 0;
    if (parseFloat(billAmount) !== 0) {
      if (parseInt(miscBilling) == 1) {
        console.log("totalBillAmount...", totalBillAmount);
        console.log("totalDiscount...", totalDiscount);
        billAmount = parseFloat(
          parseFloat(totalSalesAmount) -
            parseFloat(totalPurchaseAmount) -
            parseFloat(totalReturnAmount)
        ).toFixed(2);
        setTotalDiscount(billAmount);
        setTotalAmountReceived(0);
        console.log("totalDiscount...", totalDiscount);
      } else {
        setTotalDiscount(0);
      }

      let updateSalesItemData = calculateItemDiscountAmount(
        salesItemData,
        billAmount,
        activeProductList,
        totalSalesAmount,
        settingsBillingType
      );
      console.log(updateSalesItemData);
      //setSalesItemData(updateSalesItemData);
    }
  }, [miscBilling, totalReturnAmount, totalPurchaseAmount]);

  useEffect(() => {
    let balance_amount = 0;
    if (totalAmountReceived > 0) {
      balance_amount = parseFloat(
        parseFloat(isUndefined(totalAmountReceived)) -
          parseFloat(
            isUndefined(totalPaymentAmount) +
              parseFloat(isUndefined(totalAdjustedAmount)) +
              parseFloat(isUndefined(totalChitAdjustedAmount)) +
              parseFloat(isUndefined(totalDepositAdjustedAmount))
          )
      ).toFixed(2);
    } else {
      balance_amount = parseFloat(
        parseFloat(isUndefined(refundAmount)) -
          parseFloat(isUndefined(totalPaymentAmount)) -
          parseFloat(
            isUndefined(depositAmount) -
              parseFloat(isUndefined(totalAdjustedAmount)) -
              parseFloat(isUndefined(totalChitAdjustedAmount)) -
              parseFloat(isUndefined(totalDepositAdjustedAmount))
          )
      ).toFixed(2);
    }
    setBalanceAmount(balance_amount);
  }, [
    totalPaymentAmount,
    totalAmountReceived,
    refundAmount,
    depositAmount,
    totalNetAmount,
    totalBillAmount,
    totalAdjustedAmount,
  ]);

  useEffect(() => {
    if (salesItemData.length > 0) {
      calculateDiscountAmount();
    }
  }, [settingsBillingType, ratePerGram]);

  const calculateDiscountAmount = () => {
    console.log(settingsBillingType, "settingsBillingTypesettingsBillingType");
    let updateSalesItemData = calculateItemDiscountAmount(
      salesItemData,
      totalDiscount,
      activeProductList,
      totalSalesAmount,
      settingsBillingType,
      ratePerGram
    );
    console.log(updateSalesItemData);
    setSalesItemData(updateSalesItemData);
  };

  const handleItemTypeChange = (selectedOption) => {
    if (selectedOption != null) {
      setIsPartialSale("0");
      setItemType(selectedOption.value);
      // if(selectedOption.value == 1 ||  selectedOption.value == 2 ){
      //   handleSalesAddItem(selectedOption.value);
      // }
    } else {
      setItemType(null);
    }
  };

  useEffect(() => {
    if (itemType == 1 || itemType == 2) {
      handleSalesAddItem(itemType);
    } else {
      setSalesItemData([]);
    }
  }, [itemType]);

  const handleAddPreview = () => {
    if (salesFormRef.current) {
      salesFormRef.current.submit();
    } else {
      console.log("salesFormRef.current is null");
    }
    setEditIndex(null);
  };

  const resetForm = () => {
    if (salesFormRef.current) {
      salesFormRef.current.resetForm();
    }
    if (paymentFormRef.current) {
      paymentFormRef.current.resetForm();
    } else {
      console.log("paymentFormRef.current is null");
    }
  };

  const handleEdit = (index) => {
    setFormValues({ ...salesItemData[index], editIndex: index });
    setEditIndex(index);
  };

  const handlePurchaseEdit = (index) => {
    setPurchaseFormValues({ ...purchaseItemData[index], editIndex: index });
    setEditIndex(index);
  };

  const handleSalesFormSubmit = (formData) => {
    console.log(formData, itemType, "itemType");
    const tagDetails = salesItemData?.filter(
      (result) => result.tag_code !== "" && result.tag_code === formData.tagCode
    );
    if (tagDetails.length > 0) {
      toastfunc("Tag Code already exists");
    } else {
      const disc_per = parseFloat(
        parseFloat(
          parseFloat(isUndefined(totalDiscount)) /
            parseFloat(isUndefined(totalSalesAmount))
        ) * 100
      );
      const newItem = {
        ...formData,
        item_type: itemType,
        isPartial: itemType === 2 && formValues.tagId ? 1 : isPartialSale,
        tag_id: itemType === 2 && formValues.tagId ? formValues.tagId : "",
        tag_code: formData?.tagCode,
        mcvatotal: parseFloat(
          parseFloat(
            parseFloat(formData.wastageWeight) *
              parseFloat(formData.ratePerGram)
          ) + parseFloat(formData.totalMcValue)
        ).toFixed(2),
      };
      console.log(newItem);
      if (editIndex !== "" && editIndex !== null) {
        const updatedFormData = [...salesItemData];
        updatedFormData[editIndex] = newItem;
        setSalesItemData(updatedFormData);
      } else {
        setSalesItemData((prevData) => [...prevData, newItem]);
      }
      if (miscBilling === "1") {
        setMiscBilling("0");
      }
      setTagCode("");
    }
  };

  let max_outward_cash_limit = userInfo.settings?.max_outward_cash_limit;
  let max_inward_cash_limit = userInfo.settings?.max_inward_cash_limit;

  const validateCashLimit = () => {
    let validate = false;
    console.log(userInfo);

    paymentModeData.forEach((element) => {
      if (element.short_code == "Csh") {
        let max_cash =
          parseFloat(refundAmount) > 0
            ? max_outward_cash_limit
            : max_inward_cash_limit;

        if (
          parseFloat(max_cash) < parseFloat(element.payment_amount) &&
          max_cash != 0 &&
          settingsBillingType !== true
        ) {
          toastfunc(`Max Cash limit is : ${max_cash}`);

          // element['payment_amount'] = max_cash;

          // setValue(`${element.short_code}_payment_amount`, max_cash);

          validate = true;
        }
      }
    });
    //setPaymentModeData(paymentModeData)

    return validate;
  };

  const handleSalesDelete = (index) => {
    SetModalActionName("delete");
    SetDeleteModal(true);
    SetDelId(index);
    SetDelItem("sales");
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
      if (miscBilling === "1") {
        setMiscBilling("0");
      }
    } else if (delItem === "purchase") {
      const updatedFormData = [...purchaseItemData];
      updatedFormData.splice(index, 1);
      setPurchaseItemData(updatedFormData);
      if (miscBilling === "1") {
        setMiscBilling("0");
      }
    }
    toggle();
    SetDelItem("");
  };
  // const handlePurchaseItem = (data) => {
  //     setPurchaseItemData(data);
  //     console.log(purchaseItemData);
  // };

  const handlePurchaseAddPreview = () => {
    if (purchaseFormRef.current) {
      purchaseFormRef.current.submit();
    } else {
      console.log("purchaseFormRef.current is null");
    }
    setEditIndex(null);
  };

  const handlePurchaseItem = (formData) => {
    const newItem = {
      ...formData,
    };
    if (miscBilling === "1") {
      setMiscBilling("0");
    }
    if (editIndex !== "" && editIndex !== null) {
      const updatedFormData = [...purchaseItemData];
      updatedFormData[editIndex] = newItem;
      setPurchaseItemData(updatedFormData);
      console.log(purchaseItemData);
    } else {
      setPurchaseItemData((prevData) => [...prevData, newItem]);
      console.log(purchaseItemData);
    }
  };

  const handleReturnItemCost = (returnItemCost) => {
    setTotalReturnAmount(returnItemCost);
  };

  const handlePaymentData = (data) => {
    setPaymentModeData(data);
    const totalPaidAmount = data.reduce((sum, item) => {
      return sum + parseFloat(item.payment_amount || 0);
    }, 0);
    setTotalPaymentAmount(totalPaidAmount);
  };

  const handleAdvanceAdjustmentData = (data) => {
    setAdvanceAdjustedData(data);
    console.log(advanceAdjustedData);
    const advanceAdjAmount = data?.reduce((sum, item) => {
      return sum + parseFloat(item.utilized_amount || 0);
    }, 0);
    setTotalAdjustedAmount(advanceAdjAmount);
  };

  const handleDepositAdjustmentData = (data) => {
    setDepositAdjustedData(data);
    console.log(depositAdjustedData);
    const depositAdjAmount = data?.reduce((sum, item) => {
      return sum + parseFloat(item.deposit_amount || 0);
    }, 0);
    setTotalDepositAdjustedAmount(depositAdjAmount);
  };

  const handleChitAdjustmentData = (data) => {
    setChitAdjustedData(data);
    console.log(advanceAdjustedData);
    const chitAdjAmount = data?.reduce((sum, item) => {
      return sum + parseFloat(item.amount || 0);
    }, 0);
    setTotalChitAdjustedAmount(chitAdjAmount);
  };

  const handleSalesItemData = (data) => {
    console.log(data);
    setSalesItemData(data);
  };

  const handleReturnData = (data) => {
    console.log(data);
    setReturnItemData(data);
  };

  const handleEstNoSearch = () => {
    if (estNo === "") {
      toastfunc("Please Enter the Est No");
    } else if (idBranch === "") {
      toastfunc("Please Select the Branch");
    } else {
      getEstimationDetails();
    }
  };

  // useEffect(()=>{
  //   if(estNo && estNo.length > 0 && idBranch!=='' && idBranch!==null){
  //     getEstimationDetails();
  //   }
  // },[estNo]);

  const getEstimationDetails = async (est_no = estNo, id_branch = idBranch) => {
    try {
      let requestData = { est_no: est_no, id_branch: id_branch };
      const estimationDetails = await dispatch(
        getEstimationDetailsByNo(requestData)
      ).unwrap();
      console.log(estimationDetails, "estimationDetails");
      const item_details = estimationDetails.sales_details;
      const purchase_details = estimationDetails.purchase_details;
      const return_details = estimationDetails.return_details;
      //setIdBranch(estimationDetails.id_branch);
      SetCustomer(estimationDetails.id_customer);
      SetCustomerSearch([
        estimationDetails.customer_name +
          " " +
          estimationDetails.customer_mobile,
      ]);
      setIsSearching(false);
      if (item_details.length > 0) {
        setSalesItemDetails(item_details);
        setTotalDiscount(estimationDetails.total_discount_amount);
        setIsEstDiscountApplied(true);
        //setTimeout(calculateDiscountAmount, 5000);
      }
      if (purchase_details.length > 0) {
        purchase_details.forEach((response) => {
          let itemExists = false;
          const estItemDetails = purchaseItemData?.filter(
            (result) =>
              result.est_old_metal_item_id === response.est_old_metal_item_id
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
        return_details.forEach((response) => {
          const estItemDetails = returnItemData?.filter(
            (result) =>
              result.est_return_item_id === response.est_return_item_id
          );
          let itemExists = false;
          if (estItemDetails.length > 0) {
            itemExists = true;
            toastfunc("Item already Exists");
          }
          if (!itemExists) {
            const returnItemDetails = setReturnItemDetails(response);
            setReturnItemData((prevItemDetails) => [
              ...prevItemDetails,
              returnItemDetails,
            ]);
          }
        });
      }
      setEstNo("");
    } catch (error) {
      console.log(error);
    }
  };

  const setSalesItemDetails = (item_details) => {
    item_details.forEach((response) => {
      if (response.cat_id && response.id_purity && response.id_product) {
        const estItemDetails = salesItemData?.filter(
          (result) =>
            result.est_item_id === response.est_item_id &&
            result?.est_item_id != undefined
        );
        const estTagDetails = salesItemData?.filter(
          (result) => result.tagCode === response.tag_code
        );
        let itemExists = false;
        console.log("estItemDetails", estItemDetails);
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
            settingsBillingType
          );
          setSalesItemData((prevData) => [...prevData, initialState]);
        }
      }
    });
  };

  useEffect(() => {
    if (tagCode && tagCode.length > 5) {
      handleTagSearch();
    }
  }, [tagCode]);

  const handleTagSearch = async () => {
    const tagDetails = salesItemData?.filter(
      (result) => result.tagCode === tagCode
    );

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

  const handleSearch = async () => {
    if (tagCode === "") {
      handleOldTagSearch();
    } else {
      handleTagSearch();
    }
  };
  useEffect(() => {
    if (oldTagCode && oldTagCode.length > 5) {
      handleOldTagSearch();
    }
  }, [oldTagCode]);

  const handleOldTagSearch = async () => {
    const tagDetails = salesItemData?.filter(
      (result) => result.old_tag_code === oldTagCode
    );

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

  const getTagDetails = async (requestData) => {
    try {
      let tagDetails = [];
      //  let requestData = { tagCode: tagCode, idBranch: idBranch };
      let response = {};
      if (itemType === 0) {
        response = await dispatch(getTagDetailsByCode(requestData)).unwrap();
      } else if (itemType === 2) {
        response = await dispatch(
          getPartlySoldTagDetailsByCode(requestData)
        ).unwrap();
      }
      let tagResult = {
        ...response,
        item_type: itemType,
        id_product: response.tag_product_id,
        id_design: response.tag_design_id,
        id_purity: response.tag_purity_id,
        id_sub_design: response.tag_sub_design_id,
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
        sell_rate: response.tag_sell_rate,
        maxGrossWeight: response.tag_gwt,
        tagGrossWeight: response.tag_gwt,
        tagStoneDetails: response.stone_details,
      };

      tagDetails.push(tagResult);
      console.log(tagDetails);
      setSalesItemDetails(tagDetails);
      setTagCode("");
      // let initialState = setTagDetails(response);
      // setFormValues(initialState);
    } catch (error) {
      console.error(error);
    }
  };

  const getOrderTagDetails = async () => {
    try {
      let requestData = {
        order_no: orderNo,
        fin_id: finYear,
        id_customer: customer,
        id_branch: idBranch,
      };
      const response = await dispatch(getOrderDelivery(requestData)).unwrap();
      if (response.order_details === 0) {
        toastfunc("No Records Found..");
      } else {
        setSalesItemDetails(response.order_details);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrderNoSearch = async () => {
    if (orderNo === "") {
      toastfunc("Please Enter The Tag Code");
    } else if (customer === "" || customer === null || customer === undefined) {
      toastfunc("Please Select The Customer");
    } else if (finYear === "") {
      toastfunc("Please select the Fin Year");
    } else {
      getOrderTagDetails();
    }
  };

  const onClickSave = (formData) => {
    let allowSubmit = true;
    if (idBranch === "" || idBranch === null) {
      toastfunc("Please Select Branch");
    } else if (
      salesItemData.length === 0 &&
      purchaseItemData.length === 0 &&
      returnItemData.length === 0
    ) {
      toastfunc("Please Add the Item Details");
    } else if (customer === "" || customer === null || customer === undefined) {
      toastfunc("Please Select the Customer");
    } else if (employee === "" || employee === null || employee === undefined) {
      toastfunc("Please Select the Employee");
    } else if (paymentModeData.length > 0 && validateCashLimit()) {
    } else {
      setIsSubmitted(true);
      let dueAmount =
        parseFloat(isUndefined(totalNetAmount)) > 0
          ? parseFloat(
              parseFloat(isUndefined(totalNetAmount)) -
                parseFloat(isUndefined(totalAmountReceived))
            ).toFixed(2)
          : 0;
      let invoiceSalesDetails = createSalesItemData(
        salesItemData?.filter((item) => !item.isPurchaseItem), // Only sales items
        employee,
        activeProductList,
        invoiceTo
      );
      if (salesItemData.length > 0) {
        if (
          invoiceSalesDetails?.length !==
          salesItemData?.filter((item) => !item.isPurchaseItem)?.length
        ) {
          allowSubmit = false;
          setIsSubmitted(false);
        }
      }
      if (allowSubmit) {
        const selectedItemDeliveredDetails = itemDeliveredDetails?.filter(
          (item) => item?.isChecked === true
        );
        const postData = {
          invoice: {
            id_branch: idBranch,
            id_customer: customer,
            is_credit: isCredit ? 1 : 0,
            invoice_for: invoiceFor,
            invoice_to: invoiceTo,
            pan_number: panNumber !== "" ? panNumber : null,
            gst_number: gstNumber !== "" ? gstNumber : null,
            sales_amount: isUndefined(totalSalesAmount),
            purchase_amount: isUndefined(totalPurchaseAmount),
            return_amount: isUndefined(totalReturnAmount),
            total_discount_amount: isUndefined(totalDiscount),
            total_adjusted_amount: isUndefined(totalAdjustedAmount),
            total_chit_amount: isUndefined(totalChitAdjustedAmount),
            total_deposit_amount: isUndefined(totalDepositAdjustedAmount),
            net_amount: isUndefined(totalNetAmount),
            received_amount: isUndefined(totalAmountReceived),
            deposit_amount: isUndefined(depositAmount),
            refund_amount: isUndefined(refundAmount),
            due_amount: dueAmount,
            round_off: isUndefined(roundOff),
            id_employee: employee,
            is_promotional_billing: miscBilling,
            delivery_location: deliveryLocation,
            metal: null,
            setting_bill_type: 1,
          },

          sales_details: salesItemData.length > 0 ? invoiceSalesDetails : [],
          purchase_details:
            purchaseItemData.length > 0
              ? createPurchaseItemData(purchaseItemData)
              : [],
          payment_details:
            paymentModeData.length > 0
              ? setPaymentDetails(paymentModeData, refundAmount)
              : [],
          return_details:
            returnItemData.length > 0
              ? createSalesReturnItemData(returnItemData)
              : [],
          advance_adjusted_details:
            advanceAdjustedData?.length > 0 ? advanceAdjustedData : [],
          deposit_details:
            depositAdjustedData?.length > 0 ? depositAdjustedData : [],
          scheme_details: chitAdjustedData?.length > 0 ? chitAdjustedData : [],
          item_delivered_details:
            selectedItemDeliveredDetails?.length > 0
              ? selectedItemDeliveredDetails
              : [],
        };
        submitForm(postData);
        // console.log(postData);
      }
    }
  };

  const setReturnDetails = (data) => {
    let returnItemDetails = [];
    data.forEach((val) => {
      returnItemDetails.push({
        invoice_sale_item_id: val.invoice_sale_item_id,
      });
    });
    return returnItemDetails;
  };

  const setPaymentDetails = (data, refundAmount) => {
    let paymentModeDetails = [];
    data.forEach((val) => {
      if (val.payment_amount > 0) {
        paymentModeDetails.push({
          payment_type: parseFloat(refundAmount) > 0 ? 2 : 1,
          id_mode: val.id_mode,
          short_code: val.short_code,
          payment_amount: val.payment_amount,
          card_no: val.card_no,
          card_holder: val.card_holder,
          payment_ref_number: val.payment_ref_number,
          card_type: val.card_type,
          id_nb_type: val.id_nb_type !== "" ? val.id_nb_type : null,
          id_bank: val.id_bank !== "" ? val.id_bank : null,
          id_pay_device: val.id_pay_device,
        });
      }
    });
    return paymentModeDetails;
  };

  const submitForm = async (postData) => {
    try {
      let response = "";
      response = await dispatch(createInvoice(postData)).unwrap();
      resetBillingForm();
      let data = {
        settings: settings,
        itemDetails: response.data.response_data,
      };
      secureLocalStorage.setItem("pageState", JSON.stringify(data));
      window.open(`${process.env.PUBLIC_URL}/billing/print`, "_blank");
    } catch (error) {
      setIsSubmitted(false);
    }
  };

  const resetBillingForm = () => {
    SetCustomerSearch([]);
    setCustomerDetails({});
    setSalesItemData([]);
    setPurchaseItemData([]);
    setPaymentModeData([]);
    setIsSubmitted(false);
    setTotalPaymentAmount(0);
    setItemType(0);
    SetCustomer("");
    setIsPartialSale("0");
    setPanNumber("");
    setGstNumber("");
    if (paymentFormRef.current) {
      paymentFormRef.current.resetForm();
    }
  };

  const downloadPDF = async (printPageURL, id) => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/${printPageURL}/${id}/`,
      {
        headers: {
          Authorization: `Token ${secureLocalStorage.getItem("pref")?.token}`,
        },
      }
    );

    try {
      const response = await axios.get(data?.data?.pdf_url, {
        responseType: "blob",
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(pdfBlob);

      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.target = "_blank";
      tempLink.setAttribute("print", `invoice.pdf`);

      document.body.appendChild(tempLink);
      tempLink.click();

      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const navigateCreateCustomer = () => {
    navigate(
      {
        pathname: `${process.env.PUBLIC_URL}/master/customer/add`,
      },
      {
        state: {
          add: true,
          createMobNum: createMobNum,
          navigateLink: `/billing/add`,
        },
      }
    );
  };

  useEffect(() => {
    if (estDetails) {
      if (
        estDetails.est_no &&
        estDetails.est_no.length > 0 &&
        estDetails.id_branch !== "" &&
        estDetails.id_branch !== null
      ) {
        // const setEstmation = async () => {
        //   // await sleep(10000);
        //   const estimationDetails = estDetails;
        //   const item_details = estimationDetails.sales_details;
        //   const purchase_details = estimationDetails.purchase_details;
        //   setIdBranch(estimationDetails.id_branch);
        //   SetCustomer(estimationDetails.id_customer);
        //   SetCustomerSearch([estimationDetails.customer_name + " " + estimationDetails.customer_mobile]);
        //   if (item_details.length > 0) {
        //     setSalesItemDetails(item_details);
        //     setTotalDiscount(estimationDetails.total_discount_amount);
        //   }
        //   if (purchase_details.length > 0) {
        //     purchase_details.forEach((response) => {
        //       let itemExists = false;
        //       const estItemDetails = purchaseItemData?.filter(
        //         (result) => result.est_old_metal_item_id === response.est_old_metal_item_id
        //       );
        //       if (estItemDetails.length > 0) {
        //         itemExists = true;
        //         toastfunc("Estimation already Exists");
        //       }
        //       if (!itemExists) {
        //         let initialState = setPurchaseItemDetails(response);
        //         setPurchaseItemData((prevData) => [...prevData, initialState]);
        //       }
        //     });
        //   }
        //   setBillTypeTab("4");
        // };
        // setEstmation();
        getEstimationDetails(estDetails.est_no, estDetails.id_branch);
        console.log(
          estDetails.est_no,
          estDetails.id_branch,
          "estDetails.est_no,estDetails.id_branch"
        );
      }
    }
  }, [estDetails]);

  return {
    add,
    id,
    idBranch,
    setIdBranch,
    itemType,
    setItemType,
    isPartialSale,
    setIsPartialSale,
    allowRetailerBilling,
    customer,
    SetCustomer,
    customerSearch,
    SetCustomerSearch,
    columns,
    purchaseColumns,
    options,
    salesFormRef,
    purchaseFormRef,
    paymentFormRef,
    getTagDetails,
    tagCode,
    setTagCode,
    orderNo,
    setOrderNo,
    estNo,
    setEstNo,
    handleInputChange,
    handleEdit,
    handlePurchaseEdit,
    handleAddPreview,
    handlePurchaseAddPreview,
    resetForm,
    handleSalesFormSubmit,
    handlePurchaseItem,
    handleReturnData,
    handleReturnItemCost,
    handleTagSearch,
    handleOrderNoSearch,
    handleEstNoSearch,
    handleItemTypeChange,
    salesItemData,
    purchaseItemData,
    formValues,
    purchaseFormValues,
    editIndex,
    onClickSave,
    isSubmitted,
    totalTaxableAmount,
    totalSalesGrossWeight,
    totalSalesLessWeight,
    totalSalesNetWeight,
    totalSalesPureWeight,
    cgst,
    sgst,
    igst,
    taxAmount,
    totalSalesAmount,
    totalPurchaseAmount,
    totalReturnAmount,
    totalBillAmount,
    totalNetAmount,
    totalAmountReceived,
    totalDiscount,
    balanceAmount,
    handlePaymentData,
    handleAdvanceAdjustmentData,
    handleDepositAdjustmentData,
    handleChitAdjustmentData,
    totalPaymentAmount,
    totalAdjustedAmount,
    totalDepositAdjustedAmount,
    totalChitAdjustedAmount,
    refundAmount,
    depositAmount,
    calculateDiscountAmount,
    deleteModal,
    toggle,
    handleSalesDelete,
    handlePurchaseDelete,
    deleteSaleItem,
    employee,
    SetEmployee,
    setIsCredit,
    isCredit,
    finYear,
    finYearName,
    setFinYear,
    setFinYearName,
    invoiceFor,
    setInvoiceFor,
    invoiceTo,
    setInvoiceTo,
    setMiscBilling,
    miscBilling,
    panNumber,
    setPanNumber,
    gstNumber,
    setGstNumber,
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
    setSalesItemData,
    customerDetails,
    setCustomerDetails,
    totalMC,
    totalVA,
    totalGrossWeight,
    metalPurityRateList,
    metalRateInfo,
    settingsBillingType,
    setSettingsBillingType,
    oldTagCode,
    setOldTagCode,
    handleSearch,
    deliveryLocationOptions,
    setDeliveryLocation,
    deliveryLocation,
    handelChange,
    SetEmpItemId,
    empItemId,
    toggleEmployeeModal,
    employeeModal,
    SetEmployeeModal,
    handleSalesSubEmployee,
    returnItemData,
    setReturnItemData,
    handleSalesItemData,
    itemDeliveredDetails,
    setItemDeliveredDetails,
    handelItemDeliverChange,
    addItemDelivered,
    deleteItemDelivery,
    handleDropChange,
    imageModal,
    SetImageModal,
    activeRow,
    setActiveRow,
    toggleImageModal,
    imageToggle,
    selectAllItemDelivered,
    setSelectAllItemDelivered,
    selectAllItemDeliveredCol,
    handleSalesAddItem,
    SetMetal,
    metal,
    navigateModalOpened,
    setNavigateModalOpened,
    ratePerGram,
    setRatePerGram,
    setPurchaseItemData,
    handlePurchaseAddItem,
    totalPurchasePureWeight,
  };
};
export default useBillingFormWholesaleHandling;
