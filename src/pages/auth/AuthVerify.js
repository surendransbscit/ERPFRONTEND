// import React, { useState, useEffect } from "react";
// // import Logo from "../../images/logo1.png";
// import PageContainer from "../../layout/page-container/PageContainer";
// import Head from "../../layout/head/Head";
// import AuthFooter from "./AuthFooter";
// import {
//   Block,
//   BlockContent,
//   BlockDes,
//   BlockHead,
//   BlockTitle,
//   Icon,
//   PreviewCard,
// } from "../../components/Component";
// import { Form, FormGroup, Spinner, Alert } from "reactstrap";
// import { useForm, Controller } from "react-hook-form";

// import secureLocalStorage from "react-secure-storage";

// //redux
// import {
//   checkDashboardStatusAction,
//   logoutUserAction,
//   sendOTPAction,
//   verifyOTPAction,
// } from "../../redux/action/authUser";

// import { useDispatch, useSelector } from "react-redux";
// import Loading, { Loader } from "../../components/erp-loading/erp-loader";

// const AuthVerify = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   //  Check token state fetch from redux store ...

//   const { loading: tokenChecking } = useSelector((state) => state.checkToken);

//   const { loading: sendingOTP } = useSelector((state) => state.sendOTP);
//   const { loading: verifyingOTP } = useSelector((state) => state.verifyOTP);

//   const { checkDashboardStatus: { user } = {}, loading: loadingUser } = useSelector(
//     (state) => state.checkDashboardStatus
//   );

//   const [errorVal, setError] = useState("");

//   const otherAccLogin = async () => {
//     await dispatch(logoutUserAction());
//     await dispatch({ type: "CHECK_TOKEN_SUCCESS", payload: {} });
//     secureLocalStorage.removeItem("pref");
//     navigate(`${process.env.PUBLIC_URL}/auth-login`);
//   };

//   const onFormSubmit = async (formData) => {
//     await dispatch(
//       verifyOTPAction({
//         email: user?.admin_email,
//         email_otp: formData.email_otp,
//       })
//     );
//     setTimeout(() => {
//       setError("");
//     }, 4000);
//   };

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     control,
//     formState: { errors },
//   } = useForm();

//   useEffect(() => {
//     if (user?.admin_email_verified) {
//       navigate(`${process.env.PUBLIC_URL}/`);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!!!secureLocalStorage.getItem("pref")) {
//       navigate(`${process.env.PUBLIC_URL}/auth/login`);
//     } else {
//       const loginpref = secureLocalStorage.getItem("pref").pref;
//       dispatch(checkDashboardStatusAction(loginpref));
//     }
//   }, []);

//   return (
//     <React.Fragment>
//       <Head title="Verify Your Account" />
//       <PageContainer>
//         <Block className="nk-block-middle nk-auth-body  wide-xs">
//           <div className="brand-logo pb-2 text-center">
//             <span className="logo-link">
//               {/* <img className="logo-light logo-img" src={Logo} alt="logo" />
//               <img
//                 className="logo-dark logo-img"
//                 src={Logo}
//                 alt="logo-dark"
//               /> */}
//               {/* <img
//                 // className="logo-light logo-img "
//                 style={{ height: "80px" }}
//                 src={Logo}
//                 alt="logo"
//               /> */}
//             </span>
//           </div>
//           {typeof loadingUser === "undefined" || loadingUser ? (
//             <>
//               <Loading />
//             </>
//           ) : (
//             <>
//               <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
//                 <BlockHead>
//                   <BlockContent>
//                     <BlockTitle tag="h6">Verify Your Email</BlockTitle>
//                     <BlockDes>
//                       {user?.admin_email}{" "}
//                       <div
//                         style={{ cursor: "pointer" }}
//                         onClick={() => (!!verifyingOTP || !!sendingOTP ? null : otherAccLogin())}
//                         className="form-note-s2 justify-content-end d-flex mt-n3 text-primary"
//                       >
//                         Login using another account
//                       </div>
//                     </BlockDes>
//                   </BlockContent>
//                 </BlockHead>
//                 {errorVal && (
//                   <div className="mb-3">
//                     <Alert color="danger" className="alert-icon">
//                       {" "}
//                       <Icon name="alert-circle" /> {errorVal}{" "}
//                     </Alert>
//                   </div>
//                 )}
//                 <Form
//                   className="is-alter"
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                   }}
//                 >
//                   <FormGroup>
//                     <div className="form-label-group">
//                       <label className="form-label" htmlFor="default-01">
//                         One Time Verification Code
//                       </label>
//                     </div>
//                     <div className="form-control-wrap">
//                       <input
//                         type="number"
//                         className="form-control form-control-lg"
//                         id="default-01"
//                         name="email_otp"
//                         placeholder="Enter recieved verification code"
//                         {...register("email_otp", {
//                           required: "Enter Code",
//                           maxLength: {
//                             value: 6,
//                             message: "Max Length is 6",
//                           },
//                           minLength: {
//                             value: 6,
//                             message: "Min Length is 6",
//                           },
//                         })}
//                         onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
//                       />
//                       {errors.email_otp && <span className="invalid">{errors.email_otp.message}</span>}
//                     </div>
//                   </FormGroup>

