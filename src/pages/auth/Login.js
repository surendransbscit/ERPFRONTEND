import React, { useEffect, useLayoutEffect, useState } from "react";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import PageContainer from "../../layout/page-container/PageContainer";
import { Block, Icon, PreviewCard, Row } from "../../components/Component";
import {
  Form,
  FormGroup,
  Spinner,
  Alert,
  Col,
  Container,
  Button,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../images/sdslogo.jpg";
import {
  checkUserToken,
  userLogin,
  userOTPVerify,
} from "../../redux/thunks/authUser";
import { getAllActiveCompanies } from "../../redux/thunks/coreComponent";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import OTPModal from "../../components/modals/OtpModel";
// import useAuth from "../../utils/hooks/useAuth";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //  Check token state fetch from redux store ...
  const { isLoading: tokenChecking, checkToken = {} } = useSelector(
    (state) => state.authUserReducer
  );
  const { isLoading: compLoading, companyList } = useSelector(
    (state) => state.coreCompReducer
  );
  // login state fetch from redux - to check api loading status
  const { isSigningin } = useSelector((state) => state.authUserReducer);
  const loginmessage = secureLocalStorage.getItem("loginmessage");
  // State Variables
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginOTP, setLoginOtp] = useState(["", "", "", "", "", ""]);
  const [otpModal, setOtpModal] = useState(false);

  const toggle = () => {
    setOtpModal(!otpModal);
  };

  const [deviceID, setDeviceID] = useState();

  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();
    
      const result = await fp.get();
      setDeviceID(result.visitorId);

      console.log("FingerprintJS Result:", result.visitorId);

    };

    loadFingerprint();
  }, []);

  // console.log(companyList[0]?.label);

  // on Submitting Form
  const onFormSubmit = async (formData) => {
    const { name, passcode } = formData;
    let id_company = companyList[0]?.value;
    if (!!isSigningin) {
      return;
    }
    const fp = await FingerprintJS?.load();
    const result = await fp?.get();
    let deviceId = result?.visitorId;
    // const loginResult = await signIn({
    //   name,
    //   passcode,
    //   id_company,
    //   deviceId,
    // }, setError);
    // console.log(loginResult);
    
    // if (loginResult?.status === "failed") {
    //   setError(result.message);
    // }
    await dispatch(
      userLogin({
        username: formData?.name,
        password: formData?.passcode,
        id_company: companyList[0]?.value,
        deviceID: result?.visitorId,
        setError: setError,
      })
    );
    setTimeout(() => {
      setError("");
    }, 4000);
  };

  useEffect(() => {
    dispatch(getAllActiveCompanies());
  }, [dispatch]);

  useLayoutEffect(() => {
    if (checkToken?.message?.toLowerCase().includes("verify")) {
      navigate(`${process.env.PUBLIC_URL}/auth/verify`);
    }
    if (checkToken?.message?.toLowerCase().includes("logged")) {
      navigate(`${process.env.PUBLIC_URL}/`);
    }
  }, [checkToken?.message, companyList, navigate]);

  const OTPVerify = async () => {
    const fp = await FingerprintJS?.load();
    const result = await fp?.get();
    await dispatch(
      userOTPVerify({
        username: username,
        password: password,
        id_company: companyList[0]?.value,
        deviceID: result?.visitorId,
        setError: setError,
        setOtpModal: setOtpModal,
      })
    );
    setTimeout(() => {
      setError("");
    }, 4000);
  };

  useEffect(() => {
    deviceID &&
      secureLocalStorage.getItem("pref")?.token &&
      dispatch(checkUserToken({ deviceID: deviceID }));
  }, [companyList, dispatch, deviceID]);

  return (
    <React.Fragment>
      <Head title="Login" />
      <PageContainer>
        {/* <OTPModal modal={otpModal} toggle={toggle} clickAction={OTPVerify} otp={loginOTP} setOtp={setLoginOtp} /> */}
        <Block className="nk-block-middle nk-auth-body  wide-lg">
          <div className="brand-logo  text-center">
            <span className="logo-link">
              {/* <img
                // className="logo-light logo-img "
                style={{ height: "80px" }}
                src={Logo}
                alt="logo"
              /> */}
              {/* <img
                style={{ height: "160px" }}
                // className="logo-dark logo-img h-20"
                src={Logo}
                alt="logo-dark"
              /> */}
            </span>
          </div>
          {tokenChecking ? (
            <></>
          ) : (
            <>
              <Container>
                <Row>
                  <Col lg="12">
                    <PreviewCard bodyClass="card-inner-lg">
                      <Row>
                        <Col lg="6">
                          <img
                            src={logo}
                            alt="logo"
                            style={{ width: "130px", height: "130px" }}
                            className="mb-1"
                          />
                          <h3 className="ff-base fw-bold pt-1">
                            {" "}
                            {companyList[0]?.label}
                          </h3>
                          <h3 className="fw-light pt-1">Sign in</h3>
                          <h4 className=" pt-1">
                            <small className="text-soft">
                              Enter your information to Login
                            </small>
                          </h4>
                        </Col>
                        <Col lg="6">
                          {errorVal && (
                            <div className="mb-3">
                              <Alert color="danger" className="alert-icon">
                                {" "}
                                <Icon name="alert-circle" /> {errorVal}{" "}
                              </Alert>
                            </div>
                          )}
                          <Form
                            className="is-alter"
                            onSubmit={handleSubmit(onFormSubmit)}
                          >
                            <FormGroup className="mb-1">
                              <div className="form-label-group">
                                <label
                                  className="form-label"
                                  htmlFor="default-01"
                                >
                                  Username
                                </label>
                              </div>
                              <div className="form-control-wrap">
                                <input
                                  type="text"
                                  id="default-01"
                                  name="name"
                                  {...register("name", {
                                    required: "Username is required",
                                  })}
                                  // value={username}
                                  // onChange={(e) => {
                                  //   setUsername(e.target.value);
                                  // }}
                                  placeholder="Enter your username"
                                  className="form-control-lg form-control"
                                />
                                {errors.name && (
                                  <span className="invalid">
                                    {errors.name.message}
                                  </span>
                                )}
                              </div>
                            </FormGroup>
                            <FormGroup className="mb-1">
                              <div className="form-label-group">
                                <label
                                  className="form-label"
                                  htmlFor="password"
                                >
                                  Passcode
                                </label>
                              </div>
                              <div className="form-control-wrap">
                                <a
                                  href="#password"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setPassState(!passState);
                                  }}
                                  className={`form-icon lg form-icon-right passcode-switch ${
                                    passState ? "is-hidden" : "is-shown"
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
                                  type={passState ? "text" : "password"}
                                  id="password"
                                  name="passcode"
                                  {...register("passcode", {
                                    required: "Enter Password",
                                  })}
                                  // value={password}
                                  // onChange={(e) => {
                                  //   setPassword(e.target.value);
                                  // }}
                                  // ref={register({ required: "This field is required" })}
                                  placeholder="Enter your passcode"
                                  className={`form-control-lg form-control ${
                                    passState ? "is-hidden" : "is-shown"
                                  }`}
                                />
                                {errors.passcode && (
                                  <span className="invalid">
                                    {errors.passcode.message}
                                  </span>
                                )}
                              </div>
                              <Link
                                className="link link-primary link-sm"
                                onClick={() => {
                                  dispatch({
                                    type: "RESET_PASS_SUCCESS",
                                    payload: {},
                                  });
                                }}
                                to={`${process.env.PUBLIC_URL}/auth-reset`}
                              >
                                Forgot Password?
                              </Link>
                            </FormGroup>
                            <FormGroup className="mt-4">
                              <Button
                                disabled={
                                  isSigningin || tokenChecking || compLoading
                                }
                                size="lg"
                                className="btn-block"
                                type="submit"
                                color="primary"
                              >
                                {isSigningin || tokenChecking || compLoading ? (
                                  <Spinner size="sm" color="light" />
                                ) : (
                                  "Sign in"
                                )}
                              </Button>
                            </FormGroup>
                          </Form>
                        </Col>
                      </Row>
                    </PreviewCard>
                  </Col>
                </Row>
              </Container>
            </>
          )}
        </Block>

        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Login;
