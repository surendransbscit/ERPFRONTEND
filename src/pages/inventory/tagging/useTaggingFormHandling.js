import { useState, useEffect, useCallback, useRef } from "react";
import { isUndefined } from "../../../components/common/calculations/ErpCalculations";
import { toastfunc, toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteTag, createTag, getLotAvailableDetails, updateTag } from "../../../redux/thunks/inventory";
import { compileSchema } from "ajv/dist/compile";
import secureLocalStorage from "react-secure-storage";
import TagPrnPrint from "./tagPrnPrint";
import DownloadTagPrint from "./tagPrnDownload";

const useTaggingFormHandling = (taggedItem) => {
  const previewDetails = [
    { header: "Tag Code", accessor: "tag_code", textAlign: "center" },
    { header: "Product", accessor: "product_name", textAlign: "center" },
    { header: "Design", accessor: "design_name", textAlign: "center" },
    // { header: "S.Design", accessor: "sub_design_name", textAlign: "center" },
    { header: "Huid", accessor: "tag_huid", textAlign: "center",type: "huid" },
    { header: "Huid2", accessor: "tag_huid2", textAlign: "center",type: "huid2" },
    { header: "Piece", accessor: "tag_pcs", decimal_places: 0, textAlign: "right", isTotalReq: true,type: "tag_pcs" },
    { header: "Gwt", accessor: "tag_gwt", decimal_places: 3, textAlign: "right", isTotalReq: true,type: "gross_wt" },
    { header: "Lwt", accessor: "tag_lwt", decimal_places: 3, textAlign: "right", isTotalReq: true,type: "less_wt" },
    { header: "Nwt", accessor: "tag_nwt", decimal_places: 3, textAlign: "right", isTotalReq: true, },
    { header: "VA%", accessor: "tag_wastage_percentage", decimal_places: 3, textAlign: "right", isTotalReq: false,type: "tag_wastage_percentage" },
    { header: "VA", accessor: "tag_wastage_wt", decimal_places: 3, textAlign: "right", isTotalReq: true, },
    { header: "MC", accessor: "tag_mc_value", decimal_places: 2, textAlign: "right",type: "tag_mc_value" },
    { header: "Flat MC", accessor: "flat_mc_value", decimal_places: 2, textAlign: "right",type: "flat_mc_value" },
    { header: "Mrp Price", accessor: "tag_sell_rate", textAlign: "center",type: "tag_sell_rate" },
    { header: "Item Cost", accessor: "tag_item_cost", decimal_places: 2, textAlign: "right", },
  ];
  const [tagImages, SetTagImages] = useState([]);
  const [idBranch, setIdBranch] = useState("");
  const [tagBranch, setTagBranch] = useState("");
  const [lotId, setLotId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tagDetails, setTagDetails] = useState([]);
  const [balancePcs, setBalancePcs] = useState(0);
  const [balanceWeight, setBalanceWeight] = useState(0);
  const [tagEditData, setTagEditData] = useState({});
  const [tagListCol, setTagListCol] = useState(previewDetails);
  const [tagId, setTagId] = useState("");
  const { isLoading: issubmitting, isError } = useSelector((state) => state.lotReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [item, setItem] = useState();
  const {
    userInfo: { settings,user },
    userInfo
  } = useSelector((state) => state.authUserReducer);



  useEffect(() => {
    if(settings?.is_sub_design_req != 1){
      const updatedColumns = previewDetails.filter(column => column.accessor !== 'sub_design_name');
      setTagListCol(updatedColumns);
    }
  }, [settings]);
  //Get Lot Available Details
  const fetchLotBalanceDetails = useCallback(
    async (id) => {
      try {
        const response = await dispatch(getLotAvailableDetails(id)).unwrap();
        return response;
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch]
  );

  const onClickSave = (formData, tagId) => {
    if (idBranch === "" || idBranch === null) {
      toastfunc("Please Select Branch");
      return false;
    } else if (formData.length === 0) {
      toastfunc("Please Add the Item Details");
      return false;
    }else if (tagId != "") {
      setIsSubmitted(true);
      const postData = getTagDetails(formData);
      let responce = saveTag(postData, tagId);
      SetTagImages([]);
      return responce;

    } else {
      setIsSubmitted(true);
      const postData = getTagDetails(formData);
      console.log(postData);
      let responce = saveTag([postData], tagId);
      SetTagImages([]);
      return responce;
    }
  };

  const onClickBulkSave = (formData, tagId,callback) => {
    if (idBranch === "" || idBranch === null) {
      toastfunc("Please Select Branch");
    } else if (formData.length === 0) {
      toastfunc("Please Add the Item Details");
    } else {
      setIsSubmitted(true);
      console.log(formData);

      const postData = getTagBulkDetails(formData);
      console.log(postData);
      
      saveTag(postData, tagId,2);
     
      SetTagImages([]);
    }
  };

  const getTagBulkDetails = (formData) => {
    const postData =  formData.map((item) => ({
        ...item,
        stone_details: setStoneDetails(item.stone_details),
    }))
    return postData;
  }
  const getTagDetails = (formData) => {
    console.log('formData',formData);
    const postData = {
      id_branch: idBranch,
      tag_branch: tagBranch,
      tag_images: tagImages,
      tag_lot_inward_details: formData.idLotInwardDetail,
      selectedCategory: formData.selectedCategory,
      tag_purity_id: formData.selectedPurity,
      tag_product_id: formData.selectedProduct,
      tag_design_id: formData.selectedDesign,
      tag_sub_design_id: formData.selectedSubDesign,
      tag_section_id: formData.selectedSection,
      size: formData.selectedSize,
      tag_uom_id: formData.uomId,
      totalTags: formData.totalTags !== "" && formData.totalTags !== 0 ? formData.totalTags : 1,
      tag_huid: formData.huId1 ? formData.huId1 : null,
      tag_huid2: formData.huId2 ? formData.huId2 : null,
      tag_pcs: isUndefined(formData.piece),
      tag_gwt: isUndefined(formData.grossWeight),
      tag_lwt: isUndefined(formData.lessWeight),
      tag_nwt: isUndefined(formData.netWeight),
      tag_dia_wt: isUndefined(formData.diaWeight),
      tag_stn_wt: isUndefined(formData.stnWeight),
      tag_other_metal_wt: isUndefined(formData.otherMetalWeight),
      tag_sell_rate: isUndefined(formData.sellRate),
      tag_mc_type: isUndefined(formData.mcType),
      tag_mc_value: isUndefined(formData.mcValue),
      tag_wastage_percentage: isUndefined(formData.wastagePercentage),
      tag_wastage_wt: isUndefined(formData.wastageWeight),
      tag_calculation_type: formData.productCalculationType,
      tag_purchase_calc_ype: formData.pureWeightCalType,
      tag_purchase_mc_type: formData.purchaseMcType,
      tag_purchase_rate: formData.purchaseRate,
      tag_purchase_rate_calc_type: formData.purchaseRateType,
      tag_purchase_touch: formData.purchaseTouch,
      tag_purchase_va: formData.purchaseWastage,
      tag_purchase_mc: isUndefined(formData.purchaseMc),
      tag_pure_wt: formData.pureWeight,
      tag_purchase_cost: formData.purchaseCost.purchaseCost,
      stone_details: setStoneDetails(formData.stoneDetails),
      other_metal_detail: setOtherMetalDetails(formData.otherMetalDetails),
      charges_details: formData.otherChargesDetails,
      attribute_details: formData.attributeDetails,
      tax_id: formData.tax_id,
      tag_tax_amount: isUndefined(formData.taxAmount),
      tax_type: formData.taxType,
      tag_item_cost: isUndefined(formData.itemCost),
      rate_type :formData.rate_type,
      ratePerGram : formData.ratePerGram,
      isMrpItem : formData.isMrpItem,
      fixedRateCalc : formData.fixedRateCalc,
      flat_mc_value : isUndefined(formData.flatMcValue),
      total_mc_value : isUndefined(formData.totalMcValue),
      tag_mrp_margin_amount : isUndefined(formData.mrpMarginAmount),
    };
    return postData;
  }

  const setStoneDetails = (data) => {
    let stone_details = [];
    if (data.length > 0) {
      stone_details = data.map((item) => ({
        ...item,
        show_in_lwt: item.show_in_lwt,
        stone_name: item.stone_name,
        id_stone: item.id_stone,
        uom_id: item.uom_id,
        stone_pcs: item.piece,
        stone_wt: item.weight,
        stone_type: item.stone_type,
        stone_calc_type: item.stn_calc_type,
        stone_rate: item.stone_rate,
        stone_amount: item.stone_amount,
      }));
    }
    return stone_details;
  };

  const setOtherMetalDetails = (data) => {
    let other_metal_details = [];
    if (data.length > 0) {
      other_metal_details = data.map((item) => ({
        ...item,
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
        "rate_calc_type": item.calc_type,
      }));
    }
    return other_metal_details;
  };

  const handleEdit = (index) => {
    const item = tagDetails[index];
    let editData = {
      idLotInwardDetail: item.tag_lot_inward_details,
      selectedCategory: item.selectedCategory,
      selectedPurity: item.tag_purity_id,
      selectedProduct: item.tag_product_id,
      selectedDesign: item.tag_design_id,
      selectedSubDesign: item.tag_sub_design_id,
      selectedSection: item.tag_section_id,
      selectedSize: item.size,
      huId1: item.tag_huid,
      huId2: item.tag_huid2,
      piece: item.tag_pcs,
      uomId: item.tag_uom_id,
      grossWeight: item.tag_gwt,
      lessWeight: item.tag_lwt,
      stnWeight: item.tag_stn_wt,
      diaWeight: item.tag_dia_wt,
      netWeight: item.tag_nwt,
      sellRate: item.tag_sell_rate,
      otherMetalWeight: 0.0,
      wastagePercentage: item.tag_wastage_percentage,
      wastageWeight: item.tag_wastage_wt,
      purchaseTouch: item.tag_purchase_touch,
      purchaseWastage: item.tag_purchase_va,
      pureWeightCalType: item.tag_purchase_calc_ype,
      pureWeight: item.tag_pure_wt,
      purchaseMcType: item.tag_purchase_mc_type,
      purchaseRate: item.tag_purchase_rate,
      purchaseRateType: item.tag_purchase_rate_calc_type,
      mcValue: item.tag_mc_value,
      flatMcValue: item.flat_mc_value,
      mcType: item.tag_mc_type,
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
      stoneDetails: item.stone_details.length > 0 ? setEditStoneDetails(item.stone_details) : [],
      otherMetalDetails: item.other_metal_detail.length > 0 ? setEditOtherMetalDetails(item.other_metal_detail) : [],
      otherChargesDetails: item.charges_details.length > 0 ? setEditChargeDetails(item.charges_details) : [],
      attributeDetails: item.attribute_details,
    };
    setTagEditData(editData);
    setTagId(item.tag_id);
  };

  const setEditStoneDetails = (data) => {
    let stone_details = [];
    if (data.length > 0) {
      stone_details = data.map((item) => ({
        id_tag_stn_detail: item.id_tag_stn_detail,
        stone_name: item.stone_name,
        id_stone: item.id_stone,
        uom_id: item.uom_id,
        piece: item.stone_pcs,
        weight: item.stone_wt,
        stone_type: item.stone_type,
        stone_calc_type: item.stn_calc_type,
        stone_rate: item.stone_rate,
        amount: item.stone_amount,
        id_quality_code: item.id_quality_code,
        show_in_lwt: item.show_in_lwt,
      }));
    }
    return stone_details;
  };

  const setEditOtherMetalDetails = (data) => {
    let other_metal_details = [];
    if (data.length > 0) {
      other_metal_details = data.map((item) => ({
        cat_name: item.cat_name,
        piece: item.piece,
        weight: item.weight,
        wastagePercentage: item.wastage_percentage,
        wastageWeight: item.wastage_weight,
        mcType: item.mc_type,
        mcValue: item.mc_value,
        rate_per_gram: item.rate_per_gram,
        amount: item.other_metal_cost,
        selectedCategory: item.id_category,
        selectedPurity: item.id_purity,
      }));
    }
    return other_metal_details;
  };

  const setEditChargeDetails = (data) => {
    let charge_details = [];
    if (data.length > 0) {
      charge_details = data.map((item) => ({
        name: item.charge_name,
        selectedCharge: item.id_charges,
        amount: item.charges_amount,
      }));
    }
    return charge_details;
  };

  const saveTag = async (postData, tagId,type=1) => {
    try {
      //setTagDetails([]);
      console.log(tagId);
      let response = "";
      if (tagId === "") {
        response = await dispatch(createTag(postData)).unwrap();
      } else {
        postData.tag_id = tagId;
        response = await dispatch(updateTag(postData)).unwrap();
      }
      if(type==2){
        setTagDetails([])
      }
      let data= {
            settings: settings,
            user: user,
            itemDetails: response.data,
          };

      secureLocalStorage.setItem("pageState", JSON.stringify(data));
      if (response?.data){
        response.data.forEach((val) => {
          setTagDetails((prevData) => [{...val,"isNotSaved":false}, ...prevData]);
        });
      }

      console.log(tagDetails);
      setBalancePcs(response.lot_balance.balance_pcs);
      setBalanceWeight(response.lot_balance.balance_gwt);
      setItem(response.lot_balance);
      setIsSubmitted(false);
      if (tagId != "") {
        setTagDetails((prevData) => 
            prevData.map((item, index) => 
              item.tag_id === tagId 
                    ? {"isNotSaved": false, ...response.updated_data} 
                    : item
            )
        );
      }
     // handlePrint(response.data,settings,user);
      DownloadTagPrint(response.data,userInfo);
      //window.open(response.tag_url, "_blank");
      //window.open(`${process.env.PUBLIC_URL}/tag/print`, "_blank");
      return true;
    } catch (error) {
      setIsSubmitted(false);
      console.error(error);
      return false;
    }
  };

  const deleteTagById = async (postData, index) => {
    try {
      if(postData?.isNotSaved===false){
        let response = await dispatch(deleteTag(postData)).unwrap();
        setBalancePcs(response.lot_balance.balance_pcs);
        setBalanceWeight(response.lot_balance.balance_gwt);
      }
      const updatedTagDetails = [...tagDetails];
      updatedTagDetails.splice(index, 1);
      setTagDetails(updatedTagDetails);
      console.log(tagDetails);
    } catch (error) {
      setIsSubmitted(false);
      console.error(error);
    }
  };

  console.log(tagDetails);
  return {
    idBranch,
    setIdBranch,
    tagBranch,
    setTagBranch,
    lotId,
    setLotId,
    isSubmitted,
    onClickSave,
    tagDetails,
    tagListCol,
    fetchLotBalanceDetails,
    balancePcs,
    balanceWeight,
    tagImages,
    SetTagImages,
    deleteTagById,
    tagEditData,
    tagId,
    setTagId,
    handleEdit,
    getTagDetails,
    onClickBulkSave,
    setBalanceWeight,
    setBalancePcs,
    setTagDetails,
    item,
    setItem,
    settings,
  };
};

export default useTaggingFormHandling;
