import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";
import {
  createClient,
  deleteClientById,
  getAllClient,
  getClientById,
  getClientOptions,
  updateClientById,
  updateClientStatus,
  getAllMasterClients,
  createMasterClients,
  getMasterClientsById,
  updateMasterClientsById,
  deleteMasterClientsById,
  getAdminProductMasterOption,
  getAllAdminProductMaster,
  getAdminProductMasterById,
  createAdminProductMaster,
  updateAdminProductMasterById,
  deleteAdminProductMasterById,
  updateAdminProductMasterStatus,
  getAllMasterModule,
  createMasterModule,
  getMasterModuleById,
  updateMasterModuleById,
  deleteMasterModuleById,
  getMasterClientsOptions,
  getMasterModuleOption
} from "../thunks/adminMaster";

const clientReducerInitialState = {
  clientOptions: [],
  clientList: [],
  clientInfo: null,
  isError: null,
  isLoading: false,
};

export const clientReducer = createSlice({
  name: "clientReducer",
  initialState: clientReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getClientOptions.fulfilled, (state, action) => {
      state.clientOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllClient.fulfilled, (state, action) => {
      state.clientList = action.payload;
      state.clientInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getClientById.fulfilled, (state, action) => {
      state.clientInfo = action.payload?.data;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getClientOptions.pending,
        getAllClient.pending,
        createClient.pending,
        updateClientById.pending,
        deleteClientById.pending,
        updateClientStatus.pending,
        getClientById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getClientOptions.rejected,
        getAllClient.rejected,
        createClient.rejected,
        updateClientById.rejected,
        deleteClientById.rejected,
        updateClientStatus.rejected,
        getClientById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createClient.fulfilled,
        updateClientById.fulfilled,
        deleteClientById.fulfilled,
        updateClientStatus.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.clientInfo = null;
        state.isError = false;
      }
    );
  },
});

const adminProductMasterReducerInitialState = {
  adminProductMasterOptions: [],
  adminProductMasterList: [],
  adminProductMasterInfo: null,
  isError: null,
  isLoading: false,
};

export const adminProductMasterReducer = createSlice({
  name: "adminProductMasterReducer",
  initialState: adminProductMasterReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAdminProductMasterOption.fulfilled, (state, action) => {
      state.adminProductMasterOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllAdminProductMaster.fulfilled, (state, action) => {
      state.adminProductMasterList = action.payload;
      state.adminProductMasterInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getAdminProductMasterById.fulfilled, (state, action) => {
      state.adminProductMasterInfo = action.payload?.data;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getAdminProductMasterOption.pending,
        getAllAdminProductMaster.pending,
        createAdminProductMaster.pending,
        updateAdminProductMasterById.pending,
        deleteAdminProductMasterById.pending,
        updateAdminProductMasterStatus.pending,
        getAdminProductMasterById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAdminProductMasterOption.rejected,
        getAllAdminProductMaster.rejected,
        createAdminProductMaster.rejected,
        updateAdminProductMasterById.rejected,
        deleteAdminProductMasterById.rejected,
        updateAdminProductMasterStatus.rejected,
        getAdminProductMasterById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createAdminProductMaster.fulfilled,
        updateAdminProductMasterById.fulfilled,
        deleteAdminProductMasterById.fulfilled,
        updateAdminProductMasterStatus.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.clientInfo = null;
        state.isError = false;
      }
    );
  },
});

const masterClientReducerInitialState = {
  masterClientList: [],
  ClientOptions: [],
  masterClientInfo: null,
  isLoading: false,
  isError: null,
};

export const masterClientReducer = createSlice({
  name: "masterClientReducer",
  initialState: masterClientReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMasterClientsOptions.fulfilled, (state, action) => {
      state.ClientOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllMasterClients.fulfilled, (state, action) => {
      state.masterClientList = action.payload;
      state.masterClientInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getMasterClientsById.fulfilled, (state, action) => {
      state.masterClientInfo = action.payload?.data;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getAllMasterClients.pending,
        createMasterClients.pending,
        getMasterClientsById.pending,
        updateMasterClientsById.pending,
        deleteMasterClientsById.pending,
        getMasterClientsOptions.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAllMasterClients.rejected,
        createMasterClients.rejected,
        getMasterClientsById.rejected,
        updateMasterClientsById.rejected,
        deleteMasterClientsById.rejected,
        getMasterClientsOptions.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        createMasterClients.fulfilled,
        updateMasterClientsById.fulfilled,
        deleteMasterClientsById.fulfilled
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.masterClientInfo = null;
      }
    );
  },
});

const mastermoduleReducerInitialState = {
  masterModuleList: [],
  ModuleMasterOptions: [],
  masterModuleInfo: null,
  isLoading: false,
  isError: null,
};

export const mastermoduleReducer = createSlice({
  name: "mastermoduleReducer",
  initialState: mastermoduleReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMasterModuleOption.fulfilled, (state, action) => {
      state.ModuleMasterOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllMasterModule.fulfilled, (state, action) => {
      state.masterModuleList = action.payload;
      state.masterModuleInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getMasterModuleById.fulfilled, (state, action) => {
      state.masterModuleInfo = action.payload?.data;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getAllMasterModule.pending,
        createMasterModule.pending,
        getMasterModuleById.pending,
        updateMasterModuleById.pending,
        deleteMasterModuleById.pending,
        getMasterModuleOption.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAllMasterModule.rejected,
        createMasterModule.rejected,
        getMasterModuleById.rejected,
        updateMasterModuleById.rejected,
        deleteMasterModuleById.rejected,
        getMasterModuleOption.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        createMasterModule.fulfilled,
        updateMasterModuleById.fulfilled,
        deleteMasterModuleById.fulfilled
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.masterModuleInfo = null;
      }
    );
  },
});
