import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import secureLocalStorage from "react-secure-storage";
import { getAccessBranches } from "../../../redux/thunks/coreComponent";

const BranchDropdown = ({ register, ...props }) => {
  const inputid = props?.id;
  const dispatch = useDispatch();
  const loginpref = secureLocalStorage.getItem("pref").pref;

  const { accessBranches } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getAccessBranches(loginpref));
  }, [dispatch, loginpref]);

  useEffect(() => {
    if (accessBranches?.length == 1) {
      register({ name: inputid, value: accessBranches[0].id_branch });
    }
  }, [accessBranches, inputid, register]);

  return (
    <>
      {props.label && (
        <label className="form-label" htmlFor="site-name">
          {props?.label}
        </label>
      )}
      <div className="form-control-wrap">
        <div className="form-control-select">
          <select
            className="form-control form-select"
            id={inputid}
            {...register(`${inputid}`, {
              required: true,
            })}
            value={props?.value}
            onChange={(e) => props.SetValue(e.target.value)}
          >
            <option label={props.optionLabel} value=""></option>
            {accessBranches?.map((item, index) => (
              <option key={index} value={item?.id_branch}>
                {item?.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default BranchDropdown;
