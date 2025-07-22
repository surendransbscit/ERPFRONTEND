import React from "react";
import CurrencyDisplay from "../common/moneyFormat/moneyFormat";

const SchemeAbstractTable = ({ schemeAbstractReportList, columns, modeWiseCollectionReportList, ref }) => {
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
            {schemeAbstractReportList?.schemes?.length > 0 &&
              schemeAbstractReportList?.schemes?.map((item, rowIndex) => (
                <>
                  <tr style={{ fontWeight: "bold" }}>
                    <td style={{ textAlign: "left" }}>{item?.scheme_name}</td>
                    <td colSpan={columns.length}></td>
                  </tr>
                  {item?.transactions?.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns?.map((column, colIndex) => (
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
                  <tr style={{ fontWeight: "bold" }}>
                    <td style={{ textAlign: "left" }}>Total</td>
                    <td></td>
                    <td style={{ textAlign: "left" }}>
                      {<CurrencyDisplay value={parseFloat(item?.sub_total?.amount).toFixed(3)} />}
                    </td>
                    <td></td>
                    <td style={{ textAlign: "left" }}>{parseFloat(item?.sub_total?.weight).toFixed(3)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ textAlign: "right" }}>
                      {<CurrencyDisplay value={parseFloat(item?.sub_total?.discount).toFixed(3)} />}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {<CurrencyDisplay value={parseFloat(item?.sub_total?.netamnt).toFixed(3)} />}
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                </>
              ))}
            {/* {schemeAbstractReportList?.schemes?.transactions?.length > 0 && (
                        <tr style={{ fontWeight: "bold" }}>
                          <td>Total</td>
                          {columns?.map((column, index) => {
                            return (
                              index !== 0 && (
                                <td key={index} style={{ textAlign: column?.textAlign }}>
                                  {column.isTotalReq ? (
                                    column.isCurrency ? (
                                      <CurrencyDisplay
                                        value={calculateTotal(
                                          column.accessor,
                                          schemeAbstractReportList?.schemes?.transactions
                                        )}
                                      />
                                    ) : (
                                      calculateTotal(column.accessor, schemeAbstractReportList?.schemes?.transactions)
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
                      {schemeAbstractReportList?.sales_return?.length > 0 && (
                        <tr style={{ fontWeight: "bold" }}>
                          <td colSpan={columns.length}>SALES RETURN</td>
                        </tr>
                      )}
                      {schemeAbstractReportList?.sales_return?.length > 0 &&
                        schemeAbstractReportList?.sales_return?.map((item, rowIndex) => (
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

                      {schemeAbstractReportList?.sales_return?.length > 0 && (
                        <tr style={{ fontWeight: "bold" }}>
                          <td>Total</td>
                          {columns?.map((column, index) => {
                            return (
                              index !== 0 && (
                                <td key={index} style={{ textAlign: column?.textAlign }}>
                                  {column.isTotalReq ? (
                                    column.isCurrency ? (
                                      <CurrencyDisplay
                                        value={calculateTotal(column.accessor, schemeAbstractReportList?.sales_return)}
                                      />
                                    ) : (
                                      calculateTotal(column.accessor, schemeAbstractReportList?.sales_return)
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
                      {schemeAbstractReportList?.purchase_data?.length > 0 && (
                        <tr style={{ fontWeight: "bold" }}>
                          <td colSpan={columns.length}>PURCHASE</td>
                        </tr>
                      )}
                      {schemeAbstractReportList?.purchase_data?.length > 0 &&
                        schemeAbstractReportList?.purchase_data?.map((item, rowIndex) => (
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
                      {schemeAbstractReportList?.purchase_data?.length > 0 && (
                        <tr style={{ fontWeight: "bold" }}>
                          <td>Total</td>
                          {columns?.map((column, index) => {
                            return (
                              index !== 0 && (
                                <td key={index} style={{ textAlign: column?.textAlign }}>
                                  {column.isTotalReq ? (
                                    column.isCurrency ? (
                                      <CurrencyDisplay
                                        value={calculateTotal(column.accessor, schemeAbstractReportList?.purchase_data)}
                                      />
                                    ) : (
                                      calculateTotal(column.accessor, schemeAbstractReportList?.purchase_data)
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
                      {schemeAbstractReportList?.sales_summary?.length > 0 && (
                        <tr style={{ fontWeight: "bold" }}>
                          <td style={{ textAlign: "left" }}>CASH ABSTRACT</td>
                          <td colSpan={columns.length}></td>
                        </tr>
                      )}
                      {schemeAbstractReportList?.sales_summary?.length > 0 &&
                        schemeAbstractReportList?.sales_summary?.map((item, rowIndex) => (
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

                      {schemeAbstractReportList?.sales_summary?.length > 0 && (
                        <tr style={{ fontWeight: "bold" }}>
                          <td style={{ textAlign: "left" }}>TOTAL</td>
                          <td></td>
                          <td></td>
                          <td style={{ textAlign: "right" }}>
                            {<CurrencyDisplay value={schemeAbstractReportList?.total_sale_inward} />}
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      )} */}

            {modeWiseCollectionReportList?.rows?.length > 0 &&
              modeWiseCollectionReportList?.rows?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  <td style={{ textAlign: "left" }}>{item.mode_name}</td>
                  <td></td>
                  <td style={{ textAlign: "right" }}>{<CurrencyDisplay value={item.payment_amount} />}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}

            {schemeAbstractReportList?.payment_summary?.length > 0 && (
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ textAlign: "left" }}>TOTAL</td>
                <td></td>
                <td></td>
                <td style={{ textAlign: "right" }}>
                  <CurrencyDisplay value={schemeAbstractReportList?.total_payment} />
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

export default SchemeAbstractTable;
