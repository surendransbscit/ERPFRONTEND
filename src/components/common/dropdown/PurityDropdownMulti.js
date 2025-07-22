import React, { useEffect } from "react";
import Select from "react-select";

const PurityDropdownMulti = ({
  register,
  setValue,
  clearErrors,
  selectedPurity,
  onPurityChange,
  purities,
  isRequired,
  message,
  ...props
}) => {
  const id = props?.id;

  const options =
    purities?.map((val) => ({
      value: val.id_purity,
      label: val.purity,
    })) ?? [];

  const allOption = { label: "All", value: "all" };

  const isAllSelected = () => {
    return selectedPurity?.length === options?.length;
  };

  const allOptions = isAllSelected() ? options : [allOption, ...options];


  const handlePuritySelectChange = (selectedOption) => {
    if (selectedOption.some((option) => option.value === "all")) {
      const value = selectedOption ? selectedOption.value : "";
      onPurityChange(options.map((option) => option.value));
      setValue(
        id,
        options.map((option) => option.value)
      );
      clearErrors?.(id);
    } else {
      const value = selectedOption ? selectedOption.value : "";
      onPurityChange(selectedOption.map((option) => option.value));
      //onDesignChange(value);
      setValue(
        id,
        selectedOption.map((option) => option.value)
      );
      clearErrors?.(id);
    }
  };

  const selectValue = options?.filter((option) =>
    selectedPurity?.includes(option.value)
  );

  useEffect(() => {
    if (selectedPurity) {
      setValue(id, selectedPurity);
      clearErrors(id);
    }
  }, [selectedPurity, setValue, clearErrors, id]);

  return (
    <>
      {props.label && (
        <label className="form-label" htmlFor="site-name">
          {props?.label}
        </label>
      )}
      {/* <div className="form-control-wrap" style={{ width: props?.width }}>
        <div className="form-control-select">
          <RSelect
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={props?.value}
            onChange={(e) => props.SetValue(e)}
            isMulti
            options={purityData}
          />
        </div>
      </div> */}
      <div className="form-group" style={{ width: props?.width }}>
        <div className="form-control-wrap">
          <Select
            isMulti={true}
            value={selectValue}
            onChange={handlePuritySelectChange}
            options={allOptions}
            placeholder="Select Purity"
            id={props?.id}
            tabIndex={props?.tabIndex}
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
                fontSize: "12px",
              }),
            }}
            {...props}
            isDisabled={props?.readOnly}
          />
          <input
            type="hidden"
            value={selectedPurity || ""}
            {...register(id, { required: isRequired })}
          />
          {message && <span className="text-danger">{message}</span>}
        </div>
      </div>
    </>
  );
};

export default PurityDropdownMulti;
