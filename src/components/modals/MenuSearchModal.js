import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Icon } from "../Component";

const MenuSearchModal = ({ modal, toggle, data, handleResultClick }) => {
    return (
        <Modal
            isOpen={modal}
            className="modal-dialog-centered text-center"
            size="sm"
        >
            <ModalHeader
                tag="h4"
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
                <span style={{ fontSize: "medium" }}>Menu Search Results</span>
            </ModalHeader>
            <ModalBody className="text-center">
                <ul className="search-results">
                    {data?.map((result, index) => (
                        <li
                            key={index}
                            className="search-result-item d-flex align-items-center"
                            onClick={() => handleResultClick(result)}
                            style={{
                                cursor: "pointer",
                                padding: "0.5rem",
                                borderRadius: "4px",
                            }}
                            onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                "#f8f9fa")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = "white")
                            }
                        >
                            <Icon
                                name="menu"
                                className="mr-2"
                                style={{ marginRight: "0.5rem" }}
                            />
                            {result.title}
                        </li>
                    ))}
                </ul>
            </ModalBody>
        </Modal>
    );
};

export default MenuSearchModal;
