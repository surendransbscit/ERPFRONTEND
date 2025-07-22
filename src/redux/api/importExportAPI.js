import { Auth, AuthFD } from "../configs";

const api = {
  import: {
    importCustomer: (content) => AuthFD.post(`/import_export/import_customer/`, content),
    importMetalProductCategory: (content) => AuthFD.post(`/import_export/import_metal_product_cat/`, content),
    importTag: (content) => AuthFD.post(`/import_export/import_tag/`, content),
    importEmployee: (content) => AuthFD.post(`/import_export/import_employee/`, content),
    importTagStatus: (content) => AuthFD.post(`/import_export/import_tag_status/`, content),
    importSchemeAccounts: (content) => AuthFD.post(`/import_export/import_scheme_accounts/`, content),
  },
};
const importExportAPI = { ...api };

export default importExportAPI;
