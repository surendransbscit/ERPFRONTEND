import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Icon } from "../Component";

const OrderAssignModel = ({ modal, toggle, title, name, clickAction, actionName }) => {
  return (
    <Modal isOpen={modal} className="modal-dialog-centered text-center" size="sm" style={{ width: "fit-content" }}>
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
        <span style={{ fontSize: "small" }}>{title}</span>
      </ModalHeader>
      <ModalBody className="text-center ">
        <span>{`Are you sure want to ${actionName} the ${name} ?`}</span>
        <div style={{ textAlign: "end", marginTop: "20px" }}>
          <Button size="md" color="primary" onClick={(e) => toggle()}>
            No
          </Button>{" "}
          <Button
            size="md"
            color="danger"
            onClick={(e) => {
              clickAction();
            }}
          >
            Yes
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default OrderAssignModel;
