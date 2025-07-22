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
  Table,
  Badge,
  Button,
} from "reactstrap";
import classnames from "classnames";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { formatCurrencyInINR } from "../../components/common/moneyFormat/moneyFormat";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useNavigate, useLocation } from "react-router";
import getCurrencySymbol from "../../components/common/moneyFormat/currencySymbol";
import {
  isUndefined,
  calculatePurchaseItemCost,
  calculatePurchaseNetWeight,
} from "../../components/common/calculations/ErpCalculations";
import { getBillDetails } from "../../redux/thunks/billing";
import {
  Icon,
  PreviewCard,
  TooltipComponent,
} from "../../components/Component";
import axios from "axios";
import {
  useProducts,
  useOldMetalItem,
  useCurrentMetalRate,
} from "../../components/filters/filterHooks";
import {
  OldMetalItemDropdown,
  ProductDropdown,
} from "../../components/filters/retailFilters";
import { NumberInputField } from "../../components/Component";
import PaymentModeComponent from "../../components/common/payment/PaymentModeComponent";
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import { updateInvoice } from "../../redux/thunks/billing";
import secureLocalStorage from "react-secure-storage";

const InvoicePreview = () => {
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    userInfo,
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const { billDetails } = useSelector((state) => state.billingReducer);
  const { paymentModes } = useSelector((state) => state.paymentOptionsreducer);
  const { products } = useProducts();
  const { oldMetalItems } = useOldMetalItem();
  const paymentFormRef = useRef(null);
  const [itemDetails, setItemDetails] = useState({});
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [billTypeTab, setBillTypeTab] = useState("1");
  const [paymentModeData, setPaymentModeData] = useState([]);
  const [advanceAdjustedData, setAdvanceAdjustedData] = useState([]);
  const [chitAdjustedData, setChitAdjustedData] = useState([]);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
  const [totalAdjustedAmount, setTotalAdjustedAmount] = useState(0);
  const [totalChitAdjustedAmount, setTotalChitAdjustedAmount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  const { metalRates } = useCurrentMetalRate();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(
      getBillDetails({
        erp_invoice_id: secureLocalStorage.getItem("invoiceId"),
      })
    );
    setIsEdit(secureLocalStorage.getItem("invoiceEdit") === true);
  }, [dispatch]);

  useEffect(() => {
    if (isEdit == true) {
      let payment_amount = parseFloat(
        parseFloat(calculateTotal(paymentModeData, "payment_amount")) +
          parseFloat(itemDetails?.advance_adj_amount) +
          parseFloat(itemDetails?.total_chit_amount)
      );
      let balance_amount =
        isUndefined(parseFloat(itemDetails?.received_amount)) - payment_amount;
      handleChange("balance_amount", isUndefined(balance_amount));
    }
  }, [JSON.stringify(paymentModeData)]);

  useEffect(() => {
    let net_amount = parseFloat(
      parseFloat(itemDetails?.sales_amount) +
        parseFloat(itemDetails?.total_discount_amount) -
        parseFloat(itemDetails?.return_amount) -
        parseFloat(calculateTotal(purchaseDetails, "amount", 2))
    );
    handleChange("net_amount", net_amount);
  }, [JSON.stringify(purchaseDetails)]);

  useEffect(() => {
    setItemDetails(billDetails);

    if (billDetails?.purchase_details != undefined) {
      setPurchaseDetails(billDetails?.purchase_details);
    }
  }, [billDetails]);

  function calculateTotal(data, field, decimal_places = 0) {
    let total = 0;
    if (data?.length > 0) {
      total = data.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);
    }

    return parseFloat(total).toFixed(decimal_places);
  }
  const newPurchaseDetails = {
    id_product: "",
    touch: 0,
    item_type: "",
    pieces: 1,
    gross_wt: 0,
    less_wt: 0,
    net_wt: 0,
    dia_wt: 0,
    stone_wt: 0,
    dust_wt: 0,
    wastage_percentage: 0,
    wastage_weight: 0,
    pure_weight: 0,
    rate_per_gram: 0,
    customer_rate: 0,
    amount: 0,
    stone_details: [],
    isNew: true,
  };
  const addPurchaseRow = () => {
    if (validatePurchaseRow()) {
      setPurchaseDetails((prevData) => [...prevData, newPurchaseDetails]);
    }
  };

  const setPaymentDetails = (data, refundAmount = 0) => {
    let paymentModeDetails = [];

    data.forEach((val) => {
      if (val.payment_amount > 0) {
        let pay = itemDetails.payment_details.find(
          (item) => item.id_mode == val.id_mode
        );
        paymentModeDetails.push({
          invoice_pay_id:
            pay?.invoice_pay_id !== undefined ? pay.invoice_pay_id : null,
          invoice_bill_id:
            pay?.invoice_bill_id !== undefined ? pay.invoice_bill_id : null,
          payment_type: parseFloat(refundAmount) > 0 ? 2 : 1,
          payment_mode: val.id_mode,
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
  const deletePurchaseRow = (index) => {
    const updatedFormData = [...purchaseDetails];
    updatedFormData.splice(index, 1);
    setPurchaseDetails(updatedFormData);
  };
  const validatePurchaseRow = () => {
    let status = true;
    for (let data of purchaseDetails) {
      if (data.item_type == "" || data.item_type == null) {
        toastfunc("Select Item Type");
        status = false;
        break;
      } else if (data.id_product == "" || data.id_product == null) {
        toastfunc("Select Product");
        status = false;
        break;
      } else if (
        data.item_type == "" ||
        data.item_type == null ||
        data.gross_wt <= 0
      ) {
        toastfunc("Invalid Gross Wt");
        status = false;
        break;
      }
    }
    return status;
  };
  const handleChange = (field, value) => {
    setItemDetails((prevValues) => {
      let updateValue = {
        [field]: value,
      };
      return { ...prevValues, ...updateValue };
    });
  };
  const handlePaymentData = (data) => {
    setPaymentModeData(data);
    const totalPaidAmount = data.reduce((sum, item) => {
      return sum + parseFloat(item.payment_amount || 0);
    }, 0);
    setTotalPaymentAmount(totalPaidAmount);
  };
  const handleAdvanceAdjustmentData = (data) => {
    setAdvanceAdjustedData(data);
    const advanceAdjAmount = data?.reduce((sum, item) => {
      return sum + parseFloat(item.utilized_amount || 0);
    }, 0);
    setTotalAdjustedAmount(advanceAdjAmount);
  };

  const handleChitAdjustmentData = (data) => {
    setChitAdjustedData(data);
    const chitAdjAmount = data?.reduce((sum, item) => {
      return sum + parseFloat(item.amount || 0);
    }, 0);
    setTotalChitAdjustedAmount(chitAdjAmount);
  };
  const handleInputChange = (index, field, value) => {
    setPurchaseDetails((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      let updateValue = {
        [field]: value,
      };
      let ratePerGram = 0;
      let touch = 0;
      const productDetails = products.find(
        (prod) => prod.pro_id === updatedObject.id_product
      );
      if (productDetails) {
        let old_metal_item = oldMetalItems.find(
          (val) => val.id_item_type === updatedObject.item_type
        );
        touch = old_metal_item?.touch;
        ratePerGram = parseFloat(
          parseFloat(
            productDetails["id_metal"] === 1
              ? metalRates["gold_22ct"]
              : metalRates["silver_G"]
          ) - parseFloat(isUndefined(old_metal_item?.rate_deduction))
        ).toFixed(2);
      }
      if (field == "gross_wt") {
        const net_weight = calculatePurchaseNetWeight({
          gross_weight: value,
          less_weight: 0,
          dustWeight: 0,
          wastageWeight: 0,
        });
        let dustWeight = 0;

        if (productDetails) {
          const itemCostDetails = calculatePurchaseItemCost({
            grossWeight: value,
            netWeight: net_weight,
            wastageWeight: 0,
            ratePerGram: ratePerGram,
            touch: touch,
            calculationType: userInfo?.settings?.old_metal_calculation,
          });

          updateValue = {
            gross_wt: value,
            net_wt: net_weight,
            pure_weight: itemCostDetails.pure_weight,
            amount: itemCostDetails.item_cost,
            rate_per_gram: ratePerGram,
            touch: touch,
          };
        }
      }
      updatedValues[index] = { ...updatedObject, ...updateValue };

      return updatedValues;
    });
  };

  const downloadPDF = async (id, printPageURL) => {
    if (printPageURL != undefined) {
      try {
        const response = await axios.get(printPageURL, {
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
    } else {
      //download qr pdf
      try {
        let response = "";
        response = await dispatch(reduxData?.printPdfAction(id)).unwrap();
        window.open(response?.pdf_url, "_blank");
      } catch (error) {
        console.error(error);
      }
    }
  };
  const onClickSave = async () => {
    setIsSubmitted(true);
    if (itemDetails.net_amount != itemDetails.received_amount) {
      toastfunc("Net Amount And Received Amount Does Not Match");
      setIsSubmitted(false);
    }

    let postData = {
      id: itemDetails.erp_invoice_id,
      net_amount: itemDetails.net_amount,
      received_amount: itemDetails.received_amount,
      purchase_amount: calculateTotal(purchaseDetails, "amount", 2),
      purchase_details:
        purchaseDetails.length > 0
          ? createPurchaseItemData(purchaseDetails)
          : [],
      payment_details:
        paymentModeData.length > 0 ? setPaymentDetails(paymentModeData, 0) : [],
    };
    try {
      response = await dispatch(updateInvoice(postData)).unwrap();
      navigate(`${process.env.PUBLIC_URL}/billing/list`);
    } catch (error) {
      setIsSubmitted(false);
    }
  };
  const createPurchaseItemData = (purchaseItemData) => {
    let postData = [];
    purchaseItemData.forEach((value) => {
      if (value.isNew == true) {
        postData.push(value);
      }
    });
    return postData;
  };
  return (
    <React.Fragment>
      <Head title="Invoice Preview" />
      <Content>
        <PreviewCard className="h-100">
          <Row className="form-group row g-4 form-control-sm">
            <Col style={{ marginTop: "30px" }}>
              <div style={{ marginTop: "10px" }}>
                <Card style={{ border: "1px solid #000", borderRadius: "8px" }}>
                  <CardBody style={{ padding: "10px" }}>
                    <Row>
                      <Col lg="10">
                        <Table bordered style={{ marginBottom: "0px" }}>
                          <tbody>
                            <tr>
                              <td style={{ fontWeight: "bold" }}>
                                Invoice No:{" "}
                                {itemDetails?.invoice_data?.invoice_no}
                              </td>
                              <td style={{ fontWeight: "bold" }}>
                                Date : {itemDetails?.invoice_date}
                              </td>
                              <td style={{ fontWeight: "bold" }}>
                                Customer : {itemDetails?.customer_name} /{" "}
                                {itemDetails?.customer_mobile}
                              </td>
                              <td style={{ fontWeight: "bold" }}>
                                Branch : {itemDetails?.branch_name}
                              </td>
                              <td style={{ fontWeight: "bold" }}>
                                Status :{" "}
                                <span
                                  className={
                                    "text-" + itemDetails?.status_color
                                  }
                                >
                                  {itemDetails?.status}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                      <Col lg="1">
                        {" "}
                        <div className="tb-odr-btns d-none d-sm-inline">
                          <Button
                            color="primary"
                            size="sm"
                            className="btn-icon btn-white btn-dim"
                            // onClick={() => {
                            // downloadPDF(itemDetails?.erp_invoice_id, itemDetails?.pdf_url);
                            // }}
                            onClick={() =>
                              window.open("/billing/print", "_blank")
                            }
                          >
                            <TooltipComponent
                              containerClassName="btn btn-sm btn-icon btn-trigger"
                              icon="printer-fill"
                              direction="top"
                              id={`print_tooltip`}
                              text={"Print"}
                            />
                            PRINT
                            {/* <Icon name="printer-fill"></Icon> */}
                          </Button>
                        </div>
                      </Col>
                      <Col lg="1">
                        {" "}
                        <div className="tb-odr-btns d-none d-sm-inline">
                          {isEdit == true && (
                            <Button
                              color="primary"
                              disabled={
                                isSubmitted ||
                                parseFloat(itemDetails?.balance_amount) !== 0
                              }
                              size="md"
                              onClick={onClickSave}
                            >
                              {isSubmitted ? "Saving" : "Save"}
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
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
                        className={classnames({ active: billTypeTab === "1" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          setBillTypeTab("1");
                        }}
                        style={{
                          cursor: "pointer",
                          fontWeight: billTypeTab === "1" ? "bold" : "normal",
                          padding: "10px 20px",
                          fontSize: "14px",
                        }}
                      >
                        Sales
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: billTypeTab === "2" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          setBillTypeTab("2");
                        }}
                        style={{
                          cursor: "pointer",
                          fontWeight: billTypeTab === "2" ? "bold" : "normal",
                          padding: "10px 20px",
                          fontSize: "14px",
                        }}
                      >
                        Purchase &nbsp;&nbsp;&nbsp;
                        {isEdit == true && (
                          <Button
                            color="primary"
                            size="md"
                            onClick={() => addPurchaseRow()}
                            style={{
                              padding: "2px",
                            }}
                          >
                            Add
                          </Button>
                        )}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: billTypeTab === "5" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          setBillTypeTab("5");
                        }}
                        style={{
                          cursor: "pointer",
                          fontWeight: billTypeTab === "5" ? "bold" : "normal",
                          padding: "10px 20px",
                          fontSize: "14px",
                        }}
                      >
                        Sales Return
                      </NavLink>
                    </NavItem>

                    {itemDetails?.partlysale_details?.length > 0 && (
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: billTypeTab === "3",
                          })}
                          onClick={(ev) => {
                            ev.preventDefault();
                            setBillTypeTab("3");
                          }}
                          style={{
                            cursor: "pointer",
                            fontWeight: billTypeTab === "3" ? "bold" : "normal",
                            padding: "10px 20px",
                            fontSize: "14px",
                          }}
                        >
                          Partly Sale Balance
                        </NavLink>
                      </NavItem>
                    )}
                    {isEdit == true && (
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: billTypeTab === "4",
                          })}
                          onClick={(ev) => {
                            ev.preventDefault();
                            setBillTypeTab("4");
                          }}
                          style={{
                            cursor: "pointer",
                            fontWeight: billTypeTab === "4" ? "bold" : "normal",
                            padding: "10px 20px",
                            fontSize: "14px",
                          }}
                        >
                          Payment
                        </NavLink>
                      </NavItem>
                    )}
                  </Nav>
                  <TabContent activeTab={billTypeTab}>
                    <TabPane tabId={"1"}>
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
                                <th style={{ textAlign: "left" }}>Product</th>
                                <th style={{ textAlign: "right" }}>Pcs</th>
                                <th style={{ textAlign: "right" }}>Gwt</th>
                                <th style={{ textAlign: "right" }}>Nwt</th>
                                <th style={{ textAlign: "right" }}>VA(%)</th>
                                <th style={{ textAlign: "right" }}>VA(Wt)</th>
                                <th style={{ textAlign: "right" }}>MC</th>
                                <th style={{ textAlign: "right" }}>Rate</th>
                                <th style={{ textAlign: "right" }}>Taxable</th>
                                <th style={{ textAlign: "right" }}>Tax</th>
                                <th style={{ textAlign: "right" }}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itemDetails?.sales_details?.map(
                                (salesItem, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        {" "}
                                        {salesItem?.product_name} -{" "}
                                        {salesItem?.design_name}{" "}
                                        {salesItem?.tag_code !== "" &&
                                        salesItem?.tag_code !== null
                                          ? `- ${salesItem?.tag_code}`
                                          : ""}
                                      </td>
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
                                        {salesItem?.wastage_percentage}
                                      </td>
                                      <td style={{ textAlign: "right" }}>
                                        {salesItem?.wastage_weight}
                                      </td>
                                      <td style={{ textAlign: "right" }}>
                                        {salesItem?.mc_value}
                                        {salesItem?.mc_type === 1
                                          ? "/G"
                                          : "/pcs"}
                                      </td>
                                      <td style={{ textAlign: "right" }}>
                                        {formatCurrencyInINR(
                                          salesItem?.rate_per_gram
                                        )}
                                      </td>
                                      <td style={{ textAlign: "right" }}>
                                        {formatCurrencyInINR(
                                          salesItem?.taxable_amount
                                        )}
                                      </td>
                                      <td style={{ textAlign: "right" }}>
                                        {formatCurrencyInINR(
                                          salesItem?.tax_amount
                                        )}
                                      </td>
                                      <td style={{ textAlign: "right" }}>
                                        {formatCurrencyInINR(
                                          salesItem?.item_cost
                                        )}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                            <tfoot>
                              <tr key={"s1"} style={{ fontWeight: "bold" }}>
                                <td> Total</td>
                                <td style={{ textAlign: "right" }}>
                                  {calculateTotal(
                                    itemDetails?.sales_details,
                                    "pieces"
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {calculateTotal(
                                    itemDetails?.sales_details,
                                    "gross_wt",
                                    3
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {calculateTotal(
                                    itemDetails?.sales_details,
                                    "net_wt",
                                    3
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {calculateTotal(
                                    itemDetails?.sales_details,
                                    "wastage_percentage",
                                    2
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {calculateTotal(
                                    itemDetails?.sales_details,
                                    "wastage_weight",
                                    3
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}></td>
                                <td style={{ textAlign: "right" }}></td>
                                <td style={{ textAlign: "right" }}>
                                  {formatCurrencyInINR(
                                    calculateTotal(
                                      itemDetails?.sales_details,
                                      "taxable_amount",
                                      2
                                    )
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {formatCurrencyInINR(
                                    calculateTotal(
                                      itemDetails?.sales_details,
                                      "tax_amount",
                                      2
                                    )
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {formatCurrencyInINR(
                                    calculateTotal(
                                      itemDetails?.sales_details,
                                      "item_cost",
                                      2
                                    )
                                  )}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </CardBody>
                    </TabPane>
                    <TabPane tabId={"2"}>
                      <CardBody style={{ padding: "13px", marginTop: "-22px" }}>
                        <Table bordered style={{ marginBottom: "0" }}>
                          <tbody>
                            <tr>
                              <th>Product</th>
                              <th>Item Type</th>

                              <th style={{ textAlign: "right" }}>Pcs</th>
                              <th style={{ textAlign: "right" }}>Gwt</th>
                              <th style={{ textAlign: "right" }}>Nwt</th>
                              <th style={{ textAlign: "right" }}>Lwt</th>
                              <th style={{ textAlign: "right" }}>Dia.wt</th>
                              <th style={{ textAlign: "right" }}>Stn.wt</th>
                              <th style={{ textAlign: "right" }}>Dust.wt</th>
                              <th style={{ textAlign: "right" }}>Va</th>
                              <th style={{ textAlign: "right" }}>Touch</th>
                              <th style={{ textAlign: "right" }}>Pure.Wt</th>
                              <th style={{ textAlign: "right" }}>Amount</th>
                              {isEdit == true && (
                                <th style={{ textAlign: "right" }}>Action</th>
                              )}
                            </tr>

                            {purchaseDetails?.map((purchaseItem, index) => {
                              if (
                                purchaseItem?.isNew == true &&
                                isEdit == true
                              ) {
                                return (
                                  <tr key={purchaseItem?.est_old_metal_item_id}>
                                    <td>
                                      <ProductDropdown
                                        register={register}
                                        id={"selectedProduct_" + index}
                                        products={products}
                                        selectedProduct={
                                          purchaseItem.id_product
                                        }
                                        onProductChange={(value) => {
                                          handleInputChange(
                                            index,
                                            "id_product",
                                            value
                                          );
                                        }}
                                        isRequired={true}
                                        clearErrors={clearErrors}
                                        setValue={setValue}
                                        message={
                                          errors["selectedProduct_" + index] &&
                                          "Product is Required"
                                        }
                                      ></ProductDropdown>
                                    </td>
                                    <td>
                                      <OldMetalItemDropdown
                                        register={register}
                                        id={"selectedOldMetalItem_" + index}
                                        oldMetalItems={oldMetalItems}
                                        selectedOldMetalItem={
                                          purchaseItem.item_type
                                        }
                                        onOldMetalItemChange={(value) => {
                                          handleInputChange(
                                            index,
                                            "item_type",
                                            value
                                          );
                                        }}
                                        isRequired={true}
                                        clearErrors={clearErrors}
                                        setValue={setValue}
                                        message={
                                          errors[
                                            "selectedOldMetalItem_" + index
                                          ] && "Item Type is Required"
                                        }
                                      ></OldMetalItemDropdown>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      <NumberInputField
                                        register={register}
                                        placeholder="Pcs"
                                        id={"piece_" + index}
                                        value={purchaseItem.pieces}
                                        isRequired={true}
                                        min={"1"}
                                        setValue={setValue}
                                        handleDot={true}
                                        handleKeyDownEvents={true}
                                        SetValue={(value) => {
                                          handleInputChange(
                                            index,
                                            "pieces",
                                            value
                                          );
                                          clearErrors("piece_" + index);
                                        }}
                                        textAlign={"right"}
                                        reqValueError={"Pieces is Required"}
                                        message={
                                          errors["piece_" + index] &&
                                          errors["piece_" + index].message
                                        }
                                      ></NumberInputField>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      <NumberInputField
                                        register={register}
                                        placeholder="Gross Wt"
                                        id={"gross_wt_" + index}
                                        value={purchaseItem.gross_wt}
                                        isRequired={true}
                                        min={"1"}
                                        setValue={setValue}
                                        handleKeyDownEvents={true}
                                        SetValue={(value) => {
                                          handleInputChange(
                                            index,
                                            "gross_wt",
                                            value
                                          );
                                          clearErrors("gross_wt_" + index);
                                        }}
                                        reqValueError={"Gross Wt is Required"}
                                        message={
                                          errors["gross_wt_" + index] &&
                                          errors["gross_wt_" + index].message
                                        }
                                        textAlign={"right"}
                                        handleDecimalDigits={true}
                                        decimalValues={3}
                                      ></NumberInputField>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {purchaseItem?.net_wt}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {purchaseItem?.less_wt}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {purchaseItem?.dia_wt}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {purchaseItem?.stone_wt}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {purchaseItem?.dust_wt}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {purchaseItem?.wastage_percentage}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {purchaseItem?.touch}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {purchaseItem?.pure_weight}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {formatCurrencyInINR(
                                        purchaseItem?.amount
                                      )}
                                    </td>
                                    <td>
                                      {" "}
                                      <Button
                                        color="primary"
                                        size="sm"
                                        className="btn-icon btn-white btn-dim"
                                        onClick={() => deletePurchaseRow(index)}
                                      >
                                        <Icon name="trash-fill" />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              }

                              return (
                                <tr key={purchaseItem?.est_old_metal_item_id}>
                                  <td>{purchaseItem?.product_name}</td>
                                  <td>-</td>
                                  <td style={{ textAlign: "right" }}>
                                    {purchaseItem?.pieces}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {purchaseItem?.gross_wt}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {purchaseItem?.net_wt}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {purchaseItem?.less_wt}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {purchaseItem?.dia_wt}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {purchaseItem?.stone_wt}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {purchaseItem?.dust_wt}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {purchaseItem?.wastage_percentage}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {purchaseItem?.touch}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {purchaseItem?.pure_weight}
                                  </td>
                                  <td style={{ textAlign: "right" }}>
                                    {formatCurrencyInINR(purchaseItem?.amount)}
                                  </td>
                                  {isEdit == true && <td>-</td>}
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr key={"p1"} style={{ fontWeight: "bold" }}>
                              <td> Total</td>
                              <td></td>
                              <td style={{ textAlign: "right" }}>
                                {calculateTotal(purchaseDetails, "pieces")}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {calculateTotal(purchaseDetails, "gross_wt", 3)}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {calculateTotal(purchaseDetails, "net_wt", 3)}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {calculateTotal(purchaseDetails, "less_wt", 3)}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {calculateTotal(purchaseDetails, "dia_wt", 3)}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {calculateTotal(purchaseDetails, "stone_wt", 3)}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {calculateTotal(purchaseDetails, "dust_wt", 3)}
                              </td>
                              <td></td>
                              <td></td>
                              <td style={{ textAlign: "right" }}>
                                {calculateTotal(
                                  purchaseDetails,
                                  "pure_weight",
                                  3
                                )}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {formatCurrencyInINR(
                                  calculateTotal(purchaseDetails, "amount", 2)
                                )}
                              </td>
                              {isEdit == true && <td></td>}
                            </tr>
                          </tfoot>
                        </Table>
                      </CardBody>
                    </TabPane>
                    <TabPane tabId={"3"}>
                      <CardBody style={{ padding: "13px", marginTop: "-22px" }}>
                        <Table bordered style={{ marginBottom: "0" }}>
                          <tbody>
                            <tr>
                              <th colSpan={3}>Product</th>
                              <th style={{ textAlign: "right" }}>T.Gwt</th>
                              <th style={{ textAlign: "right" }}>T.Nwt</th>
                              <th style={{ textAlign: "right" }}>T.Lwt</th>
                            </tr>
                            {itemDetails?.partlysale_details?.map(
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
                    <TabPane tabId={"4"}>
                      <CardBody style={{ padding: "13px", marginTop: "-22px" }}>
                        {/* <Row className="custom-grid"> */}
                        <PaymentModeComponent
                          ref={paymentFormRef}
                          onUpdateFormData={handlePaymentData}
                          onUpdateAdvanceFormData={handleAdvanceAdjustmentData}
                          onUpdateChitFormData={handleChitAdjustmentData}
                          customer={itemDetails?.customer}
                          metalRateInfo={metalRates}
                          initialData={itemDetails?.payment_details}
                        />
                        {/* </Row> */}
                      </CardBody>
                    </TabPane>
                    <TabPane tabId={"5"}>
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
                                <th style={{ textAlign: "left" }}>Product</th>
                                <th style={{ textAlign: "right" }}>Pcs</th>
                                <th style={{ textAlign: "right" }}>Gwt</th>
                                <th style={{ textAlign: "right" }}>Nwt</th>
                                <th style={{ textAlign: "right" }}>VA(%)</th>
                                <th style={{ textAlign: "right" }}>VA(Wt)</th>
                                <th style={{ textAlign: "right" }}>MC</th>
                                <th style={{ textAlign: "right" }}>Rate</th>
                                <th style={{ textAlign: "right" }}>Taxable</th>
                                <th style={{ textAlign: "right" }}>Tax</th>
                                <th style={{ textAlign: "right" }}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itemDetails?.return_details?.map(
                                (salesItem, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        {" "}
                                        {salesItem?.product_name} -{" "}
                                        {salesItem?.design_name}{" "}
                                        {salesItem?.tag_code !== "" &&
                                        salesItem?.tag_code !== null
                                          ? `- ${salesItem?.tag_code}`
                                          : ""}
                                      </td>
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
                                        {salesItem?.wastage_percentage}
                                      </td>
                                      <td style={{ textAlign: "right" }}>
                                        {salesItem?.wastage_weight}
                                      </td>
                                      <td style={{ textAlign: "right" }}>
                                        {salesItem?.mc_value}
                                        {salesItem?.mc_type === 1
                                          ? "/G"
                                          : "/pcs"}
                                      </td>
                                      <td style={{ textAlign: "right" }}>
                                        {formatCurrencyInINR(
                                          salesItem?.rate_per_gram
                                        )}
                                      </td>
                                      <td style={{ textAlign: "right" }}>
                                        {formatCurrencyInINR(
                                          salesItem?.taxable_amount
                                        )}
                                      </td>
                                      <td style={{ textAlign: "right" }}>
                                        {formatCurrencyInINR(
                                          salesItem?.tax_amount
                                        )}
                                      </td>
                                      <td style={{ textAlign: "right" }}>
                                        {formatCurrencyInINR(
                                          salesItem?.item_cost
                                        )}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                            <tfoot>
                              <tr key={"s1"} style={{ fontWeight: "bold" }}>
                                <td> Total</td>
                                <td style={{ textAlign: "right" }}>
                                  {calculateTotal(
                                    itemDetails?.return_details,
                                    "pieces"
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {calculateTotal(
                                    itemDetails?.return_details,
                                    "gross_wt",
                                    3
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {calculateTotal(
                                    itemDetails?.return_details,
                                    "net_wt",
                                    3
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {calculateTotal(
                                    itemDetails?.return_details,
                                    "wastage_percentage",
                                    2
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {calculateTotal(
                                    itemDetails?.return_details,
                                    "wastage_weight",
                                    3
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}></td>
                                <td style={{ textAlign: "right" }}></td>
                                <td style={{ textAlign: "right" }}>
                                  {formatCurrencyInINR(
                                    calculateTotal(
                                      itemDetails?.return_details,
                                      "taxable_amount",
                                      2
                                    )
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {formatCurrencyInINR(
                                    calculateTotal(
                                      itemDetails?.return_details,
                                      "tax_amount",
                                      2
                                    )
                                  )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {formatCurrencyInINR(
                                    calculateTotal(
                                      itemDetails?.return_details,
                                      "item_cost",
                                      2
                                    )
                                  )}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </CardBody>
                    </TabPane>
                  </TabContent>
                  <CardBody
                    style={{ padding: "15px", borderTop: "1px solid #000" }}
                  >
                    <Row lg={12}>
                      <Col lg={6}>
                        <Table bordered style={{ marginBottom: "10px" }}>
                          <tbody style={{ fontWeight: "bold" }}>
                            <tr>
                              <td>Sales Amount:</td>
                              <td style={{ textAlign: "right" }}>
                                {formatCurrencyInINR(
                                  parseFloat(
                                    parseFloat(itemDetails?.sales_amount) +
                                      parseFloat(
                                        itemDetails?.total_discount_amount
                                      )
                                  ).toFixed(2)
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>Purchase Amount:</td>
                              <td style={{ textAlign: "right" }}>
                                {formatCurrencyInINR(
                                  calculateTotal(purchaseDetails, "amount", 2)
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>Return Amount:</td>
                              <td style={{ textAlign: "right" }}>
                                {formatCurrencyInINR(
                                  itemDetails?.return_amount
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>Discount:</td>
                              <td style={{ textAlign: "right" }}>
                                {formatCurrencyInINR(
                                  parseFloat(
                                    parseFloat(
                                      itemDetails?.total_discount_amount
                                    )
                                  ).toFixed(2)
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>Net Amount:</td>
                              <td style={{ textAlign: "right" }}>
                                {isEdit == true
                                  ? formatCurrencyInINR(
                                      parseFloat(itemDetails?.sales_amount) +
                                        parseFloat(
                                          itemDetails?.total_discount_amount
                                        ) -
                                        parseFloat(itemDetails?.return_amount) -
                                        parseFloat(
                                          calculateTotal(
                                            purchaseDetails,
                                            "amount",
                                            2
                                          )
                                        )
                                    )
                                  : formatCurrencyInINR(
                                      itemDetails?.net_amount
                                    )}
                              </td>
                            </tr>
                            <tr>
                              <td>Received Amount:</td>
                              <td style={{ textAlign: "right" }}>
                                {isEdit == true ? (
                                  <NumberInputField
                                    register={register}
                                    placeholder="Received Amount"
                                    id={"received_amount"}
                                    value={itemDetails?.received_amount}
                                    isRequired={true}
                                    min={0}
                                    max={""}
                                    type={"number"}
                                    setValue={setValue}
                                    handleKeyDownEvents={true}
                                    handleDecimalDigits={true}
                                    decimalValues={2}
                                    SetValue={(value) => {
                                      handleChange("received_amount", value);
                                      let payment_amount = parseFloat(
                                        parseFloat(
                                          calculateTotal(
                                            paymentModeData,
                                            "payment_amount"
                                          )
                                        ) +
                                          parseFloat(
                                            itemDetails?.advance_adj_amount
                                          ) +
                                          parseFloat(
                                            itemDetails?.total_chit_amount
                                          )
                                      );
                                      if (value != "") {
                                        let balance_amount =
                                          parseFloat(value) - payment_amount;
                                        handleChange(
                                          "balance_amount",
                                          balance_amount
                                        );
                                      } else {
                                        handleChange(
                                          "balance_amount",
                                          -payment_amount
                                        );
                                      }
                                    }}
                                    minError={
                                      "Received Amount should less than or equal to 0"
                                    }
                                    maxError={
                                      "Received Amount greater than or equal to 0"
                                    }
                                    reqValueError={
                                      "Received Amount is Required"
                                    }
                                    message={
                                      errors.received_amount &&
                                      errors.received_amount.message
                                    }
                                    textAlign={"right"}
                                  />
                                ) : (
                                  formatCurrencyInINR(
                                    itemDetails?.received_amount
                                  )
                                )}
                              </td>
                            </tr>

                            {itemDetails?.due_amount > 0 && (
                              <tr>
                                <td>Due Amount:</td>
                                <td style={{ textAlign: "right" }}>
                                  {formatCurrencyInINR(itemDetails?.due_amount)}
                                </td>
                              </tr>
                            )}
                            {itemDetails?.balance_amount != 0 && (
                              <tr>
                                <td>Balance Amount:</td>
                                <td style={{ textAlign: "right" }}>
                                  {formatCurrencyInINR(
                                    isUndefined(itemDetails?.balance_amount)
                                  )}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Col>
                      <Col lg={6}>
                        <Table bordered style={{ marginBottom: "0" }}>
                          <tbody>
                            <tr>
                              <th>Mode</th>
                              <th style={{ textAlign: "right" }}>Amount</th>
                            </tr>
                            {paymentModeData?.map((purchaseItem) => {
                              if (purchaseItem?.payment_amount > 0) {
                                return (
                                  <tr>
                                    <td>{purchaseItem?.mode_name}</td>
                                    <td style={{ textAlign: "right" }}>
                                      {formatCurrencyInINR(
                                        purchaseItem?.payment_amount
                                      )}
                                    </td>
                                  </tr>
                                );
                              }
                            })}

                            {itemDetails.gift_amount > 0 && (
                              <tr>
                                <td>Gift </td>
                                <td style={{ textAlign: "right" }}>
                                  {formatCurrencyInINR(itemDetails.gift_amount)}
                                </td>
                              </tr>
                            )}

                            {itemDetails?.total_chit_amount > 0 && (
                              <tr>
                                <td>Chit</td>
                                <td style={{ textAlign: "right" }}>
                                  {formatCurrencyInINR(
                                    itemDetails?.total_chit_amount
                                  )}
                                </td>
                              </tr>
                            )}
                            {itemDetails?.advance_adj_amount > 0 && (
                              <tr>
                                <td>Advance Adj </td>
                                <td style={{ textAlign: "right" }}>
                                  {formatCurrencyInINR(
                                    itemDetails?.advance_adj_amount
                                  )}
                                </td>
                              </tr>
                            )}
                            {itemDetails?.deposit_amount > 0 && (
                              <tr>
                                <td>Deposit Amount:</td>
                                <td style={{ textAlign: "right" }}>
                                  {formatCurrencyInINR(
                                    itemDetails?.deposit_amount
                                  )}
                                </td>
                              </tr>
                            )}
                          </tbody>
                          <tfoot>
                            <tr key={"pay1"} style={{ fontWeight: "bold" }}>
                              <td> Total</td>
                              <td style={{ textAlign: "right" }}>
                                {formatCurrencyInINR(
                                  parseFloat(
                                    calculateTotal(
                                      paymentModeData,
                                      "payment_amount"
                                    )
                                  ) +
                                    parseFloat(
                                      itemDetails?.advance_adj_amount
                                    ) +
                                    parseFloat(itemDetails?.total_chit_amount)
                                )}
                              </td>
                            </tr>
                          </tfoot>
                        </Table>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default InvoicePreview;
