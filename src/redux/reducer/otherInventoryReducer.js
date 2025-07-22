import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";
import {
    getOtherInventorySize,
    createOtherInventorySize,
    getOtherInventorySizeById,
    updateOtherInventorySizeById,
    deleteOtherInventorySizeById,
    getAllOtherInventoryItem,
    getOtherInventoryItemById,
    deleteOtherInventoryItemById,
    updateOtherInventoryItemStatus,
    getOtherInventoryItemOptions,
    createOtherInventoryItem,
    updateOtherInventoryItemById,
    getAllOtherInventoryItemIssue,
    getOtherInventoryItemIssueById,
    deleteOtherInventoryItemIssueById,
    createOtherInventoryItemIssue,
    updateOtherInventoryItemIssueById,
    getAllOtherInventoryCategory,
    deleteOtherInventoryCategoryById,
    updateOtherInventoryCategoryById,
    createOtherInventoryCategory,
    getOtherInventoryCategoryById,
    getOtherInventorySizeOptions,
    getOtherInventoryCategoryOptions,
    updateOtherInventorySizeStatus,
    getAllOtherInventoryPurchase,
    getOtherInventoryPurchaseById,
    deleteOtherInventoryPurchaseById,
    updateOtherInventoryPurchaseStatus,
    getOtherInventoryPurchaseOptions,
    createOtherInventoryPurchase,
    updateOtherInventoryPurchaseById,
    cancelOtherInventoryPurchase,
    cancelOtherInventoryItemIssue
}
    from "../thunks/otherInventory";

//category

export const otherInventoryCategoryReducerInitialState = {
    otherInventoryCategoryList: [],
    otherInventoryCategoryOptions: [],
    otherInventoryCategoryInfo: null,
    isError: null,
    isLoading: false,
};

export const otherInventoryCategoryReducer = createSlice({
    name: "otherInventoryCategoryReducer",
    initialState: otherInventoryCategoryReducerInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllOtherInventoryCategory.fulfilled, (state, action) => {
            state.otherInventoryCategoryList = action.payload;
            state.otherInventoryCategoryInfo = null;
            state.isLoading = false;
        });
        builder.addCase(getOtherInventoryCategoryById.fulfilled, (state, action) => {
            state.otherInventoryCategoryInfo = action.payload.data;
            state.isLoading = false;
        });
        builder.addCase(deleteOtherInventoryCategoryById.fulfilled, (state, action) => {
            toastsuccess("Category Status changed Successfully");
            state.otherInventoryCategoryInfo = null;
            state.isLoading = false;
        });
        // builder.addCase(updateOtherInventoryCategoryById.fulfilled, (state, action) => {
        //   toastsuccess("Category Status changed Successfully");
        //   state.otherInventoryCategoryInfo = null;
        //   state.isLoading = false;
        // });
        builder.addCase(getOtherInventoryCategoryOptions.fulfilled, (state, action) => {
            state.otherInventoryCategoryOptions = action.payload.data;
            state.isLoading = false;
        });
        builder.addMatcher(
            isAnyOf(
                getAllOtherInventoryCategory.pending,
                createOtherInventoryCategory.pending,
                getOtherInventoryCategoryById.pending,
                updateOtherInventoryCategoryById.pending,
                deleteOtherInventoryCategoryById.pending,
                getOtherInventoryCategoryOptions.pending
            ),
            (state) => {
                state.isLoading = true;
            }
        );
        builder.addMatcher(
            isAnyOf(
                getAllOtherInventoryCategory.rejected,
                createOtherInventoryCategory.rejected,
                getOtherInventoryCategoryById.rejected,
                updateOtherInventoryCategoryById.rejected,
                deleteOtherInventoryCategoryById.rejected,
                getOtherInventoryCategoryOptions.rejected
            ),
            (state, action) => {
                state.isLoading = false;
                state.isError = true;
            }
        );
        builder.addMatcher(
            isAnyOf(
                getAllOtherInventoryCategory.fulfilled,
                createOtherInventoryCategory.fulfilled,
                updateOtherInventoryCategoryById.fulfilled,
                getOtherInventoryCategoryOptions.fulfilled),
            (state) => {
                state.otherInventoryCategoryInfo = null;
                state.isLoading = false;
                state.isError = false;
            }
        );
    },
});

