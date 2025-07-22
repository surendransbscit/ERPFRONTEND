import React, { useEffect, useState } from "react";
import { formatCurrencyInINR } from "../../../../components/common/moneyFormat/moneyFormat";

const PaymentThermalPrint = ({ paymentData }) => {
  return (
    <div className="body">
      <title>Liablity Payment : {paymentData?.receipt_no}</title>
      <style>
        {`@page {
                           size: 120mm 150mm;
                           margin-top: 10px;
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
                           bpurhcaseData-collapse: collapse;
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
        <h4 className="estmateNo">{paymentData?.company}</h4>
        <br />
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td className="alignleft">
                Reciept No : {paymentData?.receipt_no}
              </td>
              {/* <td className="alignright">Branch : {paymentData.branch}</td> */}
            </tr>

            <tr>
              <td className="alignleft">
                Supplier : {paymentData?.supplier_name}
              </td>
              <td className="alignright">DATE : {paymentData?.payment_date}</td>

              {/* <td className="alignright">DATE : {formatDate(paymentData.paymentData_date)}</td> */}
            </tr>
          </tbody>
          <tr>
            <td colSpan="4">
              <hr className="doted_hr" />
            </td>
          </tr>
        </table>

        {/* <hr className="doted_hr" /> */}
      </div>
      {paymentData?.payment_details?.length > 0 && (
        <div>
          <table style={{ width: "100%" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={{ width: "15%" }}>
                  Bill No
                </th>
                <th className="alignright" style={{ width: "15%" }}>
                  Amount
                </th>
                <th className="alignright" style={{ width: "20%" }}>
                  Payment Amount
                </th>
                <th className="alignright" style={{ width: "20%" }}>
                  Balance Amount
                </th>
                <th className="alignright"  style={{ width: "15%" }}>
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5">
                  <hr className="doted_hr" />
                </td>
              </tr>
              {paymentData?.payment_details?.map((item, index) => (
                <>
                  <tr>
                    <td style={{ width: "16%" }} >
                      {item?.bill_no}
                    </td>
                    <td style={{ width: "15%" }} className="alignright">
                      {formatCurrencyInINR(item?.amount)}
                    </td>
                    <td style={{ width: "20%" }} className="alignright">
                      {formatCurrencyInINR(item?.payment_amount)}
                    </td>
                    <td style={{ width: "20%" }} className="alignright">
                      {formatCurrencyInINR(item?.balance_amount)}
                    </td>
                    <td className="alignright" style={{ width: "20%" }} >
                      {item?.remarks}
                    </td>
                  </tr>
                </>
              ))}

              <tr>
                <td colSpan="5">
                  <hr className="doted_hr" />
                </td>
              </tr>
              <tr style={{ textAlign: "left" }}>
                <th  style={{ width: "15%" }}>
                  Total
                </th>
                {/* <th className="alignleft" style={{ width: "5%" }}></th> */}
                <th className="alignright" style={{ width: "20%" }}>
                  {formatCurrencyInINR(paymentData?.entry_amount)}
                </th>
                <th className="alignright" style={{ width: "20%" }}>
                  {formatCurrencyInINR(paymentData?.payment_amount)}
                </th>
                <th className="alignright" style={{ width: "20%" }}>
                  {formatCurrencyInINR(paymentData?.balance_amount)}
                </th>
                <th  style={{ width: "20%" }}></th>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentThermalPrint;