//                   <div className="form-note-s2 justify-content-end d-flex mt-n3">
//                     {sendingOTP ? (
//                       <span className="text-success" style={{ cursor: "default" }}>
//                         {" "}
//                         Sending Code ...
//                       </span>
//                     ) : (
//                       <span
//                         className="text-primary"
//                         style={{ cursor: "pointer" }}
//                         onClick={() =>
//                           !!verifyingOTP || !!sendingOTP
//                             ? null
//                             : dispatch(
//                                 sendOTPAction({
//                                   otp_for: 2,
//                                   email: user?.admin_email,
//                                 })
//                               )
//                         }
//                         to={`${process.env.PUBLIC_URL}#send_otp`}
//                       >
//                         Resend Verification Code
//                       </span>
//                     )}{" "}
//                   </div>
//                   <FormGroup className="mt-2">
//                     <Button
//                       disabled={!!verifyingOTP || !!sendingOTP}
//                       onClick={!!verifyingOTP || !!sendingOTP ? null : handleSubmit(onFormSubmit)}
//                       size="lg"
//                       className="btn-block"
//                       type="submit"
//                       color="primary"
//                     >
//                       {!!verifyingOTP || !!sendingOTP ? <Spinner size="sm" color="light" /> : "Submit"}
//                     </Button>
//                   </FormGroup>
//                 </Form>
//               </PreviewCard>
//             </>
//           )}
//         </Block>
//         <AuthFooter />
//       </PageContainer>
//     </React.Fragment>
//   );
// };
// export default AuthVerify;

import React, { useEffect, useState } from "react";
import OTPModal from "../../components/modals/OtpModel";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useDispatch, useSelector } from "react-redux";
import { userOTPVerify } from "../../redux/thunks/authUser";
import { useLocation, useNavigate } from "react-router";
import secureLocalStorage from "react-secure-storage";

const AuthVerify = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginmessage = secureLocalStorage.getItem("loginmessage");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginOTP, setLoginOtp] = useState(["", "", "", ""]);
  const [deviceID, setDeviceID] = useState();
  const [errorVal, setError] = useState("");
  const [otpModal, setOtpModal] = useState(true);

  const passUsername = location?.state?.username;
  const passPassword = location?.state?.password;

  const toggle = () => {
    setOtpModal(!otpModal);
  };

  const { isLoading: compLoading, companyList } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();

      const result = await fp.get();
      setDeviceID(result.visitorId);
    };

    loadFingerprint();
  }, []);

  // useEffect(() => {
  //   if (loginmessage === undefined) {
  //     navigate(`${process.env.PUBLIC_URL}/auth/login`);
  //   } 
  // }, [navigate, loginmessage]);

  const OTPVerify = async () => {
    const fp = await FingerprintJS?.load();
    const result = await fp?.get();
    await dispatch(
      userOTPVerify({
        username: passUsername,
        password: passPassword,
        id_company: companyList[0]?.value,
        login_otp: loginOTP,
        deviceID: result?.visitorId,
        // setError: setError,
        // setOtpModal: setOtpModal,
      })
    );
    setTimeout(() => {
      setError("");
    }, 4000);
  };
  return (
    <div>
      <OTPModal modal={otpModal} toggle={toggle} clickAction={OTPVerify} otp={loginOTP} setOtp={setLoginOtp} />
    </div>
  );
};

export default AuthVerify;
