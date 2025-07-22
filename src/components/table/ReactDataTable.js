import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Row, Col } from "reactstrap";
import { DataTablePagination } from "../Component";
import exportFromJSON from "export-from-json";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Modal, ModalBody } from "reactstrap";

const Export = ({ data }) => {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (modal === true) {
      setTimeout(() => setModal(false), 2000);
    }
  }, [modal]);

  const fileName = "user-data";

  const exportCSV = () => {
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data, fileName, exportType });
  };

  const exportExcel = () => {
    const exportType = exportFromJSON.types.xls;
    exportFromJSON({ data, fileName, exportType });
  };

  const copyToClipboard = () => {
    setModal(true);
  };

  return (
    <React.Fragment>
      <div className="dt-export-buttons d-flex align-center">
        {/* <div className="dt-export-title d-none d-md-inline-block">Export</div> */}
        <div className="dt-buttons btn-group flex-wrap">
          <CopyToClipboard text={JSON.stringify(data)}>
            <Button className="buttons-copy buttons-html5" onClick={() => copyToClipboard()}>
              <span>Copy</span>
            </Button>
          </CopyToClipboard>{" "}
          <button className="btn btn-secondary buttons-csv buttons-html5" type="button" onClick={() => exportCSV()}>
            <span>CSV</span>
          </button>{" "}
          <button className="btn btn-secondary buttons-excel buttons-html5" type="button" onClick={() => exportExcel()}>
            <span>Excel</span>
          </button>{" "}
        </div>
      </div>
      <Modal isOpen={modal} className="modal-dialog-centered text-center" size="sm">
        <ModalBody className="text-center m-2">
          <h5>Copied to clipboard</h5>
        </ModalBody>
        <div className="p-3 bg-light">
          <div className="text-center">Copied {data.length} rows to clipboard</div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

const ExpandableRowComponent = ({ data }) => {
  return (
    <ul className="dtr-details p-2 border-bottom ms-1">
      <li className="d-block d-sm-none">
        <span className="dtr-title">Company</span> <span className="dtr-data">{data.company}</span>
      </li>
      <li className="d-block d-sm-none">
        <span className="dtr-title ">Gender</span> <span className="dtr-data">{data.gender}</span>
      </li>
      <li>
        <span className="dtr-title">Start Date</span> <span className="dtr-data">{data.startDate}</span>
      </li>
      <li>
        <span className="dtr-title">Salary</span> <span className="dtr-data">{data.salary}</span>
      </li>
    </ul>
  );
};

const CustomCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
  <div className="custom-control custom-control-sm custom-checkbox notext">
    <input id={rest.name} type="checkbox" className="custom-control-input" ref={ref} onClick={onClick} {...rest} />
    <label className="custom-control-label" htmlFor={rest.name} />
  </div>
));

const calculateFooter = (rows, selector) => {
  return rows.reduce((sum, row) => sum + (Number(selector(row)) || 0), 0).toFixed(2);
};

const ReactDataTable = ({
  data,
  columns,
  pagination,
  title,
  actions,
  className,
  selectableRows,
  expandableRows,
  FilterComponent,
  showFilter,
  ...props
}) => {
  const [tableData, setTableData] = useState(data);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    let defaultData = data;
    if (searchText !== "") {
      defaultData = data.filter((item) => item.product.toLowerCase().includes(searchText.toLowerCase()));
    }
    setTableData(defaultData);
  }, [searchText, data]);

  const viewChange = () => {
    setMobileView(window.innerWidth < 960 && expandableRows);
  };

  useEffect(() => {
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    return () => {
      window.removeEventListener("resize", viewChange);
    };
  }, [expandableRows]);

  const enhancedColumns = columns?.map((column) => ({
    ...column,
    footer: (rows) => calculateFooter(rows, column.selector),
  }));

  const customFooter = () => (
    <Row style={{ backgroundColor: "yellow", padding: "10px" }}>
      {enhancedColumns.map((column, index) => (
        <Col key={index}>
          <strong>{column.name}</strong>: {column.footer(tableData)}
        </Col>
      ))}
    </Row>
  );

  return (
    <div className={`dataTables_wrapper ${className ? className : ""}`}>
      <Row className={`justify-between g-2 ${actions ? "with-export" : ""}`}>
        <Col className="col-7 text-start" sm="4">
          <div id="DataTables_Table_0_filter" className="dataTables_filter">
            <label>
              <h5>{title}</h5>
            </label>
          </div>
        </Col>
        <Col className="col-5 text-end" sm="8">
          <div className="datatable-filter">
            <div className="d-flex justify-content-end g-2">
              {showFilter && <FilterComponent />}
              {actions && <Export data={data} />}

              <div className="dataTables_length" id="DataTables_Table_0_length">
                <label>
                  <span className="d-none d-sm-inline-block">Show</span>
                  <div className="form-control-select">
                    {" "}
                    <select
                      name="DataTables_Table_0_length"
                      className="custom-select custom-select-sm form-control form-control-sm"
                      onChange={(e) => setRowsPerPage(e.target.value)}
                      value={rowsPerPage}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="40">40</option>
                      <option value="50">50</option>
                    </select>{" "}
                  </div>
                </label>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <DataTable
        data={tableData}
        columns={enhancedColumns}
        className={className}
        selectableRows={selectableRows}
        selectableRowsComponent={CustomCheckbox}
        expandableRowsComponent={ExpandableRowComponent}
        expandableRows={mobileView}
        fixedHeader={true}
        fixedHeaderScrollHeight={"700px"}
        showFooter={true}
        noDataComponent={<div className="p-2">There are no records found</div>}
        sortIcon={
          <div>
            <span>&darr;</span>
            <span>&uarr;</span>
          </div>
        }
        pagination={pagination}
        paginationComponent={({ currentPage, rowsPerPage, rowCount, onChangePage, onChangeRowsPerPage }) => (
          <DataTablePagination
            customItemPerPage={rowsPerPage}
            itemPerPage={rowsPerPage}
            totalItems={rowCount}
            paginate={onChangePage}
            currentPage={currentPage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        )}
        footer={customFooter}
      />
    </div>
  );
};

export default ReactDataTable;
