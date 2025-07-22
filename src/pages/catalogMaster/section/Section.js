import React, { useContext, useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import {
  Col,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createSection,
  getSectionById,
  updateSectionById,
} from "../../../redux/thunks/catalogMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const SectionForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading: issubmitting,
    isError,
    sectionInfo,
  } = useSelector((state) => state.sectionReducer);
  const [sectionName, setSectionName] = useState();
  const [sectionStatus, setSectionStatus] = useState(true);

  const { transformWord } = useContext(WordTransformerContext);

  useEffect(() => {
    if (id !== undefined) {
      dispatch(getSectionById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (sectionInfo !== null) {
      setSectionName(sectionInfo?.section_name);
      setSectionStatus(sectionInfo?.status);
      reset();
    }
  }, [sectionInfo, reset]);

  const form_submit = async (data, actionType) => {
    if (id === undefined) {
      create_section(data, actionType);
    } else {
      update_section(data, actionType);
    }
  };

  const create_section = async (data, actionType) => {
    try {
      await dispatch(createSection(data)).unwrap();
      toastsuccess(sectionName + " Added successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/catalogmaster/section/list`);
      }
    } catch (error) {
      let message = error?.response?.data?.message;

      if (typeof message === "string" && message.includes("section_name")) {
        setError("section_name", {
          type: "manual",
          message: "Section name already exists",
        });
      }
    }
  };

  const update_section = async (data, actionType) => {
    const update_data = { id: id, putData: data };

    try {
      await dispatch(updateSectionById(update_data)).unwrap();

      toastsuccess(sectionName + " Updated successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/catalogmaster/section/list`);
      }
    } catch (error) {
      let message = error?.response?.data?.message;

      if (typeof message === "string" && message.includes("section_name")) {
        setError("section_name", {
          type: "manual",
          message: "Section name already exists",
        });
      }
    }
  };

  const reset_form = async () => {
    reset("");
    setSectionName("");
    setSectionStatus(true);
  };
  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        if (id !== undefined) {
          handleSubmit((data) => form_submit(data, "saveAndClose"))();
        } else {
          handleSubmit((data) => form_submit(data, "saveAndClose"))();
        }
      }, 0); // <-- Slight delay after blur
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/section/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title="Section" />
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
                {/* <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    form_submit(data, "saveAndNew")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton> */}

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    form_submit(data, "saveAndClose")
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
                      `${process.env.PUBLIC_URL}/catalogmaster/section/list`
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
                  onClick={handleSubmit((data) =>
                    form_submit(data, "saveAndClose")
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
                      `${process.env.PUBLIC_URL}/catalogmaster/section/list`
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
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="section_name">
                    Name
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"section_name"}
                    placeholder="Section Name"
                    value={sectionName}
                    SetValue={(value) => {
                      setSectionName(transformWord(value));
                      clearErrors("sectionName");
                    }}
                    message={
                      errors.section_name &&
                      (errors.section_name?.message
                        ? errors.section_name.message
                        : "Section Name is Required")
                    }
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="status">
                    Status
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SwitchInputField
                  register={register}
                  id={"status"}
                  checked={sectionStatus}
                  SetValue={setSectionStatus}
                  name={"status"}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default SectionForm;
