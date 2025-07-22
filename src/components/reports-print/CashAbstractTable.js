import React from "react";
import CurrencyDisplay from "../common/moneyFormat/moneyFormat";

const CashAbstractTable = ({ cashAbstractReportList, columns, calculateTotal, ref }) => {
  return (
    <div>
      <div className="table-responsive dataTables_wrapper" ref={ref}>
        <table className="table-wrapper react_table">
          <thead>
            <tr>
              {columns?.map((column, index) => (
                <th key={index} style={{ textAlign: column?.textAlign }}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cashAbstractReportList?.sales_data?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ textAlign: "left" }}>SALES</td>
                <td colSpan={columns.length}></td>
              </tr>
            )}
            {cashAbstractReportList?.sales_data?.length > 0 &&
              cashAbstractReportList?.sales_data?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} style={{ textAlign: column?.textAlign }}>
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
            {cashAbstractReportList?.sales_data?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td>Total</td>
                {columns?.map((column, index) => {
                  return (
                    index !== 0 && (
                      <td key={index} style={{ textAlign: column?.textAlign }}>
                        {column.isTotalReq ? (
                          column.isCurrency ? (
                            <CurrencyDisplay
                              value={calculateTotal(column.accessor, cashAbstractReportList?.sales_data)}
                            />
                          ) : (
                            calculateTotal(column.accessor, cashAbstractReportList?.sales_data)
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
            {cashAbstractReportList?.sales_return?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan={columns.length}>SALES RETURN</td>
              </tr>
            )}
            {cashAbstractReportList?.sales_return?.length > 0 &&
              cashAbstractReportList?.sales_return?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} style={{ textAlign: column?.textAlign }}>
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

            {cashAbstractReportList?.sales_return?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td>Total</td>
                {columns?.map((column, index) => {
                  return (
                    index !== 0 && (
                      <td key={index} style={{ textAlign: column?.textAlign }}>
                        {column.isTotalReq ? (
                          column.isCurrency ? (
                            <CurrencyDisplay
                              value={calculateTotal(column.accessor, cashAbstractReportList?.sales_return)}
                            />
                          ) : (
                            calculateTotal(column.accessor, cashAbstractReportList?.sales_return)
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
            {cashAbstractReportList?.purchase_data?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan={columns.length}>PURCHASE</td>
              </tr>
            )}
            {cashAbstractReportList?.purchase_data?.length > 0 &&
              cashAbstractReportList?.purchase_data?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                      {column.isCurrency ? (
                        <CurrencyDisplay value={item[column.accessor]} />
                      ) : column.decimal_places ? (
                        isNaN(parseFloat(item[column.accessor]).toFixed(column.decimal_places)) ? (
                          item[column.accessor]
                        ) : (
                          parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                        )
                      ) : (
                        item[column.accessor]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            {cashAbstractReportList?.purchase_data?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td>Total</td>
                {columns?.map((column, index) => {
                  return (
                    index !== 0 && (
                      <td key={index} style={{ textAlign: column?.textAlign }}>
                        {column.isTotalReq ? (
                          column.isCurrency ? (
                            <CurrencyDisplay
                              value={calculateTotal(column.accessor, cashAbstractReportList?.purchase_data)}
                            />
                          ) : (
                            calculateTotal(column.accessor, cashAbstractReportList?.purchase_data)
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
            {cashAbstractReportList?.sales_summary?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ textAlign: "left" }}>CASH ABSTRACT</td>
                <td colSpan={columns.length}></td>
              </tr>
            )}
            {cashAbstractReportList?.sales_summary?.length > 0 &&
              cashAbstractReportList?.sales_summary?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  <td style={{ textAlign: "left" }}>{item.lable}</td>
                  <td></td>
                  <td></td>
                  <td style={{ textAlign: "right" }}>{<CurrencyDisplay value={item.value} />}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}

            {cashAbstractReportList?.sales_summary?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ textAlign: "left" }}>TOTAL</td>
                <td></td>
                <td></td>
                <td style={{ textAlign: "right" }}>
                  {<CurrencyDisplay value={cashAbstractReportList?.total_sale_inward} />}
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )}

            {cashAbstractReportList?.payment_summary?.length > 0 &&
              cashAbstractReportList?.payment_summary?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  <td style={{ textAlign: "left" }}>{item.lable}</td>
                  <td></td>
                  <td></td>
                  <td style={{ textAlign: "right" }}>{<CurrencyDisplay value={item.value} />}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}

            {cashAbstractReportList?.payment_summary?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ textAlign: "left" }}>TOTAL</td>
                <td></td>
                <td></td>
                <td style={{ textAlign: "right" }}>
                  <CurrencyDisplay value={cashAbstractReportList?.total_payment} />
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )}
          </tbody>

          <tfoot></tfoot>
        </table>
      </div>
    </div>
  );
};

export default CashAbstractTable;
