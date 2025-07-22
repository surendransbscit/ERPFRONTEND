import React, { useEffect, useRef } from "react";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const PurchasePrintTemplateOne = ({ purhcaseData }) => {
  console.log(purhcaseData, "purhcaseData");
  return (
    <div className="body">
      <title>Purchase : </title>
      <style>

        {`@page {
                    size: A4;
                    margin-top: 10px;
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
                    bpurhcaseData-collapse: collapse;
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
        <h4 className="estmateNo">{purhcaseData.company_name}</h4>
        <br />
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td className="alignleft">Ref No : {purhcaseData.ref_no}</td>
              <td className="alignright">Branch : {purhcaseData.branch}</td>
            </tr>

            <tr>
              <td className="alignleft">
                Supplier : {purhcaseData.supplier_name}
              </td>
              <td className="alignright">DATE : {formatDate(purhcaseData.entry_date)}</td>

              {/* <td className="alignright">DATE : {formatDate(purhcaseData.purhcaseData_date)}</td> */}
            </tr>
          </tbody>
        </table>

        <hr className="doted_hr" />
      </div>
      {purhcaseData?.item_details?.length > 0 && (
        <div className="salesDetails">
          <table className="sales_details" style={{ width: "100%" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th className="alignleft" style={{ width: "15%" }}>
                  Desc
                </th>
                <th className="alignleft" style={{ width: "15%" }}>
                  PCS
                </th>
                <th className="alignleft" style={{ width: "15%"}}>
                  GWT
                </th>
                <th className="alignleft" style={{ width: "15%" }}>
                  NWT
                </th>
                <th className="alignleft" style={{ width: "15%" }}>
                  PURE
                </th>
                <th className="alignleft" style={{ width: "15%" }}>
                  AMT
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6">
                  <hr className="doted_hr" />
                </td>
              </tr>
              {purhcaseData?.item_details?.map((item, index) => (
                <>
                <tr>
                  <td style={{ width: "16%" }} className="alignleft">
                    {item?.product_name}
                  </td>
                  <td style={{ width: "15%" }} className="alignleft">
                    {item.pieces}
                  </td>
                  <td style={{ width: "5%" }} className="alignleft">
                    {item.gross_wt}
                  </td>
                  <td style={{ width: "20%" }} className="alignleft">
                    {item.net_wt}
                  </td>
                  <td style={{ width: "20%" }} className="alignleft">
                    {item.pure_wt}
                  </td>
                  <td style={{ width: "20%" }} className="alignleft">
                    {formatCurrencyInINR(item.purchase_cost)}
                  </td>
                </tr>
                {item?.stone_details?.length > 0 && 
                  item?.stone_details?.map((stn, i) => (
                      <tr>
                        <td colSpan="6">
                          {stn?.stone_name} {"      "}   {stn?.stone_pcs} Pcs   {stn?.stone_wt} {stn?.uom_name}   @{stn?.pur_st_rate}{ stn?.pur_stn_cal_type == 2 ? "/GM":"/PCS"}  =  {stn?.pur_stn_cost}
                        </td>
                      </tr>
                ))}
                </>

              ))}

              <tr>
                <td colSpan="6">
                  <hr className="doted_hr" />
                </td>
              </tr>
              <tr style={{ textAlign: "left" }}>
                <th className="alignleft" style={{ width: "15%" }} >Total</th>
                <th className="alignleft"  style={{ width: "5%" }} >{purhcaseData?.total_pcs}</th>
                <th className="alignleft"  style={{ width: "20%" }} >{purhcaseData?.total_gross_wt}</th>
                <th className="alignleft"  style={{ width: "20%" }} >{purhcaseData?.total_net_wt}</th>
                <th className="alignleft"  style={{ width: "20%" }} >{purhcaseData?.total_pure_wt}</th>
                <th className="alignleft"  style={{ width: "20%" }} >{purhcaseData?.net_amount}</th>
                
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {purhcaseData?.charges_details?.length > 0 && (
        <div className="chargesDetails">
          <table className="charges_details" style={{ width: "100%" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th className="alignleft" style={{ width: "50%" }}>
                  Charges
                </th>
                <th className="alignright" style={{ width: "50%" }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {purhcaseData?.charges_details?.map((charge, index) => (
                <tr key={index}>
                  <td className="alignleft">{charge.charge_name}</td>
                  <td className="alignright">
                    {formatCurrencyInINR(charge.charges_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchasePrintTemplateOne;
