import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createEmployeeType,
  getEmployeeTypeById,
  updateEmployeeTypeById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, Row, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import { useHotkeys } from "react-hotkeys-hook";

const EmployeeTypeForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.employeeTypeReducer
  );
  const { employeeTypeInfo } = useSelector(
    (state) => state.employeeTypeReducer
  );

  const [employeeType, setEmployeeType] = useState("");

  const postData = async () => {
    const adddata = {
      employee_type: employeeType,
    };
    await dispatch(createEmployeeType(adddata));
    if (isError === false) {
      toastsuccess("Employee Type Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/employeetype/list`);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      employee_type: employeeType,
    };
    await dispatch(createEmployeeType(adddata));
    if (isError === false) {
      toastsuccess("Employee Type Added successfully");
      reset();
      setEmployeeType("");
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getEmployeeTypeById(id));
  }, [dispatch, id]);

  useEffect(() => {
    employeeTypeInfo !== undefined &&
      (setEmployeeType(employeeTypeInfo?.employee_type), reset());
  }, [employeeTypeInfo, reset]);

  const putData = async () => {
    const adddata = {
      employee_type: employeeType,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    await dispatch(updateEmployeeTypeById(reduxData));
    if (isError === false) {
      toastsuccess("Employee Type Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/employeetype/list`);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/employeetype/list`);
    }
  }, [add, id, navigate]);

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (id !== undefined) {
      handleSubmit(putData)();
    } else {
      handleSubmit(postData)();
    }
  },{
    enableOnFormTags: true, // Enable hotkeys inside input fields
    preventDefault: true, // Prevent default browser Save
  });

  return (
    <React.Fragment>
      <Head title={title ? title : "Employee Type"} />
      <Content>
        <BlockTitle tag="h6" className="fw-normal">
          {(title ? title : "Employee Type") + (add ? " - Add" : " - Edit")}
        </BlockTitle>

        <PreviewCard className="h-100">
          <div className="gy-3 gx-3">
            <Row className="g-3 align-center">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"employeeType"}
                    placeholder="Area Name"
                    value={employeeType}
                    SetValue={(value) => {
                      setEmployeeType(value);
                      clearErrors("employeeType");
                    }}
                    message={
                      errors.employeeType && " Employee Type is Required"
                    }
                  />
                </div>
              </Col>
            </Row>
          </div>

          {add !== undefined && (
            <Row className="gy-3">
              <Col className="">
                <div className="form-group mt-2">
                  <SaveButton
                    disabled={issubmitting}
                    size="md"
                    color="primary"
                    onClick={handleSubmit((data) =>
                      postAndCreateNew(data, "saveAndNew")
                    )}
                  >
                    {issubmitting ? "Saving" : "Save & New"}
                  </SaveButton>

                  <SaveButton
                    disabled={issubmitting}
                    size="md"
                    color="primary"
                    onClick={handleSubmit((data) =>
                      postData(data, "saveAndClose")
                    )}
                  >
                    {issubmitting ? "Saving" : "Save & Close"}
                  </SaveButton>

                  <CancelButton
                    disabled={issubmitting}
                    color="danger"
                    size="md"
                    onClick={() =>
                      navigate(
                        `${process.env.PUBLIC_URL}/master/employeetype/list`
                      )
                    }
                  >
                    Cancel
                  </CancelButton>
                </div>
              </Col>
            </Row>
          )}
          {id !== undefined && (
            <Row className="gy-3">
              <Col className="">
                <div className="form-group mt-2">
                  <SaveButton
                    disabled={issubmitting}
                    size="md"
                    color="primary"
                    onClick={handleSubmit(putData)}
                  >
                    {issubmitting ? "Saving" : "Save"}
                  </SaveButton>

                  <CancelButton
                    disabled={issubmitting}
                    color="danger"
                    size="md"
                    onClick={() =>
                      navigate(
                        `${process.env.PUBLIC_URL}/master/employeetype/list`
                      )
                    }
                  >
                    Cancel
                  </CancelButton>
                </div>
              </Col>
            </Row>
          )}
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default EmployeeTypeForm;
