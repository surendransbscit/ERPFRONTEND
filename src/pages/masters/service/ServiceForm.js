/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
  PreviewCard,
  ReactDualList,
  RSelect,
  SaveButton,
  TextareaInputField,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createService,
  getServiceById,
  getServiceOptions,
  updateServiceById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Row, SwitchInputField, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import DualListBox from "react-dual-listbox";
import { useShortCodeContext } from "../../../contexts/ShortCodeContexts";

const ServiceForm = () => {
  const location = useLocation();
  const animatedComponents = makeAnimated();
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
  const { isLoading: issubmitting } = useSelector((state) => state.serviceReducer);
  const { serviceInfo, serviceOptions } = useSelector((state) => state.serviceReducer);
  const [name, setName] = useState();
  const [active, setActive] = useState(true);
  const [shortCode, setShortCode] = useState();
  const [content, setContent] = useState();
  const [sendSms, setsendSms] = useState("0");
  const [sendEmail, setSendEmail] = useState("0");
  const [sendWhatsapp, setSendWhatsapp] = useState("0");
  const [selected, setSelected] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [dltId, setDltId] = useState("");

  const { isShortCodeDisabled } = useShortCodeContext();

  const initialOptions = [
    { value: "one", label: "Option One" },
    { value: "two", label: "Option Two" },
  ];

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);

  const handleChange = (selectedValues) => {
    setSelected(selectedValues);
    setTextValue(selectedValues.join(", ")); // Update text field with selected values
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedOption(selectedOptions || []); // Update selected options

    if (!selectedOptions || selectedOptions.length === 0) {
      setOptions(serviceOptions); // Reset options if none are selected
      return;
    }

    const selected = selectedOptions[selectedOptions.length - 1]; // Most recently selected
    if (selected) {
      console.log(selected);
      setContent((prev) => `${prev}@@${selected}@@`);
      setOptions((prev) => prev.filter((option) => option.value !== selected.value));
    }
  };

  useEffect(() => {
    if (serviceOptions?.length > 0) {
      setOptions(serviceOptions);
    }
  }, [serviceOptions]);

  //   const handleContentChange = (e) => {
  //     const newContent = e.target.value;
  //     const placeholders = newContent.match(/@@\w+@@/g) || [];
  //     const usedValues = placeholders.map((ph) => ph.replace(/@@/g, ""));
  //     const availableOptions = initialOptions.filter(
  //       (opt) => !usedValues.includes(opt.value)
  //     );

  //     setContent(newContent);
  //     setOptions(availableOptions);
  //   };

  const handleContentChange = (e) => {
    const newContent = e.target.value;

    // Detect all placeholders in the content
    const placeholders = newContent?.match(/@@\w+@@/g) || [];
    const usedValues = placeholders?.map((ph) => ph.replace(/@@/g, ""));
    const availableOptions = serviceOptions?.filter((opt) => !usedValues.includes(opt.value));

    // Update the content state
    setContent(newContent);

    // Update the dropdown options
    setOptions(availableOptions);

    // Remove selections for deleted placeholders
    const newSelectedOptions = selectedOption?.filter((selected) => usedValues?.includes(selected.value));
    setSelectedOption(newSelectedOptions);
  };

  const postData = async () => {
    const adddata = {
      name,
      short_code: shortCode,
      is_active: active,
      send_sms: sendSms,
      send_email: sendEmail,
      send_whatsapp: sendWhatsapp,
      content,
      dlt_id: dltId,
    };
    try {
      await dispatch(createService(adddata)).unwrap();
      toastsuccess(name + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/service/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      name,
      short_code: shortCode,
      is_active: active,
      send_sms: sendSms,
      send_email: sendEmail,
      send_whatsapp: sendWhatsapp,
      content,
      dlt_id: dltId,
    };
    try {
      await dispatch(createService(adddata)).unwrap();
      toastsuccess(name + " - Service Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/service/list`);
      setName("");
      setShortCode("");
      setSendEmail("");
      setSendWhatsapp("");
      setsendSms("");
      setActive(true);
      setContent();
      setDltId();
      setSelectedOption([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getServiceById(id));
  }, [dispatch, id]);

  useEffect(() => {
    serviceInfo != undefined &&
      (setName(serviceInfo?.name),
      setShortCode(serviceInfo?.short_code),
      setSendEmail(serviceInfo?.send_email),
      setSendWhatsapp(serviceInfo?.send_whatsapp),
      setsendSms(serviceInfo?.send_sms),
      setActive(serviceInfo?.is_active),
      setContent(serviceInfo?.content),
      setDltId(serviceInfo?.dlt_id),
      reset());
  }, [serviceInfo, reset]);

  const putData = async () => {
    const adddata = {
      name,
      short_code: shortCode,
      is_active: active,
      send_sms: sendSms,
      send_email: sendEmail,
      send_whatsapp: sendWhatsapp,
      content,
      dlt_id: dltId,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateServiceById(reduxData)).unwrap();
      toastsuccess("service Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/service/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getServiceOptions());
  }, [dispatch]);

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/service/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Service"} />
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
                  onClick={handleSubmit((data) => postAndCreateNew(data, "saveAndNew"))}
                >
                  {issubmitting ? "Saving" : "Save & New "}
                </SaveButton>

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) => postData(data, "saveAndClose"))}
                >
                  {issubmitting ? "Saving" : "Save & Close"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/service/list`)}
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton disabled={issubmitting} size="md" color="primary" onClick={handleSubmit(putData)}>
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/service/list`)}
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>

          <div className="">
            <Row lg={12} className={"form-control-sm"}>
              <Col md={3}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="name">
                          Name <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"name"}
                          placeholder="Name"
                          value={name}
                          SetValue={(value) => {
                            setName(value);
                            clearErrors("name");
                          }}
                          setValue={setValue}
                          message={errors.name && "Name is required"}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="shortCode">
                          Short Code <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          isDisabled={id != undefined || isShortCodeDisabled}
                          register={register}
                          isRequired={!isShortCodeDisabled}
                          id={"shortCode"}
                          placeholder="short Code"
                          value={shortCode}
                          SetValue={(value) => {
                            setShortCode(value);
                            clearErrors("shortCode");
                          }}
                          setValue={setValue}
                          message={errors.shortCode && "shortCode is required"}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="sms">
                          Send SMS
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="send_sms_yes"
                                type="radio"
                                name={"send_sms_yes"}
                                value={"1"}
                                className="custom-control-input"
                                checked={sendSms == "1"}
                                onChange={(e) => {
                                  setsendSms(e.target.value);
                                }}
                              />
                              <label className="custom-control-label" htmlFor="send_sms_yes">
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="send_sms_no"
                                type="radio"
                                value={"0"}
                                name={"send_sms_no"}
                                className="custom-control-input "
                                checked={sendSms == "0"}
                                onChange={(e) => {
                                  setsendSms(e.target.value);
                                }}
                              />
                              <label className="custom-control-label" htmlFor="send_sms_no">
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="email">
                          Send Email
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="send_email_yes"
                                type="radio"
                                name={"send_email_yes"}
                                value={"1"}
                                className="custom-control-input"
                                checked={sendEmail == "1"}
                                onChange={(e) => {
                                  setSendEmail(e.target.value);
                                }}
                              />
                              <label className="custom-control-label" htmlFor="send_email_yes">
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="send_email_no"
                                type="radio"
                                value={"0"}
                                name={"send_email_no"}
                                className="custom-control-input "
                                checked={sendEmail == "0"}
                                onChange={(e) => {
                                  setSendEmail(e.target.value);
                                }}
                              />
                              <label className="custom-control-label" htmlFor="send_email_no">
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="whatsapp">
                          Send Whats App
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="send_whatsapp_yes"
                                type="radio"
                                name={"send_whatsapp_yes"}
                                value={"1"}
                                className="custom-control-input"
                                checked={sendWhatsapp == "1"}
                                onChange={(e) => {
                                  setSendWhatsapp(e.target.value);
                                }}
                              />
                              <label className="custom-control-label" htmlFor="send_whatsapp_yes">
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="send_whatsapp_no"
                                type="radio"
                                value={"0"}
                                name={"send_whatsapp_no"}
                                className="custom-control-input "
                                checked={sendWhatsapp == "0"}
                                onChange={(e) => {
                                  setSendWhatsapp(e.target.value);
                                }}
                              />
                              <label className="custom-control-label" htmlFor="send_whatsapp_no">
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="dltId">
                          Dlt Id <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"dltId"}
                          placeholder="Dlt Id"
                          value={dltId}
                          SetValue={(value) => {
                            setDltId(value);
                            clearErrors("dltId");
                          }}
                          setValue={setValue}
                          message={errors.dltId && "dltId is required"}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col md={5}>
                <div className="custom-grid">
                  <Row className="form-group row">
                    <Col lg="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="selectOptions">
                          Select Options
                        </label>
                      </div>
                    </Col>
                    <Col lg="1">
                      <div style={{ maxWidth: "10px", margin: "0 auto" }}>
                        <style>
                          {`
                            .rdl-selected {
                              display: none !important;
                            }
                          `}
                        </style>
                        <DualListBox options={options} selected={selected} onChange={handleSelectChange} />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col md={4}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col lg="2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="content">
                          Content
                        </label>
                      </div>
                    </Col>
                  </Row>
                  <Col lg="8">
                    <div className="form-group">
                      <textarea
                        {...register(`content`, {
                          required: {
                            value: true,
                            message: "This field is Required",
                          },
                        })}
                        isRequired={false}
                        id={"content"}
                        placeholder="Content"
                        value={content}
                        onChange={handleContentChange}
                        rows={5}
                        cols={51}
                      />
                      {errors.content && <span className="text-danger">{"Content is required"}</span>}
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default ServiceForm;
