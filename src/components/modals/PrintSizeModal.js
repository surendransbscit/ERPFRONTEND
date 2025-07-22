import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Icon } from "../Component";

const PrintSizeModal = ({
  modal,
  toggle,
  sizes,
  setSelectedPrintSize,
  selectedPrintSize,
  printAction
}) => {
  const handleChange = (value) => {
    setSelectedPrintSize(value);
  };
  return (
    <Modal
    onClosed={()=>{
        setSelectedPrintSize(null)
    }}
      isOpen={modal}
      className="modal-dialog-centered text-center"
      size="lg"
    >
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
        <span style={{ fontSize: "small" }}>Print Page Sizes</span>
      </ModalHeader>
      <ModalBody className="text-center ">
        <div>
          <table
            className="react_table"
            style={{ width: "100%", textAlign: "left" }}
          >
            <tbody>
              <tr
                style={{
                  background: "#fff",
                  boxShadow: "inset 0px 1px 0px 0px #fff",
                  textAlign: "center",
                  padding: "0.25rem",
                  fontWeight: "500",
                  color: "#364a63",
                  border: "1px solid #ccc",
                }}
              >
                {sizes?.map((item, colIndex) => (
                  <td
                    style={{
                      background: "#fff",
                      boxShadow: "inset 0px 1px 0px 0px #fff",
                      textAlign: "left",
                      padding: "0.25rem",
                      fontWeight: "500",
                      color: "#364a63",
                      border: "1px solid #ccc",
                    }}
                    key={colIndex}
                  >
                    {" "}
                    <input
                      type="checkbox"
                      checked={item.size === selectedPrintSize}
                      onChange={(event) => {
                        handleChange(item?.size);
                      }}
                    />{" "}
                    {item.label}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: "end", marginTop: "20px" }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              toggle();
            }}
          >
            <span>Close</span>
          </button>

          <button
            style={{ marginLeft: "2px" }}
            className="btn btn-success"
            type="button"
            onClick={() => {
                printAction();
              toggle();
            }}
          >
            <span>Print</span>
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default PrintSizeModal;
