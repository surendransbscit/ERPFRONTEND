import React, { useEffect, useState } from "react";
import {Modal,ModalBody,ModalHeader,ModalFooter, Label } from "reactstrap";
import { useForm } from 'react-hook-form';
import { Col, Row,CancelButton, Icon, SaveButton } from "../../Component";
import IsRequired from "../../erp-required/erp-required";
import { NumberInputField, TextInputField } from "../../form-control/InputGroup";
import { toastsuccess } from "../../sds-toast-style/toast-style";
import { useDispatch } from "react-redux";
import { createArea, getAllArea } from "../../../redux/thunks/retailMaster";
const  AreaModalForm = ({ isOpen, toggle,onSave,...props}) => {
  const dispatch = useDispatch();
  const { register,handleSubmit, formState: { errors },clearErrors,setValue,reset} = useForm();



   //area
     const [area_name, setAreaName] = useState();
     const [pincode, setPincode] = useState();
     const [postal, setPostal] = useState();
     const [taluk, setTaluk] = useState();
      const saveArea = async () => {
         const adddata = {
           area_name,
           pincode : (pincode!=='' ? pincode :null),
           is_default: 0,
           is_active: 1,
           postal : (postal!=='' ? postal : null),
           taluk : (taluk!=='' ? taluk : null),
         };
         try {
           let response = await dispatch(createArea(adddata)).unwrap();

           const newArea = {
            value: response?.id_area,
            id_area: response?.id_area,
            area_name: area_name,
            is_default: false, // Set default value
           };
           reset();
           toastsuccess(area_name + " Added successfully");
           resetForm();
           toggle();
           dispatch(getAllArea());
           onSave(newArea);
         } catch (error) {
           console.error(error);
         }
       };

       const resetForm = () => {
        setAreaName("");
        setTaluk("");
        setPostal("");
        setPincode("");
      };

 
    
     
    return (
      <Modal className="modal-dialog modal-dialog-top modal-lg" isOpen={isOpen} toggle={toggle}>
        <ModalHeader
          tag="h6"
          className=""
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
          <span style={{ fontSize: "small" }}>Area</span>
        </ModalHeader>
        <ModalBody>
          <Row md={12} className="form-group row g-4">
                    <Col lg="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="area_name">
                          Name <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="3">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"area_name"}
                          placeholder="Area Name"
                          value={area_name}
                          SetValue={(value) => {
                            setAreaName(value);
                            clearErrors("area_name");
                          }}
                          message={errors.area_name && " area name is Required"}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col lg="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="pincode">
                          Pincode
                        </label>
                      </div>
                    </Col>
                    <Col lg="3">
                      <div className="form-group">
                        <NumberInputField
                          placeholder="Pincode"
                          id={"pincode"}
                          value={pincode}
                          isRequired={false}
                          register={register}
                          minLength={6}
                          maxLength={6}
                          min={100000}
                          max={999999}
                          reqValueError={"This field is required"}
                          minError={"Minimum value is 6"}
                          minLengthError={"Minimum length is 6 digits"}
                          maxLengthError={"Maximum length is 6 digits"}
                          maxError={"Max Length is 6"}
                          SetValue={(value) => {
                            setPincode(value);
                            clearErrors("pincode");
                          }}
                        />
                        {errors.pincode && <span className="text-danger">{errors.pincode.message}</span>}
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col lg="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Postal
                        </label>
                      </div>
                    </Col>
                    <Col lg="3">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={false}
                          id={"postal"}
                          placeholder="Postal Name"
                          value={postal}
                          SetValue={(value) => {
                            setPostal(value);
                            clearErrors("postal");
                          }}
                          message={errors.postal && " Postal name is Required"}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col lg="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="taluk">
                          Taluk
                        </label>
                      </div>
                    </Col>
                    <Col lg="3">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={false}
                          id={"taluk"}
                          placeholder="Taluk Name"
                          value={taluk}
                          SetValue={(value) => {
                            setTaluk(value);
                            clearErrors("taluk");
                          }}
                          message={errors.taluk && " Taluk name is Required"}
                        />
                      </div>
                    </Col>
                  </Row>
        </ModalBody>
        <ModalFooter>
            <Row>
                <Col lg="12" className="offset-lg-2">
                <div className="form-group mt-2">
                    <SaveButton
                    size="md"
                    color="primary"
                    onClick={handleSubmit(saveArea)}
                    >Save
                    </SaveButton>

                    <CancelButton
                    size="md"
                    color="danger"
                    onClick={toggle}
                    >Close
                    </CancelButton>

                </div>
                </Col>
            </Row>
        </ModalFooter>
       
      </Modal>
    );
  }

export default AreaModalForm