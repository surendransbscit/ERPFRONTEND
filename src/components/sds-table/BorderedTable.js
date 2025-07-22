import React, { useEffect } from "react";
import { Modal, ModalBody } from "reactstrap";
import Loading from "../erp-loading/erp-loader";
import { useExportData } from "react-table-plugins";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
  useRowSelect,
  useExpanded,
} from "react-table";
import {
  Block,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  PreviewAltCard,
  DataTableBody,
  DataTable,
  Icon,
} from "../Component";
import ListTablePaginationComponent from "../../pages/listing/TablePagination";

const BorderedTable = ({
  columns,
  data,
  modal,
  setModal,
  header_align,
  loading,
  isAddReq,
  tableHeader,
  currentPage,
  totalPages,
  paginate,
  showPagination,
}) => {
  useEffect(() => {
    if (modal === true) {
      setTimeout(() => setModal(false), 2000);
    }
  }, [modal, setModal]);

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
    state: { expanded },
  } = useTable(
    {
      columns,
      enableGrouping: true,
      data,
      initialState: {
        pageSize: 30,
        pageIndex: 0,
        sortBy: [{}],
        expanded: {},
      },
      defaultColumn,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useExportData
  );
  return (
    <>
      {data?.length == 0 ? (
        <>
          {" "}
          {loading === true ? (
            <Loading />
          ) : (
            <>
              {/* {tableHeader ? tableHeader : <></>} */}
              <div className="dataTables_wrapper">
                <table {...getTableProps()} className="react_table table-bordered">
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            style={{
                              background: "#fff",
                              position: "sticky",
                              top: 0,
                              boxShadow: "inset 0px 1px 0px 0px #fff",
                              textAlign: header_align,
                              padding: "0.25rem",
                              fontWeight: "500",
                            }}
                          >
                            {column?.render("Header")}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                </table>
              </div>

              <span className="m-4 justify-content center">No Data Found</span>
            </>
          )}
        </>
      ) : (
        <>
          <>
            {tableHeader ? tableHeader : <></>}
            <div className="dataTables_wrapper">
              <table {...getTableProps()} className="react_table table-bordered">
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          style={{
                            background: "#fff",
                            position: "sticky",
                            top: 0,
                            boxShadow: "inset 0px 1px 0px 0px #fff",
                            textAlign: header_align,
                            padding: "0.25rem",
                            fontWeight: "500",
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
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page?.length > 0
                    ? page?.map((row, i) => {
                        prepareRow(row);

                        return (
                          <React.Fragment key={i}>
                            <tr {...row.getRowProps()}>
                              {row.cells.map((cell) => (
                                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                              ))}
                            </tr>
                          </React.Fragment>
                        );
                      })
                    : null}
                </tbody>
              </table>
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
      )}

      <Modal isOpen={modal} className="modal-dialog-centered text-center" size="sm">
        <ModalBody className="text-center m-2">
          <h5>Copied to clipboard</h5>
        </ModalBody>
        <div className="p-3 bg-light">
          <div className="text-center">Copied {data?.length} rows to clipboard</div>
        </div>
      </Modal>
    </>
  );
};

export default BorderedTable;
