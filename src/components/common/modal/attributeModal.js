import React, { useEffect, useState } from "react";
import {Modal,ModalBody,ModalHeader,ModalFooter, Label } from "reactstrap";
import { useForm } from 'react-hook-form';
import { Col, Row,CancelButton, Icon, SaveButton } from "../../Component";
import IsRequired from "../../erp-required/erp-required";
import { useActiveAttribute } from "../../filters/filterHooks";
import { AttributeDropdown } from "../../filters/retailFilters";
import { TextInputField } from "../../form-control/InputGroup";
import PreviewTable from "../../sds-table/PreviewTable";
import { toastfunc } from "../../sds-toast-style/toast-style";
const  AttributeModalForm = ({ isOpen, toggle,onSave,initialAttribute,...props}) => {
    
  const { register,handleSubmit, formState: { errors },clearErrors,setValue,reset} = useForm();
  const { attribute } = useActiveAttribute();
  const [formData, setFormData] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [attrValue, setAttrValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const columns = [
    { header: 'Name', accessor: 'name' ,decimal_places:0},
    { header: 'Value', accessor: 'attrValue'},
  ];

  const reset_form = ()=>{
    setSelectedAttribute('');
    setAttrValue('');
    clearErrors(); // Clear all errors
    reset();
  };

  
  
  //Add items to preview and clear the form
  const addToPreview = async (data) => {
    const attrDetails = attribute.find((val) => val.id_attribute === selectedAttribute);
    const newItem = {
      'name':attrDetails.attribute_name,
      'selectedAttribute': data.selectedAttribute,
      'attrValue': data.attrValue
    };
    if (editIndex !== null) {
      const updatedFormData = [...formData];
      updatedFormData[editIndex] = newItem;
      setFormData(updatedFormData);
      setEditIndex(null);
    } else {
      setFormData(prevData => [...prevData, newItem]);
    }
    reset_form();
  };

  const handleEdit = (index) => {
    const item = formData[index];
    setSelectedAttribute(item.selectedAttribute);
    setAttrValue(item.attrValue);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
  };

  const handleSave = () => {
        onSave(formData);
        reset_form();
        setFormData([]);
        toggle();
  };

  useEffect(() => {
    setValue('formData', JSON.stringify(formData));
  }, [formData, setValue]);

  useEffect(() => {
    if (isOpen) {
        if(initialAttribute!==undefined){
            setFormData(initialAttribute);
        }
    }
  }, [isOpen, initialAttribute]);

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
          <span style={{ fontSize: "small" }}>Attribute</span>
        </ModalHeader>
        <ModalBody>
            <Row md={12} className={"form-control-sm"}>
                    <Col md="4">
                        <Label>Select Attribute<IsRequired/></Label>
                        <AttributeDropdown
                             register={register}
                             id={"selectedAttribute"}
                             attribute={attribute}
                             selectedAttribute={selectedAttribute}
                             onAttributeChange={setSelectedAttribute}
                             isRequired={true}
                             clearErrors={clearErrors}
                             setValue={setValue}
                             message={errors.selectedAttribute && "Attribute is Required"}
                        >

                        </AttributeDropdown>
                    </Col>
                    <Col md="4">
                        <Label>Value<IsRequired/></Label>
                        <TextInputField
                        register={register}
                        placeholder={"value"}
                        id={"attrValue"}
                        name={"attrValue"}
                        value={attrValue}
                        isRequired={true}
                        readOnly={true}
                        SetValue={setAttrValue}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        ></TextInputField>  
                        {errors?.attrValue && (<span className="text-danger">{errors?.attrValue.message}</span>)}
                    </Col>
                    <Col md="4">
                        <br></br>
                        <SaveButton
                            size="md"
                            color="primary"
                            onClick={handleSubmit((data) =>
                            addToPreview(data)
                            )}
                            >
                            Add
                        </SaveButton>
                    </Col>
        </Row><hr></hr>
        <Row md={12} className="form-group row g-4">
              <PreviewTable columns={columns} data={formData!==undefined ? formData:[]} onEdit = {handleEdit} onDelete={handleDelete}  />
        </Row>
        </ModalBody>
        <ModalFooter>
            <Row>
              <Col lg="12" className="offset-lg-2">
                <div className="form-group mt-2">
                  <SaveButton
                    size="md"
                    color="primary"
                    onClick={handleSave}
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

export default AttributeModalForm