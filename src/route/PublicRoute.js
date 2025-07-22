import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../utils/hooks/useAuth";

const PublicRoute = () => {
  const { authenticated } = useAuth();
  const location = useLocation();
  // const dispatch = useDispatch()
  // const { isLoading: tokenChecking, checkToken = {} } = useSelector((state) => state.authUserReducer);

  // useEffect(() => {
  //   secureLocalStorage.getItem("pref")?.token && dispatch(checkUserToken());
  // }, []);

  // console.log(checkToken);

  // const authenticated = checkToken?.message?.toLowerCase().includes("logged")

  return authenticated ? <Navigate to={"/"} /> : <Outlet />;
};

export default PublicRoute;
