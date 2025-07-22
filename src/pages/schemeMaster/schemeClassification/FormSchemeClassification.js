/* eslint-disable no-unused-expressions */
import React, { useContext, useEffect, useState } from "react";
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
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import {
  createSchemeClass,
  getSchemeClassById,
  updateSchemeClassById,
} from "../../../redux/thunks/scheme";
import { Button, Input } from "reactstrap";
import { ZoomImage } from "../../../components/form-control/ZoomImage";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import ReactQuill from "react-quill";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const FormSchemeClassification = () => {
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
  const { transformWord } = useContext(WordTransformerContext);

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.schemeClassReducer
  );
  const { schemeClassInfo } = useSelector((state) => state.schemeClassReducer);

  const [classificationName, setClassificationName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [logo, setlogo] = useState();

  const convert64 = async (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e);
    reader.onload = () => {
      setlogo(reader?.result);
    };
  };

  const isBase64 = (str) => {
    try {
      return str.startsWith("data:image");
    } catch (err) {
      return false;
    }
  };

  const postData = async () => {
    const adddata = {
      classification_name: classificationName,
      description,
      active,
      logo: logo ? logo : null,
    };
    try {
      await dispatch(createSchemeClass(adddata)).unwrap();
      toastsuccess("Scheme Classification Added successfully");
      navigate(
        `${process.env.PUBLIC_URL}/schememaster/schemeclassification/list`
      );
    } catch (error) {
      console.error(error);
    }
    // await dispatch(createSchemeClass(adddata));
    // if (isError === false) {
    //   toastsuccess("Scheme Classification Added successfully");
    //   navigate(`${process.env.PUBLIC_URL}/schememaster/schemeclassification/list`);
    // }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      classification_name: classificationName,
      description,
      active,
      logo: logo ? logo : null,
    };

    try {
      await dispatch(createSchemeClass(adddata)).unwrap();
      toastsuccess("Scheme Classification Added successfully");
      toastsuccess("Scheme Classification Added successfully");
      setClassificationName("");
      setDescription("");
      setActive(true);
      setlogo("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getSchemeClassById(id));
  }, [dispatch, id]);

  useEffect(() => {
    schemeClassInfo != undefined &&
      (setClassificationName(schemeClassInfo?.classification_name),
        setDescription(schemeClassInfo?.description),
        setActive(schemeClassInfo?.active),
        setlogo(schemeClassInfo?.logo),
        reset());
  }, [schemeClassInfo, reset]);

  const putData = async () => {
    const adddata = {
      classification_name: classificationName,
      description,
      active,
      logo: logo ? logo : null,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };

    try {
      await dispatch(updateSchemeClassById(reduxData)).unwrap();
      toastsuccess("Scheme Classification Edited successfully");
      navigate(
        `${process.env.PUBLIC_URL}/schememaster/schemeclassification/list`
      );
    } catch (error) {
      console.error(error);
    }

    // await dispatch(updateSchemeClassById(reduxData));
    // if (isError === false) {
    //   toastsuccess("Scheme Classification Edited successfully");
    //   navigate(`${process.env.PUBLIC_URL}/schememaster/schemeclassification/list`);
    // }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(
        `${process.env.PUBLIC_URL}/schememaster/schemeclassification/list`
      );
    }
  }, [add, id, navigate]);


  const handleChange = (value) => {
    setDescription(value);
  };



  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+S or Cmd+S
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault(); // block browser Save dialog

        document.activeElement?.blur(); // trigger form validations

        setTimeout(() => {
          if (id !== undefined) {
            handleSubmit(putData)();
          } else {
            handleSubmit(postData)();
          }
        }, 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, postData, putData, id]);
  return (
    <React.Fragment>
      <Head title={title ? title : "Scheme Classification"} />
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
                      `${process.env.PUBLIC_URL}/schememaster/schemeclassification/list`
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
                      `${process.env.PUBLIC_URL}/schememaster/schemeclassification/list`
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
                  <label className="form-label" htmlFor="classification_name">
                    Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"classificationName"}
                    placeholder="Classification Name"
                    value={classificationName}
                    SetValue={(value) => {
                      setClassificationName(transformWord(value));
                      clearErrors("classificationName");
                    }}
                    message={
                      errors.classificationName &&
                      " classification name is Required"
                    }
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="description">
                    Description<IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <ReactQuill value={description} onChange={handleChange} />
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="logo">
                    Image
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-control-wrap">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">Upload</span>
                    </div>
                    <div className="form-file">
                      <Input
                        type="file"
                        accept="image/*"
                        id="logo"
                        onChange={(e) => convert64(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="g-3 align-center">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="active">
                    Active
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <SwitchInputField
                  register={register}
                  id={"active"}
                  checked={active}
                  SetValue={setActive}
                  name={"active"}
                />
              </Col>
            </Row>

            {logo == undefined ||
              (logo !== null && (
                <>
                  <Col lg="4">
                    <ZoomImage
                      alt="not found"
                      height={"300px"}
                      width={"600px"}
                      src={isBase64(logo) ? logo : logo + "?" + String()}
                    />
                    <br />
                    <Button
                      className="mt-1 bg-red-500 text-white"
                      size="xs"
                      onClick={() => setlogo(undefined)}
                    >
                      Remove
                    </Button>
                  </Col>
                </>
              ))}
          </div>

          {add != undefined && (
            <Row className="gy-3">
              <Col className="">
                <div className="form-group mt-2"></div>
              </Col>
            </Row>
          )}
          {id != undefined && (
            <Row className="gy-3">
              <Col className="">
                <div className="form-group mt-2"></div>
              </Col>
            </Row>
          )}
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default FormSchemeClassification;
