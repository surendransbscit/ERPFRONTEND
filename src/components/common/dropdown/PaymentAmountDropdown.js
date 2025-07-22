import React from "react";
import Select from "react-select";

const PaymentAmountDropdown = ({
  register,
  DropdownOptions,
  selectedValue,
  onDropDownChange,
  schemeDetails,
  SetPayableWeight,
  SetPayableAmount,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  type,
  ...props
}) => {
  const options = DropdownOptions?.map((obj) => ({
    value: obj.value,
    label: obj.value,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onDropDownChange(value);
    if (type==="amountDropDown") {
      SetPayableWeight((parseFloat(selectedOption.value) / parseFloat(schemeDetails?.todays_rate)).toFixed(2));
    }
    if(type==="weightDropDown"){
      SetPayableAmount((parseFloat(selectedOption.value) * parseFloat(schemeDetails?.todays_rate)).toFixed(2))
    }
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div className="form-control-wrap">
      <Select
        value={options?.find((option) => option.value === selectedValue) || null}
        onChange={handleSelectChange}
        options={options}
        placeholder="Select"
        id={id}
      />
      <input type="hidden" value={selectedValue || ""} {...register(id, { required: isRequired })} />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export default PaymentAmountDropdown;
