import React, { useEffect, useRef } from "react";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { QRCodeCanvas } from "qrcode.react";

const EstPrintTemplateTwoSilver = ({estimateData}) => {
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
                    font-family: "TVC", "EPSON Font", "Free 3 of 9", monospace !important;
                    // font-family: "EPSON Font", Free 3 of 9, monospace !important;
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

            <div className="header">
                
             <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <h4 className="estmateNo" style={{ margin: 0 }}>
                    ESTIMATE NO {estimateData.est_no}
                </h4>
                
                <QRCodeCanvas value={estimateData.est_no} size={35} />
            </div><br></br>

                

                {/* <div className="info">
                    <span>GOLD 22K: {estimateData.metal_rates.gold_22ct}</span>
                    <span>GOLD 18K: {estimateData.metal_rates.gold_18ct}</span>
                </div> */}
               
                <div className="info">
                    <div  style={{ textTransform: "uppercase" }}>
                        <span>{estimateData.customer_name}</span> <br></br>
                        <span>{estimateData.customer_mobile}</span><br></br>
                        <span>{estimateData?.address}</span><br></br>
                        <span>{estimateData?.city} {(estimateData?.pin_code!='' ?  estimateData?.pin_code:'')}</span>
                    </div>

                    <div className="" style={{ width: "46%" }}>
                        <span>RATE: { formatCurrencyInINR(estimateData.metal_rates.silver_G)}</span><br></br>
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
                                <th className="alignright" style={{ width: "1%" }}>NWT</th>
                                <th className="alignright" style={{ width: "30%" }}>V.A</th>
                                <th className="alignright" style={{ width: "30%" }}>MC</th>
                                
                                <th className="alignright" style={{ width: "40%" }}>AMT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="6"><hr className="doted_hr" /></td>
                            </tr>
                            {estimateData.sales_details.map((item, index) => (
                                <React.Fragment key={index}>
                                    {parseFloat(item.sell_rate) == 0 && (
                                        <tr>
                                            <td className="alignleft" colSpan="5">
                                                {item.product_name}
                                                {
                                                    (item.old_tag_code!=null && item.old_tag_code!='') ?
                                                    (' ' + item.old_tag_code) : (item.tag_code!=null && item.tag_code!='') ?
                                                    (' ' + item.tag_code) : ''
                                                }
                                                {/* {item.tag_code != null && <> - ( {item.tag_code} )</>} */}
                                            </td>
                                        </tr>
                                    )}
                                    {parseFloat(item.sell_rate) > 0 && (
                                            <tr>
                                                <td className="alignleft" colSpan="4">
                                                    {item.product_name}
                                                    {
                                                        (item.old_tag_code!=null && item.old_tag_code!='') ?
                                                        (' ' + item.old_tag_code) : (item.tag_code!=null && item.tag_code!='') ?
                                                        (' ' + item.tag_code) : ''
                                                    }
                                                    {/* {item.tag_code != null && <> - ( {item.tag_code} )</>} */}
                                                   
                                                </td>
                                                <td className="alignright">{item.sell_rate > 0 && <> {formatCurrencyInINR(item.taxable_amount)}</>}
                                                </td>
                                            </tr>
                                    )}
                                    
                                    {parseInt(item?.weight_show_in_print)==1 && (
                                            <tr>
                                                <td></td>
                                                <td className="alignright">{item.net_wt}</td>
                                                <td className="alignright">{item.wastage_weight!=0 ? item.wastage_weight :''}</td>
                                                <td className="alignright">{(item.total_mc_value)}</td>
                                                
                                                <td className="alignright">{item.taxable_amount}</td>
                                            </tr>
                                    )}
                                    
                                </React.Fragment>
                            ))}

                            <tr>
                                <td colSpan="5"><hr className="doted_hr" /></td>
                            </tr>
                           
                        </tbody>
                    </table>

                    <table>
                    <tr style={{ fontWeight: "bold" }}>
                                <td ></td>
                                <td class="alignright">{estimateData.total_nwt}</td>
                                <td class="alignright">{estimateData.total_vawt}</td>
                                <td class="alignright">{estimateData.total_mc_value}</td>
                                <td className="alignright">{(estimateData.total_taxable)}</td>
                            </tr>

                            { parseFloat(estimateData.cgst_cost) > 0 && (
                                <tr>
                                    <td class="alignleft" colspan="4">CGST { estimateData.cgst_per } %</td>
                                    <td class="alignright" >{estimateData.cgst_cost}</td>
                                </tr>
                            )}

                            { parseFloat(estimateData.sgst_cost) > 0 && (

                            <tr>
                                <td class="alignleft" colspan="4">CGST { estimateData.sgst_per } %</td>
                                <td class="alignright" >{estimateData.sgst_cost}</td>
                            </tr>

                            )}

                            { parseFloat(estimateData.igst_cost) > 0 && (

                            <tr>
                                <td class="alignleft" colspan="4">CGST { estimateData.igst_per } %</td>
                                <td class="alignright" >{estimateData.igst_cost}</td>
                            </tr>

                            )}

                            <tr>
                                <td colSpan="5"><hr className="doted_hr" /></td>
                            </tr>
                            
                            <tr>
                                <td class="alignleft" style={{ fontWeight:"bold"}} >TOTAL</td>
                                <td ></td>
                                <td ></td>
                                <td ></td>
                                <td class="alignright">{formatCurrencyInINR(estimateData.sales_amount)}</td>
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
                                <th colSpan="4"> <hr className="doted_hr" /></th>
                            </tr>
                            <tr style={{ textAlign: "left" }}>
                                <th className="alignleft" style={{ width: "8%" }}>GWT</th>
                                <th className="alignright">LWT</th>
                                <th className="alignright">NWT</th>
                                <th className="alignright">AMT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="4"> <hr className="doted_hr" /></td>
                            </tr>

                            {estimateData.purchase_details.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="alignleft" colSpan="4">
                                            <span style={{fontSize : "16px"}}> {item.old_metal_type_name}  - {item?.old_metal_type_code}  @ Rate :  {parseFloat(parseFloat(item?.rate_per_gram)).toFixed(2)} </span> </td>
                                    </tr>
                                    <tr>
                                        <td className="alignright">{item.gross_wt}</td>
                                        <td className="alignright">{item.custom_less_weight}</td>
                                        <td className="alignright">{item.pure_weight}</td>
                                        <td className="alignright">{formatCurrencyInINR(item.amount)}</td>
                                    </tr>
                                </React.Fragment>
                            ))}

                            <tr>
                                <td colSpan="4"> <hr className="doted_hr" /></td>
                            </tr>

                            <tr style={{ fontWeight: "bold" }}>
                                <td className="alignright">{estimateData.total_pur_gwt}</td>
                                <td></td>
                                <td className="alignright">{estimateData.total_pur_pure_wt}</td>
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



            <table className="summary">
                <tbody>
                    {estimateData.sales_details && (
                        <tr>
                            <td className="alignleft">SALES</td>
                            <td className="alignright">{formatCurrencyInINR(estimateData.sales_amount)}</td>
                        </tr>
                    )}

                    {parseFloat(estimateData.purchase_amount)!=0 && (
                        <tr>
                            <td className="alignleft">PURCHASE</td>
                            <td className="alignright">{formatCurrencyInINR(estimateData.purchase_amount)}</td>
                        </tr>
                    )}
                    {parseFloat(estimateData.return_amount)!=0 && (
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

export default EstPrintTemplateTwoSilver;
