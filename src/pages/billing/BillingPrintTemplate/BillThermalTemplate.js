import React, { useEffect, useRef } from "react";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { QRCodeCanvas } from "qrcode.react";
import { useDispatch, useSelector } from "react-redux";
const BillThermalTemplate = ({invoiceData,userInfo}) => {
    console.log(invoiceData,"invoiceData");
    
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
                    font-family: 'Courier New', Courier, monospace;
                }
                
                .body{
                    width: 297px; /* Match paper width (like 80mm = ~280px) */
                    text-transform: uppercase;
                    font-size: 11pt;
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
            </div><br></br>

            <div className="header">

                <div className="info">
                    <div  style={{ textTransform: "uppercase" ,  width: "40%"  }} >
                        <span style={{fontSize : "20px"}} >{invoiceData.customer_name}</span> <br></br>
                        <span>{invoiceData.customer_mobile}</span><br></br>
                       {invoiceData?.address != undefined &&( <><span>{invoiceData?.address}</span><br></br> </>)}
                        <span>{invoiceData?.city} {(invoiceData?.pin_code!='' ?  invoiceData?.pin_code:'')}</span>
                    </div>

                    <div className="" style={{ width: "60%" }}>
                        <span>RATE: {parseInt(invoiceData.metal)==1 ? invoiceData.metal_rates.gold_22ct : invoiceData.metal_rates.silver_G }</span><br></br>
                        <span>INV: <span style={{fontSize : "20px"}}>{invoiceData.invoice_data.invoice_no}</span></span><br></br>
                        <span>DATE: {invoiceData.date}</span><br></br>
                    </div>

                </div>
{/* 
                
                <div style={{ textTransform: "uppercase" }}>
                    {invoiceData.customer_name} / {invoiceData.customer_mobile}<br></br>
                    {invoiceData.invoice_data.invoice_no}
                </div>

                <div className="info">
                    <span>RATE: {parseInt(invoiceData.metal)==1 ? invoiceData.metal_rates.gold_22ct : invoiceData.metal_rates.silver_G }</span>
                    <span>DATE: {invoiceData.date}</span>
                </div> */}
                

                <hr className="doted_hr" />
            </div>
            {invoiceData.sales_details.length > 0 && (
                <div className="salesDetails">

                    <table className="sales_details" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th className="alignleft" style={{ width: "25%" }}>TAG</th>
                                <th className="alignright" style={{ width: "25%" }}>NWT</th>
                                {/* <th className="alignright" style={{ width: "45%" }}>V.A/MC</th> */}
                                <th className="alignright" style={{ width: "50%" }}>AMT</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="3"><hr className="doted_hr" /></td>
                            </tr>
                            {invoiceData.sales_details.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td>{item.old_tag_code!=null  ? item.old_tag_code : (item.tag_code!=null ? item.tag_code : item.design_name ) }</td>
                                        <td className="alignleft" >{parseInt(item?.weight_show_in_print)==1 ?  item.net_wt : ''}</td>
                                        <td className="alignright">{(parseFloat(parseFloat(item.item_cost)).toFixed(2))}</td>
                                    </tr>
                                </React.Fragment>
                            ))}

                            <tr>
                                <td colSpan="3"><hr className="doted_hr" /></td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td className="alignleft" style={{fontSize : "20px"}}>{invoiceData.total_nwt}</td>
                                <td className="alignright" style={{fontSize : "20px"}} >{invoiceData.sales_amount}</td>
                            </tr>
                        </tbody>
                    </table>
                    {/* <table>

                    </table> */}
                    

                    
                </div>

            )}

            {invoiceData.purchase_details.length > 0 && (

                <div className="purchaseDetails" style={{marginTop: "10px"}}>
                    <table className="purchase" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th className="aligncenter" colSpan="4">
                                    <span style={{fontWeight:"bold",fontSize:"14px"}}  >PURCHASE</span>
                                </th>
                            </tr>
                            <tr>
                                <th colSpan="5"> <hr className="doted_hr" /></th>
                            </tr>
                            <tr style={{ textAlign: "left" }}>
                                <th className="alignright">GWT</th>
                                <th className="alignright">LWT</th>
                                <th className="alignright">NWT</th>
                                <th className="alignright">AMT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="4"> <hr className="doted_hr" /></td>
                            </tr>

                            {invoiceData.purchase_details.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="alignleft" colSpan="4">{item.old_metal_type_name} @ Rate :  {parseFloat(parseFloat(item.rate_per_gram) ).toFixed(2)} </td>
                                    </tr>
                                    <tr>
                                        <td className="alignright" >{item.gross_wt}</td>
                                        <td className="alignright">{item.custom_less_weight}</td>
                                        <td className="alignright">{item.pure_weight}</td>
                                        <td className="alignright">{(item.amount)}</td>
                                    </tr>
                                </React.Fragment>
                            ))}

                            <tr>
                                <td colSpan="4"> <hr className="doted_hr" /></td>
                            </tr>

                            
                        </tbody>
                    </table>
                    <table>
                        <tr style={{ fontWeight: "bold" }}>
                                <td className="alignright" style={{fontSize : "20px"}}>{invoiceData.total_pur_gwt}</td>
                                <td></td>
                                <td className="alignright">{invoiceData.total_pur_pure_wt}</td>
                                <td className="alignright" style={{fontSize : "20px"}} >{(invoiceData.purchase_amount)}</td>
                            </tr>

                            <tr>
                                <td colSpan="5"> <hr className="doted_hr" /></td>
                            </tr>
                    </table>
                </div>


            )}

            {invoiceData.return_details.length > 0 && (
                <div className="salesReturnDetails">

                    <table className="sales_return_details" style={{ width: "100%" }}>
                        <thead>
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
                            {invoiceData.return_details.map((item, index) => (
                                
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

                                    <td className="alignright">{formatCurrencyInINR(invoiceData.return_amount)}</td>
                                </tr>
                            <tr>
                                <td colSpan="5"> <hr className="doted_hr" /></td>
                            </tr>

                        </tbody>
                    </table>

                </div>
            )}
                        

                <table className="payment_summarry">
                <tbody>
                        {/* { parseFloat(invoiceData.sales_amount)>0 && (
                            <tr style={{ fontWeight: "bold" }}>
                                <td style={{ width: "40%" }} ></td>
                                <td className="alignright" style={{ width: "20%" }} >SALES</td>
                                <td className="alignright" style={{ width: "40%" }} >{formatCurrencyInINR(invoiceData.sales_amount)}</td>
                            </tr>
                        ) }
                        { parseFloat(invoiceData.purchase_amount)>0 && (
                            <tr style={{ fontWeight: "bold" }}>
                                <td className="alignleft"  style={{ width: "40%" }}></td>
                                <td className="alignright" style={{ width: "20%" }} >PURCHASE</td>
                                <td className="alignright" style={{ width: "40%" }}>{formatCurrencyInINR(invoiceData.purchase_amount)}</td>
                            </tr>
                        ) } */}
                        { parseFloat(invoiceData.net_amount)>0 && (
                            <tr style={{ fontWeight: "bold" }}>
                                <td className="alignleft"  style={{ width: "40%" }} ></td>
                                <td className="alignright" style={{ width: "20%" }} >NET</td>
                                <td className="alignright" style={{ width: "40%" , fontSize :"20px" }} >{formatCurrencyInINR(invoiceData.net_amount)}</td>
                            </tr>
                        ) }
                        {/* <tr>
                            <td colSpan="5"> <hr className="doted_hr" /></td>
                        </tr> */}
                    </tbody>
                </table>
            
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
                                <td style={{ width: "40%" }} ></td>
                                <td style={{ width: "20%" }} className="alignright" >{ item.mode_name}</td>
                                <td style={{ width: "40%" }} className="alignright" >{formatCurrencyInINR(item.pay_amt)}</td>
                            </tr>
                        ))}
            
                        { parseFloat(invoiceData.due_amount) >  0  && (
                            <tr>
                                
                                <td colSpan={2} className="alignright" > CREDIT ({(invoiceData.credit_no)})</td>
                                <td  style={{ width: "15%" }} className="alignright" >{formatCurrencyInINR(invoiceData.due_amount)}</td>
                            </tr>
                        )}

                        { parseFloat(invoiceData.gift_amount) >  0  && (
                            <tr>
                                <td style={{ width: "40%" }} ></td>
                                <td style={{ width: "20%" }} className="alignright" >GIFT ADJUSTED</td>
                                 <td style={{ width: "40%" }} className="alignright" >{formatCurrencyInINR(invoiceData.gift_amount)}</td>
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
          

            {invoiceData.partly_sold_details.length > 0  && (
                <>
                    
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
                            {invoiceData.partly_sold_details.map((item, index) => (
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
                                        <td className="alignright">{(item.blc_gwt)}</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                           
                        </tbody>
                    </table>
                </>
            )}
            <br></br>
            <div className="footer" style={{textAlign : "center"}}>
                    <span>Subject to Billing on Approval</span>

            </div>

            <div  style={{ textAlign: "center", marginTop: "20px" }}>
                <span>{invoiceData?.emp_name + '  '+ invoiceData?.created_date_time}</span>
            </div>

        </div>

    );
};

export default BillThermalTemplate;
