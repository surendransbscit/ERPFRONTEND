import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import CurrencyDisplay from '../../../components/common/moneyFormat/moneyFormat';
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
import { ActiveEmployeeDropdown, BranchDropdown, LotDropdown } from "../../../components/filters/retailFilters";
import { useBranches,useAllLot, useEmployeeDropdown } from "../../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { NumberInputField, TextInputField } from "../../../components/form-control/InputGroup";
import { createLotNonTagInwardForm, getLotNonStockList } from "../../../redux/thunks/inventory";
import { employee_id } from "../../../redux/configs";


const NonTagIsssue = () => {
  const location = useLocation();
  const {
    register,
    formState: { errors },
    clearErrors,
    reset,
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const {
    isLoading: issubmitting,
    nonTagLotStock
  } = useSelector((state) => state.lotReducer);
  const { branches } = useBranches();
  const { lot } = useAllLot();
  const { employees } = useEmployeeDropdown();
  const [branch, setBranch] = useState();
  const [stockList, setStockList] = useState([]);
  const [Type, setType] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [employee, setEmployee] = useState();
  const [remarks, setRemarks] = useState();
  const [lotId, setLotId] = useState();
  
  const { userInfo: { settings } } = useSelector((state) => state.authUserReducer);


  useEffect(()=>{
   if(nonTagLotStock != null){
    // let lotItem = lotItemList[0];
    // const tagDetails = stockList?.filter((result) => result.id_lot_inward_detail === lotItem.id_lot_inward_detail);
    // if(tagDetails.length === 0){
    //   let updatedData =  [...stockList,lotItem];
    //   console.log(updatedData,"updatedData");
    // //  updatedData.push(lotItemList);
    //   setStockList(updatedData);
    //   setLotCode("");
    // }else{
    //   toastfunc("Already Added !!");
    // }
    setStockList(nonTagLotStock.item_details);
   
   }

  },[nonTagLotStock])

  useEffect(() => {
    if (employee_id !== undefined) {
      setEmployee(employee_id)
    }
  }, [employee_id])

    useEffect(() => {
      if (lotId) {
        getStockDetails();
      }
    }, [lotId]);
  const getStockDetails = () => {
    let filter = ''
    if (branch) {
      const filters = {
        "lot_id": lotId,
        "branch": branch,
      }
      if (!lotId){
        toastfunc("Lot Required !!");
        return;
      }

      filter = `lot_id=${lotId}`
      dispatch(getLotNonStockList(filter));
    } else if (!branch) {
      toastfunc("Branch Required !!");
    }
    


  }
  const form_submit = async (data, actionType) => {
      let assignData = []
      console.log(assignData);
      stockList?.map((item, rowIndex) => {
        if (item.isChecked && parseFloat(item.gross_wt) > 0) {
          assignData.push({
            ...item
          })
        }
      })
      if(!employee){
        toastfunc("Select a Employee !!");
      }
      if (assignData.length) {
  
        let data = {
          "id_branch": branch,
          "type":Type,
          "issue_employee":employee,
          "issue_details": assignData,
          "issue_remarks":remarks,
        }
        createStockApproval(data);
      } else {
        toastfunc("Select Stock to approval")
      }
  };

  const createStockApproval = async (data) => {
    try {
      let response = await dispatch(createLotNonTagInwardForm(data)).unwrap();
      console.log(response)
      reset_form();
    } catch (error) {
      let message = error?.response?.data?.message;
      toastfunc(message);
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
    
  };


  const columns = [
    { header: "Lot Code", accessor: "lot_code", textAlign: "center" },
    { header: "Product", accessor: "product_name", textAlign: "center", customised: true },
    { header: "Pcs", accessor: "pieces", textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "gross_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Lwt", accessor: "less_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Nwt", accessor: "net_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    // { header: "Dia Wt", accessor: "dia_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    // { header: "Stone Wt", accessor: "stn_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },

  ];

  const setTagCode = (value, index) => {

    handelChange(index, 'tag_code', value);

  }
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

             



              <SaveButton disabled={issubmitting} color="secondary" size="md"
                onClick={() => getStockDetails()}  >
                Search
              </SaveButton>

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
                    Lot No
                    <IsRequired />
                  </label>
                  <LotDropdown
                        register={register}
                        id={"lotId"}
                        lot={lot}
                        selectedLot={lotId}
                        onLotChange={(value) => {
                          setLotId(value);
                        }}
                        isRequired={false}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.lotId && "Lot is Required"}
                      />
                </div>
              </Col>


              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                   Issue To
                    <IsRequired />
                  </label>
                  <ActiveEmployeeDropdown
                    register={register}
                    id={"employeeId"}
                    options={employees}
                    selectedEmployee={employee}
                    onEmployeeChange={(value) => {
                        setEmployee(value);
                    }}
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.employeeId && "Employee is Required"}
                />
                </div>
              </Col>

              <Col lg="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Remarks
                  </label>
                  <div className="form-control-wrap">
                      <textarea
                        {...register("remarks")}
                        id="remarks"
                        // style={{ minHeight: "5vw" }}
                        rows="3"
                        className="form-control form-control-sm"
                        value={remarks}
                        defaultValue={remarks || ""}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </div>
                </div>
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
                          if (column?.accessor == 'gross_wt') {
                              return (
                                <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                                 
                                      <NumberInputField
                                        register={register}
                                        isRequired={false}
                                        id={"gross_wt_" + rowIndex}
                                        placeholder="Gross Wt"
                                        handleKeyDownEvents={true}
                                        handleDecimalDigits={true}
                                        value={item.gross_wt}
                                        setValue={setValue}
                                        SetValue={(value) => {
                                          if(parseFloat(value) <= parseFloat(item.lot_gross_wt)){
                                            handelChange(rowIndex, 'gross_wt', value);
                                            clearErrors("gross_wt_" + rowIndex);
                                            setValue("gross_wt_" + rowIndex,value);
                                            handelChange(rowIndex, 'net_wt', value);


                                          }else{
                                            toastfunc(" Invaild Gross Weight !!");
                                            handelChange(rowIndex, 'gross_wt', item.lot_gross_wt);
                                            clearErrors("gross_wt_" + rowIndex);
                                            setValue("gross_wt_" + rowIndex,item.lot_gross_wt);

                                          }

                                        }}
                                        decimalValues = {3}
                                      />
                                   
                                </td>
                              );
                            }
                          else if (column?.accessor == 'pieces') {
                              return (
                                <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                                 
                                      <NumberInputField
                                        register={register}
                                        isRequired={false}
                                        id={"pieces_" + rowIndex}
                                        placeholder="Pieces"
                                        handleKeyDownEvents={true}
                                        handleDecimalDigits={false}
                                        value={item.pieces}
                                        setValue={setValue}
                                        SetValue={(value) => {
                                          if(parseFloat(value) <= parseFloat(item.lot_pieces)){
                                            handelChange(rowIndex, 'pieces', value);
                                            clearErrors("pieces_" + rowIndex);
                                            setValue("pieces_" + rowIndex,value);

                                          }else if(parseFloat(value) == 0){
                                            handelChange(rowIndex, 'pieces', value);
                                            clearErrors("pieces_" + rowIndex);
                                            setValue("pieces_" + rowIndex,value);

                                          }else{
                                            toastfunc("Invaild Pieces !!");
                                            handelChange(rowIndex, 'pieces', item.lot_pieces);
                                            clearErrors("pieces_" + rowIndex);
                                            setValue("pieces_" + rowIndex,item.lot_pieces);

                                          }

                                        }}
                                        decimalValues = {0}
                                      />
                                   
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

export default NonTagIsssue;
