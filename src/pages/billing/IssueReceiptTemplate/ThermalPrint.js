import React, { useEffect, useRef } from "react";
import {
  formatCurrencyInINR,
  numberToWords,
} from "../../../components/common/moneyFormat/moneyFormat";

const ThermalPrint = ({ invoiceData, userInfo }) => {
  return (
    <div className="body">
      <title>Invoice</title>
      <style>
        {`@page {
                    size: 76mm 300mm;
                    margin: 2mm;
                    margin-left: 2mm;
                    /* Set the size for the page */
                }
                .estmateNo{
                    text-align: left;
                    font-weight: bold;
                    color :black;
                    font-family: "EPSON Font", Free 3 of 9, monospace !important;
                }
                
                .body{
                    width: 297px; /* Match paper width (like 80mm = ~280px) */
                    text-transform: uppercase;
                    font-size: 10pt;
                    font-weight: bold;
                    font-family: 'Courier New', Courier, monospace;
                    // font-family:  "EPSON Font", Free 3 of 9, monospace !important;
                    margin-top: 0;
                    padding: 0;
                    color:black;
                    //line-height: 1.8;
                    color:#000000;
                    background-color : #ffffff;
                    -webkit-print-color-adjust: exact !important; /* Chrome, Safari */
                    print-color-adjust: exact !important; /* Non-WebKit browsers */
                }
                @media print {
                    .pagebreak 
                        { 
                            page-break-after: always;
                            break-before: always;
                        } /* page-break-after works, as well */
                    body {
                        -webkit-print-color-adjust: exact !important; /* Chrome, Safari */
                        color-adjust: exact !important; /* Non-WebKit browsers */
                        print-color-adjust: exact !important; /* Non-WebKit browsers */
                        color:#000000;
                        background-color : #ffffff;
                        font-size: 16px;
                    }
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

      {/* <div className="header">
                <h4 className="estmateNo">TAX INVOICE</h4>
                <br />
                <div className="info">
                   <span>NAME : {invoiceData.customer_name}</span>

                    <span>INVOICE NO : {invoiceData.invoice_data.invoice_no}</span>
                </div>

                <div className="info">
                   <span>MOBILE : {invoiceData.customer_mobile}</span>
                   <span>DATE : {invoiceData.invoice_date}</span>

                </div>

                <div className="info">
                   <span>Address : {invoiceData?.address?.line1}
                    {invoiceData?.address?.line2}
                    {invoiceData?.address?.line3}</span>
                   <span>GOLD 22KT : {invoiceData.metal_rates.gold_22ct}</span>

                </div>

                <div className="info">
                   <span>{invoiceData?.address?.state_name} - {invoiceData?.address?.pincode}</span>
                   <span>GOLD 18K : {invoiceData.metal_rates.gold_18ct}</span>

                </div>

                <div className="info">
                    <span>{invoiceData.gst_number != null && ( "GST NO :"+invoiceData.gst_number )}</span>
                    <span>SILVER : {invoiceData.metal_rates.silver_G}</span>
                </div>

                {invoiceData.pan_number != null && ( 
                    <div className="info">
                        <span>PAN NO : {invoiceData.pan_number}</span>
                    </div>
                 )}



               
            </div> */}

      <div className="" style={{ textAlign: "center" }}>
        <span>{userInfo?.user?.company_fullname}</span>
        <br></br>
      </div>

      <div className="header">
        <div className="info">
          <span> INV NO : {invoiceData.bill_no}</span>
        </div>
        <div className="info">
          {invoiceData?.customer != null && (
            <span>
              NAME : {invoiceData.customer_name}
              <br></br>
            </span>
          )}

          <span> DATE : {invoiceData.bill_date} </span>
        </div>
      </div>

      <div
        className="title"
        style={{ textAlign: "center", fontWeight: "bold" }}
      >
        <span style={{ fontSize: "16px" }}>{invoiceData?.sub_type}</span>
      </div>

      <div className="doted_hr"></div>

      <div class="content" style={{ textAlign: "left" }}>
        <table>
          <tr>
            <td>{invoiceData?.remarks}</td>
            <td className="alignright">{invoiceData?.amount}</td>
          </tr>
        </table>
      </div>
      <div className="doted_hr"></div>

      {invoiceData?.payment_details?.map((item, index) => (
        <table>
          <tr key={index}>
            <td className="alignleft">{item.mode_name}</td>
            <td className="alignright">
              {formatCurrencyInINR(item.payment_amount)}
            </td>
          </tr>
        </table>
      ))}
    {invoiceData?.total_credit_amount > 0 && (
            <div class="content" style={{ textAlign: "left" }}>
                <table>
                <tr>
                    <td>Outstanding Amount</td>
                    <td className="alignright">
                    {formatCurrencyInINR(invoiceData?.total_credit_amount)}
                    </td>
                </tr>
                </table>
            </div>
    )}
      
    {invoiceData?.paid_amount > 0 && (
             <div class="content" style={{ textAlign: "left" }}>
        <table>
          <tr>
            <td>Paid Amount</td>
            <td className="alignright">
              {formatCurrencyInINR(invoiceData?.paid_amount)}
            </td>
          </tr>
        </table>
      </div>
    )}
     
        {invoiceData?.balance_amount > 0 && (
                 <div class="content" style={{ textAlign: "left" }}>
                        <table>
                        <tr>
                            <td>Balance Amount</td>
                            <td className="alignright">
                            {formatCurrencyInINR(invoiceData?.balance_amount)}
                            </td>
                        </tr>
                        </table>
                    </div>
        )}

         <div  style={{ textAlign: "center", marginTop: "20px" }}>
            <span>{invoiceData?.employee_name + '  '+ invoiceData?.created_date_time}</span><br></br>
            <br></br>
            <span>Sign</span><br></br>
        </div>
     
    </div>
  );
};

export default ThermalPrint;
