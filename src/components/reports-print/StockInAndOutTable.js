import React from "react";
import CurrencyDisplay from "../common/moneyFormat/moneyFormat";
import styled from "styled-components";
export const Styles = styled.div`
  padding: 2vh 0.75vw;
  .table-wrapper {
    overflow-x: auto; /* Enable horizontal scrolling */
    width: 100%;
  }
  table {
    width: 100%;
    min-width: 1000px; /* Ensures scrolling on smaller screens */
    border-spacing: 2px;
    border: 1px solid #e1e1e1;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      border-bottom: 1px solid #e1e1e1;
    }
  }
`;

const StockInAndOutTable = ({ stockInAndOutReportList, columns, calculateTotal }) => {
  return (
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

      {stockInAndOutReportList?.data?.stock &&
        Object.entries(stockInAndOutReportList.data.stock).map(([section, items]) => {
          return (
            <React.Fragment key={section}>
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ textAlign: "left" }} colSpan={columns.length}>{section}</td>
              </tr>
              {items?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} style={{ textAlign: column?.text_align }}>
                      { item[column.accessor] == 0 ? '' :column.isCurrency ? (
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
              {items.length > 0 && (
                <tr style={{ fontWeight: "bold" }}>
                  <td>SUB TOTAL</td>
                  {columns?.map((column, index) => {
                    return (
                      index !== 0 && (
                        <td key={index} style={{ textAlign: column?.text_align }}>
                          {column.is_total_req ? (
                           calculateTotal(column.accessor, items) == 0 ? '' : column.isCurrency ? (
                              <CurrencyDisplay
                                value={calculateTotal(column.accessor, items)}
                              />
                            ) : (
                              calculateTotal(column.accessor, items)
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
            </React.Fragment>
          );
        })}


      {stockInAndOutReportList?.BasedOnWeightRange &&
        Object.entries(stockInAndOutReportList?.BasedOnWeightRange).map(([section, products]) => {
          return (
            <React.Fragment key={section}>
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ textAlign: "left" }} colSpan={columns.length}>{section}</td>
              </tr>
              {Object.entries(products).map(([rowIndex, item]) => {
                return (
                  <React.Fragment key={rowIndex}>
                    <tr style={{ fontWeight: "bold" }}>
                      <td style={{ textAlign: "left" }} colSpan={columns.length}>{rowIndex}</td>
                    </tr>

                          {item?.map((subItem, subIndex) => (
                            <tr key={subIndex}>
                              <td style={{ textAlign: "left" }}>{subItem['product_name']}-{subItem['weight_range_name']} </td>
                              {columns.map((column, colIndex) => {
                                if (column.accessor != 'product_name') {
                                  return (
                                    <td key={colIndex} style={{ textAlign: column?.text_align }}>
                                      { subItem[column.accessor] == 0 ? '' :column.isCurrency ? (
                                        <CurrencyDisplay value={subItem[column.accessor]} />
                                      ) : column.decimal_places ? (
                                        parseFloat(subItem[column.accessor]).toFixed(column.decimal_places)
                                      ) : (
                                        subItem[column.accessor]
                                      )}
                                    </td>
                                  )
                                }
                              }

                              )}
                            </tr>
                          ))}
                          {item.length > 0 && (
                            <tr style={{ fontWeight: "bold" }}>
                              <td>SUB TOTAL</td>
                              {columns?.map((column, index) => {
                                return (
                                  index !== 0 && (
                                    <td key={index} style={{ textAlign: column?.text_align }}>
                                      {column.is_total_req ? (
                                        calculateTotal(column.accessor, item) == 0 ? '' : column.isCurrency ? (
                                          <CurrencyDisplay
                                            value={calculateTotal(column.accessor, item)}
                                          />
                                        ) : (
                                          calculateTotal(column.accessor, item)
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
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}

      {stockInAndOutReportList?.grant_total &&(
                                                  <tr style={{ fontWeight: "bold" }}>
                                                      <td>GRAND TOTAL</td>
                                                      {columns?.map((column, index) => {
                                                        return (
                                                          index !== 0 && (
                                                            <td key={index} style={{ textAlign: column?.text_align }}>
                                                              {column.is_total_req ? (
                                                                stockInAndOutReportList?.grant_total[column.accessor] == 0 ? '' :column.isCurrency ? (
                                                                  <CurrencyDisplay
                                                                    value={stockInAndOutReportList?.grant_total[column.accessor]}
                                                                  />
                                                                ) : (
                                                                  stockInAndOutReportList?.grant_total[column.accessor]
                                                                )
                                                              ) : (
                                                                ""
                                                              )}
                                                            </td>
                                                          )
                                                        );
                                                      })}
                                                    </tr>
      )
      
      }

    </tbody>

    <tfoot></tfoot>
  </table>
  );
};

export default StockInAndOutTable;
