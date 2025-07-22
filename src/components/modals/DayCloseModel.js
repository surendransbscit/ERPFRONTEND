import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { Icon } from "../Component";
import { useBranches } from "../filters/filterHooks";
import { BranchDropdown } from "../filters/retailFilters";

const DayCloseModel = ({
    modal,
    toggle,
    title,
    name,
    clickAction,
    actionName,
    idBranch,
    setIdBranch,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
        setValue,
        reset
    } = useForm();
    const { branches } = useBranches();
    return (
        <Modal
            isOpen={modal}
            className="modal-dialog-centered"
            size="sm"
            style={{ width: "fit-content" }}
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
                <span style={{ fontSize: "small" }}>{title}</span>
            </ModalHeader>
            <ModalBody >
                <span>{`Are you sure want to ${name} ?`}</span><br />
                <div style={{ "marginTop": "10px" }}>
                    <Label>Select Branch</Label>
                    <div className="form-group">
                        <BranchDropdown
                            register={register}
                            id={"idBranch"}
                            branches={branches}
                            selectedBranch={idBranch}
                            onBranchChange={setIdBranch}
                            isRequired={true}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            message={errors.idBranch && "Branch is Required"}
                        ></BranchDropdown>
                    </div>
                </div>
                <div style={{ textAlign: "end", marginTop: "20px" }}>
                    <Button
                        // disabled={issubmitting}
                        size="md"
                        color="primary"
                        onClick={(e) => toggle()}
                    >
                        No
                    </Button>{" "}
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
                </div>
            </ModalBody>
        </Modal>
    );
};

export default DayCloseModel;
