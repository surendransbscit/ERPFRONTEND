import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { userOTPResend } from "../../redux/thunks/authUser";
import { toastsuccess } from "../sds-toast-style/toast-style";

const BillDeleteOtpModal = ({
  modal,
  toggle,
  clickAction,
  actionName,
  otp,
  setOtp,
  otpFor,
}) => {
  const dispatch = useDispatch();
  //   const [otp, setOtp] = useState(["", "", "", ""]);

  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timer, setTimer] = useState(60); // 1-minute countdown

  const [error, setError] = useState(false);

  useEffect(() => {
    if (!modal) {
      // Reset timer when modal opens
      setIsTimerActive(true);
      setTimer(60);
    }

    if (isTimerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000); // Decrease timer every second

      return () => clearInterval(interval); // Clear interval on component unmount
    }

    if (timer === 0) {
      setIsTimerActive(false); // Enable "Resend OTP" after timer finishes
    }
  }, [modal, isTimerActive, timer]);

  const handleResendOtp = async () => {
    try {
      let response = "";
      response = await dispatch(userOTPResend({ otp_for: otpFor })).unwrap();
      toastsuccess(response?.message);
      setIsTimerActive(true);
      setTimer(60); // Reset timer
    } catch (error) {
      console.error(error);
    }
    // setIsTimerActive(true);
    // setTimer(60); // Reset timer
    // dispatch(userOTPResend({ otp_for: otpFor }));
    // console.log("OTP Resent");
  };

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically move to the next input field
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace functionality to go to the previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const preventClose = () => {
    if (isTimerActive) {
      return; // Do nothing while timer is active
    }
    toggle(); // Allow modal close only when the timer is not active
  };

  const handleSubmit = () => {
    if (otp?.some((digit) => digit === "")) {
      setError(true);
      return;
    }

    // Proceed with submit
    console.log("OTP submitted:", otp.join(""));
    clickAction();
  };

  return (
    <Modal
      toggle={preventClose}
      isOpen={modal}
      className="modal-dialog-centered text-center"
      size="md"
      style={{ width: "fit-content" }}
    >
      <ModalHeader toggle={preventClose}>Authenticate</ModalHeader>
      <ModalBody className="text-center ">
        <p className="mb-3">Enter the 6-digit OTP sent to your phone number</p>
        <div className="d-flex justify-content-center">
          {otp?.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="text-center border rounded mx-1"
              style={{ width: "50px", height: "50px", fontSize: "1.5rem" }}
            />
          ))}
        </div>
        {error && <div className="text-danger mt-2">Enter valid OTP</div>}

        <div className="d-flex justify-content-between mt-3">
          <p className="text-primary">Need help?</p>
          {isTimerActive ? (
            <p className="text-primary">
              Resend OTP in <span className="text-primary">{timer}s</span>
            </p>
          ) : (
            <p
              style={{ cursor: "pointer" }}
              className="text-primary"
              onClick={handleResendOtp}
            >
              Resend OTP
            </p>
          )}
        </div>
        <span className="text-muted text-[2px] mt-2">
          This authentication is valid for the current session only.
        </span>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" disabled={isTimerActive} onClick={toggle}>
          Cancel
        </Button>{" "}
        <Button
          // disabled={issubmitting}
          size="md"
          color="primary"
          onClick={(e) => {
            handleSubmit();
          }}
        >
          Confirm
          {/* {issubmitting ? <Spinner size={"sm"} /> : "Yes"} */}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BillDeleteOtpModal;
