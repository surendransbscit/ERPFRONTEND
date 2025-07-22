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
  createMetal,
  getMetalById,
  updateMetalById,
} from "../../../redux/thunks/catalogMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import ShortCutKeys from "../../../components/shortCutKeys/ShortCutKeys";
import { useShortCodeContext } from "../../../contexts/ShortCodeContexts";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
const MetalForm = () => {
  const location = useLocation();
  const { isShortCodeDisabled } = useShortCodeContext();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading: issubmitting,
    isError,
    metalInfo,
  } = useSelector((state) => state.metalReducer);
  console.log(metalInfo);
  const [metal_name, setMetalName] = useState();
  const [metal_code, setMetalCode] = useState();
  const [metal_status, setMetalStatus] = useState(true);
  const { transformWord } = useContext(WordTransformerContext);

  useEffect(() => {
    if (id !== undefined) {
      dispatch(getMetalById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (metalInfo != undefined) {
      setMetalName(metalInfo?.metal_name);
      setMetalCode(metalInfo?.metal_code);
      setMetalStatus(metalInfo?.metal_status);
      reset();
    }
  }, [metalInfo, reset]);

  const form_submit = async (data, actionType) => {
    if (id === undefined) {
      create_metal(data, actionType);
    } else {
      update_metal(data, actionType);
    }
  };

  const create_metal = async (data, actionType) => {
    try {
      await dispatch(createMetal(data)).unwrap();
      toastsuccess(metal_name + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/metal/list`);
    } catch (error) {
      console.error(error);
    }
    // await dispatch(createMetal(data));
    // if (!isError) {
    //   toastsuccess(metal_name + " Added successfully");
    //   if (actionType === "saveAndNew") {
    //     reset_form();
    //   } else if (actionType === "saveAndClose") {
    //     navigate(`${process.env.PUBLIC_URL}/catalogmaster/metal/list`);
    //   }
    // } else {
    //   reset_form();
    // }
  };

  const update_metal = async (data, actionType) => {
    const update_data = { id: id, putData: data };
    try {
      await dispatch(updateMetalById(update_data)).unwrap();
      toastsuccess(metal_name + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/metal/list`);
    } catch (error) {
      console.error(error);
    }
    // await dispatch(updateMetalById(update_data));
    // if (!isError) {
    //   toastsuccess(metal_name + " Updated successfully");
    //   if (actionType === "saveAndNew") {
    //     reset_form();
    //   } else if (actionType === "saveAndClose") {
    //     navigate(`${process.env.PUBLIC_URL}/catalogmaster/metal/list`);
    //   }
    // } else {
    //   reset_form();
    // }
  };

  console.log("errors", errors);
  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      if (id !== undefined) {
        handleSubmit(form_submit)();
      } else {
        handleSubmit(form_submit)();
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  // Reload Shortcut (Ctrl+R)
  useHotkeys("ctrl+r", (event) => {
    event.preventDefault();
    window.location.reload();
  });

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/metal/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title="Metal" />
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
                    form_submit(data, "saveAndNew")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

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
                      `${process.env.PUBLIC_URL}/catalogmaster/metal/list`
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
                      `${process.env.PUBLIC_URL}/catalogmaster/metal/list`
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
                    id={"metal_name"}
                    placeholder="Metal Name"
                    value={metal_name}
                    SetValue={(value) => {
                      setMetalName(transformWord(value));
                      setValue("metal_name", value);
                      clearErrors("metal_name");
                    }}
                    message={errors.metal_name && "Metal Name is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="metal_code">
                    Code
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    isDisabled={isShortCodeDisabled}
                    register={register}
                    isRequired={!isShortCodeDisabled}
                    id={"metal_code"}
                    placeholder="Metal Code"
                    value={metal_code}
                    SetValue={(value) => {
                      setMetalCode(value);
                      setValue("metal_code", value);
                      clearErrors("");
                    }}
                    message={errors.metal_code && "Metal Code is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="metal_status">
                    Status
                    <isRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <SwitchInputField
                  register={register}
                  id={"metal_status"}
                  checked={metal_status}
                  SetValue={(value) => {
                    setMetalStatus(value);
                    setValue("metal_status", value);
                  }}
                  name={"metal_status"}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default MetalForm;
