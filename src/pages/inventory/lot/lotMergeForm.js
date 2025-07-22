import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import CurrencyDisplay from '../../../components/common/moneyFormat/moneyFormat';
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import {
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import {
  Col,
  Row,
  Icon,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Label } from "reactstrap";
import IsRequired from "../../../components/erp-required/erp-required";
import { ActiveEmployeeDropdown, BranchDropdown, DesignDropdown, LotDropdown, ProductDropdown, PurityDropdown, SupplierDropdown } from "../../../components/filters/retailFilters";
import { useBranches,useAllLot, useEmployeeDropdown, useProducts, useDesigns, useSupplierFilter, usePurities, useCategories } from "../../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { NumberInputField, TextInputField } from "../../../components/form-control/InputGroup";
import { createLotIssueReceiptForm, createLotMerge, getLotBalanceStockList, getLotStockList } from "../../../redux/thunks/inventory";
import { employee_id } from "../../../redux/configs";


const LotMergeForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
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
    lotItemList
  } = useSelector((state) => state.lotReducer);
  const { branches } = useBranches();
  const { products } = useProducts();
  const { designs } = useDesigns();
  const { supplier } = useSupplierFilter();
  const { categories } = useCategories();
  const { purities } = usePurities();
  const { lot } = useAllLot();
  const { employees } = useEmployeeDropdown();
  const [branch, setBranch] = useState();
  const [selectedPurity , setSelectedPurity] = useState();
  const [selectedProduct , setSelectedProduct] = useState();
  const [selectedDesign , setSelectedDesign] = useState();
  const [selectedCategory , setSelectedCategory] = useState();
  const [idSupplier , setIdSupplier] = useState();
  const [stockList, setStockList] = useState([]);
  const [filterCode, setFilterCode] = useState();
  const [Type, setType] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [lotCode, setLotCode] = useState();
  const [employee, setEmployee] = useState();
  const [noOfPcs, setNoOfPcs] = useState("");
  
  const { userInfo: { settings } } = useSelector((state) => state.authUserReducer);


  useEffect(()=>{
   if(lotItemList.length > 0){
    let lotItem = lotItemList[0];

    const tagDetails = stockList?.filter((result) => result.id_lot_inward_detail === lotItem.id_lot_inward_detail);
    if(tagDetails.length === 0){
      let updatedData =  [...stockList,lotItem];
      console.log(updatedData,"updatedData");
    //  updatedData.push(lotItemList);
      setStockList(updatedData);
      setLotCode("");
    }else{
      toastfunc("Already Added !!");
    }
   
   }

  },[lotItemList])

  useEffect(() => {
    if (employee_id !== undefined) {
      setEmployee(employee_id)
    }
  }, [employee_id])

    // useEffect(() => {
    //   if (lotCode && lotCode.length > 5) {
    //     getStockDetails();
    //   }
    // }, [lotCode]);
 
 const getStockDetails = async () => {
    let filter = ''
    if (branch) {
      const filters = {
        "lot_id": lotCode,
      }
      try {
          let response = await dispatch(getLotBalanceStockList(filters)).unwrap();
          let lotItem = response?.data[0]
          const tagDetails = stockList?.filter((result) => result.id_lot_inward_detail === lotItem.id_lot_inward_detail);
          if(tagDetails.length === 0){
          let updatedData =  [...stockList,lotItem];
          console.log(updatedData,"updatedData");
          //  updatedData.push(lotItemList);
          setStockList(updatedData);
          setLotCode("");
          }

          // setStockList(response?.data);
      }
      catch (error) {
        console.error(error);
        }
      
    } else if (!branch) {
      toastfunc("Branch Required !!");
    }
    

  }
  const form_submit = async (data, actionType) => {
      if(idSupplier=='' || idSupplier==null){
          toastfunc("Please select the Supplier");
      }
      else if(selectedProduct=='' || selectedProduct==null){
          toastfunc("Please select the Product");
      }
      else if(selectedPurity=='' || selectedPurity==null){
          toastfunc("Please select the Purity");
      }
      else if(noOfPcs==''){
          toastfunc("Please Enter the Pcs");
      }
      else if(selectedDesign=='' || selectedDesign==null){
          toastfunc("Please select the Design");
      }
      else{
          let mergeData = []
          stockList?.map((item, rowIndex) => {
            if (item.isChecked && parseInt(item?.merge_pcs) > 0 && parseFloat(item?.merge_gwt) > 0) {
              mergeData.push({
                ...item
              })
            }
          })
          if (mergeData.length) {
      
            let data = {
              "id_branch": branch,
              "id_supplier" : idSupplier,
              "id_product":selectedProduct,
              "id_design":selectedDesign,
              "merge_details": mergeData,
              "noOfPcs" : noOfPcs,
            }
            generateLotMerge(data);
          } else {
            toastfunc(" Select the item")
          }
      }
      
  };

  const generateLotMerge = async (data) => {
    try {
      let response = await dispatch(createLotMerge(data)).unwrap();
      console.log(response)
      reset_form();
      downloadPDF(response.pdf_path, response.lot_no);
      
    } catch (error) {
      let message = error?.response?.message;
      toastfunc(message);
    }
    
  };

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

  const calculateTotal = (field) => {
    return stockList?.list?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };



  const handleDelete = (index) => {
    const updatedFormData = [...stockList];
    updatedFormData.splice(index, 1);
    setStockList(updatedFormData);
  };

  const selectAllCol = (value) => {
    stockList?.map((item, rowIndex) => {
      handelChange(rowIndex, 'isChecked', value)
    })

  }

  const handelChange = (index, field, value) => {
    setStockList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

  const reset_form = async () => {
    reset("");
    setStockList([]);
    setBranch();
    setLotCode("");
    setSelectedProduct("");
    setSelectedDesign("");
    setSelectedPurity("");
    setIdSupplier("");
    setNoOfPcs("");
  };


  const columns = [
    { header: "Lot Code", accessor: "lot_code", textAlign: "center" },
    { header: "Product", accessor: "product_name", textAlign: "center", customised: true },
    { header: "Design", accessor: "design_name", textAlign: "center", customised: true },
    { header: "Pcs", accessor: "blc_pcs", textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "blc_gwt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    // { header: "Dia Wt", accessor: "dia_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    // { header: "Stone Wt", accessor: "stn_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },

  ];

  const setTagCode = (value, index) => {

    handelChange(index, 'tag_code', value);

  }

  useEffect(()=>{
      let product = products.find((val) => val.pro_id === selectedProduct);
      setSelectedCategory(product?.cat_id);
  },[selectedProduct])





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
              <ModifiedBreadcrumb></ModifiedBreadcrumb>
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">

             

            <Button
                  color="primary"
                  size="md"
                  disabled={issubmitting}
                  onClick={()=>{
                    form_submit()
                  }}
                >
                Save[crtl+s]
                </Button>

             

            </Col>
          </Row>


          <div className="custom-grid">
            <Row className="g-3 align-center form-control-sm">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Branch
                    <IsRequired />
                  </label>
                  <BranchDropdown
                    register={register}
                    id={"filterBranch"}
                    branches={branches}
                    selectedBranch={branch}
                    onBranchChange={(value) => {
                      setBranch(value);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.filterBranch && "Branch is Required"}
                  />
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Lot Code
                    <IsRequired />
                  </label>
                  <TextInputField
                      register={register}
                      placeholder="Code"
                      id={"lotCode"}
                      value={lotCode}
                      isRequired={false}
                      type={"text"}
                      setValue={setValue}
                      SetValue={(value) => {
                        setLotCode(value.trimStart());
                        clearErrors("lotCode");
                      }}
                      message={errors.lotCode && errors.lotCode.message}
                    />
                </div>
              </Col>
              <Col lg ="2" style={{marginTop : "10px;"}}>
                      <br></br>
                      <SaveButton disabled={issubmitting} color="secondary" size="md"
                        onClick={() => getStockDetails()}  >
                        Search
                    </SaveButton>
              </Col>
              <Col md={6}>
                      <Row>
                          <Col md={3}>
                  <Label>Select Supplier<IsRequired /></Label>
                  <SupplierDropdown
                      register={register}
                      id={"idSupplier"}
                      supplier={supplier}
                      isRequired={true}
                      selectedSupplier={idSupplier}
                      onSupplierChange={setIdSupplier}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      message={errors.idSupplier && "Supplier is Required"}
                      tabIndex={2}
                  ></SupplierDropdown>
                          </Col>
                          <Col lg="3">
                                  <Label>Select Purity<IsRequired /></Label>
                                  <PurityDropdown
                                    register={register}
                                    id={"selectedPurity"}
                                    purities={purities}
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    onPurityChange={(value) => {
                                        setSelectedPurity(value);
                                    }}
                                    selectedPurity={selectedPurity}
                                    isRequired={true}
                                    clearErrors={clearErrors}
                                    setValue={setValue}
                                    message={errors.selectedPurity && "Purity is Required"}
                                    tabIndex={4}
                                ></PurityDropdown>
                          </Col>
                          <Col lg="3">          
                                <Label>Select Product<IsRequired /></Label>           
                                <ProductDropdown
                                    register={register}
                                    id={"selectedProduct"}
                                    products={products}
                                    selectedProduct={selectedProduct}
                                    onProductChange={(value) => {
                                        setSelectedProduct(value);
                                        setSelectedDesign("");
                                    }}
                                    isRequired={true}
                                    clearErrors={clearErrors}
                                    setValue={setValue}
                                    message={errors.selectedProduct && "Product is Required"}
                                    tabIndex={5}
                                ></ProductDropdown>
                          </Col>  
                          <Col md="3">
                            <Label>Select Design<IsRequired /></Label>          
                            <DesignDropdown
                                register={register}
                                id={"selectedDesign"}
                                designs={designs}
                                products={products}
                                selectedProduct={selectedProduct}
                                selectedDesign={selectedDesign}
                                onDesignChange={(value) => {
                                    setSelectedDesign(value);
                                }}
                                isRequired={false}
                                clearErrors={clearErrors}
                                setValue={setValue}
                                message={errors.selectedDesign && "Design is Required"}
                                tabIndex={6}
                            ></DesignDropdown>
                          </Col>  
                          <Col md="3">
                                <Label>Enter Pcs<IsRequired /></Label>        
                                <NumberInputField
                                  register={register}
                                  placeholder="Piece"
                                  id={"piece"}
                                  value={noOfPcs}
                                  isRequired={true}
                                  min={0}
                                  setValue={setValue}
                                  SetValue={(value) => {
                                      setNoOfPcs(value);
                                  }}
                                  handleKeyDownEvents={true}
                                  handleDot={true}
                                  minError={"Pieces Should greater than or equal to 0"}
                                  reqValueError={"Pieces is Required"}
                                  message={errors.piece && errors.piece.message}
                                  tabIndex={9}
                              ></NumberInputField>
                          </Col>
                      </Row>
              </Col>
             

            </Row>


            <Row className="mt-2" md={12}>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>S.NO  <input type="checkbox" onChange={(event) => {
                        selectAllCol(event.target.checked);
                        setSelectAll(event.target.checked);
                      }} checked={selectAll} /> </th>
                      {columns.map((column, index) => {
                       
                          return (
                            <th key={index} style={{ "textAlign": column?.textAlign }} >
                              {column.header}</th>
                          )

                      })}
                      <th>Action</th>

                    </tr>
                  </thead>
                  <tbody>
                    {stockList?.length > 0 && stockList?.map((item, rowIndex) => (
                      <tr key={rowIndex} >
                        <td>{rowIndex + 1} <input type="checkbox" onChange={(event) => { handelChange(rowIndex, 'isChecked', event.target.checked); }} checked={item.isChecked} /> </td>
                        {columns?.map((column, colIndex) => {
                          if (column?.accessor == 'blc_gwt') {
                              return (
                                <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                                 
                                      <NumberInputField
                                        register={register}
                                        isRequired={false}
                                        id={"gross_wt_" + rowIndex}
                                        placeholder="Gross Wt"
                                        handleKeyDownEvents={true}
                                        handleDecimalDigits={true}
                                        value={item.merge_gwt}
                                        setValue={setValue}
                                        SetValue={(value) => {
                                          if(parseFloat(value) <= parseFloat(item.blc_gwt)){
                                            handelChange(rowIndex, 'merge_gwt', value);
                                            clearErrors("gross_wt_" + rowIndex);
                                            setValue("gross_wt_" + rowIndex,value);
                                            handelChange(rowIndex, 'gross_wt', value);


                                          }else{
                                            toastfunc(" Invaild Gross Weight !!");
                                            handelChange(rowIndex, 'merge_gwt', item.blc_gwt);
                                            clearErrors("gross_wt_" + rowIndex);
                                            setValue("gross_wt_" + rowIndex,item.blc_gwt);

                                          }

                                        }}
                                        decimalValues = {3}
                                      />
                                      <span>Avail : {item.blc_gwt}</span>
                                </td>
                              );
                            }
                          else if (column?.accessor == 'blc_pcs') {
                              return (
                                <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                                 
                                      <NumberInputField
                                        register={register}
                                        isRequired={false}
                                        id={"pieces_" + rowIndex}
                                        placeholder="Pieces"
                                        handleKeyDownEvents={true}
                                        handleDecimalDigits={false}
                                        value={item.merge_pcs}
                                        setValue={setValue}
                                        SetValue={(value) => {
                                          if(parseFloat(value) <= parseFloat(item.blc_pcs)){
                                            handelChange(rowIndex, 'merge_pcs', value);
                                            clearErrors("pieces_" + rowIndex);
                                            setValue("pieces_" + rowIndex,value);

                                          }else{
                                            toastfunc(" Invaild Pieces !!");
                                            handelChange(rowIndex, 'merge_pcs', item.blc_pcs);
                                            clearErrors("pieces_" + rowIndex);
                                            setValue("pieces_" + rowIndex,item.blc_pcs);

                                          }

                                        }}
                                        decimalValues = {0}
                                      />
                                      <span>Avail : {item.blc_pcs}</span>
                                </td>
                              );
                            }
                          else{
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
                      <td>Total</td>
                      {columns.map((column, index) => {

                            return (<td key={index} style={{ "textAlign": column?.textAlign }}>
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

export default LotMergeForm;
