import React, { useEffect } from "react";
import Select from "react-select";

const MetalDropdownMulti = ({
  register,
  setValue,
  clearErrors,
  selectedMetal,
  onMetalChange,
  metals,
  isRequired,
  message,
  ...props
}) => {
  const id = props?.id;

  const options =
  metals?.map((val) => ({
      value: val.id_metal,
      label: val.metal_name,
    })) ?? [];

  const allOption = { label: "All", value: "all" };

  const isAllSelected = () => {
    return selectedMetal?.length === options?.length;
  };

  const allOptions = isAllSelected() ? options : [allOption, ...options];


  const handleSelectChange = (selectedOption) => {
    if (selectedOption.some((option) => option.value === "all")) {
      const value = selectedOption ? selectedOption.value : "";
      onMetalChange(options.map((option) => option.value));
      setValue(
        id,
        options.map((option) => option.value)
      );
      clearErrors?.(id);
    } else {
      const value = selectedOption ? selectedOption.value : "";
      onMetalChange(selectedOption.map((option) => option.value));
      //onDesignChange(value);
      setValue(
        id,
        selectedOption.map((option) => option.value)
      );
      clearErrors?.(id);
    }
  };

  const selectValue = options?.filter((option) =>
    selectedMetal?.includes(option.value)
  );

  useEffect(() => {
    if (selectedMetal) {
      setValue(id, selectedMetal);
      clearErrors(id);
    }
  }, [selectedMetal, setValue, clearErrors, id]);

  return (
    <>
      {props.label && (
        <label className="form-label" htmlFor="site-name">
          {props?.label}
        </label>
      )}
      <div className="form-group" style={{ width: props?.width }}>
        <div className="form-control-wrap">
          <Select
            isMulti={true}
            value={selectValue}
            onChange={handleSelectChange}
            options={allOptions}
            placeholder="Select Metal"
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
            value={selectedMetal || ""}
            {...register(id, { required: isRequired })}
          />
          {message && <span className="text-danger">{message}</span>}
        </div>
      </div>
    </>
  );
};

export default MetalDropdownMulti;
