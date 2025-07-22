import { Auth } from "../configs";

const api = {
  clients: {
    getClientOptions: () => Auth.get(`/adminmaster/clients/?active`),
    getAllClient: (page, records, search) =>
      Auth.get(
        `/adminmaster/clients/?page=${page}&records=${records}&searchText=${search}`
      ),
    createClient: (content) => Auth.post("/adminmaster/clients/", content),
    getClientById: (id) => Auth.get(`/adminmaster/clients/${id}/`),
    updateClientById: (id, content) =>
      Auth.put(`/adminmaster/clients/${id}/`, content),
    deleteClientById: (id) => Auth.delete(`/adminmaster/clients/${id}/`),
    updateClientStatus: (id) =>
      Auth.get(`/adminmaster/clients/${id}/?changestatus`),
  },
  masetrclients: {
    getMasterClientsOptions: () => Auth.get(`/adminmaster/clients/?active`),
    getAllMasterClients: (page, records, search) =>
      Auth.get(
        `/adminmaster/clients/?page=${page}&records=${records}&searchText=${search}`
      ),
    createMasterClients: (content) =>
      Auth.post("/adminmaster/clients/", content),
    getMasterClientsById: (id) => Auth.get(`/adminmaster/clients/${id}/`),
    updateMasterClientsById: (id, content) =>
      Auth.put(`/adminmaster/clients/${id}/`, content),
    deleteMasterClientsById: (id) => Auth.delete(`/adminmaster/clients/${id}/`),
  },
  adminproductmaster: {
    getAdminProductMasterOption: () =>
      Auth.get(`/adminmaster/products/?active`),
    getAllAdminProductMaster: (page, records, search) =>
      Auth.get(
        `/adminmaster/products/?page=${page}&records=${records}&searchText=${search}`
      ),
    createAdminProductMaster: (content) =>
      Auth.post("/adminmaster/products/", content),
    getAdminProductMasterById: (id) => Auth.get(`/adminmaster/products/${id}/`),
    updateAdminProductMasterById: (id, content) =>
      Auth.put(`/adminmaster/products/${id}/`, content),
    deleteAdminProductMasterById: (id) =>
      Auth.delete(`/adminmaster/products/${id}/`),
    updateAdminProductMasterStatus: (id) =>
      Auth.get(`/adminmaster/products/${id}/?changestatus`),
  },

  mastermodule: {
    getMasterModuleOption: () => Auth.get(`/adminmaster/modules/?active`),
    getAllMasterModule: (page, records, search) =>
      Auth.get(
        `/adminmaster/modules/?page=${page}&records=${records}&searchText=${search}`
      ),
    createMasterModule: (content) =>
      Auth.post("/adminmaster/modules/", content),
    getMasterModuleById: (id) => Auth.get(`/adminmaster/modules/${id}/`),
    updateMasterModuleById: (id, content) =>
      Auth.put(`/adminmaster/modules/${id}/`, content),
    deleteMasterModuleById: (id) => Auth.delete(`/adminmaster/modules/${id}/`),
  },
};

const adminMasterAPI = { ...api };

export default adminMasterAPI;
