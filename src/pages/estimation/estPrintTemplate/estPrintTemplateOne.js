import React, { useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { formatCurrencyInINR,formatProductDesign } from "../../../components/common/moneyFormat/moneyFormat";

const EstPrintTemplateOne = ({ estimateData }) => {
    console.log(estimateData, "estimateData");
    return (
        <div className="body">

            <title>Estimate : </title>
            <style>
                {
                    `@page {
                    size: 80mm 279mm;
                    margin: 2mm;
                    margin-top: -14mm;
                    /* Set the size for the page */
                }
                .estmateNo{
                    text-align: left;
                    font-weight: bold;
                    color :black;
                    font-family: "Times New Roman", Times, serif !important;
                }
                
                // .body{
                //     text-transform: uppercase;
                //     font-size: 13px;
                //     font-family:  "Times New Roman", Times, serif !important;
                //     margin-top: 0;
                //     padding: 0;
                //     color:black;
                //     line-height: 1.8;
                // }
                // @media print {
                //         .pagebreak { page-break-after: always; } /* page-break-after works, as well */
                //     }


                 .body{
                    width: 297px; /* Match paper width (like 80mm = ~280px) */
                    text-transform: uppercase;
                    line-height: 1.2;
                    font-size: 11pt;
                    font-weight: bold;
                    font-family: 'Courier New', Courier, monospace !important;
                    margin: 0;
                    padding: 0;
                    color:black;
                    background-color : #ffffff;
                    -webkit-print-color-adjust: exact !important; /* Chrome, Safari */
                    /*print-color-adjust: exact !important; /* Non-WebKit browsers */
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
                        font-size: 11pt;
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
                .tag_code{
                    font-size: 10pt;
                }
                .doted_hr_buttom {
                    border-top: 1px dashed black;
                    color:black;
                    opacity: 1 !important;
                    margin :8px 0;
                    margin-top :4px !important;
                    margin-buttom : 3px!important;
                    
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
                .summary{
                    line-height: 1.5;
                }
                `
                }
            </style>

            <div className="header">
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }} >
                <h4 className="estmateNo">EST NO : {estimateData.est_no}</h4>
                <div style={{textAlign:"right"}}>
                    <QRCodeCanvas value={estimateData.est_no} size={60} />
                </div>
                </div>

                <br />
                {/* <div className="info">
                    <span>ROUGH ESTIMATE</span>
                    <span>EST NO : {estimateData.est_no}</span>
                </div> */}
                {/* <div style={{ textTransform: "uppercase" }}>
                    {estimateData.customer_name} / {estimateData.customer_mobile}
                </div> */}
                <div className="info">
                    <span>{estimateData.date} {estimateData.time}</span>
                    <span>{estimateData.metal == 1 ? "Gold": "Silv"}:{(estimateData.total_rate_per_gram)}</span>
                </div>

                <hr className="doted_hr" />
            </div>
            {estimateData.sales_details.length > 0 && (
                <div className="salesDetails">
                        <table className="sales_details" style={{ width: "100%" }}>
                            <thead>
                                <tr style={{ textAlign: "left" }}>
                                    <th className="alignleft" style={{ width: "1%" }}>No</th>
                                    <th className="alignleft" style={{ width: "35%" }}>Tagno</th>
                                    <th className="alignleft" style={{ width: "35%" }}>Description</th>
                                    <th className="alignright" style={{ width: "5%" }}>Pcs</th>
                                    <th className="alignright" style={{ width: "24%" }}>Nwt</th>
                                </tr>
                            </thead>
                         </table>

                    <table className="sales_details" style={{ width: "100%" }}>                       
                        <tbody>
                            <tr>
                                <td colSpan="5"><hr className="doted_hr" /></td>
                            </tr>
                            {estimateData.sales_details.map((item, index) => (
                                <tr>
                                    <td style={{ width: "1%" }} className="alignleft" >{item.sno}</td>
                                    <td style={{ width: "38%" }} className="alignright tag_code" >{item.tag_code != null && item.tag_code}&nbsp;</td>
                                    <td style={{ width: "33%" }} className="alignleft">{formatProductDesign(item.product_name,item.design_name)}</td>
                                    <td style={{ width: "5%" }} className="alignleft">{item.pieces}</td>
                                    <td style={{ width: "24%" }} className="alignright">{item.weight_show_in_print == 0 ?  item.wt_code : item.net_wt}</td>
                                </tr>
                            ))}



                            {/* {parseFloat(estimateData.total_wt) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignleft" colSpan="4">Total Weight</td>
                                    <td className="alignright">{estimateData.total_wt}</td>
                                </tr>
                            )}

                            <tr>
                                <td colSpan="5"><hr className="doted_hr" /></td>
                            </tr> */}

                        </tbody>
                    </table>

                    <table>
                        <tbody>

                            {estimateData?.sales_details?.length > 0 && (
                                    <tr>
                                       
                                        <td colSpan={5} ><hr className="doted_hr_buttom" /></td>
                                    </tr>
                            )}

                            
                            {parseFloat(estimateData.total_nwt) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td></td>
                                    <td className="alignright" colSpan="3">Wt:</td>
                                    <td className="alignright">{estimateData.total_nwt}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_vawt) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td></td>
                                    <td className="alignright" colSpan="3">VA (+):</td>
                                    <td className="alignright">{estimateData.total_vawt}</td>
                                </tr>
                            )}

                                { (parseFloat(estimateData.total_nwt) > 0 && estimateData.rate_grouped.length > 0) && (
                                    <tr>
                                        <td  className="breack4"  colSpan={4}></td>
                                        <td ><hr className="doted_hr_buttom" /></td>
                                    </tr>
                                
                                )}
                            {estimateData.rate_grouped.map((item, index) => {
                               if (parseFloat(item.rate_per_gram) > 0){
                                    return (<tr style={{ fontWeight: "bold" }}>
                                        <td style={{ fontWeight: "bold", width: "50%" }}></td>
                                        <td className="alignright" style={{ fontWeight: "bold", width: "35%" }} colSpan={2}>
                                            {item.rate_per_gram}
                                        </td>
                                        <td className="alignright" style={{ fontWeight: "bold", width: "15%" }} colSpan={2}>
                                            * {item.wt}
                                        </td>
                                        {/* <td className="alignright"></td> */}
                                    </tr>)
                                } })}
                                {(parseFloat(estimateData.total_nwt) > 0 && estimateData.rate_grouped.length > 0) && (
                                    <tr>
                                        <td className="breack3"  colSpan={4}></td>
                                        <td ><hr className="doted_hr_buttom" /></td>
                                    </tr>
                                
                                )}

                            { (parseFloat(estimateData.total_nwt) == 0 && estimateData?.sales_details?.length == 1  )&& ( 

                                    <>
                                    <tr>
                                    <td  className="breack" colSpan={5}>
                                        <br/>
                                        <br/>
                                         <br/>
                                         <br/>
                                         <br/>

                                    </td>
                                    </tr>
                                    </>

                            )}
                            
                            { (parseFloat(estimateData.total_nwt) == 0 && estimateData?.sales_details?.length == 2  )&& ( 

                                    <>
                                    <tr>
                                    <td  className="breack" colSpan={5}>
                                       
                                        <br/>
                                         <br/>
                                         <br/>
                                         <br/>

                                    </td>
                                    </tr>
                                    </>

                            )}

                             { (parseFloat(estimateData.total_nwt) == 0 && estimateData?.sales_details?.length == 3  )&& ( 

                                    <>
                                    <tr>
                                    <td  className="breack" colSpan={5}>
                                       
                                         <br/>
                                         <br/>
                                         <br/>

                                    </td>
                                    </tr>
                                    </>

                            )}

                            {parseFloat(estimateData.total_amt_wt) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td colSpan="2" ></td>
                                    <td className="alignright" colSpan="2" >Value :</td>
                                    <td className="alignright">{parseInt(estimateData.total_amt_wt)}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_stone_amt) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td colSpan="2" ></td>
                                    <td className="alignright" colSpan="2">Stone Amt :</td>
                                    <td className="alignright">{parseInt(estimateData.total_stone_amt)}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_other_amt) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td colSpan="2" ></td>
                                    <td className="alignright" colSpan="2">Other Metal Amt :</td>
                                    <td className="alignright">{parseInt(estimateData.total_other_amt)}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_charges_amt) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td></td>
                                    <td className="alignright" colSpan="2">Charges Amt :</td>
                                    <td className="alignright">{parseInt(estimateData.total_charges_amt)}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_mc_value) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td colSpan="2" ></td>
                                    <td className="alignright" colSpan="2">MC :</td>
                                    <td className="alignright">{parseInt(estimateData.total_mc_value)}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.mrp_item_cost) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td colSpan="2" ></td>
                                    <td className="alignright" colSpan="2">MRP Item :</td>
                                    <td className="alignright">{parseInt(estimateData.mrp_item_cost)}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_tax_discount) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td colSpan="2" ></td>
                                    <td className="alignright" colSpan="2" >Discount :</td>
                                    <td className="alignright">{parseInt(estimateData.total_tax_discount)}</td>
                                </tr>
                            )}

                            {parseFloat(estimateData.total_tax_amount) > 0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td colSpan="2" ></td>
                                    <td className="alignright" colSpan="2">Gst :</td>
                                    <td className="alignright">{parseInt(estimateData.total_tax_amount)}</td>
                                </tr>
                            )}

                            <tr>
                                        <td colSpan={4}></td>
                                        <td ><hr className="doted_hr_buttom" /></td>
                            </tr>

                            <tr style={{ fontWeight: "bold" }}>
                                <td></td>
                                <td className="alignright" colSpan="3">Total :</td>
                                <td className="alignright">{Math.round(estimateData.total_amount)}</td>
                            </tr>

                                    <tr>
                                        <td colSpan={4}></td>
                                        <td ><hr className="doted_hr_buttom" /></td>
                                    </tr>
                        </tbody>
                    </table>

                </div>

            )}

            {estimateData.purchase_details.length > 0 && (

                <div className="purchaseDetails" style={{ marginTop: "10px" }}>
                    <table className="purchase" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th className="aligncenter" colSpan="4">
                                    <span style={{ fontWeight: "bold", fontSize: "14px" }}  >PURCHASE</span>
                                </th>
                            </tr>
                            <tr>
                                <th colSpan="4"> <hr className="doted_hr" /></th>
                            </tr>
                            <tr style={{ textAlign: "left" }}>
                                <th className="alignleft" style={{ width: "8%" }}>DESC</th>
                                <th className="alignright">GWT</th>
                                <th className="alignright">DUST.WT</th>
                                <th className="alignright">NWT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="4"> <hr className="doted_hr" /></td>
                            </tr>

                            {estimateData.purchase_details.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="alignleft" colSpan="1">{item.product_name}</td>
                                        <td className="alignright">{item.gross_wt}</td>
                                        <td className="alignright">{item.dust_wt}</td>
                                        <td className="alignright">{item.net_wt}</td>
                                        {/* <td className="alignright">{formatCurrencyInINR(item.amount)}</td> */}
                                    </tr>
                                </React.Fragment>
                            ))}

                            <tr>
                                <td colSpan="4"> <hr className="doted_hr" /></td>
                            </tr>

                        </tbody>
                    </table>

                    <table>
                        <tbody>
                            {estimateData.pur_rate_grouped.map((item, index) => (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignright" style={{ fontWeight: "bold", width: "85%" }} colSpan={2}>
                                        {item.rate_per_gram}
                                    </td>
                                    <td className="alignright" style={{ fontWeight: "bold", width: "15%" }} colSpan={2}>
                                        * {item.wt}
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="4"> <hr className="doted_hr" /></td>
                            </tr>
                            <tr style={{ fontWeight: "bold" }}>
                                <td className="alignleft" colSpan="3">TOTAL</td>

                                {<td className="alignright">{formatCurrencyInINR(estimateData.purchase_amount)}</td>}
                            </tr>

                            <tr>
                                <td colSpan="4"> <hr className="doted_hr" /></td>
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
                                <th colSpan="4" style={{textAlign:"center"}}><span style={{ fontWeight: "bold" ,fontSize: "14px" }}  >SALES RETURN</span></th>
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
                                <td colSpan="4"><hr className="doted_hr" /></td>
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


            { (estimateData.sales_details.length > 0 && (estimateData.purchase_details.length > 0 || estimateData.return_details.length > 0) )&& (
                    <>
                                <table >
                                    <tbody>
                                        {estimateData.sales_details.length > 0 && (
                                            <tr>
                                                <td className="alignleft" ></td>
                                                <td className="alignright">SALES</td>
                                                <td className="alignright" style={{width:"30%"}} >{Math.round(estimateData.total_amount)}</td>
                                            </tr>
                                        )}

                                        {estimateData.purchase_details.length > 0 && (
                                            <tr>
                                                <td className="alignleft"  ></td>
                                                <td className="alignright">PURCHASE</td>
                                                <td className="alignright" style={{width:"30%"}} >-{Math.round(estimateData.purchase_amount)}</td>
                                            </tr>
                                        )}

                                        {estimateData.return_details.length > 0 && (
                                            <tr>
                                                <td className="alignleft" ></td>
                                                <td className="alignright">RETURN</td>
                                                <td className="alignright" style={{width:"30%"}} >-{Math.round(estimateData.return_amount)}</td>
                                            </tr>
                                        )}

                                        {/* {parseFloat(estimateData.round_off) != 0 && (
                                            <tr>
                                                <td className="alignleft">ROUND OFF</td>
                                                <td className="alignright">{formatCurrencyInINR(estimateData.round_off)}</td>
                                            </tr>
                                        )} */}

                                        {/* {parseFloat(estimateData.total_discount_amount) > 0 && (
                                            <tr>
                                                <td className="alignleft">DISCOUNT</td>
                                                <td className="alignright">{formatCurrencyInINR(estimateData.total_discount_amount)}</td>
                                            </tr>
                                        )} */}

                                        <tr>
                                            <td colSpan="3"> <hr className="doted_hr" /></td>
                                        </tr>

                                        <tr style={{ fontWeight: "bold" }}>
                                            <td className="alignleft"  ></td>
                                            <td className="alignright">GRAND TOTAL</td>
                                            <td className="alignright" style={{width:"30%"}} >{Math.round(estimateData.net_amount)}</td>
                                        </tr>

                                        <tr>
                                            <td colSpan="3"> <hr className="doted_hr" /></td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h4 style={{ fontWeight: "bold", textAlign: "center", color: "black", fontFamily: "Times New Roman" }}>
                                    TOTAL: &nbsp;{(estimateData.net_amount)}
                                </h4>

                    </>
            )}



            {estimateData?.sales_stone?.length > 0  && (
                            <>
                                <div>
                                        <hr className="doted_hr" />
                                </div>
                                <div>STONE DETAILS</div>
                                
                                <table className="sales_details" style={{ width: "100%" }}>
                                    {/* <thead>
                                        <tr style={{ textAlign: "left" }}>
                                            <th className="alignleft" style={{ width: "8%" }}>DESC</th>
                                            <th className="alignright" style={{ width: "20%" }}>WT</th>
                                            <th className="alignright" style={{ width: "20%" }}>AMT</th>
                                        </tr>
                                    </thead> */}
                                    <tbody>
                                        {estimateData.sales_stone.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <tr>
                                                    <td style={{textAlign:"left"}}>{item.stone_name}   </td>
                                                    <td style={{textAlign:"Right"}}>{item.stone_calc_type == 2 ? `${item.stone_pcs} Pcs * ${item.stone_rate}`: `${item.stone_wt} * ${item.stone_rate}`} =</td>
                                                    <td style={{textAlign:"Right"}}>  {(item.stone_amount)}</td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                        
                                    </tbody>
                                </table>
                                <br/>
                            </>
            )}



            { (estimateData.purchase_details.length == 1 && (estimateData.sales_details.length == 0 && estimateData.return_details.length == 0) )&& ( 

                <>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                </>
            )}

            { (estimateData.return_details.length == 1 && (estimateData.sales_details.length == 0 && estimateData.purchase_details.length == 0) )&& ( 

                <>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                </>
            )}

            <table  style={{width:"100%"}} className="summary">

                <tr>
                    <td colSpan={4} ><hr className="doted_hr_buttom" /></td>
                </tr>
                
                <tr   style={{ textAlign:"left",textTransform: 'uppercase' }} >
                    <td style={{width:"30%"}}>
                        Emp Name
                    </td>
                    <td style={{width:"70%" }} >    
                    <div style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis"
                        }}>
                        : {estimateData.emp_name}
                        </div></td>

                </tr>
                <br/>
                {/* <tr>
                    <td></td>
                </tr> */}

                <tr style={{ textAlign:"left",textTransform: 'uppercase' }} >
                    <td  >
                        Cust.Name
                    </td>
                    <td> : {estimateData.customer_name}</td>
                </tr>

                <tr style={{ textAlign:"left",textTransform: 'uppercase' }} >
                    <td >
                        Cust.Mobile 
                    </td>
                    <td>  : {estimateData.customer_mobile}</td>
                </tr>

                <br></br>
            </table>



            {estimateData.partly_sales_details.length > 0 && (
                <>
                    <div className="pagebreak"></div>
                    <br />
                    <div>PARTLY SALE BALANCE DETAILS</div>
                    <br />
                    <table className="sales_details" style={{ width: "100%" }}>
                        <thead>
                            <tr style={{ textAlign: "left" }}>
                                <th className="alignleft" style={{ width: "8%" }}>DESC</th>
                                <th className="alignright" style={{ width: "20%" }}>.GWT</th>
                                <th className="alignright" style={{ width: "20%" }}>NWT</th>
                                <th className="alignright" style={{ width: "15%" }}>LWT</th>
                                <th className="alignright" style={{ width: "17%" }}>DIA</th>
                                <th className="alignright" style={{ width: "20%" }}>STN</th>
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
                                        <td className="alignright">{(item.balance_gross_wt)}</td>
                                        <td className="alignright">{(item.balance_net_wt)}</td>
                                        <td className="alignright">{(item.balance_less_wt)}</td>
                                        <td className="alignright">{(item.balance_dia_wt)}</td>
                                        <td className="alignright">{(item.balance_stn_wt)}</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                            <tr>
                                <td colSpan="6"> <hr className="doted_hr" /></td>
                            </tr>
                            <tr style={{ fontWeight: "bold" }}>
                                <td className="alignleft">TOTAL</td>
                                <td className="alignright">{estimateData.partly_sold_grosswt}</td>
                                <td className="alignright">{estimateData.partly_sold_netwt}</td>
                                <td className="alignright">{estimateData.partly_sold_leswt}</td>
                                <td className="alignright">{estimateData.partly_sold_diawt}</td>
                                <td className="alignright">{estimateData.partly_sold_stnwt}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}
            <div style={{ textAlign : "center" }}>
            <span style={{fontSize: "10pt"}}>(*This Estimate will be valid until any rate change) </span>
            </div>

        </div>

    );
};

export default EstPrintTemplateOne;
