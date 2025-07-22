import BaseService from "./BaseService";
// import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const ApiService = {
  fetchData(param) {
    return new Promise((resolve, reject) => {
      BaseService(param)
        .then((response) => {
          resolve(response);
        })
        .catch((errors) => {
          reject(errors);
        });
    });
  },
};

export default ApiService;
