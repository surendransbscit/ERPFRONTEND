import React, { useEffect, useState  } from "react";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import secureLocalStorage from "react-secure-storage";
import { useDispatch } from "react-redux";

const SupplierPaymentPrintThermal = () => {
      const dispatch = useDispatch();
      const [itemDetails, SetItemDetails] = useState();
      const [settings, SetSettings] = useState({});
  
      let data = JSON.parse(secureLocalStorage?.getItem("pageState"));
      useEffect(() => {
          SetItemDetails(data.itemDetails);
          SetSettings(data.settings);
          console.log(data,"data");
      }, [dispatch]);
      useEffect(() => {
          if(itemDetails != undefined){
              window.print();
          }
      }, [itemDetails]);
  
      // Handle closing the tab after print/cancel
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
    itemDetails != undefined  && ( 
      <div className="body">
        <title>Purchase : </title>
        <style>
          {`
                  @page {
                    size: 80mm 250mm;
                    margin: 2mm;
                    margin-top: 0;
                    /* Set the size for the page */
                  }
                  .estmateNo{
                      text-align: center;
                      font-weight: bold;
                      color :black;
                      font-family: "Times New Roman", Times, serif !important;
                  }
                  
                  .body{
                      text-transform: uppercase;
                      font-size: 13px;
                      font-family:  "Times New Roman", Times, serif !important;
                      margin-top: 0;
                      padding: 0;
                      color:black;
                      line-height: 1.8;
                  }
                  @media print {
                          .pagebreak { page-break-after: always; } /* page-break-after works, as well */
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
                      bitemDetails-collapse: collapse;
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
                  `}
        </style>

        <div className="header">
          <h4 className="estmateNo">{itemDetails.company_name}</h4>
          <br />
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td className="alignleft">Ref No : {itemDetails.ref_no}</td>
                <td className="alignright">Branch : {itemDetails.branch_name}</td>
              </tr>

              <tr>
                <td className="alignleft">
                  Supplier : {itemDetails.supplier_name}
                </td>
                <td className="alignright">DATE : {itemDetails.entry_date}</td>

                {/* <td className="alignright">DATE : {formatDate(itemDetails.itemDetails_date)}</td> */}
              </tr>
            </tbody>
          </table>

          
        </div>
        
          <div className="salesDetails">
            <table className="sales_details" style={{ width: "100%" }}>

              <tbody>
                <tr>
                  <td colSpan="6">
                    <hr className="doted_hr" />
                  </td>
                </tr>
                <tr>
                  <td colSpan="5">
                   Desc
                  </td>
                  <td  className="alignright">
                    Amount </td>
                </tr>
                <tr>
                  <td colSpan="6">
                    <hr className="doted_hr" />
                  </td>
                </tr>

                <tr>
                  <td colSpan="5">

                  { itemDetails.remarks }
                  </td>
                  <td  className="alignright">
                    {formatCurrencyInINR(itemDetails.amount)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="6">
                    <hr className="doted_hr" />
                  </td>
                </tr>
                {itemDetails?.payment_mode_details?.map((item, index) => (
                  <tr>
                    <td className="alignright" colSpan={5}> {item.mode_name}</td>

                    <td  className="alignright">
                      {formatCurrencyInINR(item.payment_amount)}
                    </td>
                  </tr>
                ))}
                

              </tbody>
            </table>
          </div>
      </div>
    )
  );
};

export default SupplierPaymentPrintThermal;
