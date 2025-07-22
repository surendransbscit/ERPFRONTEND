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
  createSubDesign,
  getSubDesignById,
  updateSubDesignById,
} from "../../../redux/thunks/catalogMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const SubDesignForm = () => {
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
    subDesignInfo,
  } = useSelector((state) => state.subDesignReducer);
  const [subDesignName, setSubDesignName] = useState();
  const [sub_design_status, setSubDesignStatus] = useState(true);

  const { transformWord } = useContext(WordTransformerContext);

  useEffect(() => {
    if (id !== undefined) {
      dispatch(getSubDesignById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (subDesignInfo !== null) {
      setSubDesignName(subDesignInfo?.sub_design_name);
      setSubDesignStatus(subDesignInfo?.status);
      reset();
    }
  }, [subDesignInfo, reset]);

  const form_submit = async (data, actionType) => {
    if (id === undefined) {
      create_sub_design(data, actionType);
    } else {
      update_sub_design(data, actionType);
    }
  };

  const create_sub_design = async (data, actionType) => {
    try {
      await dispatch(createSubDesign(data)).unwrap();
      toastsuccess(subDesignName + " Added successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/catalogmaster/sub_design/list`);
      }
    } catch (error) {
      let message = error?.response?.data?.message;

      if (typeof message === "string" && message.includes("sub_design_name")) {
        setError("sub_design_name", {
          type: "manual",
          message: "Sub Design name already exists",
        });
      }
    }
  };

  const update_sub_design = async (data, actionType) => {
    const update_data = { id: id, putData: data };

    try {
      await dispatch(updateSubDesignById(update_data)).unwrap();
      toastsuccess(subDesignName + " Updated successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/catalogmaster/sub_design/list`);
      }
    } catch (error) {
      let message = error?.response?.data?.message;

      if (typeof message === "string" && message.includes("sub_design_name")) {
        setError("sub_design_name", {
          type: "manual",
          message: "Sub Design name already exists",
        });
      }
    }
  };

  const reset_form = async () => {
    reset("");
    setSubDesignName("");
    setSubDesignStatus(true);
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
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/sub_design/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title="Sub Design" />
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
                      `${process.env.PUBLIC_URL}/catalogmaster/sub_design/list`
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
                      `${process.env.PUBLIC_URL}/catalogmaster/sub_design/list`
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
                  <label className="form-label" htmlFor="metal_name">
                    Sub Design Name
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"sub_design_name"}
                    placeholder="Sub Design Name"
                    value={subDesignName}
                    SetValue={(value) => {
                      setSubDesignName(transformWord(value));
                      clearErrors("sub_design_name");
                    }}
                    message={
                      errors.sub_design_name &&
                      (errors.sub_design_name?.message
                        ? errors.sub_design_name.message
                        : "Sub Design Name is Required")
                    }
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="metal_status">
                    Sub Design Status
                    <isRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <SwitchInputField
                  register={register}
                  id={"status"}
                  checked={sub_design_status}
                  SetValue={setSubDesignStatus}
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

export default SubDesignForm;
