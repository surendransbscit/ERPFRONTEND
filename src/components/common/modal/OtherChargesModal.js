import React, { useEffect, useState } from "react";
import {Modal,ModalBody,ModalHeader,ModalFooter, Label } from "reactstrap";
import { useForm } from 'react-hook-form';
import { Col, Row,CancelButton, Icon, SaveButton } from "../../Component";
import IsRequired from "../../../components/erp-required/erp-required";
import { useActiveCharges } from "../../filters/filterHooks";
import { CategoryDropdown, OtherChargesDropdown, PurityDropdown } from "../../filters/retailFilters";
import { NumberInputField } from "../../form-control/InputGroup";
import PreviewTable from "../../sds-table/PreviewTable";
import { toastfunc } from "../../sds-toast-style/toast-style";
function OtherChargesForm({ isOpen, toggle,onSave,uom,initialOtherChargesDetails,...props}) {
    
  const { register,handleSubmit, formState: { errors },clearErrors,setValue,reset} = useForm();
  const { otherCharges } = useActiveCharges();
  const [formData, setFormData] = useState([]);
  const [selectedCharge, setSelectedCharge] = useState('');
  const [amount, setAmount] = useState();
  const [editIndex, setEditIndex] = useState(null);

  const columns = [
    { header: 'Charges', accessor: 'name' ,decimal_places:0},
    { header: 'Amount', accessor: 'amount' ,decimal_places:2,"textAlign":"right","isTotalReq":true,"isCurrency":true},
  ];

  const reset_form = ()=>{
    setSelectedCharge('');
    setAmount(0);
    clearErrors(); // Clear all errors
    reset();
  };

  useEffect(()=>{
    if(selectedCharge!==null && selectedCharge!==''){
        const chargesDetails = otherCharges.find((val) => val.id_other_charge === selectedCharge);
        setAmount(chargesDetails.amount);
    }
  },[otherCharges,selectedCharge])
  
  //Add items to preview and clear the form
  const addToPreview = async (data) => {
    const chargesDetails = otherCharges.find((val) => val.id_other_charge === selectedCharge);
    const newItem = {
      'name':chargesDetails.name,
      'selectedCharge': data.selectedCharge,
      'amount': data.amount
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
    setSelectedCharge(item.selectedCharge);
    setAmount(item.amount);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
  };

  const handleSave = () => {
    let totalOtherMetalWeight = 0;
    formData.forEach((val) => {
        totalOtherMetalWeight += parseFloat(val.weight);
    });
    if(parseFloat(totalOtherMetalWeight)>parseFloat(props?.gross_weight))
    {
        toastfunc("Other Metal weight is exceed than The Gross Weight");
    }else{
        onSave(formData);
        reset_form();
        setFormData([]);
        toggle();
    }
  };

  useEffect(() => {
    setValue('formData', JSON.stringify(formData));
  }, [formData, setValue]);

  useEffect(() => {
    if (isOpen) {
        if(initialOtherChargesDetails!==undefined){
            setFormData(initialOtherChargesDetails);
        }
    }
  }, [isOpen, initialOtherChargesDetails]);

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
          <span style={{ fontSize: "small" }}>Other Charges</span>
        </ModalHeader>
        <ModalBody>
            <Row md={12} className={"form-control-sm"}>
                    <Col md="4">
                        <Label>Select Type</Label>
                        <OtherChargesDropdown
                             register={register}
                             id={"selectedCharge"}
                             charges={otherCharges}
                             selectedCharge={selectedCharge}
                             onOtherChargeChange={setSelectedCharge}
                             isRequired={true}
                             clearErrors={clearErrors}
                             setValue={setValue}
                             message={errors.selectedCharge && "Charges is Required"}
                        >

                        </OtherChargesDropdown>
                    </Col>
                    <Col md="4">
                        <Label>Amount</Label>
                        <NumberInputField
                        register={register}
                        placeholder={"amount"}
                        id={"amount"}
                        name={"amount"}
                        value={amount}
                        minValue={0}
                        isRequired={false}
                        readOnly={false}
                        SetValue={setAmount}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        ></NumberInputField>  
                        {errors?.amount && (<span className="text-danger">{errors?.amount.message}</span>)}
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
                            Add Charge
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

export default OtherChargesForm