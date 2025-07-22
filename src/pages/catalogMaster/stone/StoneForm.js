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
import { UomDropdown } from "../../../components/filters/retailFilters";
import { useUom } from "../../../components/filters/filterHooks";
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
  createStone,
  getStoneById,
  updateStoneById,
} from "../../../redux/thunks/catalogMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import { getAllRetUom, getUomList } from "../../../redux/thunks/retailMaster";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const StoneForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  console.log(id);
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
  const {
    isLoading: issubmitting,
    isError,
    stoneInfo,
  } = useSelector((state) => state.stoneReducer);
  const [stoneName, setStoneName] = useState();
  const [stoneCode, setStoneCode] = useState();
  const [stoneType, setStoneType] = useState(1);
  const [showLessWt, setShowLessWt] = useState(0);
  const [uomId, setUOMId] = useState();
  const [is_certificate_req, setIsCertificateReq] = useState();
  const [stoneStatus, setStoneStatus] = useState(true);
  const { uomOptions } = useSelector((state) => state.uomReducer);

  const { transformWord } = useContext(WordTransformerContext);

  useEffect(() => {
    if (id != undefined) {
      dispatch(getStoneById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (stoneInfo != undefined && stoneInfo != null) {
      setStoneName(stoneInfo?.stone_name);
      setStoneCode(stoneInfo?.stone_code);
      setShowLessWt(stoneInfo?.show_less_wt);
      setStoneType(stoneInfo?.stone_type);
      setUOMId(stoneInfo?.uom_id);
      setIsCertificateReq(stoneInfo?.is_certificate_req);
      setStoneStatus(stoneInfo?.stone_status);
      reset();
    }
  }, [stoneInfo, reset]);

  useEffect(() => {
    dispatch(getUomList());
  }, [dispatch]);

  const form_submit = async (data, actionType) => {
    if (id === undefined) {
      const adddata = {
        stone_name: data.stoneName,
        stone_code: data.stoneCode,
        stone_type: stoneType,
        show_less_wt: showLessWt == 1 ? true : false,
        uom_id: data.uomId,
        stone_status: data.stoneStatus,
      };
      create_Stone(adddata, actionType);
    } else {
      const updateData = {
        stone_name: data.stoneName,
        stone_code: data.stoneCode,
        show_less_wt: showLessWt == 1 ? true : false,
        stone_type: stoneType,
        uom_id: data.uomId,
        stone_status: data.stoneStatus,
      };
      update_Stone(updateData, actionType);
    }
  };

  const create_Stone = async (data, actionType) => {
    await dispatch(createStone(data));
    if (!isError) {
      toastsuccess(stoneName + " Added successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/catalogmaster/stone/list`);
      }
    } else {
      reset_form();
    }
  };

  const update_Stone = async (data, actionType) => {
    const update_data = { id: id, putData: data };
    await dispatch(updateStoneById(update_data));
    if (!isError) {
      toastsuccess(stoneName + " Updated successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/catalogmaster/stone/list`);
      }
    } else {
      reset_form();
    }
  };

  const reset_form = async () => {
    setStoneName("");
    setStoneCode("");
    setStoneType(1);
    setShowLessWt(0);
    setIsCertificateReq("");
    setUOMId("");
    setStoneStatus(true);
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        handleSubmit((data) => form_submit(data, "saveAndClose"))();
      }, 0);
    },
    { enableOnFormTags: true, preventDefault: true }
  );

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/stone/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title="Stone" />
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
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
                      `${process.env.PUBLIC_URL}/catalogmaster/stone/list`
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
                      `${process.env.PUBLIC_URL}/catalogmaster/stone/list`
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
                  <label className="form-label" htmlFor="stone">
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
                    id={"stoneName"}
                    placeholder="StoneName"
                    value={stoneName}
                    SetValue={(value) => {
                      setStoneName(transformWord(value));
                      clearErrors("stonename");
                    }}
                    message={errors.stoneName && "Stone Name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="stoneCode">
                    Code
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"stoneCode"}
                    placeholder="StoneCode"
                    value={stoneCode}
                    SetValue={(value) => {
                      setStoneCode(value);
                      clearErrors("");
                    }}
                    message={errors.stoneCode && "Stone Code is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col md="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="uomId">
                    Uom
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <UomDropdown
                    register={register}
                    id={"uomId"}
                    uomOptions={uomOptions}
                    selectedUom={uomId}
                    isRequired={true}
                    clearErrors={clearErrors}
                    onUomChange={setUOMId}
                    setValue={setValue}
                    message={errors.uomId && "UOM is Required"}
                  ></UomDropdown>
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="stoneType">
                    Type
                  </label>
                </div>
              </Col>
              <Col lg="4">
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="diamond"
                          type="radio"
                          name={"stoneType"}
                          value={1}
                          className="custom-control-input"
                          checked={stoneType == 1}
                          onChange={(e) => {
                            setStoneType(e.target.value);
                            setValue("stoneType", e.target.value);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="diamond"
                        >
                          Diamond
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="gemStones"
                          type="radio"
                          value={2}
                          name={"stoneType"}
                          className="custom-control-input "
                          checked={stoneType == 2}
                          onChange={(e) => {
                            setStoneType(e.target.value);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="gemStones"
                        >
                          Gem Stones
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="others"
                          type="radio"
                          value={3}
                          name={"stoneType"}
                          className="custom-control-input "
                          checked={stoneType == 3}
                          onChange={(e) => {
                            setStoneType(e.target.value);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="others"
                        >
                          Others
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="showLessWt">
                    Show lwt
                  </label>
                </div>
              </Col>
              <Col lg="4">
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="yes"
                          type="radio"
                          name={"showLessWt"}
                          value={1}
                          className="custom-control-input"
                          checked={showLessWt == 1}
                          onChange={(e) => {
                            setShowLessWt(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="yes">
                          Yes
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="no"
                          type="radio"
                          value={0}
                          name={"showLessWt"}
                          className="custom-control-input "
                          checked={showLessWt == 0}
                          onChange={(e) => {
                            setShowLessWt(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="no">
                          No
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="stoneStatus">
                    Status
                    <isRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SwitchInputField
                  register={register}
                  id={"stoneStatus"}
                  checked={stoneStatus}
                  SetValue={stoneStatus}
                  name={"stoneStatus"}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default StoneForm;
