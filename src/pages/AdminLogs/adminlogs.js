import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import JsPDF from "jspdf";
import moment from "moment";
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
  // useExportData
} from "react-table";
import { Block, BlockTitle, Icon } from "../../components/Component";
import { Card, Button, Row, Col } from "reactstrap";
import { useLocation } from "react-router";
import Loading from "../../components/erp-loading/erp-loader";
import { getAdminLogs } from "../../redux/thunks/coreComponent";

const Styles = styled.div`
  padding: 2vh 0.75vw;
  table {
    width: 100%;
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
      padding: 5px 5px;
      border-bottom: 1px solid #e1e1e1;
      border-right: 0px solid black;
      font-size: medium;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

const AdminLogs = () => {
  const location = useLocation();
  const path = location?.pathname;
  let dispatch = useDispatch();
  const [firstDate, setFirstDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [lastDate, setLastDate] = useState(new Date());
  const [tableData, setTableData] = useState([]);
  // const adminLogsData = useSelector((state) => state.fetchAdminLogs);
  const { adminLogsList, loading } = useSelector(
    (state) => state.coreCompReducer
  );

  // const { adminLogs, loading, error } = adminLogsList;
  console.log(adminLogsList);
  const fdate = ("0" + firstDate.getDate()).slice(-2);
  const fmonth = ("0" + (firstDate.getMonth() + 1)).slice(-2);
  const fyear = firstDate.getFullYear();
  const start = `${fyear}-${fmonth}-${fdate}`;

  const ldate = ("0" + lastDate.getDate()).slice(-2);
  const lmonth = ("0" + (lastDate.getMonth() + 1)).slice(-2);
  const lyear = lastDate.getFullYear();
  const last = `${lyear}-${lmonth}-${ldate}`;
  // (loading==false && setTableData(adminLogs.data))
  // console.log(loading);

  const offset = moment().utcOffset();

  const columns = React.useMemo(() => [
    {
      // Make an expander cell
      Header: "#", // No header
      id: "expander", // It needs an ID
      Cell: ({ row }) => (
        // Use Cell to render an expander for each row.
        // We can use the getToggleRowExpandedProps prop-getter
        // to build the expander.

        <span>
          {row.isExpanded ? (
            <>
              {" "}
              <Icon name="caret-up-fill"></Icon>{" "}
            </>
          ) : (
            <>
              {" "}
              <Icon name="caret-down-fill"></Icon>{" "}
            </>
          )}
        </span>
      ),
    },
    {
      Header: "Log ID",
      accessor: "id",
    },
    {
      Header: "Changed Instance",
      accessor: "object_repr",
    },
    {
      Header: "Action",
      accessor: "action",
    },

    {
      Header: "User",
      accessor: "username",
    },
    {
      Header: "DateTime",
      accessor: "date_created",
      disableSortBy: true,
      Cell: (cell) => (
        <>
          {moment(cell.cell.row.original.date_created).format(
            "MMMM Do YYYY, h:mm:ss a"
          )}
        </>
      ),
      // disableSortBy: true,
      sortType: (a, b) => {
        var a1 = new Date(a).getTime();
        var b1 = new Date(b).getTime();
        if (a1 < b1) return 1;
        else if (a1 > b1) return -1;
        else return 0;
      },
    },

    {
      Header: "Ip address",
      accessor: "ip_address",
    },

    {
      Header: "Device",
      accessor: "user_agent",
    },
  ]);

  const getData = async () => {
    try {
      const fdate = ("0" + firstDate.getDate()).slice(-2);
      const fmonth = ("0" + (firstDate.getMonth() + 1)).slice(-2);
      const fyear = firstDate.getFullYear();
      const start = `${fyear}-${fmonth}-${fdate}`;

      const ldate = ("0" + lastDate.getDate()).slice(-2);
      const lmonth = ("0" + (lastDate.getMonth() + 1)).slice(-2);
      const lyear = lastDate.getFullYear();
      const last = `${lyear}-${lmonth}-${ldate}`;

      let passData = {
        start: start,
        last: last,
        offset: offset,
      };

      await dispatch(getAdminLogs(passData));
      // await setTableData(adminLogs.data);

      // console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const renderRowSubComponent = React.useCallback(
  //   ({ row }) => (
  //     <table
  //       style={{
  //         marginLeft: "auto",
  //         marginRight: "auto",
  //         width: "98%",
  //         overflowX: "auto",
  //         background: "#00000005",
  //         whiteSpace: "break-spaces",
  //         textAlign: "center",
  //       }}
  //     >
  //       <thead>
  //         <tr>
  //           <th style={{ minWidth: "25vh" }}>Instance ID</th>
  //           <th>Changed Data</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         <tr>
  //           <td style={{ padding: "0px 0px" }}>{row.original.object_id}</td>
  //           <td style={{ padding: "0px 0px" }}>
  //             {JSON.stringify(row.original.changed_data)}
  //           </td>
  //         </tr>
  //       </tbody>
  //     </table>
  //   ),
  //   []
  // );

  const renderRowSubComponent = React.useCallback(
    ({ row }) => {
      const changedData = row.original.changed_data;

      return (
        <table
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            width: "98%",
            background: "#00000005",
            textAlign: "left",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Field</th>
              <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Old Value</th>
              <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>New Value</th>
            </tr>
          </thead>
          <tbody>
            {changedData && typeof changedData === "object" ? (
              Object.entries(changedData).map(([field, values], index) => (
                <tr key={index}>
                  <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{field}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                    {values["old value"] !== null ? values["old value"].toString() : "—"}
                  </td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                    {values["new value"] !== null ? values["new value"].toString() : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: "8px", textAlign: "center" }}>
                  No Changes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    },
    []
  );


  function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
      setGlobalFilter(value || undefined);
    }, 200);

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
        // className='search-input'
        />
      </div>
    );
  }

  function getExportFileBlob({ columns, data, fileType, fileName }) {
    if (fileType === "csv") {
      // CSV example
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

  function Table({ columns, data, renderRowSubComponent }) {
    const defaultColumn = React.useMemo(
      () => ({
        // Let's set up our default Filter UI
        Filter: false,
      }),
      []
    );

    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      visibleColumns,
      exportData,
      page,
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      rows,
      previousPage,
      setPageSize,
      state: { pageIndex, pageSize, expanded },
      preGlobalFilteredRows,
      setGlobalFilter,
    } = useTable(
      {
        columns,
        data,
        getExportFileBlob,

        initialState: {
          pageSize: 30,
          pageIndex: 0,
          sortBy: [
            {
              id: "log_id",
              desc: true,
            },
          ],
        },
        defaultColumn,
      },
      useFilters,
      useGlobalFilter,
      useSortBy,
      useExportData,
      useExpanded,
      usePagination,
      useRowSelect
      //
    );

    const firstPageRows = rows.slice(0, 5);

    // Render the UI for your table
    return (
      <>
        {data.length == 0 ? (
          <div
            style={{
              display: "grid",
              placeContent: "center",
              fontSize: "large",
            }}
          >
            {" "}
            {loading == true ? (
              <Loading />
            ) : (
              <>No Results Found for Specified Dates</>
            )}{" "}
          </div>
        ) : (
          <>
            <Row className="mb-1">
              <Col xs>
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  // globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />{" "}
              </Col>
              <Col sm="6" md="7" lg="8"></Col>

              <Col xs>
                <select
                  className="form-control"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[5, 10, 20, 30, 40, 50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {`${pageSize} records`}
                    </option>
                  ))}
                </select>{" "}
              </Col>
            </Row>
            <div>
              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          style={{
                            background: "#fff",
                            position: "sticky",
                            top: 0,
                            zIndex: 998,
                            boxShadow: "inset 0px 1px 0px 0px #fff",
                          }}
                        >
                          {column.render("Header")}
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
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                  {page.map((row, i) => {
                    prepareRow(row);
                    return (
                      <React.Fragment key={i}>
                        <tr
                          {...row.getRowProps()}
                          {...row.getToggleRowExpandedProps()}
                        >
                          {row.cells.map((cell) => {
                            return (
                              <td {...cell.getCellProps()}>
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                        {row.isExpanded ? (
                          <tr>
                            <td colSpan={visibleColumns.length}>
                              {renderRowSubComponent({ row })}
                            </td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "0.5rem" }}>
              <span>
                <Button
                  className="mx-1"
                  outline
                  size="xs"
                  color="primary"
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                >
                  {" "}
                  <Icon name="chevrons-left" />
                </Button>

                <Button
                  className="mx-1"
                  outline
                  size="xs"
                  color="primary"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  {" "}
                  <Icon name="chevron-left" />{" "}
                </Button>

                <Button
                  className="mx-1"
                  outline
                  size="xs"
                  color="primary"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                >
                  {" "}
                  <Icon name="chevron-right" />{" "}
                </Button>

                <Button
                  className="mx-1"
                  outline
                  size="xs"
                  color="primary"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  {" "}
                  <Icon name="chevrons-right" />{" "}
                </Button>
              </span>
              <span style={{ right: "30vw", position: "absolute" }}>
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{" "}
              </span>
            </div>
          </>
        )}

        {/* </div> */}
      </>
    );
  }

  useEffect(() => {
    let passData = {
      start: start,
      last: last,
      offset: offset,
    };
    dispatch(getAdminLogs(passData));

    // getData();
  }, [dispatch, start, last, offset]);

  useEffect(() => {
    // setTableData(adminLogs.data)
  }, [loading]);

  return (
    <>
      <React.Fragment>
        <Head title="Admin Logs" />
        <Content>
          <BlockTitle tag="h6" className="fw-normal">
            Admin Logs
            <div
              style={{
                display: "flex",
                position: "absolute",
                marginTop: "3px",
                right: "1rem",
                top: "1.1rem",
              }}
            >
              <span
                className="mt-1 mr-1"
                style={{ position: "relative", zIndex: "999" }}
              >
                From
              </span>{" "}
              &nbsp;
              <span style={{ position: "relative", zIndex: "999" }}>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  selected={firstDate}
                  onChange={(date) => setFirstDate(date)}
                  style={{ display: "inline-flex" }}
                  className=" form-control date-picker"
                />
              </span>
              <span
                className="mt-1 mx-1"
                style={{ position: "relative", zIndex: "999" }}
              >
                {" "}
                To{" "}
              </span>{" "}
              <span style={{ position: "relative", zIndex: "999" }}>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  selected={lastDate}
                  onChange={(date) => setLastDate(date)}
                  className=" form-control date-picker"
                />{" "}
              </span>
              {/* <Button className="ml-1  form-control-md" outline color="primary" onClick={getData}>
                Filter
              </Button> */}
            </div>
          </BlockTitle>

          <Block size="lg">
            <Card
              style={{ overflow: "hidden", top: "14px" }}
              className="card-bordered card-preview"
            >
              <Styles>
                <Table
                  columns={columns}
                  data={adminLogsList ? adminLogsList : []}
                  renderRowSubComponent={renderRowSubComponent}
                />
              </Styles>
            </Card>
          </Block>
        </Content>
      </React.Fragment>
    </>
  );
};

export default AdminLogs;
