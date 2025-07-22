import React, { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { Button, Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const UpdateDayCloseModal = ({ modal, toggle, data, title, clickAction, SetDayCloseData }) => {
  const selectionClose = async (obj, checked) => {
    SetDayCloseData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,
            dayclose: checked,
          };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    if (data?.length == 1) {
      selectionClose(data[0], true);
    }
  }, [data]);
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
        {/* <h5>{`Day Close issue.`}</h5> */}

        {/* <br /> */}
        {data?.length > 1 && (
          <div style={{ marginTop: "10px" }}>
            <h4>Following branches didn't happen the day close</h4>
            {data?.map((item, idx) => {
              return (
                <div>
                  <div className="custom-control custom-control-md custom-checkbox mt-2">
                    <input
                      type="checkbox"
                      className="custom-control-input form-control form-control-sm"
                      id={`${idx}-dayclose`}
                      checked={item.dayclose}
                      onChange={(e) => selectionClose(item, e.target.checked)}
                    />
                    <label className="custom-control-label" htmlFor={`${idx}-dayclose`}>
                      {item?.name}
                    </label>
                  </div>
                  {/* <h5 className="text-danger mt-4">{item?.name}</h5> */}
                </div>
              );
            })}
          </div>
        )}
        {data?.length == 1 && (
          <div style={{ marginTop: "10px" }}>
            <h4>Your branch didn't get day close.</h4>
          </div>
        )}
        <p className="mt-3">Are you sure you want to do day close?</p>
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
            Day Close
            {/* {issubmitting ? <Spinner size={"sm"} /> : "Yes"} */}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default UpdateDayCloseModal;
