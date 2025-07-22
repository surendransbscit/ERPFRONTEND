import { Auth, BasicAuth } from "../configs";

const api = {
  core: {
    getAllActiveCompany: () => BasicAuth.get(`/retailmaster/company/?options`),
    getAllMenu: () => Auth.get(`/core/fetchmenu/`),
    menuPermission: (content) => Auth.post(`/core/access_check/`, content),
    getAccessBranches: (content) => Auth.post(`/core/login_branchdropdown/`, content),
    getMenus: (content) => Auth.get(`/core/adminmenu/?page=${content}`),
    getLoginDetails: () => Auth.get(`/core/login_det/`),
    getAdminLogs: (start, last, offset) => Auth.get(`/core/logs/?from=${start}&to=${last}&offset=${offset}`),
    getSearchItems: (content) => Auth.post(`/core/search_menu/`, content),
    backupCurrentDB: () => Auth.get(`/core/backup_db/`),

  },
};
const coreCompAPI = { ...api };

export default coreCompAPI;
