import React, { useEffect } from "react";
import Select from "react-select";

const DesignDropdownMulti = ({
  register,
  designs,
  selectedDesign,
  onDesignChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  selectedProduct,
  products,
  resetSubDesign,
  width,
  ...props
}) => {
  if (selectedProduct) {
    const filteredDesigns = designs?.filter((item) => item.id_product === selectedProduct);
    designs = filteredDesigns;
  }

  const options = designs?.map((val) => ({
    value: val.id_design,
    label: val.design_name,
  }));

  const allOption = { label: "All", value: "all" };

  const isAllSelected = () => {
    return selectedDesign?.length === options?.length;
  };

  const allOptions = isAllSelected() ? options : [allOption, ...options];

  //   const handleChange = (selectedOptions) => {
  //     if (selectedOptions.some((option) => option.value === "all")) {
  //       //   props.SetValue(designData);
  //       onDesignChange(designData);
  //       setValue(id, designData);
  //       clearErrors(id);
  //     } else {
  //       //   props.SetValue(selectedOptions);
  //       onDesignChange(selectedOptions);
  //       setValue(id, designData);
  //       clearErrors(id);
  //     }
  //   };

  const handleDesignSelectChange = (selectedOption) => {
    if (selectedOption.some((option) => option.value === "all")) {
      const value = selectedOption ? selectedOption.value : "";
      onDesignChange(options.map((option) => option.value));
      setValue(
        id,
        options.map((option) => option.value)
      );
      clearErrors?.(id);
    } else {
      const value = selectedOption ? selectedOption.value : "";
      onDesignChange(selectedOption.map((option) => option.value));
      //onDesignChange(value);
      setValue(
        id,
        selectedOption.map((option) => option.value)
      );
      clearErrors?.(id);
    }
  };

  const selectValue = options?.filter((option) => selectedDesign?.includes(option.value));

  useEffect(() => {
    if (selectedDesign) {
      setValue(id, selectedDesign);
      clearErrors?.(id);
    }
  }, [selectedDesign, setValue, clearErrors, id]);

  return (
    <div className="form-group" style={{ width: width }}>
      <div className="form-control-wrap">
        <Select
          isMulti={true}
          value={selectValue}
          onChange={handleDesignSelectChange}
          options={allOptions}
          placeholder="Select Design"
          id={id}
          tabIndex={props?.tabIndex}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px", width: "120px" }) }}
          // style={{ width: "120px" }}
          {...props}
          isDisabled={props?.readOnly}
        />
        <input
          style={{ width: "120px" }}
          type="hidden"
          value={selectedDesign || ""}
          {...register(id, { required: isRequired })}
        />
        {message && <span className="text-danger">{message}</span>}
      </div>
    </div>
  );
};

export default DesignDropdownMulti;
