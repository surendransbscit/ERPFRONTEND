import React, { useEffect } from "react";
import Select from "react-select";

const SubDesignDropdownMulti = ({
  register,
  subDesigns,
  selectedSubDesign,
  onSubDesignChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  selectedProduct,
//   selectedDesign,
  products,
  width,
  ...props
}) => {
  if (selectedProduct) {
    const filteredSubDesigns = subDesigns?.filter((item) => item.id_product === selectedProduct);
    subDesigns = filteredSubDesigns;
  }
//   if (selectedProduct && selectedDesign) {
//     const filteredSubDesigns = subDesigns?.filter(
//       (item) => item.id_product === selectedProduct && item.id_design === selectedDesign
//     );
//     subDesigns = filteredSubDesigns;
//   }
  const options =
    subDesigns?.map((val) => ({
      value: val.id_sub_design,
      label: val.sub_design_name,
    })) ?? [];

  const allOption = { label: "All", value: "all" };

  const isAllSelected = () => {
    return selectedSubDesign?.length === options?.length;
  };

  const allOptions = isAllSelected() ? options : [allOption, ...options];

  const handleSubDesignSelectChange = (selectedOption) => {
    if (selectedOption.some((option) => option.value === "all")) {
      const value = selectedOption ? selectedOption.value : "";
      onSubDesignChange(options.map((option) => option.value));
      setValue(
        id,
        options.map((option) => option.value)
      );
      clearErrors?.(id);
    } else {
      const value = selectedOption ? selectedOption.value : "";
      onSubDesignChange(selectedOption.map((option) => option.value));
      //onDesignChange(value);
      setValue(
        id,
        selectedOption.map((option) => option.value)
      );
      clearErrors?.(id);
    }
  };
  const selectValue = options.filter((option) => selectedSubDesign?.includes(option.value));

  useEffect(() => {
    if (selectedSubDesign) {
      setValue(id, selectedSubDesign);
      clearErrors(id);
    }
  }, [selectedSubDesign, setValue, clearErrors, id]);

  return (
    <div className="form-group" style={{ width: width }}>
      <div className="form-control-wrap">
        <Select
          isMulti={true}
          value={selectValue}
          onChange={handleSubDesignSelectChange}
          options={allOptions}
          placeholder="Select Sub Des"
          id={id}
          tabIndex={props?.tabIndex}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }) }}
          {...props}
          isDisabled={props?.readOnly}
        />
        <input type="hidden" value={selectedSubDesign || ""} {...register(id, { required: isRequired })} />
        {message && <span className="text-danger">{message}</span>}
      </div>
    </div>
  );
};

export default SubDesignDropdownMulti;
