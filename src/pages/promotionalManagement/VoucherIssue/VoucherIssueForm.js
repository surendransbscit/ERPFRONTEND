/* eslint-disable no-unused-expressions */
import React, { useEffect, useRef, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
  PreviewCard,
  SaveButton,
  DateInputField,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Icon,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import {
  createVoucherIssue,
  getGiftVoucherById,
  getVoucherIssueById,
  updateVoucherIssueById,
} from "../../../redux/thunks/promotionManagement";
import {
  useEmployeeDropdown,
  useSupplierFilter,
  useVouchers,
} from "../../../components/filters/filterHooks";
import {
  ActiveEmployeeDropdown,
  GiftVoucherDropdown,
  SupplierDropdown,
} from "../../../components/filters/retailFilters";
import PaymentModeComponent from "../../../components/common/payment/PaymentModeComponent";

import { Typeahead } from "react-bootstrap-typeahead";
import { searchCustomer } from "../../../redux/thunks/customer";
import secureLocalStorage from "react-secure-storage";

const VoucherIssueForm = () => {
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
    userInfo,
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);

  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.promotionManagementVoucherIssueReducer
  );
  const { promotionManagementVoucherIssueInfo } = useSelector(
    (state) => state.promotionManagementVoucherIssueReducer
  );

  const { promotionManagementGiftVoucherInfo } = useSelector(
    (state) => state.promotionManagementGiftVoucherReducer
  );

  const { searchCustomerList } = useSelector((state) => state.customerReducer);
  const customerSearchValue = location?.state?.customerSearchValue;
  const customerId = location?.state?.customerId;
  const [customerDetails, setCustomerDetails] = useState({});

  const [navigateModal, SetNavigateModal] = useState(false);
  const [inputType, setInputType] = useState();
  const [navigateModalOpened, setNavigateModalOpened] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [createMobNum, SetCreateMobNum] = useState();

  const [vouchers, setVouchers] = useState();
  const [noOfCoupons, setNoOfCoupons] = useState(1);
  const [amount, setAmount] = useState();
  const [voucherAmount, setVoucherAmount] = useState(0);
  const [employee, SetEmployee] = useState();
  const [idSupplier, setIdSupplier] = useState("");
  const [customer, SetCustomer] = useState();

  const [customerSearch, SetCustomerSearch] = useState([]);

  const [checkAmount, setCheckAmount] = useState(false);
  const [paymentModeData, setPaymentModeData] = useState([]);
  const [payableAmount, setPayableAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);

  const { giftVoucherrOptionList } = useVouchers();
  const { employees } = useEmployeeDropdown();
  const { supplier } = useSupplierFilter();

  const paymentFormRef = useRef(null);

  const handlePaymentData = (data) => {
    setPaymentModeData(data);
    const totalPaidAmount = data.reduce((sum, item) => {
      return sum + parseFloat(item.payment_amount || 0);
    }, 0);
    if (parseFloat(totalPaidAmount) > parseFloat(payableAmount)) {
      setCheckAmount(true);
      toastfunc("Entered amount exceeded Payable amount");

      let blnc = parseFloat(payableAmount) - parseFloat(totalPaidAmount);
      setBalanceAmount(blnc);
    } else {
      let blnc = parseFloat(payableAmount) - parseFloat(totalPaidAmount);
      setBalanceAmount(blnc);

      setTotalPaymentAmount(totalPaidAmount);
    }
  };

  const setPaymentDetails = (data, refundAmount) => {
    let paymentModeDetails = [];
    data.forEach((val) => {
      if (val.payment_amount > 0) {
        paymentModeDetails.push({
          // payment_type: parseFloat(refundAmount) > 0 ? 2 : 1,
          payment_type: 1,
          id_mode: val.id_mode,
          short_code: val.short_code,
          payment_amount: val.payment_amount,
          card_no: val.card_no,
          card_holder: val.card_holder,
          payment_ref_number: val.payment_ref_number,
          card_type: val.card_type,
          id_nb_type: val.id_nb_type !== "" ? val.id_nb_type : null,
          id_bank: val.id_bank !== "" ? val.id_bank : null,
          id_pay_device: val.id_pay_device,
        });
      }
    });
    return paymentModeDetails;
  };

  const postData = async () => {
    const addData = {
      voucher: vouchers,
      customer: customer ? customer : null,
      employee: employee ? employee : null,
      supplier: idSupplier ? idSupplier : null,
      notes: "const",
      amount: voucherAmount,
      no_of_coupons: noOfCoupons,
      payment_mode_details: setPaymentDetails(paymentModeData),
    };
    console.log(addData);

    try {
      let response = await dispatch(createVoucherIssue(addData)).unwrap();
      toastsuccess(response.message);
      let data = {
        settings: settings,
        itemDetails: response.print_data,
      };
      // console.log(data);
      secureLocalStorage.setItem("pageState", JSON.stringify(data));
      window.open(
        `${process.env.PUBLIC_URL}/promotion_management/voucher_issue/print`,
        "_blank"
      );
      // toastsuccess("Voucher Issue Edited successfully");
      navigate(
        `${process.env.PUBLIC_URL}/promotional_management/voucher_issue/list`
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getVoucherIssueById(id));
  }, [dispatch, id]);

  useEffect(() => {
    promotionManagementVoucherIssueInfo !== null &&
      setVouchers(promotionManagementVoucherIssueInfo?.vouchers);
    reset();
  }, [promotionManagementVoucherIssueInfo, reset]);

  const putData = async () => {
    const addData = {};
    const reduxData = {
      id: id,
      putData: addData,
    };
    try {
      await dispatch(updateVoucherIssueById(reduxData)).unwrap();
      toastsuccess(" Voucher Issue Edited successfully");
      navigate(
        `${process.env.PUBLIC_URL}/promotional_management/voucher_issue/list`
      );
    } catch (error) {
      console.error(error);
    }
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      if (id !== undefined) {
        handleSubmit(putData)();
      } else {
        handleSubmit(postData)();
      }
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  useEffect(() => {
    if (promotionManagementGiftVoucherInfo?.voucher_amount) {
      setVoucherAmount(promotionManagementGiftVoucherInfo.voucher_amount);
    }
  }, [promotionManagementGiftVoucherInfo]);

  const handleCouponChange = (value) => {
    setNoOfCoupons(value);
    const total = parseFloat(value || 0) * parseFloat(voucherAmount || 0);
    setAmount(total.toFixed(2));
    setPayableAmount(total.toFixed(2));
  };

  useEffect(() => {
    const total = parseFloat(noOfCoupons || 0) * parseFloat(voucherAmount || 0);
    setAmount(total.toFixed(2));
    setPayableAmount(total.toFixed(2));
  }, [noOfCoupons, voucherAmount]);

  useEffect(() => {
    if (customerSearchValue && customerId) {
      SetCustomerSearch(customerSearchValue);
      SetCustomer(customerId);
    }
  }, [customerSearchValue, customerId]);

  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      inputType === "text" &&
      customerSearch[0]?.label.length > 0 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      inputType === "number" &&
      customerSearch[0]?.label.length >= 5 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
  }, [isSearching, customerSearch, customer, dispatch, inputType]);

  // useEffect(() => {
  //   if (customerSearch?.length > 0) {
  //     const inputValue = customerSearch[0]?.label;

  //     // Detect input type when user starts typing
  //     if (!inputType) {
  //       setInputType(/^\d/.test(inputValue) ? "number" : "text");
  //     }

  //     if (
  //       inputType === "number" &&
  //       isSearching &&
  //       inputValue.length >= 10 &&
  //       customer == null &&
  //       searchCustomerList?.length == 0 &&
  //       !navigateModalOpened
  //     ) {
  //       console.log("Opening Modal...");
  //       SetCreateMobNum(inputValue);
  //       SetNavigateModal(true);
  //       setNavigateModalOpened(true);
  //     }

  //     if (inputValue.length < 10) {
  //       setNavigateModalOpened(false);
  //     }
  //   }
  // }, [isSearching, customerSearch, customer, searchCustomerList, inputType]);

  // console.log(promotionManagementGiftVoucherInfo?.issued_to);

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(
        `${process.env.PUBLIC_URL}/promotional_management/voucher_issue/list`
      );
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : " Voucher Issue"} />
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={1}></Col>
            {add !== undefined && (
              <Col md={6} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postData(data, "saveAndClose")
                  )}
                >
                  {issubmitting ? "Saving" : "Save [Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/promotional_management/voucher_issue/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={6} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(putData)}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/promotional_management/voucher_issue/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>

          <div className="custom-grid">
            <Row lg={12} className={"form-control-sm"}>
              <Col md={6}>
                <div className="custom-grid">
                  <Row md={12} className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="vouchers">
                          Vouchers
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <GiftVoucherDropdown
                          register={register}
                          id={"vouchers"}
                          giftVouchers={giftVoucherrOptionList}
                          selectedGiftVoucher={vouchers}
                          onGiftVoucherChange={(val) => {
                            setVouchers(val);
                            dispatch(getGiftVoucherById(val));
                          }}
                          isRequired={true}
                          clearErrors={clearErrors}
                          setValue={setValue}
                          message={errors.vouchers && "Vouchers is Required"}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="vouchers">
                          Vouchers Type :
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="d-flex align-items-center justify-content-between">
                        <h6 className="mb-0">
                          {promotionManagementGiftVoucherInfo &&
                            (promotionManagementGiftVoucherInfo.voucher_type ===
                            "1"
                              ? "Free"
                              : promotionManagementGiftVoucherInfo.voucher_type ===
                                "2"
                              ? "Paid"
                              : "")}
                        </h6>
                        <div>
                          <span>Amount:</span>
                          <input
                            className="form-control form-control-sm w-auto"
                            style={{ textAlign: "right", width: "20px" }}
                            readOnly
                            value={voucherAmount || 0}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {promotionManagementGiftVoucherInfo?.issued_to != 4 && (
                    <Row md={12} className="form-group row g-4">
                      <Col lg="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="noOfCoupons">
                            Issued to
                            <IsRequired />
                          </label>
                        </div>
                      </Col>

                      {promotionManagementGiftVoucherInfo?.issued_to == 1 && (
                        <Col lg="8">
                          <div className="form-control-wrap">
                            <Typeahead
                              id="customerSearch"
                              labelKey="label"
                              onChange={(e) => {
                                if (e?.length > 0) {
                                  SetCustomer(e[0]?.value);
                                  SetCustomerSearch(e);
                                } else {
                                  SetCustomer(null);
                                  SetCustomerSearch([]);
                                  setInputType(null); // Reset input type when cleared
                                }
                              }}
                              options={searchCustomerList}
                              placeholder="Choose a customer..."
                              selected={customerSearch}
                              onInputChange={(text) => {
                                if (text.length === 0) {
                                  SetCustomerSearch([]);
                                  setInputType(null);
                                  return;
                                }

                                const firstChar = text.charAt(0);
                                if (!inputType) {
                                  setInputType(
                                    /\d/.test(firstChar) ? "number" : "text"
                                  );
                                }

                                if (
                                  inputType === "number" &&
                                  /^\d*$/.test(text)
                                ) {
                                  setIsSearching(text.length >= 5);
                                  SetCustomerSearch([{ label: text }]);
                                }
                                if (
                                  inputType === "text" &&
                                  /^[a-zA-Z\s]*$/.test(text)
                                ) {
                                  setIsSearching(text.length > 0);
                                  SetCustomerSearch([{ label: text }]);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (
                                  inputType === "number" &&
                                  !/\d/.test(e.key)
                                ) {
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
                      )}

                      {promotionManagementGiftVoucherInfo?.issued_to == 2 && (
                        <Col lg="8">
                          <div className="form-group ">
                            <ActiveEmployeeDropdown
                              register={register}
                              id={"employee"}
                              selectedEmployee={employee}
                              onEmployeeChange={SetEmployee}
                              isRequired={false}
                              options={employees}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              // message={errors.employee && "Employee is Required"}
                            />
                          </div>
                        </Col>
                      )}

                      {promotionManagementGiftVoucherInfo?.issued_to == 3 && (
                        <Col lg="8">
                          <div className="form-group ">
                            <SupplierDropdown
                              register={register}
                              id={"idSupplier"}
                              supplier={supplier}
                              isRequired={false}
                              selectedSupplier={idSupplier}
                              onSupplierChange={setIdSupplier}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              // message={errors.idSupplier && "Supplier is Required"}
                            ></SupplierDropdown>
                          </div>
                        </Col>
                      )}
                    </Row>
                  )}

                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="noOfCoupons">
                          No of Coupons
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group ">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"noOfCoupons"}
                          placeholder="No of Coupons"
                          value={noOfCoupons}
                          SetValue={(val) => {
                            setNoOfCoupons(val);
                          }}
                          isDisabled={
                            promotionManagementGiftVoucherInfo?.voucher_type ===
                            "2"
                          }
                        />
                      </div>
                      {errors?.noOfCoupons && (
                        <span className="text-danger">
                          <Icon className={"sm"} name="alert-circle" />
                          {"This field is required"}
                        </span>
                      )}
                    </Col>
                  </Row>

                  {promotionManagementGiftVoucherInfo?.voucher_type == 2 && (
                    <Row md={12} className="form-group row g-4">
                      <Col lg="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="amount">
                            Amount
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <TextInputField
                            register={register}
                            // isRequired={true}
                            id={"amount"}
                            placeholder="Amount"
                            value={amount}
                            // SetValue={setAmount}
                            readOnly
                            isDisabled={true}
                          />
                          {/* {errors?.amount && (
                          <span className="text-danger">
                            <Icon className={"sm"} name="alert-circle" />
                            {"This field is required"}
                          </span>
                        )} */}
                        </div>
                      </Col>
                    </Row>
                  )}
                </div>
              </Col>

              {promotionManagementGiftVoucherInfo?.voucher_type == 2 && (
                <Col md={6}>
                  <div className="custom-grid">
                    <PaymentModeComponent
                      ref={paymentFormRef}
                      isGifts={false}
                      onUpdateFormData={handlePaymentData}
                      // onUpdateAdvanceFormData={handleAdvanceAdjustmentData}
                      // onUpdateChitFormData={handleChitAdjustmentData}
                    />
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default VoucherIssueForm;
