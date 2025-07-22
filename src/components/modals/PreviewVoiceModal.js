import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Col, Icon, Row } from "../Component";

const PreviewVoiceModal = ({ modal, toggle, files }) => {
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
        <span style={{ fontSize: "small" }}>Voice Preview</span>
      </ModalHeader>
      <ModalBody className="text-center ">
        {files?.length == 1 ? (
          <>
            {files?.map((item, idx) => {
              return (
                // <Col key={idx} lg={4}>
                <div>
                  <audio
                    src={item?.audio}
                    controls
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      width: "400px",
                    }}
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
                    <audio
                      src={item?.audio}
                      controls
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: "200px",
                        width: "400px",
                      }}
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

export default PreviewVoiceModal;
