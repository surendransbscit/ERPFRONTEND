import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Button,
  Table,
} from "reactstrap";
import classnames from "classnames";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { BranchDropdown } from "../../components/filters/retailFilters";
import IsRequired from "../../components/erp-required/erp-required";
import { useForm } from "react-hook-form";
import { useBranches } from "../../components/filters/filterHooks";
import { useSelector, useDispatch } from "react-redux";
import {
  approveEstimation,
  estimationDetailsPrint,
  getEstimationApprovalList,
} from "../../redux/thunks/estimation";
import { formatCurrencyInINR } from "../../components/common/moneyFormat/moneyFormat";
import {
  toastfunc,
  toastsuccess,
} from "../../components/sds-toast-style/toast-style";
import { Icon, PreviewCard, TextInputField } from "../../components/Component";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useLocation, useNavigate } from "react-router";
import { alignProperty } from "@mui/material/styles/cssUtils";
import PaymentModeComponent from "../../components/common/payment/PaymentModeComponent";
import getCurrencySymbol from "../../components/common/moneyFormat/currencySymbol";
import {
  calculateItemDiscountAmount,
  isUndefined,
} from "../../components/common/calculations/ErpCalculations";
import {
  setSalesItem,
  setEditChargeDetails,
} from "../../components/common/salesForm/salesUtils";
import {
  useCategories,
  useCurrentMetalRate,
  useMetalPurityRate,
  useProducts,
  useDiamondRate,
  useCatPurityRate,
} from "../../components/filters/filterHooks";
import { createInvoice } from "../../redux/thunks/billing";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { useSocket } from "../../contexts/SocketContext";
import { getPagePermission } from "../../redux/thunks/coreComponent";

