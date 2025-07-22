import React, { useEffect, useState } from "react";
import { Card, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Icon } from "../../../components/Component";
import { useDispatch, useSelector } from "react-redux";
import { getStoreStatistics } from "../../../redux/thunks/retailDashboard";

const Statistics = () => {
  const dispatch = useDispatch();
  const { storeStatisticsDashList } = useSelector((state) => state.retailDashboardReducer);
  const [days, SetDays] = useState();
  useEffect(() => {
    dispatch(getStoreStatistics({ view: days }));
  }, [dispatch, days]);

  return (
    <Card className="h-100">
      <div className="card-inner">
        <div className="card-title-group mb-2">
          <div className="card-title">
            <h6 className="title"> Statistics</h6>
          </div>
          {/* <div className="card-tools">
            <div className="card-tools">
              <UncontrolledDropdown>
                <DropdownToggle
                  tag="a"
                  href="#toggle"
                  onClick={(ev) => ev.preventDefault()}
                  className="dropdown-toggle btn btn-icon btn-trigger"
                >
                  <Icon name="more-h text-black" />
                </DropdownToggle>
                <DropdownMenu end className="dropdown-menu-sm">
                  <ul className="link-list-opt no-bdr">
                    <li className={days == "2" ? "active" : ""}>
                      <DropdownItem
                        tag="a"
                        href="#dropdown"
                        onClick={(ev) => {
                          ev.preventDefault();
                          SetDays("2");
                        }}
                      >
                        <span>This Week</span>
                      </DropdownItem>
                    </li>
                    <li className={days == "1" ? "active" : ""}>
                      <DropdownItem
                        tag="a"
                        href="#dropdown"
                        onClick={(ev) => {
                          ev.preventDefault();
                          SetDays("1");
                        }}
                      >
                        <span>This Month</span>
                      </DropdownItem>
                    </li>
                    <li className={days == "3" ? "active" : ""}>
                      <DropdownItem
                        tag="a"
                        href="#dropdown"
                        onClick={(ev) => {
                          ev.preventDefault();
                          SetDays("3");
                        }}
                      >
                        <span>Last Month</span>
                      </DropdownItem>
                    </li>
                  </ul>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div> */}
        </div>
        <ul className="nk-store-statistics">
          <li className="item">
            <div className="info">
              <div className="title">Accounts</div>
              <div className="count">{storeStatisticsDashList?.account}</div>
            </div>
            <Icon name="bag" className="bg-primary-dim"></Icon>
          </li>
          <li className="item">
            <div className="info">
              <div className="title">Credit Pending B2B</div>
              <div className="count">{storeStatisticsDashList?.credit_pending_b2b}</div>
            </div>
            <Icon name="users" className="bg-info-dim"></Icon>
          </li>
          <li className="item">
            <div className="info">
              <div className="title">Credit Pending B2C</div>
              <div className="count">{storeStatisticsDashList?.credit_pending_b2c}</div>
            </div>
            <Icon name="box" className="bg-pink-dim"></Icon>
          </li>
          <li className="item">
            <div className="info">
              <div className="title">Customers</div>
              <div className="count">{storeStatisticsDashList?.customer}</div>
            </div>
            <Icon name="server" className="bg-purple-dim"></Icon>
          </li>
          {storeStatisticsDashList?.stock?.map((item, index) => {
            return (
              <li className="item" key={index}>
                <div className="info">
                  <div className="title">{item?.metal_name}</div>
                  <div className="count">{item?.pieces}</div>
                </div>
                <Icon name="box" className="bg-purple-dim"></Icon>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
};
export default Statistics;


