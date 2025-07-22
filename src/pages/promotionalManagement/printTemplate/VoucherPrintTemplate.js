import React from "react";

const VoucherPrintTemplate = ({ voucherList }) => {
  return (
    <>
      {voucherList?.map((voucher, idx) => {
        return (
          <div className="body" key={idx}>
            <title>
              Voucher
              {voucher.voucher_no}
            </title>
            <style>
              {`
      @page {
        size: A4;
        margin: 5mm;
      }
  
      body {
        text-transform: uppercase !important;
        font-size: 10px;
        font-family: "Times New Roman", Times, serif;
        margin-top: 0;
        padding: 0;
        background-color: #fdf5e6;
      }
  
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 0;
        padding: 0;
      }
  
      hr.dashed {
        border: none;
        border-top: 1px dashed #000;
      }
  
      .alignleft {
        text-align: left;
      }
  
      .alignright {
        text-align: right;
      }
  
      .qr-code img {
        height: 1px;
      }
  
      @media print {
        .pagebreak {
          page-break-after: always;
        }
      }
  
      /* Voucher Container */
      .voucher-container {
        width: 700px;
        height: 350px;
        padding: 20px;
        background-color: #fdf5e6;
        border: 2px solid #d3b46f;
        position: relative;
        border-radius: 12px;
        margin: 0 auto;
      }
  
      /* Header */
      .voucher-header {
        text-align: center;
        color: #000;
        margin-bottom: 10px;
      }
  
      .voucher-amount {
        font-size: 64px;
        text-align: center;
        font-weight: bold;
      }
  
      /* Voucher Code Box */
      .voucher-code-box {
        border: 2px solid #333;
        padding: 10px 20px;
        margin: 20px auto;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 2px;
        width: fit-content;
        background-color: #fff;
      }
  
      /* Footer: Terms */
      .voucher-footer {
        position: absolute;
        bottom: 20px;
        width: 100%;
        text-align: center;
        font-size: 10px;
        padding: 0 20px;
      }
  
      .voucher-footer p {
        margin-bottom: 10px;
      }
  
      /* Branding Placeholder */
      .voucher-branding {
        height: 20px;
        background-color: #333;
        margin: 0 auto;
        width: 150px;
      }
    `}
            </style>

            <div className="voucher-container">
              <h2 className="voucher-header">{voucher.voucher_name}</h2>{" "}
              <div className="voucher-amount">₹{voucher.amount}</div>
              <div className="voucher-code-box">
                VOUCHER CODE: {voucher.voucher_code}
              </div>
              <div className="voucher-footer">
                {voucher.terms_and_conditions}
                {/* <div className="voucher-branding" /> */}
              </div>
            </div>
            <div className="pagebreak"></div>
          </div>
        );
      })}
    </>
  );
};

export default VoucherPrintTemplate;
