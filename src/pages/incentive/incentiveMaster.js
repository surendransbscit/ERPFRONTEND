/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
  DateInputField,
  NumberInputField,
} from "../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  toastfunc,
  toastsuccess,
} from "../../components/sds-toast-style/toast-style";
import { Col, Icon, Row, TextInputField } from "../../components/Component";
import IsRequired from "../../components/erp-required/erp-required";
import {
  createIncentiveSettings,
  getIncentiveSettingsById,
  updateIncentiveSettings,
  createRegisteredDevice,
  getCounterOptions,
  getRegisteredDeviceById,
  updateRegisteredDeviceById,
} from "../../redux/thunks/retailMaster";
import {
  BranchDropdown,
  SectionDropdown,
} from "../../components/filters/retailFilters";
import { useBranches, useSections } from "../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { Button } from "reactstrap";
import { v4 as uuid } from "uuid";
import moment from "moment/moment";
import { useHotkeys } from "react-hotkeys-hook";

const IncentiveForm = () => {
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
    setValue,
    // watch,
    // getValues
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { isLoading: issubmitting, incentiveSettingsInfo } = useSelector(
    (state) => state.incentiveSettingsReducer
  );
  const [branch, setBranch] = useState();

  const { sections } = useSections();
  console.log("sections", sections);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { branches } = useBranches();
  const [pcs_target_type, setPcs_target_type] = useState();
  const [pcs_target_value, setPcs_target_value] = useState(0);
  const [target_pieces, setTarget_pieces] = useState(0);
  const [amt_target_type, setAmt_target_type] = useState();
  const [amount, setAmount] = useState(0);
  const [amt_target_value, setAmt_target_value] = useState(0);
  const [target_weight, setTarget_weight] = useState(0);
  const [wt_target_type, setWt_target_type] = useState();
  const [wt_target_value, setWt_target_value] = useState(0);
  const [sectionIds, setSectionIds] = useState([]);
  console.log("sectionIds", sectionIds); //2
  console.log("setSectionIds", setSectionIds);

  useEffect(() => {
    if (id !== undefined) {
      try {
        dispatch(getIncentiveSettingsById(id)).unwrap();
      } catch (error) {
        console.error(error);
      }
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id !== undefined && incentiveSettingsInfo !== null) {
      setBranch(incentiveSettingsInfo.branch);
      setStartDate(incentiveSettingsInfo.start_date);
      setStartDate(
        moment(incentiveSettingsInfo.start_date, "DD-MM-YYYY").toDate()
      );
      setEndDate(moment(incentiveSettingsInfo.end_date, "DD-MM-YYYY").toDate());
      setPcs_target_type(incentiveSettingsInfo.pcs_target_type);
      setPcs_target_value(incentiveSettingsInfo.pcs_target_value);
      setTarget_pieces(incentiveSettingsInfo.target_pieces);
      setAmt_target_type(incentiveSettingsInfo.amt_target_type);
      setAmount(incentiveSettingsInfo.amount);
      setAmt_target_value(incentiveSettingsInfo.amt_target_value);
      setTarget_weight(incentiveSettingsInfo.target_weight);
      setWt_target_type(incentiveSettingsInfo.wt_target_type);
      setWt_target_value(incentiveSettingsInfo.wt_target_value);
      setSectionIds(incentiveSettingsInfo.section);
      reset();
    }
  }, [incentiveSettingsInfo, id, reset]);

  const postData = async () => {
    const adddata = {
      branch: branch,
      sections: sectionIds,
      start_date: moment(startDate).format("YYYY-MM-DD"),
      end_date: moment(endDate).format("YYYY-MM-DD"),
      pcs_target_type: pcs_target_type,
      pcs_target_value: pcs_target_value,
      target_pieces: target_pieces,
      amt_target_type: amt_target_type,
      amount: amount,
      amt_target_value: amt_target_value,
      target_weight: target_weight,
      wt_target_type: wt_target_type,
      wt_target_value: wt_target_value,
    };
    try {
      await dispatch(createIncentiveSettings(adddata)).unwrap();
      toastsuccess("Incentive Added successfully");
      navigate(`${process.env.PUBLIC_URL}/incentive/master/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const UpdateData = async () => {
    const adddata = {
      id: id,
      branch: branch,
      section: sectionIds.length > 0 ? sectionIds[0] : null,
      from_date: moment(startDate).format("YYYY-MM-DD"),
      to_date: moment(endDate).format("YYYY-MM-DD"),
      pcs_target_type: pcs_target_type,
      pcs_target_value: pcs_target_value,
      target_pieces: target_pieces,
      amt_target_type: amt_target_type,
      amount: amount,
      amt_target_value: amt_target_value,
      target_weight: target_weight,
      wt_target_type: wt_target_type,
      wt_target_value: wt_target_value,
    };

    try {
      await dispatch(updateIncentiveSettings(adddata)).unwrap();
      toastsuccess("Incentive Update successfully");
      navigate(`${process.env.PUBLIC_URL}/incentive/master/list`);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/incentive/master/list`);
    }
  }, [add, id, navigate]);

  useEffect(() => {
    dispatch(getCounterOptions());
  }, [dispatch]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        if (id !== undefined) {
          handleSubmit(UpdateData)();
        } else {
          handleSubmit(postData)();
        }
      }, 0);
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/incentive/master/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Incentive"} />
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
                  onClick={handleSubmit(postData)}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>
                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/incentive/master/list`)
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
                  onClick={handleSubmit(UpdateData)}
                >
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>
                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/incentive/master/list`)
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
                  <label className="form-label" htmlFor="scheme">
                    Branch
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group ">
                  <BranchDropdown
                    register={register}
                    id={"branch"}
                    branches={branches}
                    selectedBranch={branch}
                    onBranchChange={setBranch}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.branch && "Branch is Required"}
                  ></BranchDropdown>
                </div>
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="id_section">
                    Section
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SectionDropdown
                  isMulti={true}
                  register={register}
                  isRequired={true}
                  id={"sectionIds"}
                  placeholder="Section"
                  value={sectionIds}
                  selectedSection={sectionIds}
                  optionLabel="Select Section"
                  sectionOptions={sections || []}
                  setValue={setValue}
                  onSectionChange={(value) => {
                    const safeArray = Array.isArray(value) ? value : [value];
                    setSectionIds(safeArray);
                    clearErrors("sectionIds");
                  }}
                  // message={errors.sectionIds && "id_section is Required"}
                />
              </Col>
            </Row>
            <Row md={12} className="form-group row g-3">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="id_section">
                    Set Target
                    <IsRequired />
                  </label>
                </div>
              </Col>

              <div className="table-responsive" style={{ width: "500px" }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Target For</th>
                      <th>Value</th>
                      <th>Target</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <label className="form-label" htmlFor="pcs_target_type">
                          Pieces
                        </label>
                      </td>
                      <td>
                        <div style={{ width: "75px" }}>
                          <NumberInputField
                            id={"pcs_target_value"}
                            value={pcs_target_value}
                            setValue={setValue}
                            register={register}
                            SetValue={(value) => {
                              setPcs_target_value(value);
                              clearErrors("pcs_target_value");
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "75px" }}>
                          <NumberInputField
                            register={register}
                            id={"target_pieces"}
                            value={target_pieces}
                            setValue={setValue}
                            SetValue={(value) => {
                              setTarget_pieces(value);
                              clearErrors("target_pieces");
                            }}
                          />
                        </div>
                      </td>
                      <td className="text-center align-middle">
                        <select
                          className="form-select form-select-sm"
                          id="pcs_target_type"
                          value={pcs_target_type}
                          onChange={(e) => {
                            setPcs_target_type(e.target.value);
                            clearErrors("pcs_target_type");
                          }}
                        >
                          <option>--Select Type --</option>
                          <option value={1}> Per Piece </option>
                          <option value={2}> Flat </option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="form-label" htmlFor="pcs_target_type">
                          Amount
                        </label>
                      </td>
                      <td>
                        <div style={{ width: "75px" }}>
                          <NumberInputField
                            register={register}
                            id={"amt_target_value"}
                            value={amt_target_value}
                            defaultValue={0}
                            setValue={setValue}
                            SetValue={(value) => {
                              setAmt_target_value(value);
                              clearErrors("amt_target_value");
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "75px" }}>
                          <NumberInputField
                            register={register}
                            id={"amount"}
                            value={amount}
                            setValue={setValue}
                            SetValue={(value) => {
                              setAmount(value);
                              clearErrors("amount");
                            }}
                          />
                        </div>
                      </td>
                      <td className="text-center align-middle">
                        <select
                          className="form-select form-select-sm"
                          id="amt_target_type"
                          value={amt_target_type}
                          onChange={(e) => {
                            setAmt_target_type(e.target.value);
                            clearErrors("amt_target_type");
                          }}
                        >
                          <option>--Select Type --</option>
                          <option value={1}> Per Percentage </option>
                          <option value={2}> Flat </option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="form-label" htmlFor="pcs_target_type">
                          Weight
                        </label>
                      </td>
                      <td>
                        <div style={{ width: "75px" }}>
                          <NumberInputField
                            register={register}
                            id={"wt_target_value"}
                            value={wt_target_value}
                            defaultValue={0}
                            setValue={setValue}
                            SetValue={(value) => {
                              setWt_target_value(value);
                              clearErrors("wt_target_value");
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ width: "75px" }}>
                          <NumberInputField
                            register={register}
                            id={"target_weight"}
                            value={target_weight}
                            defaultValue={0}
                            setValue={setValue}
                            SetValue={(value) => {
                              setTarget_weight(value);
                              clearErrors("target_weight");
                            }}
                          />
                        </div>
                      </td>
                      <td className="text-center align-middle">
                        <select
                          className="form-select form-select-sm"
                          id="wt_target_type"
                          value={wt_target_type}
                          onChange={(e) => {
                            setWt_target_type(e.target.value);
                            clearErrors("wt_target_type");
                          }}
                        >
                          <option>--Select Type --</option>
                          <option value={1}> Per Gram </option>
                          <option value={2}> Flat </option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="startdate">
                    Start Date
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <DateInputField
                  minDate={new Date()}
                  showYearDropdown={true}
                  showMonthDropdown={true}
                  id={"start_date"}
                  selected={startDate}
                  SetValue={setStartDate}
                />
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="endDate">
                    End Date
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <DateInputField
                  minDate={new Date()}
                  showYearDropdown={true}
                  showMonthDropdown={true}
                  id={"end_date"}
                  selected={endDate}
                  SetValue={setEndDate}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default IncentiveForm;
