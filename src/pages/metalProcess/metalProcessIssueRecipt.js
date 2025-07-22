import React, { useEffect, useState,useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Head from "../../layout/head/Head";
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import Content from "../../layout/content/Content";
import CurrencyDisplay from '../../components/common/moneyFormat/moneyFormat';
import {
  PreviewCard,
  SaveButton,
} from "../../components/Component";
import {
  Col,
  Row,
  Icon,
} from "../../components/Component";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "reactstrap";
import IsRequired from "../../components/erp-required/erp-required";
import LessWeightInputField from "../../components/form-control/LessWeight";
import OtherMetalWeightInputField from "../../components/form-control/otherMetalInput";
import { SelectDropdown,SupplierDropdown,BranchDropdown,ProductDropdown } from "../../components/filters/retailFilters";
import { useSupplierFilter,useBranches,useProducts,useUom } from "../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import {NumberInputField } from "../../components/form-control/InputGroup";
import { calculateNetWeight } from "../../components/common/calculations/ErpCalculations";
import { createMetalProcess, getPocketDetails,getMetalIssueDetails,getMetalReceivedDetails,getMetalTestingIssueDetails,getMetalTestingReceivedDetails,getMetalRefiningIssueDetails } from "../../redux/thunks/metalProcess";
import AddedProductForm from "../../components/common/modal/AddedProductModal";
import { getPagePermission } from "../../redux/thunks/coreComponent";

const MetalProcessIssueRecipt = () => {
  const location = useLocation();
  // let title = location?.state?.title;
  // const add = location?.state?.add;
  // const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    reset,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading: issubmitting,
    pocketDetails,
    metalIssueDetails,
    metalReceivedDetails,
  } = useSelector((state) => state.metalProcessReducer);
  const [pocketList, setPocketList] = useState([]);
  const [processType, setProcessType] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedSupplier, setSelectedSuplier] = useState();
  const [selectedBranch, setSelectedBranch] = useState();
  const { branches } = useBranches();
  const { products } = useProducts();
  const [type, setType] = useState(1);
  const [pocketIssuedList, setPocketIssuedList] = useState([]);
  const { supplier } = useSupplierFilter();
  const { uom } = useUom();
  const lessWeightRef = useRef();
  const methods = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const handleSave = (data,item,totalWeight) => {
    console.log(item)
    if(parseFloat(item.issue_weight)<parseFloat(totalWeight))
    {
        toastfunc("Weight is exceed than The Total Weight "+item.issue_weight+"  "+totalWeight);
    }else{
      handelReciptChange(item.index,'item_details',data)
      handelReciptChange(item.index,'weight',totalWeight)

        toggleModal();
    }
  };
  const typeOption = [
    { value: 1, label: 'Issue' },
    { value: 2, label: 'Receipt' },
  ]

  const processTypeOption = [
    { value: 1, label: 'Melting' },
    { value: 2, label: 'Testing' },
    { value: 3, label: 'Refining' },

  ]

  const { userInfo: { settings } } = useSelector((state) => state.authUserReducer);

  useEffect(() => {
    if(type == 1 && processType == 1){
      setPocketList(pocketDetails);
    }else if(type == 2 && (processType == 1 || processType == 2  )){
      setPocketIssuedList(metalIssueDetails);
    }else if(type == 1 && processType == 2 ){
      console.log(metalReceivedDetails)
      setPocketList(metalReceivedDetails);
    }else if(type == 1 && processType == 3 ){
      console.log(metalReceivedDetails)
      setPocketList(metalReceivedDetails);
    }else if(type == 2 && processType == 3 ){
      console.log(metalReceivedDetails)
      setPocketIssuedList(metalIssueDetails);
    }
    console.log(metalIssueDetails)
  }, [pocketDetails,metalIssueDetails,metalReceivedDetails]);




  const form_submit = async (data, actionType) => {
    let assignData = []
    console.log(assignData);
    if(type == 1){
      pocketList?.map((item, rowIndex) => {
        if (item.isChecked) {
          assignData.push({...item,"issue_weight":item?.weight,"touch":item?.touch_average})
        }
      })
    }else if(type == 2){
      console.log("ewdv")
      pocketIssuedList?.map((item, rowIndex) => {
        if (item.isChecked) {
          assignData.push({...item,"melting_issue_ref_no":item?.id_metal_process})
        }
      })
    }

    if (assignData.length && selectedSupplier && selectedBranch) {
      let data = {}
      if(type == 1){
         data = {
          "type": String(type),
          "process_id": String(processType),
          "id_supplier":selectedSupplier,
          "id_branch":selectedBranch,
          'issue_details': assignData
        }
      }else if(type == 2){
         data = {
          "type": String(type),
          "process_id": String(processType),
          "id_supplier":selectedSupplier,
          "id_branch":selectedBranch,
          'receipt_details': assignData
        }
      }
       if(processType == 1 && type == 2){
        data = {
         "type": String(type),
         "process_id": String(processType),
         "id_supplier":selectedSupplier,
         "id_branch":selectedBranch,
         'receipt_details': assignData[0]
       }
      }

      create_metal_process(data);
    }else if(!selectedBranch) {
      toastfunc(" Select Branch !!")
    }else if(!selectedSupplier) {
      toastfunc(" Select Supplier !!")
    }
     else {
      toastfunc(" Select Stock to approval")
    }

  };

  const create_metal_process = async (data) => {
    try {
      let response = await dispatch(createMetalProcess(data)).unwrap();
      console.log(response)
      reset_form();
    } catch (error) {
      let message = error?.response?.data?.message;
      toastfunc(message);
    }
  };

  const calculateTotal = (field) => {
    return pocketDetails.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columnsIssue.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const calculateAverage = (field) => {
    if (!pocketDetails || pocketDetails.length === 0) return 0;
  
    // Calculate total and count of valid values
    const { total, count } = pocketDetails.reduce(
      (acc, current) => {
        const value = parseFloat(current[field]);
        if (!isNaN(value) && parseFloat(value) > 0) {
          acc.total += value;
          acc.count += 1;
        }
        return acc;
      },
      { total: 0, count: 0 }
    );
  
    // Avoid division by zero
    const average = count > 0 ? total / count : 0;
  
    // Get decimal places configuration
    const column = columnsIssue.find((item) => item.accessor === field);
    const decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
  
    // Return average rounded to decimal_places
    return decimal_places !== null ? parseFloat(average).toFixed(decimal_places) : average;
  };

  const calculateTotalDownload = (field) => {
    return pocketIssuedList?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columnsRecipts.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };


  const handleDelete = (index) => {
    const updatedFormData = [...pocketList];
    updatedFormData.splice(index, 1);
    setPocketList(updatedFormData);
  };

  const getPocketDetail = () => {
    if (type && processType) {
      if(type == 1 && processType == 1){
        dispatch(getPocketDetails());
      }else if(type == 2 && processType == 1 ){
        dispatch(getMetalIssueDetails({
          "id_supplier": selectedSupplier,
          "process_id": processType
      }));
      }else if(type == 1 && processType == 2 ){
        dispatch(getMetalReceivedDetails({
          "id_supplier": selectedSupplier,
          "process_id": processType
      }));
      }else if(type == 2 && processType == 2 ){
        dispatch(getMetalTestingIssueDetails({
          "id_supplier": selectedSupplier,
          "process_id": processType
      }));
      }
      else if(type == 1 && processType == 3 ){
        dispatch(getMetalTestingReceivedDetails({
          "id_supplier": selectedSupplier,
          "process_id": processType
      }));
      }
      else if(type == 2 && processType == 3 ){
        dispatch(getMetalRefiningIssueDetails({
          "id_supplier": selectedSupplier,
          "process_id": processType
      }));
      }
    } else if (!type) {
      toastfunc(" Type Required !!")
    }
    else if (!processType) {
      toastfunc(" Process Type Required !!")
    }
    

  }

  const selectAllCol = (value) => {
    pocketList?.map((item, rowIndex) => {
      handelChange(rowIndex, 'isChecked', value)
    })

  }
  const selectReciptAllCol = (value) => {
    pocketIssuedList?.map((item, rowIndex) => {
      handelReciptChange(rowIndex, 'isChecked', value)
    })

  }

  const handelChange = (index, field, value) => {
    setPocketList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
    console.log(pocketList)
  };

  const handelReciptChange = (index, field, value) => {
    setPocketIssuedList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
    console.log(pocketList)
  };
  const reset_form = async () => {
    reset("");
    setPocketList([]);
    setPocketIssuedList([]);
    setSelectedBranch();
    setSelectedSuplier();
    setType(1);
    setProcessType(1);
  };



  const columnsMeltingIssue = [
    { header: "Pocket No", accessor: "pocket_no", textAlign: "center" },
    { header: "Metal Name", accessor: "metal_name", textAlign: "center"},
    { header: "Pcs", accessor: "melting_pieces", textAlign: "right", isTotalReq: true,customised : true,type:"number",setMax:true,maxValueAccessor: "max_pieces", },
    { header: "Gwt", accessor: "gross_wt", decimal_places: 3, textAlign: "right", isTotalReq: true,customised : true,type:"gross_wt",setMax:true,maxValueAccessor: "max_gross_wt", },
    { header: "Nwt", accessor: "net_wt", decimal_places: 3, textAlign: "right", isTotalReq: true, },
    { header: "Lwt", accessor: "less_wt", decimal_places: 3, textAlign: "right", isTotalReq: true,customised : true,type:"less_wt",},
    { header: "Touch", accessor: "touch_average", decimal_places: 3, textAlign: "right", isAvgReq: true},
  ];

  const columnsMeltingReceipts = [
    { header: "Ref No", accessor: "melting_issue_ref_no", textAlign: "center",  },
    { header: "Product", accessor: "id_product", textAlign: "center",customised : true},
    { header: "Pcs", accessor: "pieces",  textAlign: "right", isTotalReq: true },
    { header: "Issued Weight", accessor: "issue_weight",decimal_places: 3,textAlign: "right", isTotalReq: true },
    { header: "Weight", accessor: "weight", decimal_places: 3, textAlign: "right", isTotalReq: true,customised : true,type:"number",setMax:true,maxValueAccessor: "issue_weight", },
    { header: "Touch", accessor: "touch", decimal_places: 3, textAlign: "left", isAvgReq: true},
    { header: "Charges", accessor: "charges", decimal_places: 3, textAlign: "right", isTotalReq: true,customised : true,type:"number" },
  ];

  
  const columnsTestingIssue = [
    { header: "Ref No", accessor: "ref_no", textAlign: "center" },
    { header: "Product", accessor: "product_name", textAlign: "center" },
    { header: "Touch", accessor: "melting_touch", textAlign: "right" },
    { header: "Pcs", accessor: "pieces", textAlign: "right", isTotalReq: true },
    { header: "Weight", accessor: "weight", decimal_places: 3, textAlign: "right", isTotalReq: true,type:"number",customised : true,setMax:true,maxValueAccessor: "issue_weight", },
  ];

  const columnsTestingReceipts = [
    { header: "Ref No", accessor: "ref_no", textAlign: "center",  },
    { header: "Product", accessor: "product_name", textAlign: "center",  },
    { header: "Touch", accessor: "touch", decimal_places: 3, textAlign: "right", isTotalReq: true,type:"number",customised : true,setMax:true,maxValue:100 },
    { header: "Received Weight", accessor: "received_weight", decimal_places: 3, textAlign: "right", isTotalReq: true,customised : true,type:"number",setMax:true,maxValueAccessor: "issue_weight", },
    { header: "Charges", accessor: "charges", decimal_places: 3, textAlign: "left", isTotalReq: true,customised : true,type:"number" },

  ];

  const columnsRefiningIssue = [
    { header: "Ref No", accessor: "ref_no", textAlign: "center",  },
    { header: "Product Name", accessor: "product_name", textAlign: "center"},
    { header: "Pcs", accessor: "pieces",textAlign: "right", isTotalReq: true },
    { header: "Weight", accessor: "weight", decimal_places: 3, textAlign: "right", isTotalReq: true },
  ];

  const columnsRefiningReceipts = [
    { header: "Ref No", accessor: "ref_no", textAlign: "center",  },
    { header: "Received Weight", accessor: "weight", decimal_places: 3, textAlign: "left", isTotalReq: true,customised : true,type:"numberwithModal",setMax:true,maxValueAccessor: "issue_weight", },
    { header: "Charges", accessor: "charges", decimal_places: 3, textAlign: "left", isTotalReq: true,customised : true,type:"number" },

  ];

  const [columnsIssue, setColumnsIssue] = useState(columnsMeltingIssue);
  const [columnsRecipts, setColumnsReceipts] = useState(columnsMeltingReceipts);


  useEffect(() => {
    if(processType === 1){
      setColumnsReceipts(columnsMeltingReceipts) 
      setColumnsIssue(columnsMeltingIssue)
    }else if(processType === 2 ){
      setColumnsIssue(columnsTestingIssue) 
      setColumnsReceipts(columnsTestingReceipts)
    }else if(processType === 3 ){
      setColumnsIssue(columnsRefiningIssue) 
      setColumnsReceipts(columnsRefiningReceipts)
    }
    console.log(processType)
  }, [type,processType]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const pathName = location?.pathname;
   const { pagePermission } = useSelector((state) => state.coreCompReducer);

   useEffect(() => {
      dispatch(getPagePermission({ path: pathName }));
    }, [pathName, dispatch]);

  useEffect(() => {
        if (pagePermission?.view === false || pagePermission === undefined || pagePermission === null) {
          navigate(`${process.env.PUBLIC_URL}/`);
        }
      }, [pagePermission, navigate]);


  return (
    <React.Fragment>
      <Head title="Approval" />
      <Content>
        <PreviewCard className="h-100">
        <FormProvider {...methods}>
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb/>
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              
              <SaveButton
              disabled={issubmitting || !pagePermission?.add}
              size="md"
              color="primary"
              onClick={handleSubmit((data) => {
                console.log(errors)
                form_submit(data, "saveAndNew")
              }

              )}
            >
              {issubmitting ? "Saving" : "Save"}
            </SaveButton>

            


              
              <SaveButton
             
              size="md"
              color="warning"
              onClick={() => navigate(`${process.env.PUBLIC_URL}/inventory/stock_transfer/list`)}
            >
              Close
            </SaveButton>

            

            </Col>
          </Row>


          <div className="custom-grid">
            <Row className="g-3 align-center form-control-sm">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Type
                    <IsRequired />
                  </label>
                  <SelectDropdown
                    register={register}
                    id={"type"}
                    data={typeOption}
                    selectedValue={type}
                    setValue={setValue}
                    clearErrors ={clearErrors}
                    onChangeEvent={(value) => {
                      setType(value);
                      setPocketList([]);
                      setPocketIssuedList([]);
                    }}
                    placeholder={'Type'}
                    valueField = {'value'}
                    labelField = {'label'}
                  />
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Process
                    <IsRequired />
                  </label>
                  <SelectDropdown
                    register={register}
                    id={"processType"}
                    data={processTypeOption}
                    selectedValue={processType}
                    setValue={setValue}
                    clearErrors ={clearErrors}
                    onChangeEvent={(value) => {
                      setProcessType(value);
                      setPocketList([]);
                      setPocketIssuedList([]);
                    }}
                    placeholder={'Type'}
                    valueField = {'value'}
                    labelField = {'label'}
                  />
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Branch
                    <IsRequired />
                  </label>
                  <BranchDropdown
                    register={register}
                    id={"selectedBranch"}
                    branches={branches}
                    selectedBranch={selectedBranch}
                    onBranchChange={(value) => {
                      setSelectedBranch(value);
                      setPocketList([]);
                      setPocketIssuedList([]);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectedBranch && "Branch is Required"}
                  />
                </div>
              </Col>
              <Col md={2}>
                <label className="form-label" htmlFor="selectedDesign" style={{ marginBottom: "0px" }}>
                    Supplier
                    <IsRequired />
                </label>
                <SupplierDropdown
                            register={register}
                            id={"selectedSupplier"}
                            supplier={supplier}
                            selectedSupplier={selectedSupplier}
                            onSupplierChange={(value) => {
                                setSelectedSuplier(value);
                            }}
                            isRequired={false}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            message={errors.selectedSupplier && "Supplier is Required"}
                        />
            </Col>

              <Col lg="2">
                    <br></br>
                <SaveButton disabled={issubmitting} color="secondary" size="md"
                    onClick={() => getPocketDetail()}  >
                    Search
                </SaveButton>
              </Col>

              
            </Row>

            {type === 1 &&
            <Row className="mt-2" md={12}>
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>S.NO  <input type="checkbox" onChange={(event) => {
                        selectAllCol(event.target.checked);
                        setSelectAll(event.target.checked);
                      }} checked={selectAll} /> </th>
                      {columnsIssue.map((column, index) => {
                            return  (
                              <th key={index} style={{ "textAlign": column?.textAlign ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }} >
                                {column.header}</th>
                            )
                      })}
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pocketList?.length > 0 && pocketList?.map((item, rowIndex) => (
                      <tr key={rowIndex} >
                        <td>{rowIndex + 1} <input type="checkbox" onChange={(event) => { handelChange(rowIndex, 'isChecked', event.target.checked); }} checked={item.isChecked} /> </td>
                        {columnsIssue?.map((column, colIndex) => {
                                                     if (column?.customised) {
                                                      if (column.accessor ==='id_product') {
                                                        return (
                                                          <td key={colIndex} style={{ textAlign: column?.textAlign,width: "20%" }}>
                                                              <ProductDropdown
                                                                  register={register}
                                                                  id={"selectedProduct"+rowIndex}
                                                                  products={products}
                                                                  selectedProduct={item.id_product}
                                                                  onProductChange={(value) => {
                                                                    handelChange(rowIndex, 'id_product', value)
                                                                  }}
                                                                  isRequired={item.isChecked}
                                                                  clearErrors={clearErrors}
                                                                  setValue={setValue}
                                                                  message={errors["selectedProduct"+rowIndex] && "Product is Required"}
                                                                />
                                                          </td>
                                                        );
                                                      }else if(column.type ==='number'){
                                                        console.log((column?.setMax ? (column?.maxValue ? column.maxValue : item[column.maxValueAccessor] ) : ''),item[column.maxValueAccessor])
                                                        return (
                                                          <td key={colIndex} style={{ textAlign: column?.textAlign,width: "20%" }}>
                                                              <NumberInputField
                                                                register={register}
                                                                placeholder={column.header}
                                                                id={column.accessor + rowIndex}
                                                                value={item[column.accessor]}
                                                                isRequired={item.isChecked}
                                                                min={"0"}
                                                                max={(column?.setMax ? (column?.maxValue ? column.maxValue : item[column.maxValueAccessor] ) : '')}
                                                                setValue={setValue}
                                                                handleDot={false}
                                                                handleDecimalDigits={true}
                                                                decimalValues={(column?.decimal_places ?  column.decimal_places:0)}
                                                                handleKeyDownEvents={false}
                                                                SetValue={(value) => {
                                                                  handelChange(rowIndex, column.accessor, value);
                                                                  clearErrors(column.accessor+rowIndex);
                                                                }}
                                                                textAlign={column?.textAlign}
                                                                minError={ column.header +" Should greater than or equal to 0"}
                                                                maxError={column.header +" Should greater than or equal to "}
                                                                reqValueError={column.header +" is Required"}
                                                                message={errors[column.accessor+rowIndex] && errors[column.accessor+rowIndex].message}
                                                              />
                                                          </td>
                                                        );
                                                      }else if(column.type ==='gross_wt'){
                                                        console.log((column?.setMax ? (column?.maxValue ? column.maxValue : item[column.maxValueAccessor] ) : ''))
                                                        return (
                                                        <td key={colIndex} style={{ textAlign: column?.textAlign,width: "20%" }}>
                                                        <NumberInputField
                                                        register={register}
                                                        placeholder="Gross weight"
                                                        id={"UpdateGwt_" + rowIndex}
                                                        value={item.gross_wt}
                                                        isRequired={true}
                                                        min={0}
                                                        max={(column?.setMax ? (column?.maxValue ? column.maxValue : item[column.maxValueAccessor] ) : '')}
                                                        type={"number"}
                                                        setValue={setValue}
                                                        handleKeyDownEvents={true}
                                                        handleDecimalDigits={true}
                                                        decimalValues={3}
                                                        textAlign={column?.textAlign}
                                                        SetValue={(value) => {
                                                          console.log((column?.setMax ? (column?.maxValue ? column.maxValue : item[column.maxValueAccessor] ) : ''),column,column?.maxValue,column?.setMax,item[column.maxValueAccessor] )

                                                            let net_wt = calculateNetWeight({ 'gross_weight': value, 'less_weight': item.less_wt, 'other_metal_weight': 0})

                                                            if (net_wt > 0) {
                                                              handelChange(rowIndex, 'gross_wt', value);
                                                              handelChange(rowIndex, 'net_wt', net_wt)
                                                                clearErrors("UpdateGwt_" + rowIndex);
                                                            } else {

                                                                setError("UpdateGwt_" + rowIndex, {
                                                                    type: "manual",
                                                                    message: "InValid Gross weight"
                                                                });

                                                                handelChange(rowIndex, 'gross_wt', value);

                                                            }

                                                        }}
                                                        minError={"Gross weight should less than or equal to 0"}
                                                        maxError={"Gross Weight greater than or equal to 0"}
                                                        reqValueError={"Gross weight is Required"}
                                                        message={errors["UpdateGwt_" + rowIndex] && errors["UpdateGwt_" + rowIndex].message}
                                                    />
                                                    </td>)
                                                      }
                                                      else if(column.type ==='less_wt'){
                                                        return ( <td key={colIndex} style={{ textAlign: column?.textAlign,width: "20%" }}>
                                                        <LessWeightInputField
                                                        register={register}
                                                        placeholder="Less Weight"
                                                        id={"UpdateLwt_" + rowIndex}
                                                        value={item.less_wt}
                                                        isRequired={false}
                                                        min={0}
                                                        uom={uom}
                                                        gross_weight={item.gross_wt}
                                                        less_weight={item.less_wt}
                                                        clearErrors={clearErrors}
                                                        SetValue={(value) => {
                                                            handelChange(rowIndex, 'less_wt', value)
                                                            let net_wt = calculateNetWeight({ 'gross_weight': item.gross_wt, 'less_weight': value, 'other_metal_weight': 0 })
                                                            handelChange(rowIndex, 'net_wt', net_wt)
                                                        }}
                                                        SetStnWeight={(value) => handelChange(rowIndex, 'stone_wt', value)}
                                                        SetDiaWeight={(value) => handelChange(rowIndex, 'dia_wt', value)}
                                                        SetStoneDetails={(value) => {
                                                            if (parseFloat(item.avail_less_wt) >= parseFloat(item.less_wt) && parseFloat(item.dia_wt) <= parseFloat(item.avail_dia_wt) && parseFloat(item.stone_wt) <= parseFloat(item.avail_stone_wt)) {
                                                                handelChange(rowIndex, 'stone_details', value)
                                                            } else {
                                                                setError("UpdateLwt_" + rowIndex, {
                                                                    type: "manual",
                                                                    message: "InValid StoneDetail Resetted"
                                                                });
                                                                toastfunc("InValid StoneDetail Resetted !!")
                                                                handelChange(rowIndex, 'less_wt', item.avail_less_wt)
                                                                let net_wt = calculateNetWeight({ 'gross_weight': item.gross_wt, 'less_weight': item.avail_less_wt, 'other_metal_weight': 0 })
                                                                handelChange(rowIndex, 'net_wt', net_wt)
                                                                handelChange(rowIndex, 'stone_details', item.avail_stone_details)
                                                                handelChange(rowIndex, 'dia_wt', item.avail_dia_wt)
                                                                handelChange(rowIndex, 'stone_wt', item.avail_stone_wt)


                                                            }
                                                        }}
                                                        stone_details={item.stone_details}
                                                        ref={lessWeightRef}
                                                        message={errors["UpdateLwt_" + rowIndex] && errors["UpdateLwt_" + rowIndex].message}
                                                        isDisabled = { (item.stone_details).length > 0 ? false : true}
                                                    />
                                                    </td>)

                                                      }else if(column.type ==='numberwithModal'){
                                                        return (
                                                          <div className={`form-control-wrap`}>
                                                          <div className="form-icon form-icon-right">
                                                            <Icon name="plus" onClick={()=>{
                                                              toggleModal()
                                                              setSelectedItem({...item,"index":rowIndex});
                                                            }}></Icon>
                                                          </div>
                                                          <input
                                                              className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                                              id={"added_weight"+rowIndex}
                                                              type="number"
                                                              placeholder={"Added Weight"}
                                                              readOnly
                                                              {...register("added_weight"+rowIndex, {
                                                                required: {
                                                                  value: true,
                                                                  message: "Weight is required",
                                                                },
                                                              })}
                                                              value={parseFloat(item.total_weight).toFixed(3)}
                                                              onChange={(e) => {
                                                                props?.SetValue(e.target.value);
                                                                if (props.clearErrors) {
                                                                  props.clearErrors("added_weight"+rowIndex);
                                                                }
                                                              }}
                                                            />
                                                          </div>
                                                        );
                                                      }
                                                  } else {
                            return (
                              <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                                {
                                  column.isCurrency
                                    ? <CurrencyDisplay value={item[column.accessor]} />
                                    : column.decimal_places
                                      ? parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                                      : item[column.accessor]
                                }
                              </td>
                            );
                          }
                        })}

                        <td>
                          <Button
                            color="primary"
                            size="sm"
                            className="btn-icon btn-white btn-dim"
                            onClick={() => handleDelete()}
                          >
                            <Icon name="trash-fill" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr style={{ fontWeight: 'bold' }}>
                      <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Total</td>
                      {columnsIssue.map((column, index) => {

                     
                       return( <td key={index} style={{ "textAlign": column?.textAlign ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                        {column.isTotalReq ? column.isCurrency ? <CurrencyDisplay value={calculateTotal(column.accessor)} /> : (calculateTotal(column.accessor)) : (column?.isAvgReq ? calculateAverage(column.accessor) :'')}
                      </td>)
                      

                      }

                      )}

                    </tr>
                  </tfoot>
                   
                </table>
              </div>
            </Row>
            }
            {type === 2 &&
            <Row className="mt-2" md={12}>
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>S.NO <input type="checkbox" onChange={(event) => {
                        selectReciptAllCol(event.target.checked);
                        setSelectAll(event.target.checked);
                      }} checked={selectAll} /> </th>
                      {columnsRecipts.map((column, index) => {
                        if (column?.customised) {
                          return (
                            <th key={index} style={{ textAlign: column?.textAlign , position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                              {column.header}
                            </th>
                          );
                        }

                        if (!(column?.customised)) {
                          return (
                            <th key={index} style={{ textAlign: column?.textAlign,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                              {column.header}
                            </th>
                          );
                        }
                      })}
                     

                    </tr>
                  </thead>
                  <tbody>
                    {pocketIssuedList?.length > 0 && pocketIssuedList?.map((item, rowIndex) => (
                      <tr key={rowIndex} >
                        <td>{rowIndex + 1} <input type="checkbox" onChange={(event) => { handelReciptChange(rowIndex, 'isChecked', event.target.checked); }} checked={item.isChecked} /> </td>
                        {columnsRecipts?.map((column, colIndex) => {
                           if (column?.customised) {
                              if (column.accessor =='id_product') {
                                return (
                                  <td key={colIndex} style={{ textAlign: column?.textAlign,width: "20%" }}>
                                      <ProductDropdown
                                          register={register}
                                          id={"selectedProduct"+rowIndex}
                                          products={products}
                                          selectedProduct={item.id_product}
                                          onProductChange={(value) => {
                                            handelReciptChange(rowIndex, 'id_product', value)
                                          }}
                                          isRequired={item.isChecked}
                                          clearErrors={clearErrors}
                                          setValue={setValue}
                                          message={errors["selectedProduct"+rowIndex] && "Product is Required"}
                                        />
                                  </td>
                                );
                              }else if(column.type =='number'){
                                console.log((column?.setMax ? (column?.maxValue ? column.maxValue : item[column.maxValueAccessor] ) : ''),item[column.maxValueAccessor])
                                return (
                                  <td key={colIndex} style={{ textAlign: column?.textAlign,width: "20%" }}>
                                      <NumberInputField
                                        register={register}
                                        placeholder={column.header}
                                        id={column.accessor + rowIndex}
                                        value={item[column.accessor]}
                                        isRequired={item.isChecked}
                                        min={"0"}
                                        max={(column?.setMax ? (column?.maxValue ? column.maxValue : item[column.maxValueAccessor] ) : '')}
                                        setValue={setValue}
                                        handleDot={true}
                                        handleKeyDownEvents={false}
                                        SetValue={(value) => {
                                          handelReciptChange(rowIndex, column.accessor, value);
                                          clearErrors(column.accessor+rowIndex);
                                        }}
                                        textAlign={column?.textAlign}
                                        minError={ column.header +" Should greater than or equal to 0"}
                                        maxError={column.header +" Should greater than or equal to "}
                                        reqValueError={column.header +" is Required"}
                                        message={errors[column.accessor+rowIndex] && errors[column.accessor+rowIndex].message}
                                      />
                                  </td>
                                );
                              }else if(column.type =='numberwithModal'){
                                return (
                                  <td key={colIndex} style={{ textAlign: column?.textAlign,width: "20%" }}>
                                  <div className={`form-control-wrap`}>
                                  <div className="form-icon form-icon-right">
                                    <Icon name="plus" onClick={()=>{
                                      toggleModal()
                                      setSelectedItem({...item,"index":rowIndex});
                                    }}></Icon>
                                  </div>
                                  <input
                                      className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                      id={"added_weight"+rowIndex}
                                      type="number"
                                      placeholder={"Added Weight"}
                                      readOnly
                                      {...register("added_weight"+rowIndex, {
                                        required: {
                                          value: item.isChecked,
                                          message: "Weight is required",
                                        },
                                      })}
                                      value={parseFloat(item.weight).toFixed(3)}
                                      onChange={(e) => {
                                        props?.SetValue(e.target.value);
                                        if (props.clearErrors) {
                                          props.clearErrors("added_weight"+rowIndex);
                                        }
                                      }}
                                    />
                                  </div>
                                  </td>
                                );
                              }
                          }

                          if (column?.customised !== true) {
                            return (
                              <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                                {
                                  column.isCurrency
                                    ? <CurrencyDisplay value={item[column.accessor]} />
                                    : column.decimal_places
                                      ? parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                                      : item[column.accessor]
                                }
                              </td>
                            );
                          }

                          // Return null if no conditions are met (optional)
                          return null;
                        })}
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                  <tr style={{ fontWeight: 'bold' }}>
                      <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Total</td>
                      {columnsRecipts.map((column, index) => {
                        
                        if (!(column?.customised)) {
                          return (
                            <td key={index} style={{ "textAlign": column?.textAlign , position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            {column.isTotalReq ? column.isCurrency ? <CurrencyDisplay value={calculateTotalDownload(column.accessor)} /> : (calculateTotalDownload(column.accessor)) : ''}
                          </td>
                          );
                        }
                        if (column?.customised ) {
                          return (
                            <td key={index} style={{ "textAlign": column?.textAlign , position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            {column.isTotalReq ? column.isCurrency ? <CurrencyDisplay value={calculateTotalDownload(column.accessor)} /> : (calculateTotalDownload(column.accessor)) : ''}
                          </td>
                          );
                        }
                        })}

                    </tr>
                  </tfoot>

                </table>
              </div>
            </Row>
            }
            <AddedProductForm
              isOpen={isModalOpen} 
              toggle={toggleModal} 
              onSave={handleSave} 
              totalWeight={selectedItem.issue_weight}
              initialItemDetails={selectedItem?.item_details}
              selectedItem = {selectedItem}
              isDisabled={false}
            />

          </div>
          </FormProvider>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default MetalProcessIssueRecipt;
