import React, { useRef } from "react";
import classNames from "classnames";
import Toggle from "../sidebar/Toggle";
import Logo from "../logo/Logo";
import User from "./dropdown/user/User";
import Notification from "./dropdown/notification/Notification";
import HeaderSearch from "../header-search/HeaderSearch";
import { useSelector } from "react-redux";
import img from "../../images/record.png";
import { useTheme, useThemeUpdate } from "../provider/Theme";
import Rates from "./dropdown/rates/Rates";
import DayClose from "./dropdown/dayClose/DayClose";
import { Button } from "reactstrap";
import { useBillSettingContext } from "../../contexts/BillSettingContext";
import CategoryRates from "./dropdown/rates/CategoryRates";
import secureLocalStorage from "react-secure-storage";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ fixed, className, ...props }) => {
  const theme = useTheme();
  const themeUpdate = useThemeUpdate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const { userNotification } = useSelector((state) => state.authUserReducer);
  // console.log(userNotification);

  const headerClass = classNames({
    "nk-header": true,
    "nk-header-fixed": fixed,
    [`is-light`]: theme.header === "white",
    [`is-${theme.header}`]:
      theme.header !== "white" && theme.header !== "light",
    [`${className}`]: className,
  });

  const { billSettingType, setBillSettingType } = useBillSettingContext();
  const loginpref = secureLocalStorage.getItem("pref")?.pref;

  const clickTimeoutRef = useRef(null);

  const handleClick = () => {
    clickTimeoutRef.current = setTimeout(() => {}, 250);
  };

  const handleDoubleClick = () => {
    clearTimeout(clickTimeoutRef.current);
    if (billSettingType === 1) {
      setBillSettingType(parseInt(0));
      // toastsuccess("Bill Settings Updated.");
    } else {
      setBillSettingType(parseInt(1));
      // toastsuccess("Bill Settings Updated.");
    }
  };
  return (
    <div className={headerClass}>
      <div className="container-fluid">
        <div className="nk-header-wrap">
          <div className="nk-menu-trigger d-xl-none ms-n1">
            <Toggle
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none ms-n1"
              icon="menu"
              click={themeUpdate.sidebarVisibility}
            />
          </div>
          <div className="nk-header-brand d-xl-none">
            <Logo />
          </div>
          {/* <div className="nk-header-search ms-3 ms-xl-0">
            <span
              className="nk-menu-text"
              style={{ fontSize: "35px", fontWeight: "600", color: "#854fff" }}
            >
              {location?.pathname != undefined
                ? location?.pathname?.split("/")[1]?.toUpperCase()
                : ""}
            </span>
            <span style={{ fontSize: "20px !important", fontWeight: "900",gap:"10px" }}>{userInfo?.user?.entry_date}</span>{" "}

            <HeaderSearch />
          </div> */}

          <div
            className="nk-header-search ms-3 ms-xl-0"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <span
              className="nk-menu-text"
              style={{ fontSize: "35px", fontWeight: "600", color: "#854fff" }}
            >
              {location?.pathname != undefined
                ? location?.pathname?.split("/")[1]?.toUpperCase()
                : ""}
            </span>

            <span style={{ fontSize: "20px", fontWeight: "900",color: "red" }}>
              {userInfo?.user?.entry_date
                ? new Date(userInfo.user.entry_date).toLocaleDateString("en-US")
                : ""}
            </span>

            <HeaderSearch />
          </div>

          <div className="nk-header-menu d-none d-xl-block">
            <span
              className="nk-menu-text"
              style={{ fontSize: "16px", fontWeight: "600", color: "red" }}
            >
              {loginpref?.counter_name}
            </span>
          </div>
          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
              {billSettingType === 0 && (
                <li className="notification-dropdown me-n1">
                  <img src={img} alt="emg" style={{ height: "20px" }} />
                </li>
              )}

              <li
                className="notification-dropdown me-n1"
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
              >
                <Notification
                  notificationData={userNotification?.notifications}
                />
              </li>

              {userInfo?.user?.allow_day_close && (
                <Button color="primary" className="btn-sm">
                  <DayClose />
                </Button>
              )}

              <li className="notification-dropdown me-n1">
                {userInfo?.settings?.metal_rate_type == 1 ? (
                  <CategoryRates />
                ) : userInfo?.settings?.metal_rate_type == 2 ? (
                  <Rates />
                ) : null}
              </li>

              {theme.menuStyle == 1 && (
                <>
                  <li className="user-dropdown">
                    <User />
                  </li>
                </>
              )}
              {theme.menuStyle == 2 && theme.sidebarMobile && (
                <>
                  <li className="notification-dropdown me-n1">
                    <Notification notificationData={userInfo?.notifications} />
                  </li>
                  <li className="user-dropdown">
                    <User />
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
