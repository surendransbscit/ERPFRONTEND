import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Icon } from "../Component";
import OtherChargesForm from '../common/modal/OtherChargesModal';

const OtherChargesInput = forwardRef((props, ref) => {
  const inputid = props?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState([]);
  const [totalChargesAmount, setTotalChargesAmount] = useState(0.000);
  const { register, reset } = useFormContext();
  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  useEffect(()=>{
        setTotalChargesAmount(props?.value);
        setFormData(props?.otherChargesDetails);
  },[props?.value,props?.otherChargesDetails]);

  const handleSave = (data) => {
    setFormData(data);
    const otherChargesAmount = [...data].reduce((sum, item) => parseFloat(sum) + parseFloat(item.amount), 0);
    setTotalChargesAmount(parseFloat(otherChargesAmount).toFixed(2));
    props.SetValue(parseFloat(otherChargesAmount).toFixed(3));
    props.SetOtherChargesDetails(data);
    toggleModal();
  };
  useImperativeHandle(ref, () => ({
    resetForm() {
      setTotalChargesAmount(0);
      reset({
        [inputid]: 0, 
      });
    },
  }));

  const openStoneModal = (event,inputid) =>{
    if (event.key === 'Enter') {
        toggleModal();
    }
  }
  return (
    <div className={`form-control-wrap`}>
      <div className="form-icon form-icon-right">
        <Icon name="plus" onClick={toggleModal}></Icon>
      </div>
      <OtherChargesForm
        isOpen={isModalOpen} 
        toggle={toggleModal} 
        onSave={handleSave} 
        uom={props?.uom} 
        initialOtherChargesDetails={formData}
      />
      <input
        className="form-control form-control-sm no-spinner"
        onWheel={(e) => e.target.blur()}
        id={inputid}
        type="number"
        placeholder={props?.placeholder}
        readOnly
        {...register(inputid, {
          required: {
            value: props?.isRequired,
            message: "Gross weight is required",
          },
        })}
        tabIndex={props?.tabIndex}
        value={parseFloat(totalChargesAmount).toFixed(2)}
        onChange={(e) => {
          props?.SetValue(e.target.value);
          if (props.clearErrors) {
            props.clearErrors(inputid);
          }
        }}
        onClick={props?.readOnly ? null : toggleModal}
        onKeyDown={(event) => openStoneModal(event)}
      />
    </div>
  );
});

export default OtherChargesInput;
