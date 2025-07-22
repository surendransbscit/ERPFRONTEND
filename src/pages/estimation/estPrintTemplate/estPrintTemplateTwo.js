import React, { useEffect, useRef } from "react";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { QRCodeCanvas } from "qrcode.react";
const EstPrintTemplateTwo = ({estimateData}) => {
    console.log(estimateData,"estimateData");

    return (
        <div className="body">

            <title>Estimate : </title>
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
                `
                }
            </style>

            <div className="header">
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <h4 className="estmateNo" style={{ margin: 0 }}>
                        ESTIMATE NO {estimateData.est_no}
                    </h4>
                    
                    <QRCodeCanvas value={estimateData.est_no} size={35} />
                </div><br></br>
                <div className="info">
                    <div  style={{ textTransform: "uppercase" }}>
                        <span>{estimateData.customer_name}</span> <br></br>
                        <span>{estimateData.customer_mobile}</span><br></br>
                        <span>{estimateData?.address}</span><br></br>
                        <span>{estimateData?.city} {(estimateData?.pin_code!='' ?  estimateData?.pin_code:'')}</span>
                    </div>

                    <div className="" style={{ width: "46%" }}>
                        <span>RATE: {estimateData.metal_rates.gold_22ct}</span><br></br>
                        <span>DATE: {estimateData.date}</span>
                    </div>

                </div>
                <hr className="doted_hr" />
            </div>
            {estimateData.sales_details.length > 0 && (
                <div className="salesDetails">

                    <table className="sales_details" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th className="alignleft" style={{ width: "1%" }}>DESC</th>
                                <th className="alignright" style={{ width: "30%" }}>NWT</th>
                                <th className="alignright" style={{ width: "20%" }}>VA(%)</th>
                                <th className="alignright" style={{ width: "20%" }}>VA(WT)</th>
                                <th className="alignright" style={{ width: "30%" }}>MC</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="5"><hr className="doted_hr" /></td>
                            </tr>
                            {estimateData.sales_details.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="alignleft" colSpan="5">
                                            {item.product_name}
                                            {
                                                (item.old_tag_code!=null && item.old_tag_code!='') ?
                                                ('-' + item.old_tag_code) : (item.tag_code!=null && item.tag_code!='') ?
                                                ('-' + item.tag_code) : ''
                                            }
                                            {item.sell_rate > 0 && <> - Rs : {formatCurrencyInINR(item.item_cost)}</>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td className="alignright">{item.net_wt}</td>
                                        <td className="alignright">{parseInt(item.wastage_percentage)}</td>
                                        <td className="alignright">{item.wastage_weight}</td>
                                        <td className="alignright">{(item.item_mc_value)}</td>
                                        
                                    </tr>
                                </React.Fragment>
                            ))}

                            <tr>
                                <td colSpan="5"><hr className="doted_hr" /></td>
                            </tr>

                            
                        </tbody>
                    </table>

                    <table>
                            {parseFloat(estimateData.total_nwt) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignleft" colSpan="4">Weight</td>
                                    <td className="alignright">{estimateData.total_nwt}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_vawt) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignleft" colSpan="4">Wastage (+)</td>
                                    <td className="alignright">{estimateData.total_vawt}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_wt) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignleft" colSpan="4">Total Weight</td>
                                    <td className="alignright">{estimateData.total_wt}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_rate) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignleft" colSpan="4">Total Rate </td>
                                    <td className="alignright">{formatCurrencyInINR(estimateData.total_rate)}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_stone_amt) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignleft" colSpan="4">Total Stone Amt</td>
                                    <td className="alignright">{formatCurrencyInINR(estimateData.total_stone_amt)}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_other_amt) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignleft" colSpan="4">Total Other Metal Amt X {estimateData.tax_per}</td>
                                    <td className="alignright">{formatCurrencyInINR(estimateData.total_other_amt)}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_charges_amt) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignleft" colSpan="4">Total Charges Amt X {estimateData.tax_per}</td>
                                    <td className="alignright">{formatCurrencyInINR(estimateData.total_charges_amt)}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_item_mc_value) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignleft" colSpan="4">Total MC Amt</td>
                                    <td className="alignright">{formatCurrencyInINR(estimateData.total_item_mc_value)}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.mrp_item_cost) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignleft" colSpan="4">MRP Item</td>
                                    <td className="alignright">{formatCurrencyInINR(estimateData.mrp_item_cost)}</td>
                                </tr>
                            )}

                            <tr style={{ fontWeight: "bold" }}>
                                <td className="alignleft" colSpan="4">Total Amt</td>
                                <td className="alignright">{formatCurrencyInINR(estimateData.sales_amount)}</td>
                            </tr>

                            <tr>
                                <td colSpan="5"><hr className="doted_hr" /></td>
                            </tr>
                    </table>
                  
                </div>

            )}

            {estimateData.purchase_details.length > 0 && (

                <div className="purchaseDetails" style={{marginTop: "10px"}}>
                    <table className="purchase" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th className="aligncenter" colSpan="5">
                                    <span style={{fontWeight:"bold",fontSize:"14px"}}  >PURCHASE</span>
                                </th>
                            </tr>
                            <tr>
                                <th colSpan="5"> <hr className="doted_hr" /></th>
                            </tr>
                            <tr style={{ textAlign: "left" }}>
                                <th className="alignleft" style={{ width: "8%" }}>DESC</th>
                                <th className="alignright">GWT</th>
                                <th className="alignright">LWT</th>
                                <th className="alignright">NWT</th>
                                <th className="alignright">AMT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="5"> <hr className="doted_hr" /></td>
                            </tr>

                            {estimateData.purchase_details.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="alignleft" colSpan="5">{item.product_name}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: "3%" }} colSpan="1"></td>
                                        <td className="alignright">{item.gross_wt}</td>
                                        <td className="alignright">{item.less_wt}</td>
                                        <td className="alignright">{item.net_wt}</td>
                                        <td className="alignright">{formatCurrencyInINR(item.amount)}</td>
                                    </tr>
                                </React.Fragment>
                            ))}

                            <tr>
                                <td colSpan="5"> <hr className="doted_hr" /></td>
                            </tr>

                            <tr style={{ fontWeight: "bold" }}>
                                <td className="alignleft" colSpan="1">TOTAL</td>
                                <td className="alignright">{estimateData.total_pur_gwt}</td>
                                <td></td>
                                <td className="alignright">{estimateData.total_pur_nwt}</td>
                                <td className="alignright">{formatCurrencyInINR(estimateData.purchase_amount)}</td>
                            </tr>

                            <tr>
                                <td colSpan="5"> <hr className="doted_hr" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            )}

            {estimateData.return_details.length > 0 && (
                <div className="salesReturnDetails">

                    <table className="sales_return_details" style={{ width: "100%" }}>
                        <thead>
                             <tr>
                                <th colSpan="4"><span style={{ fontWeight: "bold", fontSize: "14px" }}  >RETURN</span></th>
                            </tr>
                            <tr>
                                <th colSpan="4"> <hr className="doted_hr" /></th>
                            </tr>
                            <tr style={{ textAlign: "left" }}>
                                <th className="alignleft" >DESC</th>
                                <th className="alignright" >GWT</th>
                                <th className="alignright" >NWT</th>
                                <th className="alignright" >AMT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="4"><hr className="doted_hr" /></td>
                            </tr>
                            {estimateData.return_details.map((item, index) => (
                                
                                <tr>
                                    <td className="alignleft" >{item.product_name}</td>
                                    <td className="alignright">{item.gross_wt}</td>
                                    <td className="alignright">{item.net_wt}</td>
                                    <td className="alignright">{item.item_cost}</td>
                                </tr>
                                
                            ))}
                            <tr>
                                <td colSpan="5"> <hr className="doted_hr" /></td>
                            </tr>
                            <tr>
                                    <td className="alignleft" colSpan="3" >TOTAL</td>

                                    <td className="alignright">{formatCurrencyInINR(estimateData.return_amount)}</td>
                                </tr>
                            <tr>
                                <td colSpan="5"> <hr className="doted_hr" /></td>
                            </tr>

                        </tbody>
                    </table>

                </div>
            )}

                        {estimateData?.gold_22ct_plus_tax > 0 && (
                            
                            <table className="sales_details" style={{width: "100%"}}> 
                                <thead>
            
                                    <tr>
                                        <th className="alignleft"></th>
                                        <th className="alignright"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>RATE : {estimateData.gold_22ct}</td>
                                    </tr>
                                    <tr>
                                        <td>GST {estimateData.rate_tax_percentage} % + {estimateData.rate_tax_value}</td>
                                    </tr>
                                    <tr>
                                        <td>TOTAL RATE : {estimateData.gold_22ct_plus_tax}</td>
                                    </tr>
                                   
                                </tbody>
                            </table>
                        )}


            <table className="summary">
                <tbody>
                    {estimateData.sales_amount > 0 && (
                        <tr>
                            <td className="alignleft">SALES</td>
                            <td className="alignright">{formatCurrencyInINR(estimateData.sales_amount)}</td>
                        </tr>
                    )}

                    {estimateData.purchase_amount > 0 && (
                        <tr>
                            <td className="alignleft">PURCHASE</td>
                            <td className="alignright">{formatCurrencyInINR(estimateData.purchase_amount)}</td>
                        </tr>
                    )}
                    {estimateData.return_amount > 0 && (
                        <tr>
                            <td className="alignleft">RETURN</td>
                            <td className="alignright">{formatCurrencyInINR(estimateData.return_amount)}</td>
                        </tr>
                    )}

                    {parseFloat(estimateData.round_off) != 0 && (
                        <tr>
                            <td className="alignleft">ROUND OFF</td>
                            <td className="alignright">{formatCurrencyInINR(estimateData.round_off)}</td>
                        </tr>
                    )}

                    {/* {parseFloat(estimateData.total_discount_amount)> 0 && (
                        <tr>
                            <td className="alignleft">DISCOUNT</td>
                            <td className="alignright">{formatCurrencyInINR(estimateData.total_discount_amount)}</td>
                        </tr>
                    )} */}

                    <tr>
                        <td colSpan="2"> <hr className="doted_hr" /></td>
                    </tr>

                    <tr style={{ fontWeight: "bold" }}>
                        <td className="alignleft">GRAND TOTAL</td>
                        <td className="alignright">{formatCurrencyInINR(estimateData.net_amount)}</td>
                    </tr>

                    <tr>
                        <td colSpan="2"> <hr className="doted_hr" /></td>
                    </tr>
                </tbody>
            </table>

            <h6 style={{ fontWeight: "bold", textAlign: "center",color:"black",fontFamily:"Times New Roman" }}>
                TOTAL: {formatCurrencyInINR(estimateData.net_amount)}
            </h6>

            {estimateData.sales_stone.length > 0  && (
                                        <>
                                            <br />
                                            <div>STONE DETAILS</div>
                                           
                                            <table className="sales_details" style={{ width: "100%" }}>
                                                <thead>
                                                    <tr style={{ textAlign: "left" }}>
                                                        <th className="alignleft" style={{ width: "8%" }}>DESC</th>
                                                        <th className="alignright" style={{ width: "20%" }}>WT</th>
                                                        <th className="alignright" style={{ width: "20%" }}>AMT</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="3"> <hr className="doted_hr" /></td>
                                                    </tr>
                                                    {estimateData.sales_stone.map((item, index) => (
                                                        <React.Fragment key={index}>
                                                            <tr>
                                                                <td className="alignleft">{(item.stone_name)}</td>
                                                                <td className="alignright">{(item.stone_wt)}</td>
                                                                <td className="alignright">{(item.stone_amount)}</td>
                                                            </tr>
                                                        </React.Fragment>
                                                    ))}
                                                   
                                                </tbody>
                                            </table>
                                        </>
                        )}

            {/* {estimateData.partly_sales_details.length > 0  && (
                <>
                    <div className="pagebreak"></div>
                    <br />
                    <div>PARTLY SALE BALANCE DETAILS</div>
                    <br />
                    <table className="sales_details" style={{ width: "100%" }}>
                        <thead>
                            <tr style={{ textAlign: "left" }}>
                                <th className="alignleft" style={{ width: "8%" }}>DESC</th>
                                <th className="alignright" style={{ width: "20%" }}>GWT</th>
                                <th className="alignright" style={{ width: "20%" }}>SWT</th>
                                <th className="alignright" style={{ width: "20%" }}>BLC WT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="6"> <hr className="doted_hr" /></td>
                            </tr>
                            {estimateData.partly_sales_details.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="alignleft" colSpan="6">
                                            {item.product_name}
                                            {(item.tag_code) && ` - (${item.tag_code})`}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td className="alignright">{(item.tag_gwt)}</td>
                                        <td className="alignright">{(item.sold_gwt)}</td>
                                        <td className="alignright">{(item.balance_gross_wt)}</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                           
                        </tbody>
                    </table>
                </>
            )} */}


        </div>

    );
};

export default EstPrintTemplateTwo;
