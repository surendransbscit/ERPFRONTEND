import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Col, Icon, Row } from "../../../components/Component";
import Dropzone from "react-dropzone";
import MultiImageDropzone from "../../../components/modals/MultiImageDropzone";
import { v4 as uuid } from "uuid";

const SampleCustomer = () => {
  const [modal, setModal] = useState(false);
  const [files, setFiles] = useState([]);

  const convert64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleDropChange = async (acceptedFiles, set) => {
    const filesWithPreview = await Promise.all(
      acceptedFiles?.map(async (file) => {
        const base64String = await convert64(file);
        return {
          ...file,
          preview: base64String,
          id: uuid(),
          default: false,
        };
      })
    );

    set(filesWithPreview);
  };

  console.log(files);

  const toggle = () => {
    setModal(!modal);
  };
  return (
    <>
      <div style={{ marginTop: "8rem" }}>
        SampleCustomer
        <Button onClick={() => toggle()}>Click</Button>
      </div>

      <MultiImageDropzone
        modal={modal}
        toggle={toggle}
        files={files}
        setFiles={setFiles}
        handleDropChange={handleDropChange}
      />
    </>
  );
};

export default SampleCustomer;
