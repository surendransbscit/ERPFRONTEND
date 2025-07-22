import React, { useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const TagPrintTemplateOne = ({itemDetails,settings,user}) => {
    console.log(itemDetails,'itemDetails');
    return (
     <>
            
                
                <style>
                    {`body {
                            margin: 0;
                        }
                        @page {
                            size: 100mm 15mm;
                            margin: 5px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 0;
                            padding: 0;
                        }
                        td {
                            margin: 0;
                            padding: 0;
                        }
                         tr {
                            margin: 0;
                            padding: 0;
                        }

                        .tag-label {
                            font-weight: bold;
                        }
                        .tag-value {
                            margin-left: 5px;
                        }
                        .printable {
                            font-family: "Times New Roman", Times, serif;
                            font-size: 9px;
                        }
                         .vertical-text { 

                            transform: rotate(-90deg);
                            margin: 0;
                            padding: 0;                            
                            text-align:center;
                            overflow: hidden;
                            margin-left: 5px;
                            margin-right: 20px;
                            overflow: hidden; /* Prevent overflow */
                            white-space: nowrap; /* Ensure text stays on one line */
                            text-overflow: ellipsis; /* Add ellipsis if text overflows */
                         }
                        
                        .container_ {
                            display: grid;
                            grid-template-columns: fit-content(80px) auto auto;
                            overflow: hidden;
                        }

                        // .qr-code  {
                            
                        //     margin-top:2px;
                        //  } 
                        .second  {
                            
                              margin-left: -70px;
                         } 
                        @media print {
                         .container_ { page-break-after: always; } /* page-break-after works, as well */
                        }
                    `}
                </style>
            

            <div className='printable' style={{fontWeight:"bold !important",color:"black"}} >
                {itemDetails.map((item, index) => (
                     <div className="container_"  key={index}  >
                        <div className="vertical-text"  >
                            <span >{user.company_name} <br/>  
                            {item.stn_pcs > 0 && (<>Stn : {item.stn_pcs} <br/></>)} 
                            {item.purity_name}</span>
                        </div>
                        <div className="qr-code"  >
                           <QRCodeCanvas value={item.tag_code} size={35} /><br/>

                        </div>
                        <div className="second" >
                        <span> {item.tag_code}</span><br/>
                            <span>G.wt :{item.tag_gwt}</span><br/>
                            <span>N.wt :{item.tag_nwt}</span>
                        </div>
                     </div>
                ))}
            </div>
            </>
    );
};

export default TagPrintTemplateOne;
