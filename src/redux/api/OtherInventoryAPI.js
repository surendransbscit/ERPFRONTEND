import { Auth } from "../configs";

const api = {
    other_inventory_category: {
        getAllOtherInventoryCategory: (page, records,search) => Auth.get(`/other_inventory/category/?page=${page}&records=${records}&searchText=${search}`),
        createOtherInventoryCategory: (content) => Auth.post("/other_inventory/category/", content),
        getOtherInventoryCategoryById: (id) => Auth.get(`/other_inventory/category/${id}/`),
        updateOtherInventoryCategoryById: (id, content) => Auth.put(`/other_inventory/category/${id}/`, content),
        deleteOtherInventoryCategoryById: (id) => Auth.delete(`/other_inventory/category/${id}/`),
        getOtherInventoryCategoryOptions: () => Auth.get(`/other_inventory/category/?is_active`),
    },
    other_inventory_size: {
        getOtherInventorySize: (page, records,search) => Auth.get(`/other_inventory/size/?page=${page}&records=${records}&searchText=${search}`),
        createOtherInventorySize: (content) => Auth.post("/other_inventory/size/", content),
        getOtherInventorySizeById: (id) => Auth.get(`/other_inventory/size/${id}/`),
        updateOtherInventorySizeById: (id, content) => Auth.put(`/other_inventory/size/${id}/`, content),
        deleteOtherInventorySizeById: (id) => Auth.delete(`/other_inventory/size/${id}/`),
        getOtherInventorySizeOptions: () => Auth.get(`/other_inventory/size/?is_active`),
        changeStatusOtherInventorySize: (id) => Auth.get(`/other_inventory/size/${id}/?changestatus`),
    },
    other_inventory_item: {
        getOtherInventoryItemByID: (id) => Auth.get(`/other_inventory/item/${id}/`),
        deleteOtherInventoryItemByID: (id) => Auth.delete(`/other_inventory/item/${id}/`),
        getAllOtherInventoryItem: (page, records,search) => Auth.get(`/other_inventory/item/?page=${page}&records=${records}&searchText=${search}`),
        createOtherInventoryItem: (content) => Auth.post("/other_inventory/item/", content),
        updateOtherInventoryItemByID: (id, content) => Auth.put(`/other_inventory/item/${id}/`, content),
        changeStatusOtherInventoryItem: (id) => Auth.get(`/other_inventory/item/${id}/?changestatus`),
        getOtherInventoryItemOptions: () => Auth.get(`/other_inventory/item/?is_active`),
    },
    other_inventory_item_issue: {
        getAllOtherInventoryItemIssue: (page, records,search) => Auth.get(`/other_inventory/item_issue/?page=${page} records=${records}&searchText=${search}`),
        createOtherInventoryItemIssue: (content) => Auth.post("/other_inventory/item_issue/", content),
        getOtherInventoryItemIssueById: (id) => Auth.get(`/other_inventory/item_issue/${id}/`),
        updateOtherInventoryItemIssueById: (id, content) => Auth.put(`/other_inventory/item_issue/${id}/`, content),
        deleteOtherInventoryItemIssueById: (id) => Auth.delete(`/other_inventory/item_issue/${id}/`),
        cancelOtherInventoryItemIssue: (content) => Auth.post(`/other_inventory/item_issue/cancel/`, content),
    },
    other_inventory_purchase: {
        getOtherInventoryPurchaseByID: (id) => Auth.get(`/other_inventory/purchase/${id}/`),
        deleteOtherInventoryPurchaseByID: (id) => Auth.delete(`/other_inventory/purchase/${id}/`),
        getAllOtherInventoryPurchase: (page,records,search) => Auth.post(`/other_inventory/purchase_entry/list/?page=${page}&records=${records}&searchText=${search}`),
        cancelOtherInventoryPurchase: (content) => Auth.post(`/other_inventory/purchase_entry/cancel/`, content),
        createOtherInventoryPurchase: (content) => Auth.post("/other_inventory/purchase_entry/create/", content),
        updateOtherInventoryPurchaseByID: (id, content) => Auth.put(`/other_inventory/purchase/${id}/`, content),
        changeStatusOtherInventoryPurchase: (id) => Auth.get(`/other_inventory/purchase/${id}/?changestatus`),
        getOtherInventoryPurchaseOptions: () => Auth.get(`/other_inventory/purchase/?is_active`),
    },
};

const otherInventoryAPI = { ...api };

export default otherInventoryAPI;
