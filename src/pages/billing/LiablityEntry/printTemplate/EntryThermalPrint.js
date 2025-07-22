import React from "react";
import { formatCurrencyInINR } from "../../../../components/common/moneyFormat/moneyFormat";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const EntryThermalPrint = ({ liablity }) => {
  return (
    <div className="body">
      <title>ORDER 00002</title>
      <style>
        {`@page {
                     size: 80mm 80mm;
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

      {/* Header Section */}
      <div className="header">
        <h4 className="estmateNo mt-2" style={{ textAlign: "center" }}>
          {liablity?.company}
        </h4>
        <br />
        <h6 style={{ color: "black", fontFamily: "Times New Roman" }}>
          Liablity Entry
        </h6>
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td className="alignleft">NAME : {liablity?.supplier_name}</td>
            </tr>
            <tr>
              <td className="alignleft">MOBILE : {liablity?.mobile}</td>
            </tr>
            <tr>
              <td className="alignleft">BILL NO : {liablity?.bill_no}</td>
            </tr>
            <tr>
              <td className="alignleft">BRANCH : {liablity?.branch}</td>
            </tr>
            <tr>
              <td className="alignleft">ENTRY DATE : {liablity?.entry_date}</td>
            </tr>
            <tr>
              <td className="alignleft">
                AMOUNT: {formatCurrencyInINR(liablity?.amount)}
              </td>
            </tr>
            {liablity?.ref_bill_no !== null && (
              <tr>
                <td className="alignleft">
                  REF BILL NO. : {liablity?.ref_bill_no}
                </td>
              </tr>
            )}
            {liablity?.remarks !== null && (
              <tr>
                <td className="alignleft">RREMARKS : {liablity?.remarks}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntryThermalPrint;
