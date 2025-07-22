import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import { BlockTitle, CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { createArea, getAreaById, updateAreaById } from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, NumberInputField, Row, SwitchInputField, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import ShortCutKeys from "../../../components/shortCutKeys/ShortCutKeys";

const AreaForm = () => {
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
  const { isLoading: issubmitting, isError } = useSelector((state) => state.areaReducer);
  const { areaInfo } = useSelector((state) => state.areaReducer);

  const [area_name, setAreaName] = useState();
  const [pincode, setPincode] = useState();
  const [postal, setPostal] = useState();
  const [taluk, setTaluk] = useState();
  const [is_default, setIsDefault] = useState(false);
  const [active, setActive] = useState(true);

  const postData = async () => {
    const adddata = {
      area_name,
      pincode,
      is_default,
      is_active: active,
      postal,
      taluk,
    };
    try {
      await dispatch(createArea(adddata)).unwrap();
      toastsuccess(area_name + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/area/list`);
    } catch (error) {
      console.error(error);
    }
    // await dispatch(createArea(adddata));
    // if (isError === false) {
    //   toastsuccess(area_name + " Added successfully");
    //   navigate(`${process.env.PUBLIC_URL}/master/area/list`);
    // }
  };

  let data = location?.pathname.split("/");
  data[0] = "Home";
  const pathnames = location.pathname.split("/").filter((x) => x);
  const breadoptions = data?.map((obj, i) => {
    const container = {};
    container.name = obj;
    if (data[i] == "Home") {
      container.link = `/`;
    } else {
      container.link = pathnames.slice(0, i).join("/");
    }

    return container;
  });

  const postAndCreateNew = async () => {
    const adddata = {
      area_name,
      pincode,
      is_default,
      is_active: active,
      postal,
      taluk,
    };

    try {
      await dispatch(createArea(adddata)).unwrap();
      toastsuccess("area Added successfully");
      setAreaName("");
      setPincode("");
      setTaluk("");
      setPostal("");
      setIsDefault(false);
      setActive(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getAreaById(id));
  }, [dispatch, id]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    areaInfo != undefined &&
      (setAreaName(areaInfo?.area_name),
      setPincode(areaInfo?.pincode),
      setPostal(areaInfo?.postal),
      setTaluk(areaInfo?.taluk),
      setIsDefault(areaInfo?.is_default),
      setActive(areaInfo?.is_active),
      reset());
  }, [areaInfo, reset]);

  const putData = async () => {
    const adddata = {
      area_name,
      pincode,
      is_default,
      is_active: active,
      postal,
      taluk,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };

    try {
      await dispatch(updateAreaById(reduxData)).unwrap();
      toastsuccess("Area Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/area/list`);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   if (add === undefined && id === undefined) {
  //     navigate(`${process.env.PUBLIC_URL}/master/area/list`);
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


  // Reload Shortcut (Ctrl+R)
  useHotkeys("ctrl+r", (event) => {
    event.preventDefault();
    window.location.reload();
  });

  useHotkeys("ctrl+v", (event) => {
    event.preventDefault();
    reset(); // This will reset the form to its initial state
  });

  return (
    <React.Fragment>
      <Head title={title ? title : "Area"} />
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
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/area/list`)}
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
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/area/list`)}
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
                    id={"area_name"}
                    placeholder="Area Name"
                    value={area_name}
                    SetValue={(value) => {
                      setAreaName(value);
                      clearErrors("area_name");
                    }}
                    message={errors.area_name && " area name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="pincode">
                    Pincode <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <NumberInputField
                    placeholder="Pincode"
                    id={"pincode"}
                    value={pincode}
                    isRequired={true}
                    register={register}
                    minLength={6}
                    maxLength={6}
                    min={100000}
                    max={999999}
                    reqValueError={"This field is required"}
                    minError={"Minimum value is 6"}
                    minLengthError={"Minimum length is 6 digits"}
                    maxLengthError={"Maximum length is 6 digits"}
                    maxError={"Max Length is 6"}
                    SetValue={(value) => {
                      setPincode(value);
                      clearErrors("pincode");
                    }}
                    // message={errors.pincode && "pincode is Required"}
                  />
                  {errors.pincode && <span className="text-danger">{errors.pincode.message}</span>}
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Postal <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"postal"}
                    placeholder="Postal Name"
                    value={postal}
                    SetValue={(value) => {
                      setPostal(value);
                      clearErrors("postal");
                    }}
                    message={errors.postal && " Postal name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="taluk">
                    Taluk <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"taluk"}
                    placeholder="Taluk Name"
                    value={taluk}
                    SetValue={(value) => {
                      setTaluk(value);
                      clearErrors("taluk");
                    }}
                    message={errors.taluk && " Taluk name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="is_default">
                    Is Default
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SwitchInputField
                  register={register}
                  id={"is_default"}
                  checked={is_default}
                  SetValue={setIsDefault}
                  name={"is_default"}
                />
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
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
        <ShortCutKeys Save={true} Reload={true} Reset={true} />
      </Content>
    </React.Fragment>
  );
};

export default AreaForm;
