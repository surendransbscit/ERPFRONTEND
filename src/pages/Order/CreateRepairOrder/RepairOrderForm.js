import React, { useContext, useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Row, PreviewCard, SaveButton, TextInputField, RSelect } from "../../../components/Component";
import Content from "../../../layout/content/Content";
import "../../../assets/css/sales_form.css";
import { Button, Label } from "reactstrap";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import UseOrderFormHandling from "./UseRepairOrderFormHandling";
import SalesForm from "../../../components/common/salesForm/salesForm";
import PreviewTable from "../../../components/sds-table/PreviewTable";
import Select from "react-select";
import CustomerAutoComplete from "../../../components/common/autoComplete/CustomerAutoComplete";
import DeleteModal from "../../../components/modals/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import MultiImageDropzone from "../../../components/modals/MultiImageDropzone";
import { v4 as uuid } from "uuid";
import moment from "moment";
import IsRequired from "../../../components/erp-required/erp-required";
import {
  useProducts,
  useUom,
  useBranches,
  useDamageMaster,
  useStone,
  useQualityCode
} from "../../../components/filters/filterHooks";
import {
  BranchDropdown,
  ProductDropdown,
  SelectDropdown
} from "../../../components/filters/retailFilters";
import {
  InputFieldWithDropdown,
  InputGroupField,
  NumberInputField,
  DateInputField,
} from "../../../components/form-control/InputGroup";
import LessWeightInputField from "../../../components/form-control/LessWeight";
import makeAnimated from "react-select/animated";
import {
  calculateNetWeight,
  isUndefined
} from "../../../components/common/calculations/ErpCalculations";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";
import { getPagePermission } from "../../../redux/thunks/coreComponent";
import CreateCustomerConfirmation from "../../../components/modals/CreateCustomerConfirmation";

const RepairOrderForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const animatedComponents = makeAnimated();
  const { transformWord } = useContext(WordTransformerContext);
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const methods = useForm();
  const { products } = useProducts();
  const { uom } = useUom();
  const { branches } = useBranches();
  const { damageMaster } = useDamageMaster();
  const { isLoading: issubmitting, isError } = useSelector((state) => state.orderReducer);
  const [modal, SetModal] = useState(false);
  const { stone } = useStone();
  const { quality_code } = useQualityCode();
  const imageToggle = () => {
    SetModal(!modal);
  };
  let UomOptions = [];
  if (uom.length > 0) {
    UomOptions = uom.map((val) => ({
      value: val.uom_id,
      label: val.uom_name,
      isDefault: val.is_default,
    }));
  }

  let letDamageOptions = [];
  if (damageMaster.length > 0) {
    letDamageOptions = damageMaster?.map((obj) => {
      const container = {};
      container.label = obj.name;
      container.value = obj.id_repair;
      return container;
    });
  }

  const convert64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };


  const handleDropChange = async (acceptedFiles, set) => {
    const filesWithPreview = await Promise.all(
      acceptedFiles?.map(async (file) => {
        const base64String = await convert64(file);
        return {
          ...file,
          preview: base64String,
          id: uuid(),
          default: false,
        };
      })
    );

    set(filesWithPreview);
  };

  const {
    idBranch,
    setIdBranch,
    isSubmitted,
    previewDetails,
    orderTypeOptions,
    rateFixedOnOrder,
    setRateFixedOnOrder,
    customer,
    SetCustomer,
    customerSearch,
    SetCustomerSearch,
    orderType,
    setOrderType,
    orderDetails,
    orderEditData,
    handleOrderFormSubmit,
    deleteOrder,
    handleDelete,
    handleEdit,
    handleAddPreview,
    deleteModal,
    toggle,
    salesFormRef,
    onClickSave,
    orderImages,
    SetOrderImages,
    daysOfPayment,
    setDaysOfPayment,
    paymentDate,
    setPaymentDate,
    handleInputChange,
    formValues,
    handleSetStoneDetails,
    setRepairOrderType,
    repairOrderType,
    navigateCreateCustomer,
    createMobNum, SetCreateMobNum,
    navigateModal, SetNavigateModal,
    toggleNavigateModal,
    navigateModalOpened, setNavigateModalOpened,
    inputType, setInputType,
    searchCustomerList,
    isSearching, setIsSearching
  } = UseOrderFormHandling(id); //Custom hook for Handling Order Form
  // console.log(orderImages);

  // useEffect(() => {
  //   if (add === undefined && id === undefined) {
  //     navigate(`${process.env.PUBLIC_URL}/order/repair_order/list`);
  //   }
  // }, [add, id, navigate]);

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
          navigate(`${process.env.PUBLIC_URL}/order/repair_order/list`);
        }
      }, [pagePermission, navigate]);

  useEffect(() => {
    const net_weight = calculateNetWeight({
      gross_weight: formValues.grossWeight,
      less_weight: formValues.lessWeight,
      other_metal_weight: formValues.otherMetalWeight,
    });

    if (parseFloat(net_weight) < 0) {
      toastfunc("Net Weight Should Not Be Less Than Zero");
    } else {
      if (net_weight !== formValues.netWeight) {
        handleInputChange("netWeight", net_weight)
        setValue("netWeight", net_weight);
      }
    }
  }, [
    setValue,
    formValues.grossWeight,
    formValues.lessWeight,
    formValues.otherMetalWeight,
    formValues.netWeight,
  ]);
  useHotkeys(
  "ctrl+s",
  (event) => {
    event.preventDefault();
    document.activeElement?.blur();
    setTimeout(() => {
      onClickSave();
    }, 0);
  },
  {
    enableOnFormTags: true,
    preventDefault: true,
  }
);

  return (
    <React.Fragment>
      <Head title="Order Add" />
      <Content>
         <CreateCustomerConfirmation
                            modal={navigateModal}
                            toggle={toggleNavigateModal}
                            title={"Create Customer"}
                            mobNum={createMobNum}
                            clickAction={navigateCreateCustomer}
                          />
        <PreviewCard className="h-100">
          <FormProvider {...methods}>
            <Row md={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>

              <Col lg="2">
                <Label>Branch</Label>
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
              <Col lg="2">
                <Label>Customer</Label>                
                <div className="form-group">
                  <CustomerAutoComplete
                    inputType={inputType}
                    setInputType={setInputType}
                    isSearching={isSearching}
                    SetCreateMobNum={SetCreateMobNum}
                    navigateModalOpened={navigateModalOpened}
                    SetNavigateModal={SetNavigateModal}
                    setNavigateModalOpened={setNavigateModalOpened}
                    setIsSearching={setIsSearching}
                    searchCustomerList={searchCustomerList}
                    id={"customerSearch"}
                    placeholder={"Select Customer"}
                    searchValue={customerSearch}
                    SetSearchValue={SetCustomerSearch}
                    SetValue={SetCustomer}
                    customer={customer}
                    tabIndex={2}
                  />
                </div>
              </Col>

              <Col md={3} lg={2}>
                <Label>
                  Due Date in Days
                  <IsRequired />
                </Label>
                <TextInputField
                  register={register}
                  isRequired={true}
                  id={"daysOfPayment"}
                  placeholder="No. of days"
                  value={daysOfPayment}
                  SetValue={(value) => {
                    setDaysOfPayment(value);
                    const inputDays = value;

                    // Calculate future date if input is a valid number
                    if (!isNaN(inputDays) && inputDays !== "") {
                      const resultDate = new Date();
                      resultDate.setDate(resultDate.getDate() + parseInt(inputDays));
                      setPaymentDate(moment(resultDate).format("DD-MM-YYYY"));
                    } else {
                      setPaymentDate(); // Clear if input is invalid
                    }

                    clearErrors("daysOfPayment");
                  }}
                  tabIndex={3}
                />
                {errors?.daysOfPayment && <span className="text-danger">{errors?.daysOfPayment.message}</span>}
              </Col>
              <Col md={3} lg={3}>
                <Label>Due Date</Label>
                <div className="form-control-wrap">
                  <input
                    disabled
                    className="form-control form-control-sm"
                    id={"payementDate"}
                    type="text"
                    placeholder={"Due Date"}
                    value={paymentDate}
                  />
                </div>
              </Col>

              <Col md={2} className="text-right">
                <br></br>
                <Button
                  disabled={isSubmitted}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/order/repair_order/list`)}
                  tabIndex={14}
                >
                  Cancel
                </Button>{" "}
                <Button color="primary" disabled={isSubmitted} size="md" onClick={onClickSave} tabIndex={15}>
                  {isSubmitted ? "Saving" : "Save"}
                </Button>
              </Col>
            </Row>

            <Row md={12} className={"m-2"}>
              <Col md={4} className="form-control-sm">
                <div className="custom-grid">
                  <Row className={"form-group row"}>
                    <Col md="12" style={{ paddingRight: "0px" }} >
                      <div className="row form-group">
                        <div className="col-md-6">
                          <label className="form-label" htmlFor="cus_type">
                            Order Type:&nbsp;
                          </label>
                        </div>
                        <div className="col-md-6">

                          <div
                            style={{ marginLeft: "5px" }}
                            className="custom-control custom-control-sm custom-radio"
                          >
                            <input
                              type="radio"
                              id="catalog_order"
                              name={"repairOrderType"}
                              value={"1"}
                              className="custom-control-input"
                              checked={repairOrderType === "1"}
                              {...register("repairOrderType", { required: true })}
                              onChange={(e) => {
                                setRepairOrderType(e.target.value);
                              }}
                            />
                            <label
                              htmlFor="catalog_order"
                              className="custom-control-label"
                            >
                              {" "}
                              In-house
                            </label>
                          </div>
                          &nbsp;
                          <div className="custom-control custom-control-sm custom-radio">
                            <input
                              type="radio"
                              id="custom_order"
                              name={"repairOrderType"}
                              value={"2"}
                              className="custom-control-input"
                              {...register("repairOrderType", { required: true })}
                              checked={repairOrderType === "2"}
                              onChange={(e) => {
                                setRepairOrderType(e.target.value);
                              }}
                            />
                            <label
                              htmlFor="custom_order"
                              className="custom-control-label"
                            >
                              Custom
                            </label>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    {(repairOrderType === "1") && (
                      <Col md="6">
                        <Label>Product<IsRequired /></Label>
                        <ProductDropdown
                          register={register}
                          id={"selectedProduct"}
                          products={products}
                          selectedProduct={formValues.selectedProduct}
                          onProductChange={(value) => {
                            handleInputChange("selectedProduct", value);
                          }}
                          isRequired={true}
                          clearErrors={clearErrors}
                          setValue={setValue}
                          message={errors.selectedProduct && "Product is Required"}
                          tabIndex={3}
                        />
                      </Col>
                    )}
                    {(repairOrderType === "2") && (
                      <Col md="6">
                        <Label>Product<IsRequired /></Label>
                        <input
                          type="text"
                          id="customized_product_name"
                          name="customized_product_name"
                          placeholder="Product"
                          value={formValues.customizedProductName}
                          onChange={(e) => {
                            let productName = transformWord(e.target.value);
                            handleInputChange("customizedProductName", productName);
                          }}
                          onKeyDown={(evt) => {
                            const invalidChars = /[^a-zA-Z\s]/; // Allows only letters and spaces
                            if (invalidChars.test(evt.key) || evt.key === "Shift") {
                              evt.preventDefault();
                            }
                          }}
                          className="form-control-sm form-control"
                        />
                      </Col>
                    )}

                    <Col md="6">
                      <Label>Type<IsRequired /></Label>
                      <div className="form-control-select">
                        <RSelect
                          closeMenuOnSelect={false}
                          components={animatedComponents}
                          isMulti
                          options={letDamageOptions}
                          value={formValues.selectedRepairType}
                          onChange={(value) => { handleInputChange("selectedRepairType", value); }}
                          tabIndex={4}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">

                    <Col md="6">
                      <Label>Pieces<IsRequired /></Label>
                      <NumberInputField
                        register={register}
                        placeholder="Piece"
                        id={"piece"}
                        value={formValues.piece}
                        isRequired={true}
                        min={0}
                        setValue={setValue}
                        SetValue={(value) => {
                          handleInputChange("piece", value);
                          clearErrors("piece");
                        }}
                        handleKeyDownEvents={true}
                        handleDot={true}
                        minError={"Pieces Should greater than or equal to 0"}
                        reqValueError={"Pieces is Required"}
                        message={errors.piece && errors.piece.message}
                        tabIndex={5}
                      />
                    </Col>
                    <Col md="6">
                      <Label>Gwt<IsRequired /></Label>
                      <InputFieldWithDropdown
                        register={register}
                        placeholder="Gross weight"
                        id={"grossWeight"}
                        value={formValues.grossWeight}
                        isRequired={true}
                        min={0}
                        type={"number"}
                        optionId={"uomId"}
                        name={"uomId"}
                        options={UomOptions}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={3}
                        onDropDownChange={(value) => {
                          handleInputChange("uomId", value);
                        }}
                        selectedOption={formValues.uomId}
                        SetValue={(value) => {
                          handleInputChange("grossWeight", value);
                          clearErrors("grossWeight");
                        }}
                        minError={"Gross weight Greater than or equal 1"}
                        maxError={""}
                        requiredMessage={"Gross weight is Required"}
                        message={errors.grossWeight && errors.grossWeight.message}
                        tabIndex={6}
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="6">
                      <Label>Lwt</Label>
                      <LessWeightInputField
                        register={register}
                        placeholder="Less Weight"
                        id={"lessWeight"}
                        value={formValues.lessWeight}
                        isRequired={false}
                        min={0}
                        uom={uom}
                        gross_weight={formValues.grossWeight}
                        less_weight={formValues.lessWeight}
                        SetValue={(value) => handleInputChange("lessWeight", value)}
                        SetStnWeight={(value) => handleInputChange("stnWeight", value)}
                        SetDiaWeight={(value) => handleInputChange("diaWeight", value)}
                        SetStoneDetails={handleSetStoneDetails}
                        stone_details={formValues.stoneDetails}
                        ref={salesFormRef}
                        stone={stone}
                        quality_code={quality_code}
                        tabIndex={7}
                      // tabIndex={11}
                      />
                    </Col>
                    <Col md="6">
                      <Label>Stn/Dia wt</Label>
                      <InputGroupField
                        register={register}
                        placeholder1="Stone"
                        inputId1="stnWeight"
                        value1={parseFloat(formValues.stnWeight).toFixed(3)}
                        isRequiredInput1={false}
                        minInput1={0}
                        maxInput1={100}
                        minErrorInput1={"Stone weight Should greater than 0"}
                        messageInput1={errors.stnWeight && errors.stnWeight.message}
                        setValue={setValue}
                        SetInputValue1={(value) => {
                          handleInputChange("stnWeight", value);
                          clearErrors("stnWeight");
                        }}
                        placeholder2="Dia"
                        inputId2="diaWeight"
                        isRequiredInput2={false}
                        value2={parseFloat(formValues.diaWeight).toFixed(3)}
                        minInput2={0}
                        minErrorInput2={"Dia Weight should be greater than or equal to 0"}
                        maxErrorInput2={"Dia Weight should be less than or equal to 100"}
                        reqValueErrorInput2={"Weight is required"}
                        messageInput2={errors.diaWeight && errors.diaWeight.message}
                        SetInputValue2={(value) => {
                          handleInputChange("diaWeight", value);
                          clearErrors("diaWeight");
                        }}
                        tabIndex={8}
                      />
                    </Col>
                  </Row>


                  <Row className="form-group row g-4">
                    <Col md="6">
                      <Label>Net wt</Label>
                      <NumberInputField
                        register={register}
                        id="netWeight"
                        placeholder="Net Weight"
                        value={formValues.netWeight}
                        isRequired={false}
                        readOnly
                        min={0}
                        minError="Net weight must be greater than 0"
                        reqValueError="Net weight is Required"
                        message={errors.netWeight && errors.netWeight.message}
                      />
                    </Col>
                    <Col md="6">
                      <Label>Approx Amt</Label>
                      <NumberInputField
                        register={register}
                        id="approxAmount"
                        placeholder="Amount"
                        value={formValues.approxAmount}
                        isRequired={false}
                        min={0}
                        setValue={setValue}
                        SetValue={(value) => {
                          handleInputChange("approxAmount", value);
                          clearErrors("approxAmount");
                        }}
                        minError="Amount must be greater than 0"
                        reqValueError="Amount weight is Required"
                        message={errors.approxAmount && errors.approxAmount.message}
                        tabIndex={9}
                      />
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <Label>Remarks<IsRequired /></Label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-control-wrap">
                        <textarea
                          id="remarks"
                          name="remarks"
                          style={{ minHeight: "4vw" }}
                          rows="3"
                          className="form-control form-control-sm"
                          type="text"
                          value={formValues.remarks}
                          onChange={(e) => {
                            let value = e.target.value;
                            handleInputChange("remarks", value);
                            clearErrors("remarks");
                          }}
                          tabIndex={10}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Image
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-control-wrap">
                        <Button tabIndex={11} onClick={() => imageToggle()}>Add Images</Button>

                      </div>
                    </Col>
                  </Row>
                  <Row className="g-3">
                    <Col>
                      <div style={{ float: "center" }}>
                        <SaveButton
                          disabled={issubmitting}
                          size="md"
                          color="primary"
                          tabIndex={12}
                          onClick={handleAddPreview}
                        >
                          Add to Preview
                        </SaveButton>
                      </div>
                    </Col>
                  </Row>
                </div>
                <br></br>
              </Col>
              <Col md={8}>
                <Row md={12}>
                  <PreviewTable
                    columns={previewDetails}
                    data={orderDetails}
                    numericFields={""}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </Row>
              </Col>
            </Row>


            {/* <Row md={12}>
              <Col md="12">
                <div className="custom-grid mb-2 mt-1">
                  <Row md={12}>
                    <Col md={6}>
                      <Button onClick={() => imageToggle()}>Add Images</Button>
                    </Col>
                    <Col md={6}>
                      {orderImages?.map((file) => {
                        return (
                          <div
                            key={file.name}
                            className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                          >
                            <div className="dz-image">
                              <img style={{ width: "150px", height: "170px" }} src={file.preview} alt="preview" />
                            </div>
                          </div>
                        );
                      })}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row> */}


          </FormProvider>
        </PreviewCard>
        <MultiImageDropzone
          modal={modal}
          toggle={imageToggle}
          files={orderImages}
          setFiles={SetOrderImages}
          handleDropChange={handleDropChange}
        />
      </Content>
      <DeleteModal
        actionName={"Delete"}
        modal={deleteModal}
        toggle={toggle}
        name={"Item"}
        title={"Order"}
        clickAction={deleteOrder}
      />
    </React.Fragment>
  );
};

export default RepairOrderForm;
