import { lazy, Suspense, useEffect, useMemo } from "react";
import useAuth from "../utils/hooks/useAuth";
import secureLocalStorage from "react-secure-storage";
import { useDispatch, useSelector } from "react-redux";
import { checkUserToken, getUserInfo } from "../redux/thunks/authUser";
import Loading from "../components/erp-loading/erp-loader";
import Layout from "./Index";

const FinalLayout = () => {
  const dispatch = useDispatch();
  const { authenticated } = useAuth();

  // useEffect(() => {
  //   const token = secureLocalStorage.getItem("pref")?.token;
  //   if (token) {
  //     dispatch(checkUserToken());
  //   }
  // }, []);

  // useEffect(() => {
  //   const loginpref = secureLocalStorage.getItem("pref")?.pref;
  //   if (loginpref) {
  //     dispatch(getUserInfo(loginpref));
  //   }
  // }, []);

  const AppLayout = useMemo(() => {
    if (!!authenticated) {
      return <Layout />;
    }
    return lazy(() => import("./Index-nosidebar"));
  }, [authenticated]);

//   useEffect(() => {
//   if (localStorage.getItem("auth_ready") === "true") {
//     localStorage.removeItem("auth_ready");
//   }
// }, []);

  return (
    <Suspense
      fallback={
        <div className="flex flex-auto flex-col h-[100vh]">
          <Loading loading={true} />
        </div>
      }
    >
      <AppLayout />
    </Suspense>
  );
};

export default FinalLayout;
