import React, { useState, useEffect, useRef } from "react";
import Head from "../../../layout/head/Head";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row, PreviewCard, SaveButton, Icon } from "../../../components/Component";
import { NumberInputField } from "../../../components/form-control/InputGroup";
import Content from "../../../layout/content/Content";
import "../../../assets/css/sales_form.css";
import { Button, Label } from "reactstrap";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import PreviewTable from "../../../components/sds-table/PreviewTable";
import CustomerAutoComplete from "../../../components/common/autoComplete/CustomerAutoComplete";
import IsRequired from "../../../components/erp-required/erp-required";
import { toastfunc, toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { isUndefined, calculateInclusiveTax, calculateExclusiveTax } from "../../../components/common/calculations/ErpCalculations";
import {
  useBranches,
  useSupplierFilter,
} from "../../../components/filters/filterHooks";
import {
  BranchDropdown,
  SupplierDropdown,
} from "../../../components/filters/retailFilters";

import PaymentModeComponent from "../../../components/common/payment/PaymentModeComponent";
import { getRepairOrderDeliveryDetails, createRepairOrderDelivery } from "../../../redux/thunks/Order";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import RepairExtraWeightModal from "../../../components/modals/RepairExtraWeightModal";
import { getPagePermission } from "../../../redux/thunks/coreComponent";


const RepairOrderDeliveryForm = () => {
  const location = useLocation();
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
    handleSubmit
  } = useForm();
  const navigate = useNavigate();
  const methods = useForm();
  const { branches } = useBranches();
  const { supplier } = useSupplierFilter();
  const { isLoading: issubmitting, isError } = useSelector((state) => state.orderReducer);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [idBranch, setIdBranch] = useState("");
  const dispatch = useDispatch();
  const { isLoading, repairOrderList } = useSelector((state) => state.orderReducer);
  const [selectSupplier, setSelectSupplier] = useState();
  const [selectedSupplierLabel, setSelectedSupplierLabel] = useState();
   const [extraWeightModal, setExtraWeightModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [editRowIndex , setEditRowIndex] = useState("")
  const [isModalOpen , setIsModalOpen] = useState(false)

  const toggle = () => {
    setExtraWeightModal(!extraWeightModal);
    setIsModalOpen(true);
    };

  const openStoneModal = (event,rowIndex) =>{
    
    if (event.key === 'Enter') {
        setEditRowIndex(rowIndex);
        toggle();
        setIsModalOpen(true);
    }
  }

  const [modalActionName, setModalActionName] = useState("Save");
  const calculateTotalData = (field, decimal_places, data) => {
    return data?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };
  
  useEffect(() => {
    setOrderDetails(repairOrderList)
  }, [repairOrderList]);

  useEffect(() => {
    let details = orderDetails.filter((item) => item.isChecked);
    let charges = calculateTotalData('total_amount', 3, details);
    if (parseFloat(charges) < 0) {
      setIsSubmitted(true);
    } else {
      setIsSubmitted(false);
    }

  }, [orderDetails]);

  useEffect(()=>{
    if (selectSupplier!= "" && selectSupplier != null){
      dispatch(getRepairOrderDeliveryDetails({"supplier": selectSupplier }));
    }
  },[selectSupplier]);


  const handleAddPreview = () => {
    if (supplier == "" || supplier == null) {
      toastfunc("Select Customer ...")
    } else if (idBranch == "" || idBranch == null) {
      toastfunc("Select Branch ...")
    } else {
      dispatch(getRepairOrderDeliveryDetails({ "id_branch": idBranch, "supplier": supplier }));
    }
  };

  const onClickSave = (data) => {
    let details = orderDetails.filter((item) => item.isChecked)
    if (details?.length === 0) {
      toastfunc("Please Add the Item Details");
    }
    else if (idBranch == "" || idBranch == null) {
      toastfunc("Select Branch ...")
    } else {
      setIsSubmitted(true);
      // console.log(orderDetails);
      const orderDet = details?.map((item) => {
        const container = {};
        container.id_job_order_detail = item.id_job_order_detail;
        container.order_detail_id = item.order_detail_id;
        container.karigar_charges = isUndefined(item.karigar_charges);
        container.customer_charges = isUndefined(item.customer_charges);
        container.extra_weight_details = item?.extra_weight_details?.length > 0 ? item?.extra_weight_details : []
        return container;
      });
      let charges = calculateTotalData('total_amount', 2, details);
      let postData = {
        order_branch: idBranch,
        order_type: 3,
        order_details: orderDet,
        total_charges: charges,
        // payment_details: (payment_mode_details),
      };
      saveOrder(postData);
      console.log(postData);
    }
  };

  const handleSave = (data) => {
     console.log(data);
     setOrderDetails((prevValues) => {
      const updatedValues = [...prevValues];
      let extra_weight = data.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0);
      let itemDetails = {...updatedValues[editRowIndex],'extra_weight_details':data,'extra_weight':extra_weight}
      updatedValues[editRowIndex] = {...itemDetails};
      return updatedValues;
    });
    };

  const saveOrder = async (postData) => {
    try {
      const response = await dispatch(createRepairOrderDelivery(postData)).unwrap();
      toastsuccess(response.data.message);
      setIsSubmitted(false);
      resetForm();
      window.location.reload();
      console.log(postData);
    } catch (error) {
      setIsSubmitted(false);
      console.error(error);
    }
  };

  const resetForm = (data) => {
    setIdBranch();
    setSelectSupplier();
    setOrderDetails([]);
  }

  const handelChange = (index, field, value) => {

    if (field == 'customer_charges') {

      // handelChange(index,'total_amount',totalAmt);
      // handelChange(index,'taxAmount',taxAmount);
      setOrderDetails((prevValues) => {
        const updatedValues = [...prevValues];
        const updatedObject = { ...updatedValues[index] };
        let taxAmount = 0;
        let totalAmt = 0;
        let tax = isUndefined(updatedObject["repair_tax"])
        let charges = isUndefined(value)
        let taxType = isUndefined(updatedObject["repair_tax_type"])

        if (taxType === 1) { //Inclusive of Tax
          taxAmount = calculateInclusiveTax(charges, tax);
        } else { // Exclusive of tax
          taxAmount = calculateExclusiveTax(charges, tax);
        }
        totalAmt = parseFloat(charges) + parseFloat(taxAmount);
        let updateValue = {
          'customer_charges': value,
          'total_amount': totalAmt,
          'taxAmount': taxAmount,
        }
        updatedValues[index] = { ...updatedObject, ...updateValue };
        console.log(updateValue)


        return updatedValues;
      });
    } else {
      setOrderDetails((prevValues) => {
        const updatedValues = [...prevValues];
        const updatedObject = { ...updatedValues[index] };
        let updateValue = {
          [field]: value,
        }
        updatedValues[index] = { ...updatedObject, ...updateValue };
        console.log(updateValue)
        return updatedValues;
      });
    }


  };
  const previewDetails = [
    { header: "Order No", accessor: "order_no", textAlign: "center", type: "checkbox" },
    { header: "Product", accessor: "product_name", textAlign: "center" },
    { header: "Repair Type", accessor: "repair_type", textAlign: "center" },
    { header: "Piece", accessor: "pieces", decimal_places: 0, textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "gross_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Customer Charges", accessor: "customer_charges", decimal_places: 2, textAlign: "center", isReq: true, isTotalReq: true, type: "number", "handelChange": handelChange },
    { header: "Karigar Charges", accessor: "karigar_charges", decimal_places: 2, textAlign: "center", isReq: true, isTotalReq: true, type: "number", "handelChange": handelChange },
    
  ];

  const calculateTotal = (field) => {
    return orderDetails.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = previewDetails.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
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
      <Head title="Order Add" />
      <Content>
        <PreviewCard className="h-100">
          <FormProvider {...methods}>
            <Row md={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
              <Col md={4}>
                <ModifiedBreadcrumb />
              </Col>
              <Col md={8} className="text-right">
                <br></br>
                <Button
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/order/createorder/list`)}
                >
                  Cancel
                </Button>{" "}
                <Button color="primary" disabled={isSubmitted || !pagePermission?.add} size="md" onClick={handleSubmit((data) =>
                  onClickSave(data)
                )}>
                  Save
                </Button>
              </Col>
            </Row>
            <Row md={12} className={"m-2"}>
              <Col md={3}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col lg="12">
                      <Label>Branch<IsRequired /></Label>
                      <div className="form-group">
                        <BranchDropdown
                          register={register}
                          id={"idBranch"}
                          branches={branches}
                          selectedBranch={idBranch}
                          onBranchChange={setIdBranch}
                          isRequired={true}
                          clearErrors={clearErrors}
                          setValue={setValue}
                          message={errors.branch && "Branch is Required"}
                          tabIndex={1}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col md="12">
                      <div className="form-group">
                        <Label>Supplier<IsRequired /></Label>
                        <SupplierDropdown
                            register={register}
                            isRequired={true}
                            id={"supplier"}
                            selectedSupplier={selectSupplier}
                            supplier={supplier}
                            setValue={setValue}
                            selectedSupplierLabel={setSelectedSupplierLabel}
                            onSupplierChange={(value) => {
                              setSelectSupplier(value);
                            }}
                            clearErrors={clearErrors}
                            placeholder={"Select Supplier"}
                            message={errors.supplier && "Supplier Is Required"}
                            tabIndex={1}
                          />
                      </div>
                    </Col>
                  </Row>
                  
                </div>
                <br></br>
              </Col>
              <Col md={9}>
                <Row md={12}>
                  <div className="row">
                    <div className="col-md-7" style={{ paddingRight: "0px" }} ><h6>Repair Order Delivery</h6> </div>
                    <div className="col-md-2" style={{ paddingRight: "0px" }}>
                      Charges (₹) :
                    </div>
                    <div className="col-md-3">
                      <input type="text" style={{ textAlign: "right" }} className="form-control form-control-sm" readOnly placeholder=" Charges (₹)" value={(() => {
                        let data = orderDetails?.filter((row) => row.isChecked);
                        return calculateTotalData('total_amount', 2, data);
                      })()} />

                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>S.NO</th>
                            {previewDetails.map((column, index) => (
                              <th key={index} style={{ "textAlign": column?.textAlign ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }} >{column.header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {orderDetails.length > 0 && orderDetails.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                              <td>{rowIndex + 1} <input
                                type="checkbox"
                                checked={item['isChecked']} // Assuming `item[column.accessor]` holds the checkbox state
                                onChange={(e) => handelChange(rowIndex, 'isChecked', e.target.checked)} // Custom handler to manage checkbox state
                              /> </td>
                              {previewDetails.map((column, colIndex) => (
                                <td key={colIndex} style={{ "textAlign": column?.textAlign }} >
                                  {
                                    (column.type === "number" ? (
                                      <div style={{ width: "100px" }}>
                                        <NumberInputField
                                          register={register}
                                          placeholder={column.header}
                                          id={column.accessor + rowIndex}
                                          value={item[column.accessor]}
                                          isRequired={item.isChecked && column.isReq}
                                          min={"0"}
                                          max={(column?.setMax ? (column?.maxValue ? column.maxValue : item[column.maxValueAccessor]) : '')}
                                          setValue={setValue}
                                          handleDot={true}
                                          handleKeyDownEvents={false}
                                          SetValue={(value) => {
                                            if (column?.handelChange) {
                                              column.handelChange(rowIndex, column.accessor, value);
                                            }
                                            clearErrors(column.accessor + rowIndex);
                                          }}
                                          minError={column.header + " Should greater than or equal to 0"}
                                          maxError={column.header + " Should greater than or equal to "}
                                          reqValueError={column.header + " is Required"}
                                          message={errors[column.accessor + rowIndex] && errors[column.accessor + rowIndex].message}
                                        />
                                      </div>
                                    )
                                      : column.isCurrency ? <CurrencyDisplay value={isUndefined(item[column.accessor])} /> : column.decimal_places ? parseFloat(isUndefined(item[column.accessor])).toFixed(column.decimal_places) : (item[column.accessor]))
                                  }
                                </td>
                               
                                  
                              ))}
                                <td>
                                   <div className={`form-control-wrap`} >
                                        <div className="form-icon form-icon-right" >
                                          <Icon name="plus" style={{ fontSize:"10px",paddingBottom:"10px",fontWeight:"bold" }}></Icon>
                                        </div>
                                           
                                        <input
                                          className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                          id={"extra_weight" + rowIndex}
                                          type="number"
                                          placeholder={"Extra weight"}
                                          value={item?.extra_weight}
                                          readOnly
                                          {...register("extra_weight" + rowIndex, {
                                            required: {
                                              value: false,
                                              message: "Gross weight is required",
                                            },
                                          })}
                                          onClick={() => {
                                            setExtraWeightModal(true);
                                            setEditRowIndex(rowIndex);
                                          }}
                                          onKeyDown={(event) => openStoneModal(event,rowIndex)}
                                        />
                                      </div>
                                </td>
                              
                            </tr>
                          ))}
                        </tbody>

                        <tfoot>
                          <tr style={{ fontWeight: 'bold' }}>
                            <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Total</td>
                            {previewDetails.map((column, index) => (
                              <td key={index} style={{ "textAlign": column?.textAlign ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                                {column.isTotalReq ? column.isCurrency ? <CurrencyDisplay value={calculateTotal(column.accessor)} /> : (calculateTotal(column.accessor)) : ''}
                              </td>
                            ))}
                          </tr>
                        </tfoot>

                      </table>
                    </div>

                  </div>
                </Row>
              </Col>
            </Row>
          </FormProvider>
        </PreviewCard>
      </Content>

       <RepairExtraWeightModal
        isOpen={isModalOpen}
        modal={extraWeightModal}
        toggle={toggle}
        onSave={handleSave}
        initialFormData = {orderDetails[editRowIndex]?.extra_weight_details}
      />
      
    </React.Fragment>
  );
};

export default RepairOrderDeliveryForm;
