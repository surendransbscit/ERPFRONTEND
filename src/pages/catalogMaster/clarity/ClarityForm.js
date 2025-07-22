import React, { useContext, useEffect, useState } from "react";
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
  createClarity,
  getClarityById,
  updateClarityById,
} from "../../../redux/thunks/catalogMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const ClarityForm = () => {
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
  const {
    isLoading: issubmitting,
    isError,
    clarityInfo,
  } = useSelector((state) => state.clarityReducer);
  const [clarity, setClarity] = useState();
  const [description, setDescription] = useState();
  const [status, setStatus] = useState(true);
  const { transformWord } = useContext(WordTransformerContext);

  useEffect(() => {
    if (id !== undefined) {
      dispatch(getClarityById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (clarityInfo != undefined) {
      setClarity(clarityInfo?.clarity);
      setDescription(clarityInfo?.description);
      setStatus(clarityInfo?.status);
      reset();
    }
  }, [clarityInfo, reset]);

  const form_submit = async (data, actionType) => {
    if (id === undefined) {
      create_clarity(data, actionType);
    } else {
      update_clarity(data, actionType);
    }
  };

  const create_clarity = async (data, actionType) => {
    try {
      await dispatch(createClarity(data)).unwrap();
      toastsuccess(clarity + " Added successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/catalogmaster/clarity/list`);
      }
    } catch (error) {
      console.error(error);
    }
    // await dispatch(createPurity(data));
    // if (!isError) {
    //   toastsuccess(purity + " Added successfully");
    //   if (actionType === "saveAndNew") {
    //     reset_form();
    //   } else if (actionType === "saveAndClose") {
    //     navigate(`${process.env.PUBLIC_URL}/catalogmaster/purity/list`);
    //   }
    // } else {
    //   reset_form();
    // }
  };

  const update_clarity = async (data, actionType) => {
    const update_data = { id: id, putData: data };
    try {
      await dispatch(updateClarityById(update_data)).unwrap();
      toastsuccess(clarity + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/clarity/list`);
    } catch (error) {
      console.error(error);
    }
    // await dispatch(updatePurityById(update_data));
    // if (!isError) {
    //   toastsuccess(purity + " Updated successfully");
    //   if (actionType === "saveAndNew") {
    //     reset_form();
    //   } else if (actionType === "saveAndClose") {
    //     navigate(`${process.env.PUBLIC_URL}/catalogmaster/purity/list`);
    //   }
    // } else {
    //   reset_form();
    // }
  };

  const reset_form = async () => {
    reset("");
    setClarity("");
    setDescription("");
    setStatus(true);
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        if (id !== undefined) {
          handleSubmit((data) => form_submit(data, "saveAndClose"))();
        } else {
          handleSubmit((data) => form_submit(data, "saveAndClose"))();
        }
      }, 0); // <-- Slight delay after blur
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/clarity/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title="Clarity" />
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
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/catalogmaster/clarity/list`
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
                  onClick={handleSubmit((data) =>
                    form_submit(data, "saveAndClose")
                  )}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/catalogmaster/clarity/list`
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
                  <label className="form-label" htmlFor="clarity">
                    Name
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"clarity"}
                    placeholder="Clarity Name"
                    value={clarity}
                    SetValue={(value) => {
                      setClarity(transformWord(value));
                      clearErrors("clarity");
                    }}
                    message={errors.clarity && "Clarity Name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
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
                    placeholder="Clarity Description"
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
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="status">
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
export default ClarityForm;
