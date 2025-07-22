/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
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
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  createRelationType,
  getRelationTypeById,
  updateRelationTypeById,
} from "../../../redux/thunks/retailMaster";

const RelationTypeForm = () => {
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
  const { isLoading: issubmitting } = useSelector(
    (state) => state.relationTypeReducer
  );
  const { relationTypeInfo } = useSelector(
    (state) => state.relationTypeReducer
  );

  const [name, setName] = useState();
  const [active, setActive] = useState(true);

  const postData = async () => {
    const adddata = {
      name: name,
      is_active: active,
    };
    try {
      await dispatch(createRelationType(adddata)).unwrap();
      toastsuccess(name + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/relationtype/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      name: name,
      is_active: active,
    };

    try {
      await dispatch(createRelationType(adddata)).unwrap();
      toastsuccess("Relation Type Added successfully");
      setName("");
      setActive(true);
    } catch (error) {
      console.error(error);
    }
  };

  const putData = async () => {
    const adddata = {
      name: name,
      is_active: active,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateRelationTypeById(reduxData)).unwrap();
      toastsuccess("Relation Type Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/relationtype/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getRelationTypeById(id));
  }, [dispatch, id]);

  useEffect(() => {
    relationTypeInfo != null &&
      (setName(relationTypeInfo?.name),
      setActive(relationTypeInfo?.is_active),
      reset());
  }, [relationTypeInfo, reset]);
  return (
    <React.Fragment>
      <Head title={title ? title : "Relation Type"} />
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
                    navigate(
                      `${process.env.PUBLIC_URL}/master/relationtype/list`
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
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/master/relationtype/list`
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
                    placeholder="Relation Type Name"
                    value={name}
                    SetValue={(value) => {
                      setName(value);
                      clearErrors("name");
                    }}
                    message={errors.name && " name is Required"}
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

export default RelationTypeForm;
