import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createReligionMaster,
  createStockIssueType,
  getReligionMasterById,
  getStockIssueTypeById,
  updateReligionMasterById,
  updateStockIssueTypeById,
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

const ReligionMasterForm = () => {
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
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.religionMasterReducer
  );
  const { religionMasterInfo } = useSelector((state) => state.religionMasterReducer);

  const [name, setName] = useState();
  const [active, setActive] = useState(true);

  const postData = async () => {
    const adddata = {
      name,
      is_active: active,
    };
    try {
      await dispatch(createReligionMaster(adddata)).unwrap();
      toastsuccess(name + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/religion/list`);
    } catch (error) {
      console.error(error);
    }

  };

  const postAndCreateNew = async () => {
    const adddata = {
      name,
      is_active: active,
    };

    await dispatch(createReligionMaster(adddata));
    if (isError === false) {
      toastsuccess("religion Added successfully");
      setName("");
      setActive(true);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getReligionMasterById(id));
  }, [dispatch, id]);

  useEffect(() => {
    religionMasterInfo != undefined &&
      (
        setName(religionMasterInfo?.name),
        setActive(religionMasterInfo?.is_active),
        reset());
  }, [religionMasterInfo, reset]);

  const putData = async () => {
    const adddata = {
      name,
      is_active: active,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };

    await dispatch(updateReligionMasterById(reduxData));
    if (isError === false) {
      toastsuccess("religion Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/religion/list`);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/religion/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Religion"} />
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
                  {issubmitting ? "Saving" : "Save & Close"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/master/religion/list`)
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
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/master/religion/list`)
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
                  <label className="form-label" htmlFor="name">
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
                    placeholder="Religion Name"
                    value={name}
                    SetValue={(value) => {
                      setName(value);
                      clearErrors("name");
                    }}
                    message={errors.name && "Religion name is Required"}
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

export default ReligionMasterForm;
