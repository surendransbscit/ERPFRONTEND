import React from "react";

const QcHmIssueReceiptPrintTemplateTwo = ({ issueData }) => {
  return (
    <div className="body">
      <title>QC/HM Issue Receipt</title>
      <style>
        {`@page {
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
                      margin-top: 0;
                      padding: 0;
                      color:black;
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
         <br></br>
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

export default QcHmIssueReceiptPrintTemplateTwo;
