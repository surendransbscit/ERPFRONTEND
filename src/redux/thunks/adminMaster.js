import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import adminMasterAPI from "../api/adminMasterAPI";

//Clients
export const getClientOptions = createAsyncThunk(
  "clientReducer/getClientOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.clients.getClientOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllClient = createAsyncThunk(
  "clientReducer/getAllClient",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.clients.getAllClient(
        payload?.page,
        payload?.records,
        payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createClient = createAsyncThunk(
  "clientReducer/createClient",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.clients.createClient(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getClientById = createAsyncThunk(
  "clientReducer/getClientById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.clients.getClientById(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateClientById = createAsyncThunk(
  "clientReducer/updateClientById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.clients.updateClientById(
        payload?.id,
        payload?.putData
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteClientById = createAsyncThunk(
  "clientReducer/deleteClientById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.clients.deleteClientById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateClientStatus = createAsyncThunk(
  "clientReducer/updateClientStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.clients.updateClientStatus(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Master Clients
export const getMasterClientsOptions = createAsyncThunk(
  "masterclientReducer/getMasterClientsOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await adminMasterAPI.masetrclients.getMasterClientsOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllMasterClients = createAsyncThunk(
  "masterclientReducer/getAllMasterClients",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.masetrclients.getAllMasterClients(
        payload?.page,
        payload?.records,
        payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const createMasterClients = createAsyncThunk(
  "masterclientReducer/createMasterClients",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.masetrclients.createMasterClients(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getMasterClientsById = createAsyncThunk(
  "masterclientReducer/getMasterClientsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.masetrclients.getMasterClientsById(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const updateMasterClientsById = createAsyncThunk(
  "masterclientReducer/updateMasterClientsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await adminMasterAPI.masetrclients.updateMasterClientsById(
          payload?.id,
          payload?.putData
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const deleteMasterClientsById = createAsyncThunk(
  "masterclientReducer/deleteMasterClientsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await adminMasterAPI.masetrclients.deleteMasterClientsById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Admin Product Master
export const getAdminProductMasterOption = createAsyncThunk(
  "adminProductMasterReducer/getAdminProductMasterOption",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await adminMasterAPI.adminproductmaster.getAdminProductMasterOption();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllAdminProductMaster = createAsyncThunk(
  "adminProductMasterReducer/getAllAdminProductMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await adminMasterAPI.adminproductmaster.getAllAdminProductMaster(
          payload?.page,
          payload?.records,
          payload?.search
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

// Master Module
export const getMasterModuleOption = createAsyncThunk(
  "mastermoduleReducer/getMasterModuleOption",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await adminMasterAPI.mastermodule.getMasterModuleOption();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllMasterModule = createAsyncThunk(
  "mastermoduleReducer/getAllMasterModule",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.mastermodule.getAllMasterModule(
        payload?.page,
        payload?.records,
        payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const createAdminProductMaster = createAsyncThunk(
  "adminProductMasterReducer/createAdminProductMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await adminMasterAPI.adminproductmaster.createAdminProductMaster(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createMasterModule = createAsyncThunk(
  "mastermoduleReducer/createMasterModule",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.mastermodule.createMasterModule(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAdminProductMasterById = createAsyncThunk(
  "adminProductMasterReducer/getAdminProductMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await adminMasterAPI.adminproductmaster.getAdminProductMasterById(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getMasterModuleById = createAsyncThunk(
  "mastermoduleReducer/getMasterModuleById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.mastermodule.getMasterModuleById(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateAdminProductMasterById = createAsyncThunk(
  "adminProductMasterReducer/updateAdminProductMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await adminMasterAPI.adminproductmaster.updateAdminProductMasterById(
          payload?.id,
          payload?.putData
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateMasterModuleById = createAsyncThunk(
  "mastermoduleReducer/updateMasterModuleById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.mastermodule.updateMasterModuleById(
        payload?.id,
        payload?.putData
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteAdminProductMasterById = createAsyncThunk(
  "adminProductMasterReducer/deleteAdminProductMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await adminMasterAPI.adminproductmaster.deleteAdminProductMasterById(
          payload
        );

      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const deleteMasterModuleById = createAsyncThunk(
  "mastermoduleReducer/deleteMasterModuleById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminMasterAPI.mastermodule.deleteMasterModuleById(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateAdminProductMasterStatus = createAsyncThunk(
  "adminProductMasterReducer/updateAdminProductMasterStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await adminMasterAPI.adminproductmaster.updateAdminProductMasterStatus(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
