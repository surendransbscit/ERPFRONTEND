import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import {
  Card,
  Badge,
  Button,
  Modal,
  ModalBody,
  FormGroup,
  Col,
  Row,
} from "reactstrap";
import Head from "../../../layout/head/Head";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  InputSwitch,
} from "../../../components/Component";
import UserProfileAside from "./UserProfileAside";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { updateEmployeePassword } from "../../../redux/thunks/employee";
const UserProfileSettingPage = () => {
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [modal, setModal] = useState(false);

  const [credData, setcredData] = useState({
    old_password: null,
    new_password: null,
    new_password2: null,
  });

  const { loading: isChanging } = useSelector(
    (state) => state.profileDetailsReducer
  );

  const submitForm = async () => {
    console.log(credData);
    await dispatch(updateEmployeePassword(credData));
    if (isError === false) {
      toastsuccess("Password Updated successfully");
    }
  };

  // function to change the design view under 990 px
  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };

  useEffect(() => {
    viewChange();
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    document
      .getElementsByClassName("nk-header")[0]
      .addEventListener("click", function () {
        updateSm(false);
      });
    return () => {
      window.removeEventListener("resize", viewChange);
      window.removeEventListener("load", viewChange);
    };
  }, []);

  return (
    <React.Fragment>
      <Head title="User List - Profile"></Head>
      <Content>
        <Card>
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
                sm ? "content-active" : ""
              }`}
            >
              <UserProfileAside updateSm={updateSm} sm={sm} />
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && (
                <div
                  className="toggle-overlay"
                  onClick={() => updateSm(!sm)}
                ></div>
              )}
              <BlockHead size="lg">
                <BlockBetween>
                  <BlockHeadContent>
                    <BlockTitle tag="h4">Security Settings</BlockTitle>
                    <BlockDes>
                      <p>
                        These settings will help you to keep your account
                        secure.
                      </p>
                    </BlockDes>
                  </BlockHeadContent>
                  <BlockHeadContent className="align-self-start d-lg-none">
                    <Button
                      className={`toggle btn btn-icon btn-trigger mt-n1 ${
                        sm ? "active" : ""
                      }`}
                      onClick={() => updateSm(!sm)}
                    >
                      <Icon name="menu-alt-r"></Icon>
                    </Button>
                  </BlockHeadContent>
                </BlockBetween>
              </BlockHead>

              <Block>
                <Card>
                  <div className="card-inner-group">
                    {/* <div className="card-inner">
              <div className="between-center flex-wrap flex-md-nowrap g-3">
                <div className="nk-block-text">
                  <h6>Save my Activity Logs</h6>
                  <p>You can save your all activity logs including unusual activity detected.</p>
                </div>
                <div className="nk-block-actions">
                  <ul className="align-center gx-3">
                    <li className="order-md-last">
                      <div className="custom-control custom-switch me-n2">
                        <InputSwitch checked id="activity-log" />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}
                    <div className="card-inner">
                      <div className="between-center flex-wrap g-3">
                        <div className="nk-block-text">
                          <h6>Change Password</h6>
                          <p>Set a unique password to protect your account.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Button
                                onClick={() => setModal(true)}
                                color="primary"
                              >
                                Change Password
                              </Button>
                            </li>
                            {/* <li>
                              <em className="text-soft text-date fs-12px">
                                Last changed: <span>Oct 2, 2019</span>
                              </em>
                            </li> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* <div className="card-body">
              <div className="between-center flex-wrap flex-md-nowrap g-3">
                <div className="nk-block-text">
                  <h6>
                    2 Factor Auth &nbsp; <Badge color="success" className="ml-0">Enabled</Badge>
                  </h6>
                  <p>
                    Secure your account with 2FA security. When it is activated you will need to enter not only your
                    password, but also a special code using app. You will receive this code via mobile application.{" "}
                  </p>
                </div>
                <div className="nk-block-actions">
                  <Button color="primary">Disable</Button>
                </div>
              </div>
            </div> */}
                  </div>
                </Card>
              </Block>
              <Modal
                isOpen={modal}
                className="modal-dialog-centered"
                size="lg"
                toggle={() => setModal(false)}
              >
                <ModalBody>
                  <a
                    href="#dropdownitem"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setModal(false);
                    }}
                    className="close"
                  >
                    <Icon name="cross-sm"></Icon>
                  </a>
                  <div className="p-2">
                    <h5 className="title">Change Password</h5>
                    <div className="tab-content">
                      <div
                        // className={`tab-pane ${modalTab === "1" ? "active" : ""}`}
                        id="personal"
                      >
                        <Row className=" px-4 gy-1">
                          <Col md="11">
                            <FormGroup>
                              <label
                                className="form-label"
                                htmlFor="old_password"
                              >
                                Old password
                              </label>
                              <input
                                {...register("old_password", {
                                  required: "Enter Old Password",
                                  // minLength: {
                                  //   value: 8,
                                  //   message: "Min Length is 8",
                                  // },
                                  // maxLength: {
                                  //   value: 128,
                                  //   message: "Max Length is 128",
                                  // },
                                })}
                                type="password"
                                id="old_password"
                                className="form-control"
                                name="old_password"
                                onChange={(e) =>
                                  setcredData({
                                    ...credData,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                                defaultValue={credData?.old_password}
                                placeholder="Enter Current Password"
                              />
                              {errors?.old_password && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {errors.old_password.message}
                                </span>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md="11">
                            <FormGroup>
                              <label
                                className="form-label"
                                htmlFor="new_password"
                              >
                                New Password
                              </label>
                              <input
                                {...register("new_password", {
                                  validate: (val) => {
                                    if (watch("old_password") == val) {
                                      return "Old password and New password can't be same";
                                    }
                                  },
                                  required: "Enter New Password",
                                  minLength: {
                                    value: 8,
                                    message: "Min Length is 8",
                                  },
                                  maxLength: {
                                    value: 128,
                                    message: "Max Length is 128",
                                  },
                                })}
                                type="password"
                                id="new_password"
                                className="form-control"
                                name="new_password"
                                onChange={(e) =>
                                  setcredData({
                                    ...credData,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                                defaultValue={credData?.new_password}
                                placeholder="Enter New Password"
                              />
                              {errors?.new_password && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {errors.new_password.message}
                                </span>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md="11">
                            <FormGroup>
                              <label
                                className="form-label"
                                htmlFor="new_password2"
                              >
                                Re-Enter New password
                              </label>
                              <input
                                {...register("new_password2", {
                                  validate: (val) => {
                                    if (watch("new_password") != val) {
                                      return "Passwords do no match";
                                    }
                                  },
                                })}
                                type="text"
                                id="new_password2"
                                className="form-control"
                                name="new_password2"
                                onChange={(e) =>
                                  setcredData({
                                    ...credData,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                                defaultValue={credData?.new_password2}
                                placeholder="Re-Enter New Password"
                              />
                              {errors?.new_password2 && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {errors.new_password2.message}
                                </span>
                              )}
                            </FormGroup>
                          </Col>

                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                              <li>
                                <Button
                                  disabled={isChanging}
                                  color="primary"
                                  size="md"
                                  // onClick={handleSubmit(submitForm)}
                                  onClick={
                                    !isChanging
                                      ? handleSubmit(submitForm)
                                      : null
                                  }
                                >
                                  {isChanging
                                    ? "Changing ..."
                                    : "Change Password"}
                                </Button>
                              </li>
                              <li>
                                <a
                                  style={{
                                    pointerEvents: isChanging && "none",
                                    cursor: isChanging && "default",
                                  }}
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setModal(false);
                                  }}
                                  className="link link-light"
                                >
                                  Cancel
                                </a>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </div>
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default UserProfileSettingPage;
