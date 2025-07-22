import React, { useEffect } from "react";
import Select from "react-select";

const SizeDropdownMulti = ({
  register,
  setValue,
  clearErrors,
  selectedSize,
  onSizeChange,
  sizes,
  isRequired,
  message,
  ...props
}) => {
  const id = props?.id;
  

  const options =
    sizes?.map((val) => ({
      value: val.id_size,
      label: val.name,
    })) ?? [];

  const allOption = { label: "All", value: "all" };

  const isAllSelected = () => {
    return selectedSize?.length === options?.length;
  };

  const allOptions = isAllSelected() ? options : [allOption, ...options];

  const handleSizeSelectChange = (selectedOption) => {
    if (selectedOption.some((option) => option.value === "all")) {
      const value = selectedOption ? selectedOption.value : "";
      onSizeChange(options.map((option) => option.value));
      setValue(
        id,
        options.map((option) => option.value)
      );
      clearErrors?.(id);
    } else {
      const value = selectedOption ? selectedOption.value : "";
      onSizeChange(selectedOption.map((option) => option.value));
      //onDesignChange(value);
      setValue(
        id,
        selectedOption.map((option) => option.value)
      );
      clearErrors?.(id);
    }
  };

  const selectValue = options?.filter((option) =>
    selectedSize?.includes(option.value)
  );

  useEffect(() => {
    if (selectedSize) {
      setValue(id, selectedSize);
      clearErrors(id);
    }
  }, [selectedSize, setValue, clearErrors, id]);
  return (
    <div className="form-group" style={{ width: props?.width }}>
      <div className="form-control-wrap">
        <Select
          isMulti={true}
          value={selectValue}
          onChange={handleSizeSelectChange}
          options={allOptions}
          placeholder="Select Size"
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
          value={selectedSize || ""}
          {...register(id, { required: isRequired })}
        />
        {message && <span className="text-danger">{message}</span>}
      </div>
    </div>
  );
};

export default SizeDropdownMulti;
