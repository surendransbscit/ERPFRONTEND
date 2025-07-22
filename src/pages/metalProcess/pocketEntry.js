import React, { useEffect, useState,useRef } from "react";
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
import { useForm,FormProvider } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Label } from "reactstrap";
import IsRequired from "../../components/erp-required/erp-required";
import { BranchDropdown, SelectDropdown, MetalDropdown,ProductDropdown } from "../../components/filters/retailFilters";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { TextInputField } from "../../components/form-control/InputGroup";
import { getStockDetails, createPocketEntry } from "../../redux/thunks/metalProcess";
import { DateRangePickerInput } from "../../components/filters/dateRangeFilter";
import { format, subDays } from "date-fns";
import { useBranches,useProducts,useMetals,useUom, useStone, useQualityCode } from "../../components/filters/filterHooks";
import {NumberInputField } from "../../components/form-control/InputGroup";
import { calculateNetWeight } from "../../components/common/calculations/ErpCalculations";
import LessWeightInputField from "../../components/form-control/LessWeight";

const PocketEntryForm = () => {
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
    setError
  } = useForm();
  
  // console.log(errors,"errors")
  const methods = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading: issubmitting,
    stockDetails,
  } = useSelector((state) => state.metalProcessReducer);
  const { branches } = useBranches();
  const { metals } = useMetals();
  const { products } = useProducts();
  const { uom } = useUom();
  const lessWeightRef = useRef();
  const { stone } = useStone();
  const { quality_code } = useQualityCode();

  const [assignStockList, setAssignStockList] = useState([]);
  const [filterFromBranch, setFilterFromBranch] = useState();
  const [selectAll, setSelectAll] = useState(false);
  const [stockType, setStockType] = useState();
  const [filterMetal, setFilterMetal] = useState();
  const [selectedDates, setSelectedDates] = useState({
    startDate: subDays(new Date(), 6),
    endDate: new Date(),
  });

  const stockTypeOption = [
     { value: "1", label: 'Sales Return' },
     { value: "2", label: 'Partly Sale' },
    { value: "3", label: 'Old Metal' },
    // { value: 4, label: 'Tagged Item' },
    { value: "7", label: 'Others' },
  ]

  const { userInfo: { settings } } = useSelector((state) => state.authUserReducer);

  useEffect(() => {

    setAssignStockList(stockDetails);

  }, [stockDetails]);
  const setStoneDetails = (data) =>{
    let stone_details = [];
    if(data.length>0){
      stone_details = data.map(item=>({
        "id_stone":item.id_stone,
        "uom_id":item.uom_id,
        "stone_pcs":item.piece,
        "stone_wt":item.weight,
        "stone_type":item.stone_type,
        "stone_calc_type":item.stone_calc_type,
        "stone_rate":item.stone_rate,
        "stone_amount":item.stone_amount,
        "show_in_lwt":item.show_in_lwt,
        "id_tag_stn_detail":item?.id_tag_stn_detail,
        "est_stn_id":item?.est_stn_id,
      }));
    }
    return stone_details;
 };

  const form_submit = async (data, actionType) => {
    let assignData = []
    console.log(assignData);
    assignStockList?.map((item, rowIndex) => {
      if (item.isChecked) {
        if(stockType == '7'){
          assignData.push({...item,'stone_details': setStoneDetails(item.stone_details)})
        }else{
          assignData.push(item)

        }
      }
    })
    if (assignData.length && filterFromBranch) {
      const data = {
        "id_branch": filterFromBranch,
        "item_details": assignData,

        "type": stockType,
      }
      createPocket(data);
    } else if (!filterFromBranch) {

      toastfunc(" Select Branch !!")

    }
    else {
      toastfunc(" Select Stock to approval")
    }

  };

  const createPocket = async (data) => {
    try {
      let response = await dispatch(createPocketEntry(data)).unwrap();
      console.log(response)
      reset_form();
      navigate(`${process.env.PUBLIC_URL}/oldmetal_process/pocket/list`)

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

  const calculateAverage = (field) => {
    if (!assignStockList || assignStockList.length === 0) return 0;
  
    // Calculate total and count of valid values
    const { total, count } = assignStockList.reduce(
      (acc, current) => {
        const value = parseFloat(current[field]);
        if (!isNaN(value)) {
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
    const column = columns.find((item) => item.accessor === field);
    const decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
  
    // Return average rounded to decimal_places
    return decimal_places !== null ? parseFloat(average).toFixed(decimal_places) : average;
  };

  const handleDelete = (index) => {
    const updatedFormData = [...assignStockList];
    updatedFormData.splice(index, 1);
    setAssignStockList(updatedFormData);
  };

  const getStockDetail = () => {
    if (filterFromBranch && stockType && filterMetal) {
      const filters = {
        "stock_type": stockType,
        "id_metal": filterMetal,
        "from_branch": filterFromBranch,
        "from_date": format(selectedDates.startDate, "yyyy-MM-dd"),
        "to_date": format(selectedDates.endDate, "yyyy-MM-dd"),
      }
      console.log(format(selectedDates.startDate, "yyyy-MM-dd"))

      dispatch(getStockDetails(filters));
    } else if (!filterFromBranch) {
      toastfunc("Branch Required !!")
    }
    else if (!stockType) {
      toastfunc(" Stock Type Required !!")
    }
    else if (!filterMetal) {
      toastfunc("Metal Required !!")
    }


  }

  const selectAllCol = (value) => {
    console.log(value);
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
    setFilterFromBranch();
  };


  const columns = [
    { header: "Product Name", accessor: "product_name", textAlign: "left" },
    { header: "Pieces", accessor: "pieces", textAlign: "right", isTotalReq: true },
    { header: "G.wt", accessor: "gross_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "N.Wt", accessor: "net_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "L.wt", accessor: "less_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Dia Wt", accessor: "dia_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Stone Wt", accessor: "stone_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Touch", accessor: "touch", decimal_places: 3, textAlign: "right",isAvgReq:true },
    { header: "Pure Wt", accessor: "pure_weight", decimal_places: 3, textAlign: "right", isTotalReq: true },

  ];

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };


  const setEmptyPocketEntry = () => {
    let data = {
      "customised": true,
      "type": "OTHERS",
      "product_name": "",
      "stock_type": "",
      "stock_type_name": "",
      "id_product": '',
      "id_design": "",
      "id_sub_design": "",
      "id_purity": "",
      "uom_id": '',
      "touch": "0.000",
      "pieces": '0',
      "gross_wt": "0.000",
      "less_wt": "0.000",
      "net_wt": 0,
      "dia_wt": "0.000",
      "stone_wt": "0.000",
      "other_metal_wt": 0,
      "stone_details": [],
      "other_metal_details": []
    }
    const updatedFormData = [...assignStockList, data];
    setAssignStockList(updatedFormData);
  };

  const handelReciptChange = (index, field, value) => {
    setAssignStockList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };


  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/oldmetal_process/pocket/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title="Pocket Entry" />
      <FormProvider {...methods}>
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



              <SaveButton
                disabled={issubmitting}
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
                color="danger"
                onClick={() => navigate(`${process.env.PUBLIC_URL}/oldmetal_process/pocket/list`)}
              >
                Cancel
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
                    selectedValue={stockType}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    onChangeEvent={(value) => {
                      setStockType(value);
                      setAssignStockList([]);
                      if (value == '7') {
                        setEmptyPocketEntry();
                      }
                    }}
                    placeholder={'Stock Type'}
                    valueField={'value'}
                    labelField={'label'}
                  />
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Metal
                    <IsRequired />
                  </label>
                  <MetalDropdown
                    register={register}
                    id={"stockType"}
                    metals={metals}
                    selectedMetal={filterMetal}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    onMetalChange={(value) => {
                      setFilterMetal(value);
                     
                      if (stockType != '7') {
                        setAssignStockList([]);
                      }
                    }}
                    placeholder={'Select Metal'}
                    valueField={'value'}
                    labelField={'label'}
                  />
                </div>
              </Col>

              <Col lg="2">
                <br></br>
                <SaveButton disabled={issubmitting} color="secondary" size="md"
                  onClick={() => getStockDetail()}  >
                  Search
                </SaveButton>
              </Col>


            </Row>


            <Row className="mt-2" md={12}>
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>S.NO  <input type="checkbox" onChange={(event) => {
                        selectAllCol(event.target.checked);
                        setSelectAll(event.target.checked);
                      }} checked={selectAll} /> </th>
                      {columns.map((column, index) => {

                        return (
                          <th key={index} style={{ "textAlign": column?.textAlign ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }} >
                            {column.header}</th>
                        )


                      })}
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Action</th>

                    </tr>
                  </thead>
                  <tbody>
                    {assignStockList?.length > 0 && assignStockList?.map((item, rowIndex) => {
                      if (item?.customised !== true) {
                        return (<tr key={rowIndex} >
                          <td>{rowIndex + 1} <input type="checkbox" onChange={(event) => { handelChange(rowIndex, 'isChecked', event.target.checked); }} checked={item.isChecked} /> </td>
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
                        </tr>);
                      } else {

                        return (<tr key={rowIndex} >
                          <td>{rowIndex + 1} <input type="checkbox" onChange={(event) => { handelChange(rowIndex, 'isChecked', event.target.checked); }} checked={item.isChecked} /> </td>
                          {columns?.map((column, colIndex) => {
                            if (column.accessor == 'product_name') {
                              return (
                                <td key={colIndex} style={{ textAlign: column?.textAlign, width: "20%" }}>
                                  <ProductDropdown
                                    register={register}
                                    id={"selectedProduct" + rowIndex}
                                    products={products}
                                    selectedProduct={item.id_product}
                                    onProductChange={(value) => {
                                      handelReciptChange(rowIndex, 'id_product', value)
                                      if(value){
                                        let pro = products.find((pro)=> pro.pro_id === value )
                                        handelReciptChange(rowIndex, 'id_metal', pro?.id_metal)

                                      }

                                    }}
                                    isRequired={item.isChecked}
                                    clearErrors={clearErrors}
                                    setValue={setValue}
                                    message={errors["selectedProduct" + rowIndex] && "Product is Required"}
                                  />
                                </td>
                              );
                            } else if (column.accessor == 'pieces') {
                              console.log((column?.setMax ? (column?.maxValue ? column.maxValue : item[column.maxValueAccessor]) : ''), item[column.maxValueAccessor])
                              return (
                                <td key={colIndex} style={{ textAlign: column?.textAlign, width: "20%" }}>
                                  <NumberInputField
                                    register={register}
                                    placeholder={column.header}
                                    id={column.accessor + rowIndex}
                                    value={item[column.accessor]}
                                    isRequired={item.isChecked}
                                    min={"0"}
                                    max={(column?.setMax ? (column?.maxValue ? column.maxValue : item[column.maxValueAccessor]) : '')}
                                    setValue={setValue}
                                    handleDot={true}
                                    handleKeyDownEvents={false}
                                    SetValue={(value) => {
                                      handelReciptChange(rowIndex, column.accessor, value);
                                      clearErrors(column.accessor + rowIndex);
                                    }}
                                    minError={column.header + " Should greater than or equal to 0"}
                                    maxError={column.header + " Should greater than or equal to "}
                                    reqValueError={column.header + " is Required"}
                                    message={errors[column.accessor + rowIndex] && errors[column.accessor + rowIndex].message}
                                  />
                                </td>
                              );
                            }
                            else if (column.accessor == 'gross_wt') {
                              console.log((column?.setMax ? (column?.maxValue ? column.maxValue : item[column.maxValueAccessor]) : ''))
                              return (
                                <td key={colIndex} style={{ textAlign: column?.textAlign, width: "20%" }}>
                                  <NumberInputField
                                    register={register}
                                    placeholder="Gross weight"
                                    id={"UpdateGwt_" + rowIndex}
                                    value={item.gross_wt}
                                    isRequired={true}
                                    min={0}
                                    max={(column?.setMax ? (column?.maxValue ? column.maxValue : item[column.maxValueAccessor]) : '')}
                                    type={"number"}
                                    setValue={setValue}
                                    handleKeyDownEvents={true}
                                    handleDecimalDigits={true}
                                    decimalValues={3}
                                    SetValue={(value) => {
                                      console.log((column?.setMax ? (column?.maxValue ? column.maxValue : item[column.maxValueAccessor]) : ''), column, column?.maxValue, column?.setMax, item[column.maxValueAccessor])

                                      let net_wt = calculateNetWeight({ 'gross_weight': value, 'less_weight': item.less_wt, 'other_metal_weight': 0 })

                                      if (net_wt > 0) {
                                        handelReciptChange(rowIndex, 'gross_wt', value);
                                        handelReciptChange(rowIndex, 'net_wt', net_wt)
                                        clearErrors("UpdateGwt_" + rowIndex);
                                      } else {

                                        setError("UpdateGwt_" + rowIndex, {
                                          type: "manual",
                                          message: "InValid Gross weight"
                                        });

                                        handelReciptChange(rowIndex, 'gross_wt', value);

                                      }

                                    }}
                                    minError={"Gross weight should less than or equal to 0"}
                                    maxError={"Gross Weight greater than or equal to 0"}
                                    reqValueError={"Gross weight is Required"}
                                    message={errors["UpdateGwt_" + rowIndex] && errors["UpdateGwt_" + rowIndex].message}
                                  />
                                </td>)
                            }
                            else if (column.accessor == 'less_wt') {
                              return (<td key={colIndex} style={{ textAlign: column?.textAlign, width: "20%" }}>
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
                                    handelReciptChange(rowIndex, 'less_wt', value)
                                    let net_wt = calculateNetWeight({ 'gross_weight': item.gross_wt, 'less_weight': value, 'other_metal_weight': 0 })
                                    handelReciptChange(rowIndex, 'net_wt', net_wt)
                                    clearErrors("UpdateLwt_" + rowIndex)
                                  }}
                                  SetStnWeight={(value) => handelReciptChange(rowIndex, 'stone_wt', value)}
                                  SetDiaWeight={(value) => handelReciptChange(rowIndex, 'dia_wt', value)}
                                  SetStoneDetails={(value) => {
                                      handelReciptChange(rowIndex, 'stone_details', value)
                                  }}
                                  stone_details={item.stone_details}
                                  ref={lessWeightRef}
                                  stone={stone}
                                  quality_code={quality_code}
                                  message={errors["UpdateLwt_" + rowIndex] && errors["UpdateLwt_" + rowIndex].message}
                                  isDisabled={false}
                                />
                              </td>)

                            }
                            else {
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
                              onClick={() => setEmptyPocketEntry() }
                            >
                              <Icon name="plus" />
                            </Button>
                            <Button
                              color="primary"
                              size="sm"
                              className="btn-icon btn-white btn-dim"
                              onClick={() => handleDelete()}
                            >
                              <Icon name="trash-fill" />
                            </Button>

                          </td>
                        </tr>);
                      }
                    })}
                  </tbody>

                  <tfoot>
                    <tr style={{ fontWeight: 'bold' }}>
                      <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Total</td>
                      {columns.map((column, index) => {
                        return (<td key={index} style={{ "textAlign": column?.textAlign, position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                          {column.isTotalReq ? column.isCurrency ? <CurrencyDisplay value={calculateTotal(column.accessor)} /> : (calculateTotal(column.accessor)) : (column?.isAvgReq ? calculateAverage(column.accessor) :'')}
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
      </FormProvider>
    </React.Fragment>
  );
};

export default PocketEntryForm;
