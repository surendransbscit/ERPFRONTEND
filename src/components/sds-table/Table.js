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
} from "../Component";
import ListTablePaginationComponent from "../../pages/listing/TablePagination";

export function Table({
  columns,
  data,
  modal,
  setModal,
  loading,
  isAddReq,
  tableHeader,
  currentPage,
  totalPages,
  paginate,
  showPagination,
}) {
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

  const { headerGroups, prepareRow, page } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 30, pageIndex: 0, sortBy: [{}] },
      defaultColumn,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExportData,
    useExpanded,
    usePagination,
    useRowSelect
  );

  return (
    <>
      {data?.length === 0 ? (
        <>
          {" "}
          <Block>
            {/* <span className="justify-content center">
              {" "} */}
            {loading === true ? (
              <Loading />
            ) : (
            
              <DataTable className="card-stretch">
                {tableHeader ? tableHeader : <></>}
                <DataTableBody bodyclass="nk-tb-tnx">
                  <DataTableHead className="nk-tb-item">
                    {headerGroups[0]?.headers?.map((header, index) => {
                      return (
                        <DataTableRow key={index}>
                          <span className="ff-base fw-bold"> {header.render("Header")}</span>
                        </DataTableRow>
                      );
                    })}
                  </DataTableHead>
                </DataTableBody>

                <span className="justify-content center">
                  <PreviewAltCard>No Data Found</PreviewAltCard>
                </span>
              </DataTable>
              
            )}
            {/* </span>{" "} */}
          </Block>
        </>
      ) : (
        <>
          <Block>
            <DataTable className="card-stretch">
              {tableHeader ? tableHeader : <></>}

              <DataTableBody bodyclass="nk-tb-tnx">
                <DataTableHead className="nk-tb-item">
                  {headerGroups[0]?.headers?.map((header, index) => {
                    return (
                      <DataTableRow key={index}>
                        <span className="ff-base fw-bold"> {header.render("Header")}</span>
                      </DataTableRow>
                    );
                  })}
                </DataTableHead>

                {page?.length > 0
                  ? page?.map((item, idx) => {
                      prepareRow(item);
                      return (
                        <DataTableItem key={idx}>
                          {item.cells.map((cell, i) => {
                            return (
                              <DataTableRow size="md" key={i}>
                                <span>{cell.render("Cell")}</span>
                              </DataTableRow>
                            );
                          })}
                        </DataTableItem>
                      );
                    })
                  : null}
              </DataTableBody>
              <PreviewAltCard>
                {showPagination && data?.length > 0 ? (
                  <ListTablePaginationComponent totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
                ) : (
                  <div className="text-center">
                    <span className="text-silent">No data found</span>
                  </div>
                )}
              </PreviewAltCard>
            </DataTable>
          </Block>
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
}
