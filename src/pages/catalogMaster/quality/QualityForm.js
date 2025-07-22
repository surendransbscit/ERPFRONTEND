import React, { useEffect, useState } from "react";
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
  CutDropdown,
  ColorDropdown,
  ShapeDropdown,
  ClarityDropdown,
} from "../../../components/filters/retailFilters";
import {
  getActiveCut,
  getActiveClarity,
} from "../../../redux/thunks/catalogMaster";
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
  createQuality,
  getQualityById,
  updateQualityById,
} from "../../../redux/thunks/catalogMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  useClarity,
  useCut,
  useShape,
  useColor,
} from "../../../components/filters/filterHooks";
import { useHotkeys } from "react-hotkeys-hook";

const QualityForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading: issubmitting,
    isError,
    qualityInfo,
  } = useSelector((state) => state.qualityReducer);
  const [qualityCode, setQualityCode] = useState();
  const [cutId, setCutId] = useState(1);
  const [colorId, setColorId] = useState();
  const [shapeId, setShapeId] = useState();
  const [clarityId, setClarityId] = useState();
  const [status, setQualityStatus] = useState(true);
  const { clarity } = useClarity();
  const { cut } = useCut();
  const { shape } = useShape();
  const { color } = useColor();

  useEffect(() => {
    if (id != undefined) {
      dispatch(getQualityById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (qualityInfo != undefined) {
      setQualityCode(qualityInfo?.code);
      setCutId(qualityInfo?.cut);
      setColorId(qualityInfo?.color);
      setShapeId(qualityInfo?.shape);
      setClarityId(qualityInfo?.clarity);
      setQualityStatus(qualityInfo?.status);
      reset();
    }
  }, [qualityInfo, reset]);

  useEffect(() => {
    dispatch(getQualityById());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getActiveCut());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getActiveClarity());
  }, [dispatch]);

  const form_submit = async (data, actionType) => {
    if (id === undefined) {
      const adddata = {
        code: data.qualityCode,
        cut: data.cutId,
        color: data.colorId,
        shape: data.shapeId,
        clarity: data.clarityId,
        status: data.status,
      };
      create_Quality(adddata, actionType);
    } else {
      const updateData = {
        code: data.qualityCode,
        cut: data.cutId,
        color: data.colorId,
        shape: data.shapeId,
        clarity: data.clarityId,
        status: data.status,
      };
      update_Quality(updateData, actionType);
    }
  };

  const create_Quality = async (data, actionType) => {
    try {
      await dispatch(createQuality(data)).unwrap();
      toastsuccess(qualityCode + " Added successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/catalogmaster/quality/list`);
      }
    } catch (error) {
      let message = error?.response?.data?.message;

      if (typeof message === "string" && message.includes("code")) {
        setError("code", {
          type: "manual",
          message: "Quality code already exists",
        });
      }
    }
  };

  const update_Quality = async (data, actionType) => {
    const update_data = { id: id, putData: data };

    try {
      await dispatch(updateQualityById(update_data)).unwrap();

      toastsuccess(qualityCode + " Updated successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/catalogmaster/quality/list`);
      }
    } catch (error) {
      let message = error?.response?.data?.message;

      if (typeof message === "string" && message.includes("code")) {
        setError("code", {
          type: "manual",
          message: "Quality code already exists",
        });
      }
    }
  };

  const reset_form = async () => {
    reset("");
    setQualityCode("");
    setCutId("");
    setColorId("");
    setShapeId("");
    setClarityId("");
    setQualityStatus(true);
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      if (id !== undefined) {
        handleSubmit(update_Quality)();
      } else {
        handleSubmit(create_Quality)();
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/quality/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title="Quality" />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12}>
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
                      `${process.env.PUBLIC_URL}/catalogmaster/quality/list`
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
                      `${process.env.PUBLIC_URL}/catalogmaster/quality/list`
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
                  <label className="form-label">
                    Code
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="4">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"qualityCode"}
                    placeholder="Quality code"
                    value={qualityCode}
                    setValue={setValue}
                    SetValue={(value) => {
                      setQualityCode(value);
                      clearErrors("qualityCode");
                    }}
                    message={errors.qualityCode && "Code is Required"}
                  />
                </div>
              </Col>
              <Col md="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="cutId">
                    Cut
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <CutDropdown
                    register={register}
                    id={"cutId"}
                    cutOptions={cut}
                    selectedCut={cutId}
                    isRequired={true}
                    clearErrors={clearErrors}
                    onCutChange={setCutId}
                    setValue={setValue}
                    message={errors.cutId && "Cut is Required"}
                  ></CutDropdown>
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label">
                    Color
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <ColorDropdown
                    register={register}
                    id={"colorId"}
                    colorOptions={color}
                    selectedColor={colorId}
                    isRequired={true}
                    clearErrors={clearErrors}
                    onColorChange={setColorId}
                    setValue={setValue}
                    message={errors.colorId && "Color is Required"}
                  ></ColorDropdown>
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label">
                    Shape
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <ShapeDropdown
                    register={register}
                    id={"shapeId"}
                    shapeOptions={shape}
                    selectedShape={shapeId}
                    isRequired={true}
                    clearErrors={clearErrors}
                    onShapeChange={setShapeId}
                    setValue={setValue}
                    message={errors.shapeId && "Shape is Required"}
                  ></ShapeDropdown>
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label">
                    Clarity
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <ClarityDropdown
                    register={register}
                    id={"clarityId"}
                    clarityOptions={clarity}
                    selectedClarity={clarityId}
                    isRequired={true}
                    clearErrors={clearErrors}
                    onClarityChange={setClarityId}
                    setValue={setValue}
                    message={errors.clarityId && "Clarity is Required"}
                  ></ClarityDropdown>
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label">
                    Status
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="4">
                <SwitchInputField
                  register={register}
                  id={"status"}
                  checked={status}
                  SetValue={status}
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

export default QualityForm;
