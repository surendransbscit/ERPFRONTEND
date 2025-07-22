import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Icon } from "../Component";
import StoneForm from "../common/modal/StoneModal";
import { toastfunc } from "../sds-toast-style/toast-style";
import { calculateLessWeight } from "../common/salesForm/salesUtils";

const LessWeightInputField = forwardRef((props, ref) => {
  const inputid = props?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0.0);
  const { register, reset } = useFormContext();

  const toggleModal = () => {
    if (props?.gross_weight > 0) {
      setIsModalOpen(!isModalOpen);
    } else {
      toastfunc("Please Enter the Gross Weight");
    }
  };

  useEffect(() => {
    setTotalWeight(props?.less_weight);
    setFormData(props?.stone_details);
  }, [props?.less_weight, props?.stone_details]);

  const handleSave = (data) => {
    setFormData(data);
    let calculatedStoneWeight = calculateLessWeight(data);
    setTotalWeight(parseFloat(calculatedStoneWeight.less_weight).toFixed(3));
    props.SetValue(parseFloat(calculatedStoneWeight.less_weight).toFixed(3));
    props.SetStnWeight(parseFloat(calculatedStoneWeight.stnWeight).toFixed(3));
    props.SetDiaWeight(parseFloat(calculatedStoneWeight.diaWeight).toFixed(3));
    props.SetStoneDetails(data);
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
    <div className={`form-control-wrap`} >
      <div className="form-icon form-icon-right" >
        <Icon name="plus" onClick={props?.readOnly ? null : toggleModal} style={{ fontSize: props?.iconfontSize ? props.iconfontSize : "20px" }}></Icon>
      </div>
      <StoneForm
        isOpen={isModalOpen}
        toggle={toggleModal}
        onSave={handleSave}
        uom={props?.uom}
        grossWeight={props?.gross_weight}
        otherMetalWeight={props?.other_metal_weight}
        initialStoneDetails={formData}
        isDisabled={props?.isDisabled}
        quality_code={props?.quality_code}
        stone={props?.stone}
      />
      <input
        className="form-control form-control-sm no-spinner"
        onWheel={(e) => e.target.blur()}
        id={inputid}
        type="number"
        placeholder={props?.placeholder}
        readOnly
        tabIndex={props?.tabIndex}
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

export default LessWeightInputField;
