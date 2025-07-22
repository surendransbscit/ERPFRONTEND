import { Auth, BasicAuth } from "../configs";

const api = {
  authUser: {
    loginUser: (content) => BasicAuth.post(`/employee/emp_login/`, content),
    verifyOTP: (content) => Auth.post(`/employee/emp_verify_otp/`, content),
    resendOTP: (content) => Auth.post(`/employee/emp_resend_otp/`, content),
    signupUser: () => BasicAuth.post(`/auth/sign_up/`),
    logoutUser: () => Auth.get(`/employee/emp_logout/`),
    checkToken: (content) => Auth.post(`core/check_token/`, content),
    userInfo: (content) => Auth.post(`/employee/emp_info/`, content),
    userNotification: (content) => Auth.post(`/employee/emp_notifications/`, content),
    checkDayClose: (content) => Auth.post(`/retailmaster/day_close_verify/`, content),
    updateDayClose: (content) => Auth.post(`/retailmaster/day_close_update/`, content),
  },
};
const authUserAPI = { ...api };

export default authUserAPI;
