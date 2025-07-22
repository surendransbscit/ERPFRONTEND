import React from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

const BranchDropdownMulti = ({ register, ...props }) => {
  const { accessBranches } = useSelector((state) => state.coreCompReducer);

  // useEffect(() => {
  //   dispatch(getAccessBranches(loginpref));
  // }, [dispatch, loginpref]);

  // let branchData = [];
  // if (accessBranches.length > 0) {
  //   branchData = accessBranches?.map((obj) => {
  //     const container = {};
  //     container.label = obj.name;
  //     container.value = obj.id_branch;
  //     return container;
  //   });
  // }

  const options =
    accessBranches?.map((obj) => {
      const container = {};
      container.label = obj.name;
      container.value = obj.id_branch;
      return container;
    }) ?? [];

  const allOption = { label: "All", value: "all" };

  const isAllSelected = () => {
    return props?.value?.length === options?.length;
  };

  const allOptions = isAllSelected() ? options : [allOption, ...options];

  return (
    <>
      {props.label && (
        <label className="form-label" htmlFor="site-name">
          {props?.label}
        </label>
      )}
      <div className="form-group" style={{ width: props?.width }}>
        <div className="form-control-wrap">
          {/* <RSelect
          //  options={[{ label: "All", value: "*" }, ...branchData]}
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={props?.value}
            onChange={(e) => props.SetValue(e)}
            isMulti
            // getDropdownButtonLabel={getDropdownButtonLabel}
            
            options={branchData}
          /> */}
          <Select
            isMulti={true}
            value={props?.value}
            onChange={(e) => props.SetValue(e)}
            options={options}
            placeholder="Select Branch"
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
            value={props?.value || ""}
            {...register(props?.id, { required: props?.isRequired })}
          />
        </div>
      </div>
    </>
  );
};

export default BranchDropdownMulti;