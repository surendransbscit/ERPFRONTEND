import React from "react";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown } from "reactstrap";

import Icon from "../../../../components/icon/Icon";
import data from "./NotificationData";
import { useNavigate } from "react-router";

const NotificationItem = (props) => {
  const navigate = useNavigate();
  const { icon, iconStyle, text, time, id, url } = props;
  return (
    <div
      style={{ cursor: "pointer" }}
      className="nk-notification-item"
      key={id}
      id={id}
      onClick={() => {
        navigate(
          {
            pathname: `${process.env.PUBLIC_URL}${url}`,
          }
          // {
          //   state: { add: true },
          // }
        );
      }}
    >
      <div className="nk-notification-icon">
        <Icon name={icon} className={[`icon-circle ${iconStyle ? " " + iconStyle : ""}`]} />
      </div>
      <div className="nk-notification-content">
        <div className="nk-notification-text">{text}</div>
        {/* <div className="nk-notification-time">{time}</div> */}
      </div>
    </div>
  );
};

const Notification = ({ notificationData }) => {
  return (
    <UncontrolledDropdown className="user-dropdown">
      <DropdownToggle tag="a" className="dropdown-toggle nk-quick-nav-icon">
        {notificationData?.length > 0 ? (
          <div className="icon-status icon-status-info">
            <Icon name="bell" />
          </div>
        ) : (
          <div className="icon">
            <Icon name="bell" />
          </div>
        )}
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-xl dropdown-menu-s1">
        <div className="dropdown-head">
          <span className="sub-title nk-dropdown-title">{data.title}</span>
          {/* <a href="#markasread" onClick={(ev) => ev.preventDefault()}>
            Mark All as Read
          </a> */}
        </div>
        <div className="dropdown-body">
          <div className="nk-notification">
            {notificationData?.map((item) => {
              return (
                <NotificationItem
                  key={item.id}
                  id={item.id}
                  icon={item.icon}
                  iconStyle={item.iconStyle}
                  text={item.text}
                  url={item.page_url}
                  // time={item.time}
                />
              );
            })}
          </div>
        </div>
        {/* <div className="dropdown-foot center">
          <a href="#viewall" onClick={(ev) => ev.preventDefault()}>
            View All
          </a>
        </div> */}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default Notification;
