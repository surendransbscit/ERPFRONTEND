import { Auth } from "../configs";

const api = {
  estimation: {
    createEstimation: (content) => Auth.post("/estimation/create/", content),
    getEstimationDetailsByNo: (content) => Auth.post("/estimation/est_details/", content),
    estimationApprovalList: (content) => Auth.post("/estimation/est_approve_details/", content),
    approveEstimation: (content) => Auth.post("/estimation/est_approve/", content),
    getEstimationDetailsById:(id)=> Auth.get(`/estimation/edit/${id}/`),
    estimationList: (page,content) => Auth.post(`/estimation/list/?page=${page}&records=${content?.records}&searchText=${content?.search}`,content),
    updateEstimation: (id, content) => Auth.put(`/estimation/update/${id}/`,content),
    estimationDetailsPrint: (id) => Auth.get(`/estimation/est_approve_print/${id}/`),

  }
};
const estimationAPI = { ...api };

export default estimationAPI;
