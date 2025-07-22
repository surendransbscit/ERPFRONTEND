import React, { useEffect, useRef } from "react";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";

const PurchasePrintTemplateTwo = ({ purhcaseData , userInfo}) => {
  return (
    <div className="body">
      <title>Estimate : </title>
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
                      margin-top: 0;
                      padding: 0;
                      color:black;
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

        <div className="" style={{textAlign:"center"}}>
            <span>{userInfo?.user?.company_fullname}</span><br></br>
            <span>{userInfo?.user?.company_address}</span><br></br>
            <span>{userInfo?.user?.company_city}</span><br></br>
        </div>

        <div className="title" style={{textAlign:"center", fontWeight:"bold"}}>
              <span style={{fontSize:"16px"}}>PURCHASE RECEIPT </span>
        </div>

      <div className="header">
        
        <br></br>
        <div className="info">
          <div style={{ textTransform: "uppercase" }}>
            <span>PO No : {purhcaseData.ref_no}</span> <br></br>
          </div>

          <div className="" style={{ width: "46%" }}>
            <span>SUPPLIER: {purhcaseData.supplier_name}</span>
            <br></br>
            <span>DATE: {purhcaseData.entry_date}</span>
          </div>
        </div>
        <hr className="doted_hr" />
      </div>

        

      {purhcaseData?.item_details?.length > 0 && (
        <div className="salesDetails">
          <table className="sales_details" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th className="alignright" style={{ width: "1%" }}>
                  PCS
                </th>
                <th className="alignright" style={{ width: "30%" }}>
                  GWT
                </th>
               
                <th className="alignright" style={{ width: "30%" }}>
                  PURE
                </th>
                <th className="alignright" style={{ width: "39%" }}>
                  AMT
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4">
                  <hr className="doted_hr" />
                </td>
              </tr>
              {purhcaseData?.item_details?.map((item, index) => (<>
                
                  <tr key={index}>
                    <td className="alignleft" colSpan="4">
                      {parseInt(index) + 1}.{item.product_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="alignright"  >{item.pieces}</td>
                    <td className="alignright" >{item.gross_wt}</td>
                    <td className="alignright"  >{item.pure_wt}</td>
                    <td className="alignright"  >{item.purchase_cost}</td>
                  </tr>
                   {item?.stone_details?.length > 0 && 
                    item?.stone_details?.map((stn, i) => (
                      <tr>
                        <td colSpan="4">
                          {stn?.stone_name}  {stn?.stone_wt}  @{stn?.pur_st_rate}  
                        </td>
                      </tr>
                ))}
                </>
              ))}

              
            </tbody>
          </table>
          <table style={{ width: "100%" }}>
            <tr >
              <td colSpan="4">
                   <hr className="doted_hr" />
              </td>
            </tr>
            <tr>
              
              <td style={{ width: "1%" }} className="alignright">
                {purhcaseData.total_pcs}
              </td>
              <td style={{ width: "30%" }} className="alignright">
                {purhcaseData.total_gross_wt}
              </td>
              <td style={{ width: "30%" }} className="alignright">
                {purhcaseData.total_pure_weight}
              </td>
              <td style={{ width: "39%" }} className="alignright">
                {purhcaseData.purchase_amount}
              </td>
            </tr>
            </table>
        </div>
      )}

      {purhcaseData?.charges_details?.length > 0 && (
        

        <div className="chargesDetails">
          <table className="charges_details" style={{ width: "100%" }}>
            <thead>
              <tr>
                <td colSpan="4">
                  <hr className="doted_hr" />
                </td>
              </tr>
              <tr>
                <th className="alignleft" style={{ width: "60%" }}>
                  Charges
                </th>
                <th className="alignright" style={{ width: "40%" }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {purhcaseData?.charges_details?.map((charge, index) => (
                  <tr key={index}>
                    <td className="alignleft">{charge.charge_name}</td>
                    <td className="alignright">
                      {formatCurrencyInINR(charge.charges_amount)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      )}

      <table style={{ width: "100%" }}>
        <tr>
          <td colSpan="4">
            <hr className="doted_hr" />
          </td>
        </tr>
        <tr>
          <td className="alignleft" style={{ width: "60%" }}>
            Total
          </td>
          <td className="alignright" style={{ width: "40%" }}>
            {formatCurrencyInINR(purhcaseData?.net_amount)}
          </td>
        </tr>
      </table>

    </div>
  );
};

export default PurchasePrintTemplateTwo;
