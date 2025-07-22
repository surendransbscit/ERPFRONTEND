/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getSchemeAccountById,
  schemeAccountCloseById,
} from "../../../redux/thunks/scheme";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  BlockTitle,
  CancelButton,
  Col,
  PreviewCard,
  Row,
  SaveButton,
} from "../../../components/Component";
import moment from "moment";
import { Collapse } from "reactstrap";
import logo from "../../../images/sdslogo.jpg";
import { BranchDropdown } from "../../../components/filters/retailFilters";
import { useBranches } from "../../../components/filters/filterHooks";
import { userOTPVerify } from "../../../redux/thunks/authUser";
import OTPModal from "../../../components/modals/OtpModel";
const SchemeCloseAccount = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const id = location?.state?.id;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { schemeAccountInfo } = useSelector(
    (state) => state.schemeAccountReducer
  );
  //scheme close account
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.schemeAccountReducer
  );
  const [isOpen, setIsOpen] = useState(true);

  const collapse = () => {
    setIsOpen(!isOpen);
  };

  const [remarks, setRemarks] = useState("");
  const [branch, SetBranch] = useState();
  const [benefits, SetBenefits] = useState(0);
  const [addDetection, SetAddDetection] = useState(0);
  const [addBenefits, SetAddBenefits] = useState(0);
  const [closingBalance, SetClosingBalance] = useState(0);
  const [paidAmount, SetPaidAmount] = useState(0);
  const [paidWeight, SetPaidWeight] = useState(0);
  const [paidInstallment, SetPaidInstallment] = useState(0);
  const [otpFor, setOtpFor] = useState("7");
  const { branches } = useBranches();

  const [inputOTP, setInputOTP] = useState(["", "", "", "", "", ""]);
  const [otpModal, setOtpModal] = useState(false);

  const otpToggle = () => {
    setOtpModal(!otpModal);
  };

  const closingFunc = () => {
    let close_bal = 0;
    let benfitSum = benefits != "" ? parseFloat(benefits) : 0;
    let addBenfitSum = addBenefits != "" ? parseFloat(addBenefits) : 0;
    let addDetectSum = addDetection != "" ? parseFloat(addDetection) : 0;

    let total_benefits = 0;

    total_benefits =
      parseFloat(schemeAccountInfo?.total_paid_amount) +
      benfitSum +
      addBenfitSum;
    close_bal = parseFloat(total_benefits) - parseFloat(addDetectSum);

    SetClosingBalance(parseFloat(close_bal).toFixed(2));
    return close_bal;
  };

  useEffect(() => {
    if (
      schemeAccountInfo?.paidInstallment < schemeAccountInfo?.total_paid_ins
    ) {
      SetAddDetection(schemeAccountInfo?.closing_deductions || 0);
    }
  }, [schemeAccountInfo?.total_paid_ins, schemeAccountInfo?.pre_close_charges]);

  useEffect(() => {
    closingFunc();
  }, [
    schemeAccountInfo?.total_paid_amount,
    benefits,
    addBenefits,
    addDetection,
    closingFunc,
  ]);

  useEffect(() => {
    if (schemeAccountInfo && schemeAccountInfo != null) {
      SetPaidAmount(schemeAccountInfo?.total_paid_amount);
      SetPaidWeight(schemeAccountInfo?.total_paid_weight);
      SetPaidInstallment(schemeAccountInfo?.paid_installment);
    }
  }, [schemeAccountInfo]);

  useEffect(() => {
    dispatch(getSchemeAccountById(id));
  }, [dispatch, id]);

  const saveData = async () => {
    const adddata = {
      total_paid_ins: paidInstallment,
      closing_balance: closingBalance,
      closing_amount: paidAmount,
      closing_weight: paidWeight,
      closing_id_branch: branch,
      closed_remarks: remarks,
      closing_deductions: addDetection,
      additional_benefits: addBenefits,
      closing_benefits: benefits,
    };
    // console.log(adddata);
    const reduxData = {
      id: id,
      putData: adddata,
      setOtpModal,
    };
    try {
      const response = await dispatch(
        schemeAccountCloseById(reduxData)
      ).unwrap();
      if (
        response?.message !== undefined &&
        response?.message?.includes("Enter")
      ) {
        toastsuccess(response?.message);
        setOtpModal(true);
      } else {
        toastsuccess("Scheme account closed successfully");
        navigate(
          `${process.env.PUBLIC_URL}/schememaster/closedschemeaccount/list`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const OTPVerify = async () => {
    const adddata = {
      sch_id: id,
      total_paid_ins: paidInstallment,
      closing_balance: closingBalance,
      closing_amount: paidAmount,
      closing_weight: paidWeight,
      closing_id_branch: branch,
      closed_remarks: remarks,
      closing_deductions: addDetection,
      additional_benefits: addBenefits,
      closing_benefits: benefits,
      account_close_otp: inputOTP.join(""),
    };
    // console.log(adddata);
    // const reduxData = {
    //   putData: adddata,
    //   setOtpModal,
    // };
    try {
      let response = "";
      response = await dispatch(userOTPVerify(adddata)).unwrap();
      toastsuccess(response?.message);
      setOtpModal(false);
      navigate(
        `${process.env.PUBLIC_URL}/schememaster/closedschemeaccount/list`
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id === undefined) {
      navigate(
        `${process.env.PUBLIC_URL}/schememaster/closedschemeaccount/list`
      );
    }
  }, [id, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Scheme Account"} />
      <Content>
        <OTPModal
          modal={otpModal}
          toggle={otpToggle}
          clickAction={OTPVerify}
          otp={inputOTP}
          setOtp={setInputOTP}
          otpFor={otpFor}
        />
        <BlockTitle tag="h6" className="fw-normal">
          {(title ? title : "Scheme Account") + " Close"}
        </BlockTitle>

        <PreviewCard className="h-100">
          <div className="gy-3">
            <Row className="g-3 align-center">
              <Col lg="1"></Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="accname">
                    Account Name :
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-control-wrap">
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    value="shyam"
                    disabled
                  />
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="closingdate">
                    Closing Date :
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  value={moment(new Date()).format("DD-MM-YYYY")}
                  disabled
                />
              </Col>
            </Row>

            <div className="gy-3 gx-3">
              <div className="accordion">
                <div className="accordion-item">
                  <div
                    className="accordion-head collapsed"
                    onClick={() => collapse()}
                  >
                    <Col lg="1"></Col>
                    <h6 className="title">Account Details</h6>
                    <span className="accordion-icon"></span>
                  </div>
                  <Collapse className="accordion-body" isOpen={isOpen == true}>
                    <div className="accordion-inner">
                      <div className="gy-3">
                        <Row className="g-3 align-center">
                          <Col lg="1"></Col>
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">
                                Customer Name :
                              </label>
                            </div>
                          </Col>
                          <Col lg="2">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                value={
                                  schemeAccountInfo?.id_customer?.firstname
                                }
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg="1">
                            <div className="form-group">
                              <label className="form-label">Account No :</label>
                            </div>
                          </Col>
                          <Col lg="2">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                value={schemeAccountInfo?.scheme_acc_number}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">Mobile No :</label>
                            </div>
                          </Col>
                          <Col lg="2">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                value={schemeAccountInfo?.id_customer?.mobile}
                                disabled
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className="g-3 align-center">
                          <Col lg="1"></Col>
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">Start Date :</label>
                            </div>
                          </Col>
                          <Col lg="2">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                value={schemeAccountInfo?.start_date}
                                disabled
                              />
                            </div>
                          </Col>
                          {schemeAccountInfo?.scheme_type == 2 && (
                            <>
                              <Col lg="2">
                                <div className="form-group">
                                  <label className="form-label">
                                    Maturity Date :
                                  </label>
                                </div>
                              </Col>
                              <Col lg="2">
                                <div className="form-control-wrap">
                                  <input
                                    className="form-control form-control-sm"
                                    type="text"
                                    value={schemeAccountInfo?.maturity_date}
                                    disabled
                                  />
                                </div>
                              </Col>
                            </>
                          )}
                          <Col lg="1">
                            <div className="form-group">
                              <label className="form-label">
                                Scheme Name :
                              </label>
                            </div>
                          </Col>
                          <Col lg="2">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                value={schemeAccountInfo?.account_name}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">
                                Installments :
                              </label>
                            </div>
                          </Col>
                          <Col lg="2">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                value={schemeAccountInfo?.paid_installment}
                                disabled
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className="g-3 align-center">
                          <Col lg="1"></Col>
                          <Col lg="2">
                            <div className="form-group">
                              <label className="form-label">
                                Paid Amount :
                              </label>
                            </div>
                          </Col>
                          <Col lg="2">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                value={schemeAccountInfo?.total_paid_amount}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg="1">
                            <div className="form-group">
                              <label className="form-label">
                                Paid Weight :
                              </label>
                            </div>
                          </Col>
                          <Col lg="2">
                            <div className="form-control-wrap">
                              <input
                                className="form-control form-control-sm"
                                type="text"
                                value={schemeAccountInfo?.total_paid_weight}
                                disabled
                              />
                            </div>
                          </Col>
                          {/* <Col lg="2">
                            <div className="form-group">
                              <label className="form-label" htmlFor="closingdate">
                                Customer Image :
                              </label>
                            </div>
                          </Col>
                          <Col lg="2">
                            <img
                              height={150}
                              width={150}
                              src={schemeAccountInfo?.id_customer?.cus_img}
                              // src={logo}
                              className="rounded -mt-2"
                              alt="cus img"
                            />
                          </Col> */}
                        </Row>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
            </div>

            <div className="gy-3">
              <Row className="g-3 align-center">
                <Col lg="1"></Col>
                <Col lg="2">
                  <div className="form-group">
                    <label className="form-label">Total amount paid :</label>
                  </div>
                </Col>
                <Col lg="2">
                  <div className="form-control-wrap">
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      value={schemeAccountInfo?.total_paid_amount}
                      disabled
                    />
                  </div>
                </Col>
                <Col lg="1">
                  <div className="form-group">
                    <label className="form-label">Benefits :</label>
                  </div>
                </Col>
                <Col lg="2">
                  <div className="form-control-wrap">
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      value={benefits}
                      onChange={(e) => SetBenefits(e.target.value)}
                    />
                  </div>
                </Col>
                <Col lg="2">
                  <div className="form-group">
                    <label className="form-label">Additional Detection :</label>
                  </div>
                </Col>
                <Col lg="2">
                  <div className="form-control-wrap">
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      value={addDetection}
                      onChange={(e) => SetAddDetection(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="g-3 align-center">
                <Col lg="1"></Col>
                <Col lg="2">
                  <div className="form-group">
                    <label className="form-label">Additional Benefits :</label>
                  </div>
                </Col>
                <Col lg="2">
                  <div className="form-control-wrap">
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      value={addBenefits}
                      onChange={(e) => SetAddBenefits(e.target.value)}
                    />
                  </div>
                </Col>
                <Col lg="1">
                  <div className="form-group">
                    <label className="form-label">Closing balance :</label>
                  </div>
                </Col>
                <Col lg="2">
                  <div className="form-control-wrap">
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      value={closingBalance}
                      readOnly
                    />
                  </div>
                </Col>
                <Col lg="2">
                  <div className="form-group">
                    <label className="form-label">Branch :</label>
                  </div>
                </Col>
                <Col lg="2">
                  <div className="form-control-wrap">
                    <BranchDropdown
                      register={register}
                      id={"branch"}
                      branches={branches}
                      selectedBranch={branch}
                      onBranchChange={SetBranch}
                      isRequired={true}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      message={errors.branch && "Branch is Required"}
                    ></BranchDropdown>
                  </div>
                </Col>
              </Row>
              <Row className="g-3 align-center">
                <Col lg="1"></Col>
                <Col lg="2">
                  <div className="form-group">
                    <label className="form-label">Remarks :</label>
                  </div>
                </Col>
                <Col lg="5">
                  <div className="form-control-wrap">
                    <textarea
                      className="form-control form-control-sm"
                      type="text"
                      rows={0}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            <Row className="gy-3">
              <Col className="">
                <div className="form-group mt-2">
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
                        `${process.env.PUBLIC_URL}/schememaster/schemeaccount/list`
                      )
                    }
                  >
                    Cancel
                  </CancelButton>
                </div>
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default SchemeCloseAccount;
