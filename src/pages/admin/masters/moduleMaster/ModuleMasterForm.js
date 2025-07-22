/* eslint-disable no-unused-expressions */
import React, { useContext, useEffect, useState } from "react";
import Content from "../../../../layout/content/Content";
import Head from "../../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastsuccess } from "../../../../components/sds-toast-style/toast-style";
import {
  Col,
  Row,
  SwitchInputField,
  TextInputField,
  NumberInputField,
} from "../../../../components/Component";
import IsRequired from "../../../../components/erp-required/erp-required";
import {
  createMasterModule,
  getMasterModuleById,
  updateMasterModuleById,
} from "../../../../redux/thunks/adminMaster";
import { Button, Input } from "reactstrap";
import { ZoomImage } from "../../../../components/form-control/ZoomImage";
import ModifiedBreadcrumb from "../../../../components/common/breadcrumb/ModifiedBreadCrumb";
import ReactQuill from "react-quill";
import { WordTransformerContext } from "../../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const ModuleMasterForm = () => {
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
    (state) => state.mastermoduleReducer
  );
  const { masterModuleInfo } = useSelector(
    (state) => state.mastermoduleReducer
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [approxcost, setApproxcost] = useState("");

  const postData = async () => {
    const adddata = {
      module_name: name,
      description,
      short_code: shortcode,
      approx_cost: approxcost,
    };
    try {
      await dispatch(createMasterModule(adddata)).unwrap();
      toastsuccess("Create Module Added successfully");
      navigate(`${process.env.PUBLIC_URL}/admin/master/module_master/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      module_name: name,
      description,
      short_code: shortcode,
      approx_cost: approxcost,
    };
    try {
      await dispatch(createMasterModule(adddata)).unwrap();
      toastsuccess("Create Module Added successfully");
      setName("");
      setDescription("");
      setShortcode("");
      setApproxcost("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getMasterModuleById(id));
  }, [dispatch, id]);

  useEffect(() => {
    masterModuleInfo != undefined &&
      (setName(masterModuleInfo?.module_name),
      setDescription(masterModuleInfo?.description),
      setShortcode(masterModuleInfo?.short_code),
      setApproxcost(masterModuleInfo?.approx_cost),
      reset());
  }, [masterModuleInfo, reset]);

  const putData = async () => {
    const adddata = {
      module_name: name,
      description,
      short_code: shortcode,
      approx_cost: approxcost,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateMasterModuleById(reduxData)).unwrap();
      toastsuccess(" Module Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/admin/master/module_master/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/admin/master/module_master/list`);
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
      <Head title={title ? title : "Module Master"} />
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
                      `${process.env.PUBLIC_URL}/admin/master/module_master/list`
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
                      `${process.env.PUBLIC_URL}/admin/master/module_master/list`
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
                  <label className="form-label" htmlFor="name">
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
                    placeholder="Name"
                    value={name}
                    SetValue={(value) => {
                      setName(transformWord(value));
                      clearErrors("name");
                    }}
                    message={errors.name && "name"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="description">
                    Description
                    <IsRequired />
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
                  <label className="form-label" htmlFor="tax_name">
                    Short code
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    placeholder="short code"
                    id={"shortcode"}
                    value={shortcode}
                    isRequired={false}
                    register={register}
                    reqValueError={"This field is required"}
                    SetValue={(value) => {
                      setShortcode(transformWord(value));
                      clearErrors("short code");
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="accNumber">
                    Approx Cost
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <NumberInputField
                    placeholder="Approx Cost"
                    id={"approxcost"}
                    value={approxcost}
                    isRequired={false}
                    register={register}
                    reqValueError={"This field is required"}
                    SetValue={(value) => {
                      setApproxcost(value);
                      clearErrors("Approxcost");
                    }}
                    message={errors.approxcost && " Approx cost is required"}
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

export default ModuleMasterForm;
