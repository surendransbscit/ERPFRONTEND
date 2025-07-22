import React, { useEffect, useRef } from "react";
import { formatCurrencyInINRWithOutDecmal,formatCurrencyInINR,formatProductDesign } from "../../../components/common/moneyFormat/moneyFormat";
import { QRCodeCanvas } from "qrcode.react";

const BillingPrintTemplateOne = ({invoiceData}) => {

    return (
        <div className="body">

            <title>Invoice</title>
            <style>
                {
                `
                @page {
                    size: 80mm 279mm;
                    margin: 2mm;
                    margin-top: -10mm;
                }
                .estmateNo{
                    text-align: center;
                    font-weight: bold;
                    color :black;
                    font-family: 'Courier New', Courier, monospace;
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
                // body{
                //     text-transform: uppercase;
                //     font-size: 12pt;
                //     font-family: 'Courier New', Courier, monospace;
                //     margin-top: 0;
                //     padding: 0;
                //     color :black;
                // }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 0;
                    padding: 0;
                    font-family: 'Courier New', Courier, monospace;
                }

                .qr-code img {
                    height: 60px;
                    background-color: aquamarine;
                    margin: 0;
                    padding: 0;
                }
                hr.dashed {
                    border: none;
                    border-top: 1px dashed #000; /* Dashed line */
                }

                .alignleft{
                    text-align: left;
                }
                .alignright{
                    text-align: right;
                }
                .qr-code img {
                    height: 1px;
                }
                // @media print {
                //     .pagebreak { page-break-after: always; } /* page-break-after works, as well */
                // }


                .body{
                    width: 297px; /* Match paper width (like 80mm = ~280px) */
                    text-transform: uppercase;
                    font-size: 11pt;
                    font-weight: bold;
                    font-family: 'Courier New', Courier, monospace;
                    margin-top: 0;
                    padding: 0;
                    color:black;
                    // min-height:1000px !important;
                    background-color : #ffffff;
                    -webkit-print-color-adjust: exact !important; /* Chrome, Safari */
                    /*print-color-adjust: exact !important; /* Non-WebKit browsers */
                }

                .footer{
                    line-height: 1.5;
                }
                .header{
                    font-size: 10pt;

                }
                .tag_code{
                    font-size: 10pt;
                }
                .inv{
                    font-size: 15pt !important;

                }

                 @media print {
                    .pagebreak 
                        { 
                            page-break-after: always;
                            break-before: always;
                        } /* page-break-after works, as well */
                    body {
                        //  min-height: 10000px !important;
                        -webkit-print-color-adjust: exact !important; /* Chrome, Safari */
                        color-adjust: exact !important; /* Non-WebKit browsers */
                        print-color-adjust: exact !important; /* Non-WebKit browsers */
                        color:#000000;
                        background-color : #ffffff;
                    }
                }

                
                `
                }
            </style>

            <div className="header">
                <h4 className="estmateNo">{invoiceData.company_name}</h4>
                <br />
                <div className="info">
                    <span> <span className="inv">INV: {invoiceData.invoice_data.invoice_no} <br/></span>
                    {invoiceData.date} {invoiceData.time}
                    {parseFloat(invoiceData.rate_per_gram) > 0 && (
                    <>
                    <br/>
                    Rate: {formatCurrencyInINRWithOutDecmal(invoiceData.rate_per_gram)}
                    </>
                   )}
                    </span>
                    <span>
                        <QRCodeCanvas value={invoiceData.invoice_data.invoice_no} size={60} />
                    </span>
                </div>
                {/* <div className="info">
                   

                </div>
                <div className="info">
                   
                </div> */}

                {/* <div className="info">
                   <span>Address : {invoiceData?.address}<br/>{invoiceData?.city} <br/>{invoiceData?.pin_code} </span>
                </div> */}


               
            </div>
            {invoiceData.sales_details.length > 0 && (
                <div className="salesDetails">
                    <h6 className="estmateNo"  >SALES DETAILS</h6>

                    {/* <table className="sales_details" style={{ width: "100%" }}>
                        <thead>
                        <tr style={{ textAlign: "left" }}>
                           <th colSpan={"3"}><hr className="doted_hr" /></th>
                        </tr>
                            <tr style={{ textAlign: "left" }}>
                                <th className="alignleft" style={{ width: "50%" }}>Description</th>
                                <th className="alignright" style={{ width: "15%" }}>Pcs</th>
                                <th className="alignright" style={{ width: "35%" }}>Nwt</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="3"><hr className="doted_hr" /></td>
                            </tr>
                            {invoiceData.sales_details.map((item, index) => (
                                <tr>
                                    <td style={{ width: "50%" }} className="alignleft">{formatProductDesign(item.product_name,item.design_name)}</td>
                                    <td style={{ width: "15%" }} className="alignright">{item.pieces}</td>
                                    <td style={{ width: "35%" }} className="alignright">{item.weight_show_in_print == 0 ?  item.wt_code : item.net_wt}</td>
                                </tr>
                            ))}

                            <tr>
                                <td colspan="3"><hr className="doted_hr" /></td>
                            </tr>

                           
                            <tr style={{ fontWeight: "bold" }}>
                                <td className="alignleft" >Total</td>
                                <td className="alignright">{invoiceData.total_pcs}</td>
                                <td className="alignright">{invoiceData.total_nwt}</td>

                            </tr>
                            

                            <tr>
                                <td colspan="3"><hr className="doted_hr" /></td>
                            </tr>



                        </tbody>
                    </table> */}

                    {/* { invoiceData.purchase_amount ==0 && invoiceData.return_amount == 0 && (
                        <h6 className="estmateNo" style={{fontWeight: "bold",textAlign: "center"}}>FINAL AMOUNT:  { formatCurrencyInINRWithOutDecmal(invoiceData.net_amount)}</h6>
                    )} */}

                        <table className="sales_details" style={{ width: "100%" }}>
                            <thead>
                                <tr style={{ textAlign: "left" }}>
                                    <th colSpan={"5"}><hr className="doted_hr" /></th>
                                </tr>
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
                                                {invoiceData.sales_details.map((item, index) => (
                                                    <tr>
                                                        <td style={{ width: "1%" }} className="alignleft" >{index+1}</td>
                                                        <td style={{ width: "38%" }} className="alignright tag_code" >{item.tag_code != null && item.tag_code}&nbsp;</td>
                                                        <td style={{ width: "33%" }} className="alignleft">{formatProductDesign(item.product_name,item.design_name)}</td>
                                                        <td style={{ width: "5%" }} className="alignleft">{item.pieces}</td>
                                                        <td style={{ width: "24%" }} className="alignright">{item.weight_show_in_print == 0 ?  item.wt_code : item.net_wt}</td>
                                                    </tr>
                                                ))}
                    
                                                <tr>
                                                    <td colspan="5"><hr className="doted_hr" /></td>
                                                </tr>

                                            
                                                <tr style={{ fontWeight: "bold" }}>
                                                    <td className="alignleft" colSpan={3} >Total</td>
                                                    <td className="alignright">{invoiceData.total_pcs}</td>
                                                    <td className="alignright">{invoiceData.total_nwt}</td>
                                                </tr>
                                                <tr>
                                                   <td colSpan={5} >

                                                    <br/>
                                                    <br/>

                                                   </td>
                                                   

                                                </tr>
                    

                    
                                            </tbody>
                                        </table>
                 
                </div>
            )}
            
            
            

                
                    <table className="purchase" style={{ width: "100%" }}>

                        <tbody>

                                { ( invoiceData.sales_details.length > 0) &&(
                                    <>
                                        <tr>
                                            <th  colSpan="4">Sales Entry :</th>
                                        </tr>
                                        <tr>
                                            <td colspan="3" ><hr className="doted_hr" /></td>
                                            <td ></td>

                                        </tr>
                                    </>
                                )}

                            { ( invoiceData.sales_details.length == 0) &&(
                                    <>
                                      <br/>
                                    </>
                                )}


                            {(invoiceData.purchase_details.length > 0 && invoiceData.return_details.length == 0 && invoiceData.sales_details.length == 0)&& (
                             <> 
                            <tr>
                                <td colspan="4">Purchase</td>
                            </tr>
                            <tr>
                                <td colspan="4"><hr className="doted_hr" /></td>
                            </tr>

                            </>  
                            )}

                            {(invoiceData.return_details.length > 0 && invoiceData.purchase_details.length == 0 && invoiceData.sales_details.length == 0)&& (
                             <> 
                            <tr>
                                <td colspan="4">Sales Return</td>
                            </tr>
                            <tr>
                                <td colspan="4"><hr className="doted_hr" /></td>
                            </tr>

                            </>  
                            )}

                            {(invoiceData.return_details.length > 0 && invoiceData.purchase_details.length > 0 && invoiceData.sales_details.length == 0)&& (
                             <> 
                            <tr>
                                <td colspan="4">Purchase / Sale Return</td>
                            </tr>
                            <tr>
                                <td colspan="4"><hr className="doted_hr" /></td>
                            </tr>

                            </>  
                            )}

                            {invoiceData.purchase_details.length > 0 && invoiceData.purchase_details.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                <td className="alignleft" style={{"width":"28%"}}>{item.product_name}</td>
                                <td className="alignright" style={{"width":"8%"}}>{item.pieces}</td>
                                <td className="alignright" style={{"width":"32%"}}>{item.gross_wt}</td>
                                <td className="alignright" style={{"width":"32%"}}>
                                    {formatCurrencyInINRWithOutDecmal((item.amount))}
                                </td>
                                </tr>
                            </React.Fragment>
                            ))}


                            {(invoiceData.purchase_details.length > 1 && invoiceData.return_details.length == 0 && invoiceData.sales_details.length == 0 )&& (
                                <>
                                <tr>
                                    <td colSpan="4"> <hr className="doted_hr" /></td>
                                </tr>

                                <tr>
                                    <td  className="alignleft" colSpan="3">TOTAL</td>
                                    <td className="alignright">{invoiceData.total_pur_gwt}</td>
                                    <td className="alignright">{formatCurrencyInINR(invoiceData.purchase_amount)}</td>
                                </tr>
                                </>
                            )}

                            {invoiceData.return_details.length > 0 && invoiceData.return_details.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                <td className="alignleft" style={{"width":"28%"}}>TIS:{item.product_name}</td>
                                <td className="alignright" style={{"width":"8%"}} >{item.pieces}</td>
                                 <td className="alignright" style={{"width":"32%"}}>{item.net_wt}</td>
                                <td className="alignright" style={{"width":"32%"}}>
                                    {formatCurrencyInINRWithOutDecmal((item.item_cost))}
                                </td>
                                </tr>
                            </React.Fragment>
                            ))}


                            {((invoiceData.return_details.length > 0 || invoiceData.purchase_details.length > 0) && invoiceData.sales_details.length == 0)&& (
                             <> 
                            <tr>
                                <td colspan="4"><hr className="doted_hr" /></td>
                            </tr>
                            <tr>
                                <td colspan="4">Payment Details :</td>
                            </tr>
                            </>  
                            )}



                        </tbody>
                    </table>

                <table className="purchase" style={{ width: "100%" }}>

                        <tbody>
                            { parseFloat(invoiceData.deposit_amount) >  0  && (
                                <tr>
                                    <td className="alignleft" style={{"width":"50%"}} >DEPOSIT</td>
                                    <td className="alignright" >-({formatCurrencyInINRWithOutDecmal(invoiceData.deposit_amount)})</td>
                                </tr>
                            )}

                            { parseFloat(invoiceData.advance_adj_amount) >  0  && (
                                <tr>
                                    <td className="alignleft"style={{"width":"50%"}} >ADVANCE</td>
                                    <td className="alignright" style={{"width":"50%"}} >{formatCurrencyInINRWithOutDecmal(invoiceData.advance_adj_amount)}</td>
                                </tr>
                            )}

                            { parseFloat(invoiceData.total_chit_amount) >  0  && (
                                <tr>
                                    <td className="alignleft"style={{"width":"50%"}} >CHIT -{invoiceData?.chit_number != undefined ?invoiceData.chit_number : ''}</td>
                                    <td className="alignright" style={{"width":"50%"}} >{formatCurrencyInINRWithOutDecmal(invoiceData.total_chit_amount)}</td>
                                </tr>
                            )}




                            {invoiceData.payment_details.map((item, index) => (
                                <tr>
                                    <td className="alignleft"style={{"width":"50%"}} >{item.mode_name}</td>
                                    <td className="alignright" style={{"width":"50%"}}>{ parseFloat(item.pay_amt) < 0? "("+formatCurrencyInINRWithOutDecmal(item.pay_amt)+")" : formatCurrencyInINRWithOutDecmal(item.pay_amt)}</td>
                                </tr>
                            ))}

                            { parseFloat(invoiceData.gift_amount) >  0  && (
                                <tr>
                                    <td className="alignleft"style={{"width":"50%"}} >GIFT ADJUSTED</td>
                                    <td className="alignright" style={{"width":"50%"}}  >{formatCurrencyInINRWithOutDecmal(invoiceData.gift_amount)}</td>
                                </tr>
                            )}
                            { (parseFloat(invoiceData.due_amount) >  0 && parseFloat(invoiceData.is_credit) ==1) && (
                                <>
                                <tr>
                                    
                                    <td  className="alignleft" colspan={2}> CREDIT {invoiceData?.jewel_not_deliver_details?.length > 0 ? "(JEWEL NOT DELIVERED)" : "JEWEL DELIVERED"}</td>
                                </tr>
                                <tr>
                                   <td  className="alignright" colSpan={2} ><span>{(invoiceData.credit_no)}</span>  <span style={{marginLeft:"83px"}}>{formatCurrencyInINRWithOutDecmal(invoiceData.due_amount)}</span></td>
                                </tr>
                                </>
                            )}
                        </tbody>

                  </table>
            <table className="summary">
                <tr>
                    <td colSpan="3"> <hr className="doted_hr" /></td>
                </tr>
                {(invoiceData.sales_details.length > 0 && invoiceData.is_promotional_billing != 1 )  && (
                    <tr style={{ fontWeight: "bold" }}>
                        <td className="alignleft">GRAND TOTAL</td>
                        <td className="alignright" >{formatCurrencyInINR(Math.round(invoiceData.sales_amount))}</td>
                    </tr>
                )}
            </table>


            {/* <table className="summary">
                <tbody>
                    {invoiceData.sales_details && (
                        <tr>
                            <td className="alignleft">SALES</td>
                            <td className="alignright">{formatCurrencyInINRWithOutDecmal(invoiceData.sales_amount)}</td>
                        </tr>
                    )}

                    { parseFloat(invoiceData.purchase_amount) > 0 && (
                        <tr>
                            <td className="alignleft">PURCHASE</td>
                            <td className="alignright">{formatCurrencyInINRWithOutDecmal(invoiceData.purchase_amount)}</td>
                        </tr>
                    )}

                    { parseFloat(invoiceData.return_amount) > 0 && (
                        <tr>
                            <td className="alignleft">RETURN</td>
                            <td className="alignright">{formatCurrencyInINRWithOutDecmal(invoiceData.return_amount)}</td>
                        </tr>
                    )}

                    {parseFloat(invoiceData.round_off) != 0 && (
                        <tr>
                            <td className="alignleft">ROUND OFF</td>
                            <td className="alignright">{formatCurrencyInINRWithOutDecmal(invoiceData.round_off)}</td>
                        </tr>
                    )}

                    <tr>
                        <td colSpan="2"> <hr className="doted_hr" /></td>
                    </tr>

                    <tr style={{ fontWeight: "bold" }}>
                        <td className="alignleft">GRAND TOTAL</td>
                        <td className="alignright">{formatCurrencyInINRWithOutDecmal(invoiceData.net_amount)}</td>
                    </tr>

                    <tr>
                        <td colSpan="2"> <hr className="doted_hr" /></td>
                    </tr>
                </tbody>
            </table> */}

    {/* <table className="payment_summarry">
        <tbody>
            <tr>
                <th colspan="2">
                    <h6 className="alignleft estmateNo">PAYMENT DETAILS</h6>
                </th>
            </tr>
            <tr>
                <td colSpan="2"> <hr className="doted_hr" /></td>
            </tr>


            <tr>
                <td colSpan="2"> <hr className="doted_hr" /></td>
            </tr>

            { invoiceData.show_balance_amount  && (
                <tr>
                    <td className="alignleft" >BALANCE</td>
                    <td className="alignright" >{(invoiceData.balance_amount)}</td>
                </tr>
            )}
           
        </tbody>
      </table>    */}
        <div className="footer">
            <table className="payment_summarry">
                    <tr>
                        <td colSpan={2} >

                        <br/>


                        </td>
                                
                    </tr>
                <tbody>

                <tr>
                    <td style={{width:"40%"}}>Customer </td>
                    <td style={{width:"60%"}} > : {invoiceData.customer_name}</td>
                </tr>
                <tr>
                    <td style={{width:"40%"}}>Ph.no </td>
                    <td style={{width:"60%"}} > : {invoiceData.customer_mobile}</td>
                </tr>
                </tbody>
            </table>
            <br/>
            <div style={{ textAlign : "left" }}>
                <span >EMP : {invoiceData.emp_name}</span>
            </div>
            <div style={{ textAlign : "center" }}>
                <span style={{fontSize: "10pt"}}>(*Goods Once Sold Cannot Be Returned) </span>
            </div>
        </div>

        </div>




    );
};

export default BillingPrintTemplateOne;
