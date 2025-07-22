import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../utils/hooks/useAuth";
import { useCallback, useContext, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { useDispatch } from "react-redux";
import { checkUserToken, userLogout } from "../redux/thunks/authUser";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import EventBus from "../common/EventBus";
import { toastfunc } from "../components/sds-toast-style/toast-style";
import Swal from "sweetalert2";
import { useIdleTimer } from "react-idle-timer";
import { useSessionContext } from "../contexts/SessionContext";

const ProtectedRoute = () => {
  const { authenticated, signOut } = useAuth();
  // const { isActive } = useSessionContext();
  const location = useLocation();
  const dispatch = useDispatch();
  const [deviceID, setDeviceID] = useState(null);
  // const { isLoading: tokenChecking, checkToken = {} } = useSelector((state) => state.authUserReducer);

  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceID(result.visitorId);
    };
    loadFingerprint();
  }, []);

  useEffect(() => {
    const token = secureLocalStorage.getItem("pref")?.token;
    if (deviceID && token) {
      dispatch(checkUserToken({ deviceID }));
    }
  }, [deviceID, dispatch]);

  // const logOut = useCallback(() => {
  //   dispatch(userLogout());
  //   secureLocalStorage.removeItem("pref");
  //   localStorage.clear()
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 100);
  // }, [dispatch]);

  
  // on idle -> set what happens
  // const onIdle = () => {
  //   if (isActive && location?.pathname !== "/auth/login") {
  //     signOut();
  //   }
  // };
  //

  // useEffect(() => {
  //   //
  //   // On no connection with the server
  //   EventBus.on("server_down", () => {
  //     Swal.fire({
  //       title: "Error!",
  //       text: "Oops ! Server is Down",
  //       icon: "error",
  //       confirmButtonText: "Retry",
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         window.location.reload();
  //       }
  //     });
  //   });
  //   //

  //   //
  //   // on event bus being dispatch with logout --
  //   //  when users Login expires
  //   EventBus.on("logout", () => {
  //     secureLocalStorage.removeItem("pref");
  //     // Show Alert dialog as Login has expired
  //     Swal.fire({
  //       title: "Warning!",
  //       text: "Your Login Expired",
  //       icon: "warning",
  //       confirmButtonText: "Login",
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         signOut();
  //       }
  //     });
  //   });
  //   //

  //   //
  //   EventBus.on("acc_expired", () => {
  //     secureLocalStorage.removeItem("pref");
  //     // Show Alert dialog as Login has expired
  //     Swal.fire({
  //       title: "Error!",
  //       text: "Your Account has Expired",
  //       icon: "error",
  //       confirmButtonText: "Login",
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         signOut();
  //       }
  //     });
  //   });
  //   //

  //   //
  //   // on event bus being dispatch with error -- validations errors[unique,non accepted,etc]
  //   EventBus.on("error", (errdata) => {
  //     errdata?.map((item) => toastfunc(item));
  //   });

  //   //for unique and unique values already in use
  //   EventBus.on("unique", (errdata) => {
  //     toastfunc(errdata);
  //   });
  //   //

  //   // clear Events
  //   return () => {
  //     EventBus.remove("logout");
  //     EventBus.remove("error");
  //     EventBus.remove("acc_expired");
  //     EventBus.remove("server_down");
  //   };
  // }, [signOut]);
  //

  // // idle timer setting
  // const idleTimer = useIdleTimer({
  //   onIdle,
  //   timeout: 1000 * 60 * 60, // 1 hour
  //   promptTimeout: 0,
  //   events: [
  //     "mousemove",
  //     "keydown",
  //     "wheel",
  //     "DOMMouseScroll",
  //     "mousewheel",
  //     "mousedown",
  //     "touchstart",
  //     "touchmove",
  //     "MSPointerDown",
  //     "MSPointerMove",
  //     "visibilitychange",
  //   ],
  //   debounce: 0,
  //   throttle: 0,
  //   eventsThrottle: 200,
  //   element: document,
  //   startOnMount: true,
  //   crossTab: false,
  //   stopOnIdle: false,
  // });

  if (!authenticated) {
    return (
      <Navigate
        replace
        to={`${"auth/login"}?${"redirectUrl"}=${location.pathname}`}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
