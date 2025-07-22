import React, { useEffect, useRef } from "react";
import { Button } from "reactstrap";
import Loading from "../erp-loading/erp-loader";
import { Icon } from "../Component";
import styled from "styled-components";
import JsPDF from "jspdf";
import { useExportData } from "react-table-plugins";
import Papa from "papaparse/papaparse.min";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useRowSelect,
  useExpanded,
  useGroupBy,
} from "react-table";
import ListTablePaginationComponent from "../../pages/listing/TablePagination";
import CopyToClipboard from "react-copy-to-clipboard";
import "../../assets/css/datatable.css";
import { useNavigate } from "react-router";
import CurrencyDisplay from "../common/moneyFormat/moneyFormat";

const summaryData = {
  Cash: "1000",
  Card: "2000",
};

export const Styles = styled.div`
  padding: 2vh 0.75vw;
  .table-wrapper {
    overflow-x: auto; /* Enable horizontal scrolling */
    width: 100%;
  }
  table {
    width: 100%;
    min-width: 1000px; /* Ensures scrolling on smaller screens */
    border-spacing: 0;
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
      margin: 0;
      padding: 0px 5px;
      border-bottom: 1px solid #e1e1e1;
      border-right: 0px solid black;
      font-size: medium;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);
useEffect(() => {
    setValue(globalFilter);
}, [globalFilter])
  return (
    <div className="form-control-wrap">
      <div className="form-icon form-icon-right">
        <Icon name="search"></Icon>
      </div>
      <input
        className="form-control"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={count === 0 ? `No Records` : ` Search...`}
      />
    </div>
  );
}

function getExportFileBlob({ columns, data, fileType, fileName }) {
  if (fileType === "csv") {
    const headerNames = columns.map((col) => col.exportValue);
    const csvString = Papa.unparse({ fields: headerNames, data });
    return new Blob([csvString], { type: "text/csv" });
  }
  if (fileType === "pdf") {
    const headerNames = columns.map((column) => column.exportValue);
    const doc = new JsPDF();
    doc.autoTable({
      head: [headerNames],
      body: data,
      margin: { top: 20 },
      styles: {
        minCellHeight: 12,
        halign: "left",
        valign: "center",
        fontSize: 7,
      },
    });
    doc.save(`${fileName}.pdf`);

    return false;
  }
}

export function Table({
  columns,
  data,
  showPagination,
  exportName,
  routelink,
  loading,
  header_align,
  groupingColumns,
  totalPages,
  currentPage,
  paginate,
  isGrouping,
  FilterComponent,
  pageTitle,
  is_filter_req,
  isTotalReq,
  allowAdd,
  allowPrint,
  allowExport,
  isAddReq,
  addButtonDisable,
  addPageURL,
  itemPerPage,
  SetItemPerPage,
  toggleFilterModal,
  exportExcel,
  // exportToPrint,
  togglePrintModal =()=>{},
  tableRef ='',
  setSearchValue,
  searchValue,
  disablePagination = false,
  toggleExportModal =()=>{}
}) {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: false,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    visibleColumns,
    page,
    preGlobalFilteredRows,
    setGlobalFilter,
    toggleAllRowsExpanded, 
    setPageSize, // Function to dynamically change page size
    state: { expanded },
  } = useTable(
    {
      columns,
      enableGrouping: true,
      data,
      getExportFileBlob,
      initialState: {
        groupBy: groupingColumns || [],
        pageSize: disablePagination === true ? 10000 : itemPerPage,
        pageIndex: 0,
        expanded: {},
      },
      defaultColumn,
    },
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useExportData
  );

  const navigate = useNavigate();

  useEffect(() => {
    toggleAllRowsExpanded(true);
  }, [data,columns, toggleAllRowsExpanded]);

  // useEffect(() => {
  //   setSearchValue(preGlobalFilteredRows);
  // }, [globalFilter]);

  function calculateSubTotal(rows, columnId) {
    return rows.reduce((sum, row) => sum + (Number(removeComma(row.values[columnId])) || 0), 0);
  }

  function calculateTotal(data, numericColumns) {
    const totals = {};
    numericColumns.forEach((column) => {
      totals[column] = data.reduce((sum, row) => sum + (Number(removeComma(row[column])) || 0), 0);
    });
    return totals;
  }

  function removeComma(value) {
    if (value) return value.toString().replace(/,/g, "");
    else {
      return value;
    }
  }

  const totals = calculateTotal(
    data,
    visibleColumns.map((col) => col.id)
  );

  const format_decimal = (cell) => {
    let formated = parseFloat(cell.value).toFixed(cell.column?.decimal_places);
    return !isNaN(cell.value) ? formated : cell.render("Cell");
  };

  const defaultRef = useRef(null);
  const resolvedRef = tableRef || defaultRef

  return (
    <>
      <>
        <div className="card-inner">
          <div className="card-title-group">
            <div className="toggle-wrap nk-block-tools-toggle">
              <h5>{pageTitle}</h5>
            </div>
            <div className="card-tools me-n1">
              <ul className="btn-toolbar gx-1">
                {isAddReq && (
                  <>
                    <li>
                      <label>
                        <Button
                          hidden={!allowAdd}
                          disabled={!addButtonDisable || !allowAdd}
                          className="toggle btn-icon d-md-none"
                          color="primary"
                          onClick={() => {
                            navigate(
                              {
                                pathname: `${process.env.PUBLIC_URL}${addPageURL}`,
                              },
                              {
                                state: { add: true },
                              }
                            );
                          }}
                        >
                          <Icon name="plus"></Icon>
                        </Button>
                        <Button
                          hidden={!allowAdd}
                          disabled={!addButtonDisable || !allowAdd}
                          className="toggle d-none d-md-inline-flex"
                          color="primary"
                          onClick={() => {
                            navigate(
                              {
                                pathname: `${process.env.PUBLIC_URL}${addPageURL}`,
                              },
                              {
                                state: { add: true },
                              }
                            );
                          }}
                        >
                          <Icon name="plus"></Icon>
                          <span>Create {pageTitle}</span>
                        </Button>
                      </label>
                    </li>
                    <li className="btn-toolbar-sep"></li>
                  </>
                )}
                <li className="">
                  <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter ={searchValue} setGlobalFilter={(searchValue)=>{
                    setGlobalFilter(searchValue);
                    setSearchValue(searchValue);
                  }} />
                </li>
                <li className="btn-toolbar-sep"></li>
                <li>
                  <div className="dt-buttons btn-group flex-wrap">
                    {/* <CopyToClipboard text={JSON.stringify(data)}>
                      <Button className="buttons-copy buttons-html5">
                        <span></span>
                      </Button>
                    </CopyToClipboard>{" "} */}
                    <button className="btn btn-secondary buttons-copy  buttons-html5" type="button"   onClick={() => toggleExportModal()}>
                    <i class="bi bi-layout-text-window-reverse"></i>
                      <span>Column Visiblity</span>
                    </button>{" "}
                    <button className="btn btn-secondary buttons-print buttons-html5" type="button" disabled={!allowPrint}  onClick={() => togglePrintModal()}>
                      <span>print</span>
                    </button>{" "}
                    <button
                     disabled={!allowExport}
                      className="btn btn-secondary buttons-excel buttons-html5"
                      type="button"
                         onClick={() => exportExcel()}
                    >
                      <span>Excel</span>
                    </button>{" "}
                  </div>
                </li>
                <li>
                  <label>
                    <div className="form-control-select">
                      {" "}
                      <select
                        name="DataTables_Table_0_length"
                        className="custom-select custom-select-sm form-control form-control-sm"
                        onChange={(e) => {
                          setPageSize(e.target.value) 
                          SetItemPerPage(e.target.value)}}
                        value={itemPerPage}
                      >
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                        <option value={500}>500</option>
                      </select>{" "}
                    </div>
                  </label>
                </li>
                {is_filter_req && (
                  <>
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <div className="btn btn-trigger btn-icon dropdown-toggle" onClick={toggleFilterModal}>
                        <div className="dot dot-primary"></div>
                        Filters<Icon name="filter-alt"></Icon>
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="dataTables_wrapper"  ref={resolvedRef} >
          <div className="table-wrapper" style={{ overflowX: "auto", width: "100%" }}>
            <table {...getTableProps()} className="react_table">
              <thead>
                {headerGroups?.map((headerGroup, headerGroupIDX) => {
                  // console.log(headerGroup);
                  
                  return(
                  <tr key={headerGroup.id ?? headerGroupIDX} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup?.headers?.map((column) => {
                      return (<>
                        {column?.isGrouped==false && (
                            <th
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            style={{
                              background: "#fff",
                              position: "sticky",
                              top: 0,
                              boxShadow: "inset 0px 1px 0px 0px #fff",
                              textAlign: column?.text_align,
                              padding: "0.25rem",
                              fontWeight: "500",
                              color: "#364a63"
                            }}
                          >
                            {column?.render("Header")}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <Icon name="chevron-down-c" />
                                ) : (
                                  <Icon name="chevron-up-c" />
                                )
                              ) : (
                                ""
                              )}
                            </span>
                          </th>
                        )}
                      </>) 
                    }
                    )
                    }
                  </tr>
                )
})}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page?.map((row, i) => {
                  prepareRow(row);
                  if (row.isGrouped) {
                    return (
                      <React.Fragment key={i}>
                        <tr
                          {...row.getRowProps()}
                          {...row.getToggleRowExpandedProps()}
                          style={{ cursor: "pointer", fontWeight: "bold" }}
                        >
                          <td colSpan={visibleColumns.length - groupingColumns.length} style={{ textAlign: "left", width: row.column?.width,color: (groupingColumns.findIndex(col => col == row.groupByID) == 0) ? "rgb(246, 104, 9)" : "rgb(76,5,249)" }}>
                            {row.groupByVal}
                          </td>
                         
                        </tr>
                        {row.isExpanded &&
                          row.subRows?.map((subRow, j) => {
                            prepareRow(subRow);
                            // console.log(subRow);
                            
                            if (!subRow.canExpand) {
                             
                              return (
                                <tr  key={subRow.id ?? j} {...subRow.getRowProps()}>
                                  {/* <td colSpan={groupingColumns.length}></td> */}
                                  {subRow.cells.map((cell) => {
                                    if (!groupingColumns.includes(cell.column.id)) {
                                        return (
                                        <td
                                          {...cell.getCellProps()}
                                          style={{ textAlign: cell.column?.text_align, width: cell.column?.width}}
                                        >
                                          {(cell.column.id == "sno") ? parseInt(j)+1: 
                                            cell.column?.is_money_format ? (
                                              <CurrencyDisplay value={Number(cell.value)} />
                                            ) : cell.column?.decimal_places ? (
                                              format_decimal(cell)
                                            ) : (
                                              cell.render("Cell")
                                            )
                                          }
                                        </td>

                                      )
                                    }})}
                                </tr>
                              );
                            }
                          })}

                        {row.isExpanded && row.canExpand && row.depth > 0 && (
                          
                            <tr>
                            {visibleColumns?.map((column, index) => {
                              return (
                              <>
                                {column?.isGrouped==false && (
                                    <td key={column.id} style={{ fontWeight: "bold", textAlign: column?.text_align,color: "rgb(0, 128, 0)" }}>
                                    {index == groupingColumns.length ? "SUB TOTAL" : ""}
                                    {column?.is_total_req   ? (
                                      column?.is_money_format ? (
                                        <CurrencyDisplay value={parseFloat( calculateSubTotal(row.subRows, column.id)).toFixed(column?.decimal_places)} />
                                      ) : (
                                        parseFloat( calculateSubTotal(row.subRows, column.id)).toFixed(column?.decimal_places)
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </td>
                                )}
                              </>
                              )
                              
                            })}
                          </tr>
                        )}

                        { (row.isExpanded && row.canExpand &&  groupingColumns.length == 1) && (
                            <tr>
                            {visibleColumns?.map((column, index) =>{
                              return (
                              <>
                                {column?.isGrouped==false && (
                              <td key={column.id} style={{ fontWeight: "bold", textAlign: column?.text_align,color: "rgb(0, 128, 0)" }}>
                                {groupingColumns.length == index ? "SUB TOTAL" : ""}
                                {column?.is_total_req ? (
                                  column?.is_money_format ? (
                                    <CurrencyDisplay value={parseFloat( calculateSubTotal(row.subRows, column.id)).toFixed(column?.decimal_places)} />
                                  ) : (
                                    parseFloat(calculateSubTotal(row.subRows, column.id)).toFixed(column?.decimal_places)
                                  )
                                ) : (
                                  ""
                                )}
                              </td>
                                )}
                              </>
                              )
                            }
                            )}
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  }
                  if (!isGrouping) {
                     console.log("subRow", row);
                    return (
                      <tr {...row.getRowProps()} style={{color: row?.original?.row_colour}}>
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            style={{ textAlign: cell.column?.text_align, width: cell.column?.width }}
                          >
                            {cell.column?.is_money_format ? (
                              <CurrencyDisplay value={Number(cell.value)} />
                            ) : cell.column?.decimal_places ? (
                              format_decimal(cell)
                            ) : (
                              cell.render("Cell")
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  }
                })}
                { (isTotalReq && groupingColumns.length  == 0)  && (
                  <tr>
                    {visibleColumns?.map((column, index) => (
                      <td key={column.id} style={{ fontWeight: "bold", textAlign: column?.text_align,color: "RGB(133, 79, 255)" }}>
                        {index === 0 ? "TOTAL" : ""}
                        {column?.is_total_req ? (
                          column?.is_money_format ? (
                            <CurrencyDisplay value={parseFloat(totals[column.id]).toFixed(column?.decimal_places)} />
                          ) : column?.is_total_money_format ?  (
                            <CurrencyDisplay value={parseFloat(totals[column.id]).toFixed(column?.decimal_places)} />
                          ) : column?.total_decimal_places ?  (
                            parseFloat(totals[column.id]).toFixed(column?.total_decimal_places)
                          )
                          : (
                            parseFloat(totals[column.id]).toFixed(column?.decimal_places)
                          )
                        ) : (
                          ""
                        )}
                      </td>
                    ))}
                  </tr>
                )}
                {(isTotalReq && groupingColumns.length  > 0)  && (
                  <tr>
                    {visibleColumns?.map((column, index) => {

                      return (
                        <>
                        {column?.isGrouped==false && (
                      <td key={column.id} style={{ fontWeight: "bold", textAlign: column?.text_align,color: "RGB(133, 79, 255)" }}>
                        {groupingColumns.length == index ? "TOTAL" : ""}
                        {column?.is_total_req ? (
                          column?.is_money_format ? (
                            <CurrencyDisplay value={parseFloat(totals[column.id]).toFixed(column?.decimal_places)} />
                          ) : column?.is_total_money_format ?  (
                            <CurrencyDisplay value={parseFloat(totals[column.id]).toFixed(column?.decimal_places)} />
                          ) : column?.total_decimal_places ?  (
                            parseFloat(totals[column.id]).toFixed(column?.total_decimal_places)
                          )
                          : (
                            parseFloat(totals[column.id]).toFixed(column?.decimal_places)
                          )
                        ) : (
                          ""
                        )}
                      </td>
                      )}
                      </>
                      )
                    }
                    )}
                  </tr>
                 )}
              </tbody>
              {/* {summaryData && (
              <tfoot>
                {Object.keys(summaryData).map((key, index) => (
                  <tr key={index}>
                    <td colSpan="2">{key} Total:</td>
                    <td>{summaryData[key]}</td>
                  </tr>
                ))}
              </tfoot>
            )}  */}
            </table>
          </div>
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          {showPagination && data.length > 0 ? (
            <ListTablePaginationComponent totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
          ) : (
            <div className="d-flex justify-content-center mt-3">{loading === true ? <Loading /> : <></>}</div>
          )}
        </div>
      </>
    </>
  );
}
