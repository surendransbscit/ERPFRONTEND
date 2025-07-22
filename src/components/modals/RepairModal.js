import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Col, Icon, Row } from "../Component";
import { toastfunc } from "../sds-toast-style/toast-style";

const AdvanceRefundModal = ({ modal, toggle, data, SetData, totalAdvanceRefundAmount }) => {
  const updateAmount = async (obj, value) => {
    SetData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          if (parseFloat(value) > parseFloat(obj.balance_amount)) {
            toastfunc("You can't add more than the balance");
          } else {
            return {
              ...item,
              amount: value,
            };
          }
        }
        return item;
      })
    );
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
        <span style={{ fontSize: "small" }}>Repair Order Details</span>
      </ModalHeader>
      <ModalBody className="text-center ">
        <div className="table-responsive mt-4">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Order No</th>
                <th>Advance Amount</th>
                <th>Adjusted Amount</th>
                <th>Refund Amount</th>
                <th>Balance Amount</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.bill_no}</td>
                    <td>{item.advance_amount}</td>
                    <td>{item.adjusted_amount}</td>
                    <td>{item.refunded_amount}</td>

                    <td>
                      <div className="form-control-wrap">
                        <input
                          type="number"
                          min={0}
                          className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                          id={`${item?.id_issue_receipt}-amount`}
                          value={item?.amount}
                          onChange={(e) => updateAmount(item, e.target.value)}
                        />
                        <label className="form-label" htmlFor={`${item?.id_issue_receipt}-amount`}></label>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* <tfoot>
            {paymentHistoryList.payments?.map((item, idx) => {
              return (
                <tr key={idx} style={{ fontWeight: "bold" }}>
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{item.payment_amount}</td>
                  <td>{item.net_amount}</td>
                  <td>{item.metal_weight}</td>
                  <td></td>
                </tr>
              );
            })}
          </tfoot> */}
          </table>
        </div>

        <Row>
          <Col md={6}></Col>
          <Col md={3}></Col>
          <Col md={3}>
            <div className="form-control-wrap">
              <input
                readOnly
                type="number"
                min={0}
                className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
                id={`total_received_amount`}
                value={totalAdvanceRefundAmount}
              />
              <label className="form-label" htmlFor={`total_received_amount`}>
                Total Received
              </label>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6}></Col>
          <Col md={3}></Col>
          <Col md={3}>
            <Button onClick={() => toggle({ Save: true })} color="primary" className="mt-3 mb-2" size="md">
              Save
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default AdvanceRefundModal;
