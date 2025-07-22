import React, { useState } from "react";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import {
  BlockDes,
  BlockHead,
  Col,
  Icon,
  Row,
} from "../../../../components/Component";
import { LinkList, LinkItem } from "../../../../components/links/Links";
import UserAvatar from "../../../../components/user/UserAvatar";
import { useTheme, useThemeUpdate } from "../../../provider/Theme";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../../../redux/thunks/authUser";
import secureLocalStorage from "react-secure-storage";
// import useAuth from "../../../../utils/hooks/useAuth";

const User = () => {
  // const { signOut } = useAuth();
  const theme = useTheme();
  const dispatch = useDispatch();
  const themeUpdate = useThemeUpdate();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);

  const {
    userInfo: { user },
  } = useSelector((state) => state.authUserReducer);

  const handleSignout = async () => {
    secureLocalStorage.removeItem("pref");
    await dispatch(userLogout());
    window.location.reload();
  };

  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar icon="user-alt" className="sm" />
          <div className="user-info d-none d-md-block">
            <div className="lead-text">{user?.username}</div>
            {/* <div className="user-name dropdown-indicator">{user?.emp_email}</div> */}
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card sm">
            <div className="user-avatar">
              <span>
                {String(user?.emp_firstname)
                  .match(/\b(\w)/g)
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div className="user-info">
              <span className="lead-text">{`${user?.emp_firstname} ${user?.emp_lastname}`}</span>
              {/* <span className="sub-text">{user?.emp_email}</span> */}
            </div>
          </div>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <LinkItem
              link="/user-profile-regular"
              icon="user-alt"
              onClick={toggle}
            >
              View Profile
            </LinkItem>
            <LinkItem
              link="/user-profile-setting"
              icon="setting-alt"
              onClick={toggle}
            >
              Account Setting
            </LinkItem>
            {/* <LinkItem link="/user-profile-activity" icon="activity-alt" onClick={toggle}>
              Login Activity
            </LinkItem> */}
            {/* <li>
              <a
                className={`dark-switch ${theme.skin === "dark" ? "active" : ""}`}
                href="#"
                onClick={(ev) => {
                  ev.preventDefault();
                  themeUpdate.skin(theme.skin === "dark" ? "light" : "dark");
                }}
              >
                {theme.skin === "dark" ? (
                  <>
                    <em className="icon ni ni-sun"></em>
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <em className="icon ni ni-moon"></em>
                    <span>Dark Mode</span>
                  </>
                )}
              </a>
            </li> */}
          </LinkList>
        </div>
        {/* <div className="dropdown-inner">
          <LinkList>
            <BlockHead>
              <BlockDes>
                <p style={{ fontWeight: "700" }}>Menu Style</p>
                <div className="nk-order">
                  <Row className="g-4 align-end">
                    <Col xxl="4">
                      <Row className="g-4">
                        <Col xxl="12" sm="6">
                          <div
                            className="nk-order-ovwg-data "
                            // onClick={() => {
                            //   secureLocalStorage.setItem("skin", "light");
                            //   window.location.reload();
                            // }}
                            style={{
                              padding: "15px 20px",
                              cursor: "pointer",
                              background: "#eee",
                              // border: `2px solid${
                              //   themeskin == "light" ? "#20D1CF" : "gray"
                              // }`,
                              }}
                          ></div>
                            <p className="text-center" style={{ color: "gray", fontSize: "14px" }}>
                              Sidebar Menu
                            </p>
                        </Col>
                        <Col xxl="12" sm="6">
                          <div
                            className="nk-order-ovwg-data"
                            // onClick={() => {
                            //   secureLocalStorage.setItem("skin", "dark");
                            //   window.location.reload();
                            // }}
                            style={{
                              padding: "15px 20px",
                              cursor: "pointer",
                              background: "#000 ",
                              // border: `2px solid${
                              //   themeskin == "dark" ? "#20D1CF" : "gray"
                              // }`,
                              }}
                          ></div>
                            <p className="text-center" style={{ color: "gray", fontSize: "14px" }}>
                              Header Menu
                            </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </BlockDes>
            </BlockHead>
          </LinkList>
        </div> */}

        <div className="dropdown-inner">
          <LinkList>
            <BlockHead>
              <BlockDes>
                <p style={{ fontWeight: "700" }}>Menu Style</p>
                <div className="nk-order">
                  <Row className="g-4 align-end">
                    <Col xxl="4">
                      <Row className="g-4">
                        <Col xxl="12" sm="6">
                          <div
                            className="layout-card"
                            onClick={() => themeUpdate.menuStyle(1)}
                            style={{
                              padding: "20px",
                              cursor: "pointer",
                              background:
                                theme?.menuStyle == 1 ? "#e0dcff" : "#f5f5f5",
                              borderRadius: "8px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <div
                              style={{
                                width: "40px",
                                height: "100%",
                                backgroundColor: "#eee",
                                marginBottom: "8px",
                                borderRadius: "4px",
                              }}
                            />
                            <div
                              style={{
                                width: "100%",
                                height: "10px",
                                backgroundColor: "#ccc",
                                marginBottom: "4px",
                                borderRadius: "4px",
                              }}
                            />
                            <div
                              style={{
                                width: "100%",
                                height: "10px",
                                backgroundColor: "#ccc",
                                marginBottom: "4px",
                                borderRadius: "4px",
                              }}
                            />
                            <p
                              className="text-center"
                              style={{ color: "gray", fontSize: "14px" }}
                            >
                              Sidebar Menu
                            </p>
                          </div>
                        </Col>
                        <Col xxl="12" sm="6">
                          <div
                            className="layout-card"
                            onClick={() => themeUpdate.menuStyle(2)}
                            style={{
                              padding: "20px",
                              cursor: "pointer",
                              background:
                                theme?.menuStyle == 2 ? "#e0dcff" : "#f5f5f5",
                              borderRadius: "8px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "10px",
                                backgroundColor: "#854efe",
                                marginBottom: "8px",
                                borderRadius: "4px",
                              }}
                            />
                            <div
                              style={{
                                width: "100%",
                                height: "10px",
                                backgroundColor: "#ccc",
                                marginBottom: "4px",
                                borderRadius: "4px",
                              }}
                            />
                            <div
                              style={{
                                width: "100%",
                                height: "10px",
                                backgroundColor: "#ccc",
                                marginBottom: "4px",
                                borderRadius: "4px",
                              }}
                            />
                            <p
                              className="text-center"
                              style={{ color: "gray", fontSize: "14px" }}
                            >
                              Header Menu
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </BlockDes>
            </BlockHead>
          </LinkList>
        </div>

        <div className="dropdown-inner">
          {/* <div className="dropdown-inner"> */}
          <LinkList>
            <a role="button" onClick={() => handleSignout()}>
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
