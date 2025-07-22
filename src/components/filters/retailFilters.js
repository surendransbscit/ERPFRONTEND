import React, { forwardRef, useEffect, useState } from "react";
import Select from "react-select";
import { secureStorage_login_branches } from "../../redux/configs";
import { Icon } from "../Component";
import { Button, Tooltip } from "reactstrap";
import AreaModalForm from "../common/modal/areaModal";
import { useDispatch, useSelector } from "react-redux";
import { getAllArea } from "../../redux/thunks/retailMaster";

export const CategoryDropdown = forwardRef(
  (
    {
      register,
      categories,
      selectedCategory,
      onCategoryChange,
      id,
      isRequired,
      message,
      setValue,
      clearErrors,
      resetPurity,
      resetProduct,
      resetDesign,
      resetSubDesign,
      ...props
    },
    ref
  ) => {
    let selectedMetal = props?.selectedMetal;
    if (selectedMetal) {
      const filteredCategory = categories?.filter(
        (category) => category.id_metal == selectedMetal
      );
      categories = filteredCategory;
    }
    let options = [];
    if (categories?.length > 0) {
      options = categories?.map((category) => ({
        value: category.id_category,
        label: category.cat_name,
      }));
    }

    const handleSelectChange = (selectedOption) => {
      const value = selectedOption ? selectedOption.value : "";
      if (onCategoryChange) {
        onCategoryChange(value);
      }
      setValue?.(id, value);
      clearErrors?.(id);
      resetPurity?.();
      resetProduct?.();
      resetDesign?.();
      resetSubDesign?.();
      onCategoryChange(value);
      setValue(id, value);
      clearErrors(id);
    };
    useEffect(() => {
      if (selectedCategory) {
        setValue(id, selectedCategory);
        clearErrors(id);
      }
    }, [selectedCategory, setValue, clearErrors, id]);

    return (
      <div>
        <Select
          {...props}
          value={
            options.find((option) => option.value === selectedCategory) || null
          }
          onChange={handleSelectChange}
          options={options}
          placeholder="Select Category"
          id={id}
          tabIndex={props?.tabIndex}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
          }}
          isDisabled={props?.readOnly}
          ref={ref}
          isClearable
        />
        <input
          type="hidden"
          value={selectedCategory || ""}
          {...register(id, { required: isRequired })}
        />
        {message && <span className="text-danger">{message}</span>}
      </div>
    );
  }
);

