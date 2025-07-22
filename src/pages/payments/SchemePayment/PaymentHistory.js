import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  cancelPayments,
  getPaymentHistory,
} from "../../../redux/thunks/payment";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  Icon,
  PreviewCard,
  SaveButton,
  UserAvatar,
} from "../../../components/Component";
import { Badge, Col, Label, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import "../../../assets/css/previewTable.css";
import CheckPaymentHistoryModel from "../../../components/modals/CheckPaymentHistoryModel";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import "../../../components/input/profile-image/ProfileImageUpload.css";
import UserIcon from "../../../images/user.png";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import moment from "moment";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import { userOTPVerify } from "../../../redux/thunks/authUser";
import OTPModal from "../../../components/modals/OtpModel";

const PaymentHistory = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const id = location?.state?.id;
  const historyEditable = location?.state?.historyEditable;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  const { paymentHistoryList } = useSelector(
    (state) => state.paymentMasterReducer
  );
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [paymentData, SetPaymentData] = useState([]);
  const toggle = () => setOpenCancelModal(!openCancelModal);
  const [otpFor, setOtpFor] = useState("6");
  useEffect(() => {
    dispatch(getPaymentHistory({ id_scheme_account: id }));
  }, [dispatch, id]);

  // console.log(paymentHistoryList);

  useEffect(() => {
    SetPaymentData(paymentHistoryList?.payments);
  }, [paymentHistoryList]);

  const [remarks, setRemarks] = useState();

  const [inputOTP, setInputOTP] = useState(["", "", "", "", "", ""]);
  const [otpModal, setOtpModal] = useState(false);

  const otpToggle = () => {
    setOtpModal(!otpModal);
  };

  const columns = [
    { header: "Reciept No", accessor: "receipt_no", textAlign: "center" },
    { header: "Reciept Date", accessor: "entry_date", textAlign: "center" },
    {
      header: "Actual Amount",
      accessor: "payment_amount",
      textAlign: "right",
      is_total_req: true,
      decimal_places: 2,
      is_money_format: true,
    },
    {
      header: "Bonus Amount",
      accessor: "bonus",
      textAlign: "right",
      is_total_req: true,
      decimal_places: 2,
      is_money_format: true,
    },
    {
      header: "Paid Amount",
      accessor: "net_amount",
      textAlign: "right",
      is_total_req: true,
      decimal_places: 2,
      is_money_format: true,
    },
    {
      header: "Paid Weight",
      accessor: "metal_weight",
      textAlign: "right",
      is_total_req: true,
      decimal_places: 3,
    },
    {
      header: "Bonus Weight",
      accessor: "bonus_metal_weight",
      textAlign: "right",
      is_total_req: true,
      decimal_places: 3,
    },
    {
      header: "Total Weight",
      accessor: "accumulate_weight",
      textAlign: "right",
      is_total_req: true,
      decimal_places: 3,
    },
    {
      header: "Metal Rate",
      accessor: "metal_rate",
      textAlign: "right",
      is_total_req: false,
      decimal_places: 2,
      is_money_format: true,
    },
    { header: "Paid From", accessor: "paid_through", textAlign: "center" },
  ];

  const selectionCancel = async (obj, checked) => {
    SetPaymentData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,
            cancel: checked,
          };
        }
        return item;
      })
    );
  };

  const checkSelected = (item) => {
    return item?.cancel == true;
  };

  const calculateTotal = (field) => {
    return paymentData?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns?.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  // console.log(paymentData?.some(checkSelected));

  const CancelPayment = async () => {
    const adddata = {
      setOtpModal,
      cancel_payments: paymentData?.map((obj) => {
        const container = {};
        container.cancel = obj.cancel;
        container.id = obj.id_payment;
        container.cancel_reason = remarks;
        return container;
      }),
    };

    try {
      const response = await dispatch(cancelPayments(adddata)).unwrap();
      console.log(response);
      if (
        response?.message !== undefined &&
        response?.message?.includes("Enter")
      ) {
        toastsuccess(response?.message);
        setOtpModal(true);
      } else {
        toggle();
        toastsuccess("Payment Cancelled  successfully");
        navigate(`${process.env.PUBLIC_URL}/schememaster/schemeaccount/list`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const OTPVerify = async () => {
    const adddata = {
      payment_cancel_otp: inputOTP.join(""),
      cancel_payments: paymentData?.map((obj) => {
        const container = {};
        container.cancel = obj.cancel;
        container.id = obj.id_payment;
        container.cancel_reason = remarks;
        return container;
      }),
    };
    try {
      let response = "";
      response = await dispatch(userOTPVerify(adddata)).unwrap();
      toastsuccess(response?.message);
      setOtpModal(false);
      toggle();
      // toastsuccess("Payment Cancelled  successfully");
      navigate(`${process.env.PUBLIC_URL}/schememaster/schemeaccount/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/schememaster/schemeaccount/list`);
    }
  }, [id, navigate]);

  console.log(paymentData);

  return (
    <React.Fragment>
      <Head title={title ? title : "Payment History"} />
      <Content>
        <OTPModal
          modal={otpModal}
          toggle={otpToggle}
          clickAction={OTPVerify}
          otp={inputOTP}
          setOtp={setInputOTP}
          otpFor={otpFor}
        />
        <PreviewCard className="h-100 form-control-sm">
          <Row md={12}>
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md="4"></Col>
          </Row>

          <div className="">
            <Row lg={12} className={"form-control-sm"}>

              {/* Cus Details */}
              <Col md={6}>
                <div className="custom-grid">
                   <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="closingdate">
                          Cus Image :
                        </label>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="profile-image">
                        {paymentHistoryList?.customer?.cus_img ? (
                          <div className="img-wrap">
                            <img
                              for="imageUpload"
                              src={paymentHistoryList?.customer?.cus_img}
                              alt="Profile"
                            />
                          </div>
                        ) : (
                          <Col lg="4">
                            <Label for="imageUpload">
                              <UserAvatar image={UserIcon} className="xl" />
                            </Label>
                          </Col>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label font-weight-bolder ">
                          Cus Name :
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-control-wrap">
                        <div>{paymentHistoryList?.customer?.firstname}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">Mobile :</label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-control-wrap">
                        <div>{paymentHistoryList?.customer?.mobile}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">DOB :</label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-control-wrap">
                        <div>
                          {paymentHistoryList?.customer?.date_of_birth}
                          {/* {moment(
                            paymentHistoryList?.customer?.date_of_birth
                          ).format("DD-MM-YYYY")} */}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  {/* <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">Address :</label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-control-wrap">
                        <div>{paymentHistoryList?.customer?.address}</div>
                      </div>
                    </Col>
                  </Row> */}
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">Address 1:</label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-control-wrap">
                        <div>{paymentHistoryList?.customer?.address1}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">Address 2:</label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-control-wrap">
                        <div>{paymentHistoryList?.customer?.address2}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">Address 3:</label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-control-wrap">
                        <div>{paymentHistoryList?.customer?.address3}</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Scheme Details */}
              <Col md={6}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">Acc Name :</label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-control-wrap">
                        <div>
                          {paymentHistoryList?.scheme_account?.account_name}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">Scheme Name :</label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-control-wrap">
                        <div>
                          {paymentHistoryList?.scheme_account?.scheme_name}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">A/C No :</label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div>
                        {paymentHistoryList?.scheme_account?.scheme_acc_number}
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">Start Date :</label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div>
                        <div>
                          {moment(
                            paymentHistoryList?.scheme_account?.start_date
                          ).format("DD-MM-YYYY")}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  {paymentHistoryList?.scheme_account?.scheme_type != 2 && (
                    <Row className="form-group row g-4">
                      <Col lg="4">
                        <div className="form-group">
                          <label className="form-label">Paid Ins :</label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div>
                          {paymentHistoryList?.scheme_account?.total_paid_ins}
                        </div>
                      </Col>
                    </Row>
                  )}

                  {paymentHistoryList?.scheme_account?.scheme_type == 2 && (
                    <>
                      <Row className="form-group row g-4">
                        <Col lg="4">
                          <div className="form-group">
                            <label className="form-label">
                              Maturity Date :
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <div>
                            {paymentHistoryList?.scheme_account?.maturity_date}
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col lg="4">
                          <div className="form-group">
                            <label className="form-label">Current Slab :</label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <div>
                            {
                              paymentHistoryList?.scheme_account
                                ?.curr_period_and_interest
                            }
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">Paid Amount :</label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div>
                        {
                          <CurrencyDisplay
                            value={
                              paymentHistoryList?.scheme_account
                                ?.total_net_amount
                            }
                          />
                        }
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">Paid Weight :</label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div>
                        {paymentHistoryList?.scheme_account?.total_metal_weight}
                      </div>
                      {/* <div>
                        {parseFloat(
                          paymentHistoryList?.scheme_account?.total_metal_weight
                        ).toFixed(2)}
                      </div> */}
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Cus image */}
              {/* <Col md={4}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="closingdate">
                          Cus Image :
                        </label>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="profile-image">
                        {paymentHistoryList?.customer?.cus_img ? (
                          <div className="img-wrap">
                            <img
                              for="imageUpload"
                              src={paymentHistoryList?.customer?.cus_img}
                              alt="Profile"
                            />
                          </div>
                        ) : (
                          <Col lg="4">
                            <Label for="imageUpload">
                              <UserAvatar image={UserIcon} className="xl" />
                            </Label>
                          </Col>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col> */}
            </Row>
          </div>

          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={7}></Col>

            <Col md={5} className=" flex">
              <div
                className="form-group action_button "
                style={{ display: "flex" }}
              >
                <div className="form-group">
                  <label className="form-label" style={{ marginTop: "10px" }}>
                    Remarks :
                  </label>
                </div>
                &nbsp; &nbsp;
                <div className="form-control-wrap">
                  <textarea
                    {...register("remarks", {
                      required: "Remarks is required",
                    })}
                    style={{ minHeight: "4vw" }}
                    rows="1"
                    className="form-control form-control-sm"
                    type="text"
                    value={remarks}
                    onChange={(e) => {
                      setRemarks(e.target.value);
                      if (clearErrors) {
                        clearErrors("remarks");
                      }
                    }}
                  />
                  {errors?.remarks && (
                    <span className="invalid">
                      <Icon className={"sm"} name="alert-circle" />
                      {errors.remarks.message}
                    </span>
                  )}
                </div>
                &nbsp;
                <SaveButton
                  disabled={!paymentData?.some(checkSelected)}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(toggle)}
                >
                  Cancel Payment
                </SaveButton>
              </div>
            </Col>
          </Row>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Cancel</th>
                  <th>S.NO</th>
                  {/* <th>Receipt No</th>
                  <th>Receipt Date</th>
                  <th>Actual Amount</th>
                  <th>Bonus</th>
                  <th>Paid Amount</th>
                  <th>Paid Weight</th>
                  <th>Bonus Weight</th>
                  <th>Metal Rate</th>
                  <th>Paid From</th> */}
                  {columns?.map((column, index) => {
                    return (
                      <th key={index} style={{ textAlign: column?.textAlign }}>
                        {column.header}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {paymentData?.map((item, idx) => {
                  return (
                    <tr key={idx}>
                      <td>
                        {historyEditable == true && (
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control form-control-sm"
                              id={`${item?.id_payment}-cancel`}
                              checked={item.cancel}
                              onChange={(e) =>
                                selectionCancel(item, e.target.checked)
                              }
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={`${item?.id_payment}-cancel`}
                            ></label>
                          </div>
                        )}
                      </td>
                      <td>{idx + 1}</td>
                      {columns?.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          style={{ textAlign: column?.textAlign }}
                        >
                          {column.type === "lable" ? (
                            <Badge
                              className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                              color={item["colour"]}
                            >
                              {item[column.accessor]}
                            </Badge>
                          ) : column.type === "image" ? (
                            item[column.accessor] ? (
                              <img
                                // onClick={() =>
                                //   handleImagePreview(item?.preview_images)
                                // }
                                src={item[column.accessor]}
                                alt={column.accessor}
                                style={{
                                  maxWidth: "200px",
                                  maxHeight: "200px",
                                  width: "60px",
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                }}
                              />
                            ) : (
                              <UserAvatar text={item["image_text"]} />
                            )
                          ) : column.is_money_format ? (
                            <CurrencyDisplay value={item[column.accessor]} />
                          ) : column.decimal_places ? (
                            parseFloat(item[column.accessor]).toFixed(
                              column.decimal_places
                            )
                          ) : (
                            item[column.accessor]
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr style={{ fontWeight: "bold" }}>
                  <td>Total</td>
                  <td></td>
                  {columns?.map((column, index) => {
                    return (
                      <td key={index} style={{ textAlign: column?.textAlign }}>
                        {column.is_total_req ? (
                          column.is_money_format ? (
                            <CurrencyDisplay
                              value={calculateTotal(column.accessor)}
                            />
                          ) : (
                            calculateTotal(column.accessor)
                          )
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </PreviewCard>
      </Content>
      <CheckPaymentHistoryModel
        modal={openCancelModal}
        toggle={toggle}
        title={"Cancel Payment"}
        name={"Payment"}
        actionName={"Cancel"}
        clickAction={CancelPayment}
      />
    </React.Fragment>
  );
};

export default PaymentHistory;
