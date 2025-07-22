import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createAccountHead,
  getAccountHeadById,
  updateAccountHeadById,
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
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const AccountHeadForm = () => {
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
    (state) => state.accountHeadReducer
  );
  const { accountHeadInfo } = useSelector((state) => state.accountHeadReducer);

  const [name, setName] = useState();
  const [active, setActive] = useState(true);
  const [type, setType] = useState(1);

  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      name,
      type,
      is_active: active,
    };
    try {
      await dispatch(createAccountHead(adddata)).unwrap();
      toastsuccess("Account Head Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/accounthead/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      name,
      type,

      is_active: active,
    };
    await dispatch(createAccountHead(adddata));
    if (isError === false) {
      toastsuccess("account head Added successfully");
      setName("");
      setType(1);
      setActive(true);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getAccountHeadById(id));
  }, [dispatch, id]);

  useEffect(() => {
    accountHeadInfo != undefined &&
      (setName(accountHeadInfo?.name),
      setType(accountHeadInfo?.type),
      setActive(accountHeadInfo?.is_active),
      reset());
  }, [accountHeadInfo, reset]);

  const putData = async () => {
    const adddata = {
      name,
      type,
      is_active: active,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    await dispatch(updateAccountHeadById(reduxData));
    if (isError === false) {
      toastsuccess("Account Head Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/accounthead/list`);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/accounthead/list`);
    }
  }, [add, id, navigate]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        if (id !== undefined) {
          handleSubmit(putData)();
        } else {
          handleSubmit(postData)();
        }
      }, 0); // <-- Slight delay after blur
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  return (
    <React.Fragment>
      <Head title={title ? title : "Account Head"} />
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
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>
                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/master/accounthead/list`
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
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/master/accounthead/list`
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
                    id={"name"}
                    placeholder="Name"
                    value={name}
                    SetValue={(value) => {
                      setName(transformWord(value));
                      clearErrors("name");
                    }}
                    message={errors.name && "name is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row className="form-group row g-4">
              <Col md="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="type">
                    Type
                  </label>
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="type_issue"
                          type="radio"
                          name={"type"}
                          value={1}
                          className="custom-control-input"
                          checked={type == 1 ? true : false}
                          onChange={(e) => {
                            setType(1);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="type_issue"
                        >
                          Issue
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="receipt"
                          type="radio"
                          value={2}
                          name={"type"}
                          className="custom-control-input "
                          checked={type == 2 ? true : false}
                          onChange={(e) => {
                            setType(2);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="receipt"
                        >
                          Receipt
                        </label>
                      </div>
                    </li>
                  </ul>
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

export default AccountHeadForm;