// size
const otherInventorySizeReducerInitialState = {
    otherInventorySizeList: [],
    otherInventorySizeOptions: [],
    otherInventorySizeInfo: null,
    isError: null,
    isLoading: false,
};
export const otherInventorySizeReducer = createSlice({
    name: "otherInventorySizeReducer",
    initialState: otherInventorySizeReducerInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getOtherInventorySize.fulfilled, (state, action) => {
            state.otherInventorySizeList = action.payload;
            state.otherInventorySizeInfo = null;
            state.isLoading = false;
        });
        builder.addCase(getOtherInventorySizeById.fulfilled, (state, action) => {
            state.otherInventorySizeInfo = action.payload.data;
            state.isLoading = false;
        });
        builder.addCase(deleteOtherInventorySizeById.fulfilled, (state, action) => {
            toastsuccess("Size Deleted Successfully");
            state.otherInventorySizeInfo = null;
            state.isLoading = false;
        });
        builder.addCase(getOtherInventorySizeOptions.fulfilled, (state, action) => {
            state.otherInventorySizeOptions = action.payload.data;
            state.isLoading = false;
        });
        builder.addCase(updateOtherInventorySizeStatus.fulfilled, (state, action) => {
            toastsuccess("Size Status changed Successfully");
            state.otherInventorySizeInfo = null;
            state.isLoading = false;
        });

        builder.addMatcher(
            isAnyOf(
                getOtherInventorySize.pending,
                createOtherInventorySize.pending,
                getOtherInventorySizeById.pending,
                updateOtherInventorySizeById.pending,
                deleteOtherInventorySizeById.pending,
                getOtherInventorySizeOptions.pending,
                updateOtherInventorySizeStatus.pending
            ),
            (state) => {
                state.isLoading = true;
            }
        );
        builder.addMatcher(
            isAnyOf(
                getOtherInventorySize.rejected,
                createOtherInventorySize.rejected,
                getOtherInventorySizeById.rejected,
                updateOtherInventorySizeById.rejected,
                deleteOtherInventorySizeById.rejected,
                getOtherInventorySizeOptions.rejected,
                updateOtherInventorySizeStatus.rejected
            ),
            (state, action) => {
                state.isLoading = false;
                state.isError = true;
            }
        );
        builder.addMatcher(
            isAnyOf(
                createOtherInventorySize.fulfilled,
                updateOtherInventorySizeById.fulfilled,
                getOtherInventorySize.fulfilled,
                getOtherInventoryCategoryOptions.fulfilled
            ),
            (state) => {
                state.otherInventorySizeInfo = null;
                state.isLoading = false;
                state.isError = false;
            }
        );
    }
})


//item

export const otherInventoryItemReducerInitialState = {
    otherInventoryItemList: [],
    otherInventoryItemOptions: [],
    otherInventoryItemInfo: null,
    isError: null,
    isLoading: false,
};

export const OtherInventoryItemReducer = createSlice({
    name: "OtherInventoryItemReducer",
    initialState: otherInventoryItemReducerInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllOtherInventoryItem.fulfilled, (state, action) => {
            state.otherInventoryItemList = action.payload;
            state.otherInventoryItemInfo = null;
            state.isLoading = false;
        });
        builder.addCase(getOtherInventoryItemById.fulfilled, (state, action) => {
            state.otherInventoryItemInfo = action.payload;
            state.isLoading = false;
        });
        builder.addCase(deleteOtherInventoryItemById.fulfilled, (state, action) => {
            toastsuccess("Item Deleted Successfully");
            state.otherInventoryItemInfo = null;
            state.isLoading = false;
        });
        builder.addCase(updateOtherInventoryItemStatus.fulfilled, (state, action) => {
            toastsuccess("Item Status changed Successfully");
            state.otherInventoryItemInfo = null;
            state.isLoading = false;
        });
        builder.addCase(getOtherInventoryItemOptions.fulfilled, (state, action) => {
            state.otherInventoryItemOptions = action.payload.data;
            state.isLoading = false;
        });
        builder.addMatcher(
            isAnyOf(
                getAllOtherInventoryItem.pending,
                getOtherInventoryItemById.pending,
                createOtherInventoryItem.pending,
                updateOtherInventoryItemById.pending,
                deleteOtherInventoryItemById.pending,
                updateOtherInventoryItemStatus.pending,
                getOtherInventoryItemOptions.pending
            ),
            (state) => {
                state.isLoading = true;
            }
        );
        builder.addMatcher(
            isAnyOf(
                getAllOtherInventoryItem.rejected,
                getOtherInventoryItemById.rejected,
                createOtherInventoryItem.rejected,
                updateOtherInventoryItemById.rejected,
                deleteOtherInventoryItemById.rejected,
                updateOtherInventoryItemStatus.rejected,
                getOtherInventoryItemOptions.rejected
            ),
            (state, action) => {
                state.isLoading = false;
                state.isError = true;
            }
        );
        builder.addMatcher(
            isAnyOf(
                getAllOtherInventoryItem.fulfilled,
                createOtherInventoryItem.fulfilled,
                updateOtherInventoryItemById.fulfilled,
                getOtherInventoryItemOptions.fulfilled),
            (state) => {
                state.otherInventoryItemInfo = null;
                state.isLoading = false;
                state.isError = false;
            }
        );
    },
});


