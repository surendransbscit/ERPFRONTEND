import React, { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Label } from "reactstrap";
import IsRequired from "../../components/erp-required/erp-required";
import { BranchDropdown,SelectDropdown,MetalDropdown,ProductDropdown,DesignDropdown,SubDesignDropdown,SectionDropdown,PurityDropdown } from "../../components/filters/retailFilters";
import { useBranches,useMetals,useProducts,useProductSections,useDesigns,useSubDesigns,usePurities } from "../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { TextInputField } from "../../components/form-control/InputGroup";
import { getStockDetails,updatePendingTransfer } from "../../redux/thunks/purchase";
import { DateRangePickerInput } from "../../components/filters/dateRangeFilter";
import { format, subDays } from "date-fns";
import { getPagePermission } from "../../redux/thunks/coreComponent";

const PendingTransfer = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading: issubmitting,
    stockDetailsList,
  } = useSelector((state) => state.purchaseReducer);
  const { branches } = useBranches();
  const { metals } = useMetals();
  const { products } = useProducts();
  const { designs } = useDesigns();
  const { subDesigns } = useSubDesigns();
  const { sections } = useProductSections();
  const { purities } = usePurities();


  const oldMetalcolumns = [
    { header: "Invoice", accessor: "invoice_no", textAlign: "left"},
    { header: "Customer", accessor: "customer_name", textAlign: "left"},
    { header: "Mobile", accessor: "customer_mobile", textAlign: "left"},

    { header: "Purchased Product", accessor: "product_name", textAlign: "left"},
    { header: "Stock Type", accessor: "stock_type_name", textAlign: "left"},
    { header: "Touch", accessor: "touch", textAlign: "right"},
    //{ header: "Purity", accessor: "purity", textAlign: "left",},
    // { header: "Product", accessor: "product", textAlign: "left",},
    { header: "Design", accessor: "design", textAlign: "left",customised:true},
    { header: "Sub Design", accessor: "sub_design", textAlign: "left",customised:true},
   // { header: "Section", accessor: "section", textAlign: "left",customised:true},
    { header: "Pieces", accessor: "pieces", textAlign: "right",isTotalReq: true  },
    { header: "G.wt", accessor: "gross_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "N.Wt", accessor: "net_wt", decimal_places: 3, textAlign: "right", isTotalReq: true  },
    { header: "L.wt", accessor: "less_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Dia Wt", accessor: "dia_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Stone Wt", accessor: "stone_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },

  ];

  const initialColumns = [
    { header: "Invoice", accessor: "invoice_no", textAlign: "left"},
    { header: "Customer", accessor: "customer_name", textAlign: "left"},
    { header: "Mobile", accessor: "customer_mobile", textAlign: "left"},
    { header: "Product Name", accessor: "product_name", textAlign: "left"},
    { header: "Pieces", accessor: "pieces", textAlign: "right",isTotalReq: true  },
    { header: "G.wt", accessor: "gross_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "N.Wt", accessor: "net_wt", decimal_places: 3, textAlign: "right", isTotalReq: true  },
    { header: "L.wt", accessor: "less_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Dia Wt", accessor: "dia_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Stone Wt", accessor: "stone_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },

  ];

  const [assignStockList, setAssignStockList] = useState([]);
  const [filterFromBranch, setFilterFromBranch] = useState();
  const [filterMetal, setFilterMetal] = useState();
  const [selectAll, setSelectAll] = useState(false);
  const [stockType, setStockType] = useState();
  const [assignProcess, setAssignProcess] = useState(1);
  const [columns, setColumns] = useState(initialColumns);
  const [assignPurity, setAssignPurity] = useState();



  const [selectedDates, setSelectedDates] = useState({
    startDate: subDays(new Date(), 6),
    endDate: new Date(),
  });

  const stockTypeOption = [
     { value: "1", label: 'Sales Return' },
     { value: "2", label: 'Partly Sale' },
      { value: "3", label: 'Old Metal' },
    //  { value: "4", label: 'Tagged Item' },
  ]
  const assignProcessOption = [
    { value: "1", label: 'Melting' },
    { value: "2", label: 'Lot Generate' },
    { value: "3", label: 'Non Tag' },
    // { value: "4", label: 'Metal Issue' },
 ]


  const { userInfo: { settings } } = useSelector((state) => state.authUserReducer);

  useEffect(() => {

      setAssignStockList(stockDetailsList);
     
  }, [stockDetailsList]);


  useEffect(() => {

    if(stockType=='3' && (assignProcess == "2" || assignProcess == "3") ){
      if(settings?.is_sub_design_req == 0){
        const updatedOldMetalColumns = oldMetalcolumns.filter(column => column.accessor !== 'sub_design');
        setColumns(updatedOldMetalColumns);
      }else{
        setColumns(oldMetalcolumns);

      }
    }else{
      setColumns(initialColumns);
    }
   
}, [stockType,assignProcess]);

const setStoneDetails = (data) => {
  let stone_details = [];
  if (data.length > 0) {
      console.log(data);
      stone_details = data.map(item => ({
          "id_stone": item.id_stone,
          "uom_id": item.uom_id,
          "stone_pcs": parseFloat(item.stone_pcs).toFixed(0),
          "stone_wt": item.stone_wt,
          "stone_type": item.stone_type,
          "pur_stn_cal_type": item.stone_calc_type,
          "pur_st_rate": parseFloat(item.stone_rate).toFixed(2),
          "pur_stn_cost": parseFloat(item.stone_amount).toFixed(2),
          "show_in_lwt": item.show_in_lwt,
          "id_quality_code": item.id_quality_code
      }));
  }
  return stone_details;
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
      rate_per_gram:item.ratePerGram,
      purchase_other_metal:item.id_purchase_other_metal,
    }));
  }
  return other_metal_details;
};

  const form_submit = async (data, actionType) => {
    let assignData = []
    console.log(assignData);
    assignStockList?.map((item, rowIndex) => {
      if (item.isChecked) {
        if(stockType == '3'){
          assignData.push({...item,'id_purity': assignPurity,'stone_details':setStoneDetails(item['stone_details'])})

        }else{
          assignData.push({...item,'stone_details':setStoneDetails(item['stone_details'])})

        }
      }
    })
    if (assignData.length && filterFromBranch && stockType && assignProcess) {
      const data = {
        "id_branch": filterFromBranch,
        "stock_details": assignData,
        "stock_type": stockType,
        "process_type": assignProcess,
      }
      createPendingTransfer(data);
    }else if(!filterFromBranch){

      toastfunc("Select Branch !!")

    }else if(!stockType){

      toastfunc("Select Stock Type !!")

    }else if(!assignProcess){

      toastfunc("Select Assign Process !!")

    }
     else {
      toastfunc("Select Stock to approval")
    }

  };

  const createPendingTransfer = async (data) => {
    try {
      let response = await dispatch(updatePendingTransfer(data)).unwrap();
      console.log(response)
      reset_form();
     // navigate(`${process.env.PUBLIC_URL}/purchase/pending_transfer/list`)

    } catch (error) {
      let message = error?.response?.data?.message;
      toastfunc(message);
    }
  };

  const calculateTotal = (field) => {
    return assignStockList?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const handleDelete = (index) => {
    const updatedFormData = [...assignStockList];
    updatedFormData.splice(index, 1);
    setAssignStockList(updatedFormData);
  };

  const getStockDetail = () => {
    if (filterFromBranch && stockType) {
      const filters = {
        "stock_type": stockType,
        "id_branch": filterFromBranch,
        "id_metal": filterMetal,
        "from_date": format(selectedDates.startDate, "yyyy-MM-dd"),
        "to_date": format(selectedDates.endDate, "yyyy-MM-dd"),
      }
      console.log(stockType)

      dispatch(getStockDetails(filters));
    } else if (!filterFromBranch) {
      toastfunc("Branch Required !!")
    }
    else if (!stockType) {
      toastfunc("Stock Type Required !!")
    }
    

  }

  const selectAllCol = (value) => {
    assignStockList?.map((item, rowIndex) => {
      handelChange(rowIndex, 'isChecked', value)
    })

  }

  const handelChange = (index, field, value) => {
    setAssignStockList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
    console.log(assignStockList)
  };

  const reset_form = async () => {
    reset("");
    setAssignStockList([]);
    setStockType();
    setAssignProcess();
    setAssignPurity();
    setFilterFromBranch();
    setFilterMetal();
    setColumns(initialColumns);
    setSelectAll(false);
    setSelectedDates({
      startDate: subDays(new Date(), 6),
      endDate: new Date(),
    })
  };



  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

const pathName = location?.pathname;
const { pagePermission } = useSelector((state) => state.coreCompReducer);

useEffect(() => {
  dispatch(getPagePermission({ path: pathName }));
}, [pathName, dispatch]);

useEffect(() => {
  if (
    pagePermission?.view === false ||
    pagePermission === undefined ||
    pagePermission === null
  ) {
    navigate(`${process.env.PUBLIC_URL}/`);
  }
}, [pagePermission, navigate]);




  return (
    <React.Fragment>
      <Head title="Approval" />
      <Content>
        <PreviewCard className="h-100">

          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb/>
            </Col>
            
            <Col md={7} className="text-right flex">


           
                    
                <SaveButton disabled={issubmitting} color="secondary" size="md"
                    onClick={() => getStockDetail()}  >
                    Search
                </SaveButton>
             
              <SaveButton
              disabled={issubmitting || !pagePermission?.add}
              size="md"
              color="primary"
              onClick={handleSubmit((data) => {
                form_submit(data, "saveAndNew")
              }

              )}
            >
              {issubmitting ? "Saving" : "Save"}
            </SaveButton>
              
              <SaveButton
             
              size="md"
              color="warning"
              onClick={() => navigate(`${process.env.PUBLIC_URL}/oldmetal_process/pocket/list`)}
            >
              Close
            </SaveButton>

            

            </Col>
          </Row>


          <div className="custom-grid">
            <Row className="g-3 align-center form-control-sm">
            <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Filter Date
                  </label>
                  <DateRangePickerInput
                    startDate={selectedDates.startDate}
                    endDate={selectedDates.endDate}
                    onChange={handleDateChange}
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
                    id={"filterFromBranch"}
                    branches={branches}
                    selectedBranch={filterFromBranch}
                    onBranchChange={(value) => {
                      setFilterFromBranch(value);
                      setAssignStockList([]);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.filterFromBranch && "Branch is Required"}
                  />
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Type
                    <IsRequired />
                  </label>
                  <SelectDropdown
                    register={register}
                    id={"stockType"}
                    data={stockTypeOption}
                    isRequired={true}
                    selectedValue={stockType}
                    setValue={setValue}
                    clearErrors ={clearErrors}
                    onChangeEvent={(value) => {
                      setStockType(value);
                      setAssignStockList([]);
                    }}
                    placeholder={'Stock Type'}
                    valueField = {'value'}
                    labelField = {'label'}
                  />
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Metal
                    <IsRequired />
                  </label>
                  <MetalDropdown
                    register={register}
                    id={"filterMetal"}
                    metals={metals}
                    selectedMetal={filterMetal}
                    onMetalChange={(value) => {
                      setFilterMetal(value);
                    }}
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.filterMetal && "Metal is Required"}
                  />
                </div>
              </Col>





              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Assign Process
                    <IsRequired />
                  </label>
                  <SelectDropdown
                    register={register}
                    id={"assignProcess"}
                    data={assignProcessOption}
                    selectedValue={assignProcess}
                    setValue={setValue}
                    clearErrors ={clearErrors}
                    onChangeEvent={(value) => {
                      setAssignProcess(value);
                    }}
                    placeholder={'Assign Process'}
                    valueField = {'value'}
                    labelField = {'label'}
                  />
                </div>
              </Col>
              { ( assignProcess == 2 && stockType == '3' ) && (
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Assign Purity
                    <IsRequired />
                  </label>
                  <PurityDropdown
                      register={register}
                      id={"assignPurity"}
                      purities={purities}
                      onPurityChange={(value) => {
                          setAssignPurity(value)
                      }}
                      selectedPurity={assignPurity}
                      isRequired= {true}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      message={errors.assignPurity && "Purity is Required"}
                  />
                </div>
              </Col>
              )}
              
            </Row>


            <Row className="mt-2" md={12}> 
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>S.NO  <input disabled={!pagePermission?.add} type="checkbox" onChange={(event) => {
                        selectAllCol(event.target.checked);
                        setSelectAll(event.target.checked);
                      }} checked={selectAll} /> </th>
                      {columns.map((column, index) => {
                        
                            return  (
                              <th key={index} style={{ "textAlign": column?.textAlign ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }} >
                                {column.header}</th>
                            )
                       

                      })}
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Action</th>

                    </tr>
                  </thead>
                  <tbody>
                    {assignStockList?.length > 0 && assignStockList?.map((item, rowIndex) => (
                      <tr key={rowIndex} >
                        <td>{rowIndex + 1} <input disabled={!pagePermission?.add} type="checkbox" onChange={(event) => { handelChange(rowIndex, 'isChecked', event.target.checked); }} checked={item.isChecked} /> </td>
                        {columns?.map((column, colIndex) => {
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
                          }else{
                            if(column.accessor == 'product' && (item?.stock_type == '1' || assignProcess == 3) ){
                                 return ( <td>
                                  <div className="form-control-sm" style={{ width: "150px" }}>
                                  <ProductDropdown
                                      register={register}
                                      id={"selectedProduct" + rowIndex}
                                      products={products}
                                      selectedProduct={item['id_product']}
                                      onProductChange={(value) => {
                                        handelChange(rowIndex,'id_product', value);
                                        handelChange(rowIndex, 'id_design', '');
                                        handelChange(rowIndex, 'id_sub_design', '')
                                      }}
                                      isRequired={item.isChecked}
                                      clearErrors={clearErrors}
                                      setValue={setValue}
                                      message={errors["selectedProduct" + rowIndex] && "Product is Required"}
                                
                                    /> </div> </td>)
                            }else if(column.accessor == 'design' && (item?.stock_type == '1' || assignProcess == 3) ){
                              return ( <td>
                                <div className="form-control-sm" style={{ width: "150px" }}>
                                    <DesignDropdown
                                        register={register}
                                        id={"updateDesign_" + rowIndex}
                                        isRequired={item.isChecked}
                                        designs={designs}
                                        selectedProduct={item.id_product}
                                        selectedDesign={item.id_design}
                                        onDesignChange={(value) => {
                                          handelChange(rowIndex,'id_design', value);
                                          handelChange(rowIndex, 'id_sub_design', '')

                                        }}
                                        clearErrors={clearErrors}
                                        setValue={setValue}
                                        message={errors["updateDesign_" + rowIndex] && "Design is Required"}
                                    /> </div> </td>)
                            }else if(column.accessor == 'sub_design' && (item?.stock_type == '1' || assignProcess == 3)){
                              return (
                                <td>
                                  <div className="form-control-sm" style={{ width: "150px" }}>
                                      <SubDesignDropdown
                                          register={register}
                                          id={"updateSubDesign_" + rowIndex}
                                          subDesigns={subDesigns}
                                          selectedProduct={item.id_product}
                                          selectedDesign={item.id_design}
                                          selectedSubDesign={item.id_sub_design}
                                          onSubDesignChange={(value) => {
                                              handelChange(rowIndex, 'id_sub_design', value);
                                          }}
                                          isRequired={item.isChecked}
                                          clearErrors={clearErrors}
                                          setValue={setValue}
                                          message={errors["updateSubDesign_" + rowIndex] && "Sub Design is Required"}
                                      /></div>
                                      
                                      </td>
                              )
                            
                            }else if(column.accessor == 'purity' && (item?.stock_type == '1' || assignProcess == 3) ){
                              return (
                                <td>
                                  <div className="form-control-sm" style={{ width: "150px" }}>
                                      <PurityDropdown
                                          register={register}
                                          id={"updatePurity_" + rowIndex}
                                          purities={purities}
                                          onPurityChange={(value) => {
                                              handelChange(rowIndex, 'id_purity', value);
                                          }}
                                          selectedPurity={item.id_purity}
                                          isRequired={item.isChecked}
                                          clearErrors={clearErrors}
                                          setValue={setValue}
                                          message={errors["updatePurity_" + rowIndex] && "Purity is Required"}
                                      /></div> </td>
                              )
                            }else{
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
                      {columns.map((column, index) => {

                      
                       return( <td key={index} style={{ "textAlign": column?.textAlign ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                        {column.isTotalReq ? column.isCurrency ? <CurrencyDisplay value={calculateTotal(column.accessor)} /> : (calculateTotal(column.accessor)) : ''}
                      </td>)
                      




                      }

                      )}

                    </tr>
                  </tfoot>

                </table>
              </div>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default PendingTransfer;
