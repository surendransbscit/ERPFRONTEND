import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Col, Icon, Row } from "../Component";

const PreviewImagesModal = ({ modal, toggle, files }) => {
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
        <span style={{ fontSize: "small" }}>Image Preview</span>
      </ModalHeader>
      <ModalBody className="text-center ">
        {files?.length == 1 ? (
          <>
            {files?.map((item, idx) => {
              return (
                // <Col key={idx} lg={4}>
                <div>
                  <img
                    src={item?.image}
                    alt={item?.name}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      width: "200px",
                    }}
                    //   style={{
                    //     maxWidth: "200px",
                    //     maxHeight: "200px",
                    //     width: "60px",
                    //     borderRadius: "50%",
                    //     cursor: "pointer",
                    //   }}
                  />
                  <p style={{ fontWeight: "bold" }}>{item?.name}</p>
                </div>
                // </Col>
              );
            })}
          </>
        ) : (
          <>
            <Row className={"form-control-sm"} style={{ marginTop: "10px" }}>
              {files?.map((item, idx) => {
                return (
                  <Col key={idx} lg={4}>
                    <img
                      src={item?.image}
                      alt={item?.name}
                      //   style={{
                      //     maxWidth: "200px",
                      //     maxHeight: "200px",
                      //     width: "60px",
                      //     borderRadius: "50%",
                      //     cursor: "pointer",
                      //   }}
                    />
                    <p style={{ fontWeight: "bold" }}>{item?.name}</p>
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default PreviewImagesModal;
