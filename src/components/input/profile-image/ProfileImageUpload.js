import React, { useState } from "react";
import Webcam from "react-webcam";
import { Button, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import { UserAvatar } from "../../Component";
import "./ProfileImageUpload.css";
import UserIcon from "../../../images/user.png";

const ProfileImageUpload = ({ image, SetImage, id }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const webcamRef = React.useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        SetImage(reader.result);
      };
    }
    setModalOpen(false);
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const capturedImage = webcamRef.current.getScreenshot();
      SetImage(capturedImage);
      setWebcamEnabled(false);
      setModalOpen(false);
    }
  };

  const removeImage = () => {
    SetImage(null);
  };

  const isBase64 = (str) => {
    try {
      return str.startsWith("data:image");
    } catch (err) {
      return false;
    }
  };

  return (
    <>
      {image ? (
        <div className="img-wrap">
          <img src={isBase64(image) ? image : image + "?" + String()} alt="Profile" />
        </div>
      ) : (
        <>
          <Label style={{ cursor: "pointer" }} onClick={() => setModalOpen(true)}>
            <UserAvatar image={UserIcon} className="xl" />
          </Label>
        </>
      )}

      {image && (
        <Button color="danger" onClick={removeImage} style={{ marginTop: "1rem" }}>
          Remove Image
        </Button>
      )}

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalBody>
          {webcamEnabled ? (
            <>
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: "100%" }} />
            </>
          ) : (
            <>
              <Button color="primary" onClick={() => setWebcamEnabled(true)} style={{ marginBottom: "1rem" }}>
                Use Webcam
              </Button>
              <Input type="file" id={id} onChange={handleImageChange} />
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {webcamEnabled && (
            <Button color="success" onClick={captureImage}>
              Capture
            </Button>
          )}
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ProfileImageUpload;
