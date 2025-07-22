import { useState, useEffect, useRef } from 'react';
import { calculateNetWeight, calculatePurchaseCost, calculatePureWeight } from '../../../components/common/calculations/ErpCalculations';

const useLotFormHandling = ( products, designs, subDesigns) => {

const initialState = {
    selectedCategory: '',
    selectedPurity: '',
    selectedProduct: '',
    selectedDesign: '',
    selectedSubDesign: '',
    piece:'',
    uomId:1,
    grossWeight:'',
    lessWeight:0,
    stnWeight:'',
    diaWeight:'',
    netWeight:'',
    sellRate:'',
    purchaseTouch:'',
    purchaseWastage:'',
    purchaseMc:'',
    purchaseMcType:'1',
    purchaseRate:'',
    rateCalcType:'',
    pureWeight:'',
    pureCalcType:'1',
    purchaseRateType:'1',
    purchaseCost:'',
    editIndex:'',
    stoneDetails: [],
    };

  const [formValues, setFormValues] = useState(initialState);
  const [formData, setFormData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const lessWeightRef = useRef();

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const handleSetStoneDetails = (data) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      stoneDetails: data,
    }));
  };

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
    const pureWeight = calculatePureWeight({
      netWeight: formValues.netWeight,
      purchaseTouch: formValues.purchaseTouch,
      pureCalcType: formValues.pureCalcType,
      purchaseWastage:formValues.purchaseWastage
    });
    setFormValues(prevValues => ({
      ...prevValues,
      pureWeight: pureWeight,
    }));
  }, [formValues.purchaseTouch,formValues.purchaseWastage, formValues.netWeight,formValues.pureCalcType]);

  useEffect(() => {
    const purchaseCost = calculatePurchaseCost({
      pureWeight: formValues.pureWeight,
      purchaseMcType: formValues.purchaseMcType,
      purchaseMc: formValues.purchaseMc,
      purchaseRate:formValues.purchaseRate,
      netWeight:formValues.netWeight,
      piece:formValues.piece
    });
    setFormValues(prevValues => ({
      ...prevValues,
      purchaseCost: purchaseCost,
    }));
  }, [formValues.piece,formValues.netWeight,formValues.pureWeight,formValues.purchaseMcType,formValues.purchaseMc,formValues.purchaseRate]);

  const resetForm = () => {
    setFormValues(initialState);
    if (lessWeightRef.current) {
      lessWeightRef.current.resetForm();
    }
  };

  const addToPreview = (data) => {
    const item = { ...data, 
        stoneDetails: formValues.stoneDetails, 
        lessWeight: formValues.lessWeight,
        netWeight: formValues.netWeight,
        stnWeight: formValues.stnWeight,
        diaWeight: formValues.diaWeight,
        purchaseCost:formValues.purchaseCost,

    };
    const product = products.find((val) => val.pro_id === item.selectedProduct);
    const design = designs.find((val) => val.id_design === item.selectedDesign);
    const subDesign = subDesigns.find((val) => val.id_sub_design === item.selectedSubDesign);

    const newItem = {
      productName: product.product_name,
      designName: design.design_name,
      subDesignName: subDesign.sub_design_name,
      ...item
    };

    if (editIndex !== null) {
      const updatedFormData = [...formData];
      updatedFormData[editIndex] = newItem;
      setFormData(updatedFormData);
      setEditIndex(null);
    } else {
      setFormData(prevData => [...prevData, newItem]);
    }
    resetForm();
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
        selectedDesign: item.selectedDesign,
        selectedSubDesign: item.selectedSubDesign,
        sellRate: item.sellRate,
        purchaseMc: item.purchaseMc,
        purchaseMcType:item.purchaseMcType,
        purchaseRate: item.purchaseRate,
        rateCalcType:item.rateCalcType,
        purchaseTouch: item.purchaseTouch,
        purchaseWastage: item.purchaseWastage,
        pureWeight: item.pureWeight,
        pureCalcType:item.pureCalcType,
        purchaseCost:item.purchaseCost
    });
    handleSetStoneDetails(item.stoneDetails);
    setEditIndex(index);
  };
  

  const handleDelete = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
  };

  const resetPurity = () => setFormValues((prevValues) => ({ ...prevValues, selectedPurity: null }));
  const resetProduct = () => setFormValues((prevValues) => ({ ...prevValues, selectedProduct: null }));
  const resetDesign = () => setFormValues((prevValues) => ({ ...prevValues, selectedDesign: null }));
  const resetSubDesign = () => setFormValues((prevValues) => ({ ...prevValues, selectedSubDesign: null }));

  const columns = [
    { header: 'Product', accessor: 'productName',},
    { header: 'Design', accessor: 'designName', },
    { header: 'S.Design', accessor: 'subDesignName',},
    { header: 'Piece', accessor: 'piece' ,decimal_places:0},
    { header: 'Gwt', accessor: 'grossWeight' ,decimal_places:3},
    { header: 'Lwt', accessor: 'lessWeight' ,decimal_places:3},
    { header: 'Nwt', accessor: 'netWeight' ,decimal_places:3},
    { header: 'Stn Wt', accessor: 'stnWeight' ,decimal_places:3},
    { header: 'Dia Wt', accessor: 'diaWeight' ,decimal_places:3},
    { header: 'Pure Wt', accessor: 'pureWeight' ,decimal_places:3},
    { header: 'Pur Cost', accessor: 'purchaseCost' ,decimal_places:2},
  ];

 const numericFields = ['piece', 'grossWeight', 'lessWeight', 'netWeight','stnWeight','diaWeight','pureWeight','purchaseCost'];
 const calcTypeOptions = [{'label':'Per Gram','value':1},{'label':'Per Piece','value':2}];
 const PureCalcTypeOptions = [{'label':'Touch+VA','value':2},{'label':'Weight+VA','value':1},{'label':'Wt * VA %','value':3}];

  return {
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
    columns,
    numericFields,
    calcTypeOptions,
    PureCalcTypeOptions
  };
};

export default useLotFormHandling;