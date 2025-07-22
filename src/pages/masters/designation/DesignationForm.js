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
  createDesignation,
  getDepartmentOptions,
  getDesignationById,
  updateDesignationById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Icon,
  NumberInputField,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { DepartmentDropdown } from "../../../components/filters/retailFilters";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const DesignationForm = () => {
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
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.designationReducer
  );
  const { designationInfo } = useSelector((state) => state.designationReducer);
  const { departmentOptions } = useSelector((state) => state.departmentReducer);

  const [designationName, setDesignationName] = useState();
  const [department, setDepartment] = useState();
  const [isActive, setActive] = useState(true);

  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      name: designationName,
      department: department,
      is_active: isActive,
    };
    try {
      await dispatch(createDesignation(adddata));
      toastsuccess(designationName + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/designation/list`);
    } catch (error) {
      console.error(error);
    }
  };

  let data = location?.pathname.split("/");
  data[0] = "Home";
  const pathnames = location.pathname.split("/").filter((x) => x);
  const breadoptions = data?.map((obj, i) => {
    const container = {};
    container.name = obj;
    if (data[i] == "Home") {
      container.link = `/`;
    } else {
      container.link = pathnames.slice(0, i).join("/");
    }

    return container;
  });

  const postAndCreateNew = async () => {
    const adddata = {
      name: designationName,
      department: department,
      is_active: isActive,
    };

    try {
      await dispatch(createDesignation(adddata));
      toastsuccess(designationName + " Added successfully");
      setDesignationName("");
      setDepartment("");
      setActive(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id != undefined && dispatch(getDesignationById(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getDepartmentOptions());
  }, [dispatch]);

  useEffect(() => {
    designationInfo != undefined &&
      (setDesignationName(designationInfo?.name),
        setDepartment(designationInfo?.department),
        setActive(designationInfo?.is_active),
        reset());
  }, [designationInfo, reset]);

  const putData = async () => {
    const adddata = {
      name: designationName,
      department: department,
      is_active: isActive,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };

    try {
      await dispatch(updateDesignationById(reduxData));
      toastsuccess("Designation Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/designation/list`);
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    if (add == undefined && id == undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/designation/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Designation"} />
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
                    navigate(
                      `${process.env.PUBLIC_URL}/master/designation/list`
                    )
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
                    navigate(
                      `${process.env.PUBLIC_URL}/master/designation/list`
                    )
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
                  <label className="form-label" htmlFor="designationName">
                    Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"designationName"}
                    placeholder="Designation Name"
                    value={designationName}
                    SetValue={(value) => {
                      setDesignationName(transformWord(value));
                      clearErrors("designationName");
                    }}
                    message={
                      errors.designationName && " Designation name is required"
                    }
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="designationName">
                    Department
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <DepartmentDropdown
                    register={register}
                    id={"department"}
                    departments={departmentOptions}
                    selectedDepartment={department}
                    onDepartmentChange={setDepartment}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.department && "Department is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="isActive">
                    Active
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SwitchInputField
                  register={register}
                  id={"isActive"}
                  checked={isActive}
                  SetValue={setActive}
                  name={"isActive"}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default DesignationForm;
