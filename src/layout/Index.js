import React, { useEffect, useState, useRef, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Head from "./head/Head";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import AppRoot from "./global/AppRoot";
import AppMain from "./global/AppMain";
import AppWrap from "./global/AppWrap";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

import secureLocalStorage from "react-secure-storage";
import { useDispatch } from "react-redux";
import {
  checkUserToken,
  getNotifications,
  getUserInfo,
} from "../redux/thunks/authUser";
import { getAccessBranches } from "../redux/thunks/coreComponent";
import MenuHeader from "./menu-header/Header";
import { useTheme } from "./provider/Theme";
import { useSocket } from "../contexts/SocketContext";
// import useAuth from "../utils/hooks/useAuth";
import Loading from "../components/erp-loading/erp-loader";

const Layout = ({ title }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = secureLocalStorage.getItem("pref")?.token;
  // const { authenticated,setBootComplete } = useAuth();
  const loginpref = secureLocalStorage?.getItem("pref")?.pref;

  const [deviceID, setDeviceID] = useState(null);

  const socket = useSocket();

  // Generate Device ID on Mount
  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceID(result.visitorId);
    };
    loadFingerprint();
  }, []);

  // Check user token when device ID and token exist
  useEffect(() => {
    const tokenReady = localStorage.getItem("auth_ready") === "true";
    if (deviceID && !!token) {
      dispatch(checkUserToken({ deviceID }));
    }
  }, [deviceID, token, dispatch]);

  // useEffect(() => {
  //   const token = secureLocalStorage.getItem("pref")?.token;
  //   const tokenReady = localStorage.getItem("auth_ready") === "true";
  //   if (!!token ) {
  //     dispatch(checkUserToken());
  //   }
  // }, [dispatch]);

  // Redirect to login if token missing
  useEffect(() => {
    if (!token) {
      navigate(`${process.env.PUBLIC_URL}/auth/login`);
    }
  }, [token, navigate]);

  // Fetch User Info & Branches after loginpref is available
  // useEffect(() => {
  //   if (!loginpref) {
  //     window.location.reload(true);
  //   } else {
  //     dispatch(getUserInfo(loginpref));
  //     dispatch(getNotifications(loginpref));
  //     dispatch(getAccessBranches(loginpref));
  //   }
  // }, [loginpref, dispatch]);

  useEffect(() => {
    const loginpref = secureLocalStorage.getItem("pref")?.pref;
    const tokenReady = localStorage.getItem("auth_ready") === "true";
    if (!!loginpref ) {
      dispatch(getUserInfo(loginpref));
      dispatch(getNotifications(loginpref));
      dispatch(getAccessBranches(loginpref));
      // setBootComplete(true);
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchNotifications = () => {
      const loginpref = secureLocalStorage.getItem("pref")?.pref;
      if (loginpref) {
        dispatch(getNotifications(loginpref));
      }
    };

    fetchNotifications(); // Initial call on mount

    const intervalId = setInterval(fetchNotifications, 60000); // Every 60,000 ms = 1 minute

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [dispatch]);


  useEffect(() => {
    const loginpref = secureLocalStorage.getItem("pref")?.pref;
    socket.on("update_notification", (data) => {
      // console.log("🔔 New notification:", data);
      dispatch(getNotifications(loginpref));
    });

    return () => {
      socket.off("update_notification");
    };
  }, [socket, dispatch]);

  // useEffect(() => {
  //   // 1. Connect to socket server
  //   const socket = io("http://127.0.0.1:8001", {
  //     transports: ["websocket"], // Force websocket
  //     upgrade: false, // Disable upgrading from polling to websocket
  //   });

  //   socket.on("connect", () => {
  //     console.log("✅ Connected to socket server!", socket.id);
  //   });

  //   // 2. Listen for the event from backend
  //   socket.on("update_notification", (data) => {
  //     dispatch(getNotifications(loginpref));
  //     console.log("New notification arrived", data);
  //   });
  //   // socket.on("new_estimation_created", (data) => {
  //   //   console.log("🎉 New estimation received from server message:", data);
  //   // });

  //   socket.on("connect_error", (err) => {
  //     console.error("❌ Socket connection error:", err.message);
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("❌ Disconnected from socket server");
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return (
    <>
      <Head title={title || "Loading"} />
      <Suspense
        fallback={
          <div className="flex flex-auto flex-col h-[100vh]">
            <Loading loading={true} />
          </div>
        }
      >
        <AppRoot>
          {theme.menuStyle === 2 ? (
            <AppMain>
              {theme.sidebarMobile && <Sidebar fixed />}
              <AppWrap>
                {!theme.sidebarMobile && <MenuHeader fixed />}
                <Header fixed={!!theme.sidebarMobile} />
                <Outlet />
                <Footer />
              </AppWrap>
            </AppMain>
          ) : (
            <AppMain>
              <Sidebar fixed />
              <AppWrap>
                <Header fixed />
                <Outlet />
                <Footer />
              </AppWrap>
            </AppMain>
          )}
        </AppRoot>
      </Suspense>
    </>
  );
};

export default Layout;