// Item Issue
export const otherInventoryItemIssueReducerInitialState = {
    otherInventoryItemIssueList: [],
    otherInventoryItemIssueInfo: null,
    isError: null,
    isLoading: false,
};
export const OtherInventoryItemIssueReducer = createSlice({
    name: "otherInventoryItemIssueReducer",
    initialState: otherInventoryItemIssueReducerInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllOtherInventoryItemIssue.fulfilled, (state, action) => {
            state.otherInventoryItemIssueList = action.payload;
            state.otherInventoryItemIssueInfo = null;
            state.isLoading = false;
        });
        builder.addCase(getOtherInventoryItemIssueById.fulfilled, (state, action) => {
            state.otherInventoryItemIssueInfo = action.payload.data;
            state.isLoading = false;
        });
        builder.addCase(deleteOtherInventoryItemIssueById.fulfilled, (state, action) => {
            toastsuccess("Item Issue Deleted Successfully");
            state.otherInventoryItemIssueInfo = null;
            state.isLoading = false;
        });
        builder.addMatcher(
            isAnyOf(
                getAllOtherInventoryItemIssue.pending,
                createOtherInventoryItemIssue.pending,
                getOtherInventoryItemIssueById.pending,
                updateOtherInventoryItemIssueById.pending,
                deleteOtherInventoryItemIssueById.pending,
                cancelOtherInventoryItemIssue.pending
            ),
            (state) => {
                state.isLoading = true;
            }
        );
        builder.addMatcher(
            isAnyOf(
                getAllOtherInventoryItemIssue.rejected,
                createOtherInventoryItemIssue.rejected,
                getOtherInventoryItemIssueById.rejected,
                updateOtherInventoryItemIssueById.rejected,
                deleteOtherInventoryItemIssueById.rejected,
                cancelOtherInventoryItemIssue.rejected

            ),
            (state, action) => {
                state.isLoading = false;
                state.isError = true;
            }
        );
        builder.addMatcher(
            isAnyOf(
                getAllOtherInventoryItemIssue.fulfilled,
                createOtherInventoryItemIssue.fulfilled,
                updateOtherInventoryItemIssueById.fulfilled,
                cancelOtherInventoryItemIssue.fulfilled),
            (state) => {
                state.otherInventoryItemIssueInfo = null;
                state.isLoading = false;
                state.isError = false;
            }
        );
    },
});


//Purchase

export const otherInventoryPurchaseReducerInitialState = {
    otherInventoryPurchaseList: [],
    otherInventoryPurchaseOptions: [],
    otherInventoryPurchaseInfo: null,
    isError: null,
    isLoading: false,
};

export const OtherInventoryPurchaseReducer = createSlice({
    name: "OtherInventoryPurchaseReducer",
    initialState: otherInventoryPurchaseReducerInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllOtherInventoryPurchase.fulfilled, (state, action) => {
            state.otherInventoryPurchaseList = action.payload;
            state.otherInventoryPurchaseInfo = null;
            state.isLoading = false;
        });
        builder.addCase(getOtherInventoryPurchaseById.fulfilled, (state, action) => {
            state.otherInventoryPurchaseInfo = action.payload;
            state.isLoading = false;
        });
        builder.addCase(deleteOtherInventoryPurchaseById.fulfilled, (state, action) => {
            toastsuccess("Purchase Deleted Successfully");
            state.otherInventoryPurchaseInfo = null;
            state.isLoading = false;
        });
        builder.addCase(updateOtherInventoryPurchaseStatus.fulfilled, (state, action) => {
            toastsuccess("Purchase Status changed Successfully");
            state.otherInventoryPurchaseInfo = null;
            state.isLoading = false;
        });
        builder.addCase(getOtherInventoryPurchaseOptions.fulfilled, (state, action) => {
            state.otherInventoryPurchaseOptions = action.payload.data;
            state.isLoading = false;
        });
        builder.addMatcher(
            isAnyOf(
                getAllOtherInventoryPurchase.pending,
                getOtherInventoryPurchaseById.pending,
                createOtherInventoryPurchase.pending,
                updateOtherInventoryPurchaseById.pending,
                deleteOtherInventoryPurchaseById.pending,
                updateOtherInventoryPurchaseStatus.pending,
                getOtherInventoryPurchaseOptions.pending,
                cancelOtherInventoryPurchase.pending
            ),
            (state) => {
                state.isLoading = true;
            }
        );
        builder.addMatcher(
            isAnyOf(
                getAllOtherInventoryPurchase.rejected,
                getOtherInventoryPurchaseById.rejected,
                createOtherInventoryPurchase.rejected,
                updateOtherInventoryPurchaseById.rejected,
                deleteOtherInventoryPurchaseById.rejected,
                updateOtherInventoryPurchaseStatus.rejected,
                getOtherInventoryPurchaseOptions.rejected,
                cancelOtherInventoryPurchase.rejected
            ),
            (state, action) => {
                state.isLoading = false;
                state.isError = true;
            }
        );
        builder.addMatcher(
            isAnyOf(
                getAllOtherInventoryPurchase.fulfilled,
                createOtherInventoryPurchase.fulfilled,
                updateOtherInventoryPurchaseById.fulfilled,
                getOtherInventoryPurchaseOptions.fulfilled,
                cancelOtherInventoryPurchase.fulfilled
            ),
            (state) => {
                state.otherInventoryPurchaseInfo = null;
                state.isLoading = false;
                state.isError = false;
            }
        );
    },
});
