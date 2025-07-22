import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Icon, NumberInputField, Row } from "../Component";
import { MetalDropdown } from "../filters/retailFilters";
import { useMetals } from "../filters/filterHooks";
import { useForm } from "react-hook-form";
import { toastfunc } from "../sds-toast-style/toast-style";

const RepairExtraWeightModal = ({ isOpen,modal, toggle, onSave,initialFormData }) => {
 const { metals } = useMetals();
 const {
     register,
     formState: { errors },
     setValue,
     clearErrors,
   } = useForm();

 let otherWeightDetailsObject = {
    "id_metal":"",
    "weight":""
 }

 const [otherWeightDetails ,setOtherWeightDetails] = useState([]);

 useEffect(() => {
    if (isOpen && initialFormData?.length > 0) {
        setOtherWeightDetails(initialFormData);
    }else{
        setOtherWeightDetails([otherWeightDetailsObject])
    }
}, [isOpen, initialFormData]);



const handleFormChange = (index, field, value) => {
    setOtherWeightDetails((prevValues) => {
        const updatedValues = [...prevValues];
        const updatedObject = { ...updatedValues[index] };
        updatedObject[field] = value;
        updatedValues[index] = updatedObject;
        return updatedValues;
    });
}

const addNewRow = () => {
    setOtherWeightDetails([...otherWeightDetails,otherWeightDetailsObject]);
  };

  const deleteCurrentRow = (deleteIndex) => {
    setOtherWeightDetails((prevState) =>prevState?.filter((_, index) => index !== deleteIndex));
  };

  const handleSubmit =() =>{
    let postData = [];
    for (const value of otherWeightDetails) {
        if(value.id_metal!='' && value.id_metal!=null && value.weight!='' && value.weight!=0){
            postData.push(value);
        }
    }
    if(postData.length > 0){
        console.log(postData);
        onSave(otherWeightDetails);
        setOtherWeightDetails([]);
        toggle();
    }else{
        toastfunc("Please Fill the All Details");
    }
    
  } 

  return (
    <Modal
      isOpen={modal}
      className="modal-dialog-centered text-center"
      size="xl"
      style={{ width: "40%" }}
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
        <span style={{ fontSize: "small" }}>{"Add Extra Weight"}</span>
      </ModalHeader>
      <ModalBody className="text-center ">
        <Row md={12}>
        
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Metal</th>
                  <th>Weight</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              {otherWeightDetails?.map((obj, index) => {
                    return (
                        <tr key={index}>
                            <td>
                            <MetalDropdown
                                    register={register}
                                    id={"id_metal_"+index}
                                    metals={metals}
                                    selectedMetal={obj?.id_metal}
                                    onMetalChange={(value) => {
                                        handleFormChange(index, "id_metal", value);
                                      }}
                                    isRequired={true}
                                    clearErrors={clearErrors}
                                    setValue={setValue}
                                    classNamePrefix="custom-select"
                                    placeholder={"Metal"}
                                    message={errors.metal && "Metal is Required"}
                                />
                            </td>
                            <td>
                                <NumberInputField
                                    placeholder="Weight"
                                    id={"weight_" + index}
                                    value={obj?.weight}
                                    isRequired={true}
                                    type={"number"}
                                    setValue={setValue}
                                    handleKeyDownEvents={true}
                                    handleDecimalDigits={true}
                                    decimalValues={0}
                                    SetValue={(value) => {
                                        handleFormChange(index, "weight", value);
                                    }}
                                    min={0}
                                    minError={"Weight should less than or equal to 0"}
                                    maxError={"Weight greater than or equal to 0"}
                                    reqValueError={"Weight is Required"}
                                    register={register}
                                    />
                            </td>
                            <td>
                                {index == otherWeightDetails?.length - 1 && (
                                    <Button
                                    color="primary"
                                    size="sm"
                                    className="btn-icon btn-white btn-dim"
                                    onClick={() => addNewRow()}
                                    >
                                    <Icon name="plus" />
                                    </Button>
                                )}
                                {index != 0 && (
                                         <Button
                                            color="primary"
                                            size="sm"
                                            className="btn-icon btn-white btn-dim"
                                            onClick={() => deleteCurrentRow(index)}
                                        >
                                            <Icon name="trash-fill" />
                                        </Button>
                                )}
                               
                            </td>
                        </tr>
                    )
              })}
              </tbody>
            </table>
        </Row>
      </ModalBody>
        <ModalFooter>
            <Button
            size="md"
            color="primary"
            onClick={handleSubmit}
            >
            Save
            </Button>
        </ModalFooter>
    </Modal>
  );
};

export default RepairExtraWeightModal;
