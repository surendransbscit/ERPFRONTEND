import React from "react";
import CurrencyDisplay from "../common/moneyFormat/moneyFormat";

const TagAuditPrintTable = ({ tagAuditReportList, columns, calculateTotal }) => {
  console.log("tagAuditReportList", tagAuditReportList, columns, calculateTotal);
  return (
    <div>
      <div className="table-responsive dataTables_wrapper" >
        <table className="table-wrapper react_table">
          <thead>
            <tr>
              {columns?.map((column, index) => (
                <th key={index} style={{ textAlign: column?.text_align }}>
                  {column.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tagAuditReportList?.scanned?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ textAlign: "left" }}>SCANNED</td>
                <td colSpan={columns.length}></td>
              </tr>
            )}
            {tagAuditReportList?.scanned?.length > 0 &&
              tagAuditReportList?.scanned?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} style={{ textAlign: column?.text_align }}>
                      {column.isCurrency ? (
                        <CurrencyDisplay value={item[column.accessor]} />
                      ) : column.decimal_places ? (
                        parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                      ) : (
                        item[column.accessor]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            {tagAuditReportList?.scanned?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td>Total</td>
                {columns?.map((column, index) => {
                  console.log(column);
                  
                  return (
                    index !== 0 && (
                      <td key={index} style={{ textAlign: column?.text_align }}>
                        {column.is_total_req ? (
                          column.isCurrency ? (
                            <CurrencyDisplay
                              value={calculateTotal(column.accessor, tagAuditReportList?.scanned)}
                            />
                          ) : (
                            calculateTotal(column.accessor, tagAuditReportList?.scanned, column?.decimal_places)
                          )
                        ) : (
                          ""
                        )}
                      </td>
                    )
                  );
                })}
              </tr>
            )}
            {tagAuditReportList?.unscanned?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan={columns.length}>UN-SCANNED</td>
              </tr>
            )}
            {tagAuditReportList?.unscanned?.length > 0 &&
              tagAuditReportList?.unscanned?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} style={{ textAlign: column?.text_align }}>
                      {column.isCurrency ? (
                        <CurrencyDisplay value={item[column.accessor]} />
                      ) : column.decimal_places ? (
                        parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                      ) : (
                        item[column.accessor]
                      )}
                    </td>
                  ))}
                </tr>
              ))}

            {tagAuditReportList?.unscanned?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td>Total</td>
                {columns?.map((column, index) => {
                  return (
                    index !== 0 && (
                      <td key={index} style={{ textAlign: column?.text_align }}>
                        {column.is_total_req ? (
                          column.isCurrency ? (
                            <CurrencyDisplay
                              value={calculateTotal(column.accessor, tagAuditReportList?.unscanned)}
                            />
                          ) : (
                            calculateTotal(column.accessor, tagAuditReportList?.unscanned, column?.decimal_places)
                          )
                        ) : (
                          ""
                        )}
                      </td>
                    )
                  );
                })}
              </tr>
            )}
            {tagAuditReportList?.scanned?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan={2}>Scanned</td>
                <td  colSpan={columns?.length - 2}>{tagAuditReportList?.scanned?.length}</td>
              </tr>
            )}
            {tagAuditReportList?.unscanned?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan={2}>UnScanned</td>
                <td colSpan={columns?.length - 2}>{tagAuditReportList?.unscanned?.length}</td>
              </tr>
            )}

          </tbody>

          <tfoot></tfoot>
        </table>
      </div>
    </div>
  );
};

export default TagAuditPrintTable;
