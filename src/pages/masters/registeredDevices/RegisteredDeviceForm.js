import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
  Icon,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createRegisteredDevice,
  getCounterOptions,
  getRegisteredDeviceById,
  updateRegisteredDeviceById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const RegisteredDeviceForm = () => {
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
    (state) => state.registeredDeviceReducer
  );
  const { registeredDeviceInfo } = useSelector((state) => state.registeredDeviceReducer);
  const { counterOptions } = useSelector((state) => state.counterReducer);


  const [name, setName] = useState();
  const [refNo, setRefNo] = useState();
  const [counter, setCounter] = useState();
  const [active, setActive] = useState(true);
  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      name,
      id_counter: counter,
      ref_no: refNo,
      is_active: active,
    };
    try {
      await dispatch(createRegisteredDevice(adddata)).unwrap();
      toastsuccess(name + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/registered_devices/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      name,
      id_counter: counter,
      ref_no: refNo,
      is_active: active,
    };

    await dispatch(createRegisteredDevice(adddata));
    if (isError === false) {
      toastsuccess("Registered Device Added successfully");
      setName("");
      setCounter("");
      setRefNo("");
      setActive(true);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getRegisteredDeviceById(id));
  }, [dispatch, id]);

  useEffect(() => {
    registeredDeviceInfo != undefined &&
      (
        setName(registeredDeviceInfo?.name),
        setCounter(registeredDeviceInfo?.id_counter),
        setRefNo(registeredDeviceInfo?.ref_no),
        setActive(registeredDeviceInfo?.is_active),
        reset());
  }, [registeredDeviceInfo, reset]);

  const putData = async () => {
    const adddata = {
      name,
      id_counter: counter,
      ref_no: refNo,
      is_active: active,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    await dispatch(updateRegisteredDeviceById(reduxData));
    if (isError === false) {
      toastsuccess("Registered Device Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/registered_devices/list`);
    }
  };

  useEffect(() => {
    dispatch(getCounterOptions());
  }, [dispatch]);

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/registered_devices/list`);
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
      <Head title={title ? title : "Registered Device"} />
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
                    navigate(`${process.env.PUBLIC_URL}/master/registered_devices/list`)
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
                    navigate(`${process.env.PUBLIC_URL}/master/registered_devices/list`)
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col md="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="floor">
                    Counter
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <div className="form-control-select">
                      <select
                        className="form-control form-select"
                        id="counter"
                        {...register("counter", {
                          required: true,
                        })}
                        value={counter}
                        onChange={(e) => {
                          setCounter(e.target.value);
                        }}
                        placeholder="Counter"
                      >
                        <option label="Select Counter" value=""></option>
                        {counterOptions?.map((item, index) => (
                          <option key={index} value={item?.id_counter}>
                            {item.counter_name}
                          </option>
                        ))}
                      </select>
                      {errors?.counter && (
                        <span className="invalid">This field is required</span>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="4">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"name"}
                    placeholder="Device Name"
                    value={name}
                    SetValue={(value) => {
                      setName(transformWord(value));
                      clearErrors("name");
                    }}
                    message={errors.name && "Device name is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="refNo">
                    Ref No <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="4">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"refNo"}
                    placeholder="Ref No"
                    value={refNo}
                    SetValue={(value) => {
                      setRefNo(value);
                      clearErrors("refNo");
                    }}
                    message={errors.refNo && "Ref No is Required"}
                  />
                </div>
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
      </Content>
    </React.Fragment>
  );
};

export default RegisteredDeviceForm;
