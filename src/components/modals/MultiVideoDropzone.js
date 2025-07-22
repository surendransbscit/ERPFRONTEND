import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Col, Icon, Row } from "../Component";
import Dropzone from "react-dropzone";
import Webcam from "react-webcam";

const MultiVideoDropzone = ({
  modal,
  toggle,
  files,
  setFiles,
  handleDropChange,
  rowVideoUpload = false,
  ...props
}) => {
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const [stream, setStream] = useState(null); // Hold the stream here
  const webcamRef = React.useRef(null);

  const toggleWebcam = async () => {
    if (!webcamOpen) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream); // Set the stream from user's webcam
        webcamRef.current.srcObject = mediaStream
      } catch (err) {
        console.error("Error accessing the webcam", err);
      }
    } else {
      // Stop the stream when webcam is toggled off
      stream?.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setWebcamOpen(!webcamOpen);
  };
    const startRecording = () => {
    if (stream) {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      videoChunks.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          videoChunks.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const videoBlob = new Blob(videoChunks.current, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(videoBlob);
      
        const reader = new FileReader();
        reader.readAsDataURL(videoBlob);
        reader.onloadend = () => {
          const base64Data = reader.result; // This is the base64 string
      
          const newVideo = {
            id: Date.now(),
            preview: videoUrl,
            blob: videoBlob,
            base64: base64Data,
          };
      
          setFiles((prevFiles) => [...prevFiles, newVideo]);
          videoChunks.current = [];
          setWebcamOpen(false);
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        };
      };
      recorder.start();
      setRecording(true);
    } else {
      console.error("Stream not available");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const deleteItem = (id) => {
    setFiles((prevState) => {
      const updatedFiles = prevState.filter((obj) => obj.id !== id);

      if (rowVideoUpload && props?.activeRow && props?.setSupplierProducts) {
        props?.setSupplierProducts((prevState) =>
          prevState.map((obj) =>
            obj.id === props?.activeRow ? { ...obj, video: updatedFiles } : obj
          )
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
        <span style={{ fontSize: "small" }}>Video Upload</span>
      </ModalHeader>
      <ModalBody className="text-center ">
        <Row>
          <Col md={6}>
            <Button color="secondary" onClick={toggleWebcam} className="mb-2">
              {webcamOpen ? "Close Webcam" : "Record from Webcam"}
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
        {webcamOpen && stream && (
          <div className="webcam-container mb-3">
            <Webcam
              ref={webcamRef}
              audio={true}
              videoConstraints={{ deviceId: stream.getVideoTracks()[0]?.label }}
              style={{ width: "100%", border: "1px solid #ccc" }}
            />
            {!recording ? (
              <Button color="success" onClick={startRecording} className="mt-2">
                Start Recording
              </Button>
            ) : (
              <Button color="danger" onClick={stopRecording} className="mt-2">
                Stop Recording
              </Button>
            )}
          </div>
        )}
        <Row>
          <Col md="12">
            <Dropzone
              onDrop={(acceptedFiles) => handleDropChange(acceptedFiles, setFiles)}
              accept={[".mp4", ".webm"]}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="dropzone upload-zone dz-clickable">
                  <input {...getInputProps()} />
                  {files?.length === 0 && (
                    <div className="dz-message">
                      <span className="dz-message-text">Drag and drop video</span>
                      <span className="dz-message-or">or</span>
                      <Button color="primary">SELECT</Button>
                    </div>
                  )}
                  {files?.map((file) => (
                    <div
                      key={file.id}
                      className="dz-preview dz-processing dz-video-preview dz-complete"
                    >
                      <div className="dz-video">
                        <video width="300" height="200" controls>
                          <source src={file.preview} type="video/webm" />
                        </video>
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
                <th>Video</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {files?.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <video
                        className="img-responsive"
                        src={item.preview}
                        style={{ width: "80px", height: "80px" }}
                        controls
                      />
                    </td>
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

export default MultiVideoDropzone;
