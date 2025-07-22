import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Col, Icon, Row } from "../Component";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillEditorModal = ({
  modal,
  toggle,
  content,
  setContent,
  onSave,
  ...props
}) => {
  const [editorHtml, setEditorHtml] = useState(content || "");

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  const handleSave = () => {
    setContent(editorHtml);
    if (onSave) {
      onSave(editorHtml);
    }
    toggle();
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  return (
    <Modal isOpen={modal} className="modal-dialog-centered" size="lg">
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
        <span style={{ fontSize: "small" }}>Review</span>
      </ModalHeader>
      <ModalBody>
        <ReactQuill
          theme="snow"
          value={editorHtml}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          style={{ height: "400px", marginBottom: "60px" }}
        />
        <Row className="mt-3">
          <Col md={8}></Col>
          <Col md={2}></Col>
          <Col md={2}>
            <Button
              onClick={handleSave}
              color="primary"
              className="mb-2"
              size="sm"
              style={{height: "35px"}}
            >
              Save
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default QuillEditorModal;