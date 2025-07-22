import React from "react";
import { Col, Icon, Row } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";

const EmployeeFormStep1 = ({ props }) => {
  const {
    register,
    control,
    setValue,
    Controller,
    errors,
    watch,
    
    username,
    SetUsername,
    email,
    SetEmail,
    password,
    SetPassword,
    confirmPassword,
    SetConfirmPassword,
    is_edit,
    changepass,
    SetChangePass,
    isPasswordShown,
    setIsPasswordShown,
    isConfirmPasswordShown,
    setIsConfirmPasswordShown,
    handleClickShowPassword,
    handleClickShowConfirmPassword,
  } = props;
  console.log(changepass);
  return (
    <>
      {" "}
      <div className="gy-3">
        <Row className="g-3 align-center">
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Username <IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <div className="form-control-wrap">
                <input
                  {...register("username", {
                    required: "Username is required",
                  })}
                  className="form-control form-control-sm"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => SetUsername(e.target.value)}
                />
                {errors?.username && (
                  <span className="invalid">
                    <Icon className={"sm"} name="alert-circle" />
                    {errors.username.message}
                  </span>
                )}
              </div>
            </div>
          </Col>
          <Col lg="1">
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email<IsRequired />
              </label>
            </div>
          </Col>
          <Col lg="3">
            <div className="form-group">
              <div className="form-control-wrap">
                <input
                  {...register("email", {
                    required: "email id is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  autoComplete="given-email"
                  className="form-control form-control-sm"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => SetEmail(e.target.value.split(" ").join(""))}
                />
                {errors?.email && (
                  <span className="invalid">
                    <Icon className={"sm"} name="alert-circle" />
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>
          </Col>

          {is_edit == true && (
            <>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label">Change Password</label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <div className="custom-control custom-switch">
                    <input
                      type="checkbox"
                      {...register(`changepass`, {
                        required: {
                          value: false,
                        },
                      })}
                      className="custom-control-input"
                      name="changepass"
                      id="changepass"
                      checked={changepass}
                      onChange={(e) => SetChangePass(e.target.checked)}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="changepass"
                    >
                      {changepass == true ? "Yes" : "No"}
                    </label>
                  </div>
                </div>
              </Col>
            </>
          )}

          {!is_edit && (
            <>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Password <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <a
                      href="#password"
                      onClick={(ev) => {
                        ev.preventDefault();
                        handleClickShowPassword();
                      }}
                      className={`form-icon lg form-icon-right passcode-switch ${isPasswordShown ? "is-hidden" : "is-shown"
                        }`}
                    >
                      <Icon
                        name="eye"
                        className="passcode-icon icon-show"
                      ></Icon>

                      <Icon
                        name="eye-off"
                        className="passcode-icon icon-hide"
                      ></Icon>
                    </a>
                    <input
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Min Length is 8",
                        },
                      })}
                      className="form-control form-control-sm"
                      type={isPasswordShown ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) =>
                        SetPassword(e.target.value.split(" ").join(""))
                      }
                      autoComplete="given-password"
                    />
                    {errors?.password && (
                      <span className="invalid">
                        <Icon className={"sm"} name="alert-circle" />
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Confirm Password <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <a
                      href="#password"
                      onClick={(ev) => {
                        ev.preventDefault();
                        handleClickShowConfirmPassword();
                      }}
                      className={`form-icon lg form-icon-right passcode-switch ${isConfirmPasswordShown ? "is-hidden" : "is-shown"
                        }`}
                    >
                      <Icon
                        name="eye"
                        className="passcode-icon icon-show"
                      ></Icon>

                      <Icon
                        name="eye-off"
                        className="passcode-icon icon-hide"
                      ></Icon>
                    </a>
                    <input
                      {...register("confirmPassword", {
                        validate: (val) => {
                          if (watch("password") != val) {
                            return "Your passwords do no match";
                          }
                        },
                        required: "Confirm Password is required",
                        minLength: {
                          value: 8,
                          message: "Min Length is 8",
                        },
                      })}
                      autoComplete="given-newpassword"
                      className="form-control form-control-sm"
                      type={isConfirmPasswordShown ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) =>
                        SetConfirmPassword(e.target.value.split(" ").join(""))
                      }
                    />
                    {errors?.confirmPassword && (
                      <span className="invalid">
                        <Icon className={"sm"} name="alert-circle" />
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </div>
                </div>
              </Col>
            </>
          )}

          {is_edit && (
            <Row className="g-3 align-center">
              {changepass == true && (
                <React.Fragment>
                  <Col lg="1">
                    <div className="form-group">
                      <label className="form-label" htmlFor="site-name">
                        Password <IsRequired />
                      </label>
                    </div>
                  </Col>
                  <Col lg="3">
                    <div className="form-group">
                      <div className="form-control-wrap">
                        <input
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 8,
                              message: "Min Length is 8",
                            },
                          })}
                          className="form-control form-control-sm"
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) =>
                            SetPassword(e.target.value.split(" ").join(""))
                          }
                        />
                        {errors?.password && (
                          <span className="invalid">
                            <Icon className={"sm"} name="alert-circle" />
                            {errors.password.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col lg="1">
                    <div className="form-group">
                      <label className="form-label" htmlFor="site-name">
                        Confirm Password <IsRequired />
                      </label>
                    </div>
                  </Col>
                  <Col lg="3">
                    <div className="form-group">
                      <div className="form-control-wrap">
                        <input
                          {...register("confirmPassword", {
                            validate: (val) => {
                              if (watch("password") != val) {
                                return "Your passwords do no match";
                              }
                            },
                            required: "Confirm Password is required",
                            minLength: {
                              value: 8,
                              message: "Min Length is 8",
                            },
                          })}
                          className="form-control form-control-sm"
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) =>
                            SetConfirmPassword(
                              e.target.value.split(" ").join("")
                            )
                          }
                        />
                        {errors?.confirmPassword && (
                          <span className="invalid">
                            <Icon className={"sm"} name="alert-circle" />
                            {errors.confirmPassword.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </Col>
                </React.Fragment>
              )}
            </Row>
          )}
        </Row>
      </div>
    </>
  );
};

export default EmployeeFormStep1;
