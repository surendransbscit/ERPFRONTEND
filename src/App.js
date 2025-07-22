/* eslint-enable */
import Router from "./route/Index";
import ThemeProvider from "./layout/provider/Theme";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { useCallback, useEffect } from "react";
import EventBus from "./common/EventBus";
import Swal from "sweetalert2";
import { useIdleTimer } from "react-idle-timer";
import { toastfunc } from "./components/sds-toast-style/toast-style";
import { userLogout } from "./redux/thunks/authUser";
import { ShortCodeProvider } from "./contexts/ShortCodeContexts";
import WordTransformerProvider from "./contexts/WordTransformerContexts";
import { BillSettingProvider } from "./contexts/BillSettingContext";
import { SocketProvider } from "./contexts/SocketContext";
import secureLocalStorage from "react-secure-storage";
import { AuthSessionProvider } from "./contexts/SessionContext";

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    secureLocalStorage.removeItem("pref");
    dispatch(userLogout());
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, [dispatch]);

  //
  // on idle -> set what happens
  const onIdle = () => {
    if (location?.pathname !== "/auth/login") {
      logOut();
    }
  };
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
  //     localStorage.clear();
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
  //         logOut();
  //       }
  //     });
  //   });
  //   //

  //   //
  //   EventBus.on("acc_expired", () => {
  //     localStorage.clear();
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
  //         logOut();
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
  //     console.log("HAI TO EventBus")
      
  //    // toastfunc(errdata);
  //   });
  //   //

  //   // clear Events
  //   return () => {
  //     EventBus.remove("logout");
  //     EventBus.remove("error");
  //     EventBus.remove("acc_expired");
  //     EventBus.remove("server_down");
  //   };
  // }, []);
  //

  // idle timer setting
  const idleTimer = useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 60, // 1hr idle
    promptTimeout: 0,
    events: [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
      "MSPointerDown",
      "MSPointerMove",
      "visibilitychange",
    ],
    immediateEvents: [],
    debounce: 0,
    throttle: 0,
    eventsThrottle: 200,
    element: document,
    startOnMount: true,
    startManually: false,
    stopOnIdle: false,
    crossTab: true,
    name: "idle-timer",
    syncTimers: 0,
    leaderElection: false,
  });

  return (
    <ThemeProvider>
      {/* <AuthSessionProvider> */}
        <WordTransformerProvider>
          <ShortCodeProvider>
            <BillSettingProvider>
              <SocketProvider>
                <Router />
              </SocketProvider>
            </BillSettingProvider>
          </ShortCodeProvider>
        </WordTransformerProvider>
      {/* </AuthSessionProvider> */}
    </ThemeProvider>
  );
};
export default App;
/* eslint-enable */
