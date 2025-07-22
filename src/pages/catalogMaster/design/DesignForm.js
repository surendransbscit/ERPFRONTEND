import React, { useContext, useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import { BlockTitle, CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { Col, Row, SwitchInputField, TextInputField } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { createDesign, getDesignById, updateDesignById } from "../../../redux/thunks/catalogMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import ProductDropdownMulti from "../../../components/common/dropdown/ProductDropdownMulti";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const DesignForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    setError,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError, designInfo } = useSelector((state) => state.designReducer);
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const [designName, setDesignName] = useState();
  const [product, setProduct] = useState([]);
  const [isProductMapReq, setIsProductMapReq] = useState(false);
  const [designStatus, setDesignStatus] = useState(true);

  const { transformWord } = useContext(WordTransformerContext);

  const [designCode, setDesignCode] = useState();

  useEffect(() => {
    if (id !== undefined) {
      dispatch(getDesignById(id));
    }
  }, [dispatch, id]);

  // useEffect(() => {
  //   setIsProductMapReq(parseInt(settings?.is_design_mapping_req) === 1 ? true : false);
  // }, [settings]);

  useEffect(() => {
    if (designInfo !== null) {
      setDesignName(designInfo?.design_name);
      setDesignStatus(designInfo?.status);
      setProduct(designInfo?.products);
      setDesignCode(designInfo?.design_code);
      reset();
    }
  }, [designInfo, reset]);

  const saveDesign = async () => {
    const addData = {
      design_name: designName,
      design_code: designCode,
      product: product?.map((obj) => {
        const container = obj.value;
        return container;
      }),
    };
    try {
      await dispatch(createDesign(addData)).unwrap();
      toastsuccess(designName + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/design/list`);
    } catch (error) {
      let message = error?.response?.data?.message;
      if (typeof message === "string" && message.includes("design_name")) {
        setError("design_name", {
          type: "manual",
          message: "Design name already exists",
        });
      }
    }
  };

  const createAndNewDesign = async () => {
    const addData = {
      design_name: designName,
      design_code: designCode,
      product: product?.map((obj) => {
        const container = obj.value;
        return container;
      }),
    };
    try {
      await dispatch(createDesign(addData)).unwrap();

      toastsuccess(designName + " Added successfully");

      reset_form();
    } catch (error) {
      let message = error?.response?.data?.message;

      if (typeof message === "string" && message.includes("design_name")) {
        setError("design_name", {
          type: "manual",
          message: "Design name already exists",
        });
      }
    }
  };

  const updateDesign = async () => {
    const addData = {
      design_name: designName,
      design_code: designCode,
      product: product?.map((obj) => {
        const container = obj.value;
        return container;
      }),
    };
    const update_data = { id: id, putData: addData };
    try {
      await dispatch(updateDesignById(update_data)).unwrap();
      toastsuccess(designName + " Updated successfully");

      navigate(`${process.env.PUBLIC_URL}/catalogmaster/design/list`);
    } catch (error) {
      let message = error?.response?.data?.message;

      if (typeof message === "string" && message.includes("design_name")) {
        setError("design_name", {
          type: "manual",
          message: "Design name already exists",
        });
      }
    }
  };

  const reset_form = async () => {
    reset("");
    setDesignName("");
    setDesignStatus(true);
    setDesignCode("");
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/design/list`);
    }
  }, [add, id, navigate]);

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (id !== undefined) {
      handleSubmit(updateDesign());
    } else {
      handleSubmit(saveDesign());
    }
  },{
    enableOnFormTags: true, // Enable hotkeys inside input fields
    preventDefault: true, // Prevent default browser Save
  });

  return (
    <React.Fragment>
      <Head title="Design" />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            {add !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(createAndNewDesign)}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

                <SaveButton disabled={issubmitting} size="md" color="primary" onClick={handleSubmit(saveDesign)}>
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/catalogmaster/design/list`)}
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton disabled={issubmitting} size="md" color="primary" onClick={handleSubmit(updateDesign)}>
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/catalogmaster/design/list`)}
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
                    Design Name
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"design_name"}
                    placeholder="Design Name"
                    value={designName}
                    SetValue={(value) => {
                      setDesignName(transformWord(value));
                      clearErrors("design_name");
                    }}
                    message={
                      errors.design_name &&
                      (errors.design_name?.message ? errors.design_name.message : "Design Name is Required")
                    }
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="metal_name">
                    Design Code
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"design_code"}
                    placeholder="Design code"
                    value={designCode}
                    SetValue={(value) => {
                      setDesignCode(transformWord(value));
                      clearErrors("design_code");
                    }}
                    message={
                      errors.design_code &&
                      (errors.design_code?.message ? errors.design_code.message : "Design code is Required")
                    }
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="metal_status">
                    Design Status
                    <isRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <SwitchInputField
                  id={"status"}
                  register={register}
                  checked={designStatus}
                  SetValue={setDesignStatus}
                  name={"status"}
                />
              </Col>
            </Row>

            {isProductMapReq && (
              <Row md={12} className="form-group row g-4">
                <Col lg="2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="metal_status">
                      Map Product
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="2">
                  <ProductDropdownMulti value={product} SetValue={setProduct} />
                </Col>
              </Row>
            )}
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default DesignForm;
