import { createAsyncThunk } from "@reduxjs/toolkit";
import authUserAPI from "../api/authUserAPI";
import { DispatchErrorHandler } from "../configs";

export const userLogin = createAsyncThunk("authUserReducer/userLogin", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await authUserAPI.authUser.loginUser(payload);
    return response || null;
  } catch (error) {
    payload?.setError(error?.response?.data?.error_detail);
    // if (payload?.data?.message !== undefined) {
    //   payload?.navigate(
    //     {
    //       pathname: `${process.env.PUBLIC_URL}/auth/verify`,
    //     },
    //     {
    //       state: {
    //         username: payload?.username,
    //         password: payload?.password,
    //       },
    //     }
    //   );
    // }
    return rejectWithValue(error);
  }
});

export const userOTPVerify = createAsyncThunk(
  "authUserReducer/userOTPVerify",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await authUserAPI.authUser.verifyOTP(payload);
      return response?.data || null;
    } catch (error) {
      // toastfunc(error?.response?.data?.error_detail);
      // payload?.setError(error?.response?.data?.error_detail);
      return rejectWithValue(error);
    }
  }
);

export const userOTPResend = createAsyncThunk(
  "authUserReducer/userOTPResend",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await authUserAPI.authUser.resendOTP(payload);
      return response?.data || null;
    } catch (error) {
      // toastfunc(error?.response?.data?.error_detail);
      // payload?.setError(error?.response?.data?.error_detail);
      return rejectWithValue(error);
    }
  }
);

export const userLogout = createAsyncThunk("authUserReducer/userLogout", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await authUserAPI.authUser.logoutUser(payload);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const checkUserToken = createAsyncThunk(
  "authUserReducer/checkUserToken",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await authUserAPI.authUser.checkToken(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const checkDayClose = createAsyncThunk(
  "authUserReducer/checkDayClose",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await authUserAPI.authUser.checkDayClose(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateDayClose = createAsyncThunk(
  "authUserReducer/updateDayClose",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await authUserAPI.authUser.updateDayClose(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "authUserReducer/getUserInfo",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await authUserAPI.authUser.userInfo(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getNotifications = createAsyncThunk(
  "authUserReducer/getNotifications",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await authUserAPI.authUser.userNotification(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

// export const updateNotifications = (newNotification) => ({
//   type: "authUserReducer/updateNotifications",
//   payload: newNotification,
// });
