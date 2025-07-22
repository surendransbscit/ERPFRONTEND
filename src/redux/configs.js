import secureLocalStorage from "react-secure-storage";
import EventBus from "../common/EventBus";

import axios from "axios";
import useAuth from "../utils/hooks/useAuth";

export const BasicAuth = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});
export const Auth = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  headers: {
    Authorization: `Token ${secureLocalStorage.getItem("pref")?.token}`,
  },
});

export const AuthFD = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  headers: {
    Authorization: `Token ${secureLocalStorage.getItem("pref")?.token}`,
    "Content-Type": "multipart/form-data",
  },
});

// login company and branch info
export const company = secureLocalStorage.getItem("pref")?.pref?.id_company;
export const secureStorage_login_branches =
  secureLocalStorage.getItem("pref")?.pref?.login_branches;
export const company_name =
  secureLocalStorage.getItem("pref")?.pref?.company_name;
export const company_country =
  secureLocalStorage.getItem("pref")?.pref?.company_country;
export const employee_id = secureLocalStorage.getItem("pref")?.pref?.emp_id;
// console.log(secureLocalStorage);

// fetch API url from env file
export const baseUrl = process.env.REACT_APP_API_ENDPOINT;

//  Function to check
// if unauthorized{or token expired} logout
// and trigger APP logout
export const DispatchErrorHandler = (error) => {
  if (error?.code == "ERR_NETWORK") {
    EventBus?.dispatch("server_down");
  }
  if (error?.response?.status == 401) {
    // const { isAuthGracePeriod } = useAuth();
    // if (isAuthGracePeriod()) {
    //   console.warn("Skipping acc_expired event due to grace period");
    //   return;
    // }
    EventBus?.dispatch("logout");
  }
  if (error?.response?.status == 400) {

    if (error?.response?.data?.message) {

      EventBus?.dispatch("unique", error?.response?.data?.message);
    }
    if (error?.response?.data?.error_detail) {
      EventBus?.dispatch("error", error?.response?.data?.error_detail);
    }
  }
  // if not a token expire error; catch Acc expiry errors validation like errors => and dispatch event with error data
  else {
    // Account Expiry / No Permissions error handle
    if (error?.response?.status == 403) {
      if (
        !Array.isArray(error?.response?.data?.error_detail) &&
        error?.response?.data?.error_detail
          .toLowerCase()
          .includes("account has expired")
      ) {
        EventBus?.dispatch("acc_expired");
      } else {
        EventBus?.dispatch("error", error?.response?.data?.error_detail);
      }
    } //other
    else {
      EventBus?.dispatch("error", error?.response?.data?.error_detail);
    }
  }
};
