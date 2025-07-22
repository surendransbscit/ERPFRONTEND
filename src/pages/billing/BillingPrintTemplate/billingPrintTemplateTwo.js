import React, { useEffect, useRef } from "react";
import { formatCurrencyInINR,numberToWords } from "../../../components/common/moneyFormat/moneyFormat";

const EstPrintTemplateTwo = ({invoiceData}) => {

    return (
        <div className="body">

            <title>Invoice</title>
            <style>
                {
                `
                html, body {
                    display: flex;
                    flex-direction: column;
                }
                @page {
                    size: 20.3cm 20.3cm;
                   // margin: 2mm;
                    margin-top: 1cm;
                   margin-bottom: 5cm;
                }
                .estmateNo{
                    text-align: center;
                    font-weight: bold;
                    color :black;
                    font-family: "Times New Roman", Times, serif !important;
                }
                .info {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                }
                .doted_hr {
                    // border-top: 1px dashed black;
                    color:black;
                    opacity: 1 !important;
                    margin :6px 0;
                }
                body{
                    text-transform: uppercase;
                    font-size: 12px;
                    font-family: "Times New Roman", Times, serif;
                    margin-top: 0;
                    padding: 0;
                    color :black;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 0;
                    padding: 0;
                }

                .qr-code img {
                    height: 60px;
                    background-color: aquamarine;
                    margin: 0;
                    padding: 0;
                }
                hr.dashed {
                    // border: none;
                    // border-top: 1px dashed #000; /* Dashed line */
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
                .payment_summarry{

                }
                @media print {
                    .pagebreak { page-break-after: always; } /* page-break-after works, as well */
                    .print-footer {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        text-align: left;
                        padding: 10px;
                        font-size: 12px;
                    }
                }
                `
                }
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
            <div className="header">
                <div className="info">
                   <span></span>

                    <span> INV NO : {invoiceData.invoice_data.invoice_no}</span>
                </div>
                <div className="info">
                   <span>NAME : {invoiceData.customer_name}  {invoiceData.customer_mobile}</span>

                    <span> DATE : {invoiceData.date}  RATE : {parseInt(invoiceData.metal)==1 ? invoiceData.metal_rates.gold_22ct : invoiceData.metal_rates.silver_G }</span>
                </div>
            </div>

            {invoiceData.sales_details.length > 0 && (
                <div className="salesDetails">

                    <table className="sales_details" style={{ width: "100%" }}>
                        <thead>
                        <tr style={{ textAlign: "left" }}>
                           <th colSpan={"5"}><hr className="doted_hr" /></th>
                        </tr>
                            <tr style={{ textAlign: "left" }}>
                                <th className="alignleft" style={{ width: "5%" }}>Sl</th>
                                <th className="alignleft" style={{ width: "50%" }}>Item</th>
                                <th className="alignright" style={{ width: "15%" }}>Pcs</th>
                                <th className="alignright" style={{ width: "15%" }}>Wt</th>
                                <th className="alignright" style={{ width: "15%" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="5"><hr className="doted_hr" /></td>
                            </tr>
                            {invoiceData.sales_details.map((item, index) => (

                                <tr>
                                    <td style={{ width: "5%" }} className="alignleft">{index+1}</td>
                                    <td style={{ width: "50%" }} className="alignleft">{item.product_name} - {item.design_name}</td>
                                    <td style={{ width: "15%" }} className="alignright">{item.pieces}</td>
                                    <td style={{ width: "15%" }} className="alignright">{parseInt(item?.weight_show_in_print)==1 ?  item.net_wt : ''}</td>
                                    <td style={{ width: "15%" }} className="alignright">{formatCurrencyInINR(item.taxable_amount)}</td>
                                </tr>
                            ))}

                            <tr>
                                {/* <td colspan="2" ></td> */}
                                <td colspan="5"><hr className="doted_hr" /></td>
                            </tr>

                           
                            
                            <tr style={{ fontWeight: "bold" }}>
                                <td className="alignleft" colspan="2" > {(invoiceData.sales_amount!=0 ? 'Total : ' + invoiceData.amount_in_words :'')}</td>
                                <td className="alignright">{invoiceData.total_pcs}</td>
                                <td className="alignright">{invoiceData.total_nwt}</td>
                                <td className="alignright">{formatCurrencyInINR(invoiceData.total_taxable)}</td>

                            </tr>
                            { parseFloat(invoiceData.cgst_cost)>0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignleft" colspan="3" ></td>
                                    <td className="alignright">CGST ({parseFloat(parseFloat(invoiceData.tax_per)/2).toFixed(1)}) %</td>
                                    <td className="alignright">{formatCurrencyInINR(invoiceData.cgst_cost)}</td>
                                </tr>
                            ) }

                            { parseFloat(invoiceData.sgst_cost)>0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignleft" colspan="3" ></td>
                                    <td className="alignright">SGST ({parseFloat(parseFloat(invoiceData.tax_per)/2).toFixed(1)}) %</td>
                                    <td className="alignright">{formatCurrencyInINR(invoiceData.sgst_cost)}</td>
                                </tr>
                            ) }

                            { parseFloat(invoiceData.igst_cost)>0 && (
                                <tr style={{ fontWeight: "bold" }}>
                                    <td className="alignleft" colspan="3" ></td>
                                    <td className="alignright">IGST ({parseFloat(parseFloat(invoiceData.tax_per)).toFixed(1)}) %</td>
                                    <td className="alignright">{formatCurrencyInINR(parseFloat(invoiceData.igst_cost).toFixed(2))}</td>
                                </tr>
                            ) }

                            <tr style={{ fontWeight: "bold" }}>
                                <td className="alignleft" colspan="3" ></td>
                                <td className="alignright">Nett</td>
                                <td className="alignright">{formatCurrencyInINR(invoiceData.sales_amount)}</td>
                            </tr>



                        </tbody>
                    </table>

                </div>
            )}

            {invoiceData.purchase_details.length > 0 && (

                <div className="purchaseDetails " style={{ marginTop: "10px",display:"flex" }}>
                    <table className="purchase" style={{ width: "70%" }}>
                        <thead>
                            <tr>
                                <th className="aligncenter" colSpan="7">
                                    <span style={{ fontWeight: "bold", fontSize: "14px" }}  >PURCHASE</span>
                                </th>
                            </tr>
                            <tr>
                                <th colSpan="7"> <hr className="doted_hr" /></th>
                            </tr>
                            <tr style={{ textAlign: "left" }}>
                                <th className="alignleft" >Item</th>
                                <th className="alignright">Wt</th>
                                <th className="alignright">Lwt</th>
                                <th className="alignright">NWT</th>
                                <th className="alignright">Rate</th>
                                <th className="alignright">+/-</th>
                                <th className="alignright">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="7"> <hr className="doted_hr" /></td>
                            </tr>

                            {invoiceData.purchase_details.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td  className="alignleft" colSpan="1">{item.old_metal_type_name}</td>
                                        <td className="alignright">{item.gross_wt}</td>
                                        <td className="alignright">{item.custom_less_weight}</td>
                                        <td className="alignright">{item.pure_weight}</td>
                                        <td className="alignright">{parseFloat(parseFloat(item.rate_per_gram) ).toFixed(2)}</td>
                                        <td className="alignright">{"0"}</td>
                                        <td className="alignright">{formatCurrencyInINR(item.amount)}</td>
                                    </tr>
                                </React.Fragment>
                            ))}

                            <tr>
                                <td colSpan="7"> <hr className="doted_hr" /></td>
                            </tr>

                            <tr>
                                <td  className="alignleft" >TOTAL</td>
                                <td className="alignright">{invoiceData.total_pur_pure_wt}</td>
                                <td  className="alignleft" colSpan="4" ></td>
                                <td className="alignright">{formatCurrencyInINR(invoiceData.purchase_amount)}</td>
                            </tr>

                        </tbody>
                    </table>
                    <div className=""  style={{ fontWeight: "bold",width: "30%" }} > 
                    <table className="purchase" >
                        <tr>
                            <th style={{ width: "22%" }} ></th>
                            <th className="alignright">Old Value : </th>
                            <th className="alignright">{formatCurrencyInINR(invoiceData.purchase_amount)}</th>
                        </tr>
                        <tr>
                            <th style={{ width: "32%" }} ></th>
                            <th className="alignleft">Nett : </th>
                            <th className="alignright" >{formatCurrencyInINR((parseFloat(invoiceData.sales_amount) - parseFloat(invoiceData.purchase_amount)).toFixed(2))}</th>
                        </tr>
                    </table>
                       
                    </div>
                </div>


            )}

            {invoiceData.return_details.length > 0 && (
                <div className="salesReturnDetails">
                    <span style={{ fontWeight: "bold", fontSize: "14px" }}  >SALES RETURN</span>

                    <table className="sales_return_details" style={{ width: "100%" }}>
                        <thead>
                            <tr style={{ textAlign: "left" }}>
                                <th className="alignleft" >DESC</th>
                                <th className="alignright" >PCS/NWT</th>
                                <th className="alignright" >AMT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="3"><hr className="doted_hr" /></td>
                            </tr>
                            {invoiceData.return_details.map((item, index) => (
                                
                                <tr>
                                    <td className="alignleft" >{item.product_name}</td>
                                    <td className="alignright">{item.pieces} / {item.net_wt}</td>
                                    <td className="alignright">{item.item_cost}</td>
                                </tr>
                                
                            ))}
                            <tr>
                                <td colSpan="3"><hr className="doted_hr" /></td>
                            </tr>
                            <tr>
                                    <td className="alignleft" colSpan="2" >TOTAL</td>

                                    <td className="alignright">{formatCurrencyInINR(invoiceData.return_amount)}</td>
                                </tr>
                            <tr>
                                <td colSpan="3"> <hr className="doted_hr" /></td>
                            </tr>


                        </tbody>
                    </table>

                </div>
            )}


            {/* <table className="summary">
                <tbody>
                    {invoiceData.sales_details && (
                        <tr>
                            <td className="alignleft">SALES</td>
                            <td className="alignright">{formatCurrencyInINR(invoiceData.sales_amount)}</td>
                        </tr>
                    )}

                    {invoiceData.purchase_details && (
                        <tr>
                            <td className="alignleft">PURCHASE</td>
                            <td className="alignright">{formatCurrencyInINR(invoiceData.purchase_amount)}</td>
                        </tr>
                    )}

                    {invoiceData.return_details && (
                        <tr>
                            <td className="alignleft">RETURN</td>
                            <td className="alignright">{formatCurrencyInINR(invoiceData.return_amount)}</td>
                        </tr>
                    )}

                    {parseFloat(invoiceData.round_off) != 0 && (
                        <tr>
                            <td className="alignleft">ROUND OFF</td>
                            <td className="alignright">{formatCurrencyInINR(invoiceData.round_off)}</td>
                        </tr>
                    )}

                    {parseFloat(invoiceData.total_discount_amount) > 0 && (
                        <tr>
                            <td className="alignleft">DISCOUNT</td>
                            <td className="alignright">{formatCurrencyInINR(invoiceData.total_discount_amount)}</td>
                        </tr>
                    )}

                    <tr>
                        <td colSpan="2"> <hr className="doted_hr" /></td>
                    </tr>

                    <tr style={{ fontWeight: "bold" }}>
                        <td className="alignleft">GRAND TOTAL</td>
                        <td className="alignright">{formatCurrencyInINR(invoiceData.net_amount)}</td>
                    </tr>

                    <tr>
                        <td colSpan="2"> <hr className="doted_hr" /></td>
                    </tr>
                </tbody>
            </table> */}

    <table className="payment_summarry">
        <tbody>
            {/* <tr>
                <th colspan="2">
                    <h6 className="alignleft estmateNo">PAYMENT DETAILS</h6>
                </th>
            </tr> */}
            {/* <tr>
                <td colSpan="2"> <hr className="doted_hr" /></td>
            </tr> */}
            {/* { parseFloat(invoiceData.cash) >  0  && (
                <>
                <tr>
                    <td className="alignleft" colSpan={"2"} >Rs. {(invoiceData.cash)}</td>
                </tr>
                <tr>
                    <td className="alignleft" colSpan={"2"} >{numberToWords(invoiceData.cash)} / {invoiceData.invoice_data.invoice_no}</td>
                </tr>
                </>
            )} */}
            { parseFloat(invoiceData.deposit_amount) >  0  && (
                <tr>
                    <td style={{ width: "70%" }} ></td>
                    <td style={{ width: "15%" }} className="alignright" >DEPOSIT AMOUNT</td>
                    <td  style={{ width: "15%" }} className="alignright" >{formatCurrencyInINR(invoiceData.deposit_amount)}</td>
                </tr>
            )}

            { parseFloat(invoiceData.advance_adj_amount) >  0  && (
                <tr>
                    <td style={{ width: "70%" }} ></td>
                    <td style={{ width: "15%" }} className="alignright" >ADV ADJUSTED</td>
                    <td style={{ width: "15%" }}className="alignright" >{formatCurrencyInINR(invoiceData.advance_adj_amount)}</td>
                </tr>
            )}

            { parseFloat(invoiceData.total_chit_amount) >  0  && (
                <tr>
                    <td style={{ width: "70%" }} ></td>
                    <td style={{ width: "15%" }} className="alignright" >CHIT ADJUSTED</td>
                    <td  style={{ width: "15%" }} className="alignright" >{formatCurrencyInINR(invoiceData.total_chit_amount)}</td>
                </tr>
            )}


            {invoiceData.payment_details.map((item, index) => (
                <tr>
                    <td style={{ width: "70%" }} ></td>
                    <td style={{ width: "15%" }} className="alignright" >{ item.mode_name}</td>
                    <td style={{ width: "15%" }} className="alignright" >{formatCurrencyInINR(item.pay_amt)}</td>
                </tr>
            ))}

            { parseFloat(invoiceData.gift_amount) >  0  && (
                <tr>
                    <td style={{ width: "70%" }} ></td>
                    <td style={{ width: "15%" }} className="alignright" >GIFT ADJUSTED</td>
                    <td style={{ width: "15%" }} className="alignright" >{formatCurrencyInINR(invoiceData.gift_amount)}</td>
                </tr>
            )}


            { parseFloat(invoiceData.due_amount) >  0  && (
                <tr>
                    
                    <td colSpan={2} className="alignright" > CREDIT ({(invoiceData.credit_no)})</td>
                    <td  style={{ width: "15%" }} className="alignright" >{formatCurrencyInINR(invoiceData.due_amount)}</td>
                </tr>
            )}

            { parseFloat(invoiceData.balance_amount) > 0  && (
                <>
                <tr>
                            <td></td>
                            <td colSpan="2"> <hr className="doted_hr" /></td>
                        </tr>
                <tr>
                     <td style={{ width: "70%" }} ></td>
                    <td style={{ width: "15%" }} className="alignright" >BALANCE</td>
                    <td style={{ width: "15%" }} className="alignright" >{formatCurrencyInINR(invoiceData.balance_amount)}</td>
                </tr>
                </>
            )}
           
        </tbody>
      </table>
        <div className="print-footer" style={{ textAlign: "left", marginTop: "20px" }}>
                <span>{invoiceData?.emp_name + '  '+ invoiceData?.created_date_time}</span>
                <span style={{ float: "right" }}>Signature</span>
        </div>
        
        </div>
    );
};

export default EstPrintTemplateTwo;
