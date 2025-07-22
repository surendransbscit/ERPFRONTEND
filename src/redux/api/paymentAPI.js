import { Auth } from "../configs";

const api = {
  paymentOptions: {
    getPaymentGateways: () => Auth.get(`/retailmaster/payment_gateway/`),
    getPaymentModes: () => Auth.get(`/retailmaster/paymentmode/`),
    getPayDevices: () => Auth.get(`/retailmaster/pay_device/?status`),
    getNBType: () => Auth.get(`/retailmaster/nb_type/?status`),
  },
  payments: {
    getAllPayments: (page, branch, records, fromDate, toDate,search, customer, scheme,pathname) =>
      Auth.get(
        `/payment/scheme_payment/?page=${page}&branch=${branch}&from=${fromDate}&to=${toDate}&records=${records}&searchText=${search}&customer=${customer}&scheme=${scheme}&path_name=${pathname}`
      ),
    createPayments: (content) => Auth.post(`/payment/scheme_payment/`, content),
    getPaymentInfo: (id) => Auth.get(`/payment/scheme_payment/${id}/`),
    getPaymentHistory: (id) => Auth.get(`/payment/account_payment_history/${id}/`),
    cancelPayments: (content) => Auth.post(`/payment/cancel_payment/`, content),
  },
};

const paymentAPI = { ...api };

export default paymentAPI;
