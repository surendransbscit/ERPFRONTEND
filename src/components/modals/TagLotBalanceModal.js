import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Icon, Row, UserAvatar } from "../Component";
import CurrencyDisplay from "../common/moneyFormat/moneyFormat";

const TagLotBalanceModal = ({ modal, toggle, title, columns, data }) => {
  const calculateTagLogDetails = (field) => {
    return data?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns?.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };
  return (
    <Modal
      isOpen={modal}
      className="modal-dialog-centered text-center"
      size="xl"
    //   style={{ width: "fit-content" }}
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
        <span style={{ fontSize: "small" }}>{"Lot Balance Details"}</span>
      </ModalHeader>
      <ModalBody className="text-center ">
        <Row md={12}>
          <div
            className="table-responsive"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th colSpan={"2"} style={{ textAlign: "center" }}></th>
                  <th colSpan={"5"} style={{ textAlign: "center" }}>
                    Lot Details
                  </th>
                  <th
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      background: "#a7a0b6",
                      color: "white",
                    }}
                  >
                    Tag Details
                  </th>
                  <th colSpan="5" style={{ textAlign: "center" }}>
                    Balance Details
                  </th>
                </tr>
                <tr>
                  <th>S.NO </th>
                  {columns?.map((column, index) => (
                    <th key={index} style={{ textAlign: column?.textAlign }}>
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 &&
                  data?.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>{rowIndex + 1} </td>
                      {columns?.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          style={{
                            textAlign: column?.textAlign,
                          }}
                        >
                          {column.type === "image" ? (
                            item[column.accessor] ? (
                              <img
                                src={item[column.accessor]}
                                alt={column.accessor}
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                }}
                              />
                            ) : (
                              <UserAvatar text={item["image_text"]} />
                            )
                          ) : column.isCurrency ? (
                            <CurrencyDisplay value={item[column.accessor]} />
                          ) : column.decimal_places ? (
                            parseFloat(item[column.accessor]).toFixed(
                              column.decimal_places
                            )
                          ) : (
                            item[column.accessor]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>

              <tfoot>
                <tr style={{ fontWeight: "bold" }}>
                  <td>Total</td>
                  {columns?.map((column, index) => (
                    <td key={index} style={{ textAlign: column?.textAlign }}>
                      {column.isTotalReq ? (
                        column.isCurrency ? (
                          <CurrencyDisplay
                            value={calculateTagLogDetails(column.accessor)}
                          />
                        ) : (
                          calculateTagLogDetails(column.accessor)
                        )
                      ) : (
                        ""
                      )}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default TagLotBalanceModal;
