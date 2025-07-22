import { useState, useEffect, useRef } from 'react';
import { calculateNetWeight, calculatePurchaseCost, calculatePureWeight, isUndefined } from '../../../components/common/calculations/ErpCalculations';
import { toastfunc, toastsuccess } from '../../../components/sds-toast-style/toast-style';
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createLot, geLotDetailById, updateLot } from '../../../redux/thunks/inventory';
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
const useLotFormHandling = (products, designs, subDesigns, id, idBranch, idSupplier , lotType) => {

  const initialState = {
    selectedCategory: '',
    selectedPurity: '',
    selectedProduct: '',
    selectedDesign: '',
    selectedSubDesign: '',
    selectedSection: '',
    selectedSize: '',
    piece: '',
    uomId: 1,
    grossWeight: 0.000,
    lessWeight: 0.000,
    stnWeight: 0.000,
    diaWeight: 0.000,
    netWeight: 0.000,
    sellRate: 0.000,
    purchaseTouch: 0,
    purchaseWastage: 0,
    purchaseMc: 0,
    purchaseMcType: 1,
    purchaseRate: 0,
    rateCalcType: '',
    pureWeight: 0.000,
    pureCalcType: 2,
    purchaseRateType: 1,
    purchaseCost: 0.00,
    editIndex: '',
    stoneDetails: [],
    id_lot_inward_detail: ''
  };

  const initialColumns = [
    { header: 'Stock Type', accessor: 'stockType', },
    { header: 'Product', accessor: 'productName', },
    { header: 'Design', accessor: 'designName', },
    { header: 'S.Design', accessor: 'subDesignName', },
    { header: 'Piece', accessor: 'piece', decimal_places: 0, 'isTotalReq': true, 'textAlign': 'right' },
    { header: 'Gwt', accessor: 'grossWeight', decimal_places: 3, 'isTotalReq': true, 'textAlign': 'right' },
    { header: 'Lwt', accessor: 'lessWeight', decimal_places: 3, 'isTotalReq': true, 'textAlign': 'right' },
    { header: 'Nwt', accessor: 'netWeight', decimal_places: 3, 'isTotalReq': true, 'textAlign': 'right' },
    { header: 'Stn Wt', accessor: 'stnWeight', decimal_places: 3, 'isTotalReq': true, 'textAlign': 'right' },
    { header: 'Dia Wt', accessor: 'diaWeight', decimal_places: 3, 'isTotalReq': true, 'textAlign': 'right' },
    { header: 'Pure Wt', accessor: 'pureWeight', decimal_places: 3, 'isTotalReq': true, 'textAlign': 'right' },
    { header: 'Pur Cost', accessor: 'purchaseCost', decimal_places: 2, 'isTotalReq': true, 'textAlign': 'right', "isCurrency": true },
  ];
  const [columns, SetColumns] = useState(initialColumns);
  const [selectedBranchId, selectedBranch] = useState("");
  const [selectedSupplierID, selectedSupplier] = useState("");
  const [formValues, setFormValues] = useState(initialState);
  const [formData, setFormData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSectionRequired, setIsSectionRequired] = useState(false);
  const [isSizeRequired, setIsSizeReq] = useState(false);
  const [isMrpItem, setIsMrpItem] = useState(false);
  const [fixedRateCalc, setFixedRateItem] = useState(false);
  const [delId, SetDelId] = useState();
  const [deleteModal, SetDeleteModal] = useState(false);
  const [modalActionName, SetModalActionName] = useState("");
  const { userInfo: { settings } } = useSelector((state) => state.authUserReducer);
  const toggle = () => SetDeleteModal(!deleteModal);
  const lessWeightRef = useRef();
  const { isLoading: issubmitting, isError } = useSelector((state) => state.lotReducer);
  const { isLoading, lotItemDetails } = useSelector((state) => state.lotReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productRef = useRef(null);


  useEffect(() => {
    if (settings?.is_sub_design_req != 1) {
      const updatedColumns = initialColumns.filter(column => column.accessor !== 'subDesignName');
      SetColumns(updatedColumns);
    }
  }, [settings]);

  useEffect(() => {
    const fetchLotDetails = async () => {
      if (id !== undefined) {
        try {
          await dispatch(geLotDetailById(id)).unwrap();
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchLotDetails();
  }, [dispatch, id]);

  useEffect(() => {
    if (lotItemDetails !== undefined && lotItemDetails !== null && id !== undefined) {
      const item_details = lotItemDetails.item_details;
      console.log(item_details);
      if (item_details.length > 0) {
        selectedBranch(lotItemDetails.id_branch);
        selectedSupplier(lotItemDetails.id_supplier);
        let lotDetails = [];
        item_details.forEach(value => {
          lotDetails.push({
            stockType: value.stock_type,
            productName: value.product_name,
            designName: value.design_name,
            subDesignName: value.sub_design_name,
            selectedCategory: value.id_category,
            selectedPurity: value.id_purity,
            selectedProduct: value.id_product,
            selectedDesign: value.id_design,
            selectedSubDesign: value.id_sub_design,
            selectedSection: value.id_section,
            piece: value.pieces,
            selectedSize: value.id_size,
            uomId: value.uom_id,
            grossWeight: value.gross_wt,
            lessWeight: value.less_wt,
            stnWeight: value.stone_wt,
            diaWeight: value.dia_wt,
            netWeight: value.net_wt,
            sellRate: value.sell_rate,
            purchaseTouch: value.purchase_touch,
            purchaseWastage: value.purchase_va,
            purchaseMc: value.purchase_mc,
            purchaseMcType: value.purchase_mc_type,
            purchaseRate: value.purchase_rate,
            rateCalcType: value.purchase_rate_type,
            pureWeight: value.pure_wt,
            pureCalcType: value.pure_wt_cal_type,
            purchaseRateType: value.purchase_rate_type,
            purchaseCost: value.purchase_cost,
            editIndex: '',
            stoneDetails: (value?.stone_details ? setEditStoneDetails(value?.stone_details) : []),
            id_lot_inward_detail: value.id_lot_inward_detail
          })

        });
        setFormData(lotDetails);
        console.log(formData);
      }
    }
  }, [id, lotItemDetails])

  const setEditStoneDetails = (data) => {

    let stone_details = [];
    if (data.length > 0) {
      console.log(data);
      stone_details = data.map(item => ({
        'show_in_lwt': item.show_in_lwt,
        'stone_name': item.stone_name,
        'id_stone': item.id_stone,
        'stone_type': item.stone_type,
        'id_quality_code': item.id_quality_code,
        'piece': item.stone_pcs,
        'stone_rate': item.pur_st_rate,
        'weight': item.stone_wt,
        'uom_id': item.uom_id,
        'amount': item.pur_stn_cost,
        'stn_calc_type': item.pur_stn_cal_type,
        'id_lot_inw_stn_detail': item.id_lot_inw_stn_detail
      }));
    }
    return stone_details;
  }

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const handleSetStoneDetails = (data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      stoneDetails: data,
    }));
    console.log(data);
  };

  useEffect(() => {
    if (formValues.selectedProduct !== '' && formValues.selectedProduct !== null) {
      const product = products.find((val) => val.pro_id === formValues.selectedProduct);

      if (parseInt(product.sales_mode) === 1) {
        setFixedRateItem(false);
      } else {
        setFixedRateItem(true);
      }

      if (parseInt(product.fixed_rate_type) === 2 && parseInt(product.sales_mode) === 0) {
        setIsMrpItem(true);
        formValues.grossWeight = 0;
      } else {
        setIsMrpItem(false);
      }

      console.log(fixedRateCalc);
      if (product.stock_type === '1') {
        setIsSectionRequired(true);
      } else {
        setIsSectionRequired(false);
      }
      console.log(product.has_size);
      if(parseInt(product.has_size)==1){
        setIsSizeReq(true);
      }else{
        setIsSizeReq(false);
      }


    }
  }, [formValues.selectedProduct]);

  useEffect(() => {
    const net_weight = calculateNetWeight({
      gross_weight: formValues.grossWeight,
      less_weight: formValues.lessWeight,
    });
    setFormValues(prevValues => ({
      ...prevValues,
      netWeight: net_weight,
    }));
  }, [formValues.grossWeight, formValues.lessWeight]);

  useEffect(() => {
    if (formValues.purchaseTouch !== '' && formValues.purchaseTouch !== 0 && formValues.purchaseTouch !== null) {
      const pureWeight = calculatePureWeight({
        netWeight: formValues.netWeight,
        purchaseTouch: formValues.purchaseTouch,
        pureCalcType: formValues.pureCalcType,
        purchaseWastage: formValues.purchaseWastage
      });
      setFormValues(prevValues => ({
        ...prevValues,
        pureWeight: pureWeight,
      }));
    }

  }, [formValues.purchaseTouch, formValues.purchaseWastage, formValues.netWeight, formValues.pureCalcType]);

  useEffect(() => {
    if (formValues.pureWeight !== 0 && formValues.purchaseRate !== 0 && formValues.purchaseRate !== '' && formValues.purchaseRate !== null) {
      const purchaseCost = calculatePurchaseCost({
        pureWeight: formValues.pureWeight,
        purchaseMcType: formValues.purchaseMcType,
        purchaseMc: formValues.purchaseMc,
        purchaseRate: formValues.purchaseRate,
        netWeight: formValues.netWeight,
        piece: formValues.piece,
        rateCalcType: formValues.purchaseRateType
      });
      setFormValues(prevValues => ({
        ...prevValues,
        purchaseCost: purchaseCost.purchaseCost,
      }));
    }

  }, [formValues.piece, formValues.netWeight, formValues.pureWeight, formValues.purchaseMcType, formValues.purchaseMc, formValues.purchaseRate]);

  const resetForm = () => {
    setFormValues(initialState);
    if (lessWeightRef.current) {
      lessWeightRef.current.resetForm();
    }
  };

  const addToPreview = (data) => {
    if (idBranch === '' || idBranch === null) {
      toastfunc("Please Select the Branch..");
    } else if (idSupplier === '' || idSupplier === null) {
      toastfunc("Please Select the Supplier..");
    }
    else {
      // let itemExists = false;
      // if (formData.length > 0) {
      //   formData.forEach((item, index) => {
      //     console.log(data);
      //     if (item.selectedProduct === data.selectedProduct && item.selectedDesign === data.selectedDesign && item.selectedSubDesign === data.selectedSubDesign && index !== editIndex) {
      //       if (data.id_lot_inward_detail === '') {
      //         itemExists = true;
      //         return;
      //       }
      //     }
      //   });
      // }
      // if (itemExists) {
      //   toastfunc("Item Already Exists..")
      // } else {
      const item = {
        ...data,
        id_lot_inward_detail: formValues?.id_lot_inward_detail,
        selectedPurity: formValues.selectedPurity,
        stoneDetails: formValues.stoneDetails,
        lessWeight: formValues.lessWeight,
        netWeight: formValues.netWeight,
        stnWeight: formValues.stnWeight,
        diaWeight: formValues.diaWeight,
        purchaseCost: formValues.purchaseCost,

      };
      const product = products.find((val) => val.pro_id === item.selectedProduct);
      const design = designs.find((val) => val.id_design === item.selectedDesign);
      const subDesign = subDesigns.find((val) => val.id_sub_design === item.selectedSubDesign);

      const newItem = {
        productName: product.product_name,
        designName: design?.design_name,
        subDesignName: subDesign?.sub_design_name,
        stockType: (product.stock_type === "0" ? 'Tagged' : 'Non Tag'),
        ...item
      };

      if (editIndex !== null) {
        const updatedFormData = [...formData];
        updatedFormData[editIndex] = newItem;
        setFormData(updatedFormData);
        setEditIndex(null);
      } else {
        console.log(data);
        setFormData(prevData => [...prevData, newItem]);
      }
      resetForm();
      if (productRef.current) {
        productRef.current.focus()
      }
      // }
    }
  };


  const handleEdit = (index) => {
    const item = formData[index];
    setFormValues({
      grossWeight: item.grossWeight,
      lessWeight: item.lessWeight,
      netWeight: item.netWeight,
      piece: item.piece,
      stnWeight: item.stnWeight,
      diaWeight: item.diaWeight,
      selectedCategory: item.selectedCategory,
      selectedPurity: item.selectedPurity,
      selectedProduct: item.selectedProduct,
      selectedSize:item.selectedSize,
      selectedDesign: item.selectedDesign,
      selectedSubDesign: item.selectedSubDesign,
      selectedSection: item.selectedSection,
      sellRate: item.sellRate,
      purchaseMc: item.purchaseMc,
      purchaseMcType: item.purchaseMcType,
      purchaseRate: item.purchaseRate,
      rateCalcType: item.rateCalcType,
      purchaseTouch: item.purchaseTouch,
      purchaseWastage: item.purchaseWastage,
      pureWeight: item.pureWeight,
      pureCalcType: item.pureCalcType,
      purchaseCost: item.purchaseCost,
      id_lot_inward_detail: item.id_lot_inward_detail
    });
    handleSetStoneDetails(item.stoneDetails);
    setEditIndex(index);
  };


  const handleDelete = (index) => {

    SetModalActionName("delete");
    SetDeleteModal(true);
    SetDelId(index);
  };

  const deleteItem = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
    toggle();
  }

  const resetPurity = () => setFormValues((prevValues) => ({ ...prevValues, selectedPurity: null }));
  const resetProduct = () => setFormValues((prevValues) => ({ ...prevValues, selectedProduct: null }));
  const resetDesign = () => setFormValues((prevValues) => ({ ...prevValues, selectedDesign: null }));
  const resetSubDesign = () => setFormValues((prevValues) => ({ ...prevValues, selectedSubDesign: null }));
  const resetSection = () => setFormValues((prevValues) => ({ ...prevValues, selectedSection: null }));



  const numericFields = ['piece', 'grossWeight', 'lessWeight', 'netWeight', 'stnWeight', 'diaWeight', 'pureWeight', 'purchaseCost'];
  const calcTypeOptions = [{ 'label': 'Per Gram', 'value': 1, 'isDefault': true }, { 'label': 'Per Piece', 'value': 2 }];
  const PureCalcTypeOptions = [{ 'label': 'Touch+VA', 'value': 2, 'isDefault': true }, { 'label': 'Touch', 'value': 1 }, { 'label': 'Wt * VA %', 'value': 3 }];

  const onClickSave = (data) => {
    if (formData.length === 0) {
      toastfunc("Please Add the Item Details")
    }
    else {
      setIsSubmitted(true);
      const lotDetails = formData.map(item => ({
        "id_purity": item.selectedPurity,
        "id_product": item.selectedProduct,
        "size":item.selectedSize,
        "id_design": item.selectedDesign,
        "id_sub_design": item.selectedSubDesign,
        "id_section": item.selectedSection,
        "uom_id": item.uomId,
        "pieces": isUndefined(item.piece),
        "gross_wt": isUndefined(item.grossWeight),
        "less_wt": isUndefined(item.lessWeight),
        "net_wt": isUndefined(item.netWeight),
        "dia_wt": isUndefined(item.diaWeight),
        "stone_wt": isUndefined(item.stnWeight),
        "sell_rate": isUndefined(item.sellRate),
        "purchase_touch": isUndefined(item.purchaseTouch),
        "pure_wt": isUndefined(item.pureWeight),
        "purchase_va": isUndefined(item.purchaseWastage),
        "purchase_mc": isUndefined(item.purchaseMc),
        "purchase_mc_type": item.purchaseMcType,
        "pure_wt_cal_type": item.pureCalcType,
        "purchase_rate_type": item.rateCalcType,
        "purchase_rate": isUndefined(item.purchaseRate),
        "purchase_cost": isUndefined(item.purchaseCost),
        "stone_details": setStoneDetails(item.stoneDetails),
        "id_lot_inward_detail": item.id_lot_inward_detail
      }));
      let postData = {
        "lot": { "id_supplier": idSupplier, "id_branch": idBranch , lot_type : lotType},
        "lot_details": lotDetails
      }
      saveLot(postData);
      console.log(postData);
    }
  }
  const setStoneDetails = (data) => {
    let stone_details = [];
    if (data.length > 0) {
      console.log(data);
      stone_details = data.map(item => ({
        "id_stone": item.id_stone,
        "uom_id": item.uom_id,
        "stone_pcs": item.piece,
        "stone_wt": item.weight,
        "stone_type": item.stone_type,
        "pur_stn_cal_type": item.stn_calc_type,
        "pur_st_rate": item.stone_rate,
        "pur_stn_cost": item.stone_amount,
        "show_in_lwt": item.show_in_lwt,
        "id_lot_inw_stn_detail": item.id_lot_inw_stn_detail,
        "id_quality_code": item.id_quality_code
      }));
    }
    return stone_details;
  };

  const saveLot = async (postData) => {
    try {
      if (id !== '' && id !== undefined && id !== null) {
        const update_data = { id: id, putData: postData };
        await dispatch(updateLot(update_data)).unwrap();
      } else {
        const response = await dispatch(createLot(postData)).unwrap();
        downloadPDF(response.data.pdf_path, response.data.lot_no);
        //window.open(response.data.pdf_url, '_blank');
      }
      navigate(`${process.env.PUBLIC_URL}/inventory/lot/list`);
    } catch (error) {
      setIsSubmitted(false);
      console.error(error);
    }
  }




  const downloadPDF = async (printPageURL, id) => {
    const data = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/${printPageURL}/${id}/`, {
      headers: {
        Authorization: `Token ${secureLocalStorage.getItem("pref")?.token}`,
      },
    });

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

  return {
    selectedBranchId,
    selectedSupplierID,
    formValues,
    formData,
    editIndex,
    lessWeightRef,
    handleInputChange,
    handleSetStoneDetails,
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
    isSizeRequired,
    isMrpItem,
    fixedRateCalc,
    productRef
  };
};

export default useLotFormHandling;