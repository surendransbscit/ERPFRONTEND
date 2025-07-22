import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Icon } from "../Component";
import { TextareaInputField } from "../form-control/InputGroup";

const CancelModel = ({ modal, toggle, title, name, textValue, SetTextValue, clickAction, actionName }) => {
  return (
    <Modal isOpen={modal} className="modal-dialog-centered text-center" size="md" style={{ width: "fit-content" }}>
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
        <span>{`Are you sure want to ${actionName} this ${name} ?`}</span>

        <div style={{ marginTop: "20px" }}>
          <TextareaInputField
            lable="Cancel Reason"
            placeholder="Cancel Reason"
            value={textValue}
            SetValue={(value) => SetTextValue(value)}
          />
        </div>

        <div style={{ textAlign: "end", marginTop: "20px" }}>
          <Button
            // disabled={issubmitting}
            size="md"
            color="danger"
            onClick={(e) => {
              clickAction();
            }}
          >
            Yes
            {/* {issubmitting ? <Spinner size={"sm"} /> : "Yes"} */}
          </Button>
          <Button
            // disabled={issubmitting}
            size="md"
            color="primary"
            onClick={(e) => toggle()}
          >
            No
          </Button>{" "}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default CancelModel;
