/* eslint-disable no-unused-expressions */
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
  createOldMetalItem,
  getOldMetalItemById,
  updateOldMetalItemById,
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
import { useMetals } from "../../../components/filters/filterHooks";
import { MetalDropdown } from "../../../components/filters/retailFilters";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const OldMetalItemTypeForm = () => {
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
    (state) => state.oldMetalItemReducer
  );
  const { oldMetalItemInfo } = useSelector(
    (state) => state.oldMetalItemReducer
  );

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [touch, setTouch] = useState();
  const [rate_deduction, setRateDeduction] = useState();
  const [metal, setMetal] = useState("");
  const [active, setActive] = useState(true);
  const { metals } = useMetals();
  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      name,
      code,
      touch,
      rate_deduction,
      is_active: active,
      id_metal: metal,
    };
    try {
      await dispatch(createOldMetalItem(adddata)).unwrap();
      toastsuccess(name + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/oldmetaltype/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      name,
      code,
      setTouch,
      rate_deduction,
      is_active: active,
      id_metal: metal,
    };
    await dispatch(createOldMetalItem(adddata));
    if (isError === false) {
      toastsuccess("Old Metal Item Added successfully");
      setName("");
      setCode("");
      setTouch("");
      setRateDeduction("");
      setActive(true);
      setMetal("");
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getOldMetalItemById(id));
  }, [dispatch, id]);

  useEffect(() => {
    oldMetalItemInfo != undefined &&
      (setName(oldMetalItemInfo?.name),
      setCode(oldMetalItemInfo?.code),
      setTouch(oldMetalItemInfo?.touch),
      setRateDeduction(oldMetalItemInfo?.rate_deduction),
      setActive(oldMetalItemInfo?.is_active),
      setMetal(oldMetalItemInfo?.id_metal),
      reset());
  }, [oldMetalItemInfo, reset]);

  const putData = async () => {
    const adddata = {
      name,
      code,
      touch,
      rate_deduction,
      is_active: active,
      id_metal: metal,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    await dispatch(updateOldMetalItemById(reduxData));
    if (isError === false) {
      toastsuccess("old metal item Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/oldmetaltype/list`);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/oldmetaltype/list`);
    }
  }, [add, id, navigate]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        if (id !== undefined) {
          handleSubmit(putData)();
        } else {
          handleSubmit(postData)();
        }
      }, 0); // <-- Slight delay after blur
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  return (
    <React.Fragment>
      <Head title={title ? title : "Old Metal Item"} />
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
                  {issubmitting ? "Saving" : "Save & New "}
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
                      `${process.env.PUBLIC_URL}/master/oldmetaltype/list`
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
                      `${process.env.PUBLIC_URL}/master/oldmetaltype/list`
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
                  <label className="form-label" htmlFor="metal">
                    Metal
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <MetalDropdown
                    register={register}
                    id={"metal"}
                    metals={metals}
                    selectedMetal={metal}
                    onMetalChange={setMetal}
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
                  ></MetalDropdown>
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
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
                    placeholder="Old Metal Item Name"
                    value={name}
                    SetValue={(value) => {
                      setName(transformWord(value));
                      clearErrors("name");
                    }}
                    message={errors.name && " Old Metal Item name is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Code <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"code"}
                    placeholder="Code"
                    value={code}
                    SetValue={(value) => {
                      setCode(value);
                      clearErrors("code");
                    }}
                    message={errors.code && " code id is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Touch <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"touch"}
                    placeholder="Touch"
                    value={touch}
                    SetValue={(value) => {
                      setTouch(value);
                      clearErrors("touch");
                    }}
                    message={errors.touch && " Touch is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Rate Deduction <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"rate_deduction"}
                    placeholder="Rate Deduction"
                    value={rate_deduction}
                    SetValue={(value) => {
                      setRateDeduction(value);
                      clearErrors("rate_deduction");
                    }}
                    message={
                      errors.rate_deduction && "Rate Deduction is Required"
                    }
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="active">
                    Active
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SwitchInputField
                  register={register}
                  id={"active"}
                  checked={active}
                  SetValue={setActive}
                  name={"active"}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default OldMetalItemTypeForm;
