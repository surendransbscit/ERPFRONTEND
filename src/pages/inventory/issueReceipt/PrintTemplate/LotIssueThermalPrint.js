import React, { useEffect, useRef } from "react";
import { formatCurrencyInINR } from "../../../../components/common/moneyFormat/moneyFormat";
import { useDispatch, useSelector } from "react-redux";
const LotIssueThermalPrint = ({invoiceData,userInfo}) => {
    console.log(invoiceData,"invoiceData");
    
    return (
        <div className="body">
            <style>
                {
                `@page {
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
                `
                }
            </style>

             <div className="" style={{textAlign:"center"}}>
                <span>{userInfo?.user?.company_fullname}</span><br></br>
                <span>{userInfo?.user?.company_address}</span><br></br>
                <span>{userInfo?.user?.company_city}</span><br></br>
            </div>

             <div className="header">
                <div className="info">
                    <span> REF NO : {invoiceData.ref_no}</span>
                    
                </div>
                <div className="info">
                   <span>EMP : {invoiceData.issue_employee}</span>
                    <span> DATE : {invoiceData.entry_date}  </span>
                </div>
            </div>

            <div className="title" style={{textAlign:"center", fontWeight:"bold"}}>
                    <span style={{fontSize:"16px"}}>LOT ISSUE </span>
            </div>     
            <div className="doted_hr"></div>

            <table style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th className="alignleft" style={{ width: "30%" }}>Lot No</th>
                        <th className="alignleft" style={{ width: "10%" }}>Product</th>
                        <th className="alignright" style={{ width: "30%" }}>Pcs</th>
                        <th className="alignright" style={{ width: "30%" }}>Gwt</th>
                        
                    </tr>
                    <tr>
                        <th colSpan="4">
                            <div className="doted_hr"></div>
                        </th>
                       
                    </tr>
                </thead>
                <tbody>
                    {invoiceData?.items?.map((item, index) => (
                        <tr key={index}>
                            <td className="alignleft">{item.lot_no}</td>
                            <td className="alignleft">{item.product_name}</td>
                            <td className="alignright">{item.pieces}</td>
                            <td className="alignright">{(item.gross_wt)}</td>
                        </tr>
                    ))}
                    
                </tbody>
            </table>     

            <div className="doted_hr"></div>
                <table style={{ width: "100%" }}>
                    <tr>
                        <td style={{ width: "30%" }} className="alignleft">Total</td>
                        <td style={{ width: "10%" }} ></td>
                        <td style={{ width: "30%" }} className="alignright">{invoiceData.total_pcs}</td>
                        <td style={{ width: "30%" }} className="alignright">{(invoiceData.total_gross_weight)}</td>
                    </tr>
                </table>     
        </div>

    );
};

export default LotIssueThermalPrint;
