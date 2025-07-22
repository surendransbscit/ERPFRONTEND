import React, { Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Head from "./head/Head";
import secureLocalStorage from "react-secure-storage";
import { useDispatch } from "react-redux";
import { checkUserToken } from "../redux/thunks/authUser";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Loading from "../components/erp-loading/erp-loader";
// import useAuth from "../utils/hooks/useAuth";

const Layout = ({ title, ...props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = secureLocalStorage.getItem("pref")?.token;
  const [deviceID, setDeviceID] = useState();
  // const { authenticated } = useAuth();

  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();

      const result = await fp.get();
      setDeviceID(result.visitorId);
    };

    loadFingerprint();
  }, []);

  useEffect(() => {
    if (deviceID && secureLocalStorage.getItem("pref")?.token) {
      dispatch(checkUserToken({ deviceID: deviceID }));
    }
  }, [token, dispatch, deviceID]);

  useEffect(() => {
    if (secureLocalStorage?.getItem("pref")?.token) {
      navigate(`${process.env.PUBLIC_URL}/`);
    } else {
      navigate(`${process.env.PUBLIC_URL}/auth/login`);
    }
  }, [token, navigate]);

  return (
    <>
      <Head title={!title && "Loading"} />
      <Suspense
        fallback={
          <div>
            <Loading />
          </div>
        }
      >
        <div className="nk-app-root">
          <div className="nk-wrap nk-wrap-nosidebar">
            <div className="nk-content">
              <Outlet />
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
};
export default Layout;
