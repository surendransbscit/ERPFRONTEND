import React, { useEffect, useRef } from "react";
import { formatCurrencyInINR,numberToWords } from "../../../../components/common/moneyFormat/moneyFormat";

const StockIssueReceiptThermal = ({invoiceData , userInfo }) => {
    return (
        <div className="body">

            <title>Invoice</title>
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
                <div className="title" style={{textAlign:"center", fontWeight:"bold"}}>
                    <span style={{fontSize:"16px"}}>STOCK ISSUE RECEIPT</span>
                </div>
                
                <div className="info">
                    <span>Trans Code : {invoiceData?.trans_code}</span>
                    <span>DATE : {invoiceData?.trans_date}</span>
                </div>
                <div className="info">
                    <span>From : {invoiceData?.transfer_from}</span><br></br>
                    <span>To : {invoiceData?.issued_to}</span>
                </div>
            </div>

            {parseInt(invoiceData?.print_type) == 1 && invoiceData.item_details.length > 0 && (
                <div className="salesDetails">

                    <table className="sales_details" style={{ width: "100%" }}>
                        <thead>
                        <tr style={{ textAlign: "left" }}>
                            <th colSpan={"5"}><hr className="doted_hr" /></th>
                        </tr>
                            <tr style={{ textAlign: "left" }}>
                                <th className="alignleft" style={{ width: "10%" }}>Sl</th>
                                <th className="alignleft" style={{ width: "20%" }}>Item</th>
                                <th className="alignright" style={{ width: "20%" }}>Pcs</th>
                                <th className="alignright" style={{ width: "25%" }}>GWt</th>
                                <th className="alignright" style={{ width: "25%" }}>Nwt</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="5"><hr className="doted_hr" /></td>
                            </tr>
                            {invoiceData.item_details.map((item, index) => (

                                <tr>
                                    <td style={{ width: "10%" }} className="alignleft">{index+1}</td>
                                    <td style={{ width: "20%" }} className="alignleft">{item.product_name}</td>
                                    <td style={{ width: "20%" }} className="alignright">{item.pcs}</td>
                                    <td style={{ width: "25%" }} className="alignright">{item.gross_wt}</td>
                                    <td style={{ width: "25%" }} className="alignright">{item.net_wt}</td>
                                </tr>
                            ))}

                            <tr>
                                {/* <td colspan="2" ></td> */}
                                <td colspan="5"><hr className="doted_hr" /></td>
                            </tr>

                           
                        </tbody>
                    </table>

                    <table className="sales_details" style={{ width: "100%" }}>
                        <tbody>
                            <tr>
                                <td style={{ width: "50%" }} className="alignleft">Total Pcs</td>
                                <td style={{ width: "50%" }} className="alignright">{invoiceData?.total_pcs}</td>
                            </tr>
                            <tr>
                                <td style={{ width: "50%" }} className="alignleft">Total Gross Wt</td>
                                <td style={{ width: "50%" }} className="alignright">{invoiceData?.total_gross_wt}</td>
                            </tr>
                            <tr>
                                <td style={{ width: "50%" }} className="alignleft">Total Net Wt</td>
                                <td style={{ width: "50%" }} className="alignright">{invoiceData?.total_net_wt}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            )}

            {parseInt(invoiceData?.print_type) == 2 && invoiceData.item_details.length > 0 && (
                <div className="salesDetails">

                    <table className="sales_details" style={{ width: "100%" }}>
                        <thead>
                        <tr style={{ textAlign: "left" }}>
                            <th colSpan={"5"}><hr className="doted_hr" /></th>
                        </tr>
                            <tr style={{ textAlign: "left" }}>
                                
                                <th className="alignleft" style={{ width: "35%" }}>Tag No</th>
                                <th className="alignleft" style={{ width: "20%" }}>Item</th>
                                <th className="alignright" style={{ width: "1%" }}>Pcs</th>
                                <th className="alignright" style={{ width: "25%" }}>GWt</th>
                                <th className="alignright" style={{ width: "24%" }}>Nwt</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="5"><hr className="doted_hr" /></td>
                            </tr>
                            {invoiceData.item_details.map((item, index) => (

                                <tr>
                                    <td  className="alignleft">{item.tag_code}</td>
                                    <td  className="alignleft">{item.product_name}</td>
                                    <td className="alignright">{item.pcs}</td>
                                    <td className="alignright">{item.gross_wt}</td>
                                    <td  className="alignright">{item.net_wt}</td>
                                </tr>
                            ))}

                            <tr>
                                {/* <td colspan="2" ></td> */}
                                <td colspan="5"><hr className="doted_hr" /></td>
                            </tr>

                           
                        </tbody>
                    </table>

                    <table className="sales_details" style={{ width: "100%" }}>
                        <tbody>
                            <tr>
                                <td style={{ width: "50%" }} className="alignleft">Total Pcs</td>
                                <td style={{ width: "50%" }} className="alignright">{invoiceData?.total_pcs}</td>
                            </tr>
                            <tr>
                                <td style={{ width: "50%" }} className="alignleft">Total Gross Wt</td>
                                <td style={{ width: "50%" }} className="alignright">{invoiceData?.total_gross_wt}</td>
                            </tr>
                            <tr>
                                <td style={{ width: "50%" }} className="alignleft">Total Net Wt</td>
                                <td style={{ width: "50%" }} className="alignright">{invoiceData?.total_net_wt}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            )}


        </div>
    );
};

export default StockIssueReceiptThermal;
