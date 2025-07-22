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
  const totalPieces = order?.order_details?.reduce((sum, item) => sum + Number(item.pieces || 0), 0);
  const totalGwt = order?.order_details?.reduce((sum, item) => sum + Number(item.gross_wt || 0), 0);
  
  return (
    <div className="body">
      <title>ORDER {order.order_no}</title>
      <style>
        {
          `@page {
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

      {/* Header Section */}
      <div className="header">
        <h4 className="estmateNo mt-2" style={{ textAlign: "center" }}>{order.company_name}</h4>
        <br />
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td className="alignleft">NAME : {order.supplier_name}</td>
              <td className="alignright">ORDER NO : {order.order_no}</td>
            </tr>
            <tr>
              <td className="alignleft">MOBILE : {order.mobile}</td>
              <td className="alignright">BRANCH : {order.branch_name}</td>
            </tr>
            <tr>
              <td className="alignleft">ADDRESS : {order.address}</td>
              {/* <td className="alignright">DATE : {order.order_date}</td> */}
              {/* If you have a formatDate function, you can format the date */}
              <td className="alignright">DATE : {formatDate(order.order_date)}</td>
            </tr>
          </tbody>
        </table>

        <hr className="doted_hr" />
      </div>

      {/* Order Details Section */}
      <div className="purchase-details">
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
                PRODUCT
              </th>
              {/* <th className="alignleft" style={{ width: "25%" }}>
                TYPE
              </th> */}
              <th className="alignright" style={{ width: "20%" }}>
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

            {order?.order_details &&
              order?.order_details?.map((item, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="alignleft">{item.product_name}</td>
                    {/* <td className="alignleft">{order.order_type_label}</td> */}
                    <td className="alignright">{item.pieces}</td>
                    <td className="alignright">{item.gross_wt}</td>
                  </tr>

                  <tr>
                    <td colSpan="5" className="alignleft">
                      Remarks : {item.remarks}
                    </td>
                  </tr>

                </React.Fragment>
              ))}
            <tr>
              <td className="alignleft" colSpan="2"><strong>TOTAL</strong></td>
              <td className="alignright"><strong>{totalPieces}</strong></td>
              <td className="alignright"><strong>{totalGwt}</strong></td>
            </tr>

            <tr>
              <td colSpan="5">
                <hr className="dashed" />
              </td>
            </tr>


            <tr>
              <td colSpan="5">
                <hr className="dashed" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintTemplateOne;
