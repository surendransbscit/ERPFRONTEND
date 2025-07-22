import React, { useEffect, useRef, useState } from "react";
import Head from "../../../layout/head/Head";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Row, PreviewCard, SaveButton, TextInputField } from "../../../components/Component";
import Content from "../../../layout/content/Content";
import "../../../assets/css/sales_form.css";
import { BranchDropdown } from "../../../components/filters/retailFilters";
import { useBranches, useEmployeeDropdown, useProducts, usePurities } from "../../../components/filters/filterHooks";
import { Button, Label, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import UseOrderFormHandling from "./UseOrderFormHandling";
import SalesForm from "../../../components/common/salesForm/salesForm";
import PreviewTable from "../../../components/sds-table/PreviewTable";
import Select from "react-select";
import CustomerAutoComplete from "../../../components/common/autoComplete/CustomerAutoComplete";
import DeleteModal from "../../../components/modals/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import MultiImageDropzone from "../../../components/modals/MultiImageDropzone";
import moment from "moment";
import IsRequired from "../../../components/erp-required/erp-required";
import SalesEntryForm from "../../../components/common/salesForm/salesEntryForm";
import PurchaseForm from "../../../components/common/salesForm/purchaseForm";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import { useHotkeys } from "react-hotkeys-hook";
import PaymentModeComponent from "../../../components/common/payment/PaymentModeComponent";
import MultiVideoDropzone from "../../../components/modals/MultiVideoDropzone";
import MultiVoiceRecordDropzone from "../../../components/modals/MultiVoiceRecordDropzone";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import { getPagePermission } from "../../../redux/thunks/coreComponent";
import CreateCustomerConfirmation from "../../../components/modals/CreateCustomerConfirmation";


const OrderForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
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
  const { branches } = useBranches();
  const { products } = useProducts();
  const { purities } = usePurities();
  const { employees } = useEmployeeDropdown();
  const { isLoading: issubmitting, isError } = useSelector((state) => state.orderReducer);
  const [modal, SetModal] = useState(false);
  const [billTypeTab, setBillTypeTab] = useState("1");
  const [imageModal, SetImageModal] = useState(false);
  const [videoModal, SetVideoModal] = useState(false);
  const [voiceModal, setVoiceModal] = useState(false);
  
  const toggleImageModal = () => {
    SetImageModal(!imageModal);
  };

  const toggleVideoModal = () => {
    SetVideoModal(!videoModal);
  };

  const toggleVoiceModal = () => {
    setVoiceModal(!voiceModal);
  };

  const receivedAmountRef = useRef(null);
  const paymentFormRef = useRef(null);

  const {
    idBranch,
    setIdBranch,
    isSubmitted,
    previewDetails,
    orderTypeOptions,
    rateFixedOnOrder,
    setRateFixedOnOrder,
    SetCustomer,
    customerSearch,
    customer,
    SetCustomerSearch,
    orderType,
    setOrderType,
    tagCode,
    setTagCode,
    oldTagCode,
    setOldTagCode,
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
    purchaseFormRef,
    onClickSave,
    orderImages,
    SetOrderImages,
    orderVideos,
    SetOrderVideos,
    orderVoices,
    SetOrderVoices,
    daysOfPayment,
    setDaysOfPayment,
    paymentDate,
    setPaymentDate,
    handleTagSearch,
    handleDropChange,
    handleSalesItemData,
    estNo,
    setEstNo,
    handleEstNoSearch,
    purchaseFormValues,
    handlePurchaseItem,
    setTotalDiscount,
    totalDiscount,
    handleInputChange,
    calculateDiscountAmount,
    totalAmountReceived,
    handlePurchaseEdit,
    purchaseItemData,
    purchaseColumns,
    handlePurchaseDelete,
    handlePurchaseAddPreview,
    totalPurchaseAmount,
    totalBillAmount,
    netAmount,
    handlePaymentData,
    setPaymentAmount,
    paymentModeData,
    paymentAmount,
    employee,
    navigateCreateCustomer,
    createMobNum, SetCreateMobNum,
    navigateModal, SetNavigateModal,
    toggleNavigateModal,
    navigateModalOpened, setNavigateModalOpened,
    inputType, setInputType,
    searchCustomerList,
    isSearching, setIsSearching
  } = UseOrderFormHandling(id); //Custom hook for Handling Order Form
  console.log(orderImages);
  console.log(orderVideos);
  console.log(orderVoices);

    useEffect(() => {
      const totalPaidAmount = paymentModeData?.reduce((sum, item) => {
        return sum + parseFloat(item?.payment_amount || 0);
      }, 0);
      setPaymentAmount(totalPaidAmount);
    }, [paymentModeData, totalAmountReceived]);

     
  
  // useEffect(() => {
  //   if (add === undefined && id === undefined) {
  //     navigate(`${process.env.PUBLIC_URL}/order/createorder/list`);
  //   }
  // }, [add, id, navigate]);

   const pathName = location?.pathname;
   const { pagePermission } = useSelector((state) => state.coreCompReducer);
    
    useEffect(() => {
       if (id !== undefined) {
         dispatch(getPagePermission({ path: '/order/createorder/list' }));
       }else {
         dispatch(getPagePermission({ path: pathName }));
       }
    }, [pathName, dispatch]);
  
    useEffect(() => {
      if (
        pagePermission?.view === false ||
        pagePermission === undefined ||
        pagePermission === null
      ) {
        navigate(`${process.env.PUBLIC_URL}/order/createorder/list`);
      }
    }, [pagePermission, navigate]);

    useHotkeys(
      "ctrl+s",
      (event) => {
        event.preventDefault();
        if (idBranch === "" || idBranch === null) {
          toastfunc("Please Select the Branch");
        }
        else if (customer === "" || customer === undefined) {
          toastfunc("Please Select the Customer");
        } else if (daysOfPayment === "" || daysOfPayment === undefined) {
          toastfunc("Please Enter the Due Days");
        } else if (orderDetails?.length === 0) {
          toastfunc("Please Add the Item Details");
        }else{
          onClickSave();
        }
      },
      {
        enableOnFormTags: true, // Enable hotkeys inside input fields
        preventDefault: true, // Prevent default browser Save
      }
    );

  useHotkeys(
      "alt",
      (event) => {
        event.preventDefault();
        receivedAmountRef.current.select()
      },
      {
        enableOnFormTags: true, // Enable hotkeys inside input fields
        preventDefault: true, // Prevent default browser Save
      }
    );

  useHotkeys('enter', (e) => {
    if (receivedAmountRef.current) {
      // Optionally check if it's focused
      if (document.activeElement === receivedAmountRef.current) {
        e.preventDefault();
        // console.log("receivedAmountRef is focused!");
        calculateDiscountAmount();
      }
    }
  }, {
    enableOnFormTags: true, // Enable hotkeys inside input fields
  });

  

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
              <Col md={4}>
                <ModifiedBreadcrumb />
              </Col>

              <Col md={8} className="text-right">
                <br></br>
                <Button
                  disabled={isSubmitted}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/order/createorder/list`)}
                >
                  Cancel
                </Button>{" "}
                <Button color="primary" disabled={isSubmitted} size="md" onClick={() => onClickSave('save')}>
                  {isSubmitted ? "Saving" : "Save(Ctrl+S)"}
                </Button>{" "}
                {/* <Button color="primary" disabled={isSubmitted} size="md" onClick={() => onClickSave('saveAndPay')}>
                  {isSubmitted ? "Saving" : "Save&Pay"}
                </Button> */}
              </Col>
            </Row>
            <Row lg={12} className={"form-control-sm g-2"} style={{ marginTop: "10px", display: "flex" }}>
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
                <Label>Rate Fix</Label>
                <div style={{ position: "relative", zIndex: "999" }}>
                  <Select
                    value={orderTypeOptions?.find((option) => option.value === rateFixedOnOrder)}
                    onChange={(e) => setRateFixedOnOrder(e.value)}
                    options={orderTypeOptions}
                    placeholder="Rate Fix On"
                    id={"rateFixedOnOrder"}
                  />
                  <input type="hidden" value={rateFixedOnOrder || ""} />
                  {errors.rateFixedOnOrder && <span className="invalid">This field is required</span>}
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
                    customer = {customer}
                  />
                </div>
              </Col>
              {/* <Col lg="3">
                <Label>Rate Fixed </Label>
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="onBillingDate"
                          type="radio"
                          name={"rateFixedOnOrder"}
                          value={"1"}
                          className="custom-control-input"
                          checked={rateFixedOnOrder == "1"}
                          onChange={(e) => {
                            setRateFixedOnOrder(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="onBillingDate">
                          Delivery Date
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="onOrderDate"
                          type="radio"
                          value={"2"}
                          name={"rateFixedOnOrder"}
                          className="custom-control-input "
                          checked={rateFixedOnOrder == "2"}
                          onChange={(e) => {
                            setRateFixedOnOrder(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="onOrderDate">
                          Order Date
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col> */}
              <Col md={1} >
                <Label>
                  Due Days
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
              <Col md={2}>
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
              <Col md={2} className="form-control-sm">
                <br></br>
                <div className="form-control-wrap">
                  <div className="input-group">
                    <div className="input-group-append" style={{ "width": "40%" }} >
                      <TextInputField
                        register={register}
                        isRequired={true}
                        id={"tagCode"}
                        placeholder="Tag Code"
                        value={tagCode}
                        SetValue={(value) => {
                          setTagCode(value);
                          clearErrors("tagCode");

                        }}
                      />
                    </div>
                    <div className="input-group-append" style={{ "width": "40%" }} >
                      <TextInputField
                        register={register}
                        isRequired={true}
                        id={"oldTagCode"}
                        placeholder="Old Tag Code"
                        value={oldTagCode}
                        SetValue={(value) => {
                          setOldTagCode(value);
                          clearErrors("oldTagCode");
                        }}
                      />
                    </div>

                    <div className="input-group-append" style={{ "height": "29px", "width": "10%" }}>
                      <Button
                        outline
                        color="primary"
                        className="btn-dim"
                        onClick={handleTagSearch}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>


            {/* <SalesEntryForm
              idBranch={idBranch}
              ref={salesFormRef}
              setItemDetails={handleSalesItemData}
              itemDetails={orderDetails}
              itemType={2}
              imageToggle={imageToggle}
            /> */}


            <Row lg={12} className={"form-control-sm g-2"} style={{ marginTop: "10px", display: "flex" }}>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    tag="a"
                    href="#tab"
                    className={billTypeTab === "1" ? "active" : ""}
                    onClick={(ev) => {
                      ev.preventDefault();
                      setBillTypeTab("1");
                    }}
                  >
                    Sales(F1)
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag="a"
                    href="#tab"
                    className={billTypeTab === "2" ? "active" : ""}
                    onClick={(ev) => {
                      ev.preventDefault();
                      setBillTypeTab("2");
                    }}
                  >
                    Purchase(F2)
                  </NavLink>
                </NavItem>
                <Col md={1}>
                  <div className="form-control-wrap" style={{ marginTop: "10px" }}>
                    <div className="input-group">
                      <div className="input-group-append" style={{ "width": "70%" }}>
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"estNo"}
                          tabIndex={4}
                          placeholder="Est No"
                          value={estNo}
                          SetValue={(value) => {
                            setEstNo(value);
                          }}
                        />
                      </div>
                      <div className="input-group-append" style={{ height: "29px", "width": "30%" }}>

                        <Button outline color="primary" className="btn-dim" onClick={handleEstNoSearch}>
                          <em class="icon ni ni-search"></em>
                        </Button>
                      </div>
                    </div>

                  </div>
                </Col>
              </Nav>



            </Row>
            <TabContent activeTab={billTypeTab}>
              <TabPane tabId="1">
                <SalesEntryForm
                  idBranch={idBranch}
                  ref={salesFormRef}
                  setItemDetails={handleSalesItemData}
                  itemDetails={orderDetails}
                  itemType={2}
                  showIsPartial={false}
                  showIsOrder={true}
                  showSize={true}
                  imageToggle={toggleImageModal}
                  videoToggle={toggleVideoModal}
                  voiceToggle={toggleVoiceModal}
                  orderImages={orderImages} 
                  SetOrderImages={SetOrderImages} 
                  orderVideos={orderVideos} 
                  SetOrderVideos={SetOrderVideos} 
                  orderVoices={orderVoices} 
                  SetOrderVoices={SetOrderVoices}
                  employee = {employee}
                ></SalesEntryForm>
              </TabPane>
              <TabPane tabId="2">
                <PurchaseForm
                  billTypeTab={billTypeTab}
                  ref={purchaseFormRef}
                  onSubmit={handlePurchaseItem}
                  initialState={purchaseFormValues}
                  tabIndex={''}
                ></PurchaseForm>
                <Col md={3} className="form-control-sm">
                  <Button color="primary" tabIndex={''} className="btn" onClick={handlePurchaseAddPreview}>
                    Add to Preview
                  </Button>
                </Col>
                <Row md={12}>
                  <PreviewTable
                    columns={purchaseColumns}
                    data={purchaseItemData}
                    onDelete={handlePurchaseDelete}
                    onEdit={handlePurchaseEdit}
                    tab
                    Index={''}
                  />
                </Row>
              </TabPane>
            </TabContent>



            {/* <SalesForm
                isSizeReq={true}
                isRemarksReq={true}
                isSectionReq = {"0"}
                ref={salesFormRef}
                onSubmit={handleOrderFormSubmit}
                initialState={orderEditData}
                tabIndex={4}
              /> */}
            {/* <Row className="g-3">
              <Col>
                <div style={{ float: "right" }}>
                  <SaveButton
                    disabled={issubmitting}
                    size="md"
                    color="primary"
                    tabIndex={17}
                    onClick={handleAddPreview}
                  >
                    Add to Preview
                  </SaveButton>
                </div>
              </Col>
            </Row> */}

            {/* <Row md={12}>
              <Col md="12">
                <div className="custom-grid mb-2 mt-1">
                  <Row md={12}>
                    <Col md={6}>
                      <Button onClick={() => imageToggle()}>Add Images</Button>
                    </Col>
                    <Col md={6} style={{ display: "none" }}>
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

            <Row md={12}>
              <Row>
                <Col md={4}>
                  <table className="table table-bordered">
                    <tr>
                      <th>Sales Amount</th>
                      <th style={{ textAlign: "right", fontSize: "20px !important", color: "#34a853" }}>
                        <CurrencyDisplay value={orderDetails.reduce((sum, item) => sum + parseFloat(item.itemCost || 0), 0)} />
                      </th>
                    </tr>

                    <tr>
                      <th>Pur Amount</th>
                      <th style={{ textAlign: "right", color: "red" }}>
                        <CurrencyDisplay value={purchaseItemData.reduce((sum, item) => sum + parseFloat(item.itemCost || 0), 0)} />
                      </th>
                    </tr>

                    <tr>
                      <th>Bill Amount</th>
                      <th style={{ textAlign: "right" }}>
                        <CurrencyDisplay value={totalBillAmount} />
                      </th>
                    </tr>


                    <tr>
                      <th>Discount Amount</th>
                      <td>
                        <div className="input-group">
                          <input
                            id={`totalDiscount`}
                            type="number"
                            className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                            value={totalDiscount}
                            setValue={setValue}
                            min={0}
                            style={{ textAlign: "right" }}
                            {...register(`totalDiscount`)}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleInputChange("totalDiscount", value);
                            }}
                            onBlur={calculateDiscountAmount}
                          />
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <th>Recd Amount</th>
                      <td>
                        <input
                          id={`totalAmountReceived`}
                          type="number"
                          className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                          value={totalAmountReceived}
                          setValue={setValue}
                          style={{ textAlign: "right" }}
                          min={0}
                          {...register(`totalAmountReceived`)}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleInputChange("totalAmountReceived", value);
                          }}
                          onBlur={calculateDiscountAmount}
                          ref={receivedAmountRef}
                        />
                      </td>
                    </tr>

                    <tr>
                      <th>Payment Amount</th>
                      <td>
                        <input
                          id={`totalAmountReceived`}
                          type="number"
                          className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                          value={paymentAmount}
                          setValue={setValue}
                          style={{ textAlign: "right" }}
                          min={0}
                          readOnly={true}
                          {...register(`paymentAmount`)}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleInputChange("paymentAmount", value);
                          }}
                        />
                      </td>
                    </tr>
                    
                  </table>
                </Col>
                <Col md={8}>
                      <PaymentModeComponent
                        ref={paymentFormRef}
                        onUpdateFormData={handlePaymentData}
                        customer={customer}
                      />
                </Col>
              </Row>
            </Row>
          </FormProvider>
        </PreviewCard>
        <MultiImageDropzone
          modal={imageModal}
          toggle={toggleImageModal}
          files={orderImages}
          setFiles={SetOrderImages}
          handleDropChange={handleDropChange}
        />
        <MultiVideoDropzone
          modal={videoModal}
          toggle={toggleVideoModal}
          files={orderVideos}
          setFiles={SetOrderVideos}
          handleDropChange={handleDropChange}
        />
        <MultiVoiceRecordDropzone
        modal={voiceModal}
        toggle={toggleVoiceModal}
        files={orderVoices}
        setFiles={SetOrderVoices}
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

export default OrderForm;
