import React from "react";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const PrintTemplateOne = ({ order }) => {
  return (
    <div className="body">
      <title>REPAIR ORDER</title>
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
        <h4 className="estmateNo mt-2" style={{ textAlign: "center" }}>
          {order.company_name}
        </h4>
        <br />
        <table>
          <tbody>
            <tr>
              <td className="alignleft">NAME : {order.customer_name}</td>
              <td className="alignright">BRANCH : {order.branch_name}</td>
            </tr>
            <tr>
              <td className="alignleft">MOBILE : {order.customer_mobile}</td>
              <td className="alignright">DATE : {formatDate(order.order_date)}</td>
              
            </tr>
            <tr>
              {order?.order_details?.map((item) =><td className="alignleft">Order No : {item.order_no}</td> )}
            </tr>
          </tbody>
        </table>
        <hr className="doted_hr" />
      </div>

      {/* Repair Details Table */}
      <table className="purchase" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th colSpan="5" style={{ textAlign: "center" }}>
              <h5>ORDER DETAILS</h5>
            </th>
          </tr>
          <tr>
            <td colSpan="5">
              <hr className="dashed" />
            </td>
          </tr>
          <tr style={{ textAlign: "left" }}>
            <th className="alignleft" style={{ width: "30%" }}>
              REF NO
            </th>
            <th className="alignleft" style={{ width: "30%" }}>
              PRODUCT
            </th>
            <th className="alignleft" style={{ width: "25%" }}>
              TYPE
            </th>
            <th className="alignleft" style={{ width: "20%" }}>
              PCS
            </th>
            <th className="alignright" style={{ width: "25%" }}>
              GWT
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5">
              <hr className="dashed" />
            </td>
          </tr>

          {order?.order_details?.map((item, index) => (
            <React.Fragment key={index}>
              <tr>
                <td className="alignleft"></td>
                <td className="alignleft">{item.product_name}</td>
                <td className="alignleft">{item.repair_name}</td>
                <td className="alignleft">{item.pieces}</td>
                <td className="alignright">{item.gross_wt}</td>
              </tr>
              <tr>
                <td colSpan="5" className="alignleft">
                  Remarks : {item.remarks}
                </td>
              </tr>
              <tr>
                <td colSpan="5" className="alignleft">
                  Due Date : {formatDate(item.customer_due_date)}
                </td>
              </tr>
              <tr>
                <td colSpan="5">
                  <hr className="dashed" />
                </td>
              </tr>
            </React.Fragment>
          ))}

          {/* Total Row */}
          <tr>
            <td colSpan="3" className="alignleft">
              <strong>Total</strong>
            </td>
            <td className="alignleft">
              <strong>{parseInt(order?.total_pcs)}</strong>
            </td>
            <td className="alignright">
              <strong>{parseFloat(order?.total_gross_wt).toFixed(3)}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PrintTemplateOne;
