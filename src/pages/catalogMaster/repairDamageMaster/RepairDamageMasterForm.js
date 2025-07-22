import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
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
  createRepairDamageMaster,
  getRepairDamageMasterById,
  updateRepairDamageMasterById,
} from "../../../redux/thunks/catalogMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";

const RepairDamageMasterForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading: issubmitting,
    isError,
    repairDamageMasterInfo,
  } = useSelector((state) => state.repairDamageMasterReducer);
  const [name, setName] = useState();
  const [status, setStatus] = useState(true);

  useEffect(() => {
    if (id !== undefined) {
      dispatch(getRepairDamageMasterById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (repairDamageMasterInfo !== null) {
      setName(repairDamageMasterInfo?.name);
      setStatus(repairDamageMasterInfo?.status);
      reset();
    }
  }, [repairDamageMasterInfo, reset]);

  const form_submit = async (data, actionType) => {
    if (id === undefined) {
      create(data, actionType);
    } else {
      update(data, actionType);
    }
  };

  const create = async (data, actionType) => {
    try {
      await dispatch(createRepairDamageMaster(data)).unwrap();
      toastsuccess(name + " Added successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/catalogmaster/damage_master/list`);
      }
    } catch (error) {
      let message = error?.response?.data?.message;

      if (typeof message === "string" && message.includes("name")) {
        setError("name", {
          type: "manual",
          message: "Name already exists",
        });
      }
    }
  };

  const update = async (data, actionType) => {
    const update_data = { id: id, putData: data };

    try {
      await dispatch(updateRepairDamageMasterById(update_data)).unwrap();
      toastsuccess(name + " Updated successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/catalogmaster/damage_master/list`);
      }
    } catch (error) {
      let message = error?.response?.data?.message;

      if (typeof message === "string" && message.includes("name")) {
        setError("name", {
          type: "manual",
          message: "Name already exists",
        });
      }
    }
  };

  const reset_form = async () => {
    reset("");
    setName("");
    setStatus(true);
  };
  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        if (id !== undefined) {
          handleSubmit(update)();
        } else {
          handleSubmit(create)();
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
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/damage_master/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title="Sub Design" />
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
            {/* {add !== undefined && ( */}
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
                {issubmitting ? "Saving" : "Save & Close"}
              </SaveButton>

              <CancelButton
                disabled={issubmitting}
                color="danger"
                size="md"
                onClick={() =>
                  navigate(
                    `${process.env.PUBLIC_URL}/catalogmaster/damage_master/list`
                  )
                }
              >
                Cancel
              </CancelButton>
            </Col>
            {/* )} */}
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
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/catalogmaster/damage_master/list`
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
                  <label className="form-label" htmlFor="metal_name">
                    Name
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
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
                    message={
                      errors.name &&
                      (errors.name?.message
                        ? errors.name.message
                        : "Name is Required")
                    }
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="metal_status">
                    Status
                    <isRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <SwitchInputField
                  register={register}
                  id={"status"}
                  checked={status}
                  SetValue={setStatus}
                  name={"status"}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default RepairDamageMasterForm;
