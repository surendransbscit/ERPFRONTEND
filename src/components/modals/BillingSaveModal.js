import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Icon } from "../Component";

const BillingSaveModal = ({ modal, toggle, title, name, clickAction, actionName }) => {
    return (
      <Modal isOpen={modal} className="modal-dialog-centered text-center" size="md">
        <ModalHeader
          tag="h6"
          className="bg-light"
          toggle={toggle}
          close={
            <button className="close" tabIndex={-1} style={{ position: "absolute", right: "1rem" }} onClick={toggle}>
              <Icon name="cross" />
            </button>
          }
        >
          <span style={{ fontSize: "small" }}>{title}</span>
        </ModalHeader>
        <ModalBody className="text-center">
          <span  style={{ fontSize:"20px",color:"Red"}}>{actionName}</span>
          <div style={{ textAlign: "end", marginTop: "20px" }}>
            <Button size="md" color="danger" onClick={clickAction} autoFocus={modal} >
              Yes
            </Button>{" "}
            <Button size="md" color="primary" onClick={toggle}>
              No
            </Button>
          </div>
        </ModalBody>
      </Modal>
    );
  };

export default BillingSaveModal;
