/* eslint-disable no-unused-expressions */
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import classnames from "classnames";
import {
  CancelButton,
  Col,
  Icon,
  NumberInputField,
  PreviewCard,
  Row,
  SaveButton,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import { searchCustomer } from "../../../redux/thunks/customer";
import CreateCustomerConfirmation from "../../../components/modals/CreateCustomerConfirmation";
import {
  useBranches,
  useDepositMaster,
} from "../../../components/filters/filterHooks";
import {
  BranchDropdown,
  DepositMasterDropdown,
} from "../../../components/filters/retailFilters";
import PaymentModeComponent from "../../../components/common/payment/PaymentModeComponent";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import { getEstimationDetailsByNo } from "../../../redux/thunks/estimation";
import PreviewTable from "../../../components/sds-table/PreviewTable";
import moment from "moment";
import { isUndefined } from "../../../components/common/calculations/ErpCalculations";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import { createCustomerDeposits } from "../../../redux/thunks/Order";
import { useHotkeys } from "react-hotkeys-hook";
import { getDepositMasterById } from "../../../redux/thunks/retailMaster";

const CustomerDepositForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const customerId = location?.state?.customerId;
  const customerSearchValue = location?.state?.customerSearchValue;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
  } = useForm();

  const columns = [
    { header: "Product", accessor: "product_name", textAlign: "center" },
    {
      header: "Gwt",
      accessor: "gross_wt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Lwt",
      accessor: "less_wt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Nwt",
      accessor: "net_wt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Rate",
      accessor: "rate_per_gram",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Taxable",
      accessor: "taxable_amount",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
    {
      header: "Item Cost",
      accessor: "item_cost",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
  ];

  const { depositMasterOptionList } = useDepositMaster();

  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.customerDepositReducer
  );
  const { depositMasterInfo } = useSelector(
    (state) => state.depositMasterReducer
  );
  const { searchCustomerList } = useSelector((state) => state.customerReducer);
  const { branches } = useBranches();

  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [estItems, setEstItems] = useState([]);

  const [customer, SetCustomer] = useState();
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [inputType, setInputType] = useState();
  const [isSearching, setIsSearching] = useState(false);
  const [navigateModal, SetNavigateModal] = useState(false);
  const [createMobNum, SetCreateMobNum] = useState();

  const [depositMaster, setDepositMaster] = useState();
  const [payableAmount, setPayableAmount] = useState();
  const [payableWeight, setPayableWeight] = useState();
  const [maturityOn, setMaturityOn] = useState();
  const [totalEstimationAmount, setTotalEstimationAmount] = useState();

  const paymentFormRef = useRef(null);
  const [paymentModeDetails, SetPaymentModeDetails] = useState([]);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
  const [estNo, setEstNo] = useState("");
  const [idBranch, setIdBranch] = useState("");

  const [isSavePaymentDisabled, SetIsSavePaymentDisabled] = useState(false);
  const [isSaveButtonDisabled, SetIsSaveButtonDisabled] = useState(true);

  const deleteEstItem = (ids) => {
    setEstItems((prevState) =>
      prevState?.filter((obj) => obj.est_item_id != ids)
    );
  };

  const handlePaymentData = (data) => {
    SetPaymentModeDetails(data);
    const totalPaidAmount = data?.reduce((sum, item) => {
      return sum + parseFloat(item.payment_amount || 0);
    }, 0);
    setTotalPaymentAmount(totalPaidAmount);
  };

  const toggleNavigateModal = () => SetNavigateModal(!navigateModal);

  const getEstimationDetails = async (est_no = estNo, id_branch = idBranch) => {
    try {
      let requestData = { est_no: est_no, id_branch: id_branch };
      const estimationDetails = await dispatch(
        getEstimationDetailsByNo(requestData)
      );

      console.log(estimationDetails, "estimationDetails");

      const item_details = estimationDetails?.payload?.sales_details || [];
      const purchase_details =
        estimationDetails?.payload?.purchase_details || [];

      purchase_details.forEach((response) => {
        let itemExists = false;
        const estItemDetails = estItems?.filter(
          (result) =>
            result.est_old_metal_item_id === response.est_old_metal_item_id
        );
        if (estItemDetails.length > 0) {
          itemExists = true;
          toastfunc("Estimation already Exists");
        }
        if (!itemExists) {
          setEstItems((prevData) => [...prevData, response]);
        }
      });

      setIdBranch(estimationDetails?.payload?.id_branch);
      SetCustomer(estimationDetails?.payload?.id_customer);
      SetCustomerSearch([
        `${estimationDetails?.payload?.customer_name} ${estimationDetails?.payload?.customer_mobile}`,
      ]);

      setEstNo("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEstNoSearch = () => {
    if (estNo === "") {
      toastfunc("Please Enter the Est No");
    } else if (idBranch === "" || idBranch == null) {
      toastfunc("Please Select the Branch");
    } else {
      getEstimationDetails();
    }
  };

  const navigateCreateCustomer = () => {
    navigate(
      {
        pathname: `${process.env.PUBLIC_URL}/master/customer/add`,
      },
      {
        state: {
          add: true,
          createMobNum: createMobNum,
          navigateLink: `/schememaster/schemeaccount/add`,
        },
      }
    );
  };

  const purchaseAmount = estItems.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );
  const purchaseWeight = estItems.reduce(
    (sum, item) => sum + parseFloat(item.net_wt || 0),
    0
  );

  useEffect(() => {
    if (estItems?.length > 0) {
      setTotalEstimationAmount(purchaseAmount);
      setPayableWeight(parseFloat(purchaseWeight).toFixed(3));
      setPayableAmount(parseFloat(purchaseAmount).toFixed(2));
    }
  }, [estItems, purchaseAmount]);

  useEffect(() => {
    if (customerSearchValue && customerId) {
      SetCustomer(customerId);
      SetCustomerSearch(customerSearchValue);
    }
  }, [customerId, customerSearchValue]);

  // useEffect(() => {
  //   if (
  //     isSearching &&
  //     customerSearch?.length > 0 &&
  //     customerSearch[0]?.label.length >= 5 &&
  //     customer == null
  //   ) {
  //     dispatch(searchCustomer({ mob_num: customerSearch[0]?.label }));
  //   }
  // }, [isSearching, customerSearch, customer, dispatch]);

  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      customerSearch[0]?.label.length >= 5 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
  }, [isSearching, customerSearch, customer, dispatch, inputType]);

  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      customerSearch[0]?.label.length >= 9 &&
      customer == null &&
      searchCustomerList?.length == 0
    ) {
      SetCreateMobNum(customerSearch[0]?.label);
      SetNavigateModal(true);
    }
  }, [isSearching, customerSearch, customer, searchCustomerList]);

  var paymentArrAmount = paymentModeDetails?.reduce(
    (sum, obj) =>
      sum +
      (obj?.payment_amount != null || obj?.payment_amount != ""
        ? parseFloat(obj?.payment_amount)
        : 0),
    0
  );

  const setPaymentDetails = (data) => {
    let paymentModeDetails = [];
    data?.forEach((val) => {
      if (val.payment_amount > 0) {
        paymentModeDetails.push({
          payment_type: 1,
          payment_mode: val.id_mode,
          payment_amount: val.payment_amount,
          card_no: val.card_no !== "" ? val.card_no : null,
          card_holder: val.card_holder !== "" ? val.card_holder : null,
          payment_ref_number:
            val.payment_ref_number !== "" ? val.payment_ref_number : null,
          card_type: val.card_type,
          NB_type: val.id_nb_type !== "" ? val.id_nb_type : null,
          id_bank: val.id_bank !== "" ? val.id_bank : null,
          id_pay_device: val.id_pay_device,
        });
      }
    });
    return paymentModeDetails;
  };

  const saveData = async () => {
    const item_details = estItems?.map((item) => {
      const container = {};
      container.est_old_metal_item_id = item.est_old_metal_item_id;
      container.product = item.id_product;
      container.gross_wt = item.gross_wt;
      container.less_wt = item.less_wt;
      container.net_wt = item.net_wt;
      container.rate = item.rate_per_gram;
      container.amount = item.amount;
      return container;
    });
    const addData = {
      customer: customer,
      deposit: depositMaster,
      branch: idBranch,
      deposit_amount: depositMasterInfo?.type == 1 ? payableAmount : null,
      deposit_weight: depositMasterInfo?.type == 2 ? payableWeight : null,
      start_date: moment(new Date()).format("YYYY-MM-DD"),
      closing_date: moment(maturityOn).format("YYYY-MM-DD"),
      payment_mode_details: setPaymentDetails(paymentModeDetails),
      item_details,
    };
    // console.log(addData);
    try {
      await dispatch(createCustomerDeposits(addData)).unwrap();
      toastsuccess("Customer deposit created successfully");
      navigate(`${process.env.PUBLIC_URL}/master/customer_deposit/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      paymentModeDetails?.length > 0 &&
      parseFloat(payableAmount).toFixed(2) == paymentArrAmount
    ) {
      SetIsSavePaymentDisabled(true);
      SetIsSaveButtonDisabled(false);
    } else {
      SetIsSavePaymentDisabled(false);
      SetIsSaveButtonDisabled(true);
    }
  }, [paymentArrAmount, payableAmount, paymentModeDetails?.length]);

  useEffect(() => {
    if (depositMasterInfo != null) {
      if (depositMasterInfo?.type === 1) {
        setActiveTab("2");
      }
    }
  }, [depositMasterInfo]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      if (id !== undefined) {
        //handleSubmit(putData)();
      } else {
        handleSubmit(saveData)();
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/customer_deposit/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Deposit Master"} />
      <Content>
        <CreateCustomerConfirmation
          modal={navigateModal}
          toggle={toggleNavigateModal}
          title={"Create Customer"}
          mobNum={createMobNum}
          clickAction={navigateCreateCustomer}
        />
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            {add !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(saveData)}
                >
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/master/customer_deposit/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  // onClick={handleSubmit(putData)}
                >
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/master/customer_deposit/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>

          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col md={3}>
                <div className="form-group">
                  <label className="form-label" htmlFor="idBranch">
                    Branch
                    <IsRequired />
                  </label>
                  <BranchDropdown
                    register={register}
                    id={"idBranch"}
                    branches={branches}
                    selectedBranch={idBranch}
                    onBranchChange={setIdBranch}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.idBranch && "Branch is Required"}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="form-control-wrap">
                  <label className="form-label" htmlFor="customerSearch">
                    Customer
                    <IsRequired />
                  </label>
                  <Typeahead
                    id="customerSearch"
                    labelKey="label"
                    onChange={(e) => {
                      if (e?.length > 0) {
                        SetCustomer(e[0]?.value), SetCustomerSearch(e);
                      } else {
                        SetCustomer(null);
                        SetCustomerSearch([]);
                      }
                    }}
                    options={searchCustomerList}
                    placeholder="Choose a customer..."
                    // defaultSelected={customerSearch}
                    selected={customerSearch}
                    onInputChange={(text) => {
                      if (text.length === 0) {
                        SetCustomerSearch([]);
                        setInputType(null);
                        return;
                      }

                      const firstChar = text.charAt(0);
                      if (!inputType) {
                        setInputType(/\d/.test(firstChar) ? "number" : "text");
                      }

                      if (
                        (inputType === "number" && /^\d*$/.test(text)) ||
                        (inputType === "text" && /^[a-zA-Z\s]*$/.test(text))
                      ) {
                        setIsSearching(text.length >= 5);
                        SetCustomerSearch([{ label: text }]);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (inputType === "number" && !/\d/.test(e.key)) {
                        if (
                          ![
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                          ].includes(e.key)
                        ) {
                          e.preventDefault(); // Prevent letters but allow backspace, delete, and arrows
                        }
                      }
                      if (inputType === "text" && /\d/.test(e.key)) {
                        e.preventDefault(); // Prevent typing numbers if inputType is text
                      }
                    }}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="depositMaster">
                    Deposit Master
                    <IsRequired />
                  </label>
                  <DepositMasterDropdown
                    register={register}
                    id={"depositMaster"}
                    depositMasters={depositMasterOptionList}
                    selectedDepositMaster={depositMaster}
                    onDepositMasterChange={(val) => {
                      setDepositMaster(val);
                      dispatch(getDepositMasterById(val));
                      let selectedDepositMaster = depositMasterOptionList?.find(
                        (item) => item?.id_deposit_master === val
                      );
                      const currentDate = new Date();
                      currentDate.setDate(
                        currentDate.getDate() +
                          Number(selectedDepositMaster?.maturity_in_days)
                      );

                      setMaturityOn(currentDate);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={
                      errors.depositMaster && "Deposit Master is Required"
                    }
                  />
                </div>
              </Col>
              <Col md="3">
                <label className="form-label" htmlFor="payable_amount">
                  Payment Amount <IsRequired />
                </label>
                <div className="form-group">
                  <div className="form-control-wrap">
                    <NumberInputField
                      placeholder="Amount"
                      id={"payable_amount"}
                      value={payableAmount}
                      isRequired={true}
                      min={0}
                      type={"number"}
                      readOnly={depositMasterInfo?.type !== 1}
                      setValue={setValue}
                      handleKeyDownEvents={true}
                      handleDecimalDigits={true}
                      decimalValues={0}
                      SetValue={(value) => {
                        setPayableAmount(value);
                        clearErrors("payable_amount");
                      }}
                      minError={"Amount should less than or equal to 0"}
                      maxError={"Amount greater than or equal to 0"}
                      reqValueError={"Amount is Required"}
                      register={register}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col md="3">
                <label className="form-label" htmlFor="payable_weight">
                  Payable Weight <IsRequired />
                </label>
                <div className="form-group">
                  <div className="form-control-wrap">
                    <NumberInputField
                      placeholder="Weight"
                      id={"payable_weight"}
                      value={payableWeight}
                      isRequired={depositMasterInfo?.type !== 1}
                      min={0}
                      type={"number"}
                      readOnly={true}
                      setValue={setValue}
                      handleKeyDownEvents={true}
                      handleDecimalDigits={true}
                      decimalValues={0}
                      SetValue={(value) => {
                        setPayableWeight(value);
                        clearErrors("payable_amount");
                      }}
                      minError={"Weight should less than or equal to 0"}
                      maxError={"Weight greater than or equal to 0"}
                      reqValueError={"Weight is Required"}
                      register={register}
                    />
                  </div>
                </div>
              </Col>
              <Col md="3">
                <div>
                  <label className="form-label" htmlFor="estNo">
                    Estimation{" "}
                  </label>
                  <div className="input-group">
                    <TextInputField
                      register={register}
                      isRequired={false}
                      id={"estNo"}
                      placeholder="Est No"
                      value={estNo}
                      SetValue={(value) => {
                        setEstNo(value);
                      }}
                    />
                    <div
                      className="input-group-append"
                      style={{ height: "29px" }}
                    >
                      <Button
                        outline
                        color="primary"
                        className="btn-dim"
                        onClick={handleEstNoSearch}
                      >
                        <em class="icon ni ni-search"></em>
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="maturityOn">
                    Matured On{" "}
                  </label>
                  <div className="form-control-wrap">
                    <input
                      disabled
                      id="maturityOn"
                      name="maturityOn"
                      placeholder="Payable Weight"
                      className=" form-control"
                      type="text"
                      value={moment(maturityOn).format("DD-MM-YYYY")}
                    />
                  </div>
                  {errors?.maturityOn && (
                    <span className="invalid">{errors.maturityOn.message}</span>
                  )}
                </div>
              </Col>
            </Row>

            <Nav tabs>
              {depositMasterInfo?.type !== 1 && (
                <NavItem>
                  <NavLink
                    tag="a"
                    href="#tab"
                    className={classnames({ active: activeTab === "1" })}
                    onClick={(ev) => {
                      ev.preventDefault();
                      toggle("1");
                    }}
                  >
                    <Icon name="grid-alt-fill" /> <span>Item Details</span>
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                <NavLink
                  tag="a"
                  href="#tab"
                  className={classnames({ active: activeTab === "2" })}
                  onClick={(ev) => {
                    ev.preventDefault();
                    toggle("2");
                  }}
                >
                  <Icon name="grid-alt-fill" /> <span>Payment Details</span>
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
              {depositMasterInfo?.type !== 1 && (
                <TabPane tabId="1">
                  {/* <PreviewTable
                  columns={columns}
                  data={estItems}
                  onDelete={deleteEstItem}
                /> */}

                  <div
                    className="table-responsive"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            S.NO
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Product
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Gross Wt.
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Less Wt.
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Net Wt.
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Rate
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Amount
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {estItems?.map((obj, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{obj?.product_name}</td>
                              <td>
                                {parseFloat(isUndefined(obj?.gross_wt)).toFixed(
                                  3
                                )}
                              </td>
                              <td>
                                {parseFloat(isUndefined(obj?.less_wt)).toFixed(
                                  3
                                )}
                              </td>
                              <td>
                                {parseFloat(isUndefined(obj?.net_wt)).toFixed(
                                  3
                                )}
                              </td>
                              <td>
                                {parseFloat(
                                  isUndefined(obj?.rate_per_gram)
                                ).toFixed(3)}
                              </td>

                              <td>
                                {
                                  <CurrencyDisplay
                                    value={isUndefined(obj?.amount)}
                                  />
                                }
                              </td>

                              <td>
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() =>
                                    deleteEstItem(obj?.est_item_id)
                                  }
                                >
                                  <Icon name="trash-fill" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </TabPane>
              )}
              <TabPane tabId="2">
                <PaymentModeComponent
                  ref={paymentFormRef}
                  onUpdateFormData={handlePaymentData}
                  // onUpdateAdvanceFormData={handleAdvanceAdjustmentData}
                  // onUpdateChitFormData={handleChitAdjustmentData}
                  initialAmountReceived={payableAmount}
                  customer={customer}
                  isAdvanceAdjustment={false}
                  isChitAdjustment={false}
                />
              </TabPane>
            </TabContent>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default CustomerDepositForm;
