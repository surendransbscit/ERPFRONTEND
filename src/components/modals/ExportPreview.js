import React, { useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Col, Icon, Row } from "../Component";
import { useExportData } from "react-table-plugins";
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
import styled from "styled-components";
import CurrencyDisplay from "../common/moneyFormat/moneyFormat";

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

const ExportPreviewModal = ({ modal, toggle, columns, setColumns, saveColumn }) => {
  const chunkArray = (arr, size) => {
    return arr.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);
  };

  const tableData = chunkArray(columns, 5);


  const handelChange = (accessor, field, value) => {
    const index = columns.findIndex(item => item.accessor === accessor);

    setColumns((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      let updateValue = {
        [field]: value,
      }
      updatedValues[index] = { ...updatedObject, ...updateValue };
      return updatedValues;
    });
  };

  return (
    <Modal isOpen={modal} className="modal-dialog-centered text-center" size="lg">
      <ModalHeader
        tag="h6"
        className="bg-light"
        toggle={toggle}
        close={
          <button
            className="close"
            style={{
              position: "absolute",
              right: "1rem",
            }}
            onClick={toggle}
          >
            <Icon name="cross" />
          </button>
        }
      >
        <span style={{ fontSize: "small" }}>Report Column</span>
      </ModalHeader>
      <ModalBody className="text-center ">
        {/* <p className="mb-3" style={{textAlign:"left",fontWeight:"bold"}}> Enter Title</p>
      <textarea
          id="remarks"
          style={{ minHeight: "4vw" }}
          rows="3"
          className="form-control form-control-sm"
          value={title}
          defaultValue={title || ""}
          onChange={(e) => setTitle(e.target.value)}
        /> */}

        {/* <p className="mb-3" style={{textAlign:"left",fontWeight:"bold"}} >Export Column</p> */}

        <div >
          <table className="react_table" style={{ width: "100%", textAlign: "left" }}>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex} style={{
                  background: "#fff",
                  boxShadow: "inset 0px 1px 0px 0px #fff",
                  textAlign: "center",
                  padding: "0.25rem",
                  fontWeight: "500",
                  color: "#364a63",
                  border: "1px solid #ccc"
                }}>
                  {row.map((item, colIndex) => (
                    <td style={{
                      background: "#fff",
                      boxShadow: "inset 0px 1px 0px 0px #fff",
                      textAlign: "left",
                      padding: "0.25rem",
                      fontWeight: "500",
                      color: "#364a63",
                      border: "1px solid #ccc"
                    }} key={colIndex}> <input
                        type="checkbox"
                        checked={item.showCol}
                        onChange={(event) => {
                          handelChange(item.accessor, 'showCol', event.target.checked);
                        }}
                      />  {item.Header}</td>
                  ))}
                  {/* Fill empty cells if row has less than 5 items */}
                  {Array.from({ length: 5 - row.length }).map((_, i) => (
                    <td key={`empty-${rowIndex}-${i}`}></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>


        </div>
        

        <div style={{ textAlign: "end", marginTop: "20px" }}>
          {/* <button className="btn btn-secondary" type="button"  onClick={() => {

                toggle();
                exportToPrint();
               }}>
                     <Icon name="printer-fill"></Icon> <span>Print</span>
                </button> 
                &nbsp; */}
          <button className="btn btn-primary" type="button" onClick={() => {
            toggle();
            // exportExcel()
          }
          }>

            <span>Close</span>
          </button>
         
          <button style={{marginLeft:"2px"}} className="btn btn-success" type="button" onClick={() => {
            saveColumn();
            toggle();

          }
          }>

            <span>Save As Template</span>
          </button>

        </div>

      </ModalBody>
    </Modal>
  );
};

export default ExportPreviewModal;
