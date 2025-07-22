import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import { BlockTitle, CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createOtherWeight,
  getOtherWeightById,
  updateOtherWeightById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, Row, SwitchInputField, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const OtherWeightForm = () => {
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
  const { isLoading: issubmitting, isError } = useSelector((state) => state.otherWeightReducer);
  const { otherWeightInfo } = useSelector((state) => state.otherWeightReducer);

  const [otherweight_name, setContainerName] = useState();
  const [description, setDescription] = useState();
  const [weight, setWeight] = useState();
  const [active, setActive] = useState(true);  
  const { transformWord } = useContext(WordTransformerContext);



  const postData = async () => {
    const adddata = {
      name: otherweight_name,
      description,
      weight,
      is_active: active,
    };
    try {
      await dispatch(createOtherWeight(adddata)).unwrap();
      toastsuccess(otherweight_name + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/otherweight/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getOtherWeightById(id));
  }, [dispatch, id]);

  useEffect(() => {
    otherWeightInfo != undefined &&
      (setContainerName(otherWeightInfo?.name),
        setDescription(otherWeightInfo?.description),
        setWeight(otherWeightInfo?.weight),
        setActive(otherWeightInfo?.is_active),
        reset());
  }, [otherWeightInfo, reset]);

  const putData = async () => {
    const adddata = {
      name: otherweight_name,
      description,
      weight,
      is_active: active,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    await dispatch(updateOtherWeightById(reduxData));
    if (isError === false) {
      toastsuccess("container Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/otherweight/list`);
    }
  };

  useEffect(() => {
      if (add === undefined && id === undefined) {
          navigate(`${process.env.PUBLIC_URL}/master/otherweight/list`);
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
      <Head title={title ? title : "Other Weight"} />
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
                  onClick={handleSubmit((data) => postData(data, "saveAndNew"))}
                >
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>
                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/otherweight/list`)}
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
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/container/list`)}
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
                    id={"otherweight_name"}
                    placeholder="Other Weight Name"
                    value={otherweight_name}
                    SetValue={(value) => {
                      setContainerName(transformWord(value));
                      clearErrors("otherweight_name");
                    }}
                    message={errors.otherweight_name && " Other Weight name is Required"}
                  />
                </div>
              </Col>
            </Row>


            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Weight <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"weight"}
                    placeholder="Container Weight"
                    value={weight}
                    SetValue={(value) => {
                      setWeight(value);
                      clearErrors("weight");
                    }}
                    message={errors.weight && " weight is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="description">
                    Description
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={false}
                    id={"description"}
                    placeholder="Description"
                    value={description}
                    SetValue={(value) => {
                      setDescription(value);
                      clearErrors("");
                    }}
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

export default OtherWeightForm;
