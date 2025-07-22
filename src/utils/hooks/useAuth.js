import { useNavigate } from "react-router-dom";
import useQuery from "./useQuery";
import secureLocalStorage from "react-secure-storage";
import { useDispatch, useSelector } from "react-redux";
import { userLogin, userLogout } from "../../redux/thunks/authUser";
import { useEffect, useState } from "react";

// type Status = 'success' | 'failed'

function useAuth() {
  const REDIRECT_URL_KEY = "redirectUrl";
  const dispatch = useDispatch();
  const [authChecking, setAuthChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(true);
  const [bootComplete, setBootComplete] = useState(false);

  const navigate = useNavigate();

  const query = useQuery();

  // const { token, signedIn } = useAppSelector((state) => state.auth.session);
  const { isLoading: tokenChecking, checkToken = {} } = useSelector(
    (state) => state.authUserReducer
  );

  let authInitializedAt = Date.now();

  const isAuthGracePeriod = () => {
    return Date.now() - authInitializedAt < 2000; // 2 seconds grace
  };

  const resetAuthTimer = () => {
    authInitializedAt = Date.now();
  };

  const token = secureLocalStorage.getItem("pref")?.token;
  // const signedIn = !!checkToken?.message?.toLowerCase().includes("logged");
  const signedIn = true;

  // useLayoutEffect(() => {
  //   token && dispatch(checkUserToken());
  // }, [token]);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const signIn = async (values, setError) => {
    try {
      const resp = await dispatch(
        userLogin({
          username: values?.name,
          password: values?.passcode,
          id_company: values?.id_company,
          deviceID: values?.deviceId,
          setError: setError,
        })
      ).unwrap();
      resetAuthTimer();
      console.log(resp);

      if (resp?.data?.success === true) {
        // const { token } = resp.data;
        // dispatch(signInSuccess(token));
        if (resp?.status === 200) {
          secureLocalStorage?.setItem("pref", {
            pref: resp?.data.preferences,
            token: resp?.data.token,
            redirect: true,
            login_expiry: new Date(resp?.data.login_expiry),
          });
          // dispatch(
          //   setUser(
          //     resp.data.user || {
          //       avatar: "",
          //       userName: "Anonymous",
          //       authority: ["USER"],
          //       email: "",
          //     }
          //   )
          // );
          await delay(500); // wait for localStorage write
          window.localStorage.setItem("auth_ready", "true");
          const redirectUrl = query.get(REDIRECT_URL_KEY);
          navigate(redirectUrl ? redirectUrl : "/");
          window.location.reload();
        }

        return {
          status: "success",
          message: "",
        };
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  //   useEffect(() => {
  //   const token = secureLocalStorage.getItem("pref")?.token;
  //   if (token) {
  //     // token exists, now verify...
  //     checkLoginToken(token).then(() => {
  //       setAuthenticated(true);
  //       setAuthChecking(false);
  //     }).catch(() => {
  //       setAuthenticated(false);
  //       setAuthChecking(false);
  //     });
  //   } else {
  //     setAuthenticated(false);
  //     setAuthChecking(false);
  //   }
  // }, []);

  // const signUp = async (values) => {
  //   try {
  //     const resp = await apiSignUp(values);
  //     if (resp.data) {
  //       const { token } = resp.data;
  //       dispatch(signInSuccess(token));
  //       if (resp.data.user) {
  //         dispatch(
  //           setUser(
  //             resp.data.user || {
  //               avatar: "",
  //               userName: "Anonymous",
  //               authority: ["USER"],
  //               email: "",
  //             }
  //           )
  //         );
  //       }
  //       const redirectUrl = query.get(REDIRECT_URL_KEY);
  //       navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
  //       return {
  //         status: "success",
  //         message: "",
  //       };
  //     }
  //     // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  //   } catch (errors) {
  //     return {
  //       status: "failed",
  //       message: errors?.response?.data?.message || errors.toString(),
  //     };
  //   }
  // };

  // const handleSignOut = () => {
  //   dispatch(signOutSuccess());
  //   dispatch(
  //     setUser({
  //       avatar: "",
  //       userName: "",
  //       email: "",
  //       authority: [],
  //     })
  //   );
  //   navigate(appConfig.unAuthenticatedEntryPath);
  // };

  const signOut = async () => {
    localStorage.clear();
    await dispatch(userLogout());
    window.location.reload();
  };

  return {
    authenticated: !!token && signedIn,
    signIn,
    // signUp,
    signOut,
    authChecking,
    isAuthGracePeriod,
    resetAuthTimer,
    bootComplete, setBootComplete
  };
}

export default useAuth;
