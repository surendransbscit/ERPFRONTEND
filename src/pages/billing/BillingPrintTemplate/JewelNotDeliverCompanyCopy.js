import React, { useEffect, useRef,useState  } from "react";
import { useDispatch } from "react-redux";
import { formatCurrencyInINR,numberToWords } from "../../../components/common/moneyFormat/moneyFormat";
import secureLocalStorage from "react-secure-storage";

const JewelNotDeliverCompanyCopy = () => {
    const dispatch = useDispatch();
    const [invoiceData, SetItemDetails] = useState();
    const [settings, SetSettings] = useState({});
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        let data = JSON.parse(secureLocalStorage?.getItem("pageState"));
        SetItemDetails(data.itemDetails);
        SetSettings(data.settings);
        setUserInfo(data.userInfo);
    }, [dispatch]);
    useEffect(() => {
        if(invoiceData != null){
            window.print();
        }
    }, [invoiceData]);

          //Handle closing the tab after print/cancel
            useEffect(() => {
                const handleAfterPrint = () => {
                    window.close();
                };
        
                window.onafterprint = handleAfterPrint;
        
                // Backup: handle if user tries to navigate away
                window.onbeforeunload = () => {
                    window.onafterprint = null;
                };
        
                return () => {
                    // Clean up on unmount
                    window.onafterprint = null;
                    window.onbeforeunload = null;
                };
            }, []);
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

            
            


            {invoiceData?.jewel_not_deliver_details?.length > 0 && (
                <div className="salesDetails">
                    
                    <div className="" style={{textAlign:"center"}}>
                        <span>{userInfo?.user?.company_fullname}</span><br></br>
                        <span>{userInfo?.user?.company_address}</span><br></br>
                    </div>
                    <div className="" style={{textAlign:"center"}}>
                        <span>Customer Copy</span><br></br>
                    </div><br></br>
                    <div className="header">
                        <div className="info">
                            <div  style={{ textTransform: "uppercase" }}>
                            <span>INV.NO: {invoiceData.credit_no}</span><br></br>

                                
                               

                            </div>

                         <div className="" style={{ width: "40%" }}>
                            <span>DATE: {invoiceData.date}</span>

                            </div> 
                        </div>
                    </div>

                    {/* <table className="sales_details" style={{ width: "100%" }}>
                        <thead>
                        <tr style={{ textAlign: "left" }}>
                           <th colSpan={"4"}><hr className="doted_hr" /></th>
                        </tr>
                            <tr style={{ textAlign: "left" }}>
                                <th className="alignleft" style={{ width: "25%" }}>Item</th>
                                <th className="alignright" style={{ width: "25%" }}>Pcs</th>
                                <th className="alignright" style={{ width: "25%" }}>Wt</th>
                                <th className="alignright" style={{ width: "25%" }}>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="4"><hr className="doted_hr" /></td>
                            </tr>
                            {invoiceData.jewel_not_deliver_details.map((item, index) => (

                                <tr>
                                    <td style={{ width: "25%" }} className="alignleft">{item.product_name}</td>
                                    <td style={{ width: "25%" }} className="alignright">{item.piece}</td>
                                    <td style={{ width: "25%" }} className="alignright">{item.weight}</td>
                                    <td style={{ width: "25%" }} className="alignright">{item.remarks}</td>
                                </tr>
                            ))}

                            <tr>
                                <td colspan="4"><hr className="doted_hr" /></td>
                            </tr>

                            
                            <tr style={{ fontWeight: "bold" }}>
                                <td className="alignleft" >Total</td>
                                <td className="alignright">{invoiceData.total_jnd_piece}</td>
                                <td className="alignright">{invoiceData.total_jnd_wt}</td>
                                <td className="alignright"></td>

                            </tr>

                            <tr>
                                <td colspan="4"><hr className="doted_hr" /></td>
                            </tr>



                        </tbody>

                    </table> */}

                    <hr className="doted_hr" />

                  <div style={{ textAlign : "left" }}>


                    <span style={{fontSize: "13pt"}}> CREDIT AMOUNT  :  {formatCurrencyInINR(invoiceData.due_amount)}</span>

                   </div>

                   <hr className="doted_hr" />

                    <div style={{ textAlign : "left" }}>
                        <span style={{fontSize: "10pt"}}>EMP : {invoiceData.emp_name}-{invoiceData.emp_code}  </span>
                    </div>

                            <div style={{ textAlign : "center" }}>
            <span style={{fontSize: "10pt"}}>(*Goods Once Sold Cannot Be Returned) </span>
        </div>

                </div>
            )}

        </div>
    );
};

export default JewelNotDeliverCompanyCopy;
