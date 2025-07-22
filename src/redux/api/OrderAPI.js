import { Auth } from "../configs";

const api = {
  order: {
    getAllOrder: (page, content) => Auth.post(`/orders/order/list/?page=${page}`, content),
    getAllPurchaseOrder: (page, content) => Auth.post(`/orders/purchase_order/list/?page=${page}`, content),
    getPurchaseOrderStatusList: (content) => Auth.post(`/orders/purchase_order_status/list/`, content),
    purchaseOrderStatusChange: (content) => Auth.post(`/orders/purchase_order_status/update/`, content),
    getPurchaseOrderPurchaseSoldDetails: (content) => Auth.post(`/orders/purchase_order_purchase_sold/`, content),
    getPurchaseOrderById: (id) => Auth.get(`/orders/purchase_order/${id}/`),
    updatePurchaseOrderById: (id, content) => Auth.put(`/orders/purchase_order/${id}/`, content),
    getOrderDropdown: (content) => Auth.post(`/orders/order/dropdown/`, content),
    createOrder: (content) => Auth.post("/orders/order/create/", content),
    getOrderByID: (id) => Auth.get(`/orders/order/${id}/`),
    updateOrderByID: (id, content) => Auth.put(`/orders/order/edit/${id}/`, content),
    deleteOrderByID: (id) => Auth.delete(`/orders/order/delete/${id}/`),
    deletePurchaseOrderById: (id) => Auth.delete(`/orders/purchase_order/delete/${id}/`),
    orderAssign: (content) => Auth.post(`orders/job_order/create/`, content),
    openOrders: (content) => Auth.post(`orders/open_orders/list/`, content),
    orderStatusChange: (content) => Auth.post(`/orders/order/job_orders/update/`, content),
    getAssignedOrders: (content) => Auth.post(`/orders/order/job_orders/list/`, content),
    cancelOrders: (content) => Auth.post(`/orders/order/customer_orders/update/`, content),
    deliverdOrders:(content) => Auth.post(`/orders/order/customer_orders_deliverd/update/`, content),
    getOrders: (content) => Auth.post(`/orders/order/customer_orders/list/`, content),
    getAllOrderStatus: (content) => Auth.get(`/retailmaster/erporder_status/?${content}`),
    orderLink: (content) => Auth.post(`orders/order/link/`, content),
    orderLinkList: (content) => Auth.post(`orders/order_link/list/`, content),
    getRepairOrderDeliveryDetails: (content) => Auth.post(`orders/repairorderdelivery/`, content),
    createRepairOrderDelivery: (content) => Auth.post("/orders/repairorderdelivery/create/", content),
    getRepairOrderList: (content) => Auth.post("/orders/repairorder/list/", content),

    getAllCustomerDeposits: (page, content,pathname) => Auth.get(`/retailmaster/customer_deposit/?page=${page}&path_name=${pathname}`, content),
    createCustomerDeposits: (content) => Auth.post("/retailmaster/customer_deposit/", content),
    getCustomerDepositByID: (id) => Auth.get(`/retailmaster/customer_deposit/${id}/`),
    updateCustomerDepositByID: (id, content) => Auth.put(`/retailmaster/customer_deposit/${id}/`, content),
    
    getRepairs: (content) => Auth.post(`/orders/order/repair_order_status/list/`, content),
    createPurchaseCartItem: (content) => Auth.post(`/orders/purchasecart/`, content),
    removePurchaseCartItem: (content) => Auth.put(`/orders/purchasecart/`, content),
    getPurchaseCartItems: () => Auth.get(`/orders/purchasecart/`),

  },
};

const orderAPI = { ...api };

export default orderAPI;
