import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Col, Icon, Row } from "../Component";
import Dropzone from "react-dropzone";
import Webcam from "react-webcam";

const MultiImageDropzone = ({
  modal,
  toggle,
  files,
  setFiles,
  handleDropChange,
  isDefaultReq,
  rowImageUpload = false,
  ...props
}) => {
  const [webcamOpen, setWebcamOpen] = useState(false);
  const webcamRef = React.useRef(null);

  const toggleWebcam = () => setWebcamOpen(!webcamOpen);

  const captureImage = () => {
    if (webcamRef.current) {
      const capturedImage = webcamRef.current.getScreenshot();
      const newImage = {
        id: Date.now(),
        preview: capturedImage,
        default: false,
      };
      setFiles((prevFiles) => [...prevFiles, newImage]);
      setWebcamOpen(false);
    }
  };

  const selectionDefault = async (obj, checked) => {
    setFiles((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,
            default: checked,
          };
        }
        return {
          ...item,
          default: false,
        };
      })
    );
  };

  const deleteItem = (id) => {
    setFiles((prevState) => {
      const updatedFiles = prevState.filter((obj) => obj.id !== id);

      if (rowImageUpload && props?.activeRow && props?.setSupplierProducts) {
        props?.setSupplierProducts((prevState) =>
          prevState.map((obj) => (obj.id === props?.activeRow ? { ...obj, image: updatedFiles } : obj))
        );
      }

      return updatedFiles;
    });
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
        <span style={{ fontSize: "small" }}>Image Upload</span>
      </ModalHeader>
      <ModalBody className="text-center ">
        <Row>
          <Col md={6}>
            <Button color="secondary" onClick={toggleWebcam} className="mb-2">
              {webcamOpen ? "Close Webcam" : "Capture from Webcam"}
            </Button>
          </Col>
          <Col md={3}></Col>
          <Col md={3}>
            <Button
              onClick={() => toggle({ Save: true })}
              color="primary"
              disabled={files?.length == 0}
              className="mb-2"
              size="sm"
            >
              Save
            </Button>
          </Col>
        </Row>
        {webcamOpen && (
          <div className="webcam-container mb-3">
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: "100%", border: "1px solid #ccc" }} />
            <Button color="success" onClick={captureImage} className="mt-2">
              Capture Image
            </Button>
          </div>
        )}
        <Row>
          <Col md="12">
            <Dropzone
              onDrop={(acceptedFiles) => handleDropChange(acceptedFiles, setFiles)}
              accept={[".jpg",".jpeg", ".png", ".svg"]}
              multiple
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="dropzone upload-zone dz-clickable">
                  <input {...getInputProps()} />
                  {files?.length === 0 && (
                    <div className="dz-message">
                      <span className="dz-message-text">Drag and drop file</span>
                      <span className="dz-message-or">or</span>
                      <Button color="primary">SELECT</Button>
                    </div>
                  )}
                  {files?.map((file) => (
                    <div key={file.id} className="dz-preview dz-processing dz-image-preview dz-complete">
                      <div className="dz-image">
                        <img src={file.preview} alt="preview" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Dropzone>
          </Col>
        </Row>

        <div className="table-responsive mt-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>S.NO</th>
                <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Image</th>
                {isDefaultReq && <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Default</th>}
                <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {files?.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <img
                        className="img-responsive"
                        src={item.preview}
                        style={{ width: "80px", height: "80px" }}
                        alt="preview"
                      />
                    </td>
                    {isDefaultReq && (
                      <td>
                        <div className="custom-control custom-control-sm custom-checkbox notext">
                          <input
                            type="checkbox"
                            className="custom-control-input form-control"
                            id={`${item?.id}-default`}
                            checked={item?.default}
                            onChange={(e) => selectionDefault(item, e.target.checked)}
                          />
                          <label className="custom-control-label" htmlFor={`${item?.id}-default`}></label>
                        </div>
                      </td>
                    )}
                    <td>
                      <Button onClick={() => deleteItem(item?.id)} color="danger" size="sm">
                        <Icon name="trash-fill"></Icon>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default MultiImageDropzone;