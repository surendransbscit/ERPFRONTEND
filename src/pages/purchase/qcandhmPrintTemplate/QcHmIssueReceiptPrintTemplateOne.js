import React from "react";

const QcHmIssueReceiptPrintTemplateOne = ({ issueData }) => {
  return (
    <div className="body">
      <title>QC/HM Issue Receipt</title>
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
  <h4 className="estmateNo">{issueData?.company_name}</h4>
</div>

        <br />
        <div className="info">
         <div>
         <span>Issue No: {issueData?.issue_no}</span>
         <br/>
         <span>BRANCH: {issueData?.branch}</span>
          </div> 
           <div style={{textAlign: 'right',width: "46%" }}>
           <span>
          {issueData?.emp_name
            ? `EMPLOYEE: ${issueData.emp_name}`
            : issueData?.supplier_name
            ? `SUPPLIER: ${issueData.supplier_name}`
            : ''}
        </span>
            <br />
            <span>DATE: {issueData?.issue_date}</span>
          </div>  
        </div>
        <hr className="doted_hr" />
      </div>

      {issueData?.item_details?.length > 0 && (
        <div className="salesDetails">
          <table>
            <thead>
              <tr>
                <th className="alignleft">PRODUCT</th>
                <th></th>
                <th className="alignright">PIECES</th>
                <th className="alignright">GWT</th>
                <th className="alignright">NWT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6">
                  <hr className="doted_hr" />
                </td>
              </tr>
              {issueData.item_details.map((item, idx) => (
                <React.Fragment key={idx}>
                  <tr>
                    <td className="alignleft" colSpan="6">
                      {item.product_name}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td className="alignright">{item.pieces}</td>
                    <td className="alignright">{item.gross_wt}</td>
                    <td className="alignright">{item.net_wt}</td>
                  </tr>
                </React.Fragment>
              ))}
            <tr>
            <td colSpan="6">
                <hr className="doted_hr" />
            </td>
            </tr>
            <tr style={{ textAlign: "left" }}>
            <th className="alignleft" style={{ width: "15%" }}>Total</th>
            <th></th>
            <th></th>
            <th className="alignright" style={{ width: "25%" }}>
            {issueData?.item_details?.map((item) => item.total_gross_wt)}
            </th>
            <th className="alignright" style={{ width: "25%" }}>
              {issueData?.item_details?.map((item) => item.total_net_wt)}
            </th>
            </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QcHmIssueReceiptPrintTemplateOne;
