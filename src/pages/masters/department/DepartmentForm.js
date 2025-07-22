import React, { useEffect, useState, useContext } from "react";
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
  createDepartment,
  getDepartmentById,
  updateDepartmentById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Row, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const DepartmentForm = () => {
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
    (state) => state.departmentReducer
  );
  const { departmentInfo } = useSelector((state) => state.departmentReducer);

  const [name, setName] = useState();
  const [deptCode, setDeptCode] = useState();

  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      name,
      dept_code: deptCode,
    };
    try{
      let responce = await dispatch(createDepartment(adddata)).unwrap();
      if (responce?.payload?.status === 201) {
        toastsuccess(name + " Added successfully");
      }
    } catch (error) {
      console.error("Error adding department:", error);
    }
    // await dispatch(createDepartment(adddata));
    // if (isError === false) {
    //   toastsuccess(name + " Added successfully");
    //   navigate(`${process.env.PUBLIC_URL}/master/department/list`);
    // }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      name,
      dept_code: deptCode,
    };

    await dispatch(createDepartment(adddata));
    if (isError === false) {
      toastsuccess("Department Added successfully");
      setName("");
      setDeptCode("");
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getDepartmentById(id));
  }, [dispatch, id]);

  console.log(departmentInfo?.name);

  useEffect(() => {
    departmentInfo != undefined &&
      (setName(departmentInfo?.name),
      setDeptCode(departmentInfo?.dept_code),
      reset());
  }, [departmentInfo, reset]);

  const putData = async () => {
    const adddata = {
      name,
      dept_code: deptCode,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };

    await dispatch(updateDepartmentById(reduxData));
    if (isError === false) {
      toastsuccess("Department Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/department/list`);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/department/list`);
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
      <Head title={title ? title : "Department"} />
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb></ModifiedBreadcrumb>
            </Col>
            <Col md={2}></Col>
            {add !== undefined && (
              <Col md={5} className="text-right flex">
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
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/master/department/list`)
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(putData)}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/master/department/list`)
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"name"}
                    placeholder="Department Name"
                    value={name}
                    SetValue={(value) => {
                      setName(transformWord(value));
                      clearErrors("name");
                    }}
                    message={errors.name && "name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row className="g-3 align-center">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="deptCode">
                    Code <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"deptCode"}
                    placeholder="Department Code"
                    value={deptCode}
                    SetValue={(value) => {
                      setDeptCode(value);
                      clearErrors("deptCode");
                    }}
                    message={errors.deptCode && "code is Required"}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default DepartmentForm;
