import React, { useEffect, useRef } from "react";
import {
  formatCurrencyInINR,
  numberToWords,
} from "../../../components/common/moneyFormat/moneyFormat";
import hallmark from "../../../images/hallmark.jpg";
import playstore from "../../../images/social/playstore.png";
import web from "../../../images/social/web.png";
import mail from "../../../images/social/mail.png";
import loc from "../../../images/social/loc.png";
import ph from "../../../images/social/phone.png";
import logo from "../../../images/avsr/avsrlogo.png";
import qr from "../../../images/avsr/qr.jpg";
import qrs from "../../../images/avsr/qr.jpg";
import whatsapp from "../../../images/social/whatsapp.png";
import facebook from "../../../images/social/facebook.png";
import google from "../../../images/social/google.png";
import instagram from "../../../images/social/instagram.png";

const BillingPrintTemplateThree = ({ invoiceData, userInfo }) => {
  return (
    <div className="body">
      <title>Invoice</title>
      <style>
        {`
               @page {
                    size: A4;
                    margin: 20mm 10mm 20mm 10mm; /* top, right, bottom, left */
                }

                body {
                    margin: 0;
                    padding-top: 10mm; /* Add top padding inside the printable area */
                    padding-left: 5mm;
                    padding-right: 5mm;
                     padding-bottom: 60px;
                    display: block;
                }
                .estmateNo{
                    text-align: center;
                    font-weight: bold;
                    color :black;
                    font-family: "Times New Roman", Times, serif !important;
                }
                .info {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                }
                .doted_hr {
                    // border-top: 1px dashed black;
                    color:black;
                    opacity: 1 !important;
                    margin :6px 0;
                }
                body{
                    text-transform: uppercase;
                    font-size: 12px;
                    font-family: "Times New Roman", Times, serif;
                    margin-top: 0;
                    padding: 0;
                    color :black;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 0;
                    padding: 0;
                }

                .qr-code img {
                    height: 60px;
                    background-color: aquamarine;
                    margin: 0;
                    padding: 0;
                }
                hr.dashed {
                    // border: none;
                    // border-top: 1px dashed #000; /* Dashed line */
                }

                .alignleft{
                    text-align: left;
                }
                .alignright{
                    text-align: right;
                }
                .qr-code img {
                    height: 1px;
                }
                .payment_summarry{

                }
              @media print {
                    .print-table thead {
                    display: table-header-group;
                  }
                .print-table tbody {
                  display: table-row-group;
                }
                .print-table {
                  page-break-inside: auto;
                  }
                  .final-sections {
        /* Container for payment summary, signatures, etc. */
        page-break-inside: avoid; /* Try to keep together */
        margin-top: auto; /* Push to bottom when space available */
      }
                .print-footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    // padding: 4px 10mm 0 10mm;
                    background: white;
                    z-index: 1000;
                  }

                // .invoice-footer {
                //   border-top: 1px solid black;
                //   }



                .invoice-body {
  padding-bottom: 60px;
}
                }



                `}
      </style>

      <table className="print-table" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>
              <div className="print-header" style={{ paddingBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <img src={logo} alt="logo" style={{ height: "100px" }} />
                  </div>

                  {/* <div style={{ width: "70%", textAlign: "center" }}>
                    <h3 style={{ margin: 0 }}>{invoiceData.company_name}</h3>
                    <p style={{ margin: 0 }}>{invoiceData?.address1}</p>
                    <p style={{ margin: 0 }}>
                      {invoiceData?.address2}, {invoiceData?.pincode}
                    </p>
                    <p style={{ margin: 0 }}>Call: {invoiceData?.mobile}</p>
                    <p style={{ margin: 0 }}>GSTIN: {invoiceData.gst_number}</p>
                  </div> */}
                </div>
                <hr />
              </div>
              {/* <div> */}
              {/* <h6
                style={{
                  textAlign: "center",
                  fontFamily: "Times New Roman",
                  color: "black",
                }}
              >
                {`GSTIN : ${invoiceData.gst_number}`}
              </h6> */}
              {/* </div> */}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <h6
                style={{
                  textAlign: "center",
                  fontFamily: "Times New Roman",
                  color: "black",
                }}
              >
                {`GSTIN : ${invoiceData.gst_number}`}
              </h6>
              <strong
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                Tax Invoice
              </strong>

              <div
                className="invoice-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  marginTop: "20px",
                }}
              >
                <div
                  className="customer-details"
                  style={{ width: "50%", lineHeight: "2", fontWeight: "bold" }}
                >
                  <strong>To:</strong>
                  <br />
                  {invoiceData.customer_name}
                  <br />
                  {/* {invoiceData.company_strip_address &&
                    invoiceData.company_strip_address !== null && (
                      <>
                        {invoiceData.company_strip_address}
                        <br />
                      </>
                    )} */}

                  {invoiceData?.cus_address1 && (
                    <>{invoiceData?.cus_address1}</>
                  )}

                  {invoiceData?.cus_address2 && (
                    <>
                      <br />
                      {invoiceData?.cus_address2} <br />
                    </>
                  )}
                  {invoiceData?.cus_address3 && (
                    <>
                      {" "}
                      <br />
                      {invoiceData?.cus_address3} <br />
                    </>
                  )}

                  {invoiceData.customer_mobile}
                </div>

                <table
                  style={{
                    width: "35%",
                    marginTop: "1rem",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  <tbody>
                    <tr>
                      <td colSpan={8}></td>
                      <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                        Invoice No
                      </td>
                      <td style={{ width: "5%", textAlign: "center" }}>:</td>
                      <td style={{ textAlign: "left" }}>
                        {invoiceData.invoice_data.invoice_no}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={8}></td>
                      <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                        Date
                      </td>
                      <td style={{ textAlign: "center" }}>:</td>
                      <td style={{ textAlign: "left" }}>{invoiceData.date}</td>
                    </tr>
                    {/* <tr>
                      <td colSpan={8}></td>
                      <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                        GSTIN
                      </td>
                      <td style={{ textAlign: "center" }}>:</td>
                      <td style={{ textAlign: "left" }}>
                        {invoiceData.gst_number}
                      </td>
                    </tr> */}
                    {/* <tr>
                      <td colSpan={8}></td>
                      <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                        State Code
                      </td>
                      <td style={{ textAlign: "center" }}>:</td>
                      <td style={{ textAlign: "left" }}>
                        {invoiceData.state_code}
                      </td>
                    </tr> */}

                    <tr style={{ marginTop: "10px" }}>
                      <td colSpan={8}></td>
                      <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                        Gold Rate
                      </td>
                      <td style={{ textAlign: "center" }}>:</td>
                      <td style={{ textAlign: "left" }}>
                        {invoiceData.metal_rates.gold_22ct}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={8}></td>
                      <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                        G.Coin Rate
                      </td>
                      <td style={{ textAlign: "center" }}>:</td>
                      <td style={{ textAlign: "left" }}>
                        {invoiceData.metal_rates.gold_24ct}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={8}></td>
                      <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                        Silver Rate
                      </td>
                      <td style={{ textAlign: "center" }}>:</td>
                      <td style={{ textAlign: "left" }}>
                        {invoiceData.metal_rates.silver_G}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={8}></td>
                      <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                        S.Coin Rate
                      </td>
                      <td style={{ textAlign: "center" }}>:</td>
                      <td style={{ textAlign: "left" }}>
                        {parseFloat(
                          invoiceData.metal_rates.silver_coin_rate
                        ).toFixed(2)}
                      </td>
                    </tr>

                    {/* <tr>
                      <td colSpan={8}></td>
                      <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                        Vessels Rate
                      </td>
                      <td style={{ textAlign: "center" }}>:</td>
                      <td style={{ textAlign: "left" }}>
                        {invoiceData.metal_rates.vessel_rate}
                      </td>
                    </tr> */}
                    {/* <tr>
                      <td colSpan={8}></td>
                      <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                        {parseInt(invoiceData.metal) === 1
                          ? "Gold Rate"
                          : "Silver Rate"}
                      </td>
                      <td style={{ textAlign: "center" }}>:</td>
                      <td style={{ textAlign: "left" }}>
                        {parseInt(invoiceData.metal) === 1
                          ? invoiceData.metal_rates.gold_22ct
                          : invoiceData.metal_rates.silver_G}
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>

              {invoiceData.sales_details.length > 0 && (
                <div className="salesDetails">
                  <table
                    className="sales_details"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr style={{ textAlign: "left" }}>
                        <th colSpan={11}>
                          <hr className="doted_hr" />
                        </th>
                      </tr>
                      <tr style={{ textAlign: "left" }}>
                        <th
                          className="alignleft"
                          style={{ width: "5%", textAlign: "left" }}
                        >
                          S.No
                        </th>
                        <th
                          className="alignleft"
                          style={{ width: "15%", textAlign: "left" }}
                        >
                          Description
                        </th>
                        <th
                          className="alignright"
                          style={{ width: "8%", textAlign: "right" }}
                        >
                          HSN{" "}
                        </th>
                        <th
                          className="alignright"
                          style={{ width: "8%", textAlign: "right" }}
                        >
                          Grs
                        </th>
                        <th
                          className="alignright"
                          style={{ width: "8%", textAlign: "right" }}
                        >
                          Lwt
                        </th>
                        <th
                          className="alignright"
                          style={{ width: "8%", textAlign: "right" }}
                        >
                          Net
                        </th>
                        <th
                          className="alignright"
                          style={{ width: "8%", textAlign: "right" }}
                        >
                          Purity
                        </th>

                        <th
                          className="alignright"
                          style={{ width: "8%", textAlign: "right" }}
                        >
                          VA
                        </th>
                        <th
                          className="alignright"
                          style={{ width: "8%", textAlign: "right" }}
                        >
                          MC
                        </th>
                        <th
                          className="alignright"
                          style={{ width: "8%", textAlign: "right" }}
                        >
                          Stn{" "}
                        </th>
                        <th
                          className="alignright"
                          style={{ width: "10%", textAlign: "right" }}
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={11}>
                          <hr className="doted_hr" />
                        </td>
                      </tr>
                      {invoiceData.sales_details.map((item, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: "left", width: "5%" }}>
                            {index + 1}
                          </td>
                          <td style={{ textAlign: "left", width: "15%" }}>
                            {item.product_name} - {item.design_name}
                          </td>
                          <td style={{ textAlign: "right", width: "8%" }}>
                            {item.hsn_code}
                          </td>
                          <td style={{ textAlign: "right", width: "8%" }}>
                            {item.gross_wt}
                          </td>
                          <td style={{ textAlign: "right", width: "8%" }}>
                            {item.less_wt}
                          </td>
                          <td style={{ textAlign: "right", width: "8%" }}>
                            {item.net_wt}
                          </td>
                          <td style={{ textAlign: "right", width: "8%" }}>
                            {item.purity_name}
                          </td>

                          <td style={{ textAlign: "right", width: "8%" }}>
                            {item.mc_value}
                          </td>
                          <td style={{ textAlign: "right", width: "8%" }}>
                            {item.mc_value}
                          </td>
                          <td style={{ textAlign: "right", width: "8%" }}>
                            {item.stone_amount}
                          </td>
                          <td style={{ textAlign: "right", width: "10%" }}>
                            {item.taxable_amount}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={11}>
                          <hr className="doted_hr" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    style={{
                      width: "100%",
                      marginTop: "6px",
                      fontWeight: "bold",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td colSpan={8}></td>
                        <td style={{ textAlign: "right" }} colSpan={3}>
                          Total
                        </td>
                        <td style={{ textAlign: "right", width: "15%" }}>
                          {formatCurrencyInINR(invoiceData.total_taxable)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {invoiceData.purchase_details.length > 0 && (
                <div
                  className="purchaseDetails "
                  style={{ marginTop: "5px", display: "flex" }}
                >
                  <table className="purchase" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th className="aligncenter" colSpan="7">
                          <span
                            style={{ fontWeight: "bold", fontSize: "14px" }}
                          >
                            PURCHASE
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <th colSpan="7">
                          {" "}
                          <hr className="doted_hr" />
                        </th>
                      </tr>
                      <tr style={{ textAlign: "left" }}>
                        <th className="alignleft">Item</th>
                        <th className="alignright">GWt</th>
                        <th className="alignright">Lwt</th>
                        <th className="alignright">NWT</th>
                        <th className="alignright">Rate</th>
                        <th className="alignright">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="6">
                          <hr className="doted_hr" />
                        </td>
                      </tr>

                      {invoiceData.purchase_details.map((item, index) => (
                        <tr key={index}>
                          <td className="alignleft">
                            {item.old_metal_type_name}
                          </td>
                          <td className="alignright">{item.gross_wt}</td>
                          <td className="alignright">
                            {item.custom_less_weight}
                          </td>
                          <td className="alignright">{item.pure_weight}</td>
                          <td className="alignright">
                            {parseFloat(item.rate_per_gram).toFixed(2)}
                          </td>
                          <td className="alignright">
                            {formatCurrencyInINR(item.amount)}
                          </td>
                        </tr>
                      ))}

                      <tr>
                        <td colSpan="6">
                          <hr className="doted_hr" />
                        </td>
                      </tr>

                      <tr>
                        <td className="alignleft">TOTAL</td>
                        <td className="alignright">
                          {invoiceData.total_pur_gwt}
                        </td>
                        <td className="alignright">
                          {invoiceData.total_pur_lwt}
                        </td>
                        <td className="alignright">
                          {invoiceData.total_pur_pure_wt}
                        </td>
                        <td className="alignright"></td>
                        <td className="alignright">
                          {formatCurrencyInINR(invoiceData.purchase_amount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {invoiceData.return_details.length > 0 && (
                <div
                  className="salesReturnDetails"
                  style={{ marginTop: "8px", display: "flex" }}
                >
                  {/* <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                    SALES RETURN
                  </span> */}

                  <table
                    className="sales_return_details"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th className="aligncenter" colSpan="7">
                          <span
                            style={{ fontWeight: "bold", fontSize: "14px" }}
                          >
                            SALES RETURN
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <th colSpan="5">
                          {" "}
                          <hr className="doted_hr" />
                        </th>
                      </tr>
                      <tr style={{ textAlign: "left" }}>
                        <th className="alignleft">DESC</th>
                        <th className="alignright">PCS</th>
                        <th className="alignright">NWT</th>
                        <th className="alignright">AMT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="4">
                          <hr className="doted_hr" />
                        </td>
                      </tr>
                      {invoiceData.return_details.map((item, index) => (
                        <tr>
                          <td className="alignleft">{item.product_name}</td>
                          <td className="alignright">{item.pieces} </td>
                          <td className="alignright">{item.net_wt}</td>
                          <td className="alignright">{item.item_cost}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="4">
                          <hr className="doted_hr" />
                        </td>
                      </tr>
                      <tr>
                        <td className="alignleft" colSpan="1">
                          TOTAL
                        </td>
                        <td className="alignright">
                          {invoiceData.sr_total_pcs}
                        </td>
                        <td className="alignright">
                          {invoiceData.sr_total_nwt}
                        </td>

                        <td className="alignright">
                          {formatCurrencyInINR(invoiceData.return_amount)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          {" "}
                          <hr className="doted_hr" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className="final-sections">
                <div>
                  <table
                    style={{
                      width: "100%",
                      marginTop: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    <tbody>
                      {parseFloat(invoiceData.discount_amount) > 0 && (
                        <tr>
                          <td colSpan={8}></td>
                          <td style={{ textAlign: "right" }} colSpan={3}>
                            Discount
                          </td>
                          <td style={{ textAlign: "right", width: "15%" }}>
                            {formatCurrencyInINR(
                              invoiceData.total_discount_amount
                            )}
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td colSpan={8}></td>
                        <td style={{ textAlign: "right" }} colSpan={3}>
                          Taxable Amount
                        </td>
                        <td style={{ textAlign: "right", width: "15%" }}>
                          {formatCurrencyInINR(invoiceData.total_taxable)}
                        </td>
                      </tr>

                      {parseFloat(invoiceData.cgst_cost) > 0 && (
                        <tr>
                          <td colSpan={8}></td>
                          <td style={{ textAlign: "right" }} colSpan={3}>
                            CGST (
                            {(parseFloat(invoiceData.tax_per) / 2).toFixed(1)}%)
                          </td>
                          <td style={{ textAlign: "right", width: "15%" }}>
                            {formatCurrencyInINR(invoiceData.cgst_cost)}
                          </td>
                        </tr>
                      )}

                      {parseFloat(invoiceData.sgst_cost) > 0 && (
                        <tr>
                          <td colSpan={8}></td>
                          <td style={{ textAlign: "right" }} colSpan={3}>
                            SGST (
                            {(parseFloat(invoiceData.tax_per) / 2).toFixed(1)}%)
                          </td>
                          <td style={{ textAlign: "right", width: "15%" }}>
                            {formatCurrencyInINR(invoiceData.sgst_cost)}
                          </td>
                        </tr>
                      )}

                      {parseFloat(invoiceData.igst_cost) > 0 && (
                        <tr>
                          <td colSpan={8}></td>
                          <td style={{ textAlign: "right" }} colSpan={3}>
                            IGST ({parseFloat(invoiceData.tax_per).toFixed(1)}%)
                          </td>
                          <td style={{ textAlign: "right", width: "15%" }}>
                            {formatCurrencyInINR(invoiceData.igst_cost)}
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td colSpan={8}></td>
                        <td style={{ textAlign: "right" }} colSpan={3}>
                          Total Sales Amount
                        </td>
                        <td style={{ textAlign: "right", width: "15%" }}>
                          {formatCurrencyInINR(invoiceData.sales_amount)}
                        </td>
                      </tr>

                      {parseFloat(invoiceData.return_amount) > 0 && (
                        <tr>
                          <td colSpan={8}></td>
                          <td style={{ textAlign: "right" }} colSpan={3}>
                            Sales Return
                          </td>
                          <td style={{ textAlign: "right", width: "15%" }}>
                            {formatCurrencyInINR(invoiceData.return_amount)}
                          </td>
                        </tr>
                      )}

                      {parseFloat(invoiceData.purchase_amount) > 0 && (
                        <tr>
                          <td colSpan={8}></td>
                          <td style={{ textAlign: "right" }} colSpan={3}>
                            Old Value
                          </td>
                          <td style={{ textAlign: "right", width: "15%" }}>
                            {formatCurrencyInINR(invoiceData.purchase_amount)}
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td colSpan={8}></td>
                        <td style={{ textAlign: "right" }} colSpan={3}>
                          Net
                        </td>
                        <td style={{ textAlign: "right", width: "15%" }}>
                          {formatCurrencyInINR(
                            parseFloat(invoiceData.net_amount).toFixed(2)
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <table className="payment_summarry">
                  <tbody>
                    {parseFloat(invoiceData.deposit_amount) > 0 && (
                      <tr>
                        <td style={{ width: "70%" }}></td>
                        <td style={{ width: "15%" }} className="alignright">
                          DEPOSIT AMOUNT
                        </td>
                        <td style={{ width: "15%" }} className="alignright">
                          {formatCurrencyInINR(invoiceData.deposit_amount)}
                        </td>
                      </tr>
                    )}

                    {parseFloat(invoiceData.advance_adj_amount) > 0 && (
                      <tr>
                        <td style={{ width: "70%" }}></td>
                        <td style={{ width: "15%" }} className="alignright">
                          ADV ADJUSTED
                        </td>
                        <td style={{ width: "15%" }} className="alignright">
                          {formatCurrencyInINR(invoiceData.advance_adj_amount)}
                        </td>
                      </tr>
                    )}

                    {parseFloat(invoiceData.total_chit_amount) > 0 && (
                      <tr>
                        <td style={{ width: "70%" }}></td>
                        <td style={{ width: "15%" }} className="alignright">
                          CHIT ADJUSTED
                        </td>
                        <td style={{ width: "15%" }} className="alignright">
                          {formatCurrencyInINR(invoiceData.total_chit_amount)}
                        </td>
                      </tr>
                    )}

                    {parseFloat(invoiceData.gift_amount) > 0 && (
                      <tr>
                        <td style={{ width: "70%" }}></td>
                        <td style={{ width: "15%" }} className="alignright">
                          GIFT ADJUSTED
                        </td>
                        <td style={{ width: "15%" }} className="alignright">
                          {formatCurrencyInINR(invoiceData.gift_amount)}
                        </td>
                      </tr>
                    )}

                    {parseFloat(invoiceData.due_amount) > 0 && (
                      <tr>
                        <td colSpan={2} className="alignright">
                          {" "}
                          CREDIT ({invoiceData.credit_no})
                        </td>
                        <td style={{ width: "15%" }} className="alignright">
                          {formatCurrencyInINR(invoiceData.due_amount)}
                        </td>
                      </tr>
                    )}

                    {parseFloat(invoiceData.balance_amount) > 0 && (
                      <>
                        <tr>
                          <td></td>
                          <td colSpan="2">
                            {" "}
                            <hr className="doted_hr" />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "70%" }}></td>
                          <td style={{ width: "15%" }} className="alignright">
                            BALANCE
                          </td>
                          <td style={{ width: "15%" }} className="alignright">
                            {formatCurrencyInINR(invoiceData.balance_amount)}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>

                <div
                  style={{
                    marginTop: "30px",
                    fontSize: "12px",
                    borderTop: "1px solid black",
                    paddingTop: "6px",
                  }}
                >
                  <div>
                    <strong>Bill Counter :</strong> &nbsp;{" "}
                    {invoiceData.counter_name}
                  </div>
                  <div style={{ marginTop: "6px" }}>
                    <strong>Cash Received in Words :</strong>
                  </div>
                  <div style={{ marginTop: "2px" }}>
                    Rupees {invoiceData.amount_in_words}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "30px",
                    fontSize: "12px",

                    paddingTop: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Left Signature */}
                  <div style={{ textAlign: "left", width: "45%" }}>
                    <div style={{ marginBottom: "40px" }}></div>
                    <div style={{ borderTop: "1px solid black", width: "60%" }}>
                      Authorized Signatory
                    </div>
                  </div>

                  {/* Right Signature */}
                  <div style={{ textAlign: "right", width: "45%" }}>
                    <div style={{ marginBottom: "40px" }}></div>
                    <div
                      style={{
                        borderTop: "1px solid black",
                        width: "60%",
                        float: "right",
                      }}
                    >
                      Customer Signature
                    </div>
                  </div>
                </div>
              </div>

              <div className="print-footer invoice-footer">
                <div
                  style={{
                    padding: "10px 0",
                    fontSize: "10px",
                    width: "100%",
                  }}
                >
                  {/* Separator Line */}
                  <div
                    style={{
                      borderTop: "1px dashed black",
                      marginBottom: "6px",
                    }}
                  ></div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      gap: "10px", // Adjust gap between sections as needed
                    }}
                  >
                    {/* Address Section */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <img
                        src={hallmark}
                        alt="Hallmark"
                        style={{ width: "25px" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <img
                          src={loc}
                          alt="location"
                          style={{ width: "8px" }}
                        />
                        <span>117, Bazar Street, Jayankondam - 621802</span>
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <img src={ph} alt="Phone" style={{ width: "10px" }} />
                        <span style={{ font: "9px" }}>7639383274</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <img src={mail} alt="Email" style={{ width: "10px" }} />
                        <span
                          style={{ textTransform: "lowercase", font: "9px" }}
                        >
                          support@avsrsaravanaajewellery.com
                        </span>
                      </div>
                    </div>

                    {/* Social QR Section */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <img
                        src={qrs}
                        alt="QR Code"
                        style={{ height: "45px", width: "45px" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <span style={{ fontSize: "9px" }}>Follow us on:</span>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <img
                            src={instagram}
                            alt="Instagram"
                            style={{ width: "12px" }}
                          />
                          <img
                            src={whatsapp}
                            alt="WhatsApp"
                            style={{ width: "12px" }}
                          />
                          <img
                            src={facebook}
                            alt="Facebook"
                            style={{ width: "12px" }}
                          />
                          <img
                            src={google}
                            alt="Google"
                            style={{ width: "12px" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mobile App Section */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontWeight: "600",
                            fontSize: "9px",
                            textAlign: "center",
                          }}
                        >
                          APP NOW AVAILABLE AT
                        </div>
                        <img
                          src={playstore}
                          alt="Play Store"
                          style={{ height: "20px", width: "140px" }}
                        />
                      </div>
                      <img
                        src={qr}
                        alt="QR Code"
                        style={{ height: "45px", width: "45px" }}
                      />
                    </div>
                  </div>

                  {/* Separator Line */}
                  <div
                    style={{ borderTop: "1px dashed black", marginTop: "6px" }}
                  ></div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BillingPrintTemplateThree;
