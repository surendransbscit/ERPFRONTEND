import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import { BlockTitle, CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { createCountry, getCountryById, updateCountryById } from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, Row, SwitchInputField, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";

const CountryForm = () => {
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

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector((state) => state.countryReducer);
  const { countryInfo } = useSelector((state) => state.countryReducer);

  const [name, setname] = useState("");
  const [shortName, setShortName] = useState("");
  const [currencyName, setCurrencyName] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [mobCode, setMobCode] = useState("");
  const [mobNoLen, setMobNoLen] = useState("");
  const [isDefault, setIsDefault] = useState(1);

  const postData = async () => {
    const adddata = {
      name,
      shortname: shortName,
      currency_name: currencyName,
      currency_code: currencyCode,
      mob_code: mobCode,
      mob_no_len: mobNoLen,
      is_default: isDefault,
    };
    try {
      await dispatch(createCountry(adddata)).unwrap();
      toastsuccess("Country Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/country/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      name,
      shortname: shortName,
      currency_name: currencyName,
      currency_code: currencyCode,
      mob_code: mobCode,
      mob_no_len: mobNoLen,
      is_default: isDefault,
    };

    try {
      await dispatch(createCountry(adddata)).unwrap();
      toastsuccess("Country Added successfully");
      setname("");
      setShortName("");
      setCurrencyCode("");
      setCurrencyName("");
      setMobCode("");
      setMobNoLen("");
      setIsDefault(1);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getCountryById(id));
  }, [dispatch, id]);

  useEffect(() => {
    countryInfo != undefined &&
      (setname(countryInfo?.name),
      setShortName(countryInfo?.shortname),
      setCurrencyCode(countryInfo?.currency_code),
      setCurrencyName(countryInfo?.currency_name),
      setMobCode(countryInfo?.mob_code),
      setMobNoLen(countryInfo?.mob_no_len),
      setIsDefault(countryInfo?.is_default),
      reset());
  }, [countryInfo, reset]);

  const putData = async () => {
    const adddata = {
      name,
      shortname: shortName,
      currency_name: currencyName,
      currency_code: currencyCode,
      mob_code: mobCode,
      mob_no_len: mobNoLen,
      is_default: isDefault,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateCountryById(reduxData)).unwrap();
      toastsuccess("Country Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/country/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/country/list`);
    }
  }, [add, id, navigate]);


  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (id !== undefined) {
      handleSubmit(putData)();
    } else {
      handleSubmit(postData)();
    }
  },{
    enableOnFormTags: true, // Enable hotkeys inside input fields
    preventDefault: true, // Prevent default browser Save
  });

  return (
    <React.Fragment>
      <Head title={title ? title : "Country"} />
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
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) => postData(data, "saveAndClose"))}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/country/list`)}
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton disabled={issubmitting} size="md" color="primary" onClick={handleSubmit(putData)}>
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/country/list`)}
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
                  <label className="form-label" htmlFor="site-name">
                    Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"name"}
                    placeholder="Country Name"
                    value={name}
                    SetValue={(value) => {
                      setname(value);
                      clearErrors("name");
                    }}
                    message={errors.name && "name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="shortName">
                    Short Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"shortName"}
                    placeholder="Short Name"
                    value={shortName}
                    SetValue={(value) => {
                      setShortName(value);
                      clearErrors("shortName");
                    }}
                    message={errors.shortName && "shortName is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="currencyName">
                    Currency Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"currencyName"}
                    placeholder="Currency Name"
                    value={currencyName}
                    SetValue={(value) => {
                      setCurrencyName(value);
                      clearErrors("currencyName");
                    }}
                    message={errors.currencyName && "currencyName is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="currencyCode">
                    Currency Code <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"currencyCode"}
                    placeholder="Currency Code"
                    value={currencyCode}
                    SetValue={(value) => {
                      setCurrencyCode(value);
                      clearErrors("currencyCode");
                    }}
                    message={errors.currencyCode && "currencyCode is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="mobCode">
                    Mobile Code <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"mobCode"}
                    placeholder="Mobile Code"
                    value={mobCode}
                    SetValue={(value) => {
                      setMobCode(value);
                      clearErrors("mobCode");
                    }}
                    message={errors.mobCode && "mobCode is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="mobNoLen">
                    Mobile Code Length
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"mobNoLen"}
                    placeholder="Mobile Code Length"
                    value={mobNoLen}
                    SetValue={(value) => {
                      setMobNoLen(value);
                      clearErrors("mobNoLen");
                    }}
                    message={errors.mobNoLen && "mobNoLen is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="isDefault">
                    Is Default
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <SwitchInputField
                  register={register}
                  id={"isDefault"}
                  checked={isDefault}
                  SetValue={setIsDefault}
                  name={"isDefault"}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default CountryForm;
