import React, { useEffect, useRef } from "react";
import { formatCurrencyInINR } from "../../../../components/common/moneyFormat/moneyFormat";

const PrintTemplateOne = ({ order }) => {
  return (
    <div className="body">
      <title>Estimate : </title>
      <style>
        {`@page {
                    size: 80mm 250mm;
                    margin: 2mm;
                    margin-top: 0;
                    /* Set the size for the page */
                }
                .estmateNo{
                    text-align: center;
                    font-weight: bold;
                    color :black;
                    font-family: "Times New Roman", Times, serif !important;
                }
                
                .body{
                    text-transform: uppercase;
                    font-size: 13px;
                    font-family:  "Times New Roman", Times, serif !important;
                    margin-top: 0;
                    padding: 0;
                    color:black;
                    line-height: 1.8;
                }
                @media print {
                        .pagebreak { page-break-after: always; } /* page-break-after works, as well */
                    }
                .info {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                }
                .doted_hr {
                    border-top: 1px dashed black;
                    color:black;
                    opacity: 1 !important;
                    margin :6px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 0;
                    padding: 0;
                }
                .alignleft{
                    text-align: left;
                }
                .alignright{
                    text-align: right;
                }
                .aligncenter{
                    text-align: center;
                }
                `}
      </style>

      <div className="header">
        <h4 className="estmateNo">{order.company_name}</h4>
        <br />
        <div className="info">
          <span>ORDER NO : {order.order_no}</span>
          <span>ORD.DATE : {order.date}</span>
        </div>
          <div className="info">
          <span>CUS:{order.cus_name}</span>
          <span>DEL.DATE : {order.due_date}</span>
        </div>
        <div className="info">
          <span>MOB : {order.customer_mobile}</span>
          <span></span>
        </div>


        <hr className="doted_hr" />
      </div>
      {order.order_details.length > 0 && (
        <div className="salesDetails">
          <table className="sales_details" style={{ width: "100%" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th className="alignleft" style={{ width: "10%" }}>
                  S.No
                </th>
                <th className="alignleft" style={{ width: "45%" }}>
                  Description
                </th>
                <th className="alignright" style={{ width: "5%" }}>
                  Pcs
                </th>
                <th className="alignright" style={{ width: "15%" }}>
                  Nwt
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4">
                  <hr className="doted_hr" />
                </td>
              </tr>
              {order.order_details.map((item, index) => (
                <tr>
                  <td style={{ width: "5%" }} className="alignleft">
                    {item.sno}
                  </td>
                  <td style={{ width: "45%" }} className="alignleft">
                    {item.product_name}
                  </td>
                  <td style={{ width: "5%" }} className="alignleft">
                    {item.pieces}
                  </td>
                  <td style={{ width: "15%" }} className="alignright">
                    {item.gross_wt}
                  </td>
                </tr>
              ))}



              {parseFloat(order.total_net_wt) > 0 && (
                <>
                <tr>
                  <td colSpan="4">
                    <hr className="doted_hr" />
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td className="alignleft" colSpan="3">
                    Weight
                  </td>
                  <td className="alignright">{order.total_net_wt}</td>
                </tr>
                              <tr>
                <td colSpan="4">
                  <hr className="doted_hr" />
                </td>
              </tr>
              </>
              )}

              {/* {(parseFloat(order.total_wastage_wt) > 0 && ()) && (
                <tr style={{ fontWeight: "bold" }}>
                  <td className="alignleft" colSpan="3">
                    Wastage (+)
                  </td>
                  <td className="alignright">{order.total_wastage_wt}</td>
                </tr>
              )} */}


            </tbody>
          </table>

          <table>
            <tbody>
              {/* <tr style={{ fontWeight: "bold" }}>
                <td style={{ fontWeight: "bold", width: "50%" }}></td>
                <td
                  className="alignright"
                  style={{ fontWeight: "bold", width: "35%" }}
                  colSpan={2}
                >
                  {order.order_details[0].rate_per_gram}
                </td>
                <td
                  className="alignright"
                  style={{ fontWeight: "bold", width: "15%" }}
                  colSpan={2}
                >
                  * {order.total_weight}
                </td>
               
              </tr> */}

              {/* {parseFloat(order.taxable_amnt) > 0 && (
                <tr style={{ fontWeight: "bold" }}>
                  <td className="alignleft" colSpan="4">
                    Value :
                  </td>
                  <td className="alignright">
                    {formatCurrencyInINR(order.taxable_amnt)}
                  </td>
                </tr>
              )} */}

              {/* {parseFloat(order.tax_amnt) > 0 && (
                <tr style={{ fontWeight: "bold" }}>
                  <td className="alignleft" colSpan="4">
                    TAX :
                  </td>
                  <td className="alignright">
                    {formatCurrencyInINR(order.tax_amnt)}
                  </td>
                </tr>
              )} */}

              {(parseFloat(order.total_item_cost) > 0 && order.is_rate_fixed_on_order == 2) && (
                <>
                <tr style={{ fontWeight: "bold" }}>
                  <td className="alignleft" colSpan="4">
                    Value :
                  </td>
                  <td className="alignright">
                    {formatCurrencyInINR(order.total_item_cost)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="5">
                    <hr className="doted_hr" />
                  </td>
                </tr>
                </>
              )}


              {parseFloat(order.payment_amount) > 0 && (
                <tr style={{ fontWeight: "bold" }}>
                  <td className="alignleft" colSpan="4">
                    ADVANCE :
                  </td>
                  <td className="alignright">
                    {formatCurrencyInINR(order.payment_amount)}
                  </td>
                </tr>
              )}
              {parseFloat(order.total_old_metal_cost) > 0 && (
                <tr style={{ fontWeight: "bold" }}>
                  <td className="alignleft" colSpan="4">
                    PURCHASE :
                  </td>
                  <td className="alignright">
                    {formatCurrencyInINR(order.total_old_metal_cost)}
                  </td>
                </tr>
              )}
              {(parseFloat(order.balance_amt) > 0 && order.is_rate_fixed_on_order == 2) && (
                <tr style={{ fontWeight: "bold" }}>
                  <td className="alignleft" colSpan="4">
                    BALANCE :
                  </td>
                  <td className="alignright">
                    {formatCurrencyInINR(order.balance_amt)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PrintTemplateOne;
