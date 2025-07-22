import React, { useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { useDispatch, useSelector } from "react-redux";
import { listEmployeeAction } from "../../../redux/action/employee";

const EmployeeAutoComplete = ({ ...props }) => {
  const inputid = props?.id;
  const dispatch = useDispatch();
  const { listEmployee } = useSelector((state) => state.listEmployee);
  useEffect(() => {
    dispatch(listEmployeeAction());
  }, [dispatch]);
  return (
    <div className="form-control-wrap">
      <Typeahead
        id="customerSearch"
        labelKey="for_search"
        onChange={(e) => {
          props?.SetValue(e[0]?.emp_id), props?.SetSearchValue(e);
        }}
        options={listEmployee}
        placeholder={props.placeholder}
        // defaultSelected={customerSearch}
        selected={props.searchValue}
      />
    </div>
  );
};

export default EmployeeAutoComplete;
