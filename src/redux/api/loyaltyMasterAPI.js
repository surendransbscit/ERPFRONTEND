import { Auth } from "../configs";

const api = {
  loyalty_tier: {
    getLoyaltyTierOptions: () =>
      Auth.get(`/loyaltymaster/loyalty_tier/?active`),
    getAllLoyaltyTier: (page, records, search) =>
      Auth.get(
        `/loyaltymaster/loyalty_tier/?page=${page}&records=${records}&searchText=${search}`
      ),
    createLoyaltyTier: (content) =>
      Auth.post("/loyaltymaster/loyalty_tier/", content),
    getLoyaltyTierById: (id) => Auth.get(`/loyaltymaster/loyalty_tier/${id}/`),
    updateLoyaltyTierById: (id, content) =>
      Auth.put(`/loyaltymaster/loyalty_tier/${id}/`, content),
    deleteLoyaltyTierById: (id) =>
      Auth.delete(`/loyaltymaster/loyalty_tier/${id}/`),
    updateLoyaltyTierStatus: (id) =>
      Auth.get(`/loyaltymaster/loyalty_tier/${id}/?changestatus`),
  },
  loyalty_settings: {
    getLoyaltySettingsOptions: () =>
      Auth.get(`/loyaltymaster/loyalty_settings/?active`),
    getAllLoyaltySettings: (page, records, search) =>
      Auth.get(
        `/loyaltymaster/loyalty_settings/?page=${page}&records=${records}&searchText=${search}`
      ),
    createLoyaltySettings: (content) =>
      Auth.post("/loyaltymaster/loyalty_settings/", content),
    getLoyaltySettingsById: (id) =>
      Auth.get(`/loyaltymaster/loyalty_settings/${id}/`),
    updateLoyaltySettingsById: (id, content) =>
      Auth.put(`/loyaltymaster/loyalty_settings/${id}/`, content),
    deleteLoyaltySettingsById: (id) =>
      Auth.delete(`/loyaltymaster/loyalty_settings/${id}/`),
    updateLoyaltySettingsStatus: (id) =>
      Auth.get(`/loyaltymaster/loyalty_settings/${id}/?changestatus`),
  },
  loyalty_customer: {
    getLoyaltyCustomerOptions: () =>
      Auth.get(`/loyaltymaster/loyalty_customer/?active`),
    getAllLoyaltyCustomer: (page, records, search) =>
      Auth.get(
        `/loyaltymaster/loyalty_customer/?page=${page}&records=${records}&searchText=${search}`
      ),
    createLoyaltyCustomer: (content) =>
      Auth.post("/loyaltymaster/loyalty_customer/", content),
    getLoyaltyCustomerById: (id) =>
      Auth.get(`/loyaltymaster/loyalty_customer/${id}/`),
    updateLoyaltyCustomerById: (id, content) =>
      Auth.put(`/loyaltymaster/loyalty_customer/${id}/`, content),
    deleteLoyaltyCustomerById: (id) =>
      Auth.delete(`/loyaltymaster/loyalty_customer/${id}/`),
    updateLoyaltyCustomerStatus: (id) =>
      Auth.get(`/loyaltymaster/loyalty_customer/${id}/?changestatus`),
  },

  loyalty_transactions: {
    getLoyaltyTransactionsOptions: () =>
      Auth.get(`/loyaltymaster/loyalty_transactions/?active`),
    getAllLoyaltyTransactions: (page, records, search) =>
      Auth.get(
        `/loyaltymaster/loyalty_transactions/?page=${page}&records=${records}&searchText=${search}`
      ),
    createLoyaltyTransactions: (content) =>
      Auth.post("/loyaltymaster/loyalty_transactions/", content),
    getLoyaltyTransactionsById: (id) =>
      Auth.get(`/loyaltymaster/loyalty_transactions/${id}/`),
    updateLoyaltyTransactionsById: (id, content) =>
      Auth.put(`/loyaltymaster/loyalty_transactions/${id}/`, content),
    deleteLoyaltyTransactionsById: (id) =>
      Auth.delete(`/loyaltymaster/loyalty_transactions/${id}/`),
    updateLoyaltyTransactionsStatus: (id) =>
      Auth.get(`/loyaltymaster/loyalty_transactions/${id}/?changestatus`),
  },

  loyalty_referrals: {
    getLoyaltyReferralsOptions: () =>
      Auth.get(`/loyaltymaster/loyalty_referrals/?active`),
    getAllLoyaltyReferrals: (page, records, search) =>
      Auth.get(
        `/loyaltymaster/loyalty_referrals/?page=${page}&records=${records}&searchText=${search}`
      ),
    createLoyaltyReferrals: (content) =>
      Auth.post("/loyaltymaster/loyalty_referrals/", content),
    getLoyaltyReferralsById: (id) =>
      Auth.get(`/loyaltymaster/loyalty_referrals/${id}/`),
    updateLoyaltyReferralsById: (id, content) =>
      Auth.put(`/loyaltymaster/loyalty_referrals/${id}/`, content),
    deleteLoyaltyReferralsById: (id) =>
      Auth.delete(`/loyaltymaster/loyalty_referrals/${id}/`),
    updateLoyaltyReferralsStatus: (id) =>
      Auth.get(`/loyaltymaster/loyalty_referrals/${id}/?changestatus`),
  },
};

const loyaltyMasterAPI = { ...api };

export default loyaltyMasterAPI;
