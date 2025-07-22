import React, { useEffect } from "react";
import Select from "react-select";

const EmployeeDropdownMulti = ({
  register,
  setValue,
  clearErrors,
  selectedEmployees,
  onEmployeeChange,
  employees,
  isRequired,
  message,
  id,
  isMulti = true,
  classNamePrefix = "",
  ...props
}) => {
  const options = employees
    

  // "All" option
  const allOption = { label: "All", value: "all" };

  // Check if all employees are selected
  const isAllSelected = () =>
    selectedEmployees?.length === options?.length;

  // Options for Select component
  const allOptions = isAllSelected() ? options : [allOption, ...options];

  // Handle select change event
  const handleEmployeeSelectChange = (selectedOption) => {
    if (isMulti) {
      // If "All" selected, select all employees
      if (selectedOption?.some((opt) => opt.value === "all")) {
        const allValues = options.map((opt) => opt.value);
        onEmployeeChange(allValues);
        setValue(id, allValues);
      } else {
        const selectedValues = selectedOption?.map((opt) => opt.value) || [];
        onEmployeeChange(selectedValues);
        setValue(id, selectedValues);
      }
    } else {
      // Single select: selectedOption is an object or null
      const value = selectedOption?.value || "";
      onEmployeeChange(value);
      setValue(id, value);
    }
    clearErrors?.(id);
  };

  // Value for Select based on selectedEmployees
  const value = isMulti
    ? options.filter((opt) => selectedEmployees?.includes(opt.value))
    : options.find((opt) => opt.value === selectedEmployees) || null;

  // Sync react-hook-form's setValue on selectedEmployees change
  useEffect(() => {
    if (isMulti) {
      setValue(id, selectedEmployees || []);
    } else {
      setValue(id, selectedEmployees || "");
    }
    clearErrors?.(id);
  }, [selectedEmployees, setValue, clearErrors, id, isMulti]);

  return (
    <div className="form-group" style={{ width: props?.width }}>
      <div className="form-control-wrap">
        <Select
          isMulti={isMulti}
          value={value}
          onChange={handleEmployeeSelectChange}
          options={allOptions}
          placeholder="Select Employees"
          id={id}
          tabIndex={props?.tabIndex}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
              fontSize: "12px",
            }),
          }}
          classNamePrefix={classNamePrefix}
          isDisabled={props?.readOnly}
          isClearable
          {...props}
        />
        <input
          type="hidden"
          value={
            isMulti
              ? (selectedEmployees?.join(",") || "")
              : selectedEmployees || ""
          }
          {...register(id, { required: isRequired })}
        />
        {message && <span className="text-danger">{message}</span>}
      </div>
    </div>
  );
};

export default EmployeeDropdownMulti;

