import React from "react";
import classNames from "classnames";
import Toggle from "./Toggle";
import Logo from "../logo/Logo";
// import Menu from "../menu/Menu";
// import User from "./dropdown/user/User";
// import Notification from "./dropdown/notification/Notification";
// import InvestmentMenu from "../menu/InvestmentMenu";
// import MobileMenu from "../menu/MobileMenu";
import menu from "../menu/MenuData";
import { Icon } from "../../components/Component";

import { useTheme, useThemeUpdate } from "../provider/Theme";
import Menu from "./Menu";
import MobileMenu from "./MobileMenu";
import User from "../header/dropdown/user/User";

const MenuHeader = ({ fixed, className, ...props }) => {
  const theme = useTheme();
  const themeUpdate = useThemeUpdate();

  const headerClass = classNames({
    "nk-header is-regular": true,
    "nk-header-fixed": fixed,
    [`is-light`]: theme.header === "white",
    [`is-${theme.header}`]: theme.header !== "white" && theme.header !== "light",
    [`${className}`]: className,
  });

  return (
    <div className={headerClass}>
      <div className={`container-fluid `}>
        <div className="nk-header-wrap">
          {/* <div className="nk-menu-trigger me-sm-2 d-lg-none">
            <Toggle className="nk-nav-toggle nk-quick-nav-icon" icon="menu" click={themeUpdate.sidebarVisibility} />
          </div> */}
          <div className="nk-header-brand d-xl-0">
            <Logo />
          </div>
          <div
            className={`nk-header-menu ${theme.sidebarMobile ? "mobile-menu" : ""}  ${
              theme.sidebarVisibility ? "nk-header-active" : ""
            }`}
          >
            {/* <div className="nk-header-mobile">
              <div className="nk-header-brand">
                <Logo />
              </div>
             
            </div> */}
            {theme.sidebarMobile ? <MobileMenu data={menu} /> : <Menu />}
          </div>
          {theme.sidebarVisibility && <div className="nk-header-overlay" onClick={themeUpdate.sidebarVisibility}></div>}
          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
              {/* <li className="user-dropdown">
                <User />
              </li>
              <li className="notification-dropdown me-n1">
                <Notification />
              </li> */}
              <li className="user-dropdown">
                <User />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MenuHeader;
