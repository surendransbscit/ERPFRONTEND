import { useState, useEffect, useRef } from "react";
import {
  calculateNetWeight,
  calculateOtherMetalAmount,
  calculatePurchaseCost,
  calculatePureWeight,
  isUndefined,
} from "../../components/common/calculations/ErpCalculations";
import {
  toastfunc,
  toastsuccess,
} from "../../components/sds-toast-style/toast-style";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import moment from "moment/moment";
import {
  createPurchaseEntry,
  deletePurchaseItemByID,
  getPurchaseEntryById,
  updatePurchaseEntry,
} from "../../redux/thunks/purchase";
import { useHotkeys } from "react-hotkeys-hook";
import { useBillSettingContext } from "../../contexts/BillSettingContext";
const usePurchaseEntryFormHandling = (
  products,
  designs,
  subDesigns,
  id,
  idBranch,
  idSupplier,
  mcVaSetiings,
  remarks
) => {
  const initialState = {
    isHalMarked: "1",
    selectedCategory: "",
    selectedPurity: "",
    selectedProduct: "",
    selectedDesign: "",
    selectedSubDesign: "",
    selectedSection: "",
    otherChargesDetails: [],
    otherChargesAmount: 0,
    stoneAmount: 0,
    piece: "",
    uomId: 1,
    grossWeight: 0.0,
    lessWeight: 0.0,
    otherMetalWeight: 0.0,
    stnWeight: 0.0,
    diaWeight: 0.0,
    netWeight: 0.0,
    sellRate: 0.0,
    purchaseTouch: 0,
    purchaseWastage: 0,
    purchaseMc: 0,
    purchaseMcType: 1,
    purchaseRate: 0,
    rateCalcType: 1,
    pureWeight: 0.0,
    pureCalcType: 2,
    purchaseRateType: 1,
    tax_id: 0,
    taxType: "",
    taxPercentage: 0,
    taxAmount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    purchaseCost: 0.0,
    editIndex: "",
    stoneDetails: [],
    otherMetalDetails: [],
    id_purchase_entry_detail: "",
    flatMcValue: 0,
    selectedSize: "",
    totalPurchaseMc: 0,
  };
  const {
      userInfo,
      userInfo: { settings },
    } = useSelector((state) => state.authUserReducer);

  console.log(settings?.purchase_print_template);


  const initialColumns = [
    { header: "Product", accessor: "productName" },
    {
      header: "Piece",
      accessor: "piece",
      decimal_places: 0,
      isTotalReq: true,
      textAlign: "right",
    },
    {
      header: "Gwt",
      accessor: "grossWeight",
      decimal_places: 3,
      isTotalReq: true,
      textAlign: "right",
    },
    {
      header: "Lwt",
      accessor: "lessWeight",
      decimal_places: 3,
      isTotalReq: true,
      textAlign: "right",
    },
    {
      header: "Nwt",
      accessor: "netWeight",
      decimal_places: 3,
      isTotalReq: true,
      textAlign: "right",
    },
    {
      header: "Stn Wt",
      accessor: "stnWeight",
      decimal_places: 3,
      isTotalReq: true,
      textAlign: "right",
    },
    {
      header: "Dia Wt",
      accessor: "diaWeight",
      decimal_places: 3,
      isTotalReq: true,
      textAlign: "right",
    },
    {
      header: "Touch",
      accessor: "purchaseTouch",
      decimal_places: 2,
      isTotalReq: false,
      textAlign: "right",
    },
     {
      header: "V.A",
      accessor: "purchaseWastage",
      decimal_places: 2,
      isTotalReq: false,
      textAlign: "right",
    },
    {
      header: "Pure Wt",
      accessor: "pureWeight",
      decimal_places: 3,
      isTotalReq: true,
      textAlign: "right",
    },
   
    {
      header: "Pur Cost",
      accessor: "purchaseCost",
      decimal_places: 2,
      isTotalReq: true,
      textAlign: "right",
      isCurrency: true,
    },
  ];

  const [selectedBranchId, selectedBranch] = useState("");
  const [selectedSupplierID, selectedSupplier] = useState("");
  const [formValues, setFormValues] = useState(initialState);
  const [supplierBillRefNo, setSupplierBillRefNo] = useState("");
  const [daysOfPayment, setDaysOfPayment] = useState();
  const [paymentDate, setPaymentDate] = useState();
  const [supplierBillRefDate, setSupplierBillRefDate] = useState(new Date());
  const [formData, setFormData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSectionRequired, setIsSectionRequired] = useState(false);
  const [isMrpItem, setIsMrpItem] = useState(false);
  const [fixedRateCalc, setFixedRateItem] = useState(false);
  const [delId, SetDelId] = useState();
  const [deleteModal, SetDeleteModal] = useState(false);
  const [modalActionName, SetModalActionName] = useState("");
  const [columns, SetColumns] = useState(initialColumns);
  const [isPurchaseDetailsDisable, setIsPurchaseDetailsDisable] =
    useState(false);
  const [isTaxRequired, setIsTaxRequired] = useState(true);
  const toggle = () => SetDeleteModal(!deleteModal);
  const lessWeightRef = useRef();
  const otherMetalWeightRef = useRef();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.lotReducer
  );
  const { isLoading, lotItemDetails } = useSelector(
    (state) => state.lotReducer
  );
  const { purchaseInfo } = useSelector((state) => state.purchaseReducer);
  const { accessBranches } = useSelector((state) => state.coreCompReducer);
  const { activeKarigarList } = useSelector((state) => state.karigarReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]); // Current date in YYYY-MM-DD
  const { billSettingType } = useBillSettingContext();
  const [entryDate, setEntryDate] = useState(new Date());
  const [taxableAmount, setTaxableAmount] = useState(0);
  const [totalItemCost, setTotalItemCost] = useState(0);
  const [tdsPercentage, setTdsPercentage] = useState(0);
  const [totalBillAmount, setTotalBillAmount] = useState(0);
  const [cgstCost, setCgstCost] = useState(0);
  const [sgstCost, setSgstCost] = useState(0);
  const [igstCost, setIgstCost] = useState(0);
  const [tdsAmount, setTdsAmount] = useState(0);
  const [otherChargesAmount,setOtherChargesAmount] = useState(0);
  const [otherChargesDetails, setOtherChargesDetails] = useState([]);

  useEffect(() => {
    if (settings?.is_sub_design_req != 1) {
      const updatedColumns = initialColumns.filter(
        (column) => column.accessor !== "subDesignName"
      );
      SetColumns(updatedColumns);
    }
    if (settings?.allow_pur_det_add_in_pur_entry === false) {
      setIsPurchaseDetailsDisable(true);
    }
  }, [settings]);

  useEffect(() => {
    if (billSettingType == 1) {
      setIsTaxRequired(true);
    } else {
      setIsTaxRequired(false);
    }
  }, [billSettingType]);

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      if (id !== undefined) {
        try {
          let response = await dispatch(getPurchaseEntryById(id)).unwrap();
          setPurchaseEntryDetails(response);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchPurchaseDetails();
  }, [dispatch, id]);

  const setPurchaseEntryDetails = (purchaseDetails) => {
    selectedBranch(purchaseDetails.id_branch);
    selectedSupplier(purchaseDetails.id_supplier);
    setSupplierBillRefNo(purchaseDetails.supplier_bill_ref_no);
    setSupplierBillRefDate(new Date(purchaseDetails?.supplier_bill_ref_date));
    setEntryDate(new Date(purchaseDetails?.entry_date));
    setPaymentDate(
      moment(purchaseDetails?.payment_date, "YYYY-MM-DD").format("DD-MM-YYYY")
    );
    const currentDate = new Date(new Date().toISOString().split("T")[0]);
    const SupplierPaymentDate = new Date(purchaseDetails?.payment_date);
    const differenceInTime = SupplierPaymentDate - currentDate; // Difference in milliseconds
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24)
    ); // Convert to days
    setDaysOfPayment(differenceInDays);
    let itemDetails = purchaseDetails.item_details;
    let purchaseItemDet = [];
    if (itemDetails.length > 0) {
      itemDetails.forEach((val) => {
        purchaseItemDet.push({
          isHalMarked: val.is_halmarked,
          selectedCategory: val.id_category,
          selectedPurity: val.id_purity,
          selectedProduct: val.id_product,
          selectedDesign: val.id_design,
          selectedSubDesign: val.id_sub_design,
          selectedSection: val.id_section,
          otherChargesDetails: [],
          otherChargesAmount: 0,
          piece: val.pieces,
          uomId: val.uom_id,
          grossWeight: val.gross_wt,
          lessWeight: val.less_wt,
          otherMetalWeight: val.other_metal_wt,
          stnWeight: val.stone_wt,
          diaWeight: val.dia_wt,
          netWeight: val.net_wt,
          sellRate: val.sell_rate,
          purchaseTouch: val.purchase_touch,
          purchaseWastage: val.purchase_va,
          purchaseMc: val.purchase_mc,
          purchaseMcType: val.purchase_mc_type,
          purchaseRate: val.purchase_rate,
          rateCalcType: val.purchase_rate_type,
          pureWeight: val.pure_wt,
          pureCalcType: val.pure_wt_cal_type,
          purchaseRateType: val.purchase_rate_type,
          tax_id: val.tax_id,
          taxType: val.tax_type,
          taxPercentage: val.tax_percentage,
          taxAmount: val.tax_amount,
          cgst: val.cgst_cost,
          sgst: val.sgst_cost,
          igst: val.igst_cost,
          purchaseCost: val.purchase_cost,
          editIndex: "",
          stoneDetails: val?.stone_details
            ? setEditStoneDetails(val?.stone_details)
            : [],
          otherMetalDetails: [],
          flatMcValue: val.purchase_flat_mc,
          selectedSize: "",
          totalPurchaseMc: val.total_mc_value,
          productName: val?.product_name,
          designName: val?.design_name,
          subDesignName: val?.sub_design_name,
          stockType: val.stock_type,
          id_purchase_entry_detail: val?.id_purchase_entry_detail,
        });
      });
      setFormData(purchaseItemDet);
    }
  };

  const setEditStoneDetails = (data) => {
    let stone_details = [];
    if (data.length > 0) {
      stone_details = data.map((item) => ({
        show_in_lwt: item.show_in_lwt,
        stone_name: item.stone_name,
        id_stone: item.id_stone,
        stone_type: item.stone_type,
        id_quality_code: item.id_quality_code,
        piece: item.stone_pcs,
        stone_rate: item.pur_st_rate,
        weight: item.stone_wt,
        uom_id: item.uom_id,
        stone_amount: item.pur_stn_cost,
        divided_by_value: item.divided_by_value,
        stn_calc_type: item.pur_stn_cal_type,
        id_purchase_stn_detail: item.id_purchase_stn_detail,
        uom_name: item.uom_name,
      }));
    }
    return stone_details;
  };

  const calculate_purchase_item_cost = () => {
      let otherMetalAmount = 0;
            let stoneCost = 0;
            if (formValues?.otherMetalDetails?.length > 0) {
              formValues?.otherMetalDetails?.forEach((item) => {
                let otherMetalItemCost = calculateOtherMetalAmount({
                  weight: item.weight,
                  piece: item.piece,
                  rate: item.ratePerGram,
                  wastage_weight: item.wastageWeight,
                  rate_calc_type: item.calc_type,
                  mcType: item.mcType,
                  mcValue: item.mcValue,
                });
                otherMetalAmount += parseFloat(otherMetalItemCost);
              });
              console.log(otherMetalAmount);
            }
           stoneCost = [...formValues.stoneDetails].reduce(
            (sum, item) => parseFloat(sum) + parseFloat(item.stone_amount),
            0
          );
          const otherChargesAmount = [...formValues.otherChargesDetails].reduce(
            (sum, item) => parseFloat(sum) + parseFloat(item.amount),
            0
          );
          let selectedBranch = accessBranches.find(
            (branch) => branch.id_branch === parseInt(idBranch)
          );
          let selectedKarigar = activeKarigarList.find(
            (karigar) => karigar.id_supplier === parseInt(idSupplier)
          );
          const itemCostDetails = calculatePurchaseCost({
            pureWeight: formValues.pureWeight,
            purchaseMcType: formValues.purchaseMcType,
            flatMcValue: formValues.flatMcValue,
            purchaseMc: formValues.purchaseMc,
            purchaseRate: formValues.purchaseRate,
            netWeight: formValues.netWeight,
            piece: formValues.piece,
            rateCalcType: formValues.rateCalcType,
            taxType: formValues.taxType,
            taxPercentage: formValues.taxPercentage,
            otherMetalAmount: otherMetalAmount,
            stoneAmount: stoneCost,
            grossWeight: formValues.grossWeight,
            settingsMcType: formValues.settingsMcType,
            otherChargesAmount: otherChargesAmount,
            branchCountry: selectedBranch?.country,
            branchState: selectedBranch?.state,
            purchaseCountry: selectedKarigar?.id_country,
            purchaseState: selectedKarigar?.id_state,
            tax_required_in_purchase: settings?.tax_required_in_purchase,
          });
          formValues.purchaseCost = itemCostDetails.purchaseCost;
          formValues.taxAmount = itemCostDetails.taxAmount;
          formValues.cgst = itemCostDetails.cgst;
          formValues.sgst = itemCostDetails.sgst;
          formValues.igst = itemCostDetails.igst;
          formValues.totalPurchaseMc = itemCostDetails.totalPurchaseMc;

          let updatedValues = {
            purchaseCost: itemCostDetails.purchaseCost,
            taxAmount: itemCostDetails.taxAmount,
            cgst: itemCostDetails.cgst,
            sgst: itemCostDetails.sgst,
            igst: itemCostDetails.igst,
            otherChargesAmount: otherChargesAmount,
            totalPurchaseMc: itemCostDetails.totalPurchaseMc,
            stoneAmount: stoneCost,
          };
          setFormValues((prevValues) => ({
            ...prevValues,
            ...updatedValues,
          }));
  }

  const handleInputChange = (field, value) => {
    // if(field=="purchaseCost"){
    //   if(formValues.pureWeight > 0){
    //       let ratePerGram = parseFloat(parseFloat(value) / parseFloat(formValues.pureWeight)).toFixed(2);
    //       console.log("value", value);
    //       console.log("formValues.pureWeight", formValues.pureWeight);
    //       setFormValues((prevValues) => ({...prevValues, purchaseRate: ratePerGram}));
    //   }
    // }
    // if(field === "purchaseRate") {
    //   if(formValues.pureWeight > 0){
    //       let purchaseCost = parseFloat(parseFloat(value) * parseFloat(formValues.pureWeight)).toFixed(2);
    //       setFormValues((prevValues) => ({...prevValues, purchaseCost: purchaseCost}));
    //       setFormValues((prevValues) => ({...prevValues, taxType: 1}));
    //       calculate_purchase_item_cost()
    //   }
    // }
    setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const handleSetStoneDetails = (data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      stoneDetails: data,
    }));
    console.log(formValues);
  };

  const handleSetOtherMetalDetails = (data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      otherMetalDetails: data,
    }));
  };

  useEffect(() => {
    if (
      formValues.selectedProduct !== "" &&
      formValues.selectedProduct !== null
    ) {
      const product = products.find(
        (val) => val.pro_id === formValues.selectedProduct
      );
      const taxType = product.tax_type;
      const tax_id = isTaxRequired ? product.tax_id : "";
      const taxPercentage = isTaxRequired ? product.tax_percentage : 0;
      if (parseInt(product.sales_mode) == 1) {
        setFixedRateItem(false);
      } else {
        setFixedRateItem(true);
      }
      if (parseInt(product.stock_type) == 1) {
        setIsSectionRequired(true);
      } else {
        setIsSectionRequired(false);
      }
      if (
        parseInt(product.fixed_rate_type) === 2 &&
        parseInt(product.sales_mode) === 0
      ) {
        setIsMrpItem(true);
        formValues.grossWeight = 0;
      } else {
        setIsMrpItem(false);
      }
      formValues.taxPercentage = taxPercentage;

      const updatedValues = {
        taxPercentage: taxPercentage,
        taxType: taxType,
        tax_id: tax_id,
      };

      setFormValues((prevValues) => ({
        ...prevValues,
        ...updatedValues,
      }));
    }
  }, [formValues.selectedProduct]);

  useEffect(() => {
    const net_weight = calculateNetWeight({
      gross_weight: formValues.grossWeight,
      less_weight: formValues.lessWeight,
      other_metal_weight: formValues.otherMetalWeight,
    });
    setFormValues((prevValues) => ({
      ...prevValues,
      netWeight: net_weight,
    }));
  }, [
    formValues.grossWeight,
    formValues.lessWeight,
    formValues.otherMetalWeight,
  ]);

  useEffect(() => {
    if (
      formValues.purchaseTouch != "" &&
      formValues.purchaseTouch != 0 &&
      formValues.purchaseTouch !== null
    ) {
      const pureWeight = calculatePureWeight({
        netWeight: formValues.netWeight,
        purchaseTouch: formValues.purchaseTouch,
        pureCalcType: formValues.pureCalcType,
        purchaseWastage: formValues.purchaseWastage,
      });
      setFormValues((prevValues) => ({
        ...prevValues,
        pureWeight: pureWeight,
      }));
    }
  }, [
    formValues.purchaseTouch,
    formValues.purchaseWastage,
    formValues.netWeight,
    formValues.pureCalcType,
  ]);

  useEffect(() => {
    if (formValues.pureWeight !== 0) {
      let otherMetalAmount = 0;
      let stoneCost = 0;
      if (formValues?.otherMetalDetails?.length > 0) {
        formValues?.otherMetalDetails?.forEach((item) => {
          let otherMetalItemCost = calculateOtherMetalAmount({
            weight: item.weight,
            piece: item.piece,
            rate: item.ratePerGram,
            wastage_weight: item.wastageWeight,
            rate_calc_type: item.calc_type,
            mcType: item.mcType,
            mcValue: item.mcValue,
          });
          otherMetalAmount += parseFloat(otherMetalItemCost);
        });
        console.log(otherMetalAmount);
      }

      stoneCost = [...formValues.stoneDetails].reduce(
        (sum, item) => parseFloat(sum) + parseFloat(item.stone_amount),
        0
      );
      const otherChargesAmount = [...formValues.otherChargesDetails].reduce(
        (sum, item) => parseFloat(sum) + parseFloat(item.amount),
        0
      );
      let selectedBranch = accessBranches.find(
        (branch) => branch.id_branch === parseInt(idBranch)
      );
      let selectedKarigar = activeKarigarList.find(
        (karigar) => karigar.id_supplier === parseInt(idSupplier)
      );
      console.log("selectedBranch", selectedBranch);
      console.log("selectedKarigar", selectedKarigar);
      const itemCostDetails = calculatePurchaseCost({
        pureWeight: formValues.pureWeight,
        purchaseMcType: formValues.purchaseMcType,
        flatMcValue: formValues.flatMcValue,
        purchaseMc: formValues.purchaseMc,
        purchaseRate: formValues.purchaseRate,
        netWeight: formValues.netWeight,
        piece: formValues.piece,
        rateCalcType: formValues.rateCalcType,
        taxType: formValues.taxType,
        taxPercentage: formValues.taxPercentage,
        otherMetalAmount: otherMetalAmount,
        stoneAmount: stoneCost,
        grossWeight: formValues.grossWeight,
        settingsMcType: formValues.settingsMcType,
        otherChargesAmount: otherChargesAmount,
        branchCountry: selectedBranch?.country,
        branchState: selectedBranch?.state,
        purchaseCountry: selectedKarigar?.id_country,
        purchaseState: selectedKarigar?.id_state,
        tax_required_in_purchase: settings?.tax_required_in_purchase,
      });
      console.log("taxType:", formValues.taxType);
      formValues.purchaseCost = itemCostDetails.purchaseCost;
      formValues.taxAmount = itemCostDetails.taxAmount;
      formValues.cgst = itemCostDetails.cgst;
      formValues.sgst = itemCostDetails.sgst;
      formValues.igst = itemCostDetails.igst;
      formValues.totalPurchaseMc = itemCostDetails.totalPurchaseMc;
      console.log("itemCostDetails", itemCostDetails);
      let updatedValues = {
        purchaseCost: itemCostDetails.purchaseCost,
        taxAmount: itemCostDetails.taxAmount,
        cgst: itemCostDetails.cgst,
        sgst: itemCostDetails.sgst,
        igst: itemCostDetails.igst,
        otherChargesAmount: otherChargesAmount,
        totalPurchaseMc: itemCostDetails.totalPurchaseMc,
        stoneAmount: stoneCost,
      };
      setFormValues((prevValues) => ({
        ...prevValues,
        ...updatedValues,
      }));
    }
  }, [
    formValues.piece,
    formValues.netWeight,
    formValues.pureWeight,
    formValues.purchaseMcType,
    formValues.purchaseMc,
    formValues.flatMcValue,
    formValues.otherMetalWeight,
    formValues.stoneAmount,
    formValues.otherChargesAmount,
    formValues.purchaseRate,
    formValues.rateCalcType,
  ]);

  const resetForm = () => {
    initialState.selectedCategory = formValues.selectedCategory;
    initialState.selectedPurity = formValues.selectedPurity;
    initialState.selectedProduct = formValues.selectedProduct;
    initialState.taxPercentage = formValues.taxPercentage;
    setFormValues(initialState);
    if (lessWeightRef.current) {
      lessWeightRef.current.resetForm();
    }
  };
  useEffect(() => {
    if (parseInt(settings?.pur_entry_des_and_sub_des_req) == 1) {
      setMaxMcVaBasedOnSettings();
    }
  }, [
    formValues.grossWeight,
    formValues.selectedDesign,
    formValues.selectedSubDesign,
  ]);

  // Validate Mc Va Based on Settings

  const setMaxMcVaBasedOnSettings = () => {
    if (mcVaSetiings) {
      let idKarigar = idSupplier;

      if (mcVaSetiings?.retail) {
        let mc_va_setting = "";
        let settMinMc = "";
        let settMinVa = "";
        let settMaxMc = "";
        let settMaxVa = "";
        let settVaType = "";
        let settMcType = "";
        let settFlatMc = "";
        let settTouch = "";
        let setPureCalcType = "";
        mc_va_setting = mcVaSetiings?.retail.find(
          (sett) =>
            sett.supplier.includes(parseInt(idKarigar)) &&
            sett.purity === formValues.selectedPurity &&
            sett.id_product === formValues.selectedProduct &&
            (settings?.pur_entry_des_and_sub_des_req === 1
              ? sett.id_design === formValues.selectedDesign
              : true) &&
            (settings?.pur_entry_des_and_sub_des_req == 1
              ? sett.id_sub_design === formValues.selectedSubDesign
              : true) &&
            (sett.id_weight_range != null
              ? parseFloat(sett.from_weight) <=
                  parseFloat(formValues.grossWeight) &&
                parseFloat(sett.to_weight) >= parseFloat(formValues.grossWeight)
              : true)
        );
        if (mc_va_setting) {
          settMinMc = mc_va_setting.purchase_mc;
          settMinVa = mc_va_setting.purchase_va;
          // settMaxMc = mc_va_setting.max_mc_value
          // settMaxVa = mc_va_setting.max_va_value
          settVaType = mc_va_setting.purchase_va_type;
          settMcType = parseInt(mc_va_setting.purchase_mc_type);
          settFlatMc = mc_va_setting.purchase_flat_mc;
          settTouch = mc_va_setting.purchase_touch;
          formValues.pureCalcType = mc_va_setting.pure_wt_type;
        }

        if (mc_va_setting) {
          handleInputChange("settingsMinVa", settMinVa);
          handleInputChange("settingsMinMc", settMinMc);
          handleInputChange("settingsMaxVa", settMaxVa);
          handleInputChange("settingsMaxMc", settMaxMc);
          handleInputChange("settingsMcType", settMcType);
          handleInputChange("settVaType", settVaType);
          handleInputChange("settFlatMc", settFlatMc);
          handleInputChange("settTouch", settTouch);
          handleInputChange("setPureCalcType", setPureCalcType);

          if (parseFloat(settFlatMc) > parseFloat(formValues.flatMcValue)) {
            toastfunc("Flat Mc Should be Greater than " + settFlatMc);
            handleInputChange("flatMcValue", settFlatMc);
          }

          if (
            parseFloat(settMinMc) >
            isUndefined(parseFloat(formValues.purchaseMc))
          ) {
            toastfunc("Mc Should be Greater than " + settMinMc);
            handleInputChange("purchaseMc", settMinMc);
          }

          if (
            parseFloat(settMinVa) >
            isUndefined(parseFloat(formValues.purchaseWastage))
          ) {
            toastfunc("Wastage Should be Greater than " + settMinVa);
            handleInputChange("purchaseWastage", settMinVa);
          }

          if (
            parseFloat(settTouch) >
            isUndefined(parseFloat(formValues.purchaseTouch))
          ) {
            toastfunc("Touch Should be Greater than " + settTouch);
            handleInputChange("purchaseTouch", settTouch);
          }
        } else {
          handleInputChange("settingsMinVa", 0);
          handleInputChange("settingsMinMc", 0);
          handleInputChange("settingsMaxVa", 100);
          handleInputChange("settingsMaxMc", "");
          handleInputChange("settingsMcType", "");
          handleInputChange("settVaType", "");
          handleInputChange("settFlatMc", "");
          handleInputChange("settTouch", "");
          handleInputChange("setPureCalcType", "");
        }
      }
    } else {
      handleInputChange("settingsMinVa", 0);
      handleInputChange("settingsMinMc", 0);
      handleInputChange("settingsMaxVa", 100);
      handleInputChange("settingsMaxMc", "");
      handleInputChange("settingsMcType", "");
      handleInputChange("settVaType", "");
      handleInputChange("settFlatMc", "");
      handleInputChange("settTouch", "");
      handleInputChange("setPureCalcType", "");
    }
  };
  const addToPreview = (data) => {
    if (idBranch === "" || idBranch === null) {
      toastfunc("Please Select the Branch..");
    } else if (idSupplier === "" || idSupplier === null) {
      toastfunc("Please Select the Supplier..");
    } else {
      console.log(data);
      let itemExists = false;
      // if (formData.length > 0) {
      //   formData.forEach((item) => {
      //     console.log(data);
      //     if (
      //       item.selectedProduct === data.selectedProduct &&
      //       (item.selectedDesign!=null ? item.selectedDesign === data.selectedDesign : true) &&
      //       (item.selectedSubDesign!=null ? item.selectedSubDesign === data.selectedSubDesign : true)
      //     ) {
      //       if (data.id_purchase_entry_detail !== "") {
      //         itemExists = true;
      //         return;
      //       }
      //     }
      //   });
      // }
      if (itemExists) {
        toastfunc("Item Already Exists..");
      } else {
        const item = {
          ...data,
          isHalMarked: formValues.isHalMarked,
          id_purchase_entry_detail: formValues?.id_purchase_entry_detail,
          stoneDetails: formValues.stoneDetails,
          otherMetalDetails: formValues.otherMetalDetails,
          lessWeight: formValues.lessWeight,
          netWeight: formValues.netWeight,
          stnWeight: formValues.stnWeight,
          diaWeight: formValues.diaWeight,
          otherMetalWeight: formValues.otherMetalWeight,
          purchaseCost: formValues.purchaseCost,
          tax_id: formValues.tax_id,
          taxType: formValues.taxType,
          taxPercentage: formValues.taxPercentage,
          taxAmount: formValues.taxAmount,
          cgst: formValues.cgst,
          sgst: formValues.sgst,
          igst: formValues.igst,
          otherChargesDetails: formValues.otherChargesDetails,
          totalPurchaseMc: formValues.totalPurchaseMc,
        };
        const product = products.find(
          (val) => val.pro_id === parseInt(item.selectedProduct)
        );
        const design = designs.find(
          (val) => val.id_design === parseInt(item.selectedDesign)
        );
        const subDesign = subDesigns.find(
          (val) => val.id_sub_design === parseInt(item.selectedSubDesign)
        );
        console.log(products);
        const newItem = {
          productName: product?.product_name,
          designName: design?.design_name,
          subDesignName: subDesign?.sub_design_name,
          stockType: product.stock_type === "0" ? "Tagged" : "Non Tag",
          ...item,
        };

        if (editIndex !== null) {
          const updatedFormData = [...formData];
          updatedFormData[editIndex] = newItem;
          setFormData(updatedFormData);
          setEditIndex(null);
          console.log(data);
        } else {
          console.log(formData);
          setFormData((prevData) => [...prevData, newItem]);
        }
        resetForm();
      }
    }
  };

  const handleEdit = (index) => {
    const item = formData[index];
    console.log(formData);
    setFormValues({
      grossWeight: item.grossWeight,
      lessWeight: item.lessWeight,
      netWeight: item.netWeight,
      piece: item.piece,
      stnWeight: item.stnWeight,
      diaWeight: item.diaWeight,
      otherMetalWeight: item.otherMetalWeight,
      selectedCategory: item.selectedCategory,
      selectedPurity: item.selectedPurity,
      selectedProduct: item.selectedProduct,
      selectedDesign: item.selectedDesign,
      selectedSubDesign: item.selectedSubDesign,
      selectedSection: item.selectedSection,
      sellRate: item.sellRate,
      purchaseMc: item.purchaseMc,
      totalPurchaseMc: item.totalPurchaseMc,
      flatMcValue: item.flatMcValue,
      purchaseMcType: parseInt(item.purchaseMcType),
      purchaseRate: item.purchaseRate,
      rateCalcType: parseInt(item.rateCalcType),
      purchaseTouch: item.purchaseTouch,
      purchaseWastage: item.purchaseWastage,
      pureWeight: item.pureWeight,
      pureCalcType: item.pureCalcType,
      purchaseCost: item.purchaseCost,
      tax_id: item.tax_id,
      taxType: item.taxType,
      taxPercentage: item.taxPercentage,
      taxAmount: item.taxAmount,
      cgst: item.cgst,
      sgst: item.sgst,
      igst: item.igst,
      isHalMarked: item.isHalMarked,
      selectedSize: item.selectedSize,
      otherChargesDetails: item.otherChargesDetails,
      id_purchase_entry_detail: item?.id_purchase_entry_detail,
    });
    handleSetStoneDetails(item.stoneDetails);
    handleSetOtherMetalDetails(item.otherMetalDetails);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    SetModalActionName("delete");
    SetDeleteModal(true);
    SetDelId(index);
  };

  const deleteItem = (index) => {
    let itemDetails = formData[delId];
    // if(itemDetails?.id_purchase_entry_detail!=='' && itemDetails?.id_purchase_entry_detail!==undefined){
    //     dispatch(deletePurchaseItemByID(itemDetails?.id_purchase_entry_detail))
    // }
    const updatedFormData = [...formData];
    updatedFormData.splice(delId, 1);
    setFormData(updatedFormData);
    toggle();
  };

  const resetPurity = () =>
    setFormValues((prevValues) => ({ ...prevValues, selectedPurity: null }));
  const resetProduct = () =>
    setFormValues((prevValues) => ({ ...prevValues, selectedProduct: null }));
  const resetDesign = () =>
    setFormValues((prevValues) => ({ ...prevValues, selectedDesign: null }));
  const resetSubDesign = () =>
    setFormValues((prevValues) => ({ ...prevValues, selectedSubDesign: null }));
  const resetSection = () =>
    setFormValues((prevValues) => ({ ...prevValues, selectedSection: null }));

  const numericFields = [
    "piece",
    "grossWeight",
    "lessWeight",
    "netWeight",
    "stnWeight",
    "diaWeight",
    "pureWeight",
    "purchaseCost",
  ];
  const calcTypeOptions = [
    { label: "Per Gram", value: 1, isDefault: true },
    { label: "Per Piece", value: 2 },
  ];
  const PureCalcTypeOptions = [
    { label: "Touch+VA", value: 2, isDefault: true },
    { label: "Touch", value: 1 },
    { label: "Wt * VA %", value: 3 },
  ];

  const onClickSave = (isRateFIxed , lotGenerate = 0) => {
    if (formData.length === 0 && otherChargesDetails.length === 0) {
      toastfunc("Please Add the Item Details or Charges");
    } else {
      setIsSubmitted(true);
      console.log(formData);
      const itemDetails = formData.map((item) => ({
        is_halmarked: item.isHalMarked,
        id_purity: item.selectedPurity,
        id_product: item.selectedProduct,
        id_design: item.selectedDesign,
        id_sub_design: item.selectedSubDesign,
        id_section: item.selectedSection,
        id_size: item.selectedSize,
        uom_id: item.uomId,
        pieces: isUndefined(item.piece),
        gross_wt: isUndefined(item.grossWeight),
        less_wt: isUndefined(item.lessWeight),
        net_wt: isUndefined(item.netWeight),
        dia_wt: isUndefined(item.diaWeight),
        stone_wt: isUndefined(item.stnWeight),
        other_metal_wt: isUndefined(item.otherMetalWeight),
        sell_rate: isUndefined(item.sellRate),
        purchase_touch: isUndefined(item.purchaseTouch),
        pure_wt: isUndefined(item.pureWeight),
        purchase_va: isUndefined(item.purchaseWastage),
        purchase_mc: isUndefined(item.purchaseMc),
        total_mc_value: isUndefined(item.totalPurchaseMc),

        purchase_flat_mc: isUndefined(item.flatMcValue),
        purchase_mc_type: item.purchaseMcType,
        pure_wt_cal_type: item.pureCalcType,
        purchase_rate_type: item.rateCalcType,
        purchase_rate: isUndefined(item.purchaseRate),
        tax_id: item.tax_id,
        tax_type: item.taxType,
        tax_amount: isUndefined(item.taxAmount),
        cgst_cost: isUndefined(item.cgst),
        sgst_cost: isUndefined(item.sgst),
        igst_cost: isUndefined(item.igst),
        purchase_cost: isUndefined(item.purchaseCost),
        stone_details: setStoneDetails(item.stoneDetails),
        other_metal_details: setOtherMetalDetails(item.otherMetalDetails),
        charges_details: item.otherChargesDetails,
        id_purchase_entry_detail: item?.id_purchase_entry_detail,
      }));
      let postData = {
        id_supplier: idSupplier,
        id_branch: idBranch,
        is_rate_fixed: isRateFIxed,
        remarks : (remarks!='' ? remarks : null),
        lot_generate : lotGenerate,
        is_approved: isRateFIxed === 1 ? 1 : 0,
        supplier_bill_ref_no: supplierBillRefNo,
        supplier_bill_ref_date:
          moment(supplierBillRefDate).format("YYYY-MM-DD"),
        payment_date: moment(paymentDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
        item_details: itemDetails,
        setting_bill_type: billSettingType,
        entry_date: moment(entryDate).format("YYYY-MM-DD"),
        tds_percentage: tdsPercentage,
        tds_amount: tdsAmount,
        net_amount: totalBillAmount,
        charges_details: otherChargesDetails,
      };
      submitPurchaseEntry(postData, isRateFIxed, idSupplier);
    }
  };
  const setOtherMetalDetails = (data) => {
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
        rate_per_gram: item.ratePerGram,
        purchase_other_metal: item.id_purchase_other_metal,
      }));
    }
    return other_metal_details;
  };
  const setStoneDetails = (data) => {
    let stone_details = [];
    if (data.length > 0) {
      console.log(data);
      stone_details = data.map((item) => ({
        id_stone: item.id_stone,
        uom_id: item.uom_id,
        stone_pcs: item.piece,
        stone_wt: item.weight,
        stone_type: item.stone_type,
        pur_stn_cal_type: item.stn_calc_type,
        pur_st_rate: item.stone_rate,
        pur_stn_cost: item.stone_amount,
        show_in_lwt: item.show_in_lwt,
        id_quality_code: item.id_quality_code,
        id_purchase_stn_detail: item?.id_purchase_stn_detail,
      }));
    }
    return stone_details;
  };

  const submitPurchaseEntry = async (postData, isRateFIxed, idSupplier) => {
    try {
      if (id !== "" && id !== undefined && id !== null) {
        const update_data = { id: id, putData: postData };
        await dispatch(updatePurchaseEntry(update_data)).unwrap();
        
      } else {
        const response = await dispatch(createPurchaseEntry(postData)).unwrap();
        
        toastsuccess(response.message);
        let data = {
          settings: settings,
          itemDetails: response.print_data,
          userInfo : userInfo,
        };
        console.log(data);
        secureLocalStorage.setItem("pageState", JSON.stringify(data));
        window.open(`${process.env.PUBLIC_URL}/purchase/purchase_entry/print`, "_blank");
        // if (isRateFIxed === 1) {
        //   navigate(`${process.env.PUBLIC_URL}/purchase/supplier_payment/list`, { state: { id_purchase_entry: response.id_purchase_entry, supplierId: idSupplier } });
        // } else {
        //   navigate(`${process.env.PUBLIC_URL}/purchase/purchase_entry/list`);
        // }
        // downloadPDF(response.pdf_path, response.id_purchase_entry);
      }
      navigate(`${process.env.PUBLIC_URL}/purchase/purchase_entry/list`);
    } catch (error) {
      setIsSubmitted(false);
      console.error(error);
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

  useEffect(() => {
    let itemCost = formData.reduce(
      (acc, item) => acc + parseFloat(parseFloat(item.purchaseCost) || 0),
      0
    );
    let cgst_amt = formData.reduce(
      (acc, item) => acc + parseFloat(parseFloat(item.cgst) || 0),
      0
    );
    let sgst_amt = formData.reduce(
      (acc, item) => acc + parseFloat(parseFloat(item.sgst) || 0),
      0
    );
    let igst_amt = formData.reduce(
      (acc, item) => acc + parseFloat(parseFloat(item.igst) || 0),
      0
    );
    let taxableAmt = formData.reduce(
      (acc, item) =>
        acc +
        parseFloat(
          parseFloat(item.purchaseCost) - parseFloat(item?.taxAmount) || 0
        ),
      0
    );
    itemCost = parseFloat(otherChargesAmount) + parseFloat(itemCost);
    let totalBillAmount = parseFloat(
      parseFloat(itemCost) - parseFloat(itemCost * (tdsPercentage / 100))
    ).toFixed(2);
    let tdsAmt = parseFloat(itemCost * (tdsPercentage / 100)).toFixed(2);

    setTotalBillAmount(parseFloat(totalBillAmount).toFixed(2));
    setTaxableAmount(parseFloat(taxableAmt).toFixed(2));
    setTotalItemCost(parseFloat(itemCost).toFixed(2));
    setCgstCost(parseFloat(cgst_amt).toFixed(2));
    setSgstCost(parseFloat(sgst_amt).toFixed(2));
    setIgstCost(parseFloat(igst_amt).toFixed(2));
    setTdsAmount(parseFloat(tdsAmt).toFixed(2));
  }, [formData,otherChargesAmount, tdsPercentage]);

  return {
    selectedBranchId,
    selectedSupplierID,
    formValues,
    formData,
    editIndex,
    lessWeightRef,
    otherMetalWeightRef,
    handleInputChange,
    handleSetStoneDetails,
    handleSetOtherMetalDetails,
    resetForm,
    addToPreview,
    handleEdit,
    handleDelete,
    resetPurity,
    resetProduct,
    resetDesign,
    resetSubDesign,
    resetSection,
    columns,
    numericFields,
    calcTypeOptions,
    PureCalcTypeOptions,
    isSubmitted,
    onClickSave,
    deleteModal,
    toggle,
    deleteItem,
    isSectionRequired,
    isMrpItem,
    fixedRateCalc,
    setSupplierBillRefNo,
    setSupplierBillRefDate,
    supplierBillRefNo,
    supplierBillRefDate,
    daysOfPayment,
    setDaysOfPayment,
    paymentDate,
    setPaymentDate,
    isPurchaseDetailsDisable,
    isTaxRequired,
    setEntryDate,
    entryDate,
    totalItemCost,
    totalBillAmount,
    tdsPercentage,
    setTdsPercentage,
    billSettingType,
    taxableAmount,
    cgstCost,
    sgstCost,
    igstCost,
    otherChargesDetails,
    setOtherChargesDetails,
    otherChargesAmount,
    setOtherChargesAmount,
  };
};

export default usePurchaseEntryFormHandling;
