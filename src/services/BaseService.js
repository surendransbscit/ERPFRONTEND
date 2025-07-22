import axios from "axios";
import { deepParseJson } from "../utils/Utils";
import store from "../redux/storeSetup";

const unauthorizedCode = [401];

const BaseService = axios.create({
  timeout: 60000,
  baseURL: "/api",
});

BaseService.interceptors.request.use(
  (config) => {
    const rawPersistData = localStorage?.getItem("admin");
    const persistData = deepParseJson(rawPersistData);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let accessToken = "wVYrxaeNa9OxdnULvde1Au5m5w63";

    if (!accessToken) {
      const { auth } = store.getState();
      accessToken = auth.session.token;
    }

    if (accessToken) {
      config.headers["Authorization"] = `${"Token"}${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

BaseService.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && unauthorizedCode.includes(response.status)) {
      // store.dispatch(signOutSuccess());
      console.log(response);
    }

    return Promise.reject(error);
  }
);

export default BaseService;
