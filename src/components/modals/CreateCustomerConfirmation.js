import React, { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import secureLocalStorage from "react-secure-storage";
import {
  Button,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

const CreateCustomerConfirmation = ({
  modal,
  toggle,
  title,
  mobNum,
  clickAction,
}) => {

//   const createBtnRef = useRef(null);

//   useEffect(() => {
//   if (modal===true) {
//     const timer = setTimeout(() => {
//       const tabEvent = new KeyboardEvent("keydown", {
//         key: "Tab",
//         keyCode: 9,
//         which: 9,
//         bubbles: true,
//       });

//       document.dispatchEvent(tabEvent);
//       document.dispatchEvent(tabEvent);
//     }, 100);

//     return () => clearTimeout(timer);
//   }
// }, [modal]);

  
  return (
    <Modal isOpen={modal} className="modal-dialog-centered" size="md">
      <ModalHeader
        tag="h6"
        className="bg-light"
        // toggle={toggle}
        // close={
        //   <button
        //     className="close"
        //     style={{
        //       position: "absolute",
        //       right: "1rem",
        //     }}
        //     onClick={toggle}
        //   >
        //     <Icon name="cross" />
        //   </button>
        // }
      >
        <span style={{ fontSize: "small" }}>{title}</span>
      </ModalHeader>
      <ModalBody>
        <h5>{`Create Customer`}</h5>

        {/* <br /> */}
        {/* <div style={{ marginTop: "10px" }}>
          {data?.messages?.map((item) => {
            return <h5 className="text-danger mt-4">{item?.message}</h5>;
          })}
        </div> */}
        <span>{`Create new Customer with mobile number of ${mobNum}`}</span>
        <div style={{ textAlign: "end", marginTop: "20px" }}>
          <Button
            // disabled={issubmitting}
            size="md"
            color="danger"
            onClick={(e) => {
              toggle();
              secureLocalStorage.setItem("shownDayCloseModal", true);
            }}
          >
            Cancel
          </Button>{" "}
          <Button
            // disabled={issubmitting}
            size="md"
            color="primary"
            onClick={(e) => {
              clickAction();
            }}
          >
            Create
            {/* {issubmitting ? <Spinner size={"sm"} /> : "Yes"} */}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default CreateCustomerConfirmation;
