import React, { useState, useRef } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Col, Icon, Row } from "../Component";
import Dropzone from "react-dropzone";

const MultiVoiceRecordDropzone = ({
  modal,
  toggle,
  files,
  setFiles,
  handleDropChange,
  isDefaultReq,
  ...props
}) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);

        reader.onloadend = () => {
          const base64Data = reader.result; // This is the base64 string
          const newAudio = {
            id: Date.now(),
            preview: audioUrl,
            blob: audioBlob,
            base64: base64Data,
          };
          setFiles((prevFiles) => [...prevFiles, newAudio]);
          audioChunks.current = [];
          setRecording(false);
          stream.getTracks().forEach((track) => track.stop());
        };

      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const selectionDefault = async (obj, checked) => {
    setFiles((prevState) =>
      prevState?.map((item) => {
        if (item === obj) {
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
      return updatedFiles;
    });
  };

  return (
    <Modal
      isOpen={modal}
      className="modal-dialog-centered text-center"
      size="lg"
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
        <span style={{ fontSize: "small" }}>Voice Record Upload</span>
      </ModalHeader>
      <ModalBody className="text-center ">
        <Row>
          <Col md={6}>
            <Button
              color="secondary"
              onClick={toggleRecording}
              className="mb-2"
            >
              {recording ? "Stop recording" : "Start recording"}
            </Button>
          </Col>
          <Col md={3}></Col>
          <Col md={3}>
            <Button
              onClick={() => toggle({ Save: true })}
              color="primary"
              disabled={files?.length === 0}
              className="mb-2"
              size="sm"
            >
              Save
            </Button>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <Dropzone
              onDrop={(acceptedFiles) =>
                handleDropChange(acceptedFiles, setFiles)
              }
              accept="audio/*"
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="dropzone upload-zone dz-clickable"
                >
                  <input {...getInputProps()} />
                  {files?.length === 0 && (
                    <div className="dz-message">
                      <span className="dz-message-text">
                        Drag and drop audio file
                      </span>
                      <span className="dz-message-or">or</span>
                      <Button color="primary">SELECT</Button>
                    </div>
                  )}
                  {files?.map((file) => (
                    <div
                      key={file.id}
                      className="dz-preview dz-processing dz-image-preview dz-complete"
                    >
                      <div className="dz-image">
                        <audio controls src={file.preview} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Dropzone>
          </Col>
        </Row>

        <div className="table-responsive mt-4">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Voice record</th>
                {isDefaultReq && <th>Default</th>}
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {files?.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <audio controls src={item.preview} />
                    </td>
                    {isDefaultReq && (
                      <td>
                        <div className="custom-control custom-control-sm custom-checkbox notext">
                          <input
                            type="checkbox"
                            className="custom-control-input form-control"
                            id={`${item?.id}-default`}
                            checked={item?.default}
                            onChange={(e) =>
                              selectionDefault(item, e.target.checked)
                            }
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={`${item?.id}-default`}
                          ></label>
                        </div>
                      </td>
                    )}
                    <td>
                      <Button
                        onClick={() => deleteItem(item?.id)}
                        color="danger"
                        size="sm"
                      >
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

export default MultiVoiceRecordDropzone;