const ApprovalEstimationForm = () => {
  const location = useLocation()
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [approvalList, setApprovalList] = useState([]);
  const [idBranch, setIdBranch] = useState("");
  const [estCode, setEstCode] = useState();
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const { branches } = useBranches();
  const paymentFormRef = useRef(null);
  const { diamondRate } = useDiamondRate();
  const socket = useSocket();

  const { isLoading: isSubmitting, estimationApprovalList } = useSelector(
    (state) => state.estReducer
  );
  //PAYMENT
  // const { metalRateInfo } = useSelector((state) => state.metalRateReducer);
  // const { metalPurityRateList } = useSelector((state) => state.metalPurityRateReducer);
  // const { categoryList } = useSelector((state) => state.categoryReducer);
  // const { activeProductList } = useSelector((state) => state.productReducer);
  // const { mcVaSetiings } = useMcVaSetiings();
  const { categories } = useCategories();
  const { metalRates } = useCurrentMetalRate();
  const { products } = useProducts();
  const { metalPurityRate } = useMetalPurityRate();
  const { catPurityRate } = useCatPurityRate();
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);

  const pathName = location?.pathname;
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    if (
      pagePermission?.add === false ||
      pagePermission === undefined ||
      pagePermission === null
    ) {
      navigate(`${process.env.PUBLIC_URL}/`);
    }
  }, [pagePermission, navigate]);

  const calculateDiscountAmount = (item_details, totalDiscount) => {
    let salesDetails = [];
    item_details.forEach((response) => {
      let initialState = setSalesItem(
        response,
        categories,
        metalPurityRate,
        metalRates,
        products,
        catPurityRate,
        settings,
        diamondRate
      );
      salesDetails.push(initialState);
    });
    const salesAmount = salesDetails.reduce(
      (sum, item) => sum + parseFloat(item.itemCost || 0),
      0
    );

    let updateSalesItemData = calculateItemDiscountAmount(
      salesDetails,
      totalDiscount,
      products,
      salesAmount
    );

    updateSalesItemData = createSalesItemData(
      updateSalesItemData,
      "",
      item_details
    );

    return updateSalesItemData;

    // console.log(updateSalesItemData);

    // setSalesItemData(updateSalesItemData);
  };
  const createSalesItemData = (sales_details, employee = "", item_details) => {
    let postData = [];
    console.log(sales_details);
    sales_details.forEach((value) => {
      let oldData = item_details.find(
        (i) => i.est_item_id == value?.est_item_id
      );
      postData.push({
        ...oldData,
        other_metal_detail: value.other_metal_details,
        wastage_percentage: isUndefined(value.wastagePercentage),
        wastage_weight: isUndefined(value.wastageWeight),
        mc_type: value.mcType,
        mc_value: isUndefined(value.mcValue),
        rate_per_gram: isUndefined(value.ratePerGram),
        taxable_amount: isUndefined(value.taxableAmount),
        tax_group_id: value.tax_id,
        tax_type: value.taxType,
        tax_percentage: isUndefined(value.taxPercentage),
        tax_amount: isUndefined(value.taxAmount),
        cgst_cost: isUndefined(value.cgst),
        sgst_cost: isUndefined(value.sgst),
        igst_cost: isUndefined(value.igst),
        discount_amount: isUndefined(value.discountAmount),
        item_cost: isUndefined(value.itemCost),
        wastage_discount: isUndefined(value.vaDiscount),
        mc_discount_amount: isUndefined(value.mcDiscount),
        wastage_percentage_after_disc: isUndefined(value.wastageAfterDiscount),
        status: 1,
        is_delivered: 1,
      });
    });

    return postData;
  };
  const setEstSalesDetails = (sales_details) => {
    let postData = [];
    console.log(sales_details);
    sales_details.forEach((value) => {
      // let oldData = item_details.find((i)=> i.est_item_id == value?.est_item_id )
      postData.push({
        est_item_id: value.est_item_id,
        taxable_amount: isUndefined(value.taxable_amount),
        tax_percentage: isUndefined(value.tax_percentage),
        tax_amount: isUndefined(value.tax_amount),
        cgst_cost: isUndefined(value.cgst_cost),
        sgst_cost: isUndefined(value.sgst_cost),
        igst_cost: isUndefined(value.igst_cost),
        discount_amount: isUndefined(value.discount_amount),
        item_cost: isUndefined(value.item_cost),
        wastage_discount: isUndefined(value.wastage_discount),
        mc_discount_amount: isUndefined(value.mc_discount_amount),
        wastage_percentage_after_disc: parseFloat(
          isUndefined(value.wastage_percentage_after_disc)
        ).toFixed(2),
      });
    });

    return postData;
  };
  const handelChange = (index, field, value) => {
    if (field == "discount") {
      setApprovalList((prevValues) => {
        const updatedValues = [...prevValues];
        const updatedObject = { ...updatedValues[index] };
        // updatedObject[field] = value;
        value = isUndefined(value);
        let updatedSalesDetails = calculateDiscountAmount(
          updatedObject.sales_details,
          value
        );
        const salesAmount = updatedSalesDetails.reduce(
          (sum, item) => sum + parseFloat(item.item_cost || 0),
          0
        );
        let net_amount =
          parseFloat(salesAmount) - parseFloat(updatedObject.purchase_amount);
        const roundOffBillAmount = Math.round(net_amount);
        const roundOffAmount = parseFloat(net_amount) - roundOffBillAmount;
        net_amount = roundOffBillAmount;
        updatedValues[index] = {
          ...updatedObject,
          sales_details: updatedSalesDetails,
          sales_amount: salesAmount,
          net_amount: net_amount,
          totalAmountReceived: net_amount,
          total_discount_amount: value,
          round_off: roundOffAmount,
        };
        console.log(updatedValues);

        return updatedValues;
      });
    } else {
      setApprovalList((prevValues) => {
        const updatedValues = [...prevValues];
        const updatedObject = { ...updatedValues[index] };
        updatedObject[field] = value;
        updatedValues[index] = updatedObject;

        return updatedValues;
      });
    }
  };

  useEffect(() => {
    setApprovalList(estimationApprovalList?.data);
  }, [estimationApprovalList]);

  useEffect(() => {
    if (idBranch !== "") {
      dispatch(getEstimationApprovalList({ id_branch: idBranch }));
    }
  }, [idBranch]);

  const approveEst = async (id, is_approved, estDetails) => {
    try {
      await dispatch(
        approveEstimation({
          est_id: id,
          is_approved: is_approved,
          estDetails: estDetails,
          sales_details: setEstSalesDetails(estDetails.sales_details),
        })
      ).unwrap();
      if (is_approved == 1) {
        toastsuccess("Estimation Approved successfully");
      } else {
        toastfunc("Estimation Rejected successfully");
      }
      dispatch(getEstimationApprovalList({ id_branch: idBranch }));
    } catch (error) {
      console.error(error);
    }
  };

  // PAYMENT
  const handlePaymentData = (data, index) => {
    //setPaymentModeData(data);
    const totalPaidAmount = data.reduce((sum, item) => {
      return sum + parseFloat(item.payment_amount || 0);
    }, 0);
    //setTotalPaymentAmount(totalPaidAmount);
    handelChange(index, "paymentModeData", data);
    handelChange(index, "totalPaidAmount", totalPaidAmount);
    updateBalanceDetail(index);
  };

  const handleAdvanceAdjustmentData = (data, index) => {
    // setAdvanceAdjustedData(data);
    const advanceAdjAmount = data?.reduce((sum, item) => {
      return sum + parseFloat(item.utilized_amount || 0);
    }, 0);
    // setTotalAdjustedAmount(advanceAdjAmount);
    handelChange(index, "advanceAdjustedData", data);
    handelChange(index, "advanceAdjAmount", advanceAdjAmount);
    updateBalanceDetail(index);
  };

  const handleChitAdjustmentData = (data, index) => {
    // setChitAdjustedData(data);
    const chitAdjAmount = data?.reduce((sum, item) => {
      return sum + parseFloat(item.amount || 0);
    }, 0);
    // setTotalChitAdjustedAmount(chitAdjAmount);
    handelChange(index, "chitAdjustedData", data);
    handelChange(index, "chitAdjAmount", chitAdjAmount);
    updateBalanceDetail(index);
  };

  const setSalesDetails = (sales_details) => {
    let postData = [];
    console.log(sales_details);
    sales_details.forEach((value) => {
      postData.push({
        ...value,
        other_metal_detail: value.other_metal_details,
        order_detail: value?.detail_id ? value?.detail_id : "",
        charges_details:
          value.charges_details.length > 0
            ? setEditChargeDetails(value.charges_details)
            : [],
      });
    });

    return postData;
  };
  const setPaymentDetails = (data, refundAmount) => {
    let paymentModeDetails = [];
    data.forEach((val) => {
      if (val.payment_amount > 0) {
        paymentModeDetails.push({
          payment_type: parseFloat(refundAmount) > 0 ? 2 : 1,
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

  const updateBalanceDetail = (index) => {
    let balance_amount = 0;
    let data = approvalList[index];
    let totalAmountReceived = data.totalAmountReceived;
    let totalPaymentAmount = data.totalPaidAmount;
    let totalAdjustedAmount = data.advanceAdjAmount;
    let totalChitAdjustedAmount = data.chitAdjAmount;
    let depositAmount = 0;
    let refundAmount = 0;

    if (totalAmountReceived > 0) {
      balance_amount = parseFloat(
        parseFloat(isUndefined(totalAmountReceived)) -
          parseFloat(
            isUndefined(totalPaymentAmount) +
              parseFloat(isUndefined(totalAdjustedAmount)) +
              parseFloat(isUndefined(totalChitAdjustedAmount))
          )
      ).toFixed(2);
    } else {
      balance_amount = parseFloat(
        parseFloat(isUndefined(refundAmount)) -
          parseFloat(isUndefined(totalPaymentAmount)) -
          parseFloat(
            isUndefined(depositAmount) -
              parseFloat(isUndefined(totalAdjustedAmount)) -
              parseFloat(isUndefined(totalChitAdjustedAmount))
          )
      ).toFixed(2);
    }
    handelChange(index, "balanceAmount", balance_amount);
  };

  const onClickSave = (formData) => {
    if (formData.id_branch === "" || formData.id_branch === null) {
      toastfunc("Please Select Branch");
    } else if (
      formData.sales_details.length === 0 &&
      formData.purchase_details.length === 0 &&
      formData.return_details.length === 0
    ) {
      toastfunc("Please Add the Item Details");
    } else if (
      formData.id_customer === "" ||
      formData.id_customer === null ||
      formData.id_customer === undefined
    ) {
      toastfunc("Please Select the Customer");
    } else if (
      formData.id_employee === "" ||
      formData.id_employee === null ||
      formData.id_employee === undefined
    ) {
      toastfunc("Please Select the Employee");
    }
    // else if (
    //   invoiceFor == "2"
    //     ? gstNumber === "" ||
    //       gstNumber === null ||
    //       gstNumber === undefined ||
    //       panNumber === "" ||
    //       panNumber === null ||
    //       panNumber === undefined
    //     : false
    // ) {
    //   toastfunc("Please Enter Pan No and Gst No");
    // }
    else if (
      formData.paymentModeData.length > 0 &&
      validateCashLimit(formData.paymentModeData)
    ) {
    } else {
      // setIsSubmitted(true);
      let dueAmount =
        parseFloat(isUndefined(formData.net_amount)) > 0
          ? parseFloat(
              parseFloat(isUndefined(formData.net_amount)) -
                parseFloat(isUndefined(formData.totalAmountReceived))
            ).toFixed(2)
          : 0;
      const postData = {
        invoice: {
          id_branch: formData.id_branch,
          id_customer: formData.id_customer,
          is_credit: formData.isCredit ? 1 : 0,
          // invoice_for: invoiceFor,
          // invoice_to: invoiceTo,
          // pan_number: panNumber !== "" ? panNumber : null,
          // gst_number: gstNumber !== "" ? gstNumber : null,
          sales_amount: isUndefined(formData.sales_amount),
          purchase_amount: isUndefined(formData.purchase_amount),
          return_amount: isUndefined(0),
          total_discount_amount: isUndefined(formData.total_discount_amount),
          total_adjusted_amount: isUndefined(formData.advanceAdjAmount),
          total_chit_amount: isUndefined(formData.chitAdjAmount),
          net_amount: isUndefined(formData.net_amount),
          received_amount: isUndefined(formData.totalAmountReceived),
          deposit_amount: isUndefined(formData?.deposit_amount),
          refund_amount: isUndefined(formData?.refund_amount),
          due_amount: dueAmount,
          round_off: isUndefined(formData.round_off),
          id_employee: formData.id_employee,
          is_promotional_billing: 0,
        },
        sales_details: setSalesDetails(formData.sales_details),
        purchase_details: formData.purchase_details,
        payment_details: setPaymentDetails(formData.paymentModeData),
        return_details: [],
        advance_adjusted_details: formData.advanceAdjustedData,
        scheme_details: formData.chitAdjustedData,
      };
      submitForm(postData);
    }
  };

  const submitForm = async (postData) => {
    try {
      let response = "";
      response = await dispatch(createInvoice(postData)).unwrap();

      //window.open(response.data.pdf_url, "_blank");
      downloadPDF(response.data.pdf_path, response.data.invoice_id);
      dispatch(getEstimationApprovalList({ id_branch: idBranch }));

      //window.location.reload();
      //   navigate(`${process.env.PUBLIC_URL}/billing/list`);
    } catch (error) {
      //setIsSubmitted(false);
    }
  };

  const printEstimates = async (id) => {
    try {
      let response = "";
      response = await dispatch(estimationDetailsPrint({ id: id })).unwrap();
      // console.log(response);

      // navigate(`${process.env.PUBLIC_URL}/estimation/approval`);
      window.open(response?.pdf_url, "_blank");
    } catch (error) {
      console.error(error);
    }
  };

  const downloadPDF = async (printPageURL, id) => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/${printPageURL}/${id}/`,
      {
        headers: {
          Authorization: `Token ${secureLocalStorage.getItem("pref")?.token}`,
        },
      }
    );

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

  const validateCashLimit = (paymentModeData, refundAmount = 0) => {
    let validate = false;
    console.log(userInfo);
    let max_outward_cash_limit = userInfo.settings?.max_outward_cash_limit;
    let max_inward_cash_limit = userInfo.settings?.max_inward_cash_limit;

    paymentModeData.forEach((element) => {
      if (element.short_code == "Csh") {
        let max_cash =
          parseFloat(refundAmount) > 0
            ? max_outward_cash_limit
            : max_inward_cash_limit;

        if (parseFloat(max_cash) < parseFloat(element.payment_amount)) {
          toastfunc(`Max Cash limit is : ${max_cash}`);
          validate = true;
        }
      }
    });

    return validate;
  };

  useEffect(() => {
    socket.on("estimation_approved", (data) => {
      if (idBranch) {
        dispatch(getEstimationApprovalList({ id_branch: idBranch }));
      }
    });

    return () => {
      socket.off("estimation_approved");
    };
  }, [socket, dispatch]);

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
              <ModifiedBreadcrumb />
            </Col>
          </Row>
          <div style={{ marginTop: "10px" }}>
            <Row md={12} className="form-group row g-4 form-control-sm">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="branch">
                    Branch
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <BranchDropdown
                    register={register}
                    id={"idBranch"}
                    branches={branches}
                    selectedBranch={idBranch}
                    onBranchChange={(value) => {
                      setIdBranch(value);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.idBranch && "Branch is Required"}
                  />
                </div>
              </Col>
              <Col lg="3">
                <div className="form-control-wrap">
                  <div className="input-group-append" style={{ width: "40%" }}>
                    <TextInputField
                      register={register}
                      isRequired={false}
                      id={"estCode"}
                      placeholder="Est. No"
                      value={estCode}
                      SetValue={(value) => {
                        // console.log("tagCode", value);
                        setEstCode(value);
                        clearErrors("estCode");
                      }}
                      message={errors.estCode && errors.estCode.message}
                    />
                  </div>
                </div>
              </Col>
              <Col lg="2">
                <Button
                  color="primary"
                  size="md"
                  onClick={() => {
                    dispatch(
                      getEstimationApprovalList({ id_branch: idBranch,
                        est_code: estCode
                       })
                    );
                  }}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </div>

          <Row className="form-group row g-4 form-control-sm">
            {approvalList?.map((item, idx) => {
              return (
                <Col lg="6" md={12} sm={12} style={{ marginTop: "30px" }}>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "left",
                    }}
                  >
                    <Card
                      style={{
                        width: "630px",
                        border: "1px solid #000",
                        borderRadius: "8px",
                      }}
                    >
                      <CardBody style={{ padding: "10px" }}>
                        <Row md={12} className="form-group row g-4">
                          <Col lg={10}></Col>
                          {item?.is_approved == 1 && (
                            <Col lg={2}>
                              <div style={{ marginTop: "0px" }}>
                                <Button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() =>
                                    printEstimates(item?.estimation_id)
                                  }
                                >
                                  {isSubmitting ? "Printing" : "Print"}
                                </Button>
                              </div>
                            </Col>
                          )}
                        </Row>
                        <Table bordered style={{ marginBottom: "0px" }}>
                          <tbody>
                            <tr>
                              <td style={{ width: "15%", fontWeight: "bold" }}>
                                Est No: {item?.est_no}
                              </td>
                              <td style={{ width: "25%", fontWeight: "bold" }}>
                                {item?.customer_name} / {item?.customer_mobile}
                              </td>
                              <td style={{ width: "25%", fontWeight: "bold" }}>
                                Emp :{item?.emp_name}
                              </td>
                              <td style={{ width: "25%", fontWeight: "bold" }}>
                                Branch : {item?.branch_name}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </CardBody>
                      <Nav
                        tabs
                        style={{
                          borderBottom: "1px solid #000",
                          justifyContent: "left",
                        }}
                      >
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: item?.active_tab === item?.sales_tab,
                            })}
                            onClick={() => {
                              handelChange(idx, "active_tab", item?.sales_tab);
                            }}
                            style={{
                              cursor: "pointer",
                              fontWeight:
                                item?.active_tab === item?.sales_tab
                                  ? "bold"
                                  : "normal",
                              padding: "10px 20px",
                              fontSize: "14px",
                            }}
                          >
                            Sales
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: item?.active_tab === item?.purchase_tab,
                            })}
                            onClick={() => {
                              handelChange(
                                idx,
                                "active_tab",
                                item?.purchase_tab
                              );
                            }}
                            style={{
                              cursor: "pointer",
                              fontWeight:
                                item?.active_tab === item?.purchase_tab
                                  ? "bold"
                                  : "normal",
                              padding: "10px 20px",
                              fontSize: "14px",
                            }}
                          >
                            Purchase
                          </NavLink>
                        </NavItem>

                        {item?.partlysale_details?.length > 0 && (
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active:
                                  item?.active_tab === item?.partlysale_tab,
                              })}
                              onClick={() => {
                                handelChange(
                                  idx,
                                  "active_tab",
                                  item?.partlysale_tab
                                );
                              }}
                              style={{
                                cursor: "pointer",
                                fontWeight:
                                  item?.active_tab === item?.partlysale_tab
                                    ? "bold"
                                    : "normal",
                                padding: "10px 20px",
                                fontSize: "14px",
                              }}
                            >
                              Partly Sale Balance
                            </NavLink>
                          </NavItem>
                        )}

                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: item?.active_tab === item?.payment_tab,
                            })}
                            onClick={() => {
                              handelChange(
                                idx,
                                "active_tab",
                                item?.payment_tab
                              );
                            }}
                            style={{
                              cursor: "pointer",
                              fontWeight:
                                item?.active_tab === item?.payment_tab
                                  ? "bold"
                                  : "normal",
                              padding: "10px 20px",
                              fontSize: "14px",
                            }}
                          >
                            Payment
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={item?.active_tab}>
                        <TabPane tabId={item?.sales_tab}>
                          <CardBody style={{ padding: "13px" }}>
                            <div
                              style={{
                                maxHeight: "250px",
                                overflowY: "auto",
                                overflowX: "auto",
                                marginBottom: "0",
                                marginTop: "-22px",
                              }}
                            >
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th style={{ textAlign: "right" }}>Pcs</th>
                                    <th style={{ textAlign: "right" }}>Gwt</th>
                                    <th style={{ textAlign: "right" }}>Nwt</th>
                                    <th style={{ textAlign: "right" }}>
                                      VA(%)
                                    </th>
                                    <th style={{ textAlign: "right" }}>MC</th>
                                    <th style={{ textAlign: "right" }}>
                                      Item Cost
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item?.sales_details?.map(
                                    (salesItem, index) => {
                                      return (
                                        <React.Fragment key={index}>
                                          <tr>
                                            <td
                                              colSpan={6}
                                              style={{ fontWeight: "bold" }}
                                            >
                                              {salesItem?.product_name} -{" "}
                                              {salesItem?.design_name}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              colSpan={3}
                                              style={{
                                                width: "25%",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {salesItem?.tag_code !== "" &&
                                              salesItem?.tag_code !== null
                                                ? `${salesItem?.tag_code}`
                                                : ""}
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                              {salesItem?.wastage_percentage}
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                              {salesItem?.mc_value}
                                              {salesItem?.mc_type === 1
                                                ? "/G"
                                                : "/pcs"}
                                            </td>
                                            <td></td>
                                          </tr>
                                          <tr>
                                            <td style={{ textAlign: "right" }}>
                                              {salesItem?.pieces}
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                              {salesItem?.gross_wt}
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                              {salesItem?.net_wt}
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                              {parseFloat(
                                                salesItem?.wastage_percentage_after_disc
                                              ).toFixed(2)}
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                              {parseFloat(
                                                salesItem?.mc_discount_amount
                                              ) > 0
                                                ? parseFloat(
                                                    parseFloat(
                                                      parseFloat(
                                                        parseFloat(
                                                          isUndefined(
                                                            salesItem?.mc_value
                                                          )
                                                        ) *
                                                          parseFloat(
                                                            isUndefined(
                                                              salesItem?.gross_wt
                                                            )
                                                          ) -
                                                          parseFloat(
                                                            parseFloat(
                                                              isUndefined(
                                                                salesItem?.mc_discount_amount
                                                              )
                                                            )
                                                          )
                                                      ) /
                                                        parseFloat(
                                                          isUndefined(
                                                            salesItem?.gross_wt
                                                          )
                                                        )
                                                    )
                                                  ).toFixed(2) +
                                                  "/" +
                                                  (salesItem?.mc_type === 1
                                                    ? "G"
                                                    : "P")
                                                : salesItem?.mc_value +
                                                    "/" +
                                                    salesItem?.mc_type ===
                                                  1
                                                ? "G"
                                                : "P"}
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                              {formatCurrencyInINR(
                                                salesItem?.item_cost
                                              )}
                                            </td>
                                          </tr>
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </CardBody>
                        </TabPane>
                        <TabPane tabId={item?.purchase_tab}>
                          <CardBody
                            style={{ padding: "13px", marginTop: "-22px" }}
                          >
                            <Table bordered style={{ marginBottom: "0" }}>
                              <tbody>
                                <tr>
                                  <th>Product</th>
                                  <th>Pcs</th>
                                  <th>Gwt</th>
                                  <th>Nwt</th>
                                  <th>Amount</th>
                                </tr>
                                {item?.purchase_details?.map((purchaseItem) => {
                                  return (
                                    <tr
                                      key={purchaseItem?.est_old_metal_item_id}
                                    >
                                      <td style={{ width: "25%" }}>
                                        {purchaseItem?.product_name}
                                      </td>
                                      <td style={{ width: "25%" }}>
                                        {purchaseItem?.pieces}
                                      </td>
                                      <td style={{ width: "25%" }}>
                                        {purchaseItem?.gross_wt}
                                      </td>
                                      <td style={{ width: "25%" }}>
                                        {purchaseItem?.net_wt}
                                      </td>
                                      <td style={{ width: "25%" }}>
                                        {formatCurrencyInINR(
                                          purchaseItem?.amount
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </Table>
                          </CardBody>
                        </TabPane>
                        <TabPane tabId={item?.partlysale_tab}>
                          <CardBody
                            style={{ padding: "13px", marginTop: "-22px" }}
                          >
                            <Table bordered style={{ marginBottom: "0" }}>
                              <tbody>
                                <tr>
                                  <th colSpan={3}>Product</th>
                                  <th style={{ textAlign: "right" }}>T.Gwt</th>
                                  <th style={{ textAlign: "right" }}>T.Nwt</th>
                                  <th style={{ textAlign: "right" }}>T.Lwt</th>
                                </tr>
                                {item?.partlysale_details?.map(
                                  (salesItem, index) => {
                                    return (
                                      <React.Fragment key={index}>
                                        <tr>
                                          <td
                                            colSpan={3}
                                            style={{
                                              width: "25%",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {salesItem?.product_name}
                                            {salesItem?.tag_code !== "" &&
                                            salesItem?.tag_code !== null
                                              ? ` - ${salesItem?.tag_code}`
                                              : ""}
                                          </td>
                                          <td style={{ textAlign: "right" }}>
                                            {parseFloat(
                                              salesItem?.tag_gross_wt
                                            ).toFixed(3)}
                                          </td>
                                          <td style={{ textAlign: "right" }}>
                                            {parseFloat(
                                              salesItem?.tag_net_wt
                                            ).toFixed(3)}
                                          </td>
                                          <td style={{ textAlign: "right" }}>
                                            {parseFloat(
                                              salesItem?.tag_less_wt
                                            ).toFixed(3)}
                                          </td>
                                        </tr>

                                        <tr>
                                          <td
                                            colSpan={3}
                                            style={{
                                              width: "25%",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Balance Details
                                          </td>
                                          <td style={{ textAlign: "right" }}>
                                            {parseFloat(
                                              salesItem?.balance_gross_wt
                                            ).toFixed(3)}
                                          </td>
                                          <td style={{ textAlign: "right" }}>
                                            {parseFloat(
                                              salesItem?.balance_net_wt
                                            ).toFixed(3)}
                                          </td>
                                          <td style={{ textAlign: "right" }}>
                                            {parseFloat(
                                              salesItem?.balance_less_wt
                                            ).toFixed(3)}
                                          </td>
                                        </tr>
                                      </React.Fragment>
                                    );
                                  }
                                )}
                              </tbody>
                            </Table>
                          </CardBody>
                        </TabPane>
                        <TabPane tabId={item?.payment_tab}>
                          <CardBody
                            style={{ padding: "13px", marginTop: "-22px" }}
                          >
                            {/* <Row className="custom-grid"> */}
                            <PaymentModeComponent
                              ref={paymentFormRef}
                              onUpdateFormData={(data) =>
                                handlePaymentData(data, idx)
                              }
                              onUpdateAdvanceFormData={(data) =>
                                handleAdvanceAdjustmentData(data, idx)
                              }
                              onUpdateChitFormData={(data) =>
                                handleChitAdjustmentData(data, idx)
                              }
                              customer={item?.id_customer}
                              isAdvanceAdjustment
                              isChitAdjustment
                              totalVA={item?.sales_details?.reduce(
                                (sum, item) =>
                                  sum + parseFloat(item.wastage_weight || 0),
                                0
                              )}
                              totalMC={item?.sales_details?.reduce(
                                (sum, item) =>
                                  sum + parseFloat(item.mc_value || 0),
                                0
                              )}
                              totalWeight={item?.sales_details?.reduce(
                                (sum, item) =>
                                  sum + parseFloat(item.gross_wt || 0),
                                0
                              )}
                              metalPurityRateList={metalPurityRate}
                              metalRateInfo={metalRates}
                            />
                            {/* </Row> */}
                          </CardBody>
                        </TabPane>
                      </TabContent>
                      <CardBody
                        style={{ padding: "15px", borderTop: "1px solid #000" }}
                      >
                        <Table bordered style={{ marginBottom: "10px" }}>
                          <tbody>
                            <tr>
                              <td>Sales Amount:</td>
                              <td style={{ textAlign: "right" }}>
                                {formatCurrencyInINR(
                                  parseFloat(
                                    parseFloat(item?.sales_amount) +
                                      parseFloat(item?.total_discount_amount)
                                  ).toFixed(2)
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>Purchase Amount:</td>
                              <td style={{ textAlign: "right" }}>
                                {formatCurrencyInINR(
                                  parseFloat(
                                    parseFloat(item?.purchase_amount)
                                  ).toFixed(2)
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>Discount:</td>
                              <td style={{ textAlign: "right" }}>
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">
                                      {getCurrencySymbol(
                                        userInfo?.user?.currency_code
                                      )}
                                    </span>
                                  </div>
                                  <input
                                    id={`discountAmount` + idx}
                                    type="number"
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    value={item?.discountAmount}
                                    min={0}
                                    style={{ textAlign: "right" }}
                                    setValue={setValue}
                                    {...register(`discountAmount` + idx)}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      handelChange(
                                        idx,
                                        "discountAmount",
                                        value
                                      );
                                    }}
                                    onBlur={() =>
                                      handelChange(
                                        idx,
                                        "discount",
                                        item?.discountAmount
                                      )
                                    }
                                  />
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>Net Amount:</td>
                              <td style={{ textAlign: "right" }}>
                                {formatCurrencyInINR(item?.net_amount)}
                              </td>
                            </tr>
                            <tr>
                              <td>Received Amount:</td>
                              <td style={{ textAlign: "left", width: "50%" }}>
                                {" "}
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">
                                      {getCurrencySymbol(
                                        userInfo?.user?.currency_code
                                      )}
                                    </span>
                                  </div>
                                  <input
                                    id={`totalAmountReceived`}
                                    type="number"
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    value={item?.totalAmountReceived}
                                    readOnly={!item?.isCredit}
                                    min={0}
                                    style={{ textAlign: "right" }}
                                    setValue={setValue}
                                    {...register(`totalAmountReceived` + idx)}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      handelChange(
                                        idx,
                                        "totalAmountReceived",
                                        value
                                      );
                                    }}
                                  />
                                  <div className="input-group-append">
                                    <div className="input-group-text">
                                      <input
                                        type="checkbox"
                                        className=""
                                        id="isCredit"
                                        name={"isCredit"}
                                        checked={item?.isCredit}
                                        disabled={item?.net_amount < 0}
                                        onChange={(e) =>
                                          handelChange(
                                            idx,
                                            "isCredit",
                                            e.target.checked
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>Balance Amount:</td>
                              <td style={{ textAlign: "right" }}>
                                {formatCurrencyInINR(item?.balanceAmount)}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                        <Row>
                          {item?.is_approved != 1 &&
                            userInfo?.user?.est_bill_approval == true && (
                              <>
                                <Col>
                                  <Button
                                    color="success"
                                    style={{ width: "100%", fontSize: "12px" }}
                                    disabled={
                                      isSubmitting || item?.is_approved == 1
                                    }
                                    onClick={() =>
                                      approveEst(item?.estimation_id, 1, item)
                                    }
                                  >
                                    {isSubmitting ? "Approving" : "Approve"}
                                  </Button>
                                </Col>
                                <Col>
                                  <Button
                                    color="danger"
                                    style={{ width: "100%", fontSize: "12px" }}
                                    disabled={
                                      isSubmitting || item?.is_approved == 1
                                    }
                                    onClick={() =>
                                      approveEst(item?.estimation_id, 2, item)
                                    }
                                  >
                                    Reject
                                  </Button>
                                </Col>{" "}
                              </>
                            )}

                          {item?.is_approved == 1 &&
                            userInfo?.user?.est_bill_convert == true && (
                              <>
                                <Col>
                                  <Button
                                    color="primary"
                                    style={{ width: "100%", fontSize: "12px" }}
                                    disabled={isSubmitting}
                                    onClick={() =>
                                      navigate(
                                        {
                                          pathname: `${process.env.PUBLIC_URL}/billing/add`,
                                        },
                                        {
                                          state: {
                                            add: true,
                                            estDetails: item,
                                          },
                                        }
                                      )
                                    }
                                  >
                                    {isSubmitting
                                      ? "Converting"
                                      : "Forward to Billing"}
                                    <Icon
                                      style={{ marginLeft: "45%" }}
                                      name={"arrow-right-round-fill"}
                                    ></Icon>
                                  </Button>
                                </Col>
                                <Col>
                                  <Button
                                    color="success"
                                    style={{ width: "100%", fontSize: "12px" }}
                                    disabled={
                                      parseFloat(item?.balanceAmount) != 0
                                    }
                                    onClick={() => onClickSave(item)}
                                  >
                                    {isSubmitting
                                      ? "Converting"
                                      : "Create Invoice"}
                                    <Icon
                                      style={{ marginLeft: "53%" }}
                                      name={"arrow-right-round-fill"}
                                    ></Icon>
                                  </Button>
                                </Col>
                              </>
                            )}
                        </Row>
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              );
            })}
          </Row>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default ApprovalEstimationForm;
