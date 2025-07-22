import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Col, Icon, Row } from "../Component";

const SchemeAccountDetailModal = ({
  modal,
  toggle,
  PaymentConstraint,
  IndiSchemeAccDetails,
  IncreaseAdvance,
  DecreaseAdvance,
  Advance,
}) => {
  return (
    <Modal
      isOpen={modal}
      className="modal-dialog-centered text-center"
      size="xl"
      style={{ width: "fit-content" }}
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
        <span style={{ fontSize: "small" }}>Scheme Account Details</span>
      </ModalHeader>
      <ModalBody className="text-center ">
        <div className="gy-3">
          <Row className="g-3 align-center">
            <Col lg="3">
              <div className="form-group">
                <label className="form-label">Joined on</label>
              </div>
            </Col>
            <Col lg="3">
              <div className="form-control-wrap">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  value={IndiSchemeAccDetails?.start_date}
                  disabled
                />
              </div>
            </Col>
            {PaymentConstraint?.scheme_type == 2 && (
              <>
                <Col lg="3">
                  <div className="form-group">
                    <label className="form-label">Maturity On</label>
                  </div>
                </Col>
                <Col lg="3">
                  <div className="form-control-wrap">
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      value={PaymentConstraint?.maturity_date}
                      disabled
                    />
                  </div>
                </Col>
              </>
            )}
            <Col lg="3">
              <div className="form-group">
                <label className="form-label">A/c Name</label>
              </div>
            </Col>
            <Col lg="3">
              <div className="form-control-wrap">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  value={IndiSchemeAccDetails?.account_name}
                  disabled
                />
              </div>
            </Col>
            {/* </Row> */}
            {/* <Row className="g-3 align-center"> */}
            <Col lg="3">
              <div className="form-group">
                <label className="form-label">Scheme Code</label>
              </div>
            </Col>
            <Col lg="3">
              <div className="form-control-wrap">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  value={IndiSchemeAccDetails?.scheme_code}
                  disabled
                />
              </div>
            </Col>
            <Col lg="3">
              <div className="form-group">
                <label className="form-label">Type</label>
              </div>
            </Col>
            <Col lg="3">
              <div className="form-control-wrap">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  value={IndiSchemeAccDetails?.scheme_name}
                  disabled
                />
              </div>
            </Col>
            {/* </Row> */}
            {/* <Row className="g-3 align-center"> */}
            {PaymentConstraint?.scheme_type !== 2 && (
              <>
                <Col lg="3">
                  <div className="form-group">
                    <label className="form-label">Paid Installments</label>
                  </div>
                </Col>
                <Col lg="3">
                  <div className="form-control-wrap">
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      defaultValue={PaymentConstraint?.paid_installments}
                      disabled
                    />
                  </div>
                </Col>
              </>
            )}
            <Col lg="3">
              <div className="form-group">
                <label className="form-label">Amount Paid</label>
              </div>
            </Col>
            <Col lg="3">
              <div className="form-control-wrap">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  defaultValue={PaymentConstraint?.paid_amount}
                  disabled
                />
              </div>
            </Col>
            {/* </Row> */}
            {/* <Row className="g-3 align-center"> */}
            <Col lg="3">
              <div className="form-group">
                <label className="form-label">Weight Paid</label>
              </div>
            </Col>
            <Col lg="3">
              <div className="form-control-wrap">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  defaultValue={PaymentConstraint?.paid_weight}
                  disabled
                />
              </div>
            </Col>
            {PaymentConstraint?.scheme_type != 2 &&
              PaymentConstraint?.unpaid_dues &&
              PaymentConstraint?.unpaid_dues > 0 && (
                <>
                  <Col lg="3">
                    <div className="form-group">
                      <label className="form-label">Unpaid Dues</label>
                    </div>
                  </Col>
                  <Col lg="3">
                    <div className="form-control-wrap">
                      <input
                        className="form-control form-control-sm"
                        type="text"
                        // defaultValue={
                        //   PaymentConstraint?.total_installments != undefined
                        //     ? PaymentConstraint?.total_installments - PaymentConstraint?.paid_installments
                        //     : ""
                        // }
                        value={PaymentConstraint?.unpaid_dues}
                        disabled
                      />
                    </div>
                  </Col>
                </>
              )}

            {PaymentConstraint?.paid_installments > 0 &&
              PaymentConstraint?.paid_installments && (
                <>
                  <Col lg="3">
                    <div className="form-group">
                      <label className="form-label">Last Payment on</label>
                    </div>
                  </Col>
                  <Col lg="3">
                    <div className="form-control-wrap">
                      <input
                        className="form-control form-control-sm"
                        type="text"
                        value={IndiSchemeAccDetails?.last_paid_date}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col lg="3">
                    <div className="form-group">
                      <label className="form-label">Last Payment Amount</label>
                    </div>
                  </Col>
                  <Col lg="3">
                    <div className="form-control-wrap">
                      <input
                        className="form-control form-control-sm"
                        type="text"
                        value={IndiSchemeAccDetails?.last_paid_amount}
                        disabled
                      />
                    </div>
                  </Col>
                </>
              )}
          </Row>

          <Row className="g-3 align-center">
            {PaymentConstraint?.minimum_payable?.min_amount != 0 &&
              PaymentConstraint?.minimum_payable?.min_amount != undefined && (
                <>
                  <Col lg="3">
                    <div className="form-group">
                      <label className="form-label">Min Payable Amount</label>
                    </div>
                  </Col>
                  <Col lg="3">
                    <div className="form-control-wrap">
                      <input
                        className="form-control form-control-sm"
                        type="text"
                        defaultValue={
                          PaymentConstraint?.minimum_payable?.min_amount
                        }
                        disabled
                      />
                    </div>
                  </Col>
                </>
              )}

            {PaymentConstraint?.maximum_payable?.max_amount != 0 &&
              PaymentConstraint?.maximum_payable?.max_amount != undefined && (
                <>
                  <Col lg="3">
                    <div className="form-group">
                      <label className="form-label">Max Payable Amount</label>
                    </div>
                  </Col>
                  <Col lg="3">
                    <div className="form-control-wrap">
                      <input
                        className="form-control form-control-sm"
                        type="text"
                        defaultValue={
                          PaymentConstraint?.maximum_payable?.max_amount
                        }
                        disabled
                      />
                    </div>
                  </Col>
                </>
              )}
          </Row>

          <Row className="g-3 align-center">
            {PaymentConstraint?.minimum_payable?.min_weight != 0 &&
              PaymentConstraint?.minimum_payable?.min_weight != undefined && (
                <>
                  <Col lg="3">
                    <div className="form-group">
                      <label className="form-label">Min Payable Weight</label>
                    </div>
                  </Col>
                  <Col lg="3">
                    <div className="form-control-wrap">
                      <input
                        className="form-control form-control-sm"
                        type="text"
                        defaultValue={
                          PaymentConstraint?.minimum_payable?.min_weight
                        }
                        disabled
                      />
                    </div>
                  </Col>
                </>
              )}

            {PaymentConstraint?.maximum_payable?.max_weight != 0 &&
              PaymentConstraint?.maximum_payable?.max_weight != undefined && (
                <>
                  <Col lg="3">
                    <div className="form-group">
                      <label className="form-label">Max Payable Weight</label>
                    </div>
                  </Col>
                  <Col lg="3">
                    <div className="form-control-wrap">
                      <input
                        className="form-control form-control-sm"
                        type="text"
                        defaultValue={
                          PaymentConstraint?.maximum_payable?.max_weight
                        }
                        disabled
                      />
                    </div>
                  </Col>
                </>
              )}
          </Row>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default SchemeAccountDetailModal;