export const PurityDropdown = ({
  register,
  purities,
  selectedPurity,
  onPurityChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  selectedCategory,
  categories,
  ...props
}) => {
  if (selectedCategory) {
    const category = categories?.find(
      (cat) => cat.id_category === selectedCategory
    );
    if (category) {
      const filteredPurities = purities.filter((purity) =>
        category.id_purity.includes(purity.id_purity)
      );
      purities = filteredPurities;
    }
  }
  const options = purities?.map((purity) => ({
    value: purity.id_purity,
    label: purity.purity,
  }));
  const handlePuritySelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onPurityChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  useEffect(() => {
    if (selectedPurity) {
      setValue(id, selectedPurity);
      clearErrors(id);
    }
  }, [selectedPurity, setValue, clearErrors, id]);
  return (
    <div>
      <Select
        {...props}
        value={
          options?.find((option) => option.value === selectedPurity) || null
        }
        onChange={handlePuritySelectChange}
        options={options}
        placeholder="Select Purity"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        tabIndex={props?.tabIndex}
        isDisabled={props?.readOnly}
        isClearable
      />
      <input
        type="hidden"
        value={selectedPurity || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const StoneDropdown = ({
  register,
  stones,
  selectedStone,
  onStoneChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = stones?.map((stone) => ({
    value: stone.stone_id,
    label: stone.stone_name,
  }));
  const handleStoneSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onStoneChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedStone) || null
        }
        onChange={handleStoneSelectChange}
        options={options}
        placeholder="Stone"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        tabIndex={props?.tabIndex}
        isDisabled={props?.isDisabled}
        isClearable
      />
      <input
        type="hidden"
        value={selectedStone || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const QualityDropdown = ({
  register,
  quality_code,
  selectedQualitycode,
  onQualityCodeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = quality_code?.map((val) => ({
    value: val.quality_id,
    label: val.code,
  }));
  const handleQualityCodeSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onQualityCodeChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedQualitycode) ||
          null
        }
        onChange={handleQualityCodeSelectChange}
        options={options}
        placeholder="Quality Code"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        tabIndex={props?.tabIndex}
        isDisabled={props?.readOnly}
        isClearable
      />
      <input
        type="hidden"
        value={selectedQualitycode || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const CountryDropdown = ({
  register,
  countries,
  selectedCountry,
  onCountryChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = countries?.rows?.map((countries) => ({
    value: countries.id_country,
    label: countries.name,
    isDefault: countries.is_default,
  }));

  const defaultCountry = options?.find((option) => option.isDefault);

  useEffect(() => {
    if (!selectedCountry && defaultCountry) {
      handleSelectChange(defaultCountry);
    }
  }, [defaultCountry]);

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onCountryChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedCountry) ||
          defaultCountry ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Country"
        id={id}
        isClearable
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
      />
      <input
        type="hidden"
        value={selectedCountry || (defaultCountry ? defaultCountry.value : "")}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const DepartmentDropdown = ({
  register,
  departments,
  selectedDepartment,
  onDepartmentChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = departments?.map((department) => ({
    value: department.id_dept,
    label: department.name,
  }));

  // const defaultCountry = options?.find((option) => option.isDefault);

  // useEffect(() => {
  //   if (!selectedCountry && defaultCountry) {
  //     handleSelectChange(defaultCountry);
  //   }
  // }, [defaultCountry]);

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onDepartmentChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div style={{ position: "relative", zIndex: "999" }}>
      <Select
        value={
          options?.find((option) => option.value === selectedDepartment) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Department"
        id={id}
        isClearable
      />
      <input
        type="hidden"
        value={selectedDepartment || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const StateDropdown = ({
  register,
  states,
  selectedState,
  onStateChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = states?.rows?.map((states) => ({
    value: states.id_state,
    label: states.name,
    isDefault: states.is_default,
  }));

  const defaultState = options?.find((option) => option.isDefault);

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onStateChange(value);
    setValue(id, value);
    clearErrors(id);
  };

  useEffect(() => {
    if (!selectedState && defaultState) {
      handleSelectChange(defaultState);
    }
  }, [defaultState]);
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedState) ||
          defaultState ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select State"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedState || (defaultState ? defaultState.value : "")}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const ProductDropdown = forwardRef(
  (
    {
      register,
      products,
      selectedProduct,
      onProductChange,
      id,
      isRequired,
      message,
      setValue,
      clearErrors,
      selectedCategory,
      selectedMetal = null,
      categories,
      resetDesign,
      productType = null,
      placeholder = "Product",
      ...props
    },
    ref
  ) => {
    if (selectedCategory) {
      const filteredProducts = products.filter(
        (item) => item.cat_id === selectedCategory
      );
      products = filteredProducts;
    }
    if (
      selectedMetal != null &&
      selectedMetal != undefined &&
      selectedMetal != ""
    ) {
      const filteredProducts1 = products.filter(
        (item) => item.id_metal === selectedMetal
      );
      products = filteredProducts1;
    }
    if (productType != null && productType != undefined && productType != "") {
      const filteredProducts1 = products.filter(
        (item) => item.cat_type == productType
      );
      products = filteredProducts1;
    }
    const options = products?.map((val) => ({
      value: val.pro_id,
      label: val.product_name,
    }));
    const handleProductSelectChange = (selectedOption) => {
      const value = selectedOption ? selectedOption.value : "";
      onProductChange(value);
      setValue?.(id, value);
      clearErrors?.(id);
    };
    useEffect(() => {
      if (selectedProduct) {
        setValue?.(id, selectedProduct);
        clearErrors?.(id);
      }
    }, [selectedProduct, setValue, clearErrors, id]);
    return (
      <div>
        <Select
          {...props}
          ref={ref}
          value={
            options.find((option) => option.value === selectedProduct) || null
          }
          onChange={handleProductSelectChange}
          options={options}
          placeholder={placeholder}
          id={id}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
          }}
          tabIndex={props?.tabIndex}
          isDisabled={props?.readOnly}
          isClearable
        />
        <input
          type="hidden"
          value={selectedProduct || ""}
          {...register(id, { required: isRequired })}
        />
        {message && <span className="text-danger">{message}</span>}
      </div>
    );
  }
);

export const DesignDropdown = ({
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
  isMulti = false,
  ...props
}) => {
  if (selectedProduct) {
    const filteredDesigns = designs.filter(
      (item) => item.id_product === selectedProduct
    );
    designs = filteredDesigns;
  }
  const options = designs?.map((val) => ({
    value: val.id_design,
    label: val.design_name,
  }));
  const handleDesignSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onDesignChange(
      isMulti ? selectedOption.map((option) => option.value) : value
    );
    //onDesignChange(value);
    setValue(
      id,
      isMulti ? selectedOption.map((option) => option.value) : value
    );
    clearErrors?.(id);
  };
  const selectValue = isMulti
    ? options?.filter((option) => selectedDesign?.includes(option.value))
    : options?.find((option) => option.value === selectedDesign) || null;

  useEffect(() => {
    if (selectedDesign) {
      setValue(id, selectedDesign);
      clearErrors?.(id);
    }
  }, [selectedDesign, setValue, clearErrors, id]);

  return (
    <div>
      <Select
        {...props}
        isMulti={isMulti}
        value={selectValue}
        onChange={handleDesignSelectChange}
        options={options}
        placeholder="Design"
        id={id}
        tabIndex={props?.tabIndex}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isDisabled={props?.readOnly}
        isClearable
      />
      <input
        type="hidden"
        value={selectedDesign || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const SubDesignDropdown = ({
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
  selectedDesign,
  products,
  isMulti = false,
  ...props
}) => {
  if (selectedProduct) {
    const filteredSubDesigns = subDesigns?.filter(
      (item) => item.id_product === selectedProduct
    );
    subDesigns = filteredSubDesigns;
  }
  if (selectedProduct && selectedDesign) {
    const filteredSubDesigns = subDesigns?.filter(
      (item) =>
        item.id_product === selectedProduct && item.id_design === selectedDesign
    );
    subDesigns = filteredSubDesigns;
  }
  const options =
    subDesigns?.map((val) => ({
      value: val.id_sub_design,
      label: val.sub_design_name,
    })) ?? [];

  const handleSubDesignSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onSubDesignChange(
      isMulti ? selectedOption.map((option) => option.value) : value
    );
    setValue(
      id,
      isMulti ? selectedOption.map((option) => option.value) : value
    );
    clearErrors(id);
  };
  const selectValue = isMulti
    ? options.filter((option) => selectedSubDesign?.includes(option.value))
    : options.find((option) => option.value === selectedSubDesign) || null;

  useEffect(() => {
    if (selectedSubDesign) {
      setValue(id, selectedSubDesign);
      clearErrors(id);
    }
  }, [selectedSubDesign, setValue, clearErrors, id]);

  return (
    <div>
      <Select
        {...props}
        isMulti={isMulti}
        value={selectValue}
        onChange={handleSubDesignSelectChange}
        options={options}
        placeholder="Select Sub Des"
        id={id}
        tabIndex={props?.tabIndex}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isDisabled={props?.readOnly}
        isClearable
      />
      <input
        type="hidden"
        value={selectedSubDesign || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const CityDropdown = ({
  register,
  cities,
  selectedCity,
  onCityChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = cities?.rows?.map((cities) => ({
    value: cities.id_city,
    label: cities.name,
    isDefault: cities.is_default,
  }));

  const defaultCity = options?.find((option) => option.isDefault);

  useEffect(() => {
    if (!selectedCity && defaultCity) {
      handleSelectChange(defaultCity);
    }
  }, [defaultCity]);

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onCityChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedCity) ||
          defaultCity ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select City"
        id={id}
        isClearable
      />
      <input
        type="hidden"
        value={selectedCity || (defaultCity ? defaultCity.value : "")}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const AreaDropdown = ({
  register,
  areas,
  selectedArea,
  onAreaChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newArea, setNewArea] = useState(null);

  const options = areas?.rows?.map((areas) => ({
    value: areas.id_area,
    label: areas.area_name,
    isDefault: areas.is_default,
  }));
  const defaultArea = options?.find((option) => option.isDefault);
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onAreaChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  useEffect(() => {
    if (!selectedArea && !newArea && defaultArea) {
      handleSelectChange(defaultArea);
    }
  }, [defaultArea]);

  // Open modal on button click
  const handleAddNewArea = () => {
    setIsModalOpen(true);
  };

  const handleNewAreaAdded = (area) => {
    setNewArea(area);
  };

  useEffect(() => {
    if (newArea) {
      handleSelectChange(newArea);
    }
  }, [newArea]);

  // Close modal handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="input-group">
      <div style={{ width: "75%" }}>
        <Select
          value={
            options?.find((option) => option.value === selectedArea) ||
            defaultArea ||
            null
          }
          onChange={handleSelectChange}
          options={options}
          placeholder="Select Area"
          id={id}
          isClearable
        />
        <input
          type="hidden"
          value={selectedArea || (defaultArea ? defaultArea.value : "")}
          {...register(id, { required: isRequired })}
        />
      </div>

      <div className="input-group-append">
        <Button
          outline
          color="primary"
          className="btn-dim"
          onClick={handleAddNewArea}
        >
          <em class="icon ni ni-plus"></em>
        </Button>

        {/* Modal Component */}
        <AreaModalForm
          isOpen={isModalOpen}
          toggle={toggleModal}
          onSave={handleNewAreaAdded}
          onClose={handleCloseModal}
        />
      </div>
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const ProfessionDropdown = ({
  register,
  professions,
  selectedProfession,
  onProfessionChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = professions?.map((item) => ({
    value: item.id_profession,
    label: item.profession_name,
    isDefault: item.is_default,
  }));
  const defaultProfession = options?.find((option) => option.isDefault);
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onProfessionChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  useEffect(() => {
    if (!selectedProfession && defaultProfession) {
      handleSelectChange(defaultProfession);
    }
  }, [defaultProfession]);
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedProfession) ||
          defaultProfession ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Profession"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={
          selectedProfession ||
          (defaultProfession ? defaultProfession.value : "")
        }
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const SchemeDropdown = ({
  register,
  schemes,
  selectedScheme,
  onSchemeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = schemes?.map((scheme) => ({
    value: scheme.scheme_id,
    label: scheme.name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onSchemeChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedScheme) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Scheme"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedScheme || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const CustomerMultiSchemeDropdown = ({
  register,
  schemes,
  selectedScheme,
  onSchemeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = schemes?.map((scheme) => ({
    value: scheme.scheme_id,
    label: scheme.name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onSchemeChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedScheme) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Scheme"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedScheme || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const ContainerDropdown = ({
  register,
  containers,
  selectedContainer,
  onContainerChange,
  id,
  disabled,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = containers?.map((item) => ({
    value: item.id_container,
    label: item.container_name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onContainerChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        isDisabled={disabled}
        value={
          options?.find((option) => option.value === selectedContainer) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Container"
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        id={id}
        isClearable
      />
      <input
        type="hidden"
        value={selectedContainer || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const BranchDropdown = forwardRef(
  (
    {
      register,
      branches,
      selectedBranch,
      onBranchChange,
      id,
      disabled,
      isRequired,
      message,
      setValue,
      clearErrors,
      classNamePrefix = "",
      ...props
    },
    ref
  ) => {
    const options = branches?.map((branch) => ({
      value: branch.id_branch,
      label: branch.name,
    }));

    const defaultBranch = options?.find(
      (option) => option.value === secureStorage_login_branches[0]
    );

    useEffect(() => {
      if (secureStorage_login_branches?.length <= 1) {
        if (!selectedBranch && defaultBranch) {
          handleSelectChange(defaultBranch);
        }
      }
      if (selectedBranch != null && selectedBranch != "") {
        setValue(id, selectedBranch);
      }
    }, [defaultBranch, selectedBranch, secureStorage_login_branches]);

    const handleSelectChange = (selectedOption) => {
      const value = selectedOption ? selectedOption.value : "";
      onBranchChange(value);
      setValue(id, value);
      clearErrors(id);
    };
    return (
      <div>
        <Select
          ref={ref}
          isDisabled={disabled}
          value={
            options?.find((option) => option.value === selectedBranch) || null
          }
          onChange={handleSelectChange}
          options={options}
          placeholder={
            props?.placeholder ? props?.placeholder : "Select Branch"
          }
          id={id}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
          }}
          tabIndex={props?.tabIndex}
          classNamePrefix={classNamePrefix}
          isClearable
        />
        <input
          type="hidden"
          value={selectedBranch || (defaultBranch ? defaultBranch.value : "")}
          {...register(id, { required: isRequired })}
        />
        {message && (
          <span className="text-danger">
            <Icon className={"sm"} name="alert-circle" />
            {message}
          </span>
        )}
      </div>
    );
  }
);

export const CreditTypeDropdown = ({
  register,
  selectedType,
  onTypeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = [
    { value: 1, label: "Issue" },
    { value: 2, label: "Invoice" },
  ];

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onTypeChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={options?.find((option) => option.value === selectedType) || null}
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Credit Type"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        tabIndex={props?.tabIndex}
        isClearable
      />
      <input
        type="hidden"
        value={selectedType || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const ReceiptTypeDropdown = ({
  register,
  typeVal,
  selectedType,
  onTypeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const {
    userInfo: { issue_reciept_settings },
  } = useSelector((state) => state.authUserReducer);
  // const options = [
  //   { value: 1, label: "Genral Advance" },
  //   { value: 2, label: "Order Adavance" },
  //   // { value: 3, label: "Advance Deposit" },
  //   // { value: 4, label: "Import" },
  //   { value: 5, label: "Credit Collection" },
  //   { value: 6, label: "Repair Order Delivery" },
  //   { value: 7, label: "Opening Balance" },
  //   { value: 8, label: "Chit Deposit" },
  // ];

  const allOptions = [
    { value: 1, label: "Genral Advance", key: "show_reciept_genadvnc_option" },
    { value: 2, label: "Order Adavance", key: "show_reciept_ordadvnc_option" },
    {
      value: 5,
      label: "Credit Collection",
      key: "show_reciept_credcoll_option",
    },
    {
      value: 6,
      label: "Repair Order Delivery",
      key: "show_reciept_repord_delivery_option",
    },
    { value: 7, label: "Opening Balance", key: "show_reciept_openbal_option" },
    { value: 8, label: "Chit Deposit", key: "show_reciept_chitdepo_option" },
    { value: 9, label: "Others", key: "show_reciept_others_option" },
  ];

  const filteredOptions = allOptions?.filter(
    (opt) => issue_reciept_settings?.[opt.key]
  );

  const defaultType = filteredOptions?.find((option) => option.value === 1);

  useEffect(() => {
    if (typeVal == 2) {
      if (!selectedType && defaultType) {
        handleSelectChange(defaultType);
      }
    }
  }, [defaultType, typeVal]);

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onTypeChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          filteredOptions?.find((option) => option.value === selectedType) ||
          null
        }
        onChange={handleSelectChange}
        options={filteredOptions}
        placeholder="Select Receipt Type"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        tabIndex={props?.tabIndex}
        autoFocus={true}
        isClearable
      />
      <input
        type="hidden"
        value={selectedType || (defaultType ? defaultType.value : "")}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const ActiveEmployeeDropdown = ({
  register,
  selectedEmployee,
  onEmployeeChange,
  id,
  options,
  isRequired,
  message,
  setValue,
  clearErrors,
  classNamePrefix = "",
  ...props
}) => {
  // const options = [
  //   { value: 1, label: "General" },
  //   { value: 2, label: "Against Order" },
  //   { value: 3, label: "Advance Deposit" },
  //   { value: 4, label: "Import" },
  // ];

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onEmployeeChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedEmployee) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder={
          props?.placeholder ? props?.placeholder : "Select Employee"
        }
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        tabIndex={props?.tabIndex}
        classNamePrefix={classNamePrefix}
        isClearable
      />
      <input
        type="hidden"
        value={selectedEmployee || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const IssueTypeDropdown = ({
  register,
  selectedType,
  onTypeChange,
  id,
  typeVal,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  // let options = [
  //   { value: 1, label: "Credit" },
  //   { value: 2, label: "Refund" },
  //   { value: 3, label: "Petty Cash" },
  //   { value: 5, label: "Bank Deposit" },
  // ];

  const {
    userInfo: { issue_reciept_settings },
  } = useSelector((state) => state.authUserReducer);

  const allOptions = [
    { value: 1, label: "Credit", key: "show_issue_credit_option" },
    { value: 2, label: "Refund", key: "show_issue_refund_option" },
    { value: 3, label: "Petty Cash", key: "show_issue_pettycash_option" },
    { value: 5, label: "Bank Deposit", key: "show_issue_bankdeposit_option" },
  ];

  let options = allOptions?.filter((opt) => issue_reciept_settings?.[opt.key]);

  // if (props?.limitedOptions) {
  //   options = [
  //     { value: 3, label: "Petty Cash" },
  //     { value: 5, label: "Bank Deposit" },
  //   ];
  // }

  if (props?.limitedOptions) {
    options = options?.filter(
      (opt) => [3, 5].includes(opt.value) // Only keep Petty Cash and Bank Deposit
    );
  }

  const defaultType = options?.find((option) => option.value === 3);

  useEffect(() => {
    if (typeVal == 1) {
      if (!selectedType && defaultType) {
        handleSelectChange(defaultType);
      }
    }
  }, [defaultType, typeVal]);

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onTypeChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={options?.find((option) => option.value === selectedType) || null}
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Issue Type"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        tabIndex={props?.tabIndex}
        isClearable
      />
      <input
        type="hidden"
        value={selectedType || (defaultType ? defaultType.value : "")}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const IssueToDropdown = ({
  register,
  selectedType,
  onTypeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = [
    { value: 1, label: "Customer" },
    { value: 2, label: "Employee" },
    { value: 3, label: "Others" },
  ];

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onTypeChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={options?.find((option) => option.value === selectedType) || null}
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Issue To"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        tabIndex={props?.tabIndex}
        isClearable
      />
      <input
        type="hidden"
        value={selectedType || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const SchemeClassificationDropdown = ({
  register,
  schemesclass,
  selectedSchemeClass,
  onSchemeClassChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = schemesclass?.map((schemesclass) => ({
    value: schemesclass.id_classification,
    label: schemesclass.classification_name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onSchemeClassChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedSchemeClass) ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Scheme Class"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedSchemeClass || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const MetalDropdown = ({
  register,
  metals,
  selectedMetal,
  onMetalChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  placeholder = "Select Metal",
  ...props
}) => {
  const options = metals?.map((metals) => ({
    value: metals.id_metal,
    label: metals.metal_name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    if (onMetalChange) {
      onMetalChange(value);
    }
    setValue(id, value);
    if (clearErrors) {
      clearErrors(id);
    }
  };
  return (
    <div>
      <Select
        isDisabled={props?.isDisabled}
        value={
          options?.find((option) => option.value === selectedMetal) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder={placeholder}
        id={id}
        classNamePrefix={props?.classNamePrefix}
        tabIndex={props?.tabIndex}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedMetal || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const GroupByOptionsDropdown = ({
  register,
  groupByOpts,
  groupByVal,
  SetGroupByVal,
  onGroupByChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = groupByOpts?.map((obj) => ({
    value: obj.value,
    label: obj.label,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption : "";
    onGroupByChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        isMulti
        value={groupByVal}
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Group By"
        id={id}
        isClearable
      />
      <input
        type="hidden"
        value={groupByVal || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const UomDropdown = ({
  register,
  uomOptions,
  selectedUom,
  onUomChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = uomOptions?.map((uom) => ({
    value: uom.uom_id,
    label: uom.uom_name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";

    if (onUomChange) {
      onUomChange(value);
    }

    setValue?.(id, value);
    clearErrors?.(id);
  };
  return (
    <div style={{ position: "relative", zIndex: "999" }}>
      <Select
        value={options?.find((option) => option.value === selectedUom) || null}
        onChange={handleSelectChange}
        options={options}
        placeholder="Select UOM"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedUom || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const CutDropdown = ({
  register,
  cutOptions,
  selectedCut,
  onCutChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = cutOptions?.map((cut) => ({
    value: cut.id_cut,
    label: cut.cut,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onCutChange?.(value);
    setValue?.(id, value);
    clearErrors?.(id);
  };
  return (
    <div style={{ position: "relative", zIndex: "999" }}>
      <Select
        value={options?.find((option) => option.value === selectedCut) || null}
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Cut"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedCut || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const ColorDropdown = ({
  register,
  colorOptions,
  selectedColor,
  onColorChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = colorOptions?.map((color) => ({
    value: color.id_color,
    label: color.color,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onColorChange?.(value);
    setValue?.(id, value);
    clearErrors?.(id);
  };
  return (
    <div style={{ position: "relative", zIndex: "999" }}>
      <Select
        value={
          options?.find((option) => option.value === selectedColor) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Color"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedColor || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const ShapeDropdown = ({
  register,
  shapeOptions,
  selectedShape,
  onShapeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = shapeOptions?.map((shape) => ({
    value: shape.id_ret_shape,
    label: shape.shape,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onShapeChange?.(value);
    setValue?.(id, value);
    clearErrors?.(id);
  };
  return (
    <div style={{ position: "relative", zIndex: "999" }}>
      <Select
        value={
          options?.find((option) => option.value === selectedShape) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Shape"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedShape || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const ClarityDropdown = ({
  register,
  clarityOptions,
  selectedClarity,
  onClarityChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = clarityOptions?.map((clarity) => ({
    value: clarity.id_clarity,
    label: clarity.clarity,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onClarityChange?.(value);
    setValue?.(id, value);
    clearErrors?.(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedClarity) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Clarity"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedClarity || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const ProductCalculationTypeDropdown = ({
  register,
  product_Calculation_Types,
  selectedCalType,
  onCalTypeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  placeholder,
  ...props
}) => {
  const options = product_Calculation_Types.map((calType) => ({
    value: calType.id_calculation_type,
    label: calType.name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onCalTypeChange?.(value);
    setValue?.(id, value);
    clearErrors?.(id);
  };
  return (
    <div>
      <Select
        value={
          options.find((option) => option.value === selectedCalType) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder={placeholder}
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedCalType || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const TaxGroupDropdown = ({
  register,
  tax_Group,
  selectedTax_Group,
  id,
  isRequired,
  message,
  setValue,
  taxOnChange,
  clearErrors,
  placeholder,
  ...props
}) => {
  const options = tax_Group.map((calType) => ({
    value: calType.tgrp_id,
    label: calType.tgrp_name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setValue?.(id, value);
    clearErrors?.(id);
    taxOnChange?.(value);
  };
  return (
    <div>
      <Select
        value={
          options.find((option) => option.value === selectedTax_Group) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder={props?.placeholder}
        id={id}
        isClearable
      />
      <input
        type="hidden"
        value={selectedTax_Group || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const CompanyDropdown = ({
  register,
  companies,
  selectedCompany,
  onCompanyChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = companies?.rows?.map((companies) => ({
    value: companies.id_company,
    label: companies.company_name,
  }));

  const defaultCompany = options?.find(
    (option) => option.id_company == options[0]?.id_company
  );

  useEffect(() => {
    if (!selectedCompany && defaultCompany) {
      handleSelectChange(defaultCompany);
    }
  }, [defaultCompany]);

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onCompanyChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedCompany) ||
          defaultCompany ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Company"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedCompany || (defaultCompany ? defaultCompany.value : "")}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const SupplierDropdown = forwardRef(
  (
    {
      register,
      supplier,
      showOnlyIsComplementarySupplier,
      selectedSupplier,
      onSupplierChange,
      id,
      isRequired,
      message,
      setValue,
      clearErrors,
      selectedSupplierLabel,
      ...props
    },
    ref
  ) => {
    const filteredSuppliers = showOnlyIsComplementarySupplier
      ? supplier?.filter((val) => val.is_vendor === 4)
      : supplier;

    const options = filteredSuppliers?.map((val) => ({
      value: val.id_supplier,
      label: val.supplier_name,
    }));
    const handleSupplierSelectChange = (selectedOption) => {
      const value = selectedOption ? selectedOption.value : "";
      const label = selectedOption ? selectedOption.label : "";
      onSupplierChange(value);
      selectedSupplierLabel?.(label);
      setValue(id, value);
      clearErrors(id);
    };
    return (
      <div>
        <Select
          value={
            options.find((option) => option.value === selectedSupplier) || null
          }
          onChange={handleSupplierSelectChange}
          options={options}
          placeholder={props?.placeholder ? props.placeholder : "Supplier"}
          id={id}
          tabIndex={props?.tabIndex}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
          }}
          classNamePrefix={props?.classNamePrefix}
          ref={ref}
          isClearable
        />
        <input
          type="hidden"
          value={selectedSupplier || ""}
          {...register(id, { required: isRequired })}
        />
        {message && <span className="text-danger">{message}</span>}
      </div>
    );
  }
);

export const TaxMasterDropdown = ({
  register,
  taxMaster,
  selectedTaxMaster,
  onTaxMasterChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = taxMaster?.map((taxMaster) => ({
    value: taxMaster.tax_id,
    label: taxMaster.tax_name,
    isDefault: taxMaster.is_default,
  }));

  const defaultTaxMaster = options?.find((option) => option.isDefault);

  useEffect(() => {
    if (!selectedTaxMaster && defaultTaxMaster) {
      handleSelectChange(defaultTaxMaster);
    }
  }, [defaultTaxMaster]);

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onTaxMasterChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        isDisabled={props?.isDisabled}
        value={
          options?.find((option) => option.value === selectedTaxMaster) ||
          defaultTaxMaster ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Tax"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={
          selectedTaxMaster || (defaultTaxMaster ? defaultTaxMaster.value : "")
        }
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const LotDropdown = ({
  register,
  lot,
  selectedLot,
  onLotChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  let options = [];
  if (lot.length > 0) {
    options = lot?.map((val) => ({
      value: val.lot_no,
      label: val.lot_code,
    }));
  }

  const handleLotSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onLotChange?.(value);
    setValue?.(id, value);
    clearErrors?.(id);
  };
  return (
    <div>
      <Select
        value={options.find((option) => option.value === selectedLot) || null}
        onChange={handleLotSelectChange}
        options={options}
        placeholder="Select Lot"
        id={id}
        tabIndex={props?.tabIndex}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedLot || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

// export const SectionDropdown = ({
//   register,
//   sectionOptions,
//   selectedSection,
//   onSectionChange,
//   id,
//   isRequired,
//   message,
//   setValue,
//   clearErrors,
//   isMulti,
//   classNamePrefix = "",
//   ...props
// }) => {
//   if (props?.selectedProduct) {
//     const filteredSections = sectionOptions.filter(
//       (item) => item.id_product === props?.selectedProduct
//     );
//     sectionOptions = filteredSections;
//   }
//   const options = sectionOptions?.map((section) => ({
//     value: section.id_section,
//     label: section.section_name,
//   }));

//   useEffect(() => {
//     if (isMulti) {
//       const value = selectedSection ? selectedSection.value : "";
//       setValue(
//         id,
//         isMulti
//           ? selectedSection.map((option) =>
//               option.value ? option.value : option
//             )
//           : value
//       );
//     }
//   }, [setValue, isMulti, selectedSection]);

//   useEffect(() => {
//     if (!isMulti) {
//       const value = selectedSection?.value || selectedSection;
//       setValue(id, value || "");
//     }
//   }, [setValue, id, selectedSection, isMulti]);

//   const handleSelectChange = (selectedOption) => {
//     const value = selectedOption ? selectedOption.value : "";
//     onSectionChange(
//       isMulti ? selectedOption.map((option) => option.value) : value
//     );
//     // setValue(id,isMulti ? selectedOption.map((option) => option.value) : value);
//     clearErrors?.(id);
//   };
//   return (
//     <>
//       <Select
//         isMulti={isMulti}
//         value={
//           isMulti
//             ? options?.filter((option) =>
//                 selectedSection?.includes(option.value)
//               )
//             : options?.find((option) => option.value === selectedSection) ||
//               null
//         }
//         onChange={handleSelectChange}
//         options={options}
//         placeholder="Select Section"
//         id={id}
//         menuPortalTarget={document.body}
//         tabIndex={props?.tabIndex}
//         styles={{
//           menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
//         }}
//         isDisabled={props?.readOnly}
//         isClearable
//         classNamePrefix={classNamePrefix}
//       />

//       <input
//         type="hidden"
//         value={
//           (isMulti
//             ? selectedSection.map((option) =>
//                 option.value ? option.value : option
//               )
//             : selectedSection) || ""
//         }
//         {...register(id, { required: isRequired })}
//       />
//       {message && <span className="text-danger">{message}</span>}
//     </>
//   );
// };

export const SectionDropdown = ({
  register,
  sectionOptions = [],
  selectedSection,
  onSectionChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  isMulti = false,
  classNamePrefix = "",
  ...props
}) => {
  // Optional filtering by product
  if (props?.selectedProduct) {
    sectionOptions = sectionOptions.filter(
      (item) => item.id_product === props.selectedProduct
    );
  }

  // Format options
  const options = sectionOptions.map((section) => ({
    value: section.id_section ?? section.value,
    label: section.section_name ?? section.label,
  }));

  // Format hidden input value
  useEffect(() => {
    if (isMulti) {
      const value = Array.isArray(selectedSection)
        ? selectedSection.map((opt) => opt?.value ?? opt)
        : [];
      setValue(id, value);
    } else {
      const value = selectedSection?.value ?? selectedSection ?? "";
      setValue(id, value);
    }
  }, [setValue, id, isMulti, selectedSection]);

  // Handle dropdown change
  const handleSelectChange = (selectedOption) => {
    const value = isMulti
      ? (selectedOption || []).map((option) => option.value)
      : selectedOption?.value ?? "";

    onSectionChange?.(value);
    clearErrors?.(id);
  };

  // Set value for react-select
  const selectedValue = isMulti
    ? options.filter((opt) =>
        Array.isArray(selectedSection)
          ? selectedSection.some(
              (sel) => sel?.value === opt.value || sel === opt.value
            )
          : false
      )
    : options.find(
        (opt) =>
          opt.value === selectedSection?.value ||
          opt.value === selectedSection
      ) || null;

  return (
    <>
      <Select
        isMulti={isMulti}
        value={selectedValue}
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Section"
        id={id}
        menuPortalTarget={document.body}
        tabIndex={props?.tabIndex}
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
            fontSize: "12px",
          }),
        }}
        isDisabled={props?.readOnly}
        isClearable
        classNamePrefix={classNamePrefix}
      />

      <input
        type="hidden"
        value={
          isMulti
            ? (Array.isArray(selectedSection)
                ? selectedSection.map((opt) => opt?.value ?? opt)
                : [])
            : selectedSection?.value ?? selectedSection ?? ""
        }
        {...register(id, { required: isRequired })}
      />

      {message && <span className="text-danger">{message}</span>}
    </>
  );
};


export const SizeDropdown = ({
  register,
  size,
  selectedSize,
  onSizeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  selectedProduct,
  isMulti = false,
  products,
  ...props
}) => {
  if (selectedProduct) {
    const filteredSize = size?.filter(
      (item) => item.id_product === selectedProduct
    );
    const filteredproducts = products?.find(
      (item) => item.pro_id === selectedProduct
    );
    size = filteredSize;
    if (isRequired === undefined) {
      isRequired = parseInt(filteredproducts.has_size) === 1;
    }
  }
  const options = size?.map((val) => ({
    value: val.id_size,
    label: val.name,
  }));
  const handleSizeSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onSizeChange(
      isMulti ? selectedOption.map((option) => option.value) : value
    );
    setValue(
      id,
      isMulti ? selectedOption.map((option) => option.value) : value
    );
    clearErrors?.(id);
  };
  const selectValue = isMulti
    ? options?.filter((option) => selectedSize?.includes(option.value))
    : options?.find((option) => option.value === selectedSize) || null;

  useEffect(() => {
    setValue(id, selectedSize);
    clearErrors?.(id);
  }, [selectedSize, setValue, clearErrors, id]);

  return (
    <div>
      <Select
        {...props}
        isMulti={isMulti}
        value={selectValue}
        onChange={handleSizeSelectChange}
        options={options}
        placeholder="Select Size"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isDisabled={props?.readOnly}
        isClearable
      />
      <input
        type="hidden"
        value={selectedSize || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const OtherChargesDropdown = ({
  register,
  charges,
  selectedCharge,
  onOtherChargeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = charges?.map((val) => ({
    value: val.id_other_charge,
    label: val.name,
  }));
  const handleOtherChargeSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onOtherChargeChange?.(value);
    setValue?.(id, value);
    clearErrors?.(id);
  };
  useEffect(() => {
    if (selectedCharge) {
      setValue(id, selectedCharge);
      clearErrors(id);
    }
  }, [selectedCharge, setValue, clearErrors, id]);
  return (
    <div style={{ position: "relative", zIndex: "999" }}>
      <Select
        value={
          options.find((option) => option.value === selectedCharge) || null
        }
        onChange={handleOtherChargeSelectChange}
        options={options}
        placeholder="Select Charges"
        id={id}
        isClearable
      />
      <input
        type="hidden"
        value={selectedCharge || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const AttributeDropdown = ({
  register,
  attribute,
  selectedAttribute,
  onAttributeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = attribute?.map((val) => ({
    value: val.id_attribute,
    label: val.attribute_name,
  }));
  const handleAttributeSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onAttributeChange?.(value);
    setValue?.(id, value);
    clearErrors?.(id);
  };
  useEffect(() => {
    if (selectedAttribute) {
      setValue(id, selectedAttribute);
      clearErrors(id);
    }
  }, [selectedAttribute, setValue, clearErrors, id]);
  return (
    <div style={{ position: "relative", zIndex: "999" }}>
      <Select
        value={
          options.find((option) => option.value === selectedAttribute) || null
        }
        onChange={handleAttributeSelectChange}
        options={options}
        placeholder="Select Attribute"
        id={id}
        isClearable
      />
      <input
        type="hidden"
        value={selectedAttribute || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const AccountAddedThroughDropdown = ({
  register,
  selectedValue,
  onChangeEvent,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  placeholder,
  valueField,
  labelField,
  ...props
}) => {
  const options = [
    { label: "Admin App", value: 0 },
    { label: "Mobile App", value: 1 },
    { label: "Web App", value: 2 },
    { label: "Collection app", value: 3 },
  ];

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    const label = selectedOption ? selectedOption.label : "";
    onChangeEvent?.(value);
    setValue?.(id, value);
    clearErrors?.(id);
  };
  useEffect(() => {
    if (selectedValue) {
      setValue(id, selectedValue);
      clearErrors?.(id);
    }
  }, [selectedValue, setValue, clearErrors, id]);
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedValue) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder={placeholder}
        id={id}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedValue || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const YearDropdown = ({
  register,
  data,
  selectedValue,
  onChangeEvent,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  placeholder,
  valueField,
  labelField,
  ...props
}) => {
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    const label = selectedOption ? selectedOption.label : "";
    onChangeEvent?.(value);
    setValue?.(id, value);
    clearErrors?.(id);
  };
  useEffect(() => {
    if (selectedValue) {
      setValue(id, selectedValue);
      clearErrors?.(id);
    }
  }, [selectedValue, setValue, clearErrors, id]);
  return (
    <div>
      <Select
        value={data?.find((option) => option.value === selectedValue) || null}
        onChange={handleSelectChange}
        options={data}
        placeholder={placeholder}
        id={id}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedValue || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const SelectDropdown = ({
  register,
  data,
  selectedValue,
  onChangeEvent,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  placeholder,
  valueField = "value",
  labelField = "label",
  selectedEmployeeLabel,
  tabIndex,
  classNamePrefix = "",
  ...props
}) => {
  const options = data?.map((val) => ({
    value: val[valueField],
    label: val[labelField],
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    const label = selectedOption ? selectedOption.label : "";
    onChangeEvent?.(value);
    selectedEmployeeLabel?.(label);
    setValue?.(id, value);
    clearErrors?.(id);
  };
  useEffect(() => {
    if (selectedValue) {
      setValue(id, selectedValue);
      clearErrors?.(id);
    }
  }, [selectedValue, setValue, clearErrors, id]);
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedValue) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder={placeholder}
        id={id}
        menuPortalTarget={document.body}
        classNamePrefix={classNamePrefix}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        tabIndex={tabIndex}
        isClearable
      />
      <input
        type="hidden"
        value={selectedValue || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const StockIssueTypeDropdown = ({
  register,
  stockIssueType,
  selectedStockIssueType,
  onStockIssueTypeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = stockIssueType?.map((stockIssueType) => ({
    value: stockIssueType.id_stock_issue_type,
    label: stockIssueType.name,
    isDefault: stockIssueType.is_default,
  }));

  const defaultStockIssueType = options?.find((option) => option.isDefault);

  useEffect(() => {
    if (!selectedStockIssueType && defaultStockIssueType) {
      handleSelectChange(defaultStockIssueType);
    }
  }, [defaultStockIssueType]);

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onStockIssueTypeChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div style={{ position: "relative", zIndex: "998" }}>
      <Select
        value={
          options?.find((option) => option.value === selectedStockIssueType) ||
          defaultStockIssueType ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Stock Issue Type"
        id={id}
        isClearable
      />
      <input
        type="hidden"
        value={
          selectedStockIssueType ||
          (defaultStockIssueType ? defaultStockIssueType.value : "")
        }
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const WeightRangeDropdown = ({
  register,
  weightRanges,
  selectedWeightRange,
  onWeightRangeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = weightRanges?.map((weightRanges) => ({
    value: weightRanges.id_weight_range,
    label: weightRanges.weight_range_name,
  }));

  const defaultWeightRange = options?.find((option) => option.isDefault);

  useEffect(() => {
    if (!selectedWeightRange && defaultWeightRange) {
      handleSelectChange(defaultWeightRange);
    }
  }, [defaultWeightRange]);

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onWeightRangeChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedWeightRange) ||
          defaultWeightRange ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Weight Range"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={
          selectedWeightRange ||
          (defaultWeightRange ? defaultWeightRange.value : "")
        }
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const OldMetalItemDropdown = ({
  register,
  oldMetalItems,
  selectedOldMetalItem,
  onOldMetalItemChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  classNamePrefix = "",
  ...props
}) => {
  const options = oldMetalItems?.map((item) => ({
    value: item.id_item_type,
    label: item.name + "-" + item.code,
    isDefault: item.is_default,
  }));
  const defaultOldMetalItem = options?.find((option) => option.isDefault);
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onOldMetalItemChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  useEffect(() => {
    if (!selectedOldMetalItem && defaultOldMetalItem) {
      handleSelectChange(defaultOldMetalItem);
    }
  }, [defaultOldMetalItem]);
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedOldMetalItem) ||
          defaultOldMetalItem ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Old Metal Item"
        id={id}
        tabIndex={props?.tabIndex}
        classNamePrefix={classNamePrefix}
        isClearable
      />
      <input
        type="hidden"
        value={
          selectedOldMetalItem ||
          (defaultOldMetalItem ? defaultOldMetalItem.value : "")
        }
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const CustomerDropdown = ({
  register,
  CustomerOptions,
  selectedCustomer,
  onCustomerChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = CustomerOptions?.rows?.map((customer) => ({
    value: customer.id_customer,
    label: customer.firstname,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onCustomerChange?.(value);
    setValue?.(id, value);
    clearErrors?.(id);
  };
  return (
    <div style={{ position: "relative", zIndex: "999" }}>
      <Select
        value={
          options?.find((option) => option.value === selectedCustomer) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Customer"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedCustomer || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const DepositMasterDropdown = ({
  register,
  depositMasters,
  selectedDepositMaster,
  onDepositMasterChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = depositMasters?.map((master) => ({
    value: master.id_deposit_master,
    label: master.code,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onDepositMasterChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedDepositMaster) ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Deposit Master"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedDepositMaster || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const ReligionDropdown = ({
  register,
  religions,
  selectedReligion,
  onReligionChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = religions?.map((item) => ({
    value: item.id_religion,
    label: item.name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onReligionChange(value);
    setValue(id, value);
    clearErrors(id);
  };

  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedReligion) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Religion"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedReligion}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const OtherInventoryCategoryDropdown = ({
  register,
  otherInventoryCategories,
  selectedOtherInventoryCategory,
  onOtherInventoryCategoryChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = otherInventoryCategories?.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onOtherInventoryCategoryChange(value);
    setValue(id, value);
    clearErrors(id);
  };

  return (
    <div>
      <Select
        value={
          options?.find(
            (option) => option.value === selectedOtherInventoryCategory
          ) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Category"
        id={id}
        isClearable
      />
      <input
        type="hidden"
        value={selectedOtherInventoryCategory}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const OtherInventoryItemDropdown = ({
  register,
  otherInventoryItems,
  selectedOtherInventoryItem,
  onOtherInventoryItemChange,
  id,
  isRequired,
  showOnlyChitGiftOptions,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const filteredItems = showOnlyChitGiftOptions
    ? otherInventoryItems?.rows?.filter((item) => item.category_cat_type === 1)
    : otherInventoryItems?.rows;

  const options = filteredItems?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onOtherInventoryItemChange(value);
    setValue(id, value);
    clearErrors(id);
  };

  return (
    <div>
      <Select
        value={
          options?.find(
            (option) => option.value === selectedOtherInventoryItem
          ) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Item"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedOtherInventoryItem}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const OtherInventorySizeDropdown = ({
  register,
  otherInventorySizes,
  selectedOtherInventorySize,
  onOtherInventorySizeChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = otherInventorySizes?.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onOtherInventorySizeChange(value);
    setValue(id, value);
    clearErrors(id);
  };

  return (
    <div>
      <Select
        value={
          options?.find(
            (option) => option.value === selectedOtherInventorySize
          ) || null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Size"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedOtherInventorySize}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const GiftVoucherDropdown = ({
  register,
  giftVouchers,
  selectedGiftVoucher,
  onGiftVoucherChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = giftVouchers?.map((item) => ({
    value: item.voucher_id,
    label: item.voucher_name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onGiftVoucherChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedGiftVoucher) ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Gift Voucher"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedGiftVoucher || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const LoyaltyTierDropdown = ({
  register,
  loyaltyTiers,
  selectedLoyaltyTier,
  onLoyaltyTierChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = loyaltyTiers?.rows?.map((item) => ({
    value: item.id,
    label: item.tier_name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onLoyaltyTierChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedLoyaltyTier) ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Loyalty Tier"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedLoyaltyTier || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const MasterClientDropdown = ({
  register,
  masterClients,
  selectedMasterClients,
  onMasterClientsChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = masterClients?.map((item) => ({
    value: item.client_id,
    label: item.first_name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onMasterClientsChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedMasterClients) ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Clients"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedMasterClients || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};

export const MasterProductDropdown = ({
  register,
  masterProducts,
  selectedMasterProducts,
  onMasterProductsChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = masterProducts?.map((item) => ({
    value: item.id_product,
    label: item.product_name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onMasterProductsChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedMasterProducts) ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Procducts"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedMasterProducts || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};


export const MasterProjectDropdown = ({
  register,
  masterProject,
  selectedMasterProject,
  onMasterProjectChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = masterProject?.map((item) => ({
    value: item.id_project,
    label: item.project_name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onMasterProjectChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedMasterProject) ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Project"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedMasterProject || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};



export const TaskDropdown = ({
  register,
  task,
  selectedTask,
  onTaskChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = task?.map((item) => ({
    value: item.task_id,
    label: item.task_name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onTaskChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedTask) ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Tasks"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedTask || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};


export const MasterModuleDropdown = ({
  register,
  masterModule,
  selectedMasterModule,
  onMasterModuleChange,
  id,
  isRequired,
  message,
  setValue,
  clearErrors,
  ...props
}) => {
  const options = masterModule?.map((item) => ({
    value: item.id_module,
    label: item.module_name,
  }));
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onMasterModuleChange(value);
    setValue(id, value);
    clearErrors(id);
  };
  return (
    <div>
      <Select
        value={
          options?.find((option) => option.value === selectedMasterModule) ||
          null
        }
        onChange={handleSelectChange}
        options={options}
        placeholder="Select Module"
        id={id}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
        }}
        isClearable
      />
      <input
        type="hidden"
        value={selectedMasterModule || ""}
        {...register(id, { required: isRequired })}
      />
      {message && <span className="text-danger">{message}</span>}
    </div>
  );
};
