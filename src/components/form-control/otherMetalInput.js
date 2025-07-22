import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Icon } from "../Component";
import { toastfunc } from "../sds-toast-style/toast-style";
import OtherMetalForm from '../common/modal/OtherMetalModal';

const OtherMetalWeightInputField = forwardRef((props, ref) => {
  const inputid = props?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0.000);
  const { register, reset } = useFormContext();
  
  const toggleModal = () => {
    if (props?.gross_weight > 0) {
      setIsModalOpen(!isModalOpen);
    } else {
      toastfunc("Please Enter the Gross Weight");
    }
  };


  useEffect(()=>{
        setTotalWeight(props?.value);
        setFormData(props?.otherMetalDetails);
  },[props?.value,props?.otherMetalDetails]);

  const handleSave = (data) => {
    setFormData(data);
    const otherMetalWeight = [...data].reduce((sum, item) => parseFloat(sum) + parseFloat(item.weight), 0);
    setTotalWeight(parseFloat(otherMetalWeight).toFixed(3));
    props.SetValue(parseFloat(otherMetalWeight).toFixed(3));
    props.SetOtherMetalDetails(data);
    toggleModal();
  };
  useImperativeHandle(ref, () => ({
    resetForm() {
      setTotalWeight(0);
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
        <Icon name="plus" onClick={props?.readOnly ?null :toggleModal} ></Icon>
      </div>
      <OtherMetalForm
        isOpen={isModalOpen} 
        toggle={toggleModal} 
        onSave={handleSave} 
        uom={props?.uom} 
        grossWeight={props?.gross_weight}
        lessWeight={props?.less_weight}
        initialOtherMetalDetails={formData}
        isDisabled={props?.isDisabled}

      />
      <input
        className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
        id={inputid}
        type="number"
        placeholder={props?.placeholder}
        tabIndex={11}
        readOnly
        {...register(inputid, {
          required: {
            value: props?.isRequired,
            message: "Gross weight is required",
          },
        })}
        value={parseFloat(totalWeight).toFixed(3)}
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

export default OtherMetalWeightInputField;
