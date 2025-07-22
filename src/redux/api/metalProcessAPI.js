import { Auth } from "../configs";

const api = {
  metal_process: {
    getPocketDetailsList: (page, branch, records, fromDate, toDate) =>
      Auth.post(`/metal_process/pocket_list/`, page, branch, records, fromDate, toDate),
    createPocketEntry: (content) => Auth.post("/metal_process/create_pocket/", content),
    getStockDetails: (content) => Auth.post(`/metal_process/purchase_stock_details/`, content),
    getPocketDetails: (content) => Auth.post(`/metal_process/pocket_for_melting/`,content),
    createMetalProcess: (content) => Auth.post("/metal_process/create_metal_process/", content),
    getMetalIssueDetails: (content) => Auth.post(`/metal_process/melting_issue_details/`,content),
    getMetalReceivedDetails: (content) => Auth.get(`/metal_process/melting_received_details/`),
    getMetalTestingIssueDetails: (content) => Auth.post(`/metal_process/testing_issued_details/`,content),
    getMetalTestingReceivedDetails: (content) => Auth.get(`/metal_process/testing_received_details/`,content),
    getMetalRefiningIssueDetails: (content) => Auth.post(`/metal_process/refining_issued_details/`,content),

  },
};
const metalProcessAPI = { ...api };

export default metalProcessAPI;
