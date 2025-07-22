import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import { CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createCity,
  createState,
  getCityById,
  getStateById,
  updateCityById,
  updateStateById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, NumberInputField, Row, SwitchInputField, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useCountries, useStates } from "../../../components/filters/filterHooks";
import { StateDropdown } from "../../../components/filters/retailFilters";
import { useHotkeys } from "react-hotkeys-hook";

const CityForm = () => {
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
  const { isLoading: issubmitting, isError } = useSelector((state) => state.cityReducer);
  const { cityInfo } = useSelector((state) => state.cityReducer);
  const { states } = useStates();

  const [name, setName] = useState();
  const [active, setActive] = useState(true);
  const [state, setState] = useState("");

  const postData = async () => {
    const adddata = {
      name,
      state,
      is_default: active,
    };
    try {
      await dispatch(createCity(adddata)).unwrap();
      toastsuccess(name + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/city/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      name,
      state,
      is_default: active,
    };
    try {
      await dispatch(createCity(adddata)).unwrap();
      toastsuccess("state Added successfully");
      setName("");
      setState("");
      setActive(true);
    } catch (error) {
      console.error(error);
    }
   
  };

  useEffect(() => {
    id !== undefined && dispatch(getCityById(id));
  }, [dispatch, id]);

  useEffect(() => {
    cityInfo != undefined &&
      (setName(cityInfo?.name), setState(cityInfo?.state), setActive(cityInfo?.is_default), reset());
  }, [cityInfo, reset]);

  const putData = async () => {
    const adddata = {
      name,
      state,
      is_default: active,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };

    try {
      await dispatch(updateCityById(reduxData)).unwrap();
      toastsuccess("City Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/city/list`);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   if (add === undefined && id === undefined) {
  //     navigate(`${process.env.PUBLIC_URL}/master/city/list`);
  //   }
  // }, [add, id, navigate]);
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
      <Head title={title ? title : "City"} />
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
                  {issubmitting ? "Saving" : "Save & Close"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/city/list`)}
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
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/city/list`)}
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col md="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="state">
                    State
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <StateDropdown
                    register={register}
                    id={"state"}
                    states={states}
                    selectedState={state}
                    onStateChange={setState}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.state && "State is Required"}
                  ></StateDropdown>
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    City Name
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"name"}
                    placeholder="City Name"
                    value={name}
                    SetValue={(value) => {
                      setName(value);
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
                  <label className="form-label" htmlFor="active">
                    Is Defaut
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

export default CityForm;
