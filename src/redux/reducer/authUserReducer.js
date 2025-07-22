import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  checkDayClose,
  checkUserToken,
  getUserInfo,
  updateDayClose,
  getNotifications,
  userLogin,
  userLogout,
  userOTPResend,
  userOTPVerify,
} from "../thunks/authUser";
import secureLocalStorage from "react-secure-storage";

export const authUserInitialState = {
  userInfo: {},
  userNotification: null,
  checkToken: {},
  loginDetails: {},
  dayCloseInfo: [],
  isError: null,
  isLoading: false,
  isSigningin: false,
};

export const authUserReducer = createSlice({
  name: "authUserReducer",
  initialState: authUserInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.loginDetails = action.payload.data;
      state.isSigningin = false;
      secureLocalStorage?.setItem("pref", {
        pref: action.payload.data.preferences,
        token: action.payload.data.token,
        redirect: true,
        login_expiry: new Date(action.payload.data.login_expiry),
      });
      if (action.payload.data.email_verified === false) {
        window.history.pushState(
          `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/auth/login"}`,
          "Verify Auth",
          `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/auth/verify"}`
        );
        window.location.reload();
      } else {
        window.history.pushState(
          `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/auth/login"}`,
          "auth/login",
          `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/auth/login"}`
        );
        window.location.reload();
      }
    });
    builder.addCase(checkUserToken.fulfilled, (state, action) => {
      state.checkToken = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.userInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.userNotification = action.payload;
      state.isLoading = false;
    });
    builder.addCase(checkDayClose.fulfilled, (state, action) => {
      state.dayCloseInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(userLogin.pending, (state, action) => {
      state.isSigningin = true;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.isSigningin = false;
    });
    builder.addMatcher(
      isAnyOf(
        userLogout.pending,
        checkDayClose.pending,
        checkUserToken.pending,
        getUserInfo.pending,
        updateDayClose.pending,
        userOTPResend.pending,
        userOTPVerify.pending,
        getNotifications.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        userLogin.rejected,
        userLogout.rejected,
        checkUserToken.rejected,
        getUserInfo.rejected,
        checkDayClose.rejected,
        updateDayClose.rejected,
        userOTPResend.rejected,
        userOTPVerify.rejected,
        getNotifications.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        userLogout.fulfilled,
        updateDayClose.fulfilled,
        userOTPVerify.fulfilled,
        userOTPResend.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});
