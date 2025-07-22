import React from "react";
import { Row,Col, Modal, ModalBody, ModalHeader,Button } from "reactstrap";
import { Icon } from "../Component";
import { ActiveEmployeeDropdown} from "../filters/retailFilters";
import { useForm, FormProvider } from "react-hook-form";

const EmployeeModal = ({ modal, toggle,employees,data,setData }) => {
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  return (
    <Modal
      isOpen={modal}
      className="modal-dialog-centered text-center"
      
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
        <span style={{ fontSize: "small" }}>Employee</span>
      </ModalHeader>
      <ModalBody className="text-center ">
      <div className="custom-grid">
        <Row md={12} className="form-group row g-4 form-control-sm">
                        <Col lg="6">
                          <div className="form-group">
                            <label className="form-label" htmlFor="startdate">
                              Support Employee 1 :
                            </label>
                          </div>
                        </Col>
                        <Col lg="6">
                            <ActiveEmployeeDropdown
                              register={register}
                              id={"supportEmployee1"}
                              selectedEmployee={data?.subEmployee1}
                              onEmployeeChange={(value)=>{
                                setData("subEmployee1",value);
                              }}
                              isRequired={true}
                              options={employees}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={errors.supportEmployee1 && "Employee is Required"}
                            />
                        </Col>
        </Row>
        <Row md={12} className="form-group row g-4 form-control-sm">
                        <Col lg="6">
                          <div className="form-group">
                            <label className="form-label" htmlFor="startdate">
                              Support Employee 2 :
                            </label>
                          </div>
                        </Col>
                        <Col lg="6">
                            <ActiveEmployeeDropdown
                              register={register}
                              id={"supportEmployee2"}
                              selectedEmployee={data?.subEmployee2}
                              onEmployeeChange={(value)=>{
                                setData("subEmployee2",value);
                              }}
                              isRequired={true}
                              options={employees}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={errors.supportEmployee2 && "Employee is Required"}
                            />
                        </Col>

        </Row>
        <div style={{ textAlign: "end", marginTop: "20px" }}>
          <Button
            // disabled={issubmitting}
            size="md"
            color="primary"
            onClick={(e) => toggle()}
          >
            Save
          </Button>{" "}
          <Button
            // disabled={issubmitting}
            size="md"
            color="danger"
            onClick={(e) => {
              setData("subEmployee2",'');
              setData("subEmployee1",'');
            }}
          >
            Reset
            {/* {issubmitting ? <Spinner size={"sm"} /> : "Yes"} */}
          </Button>
        </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default EmployeeModal;
