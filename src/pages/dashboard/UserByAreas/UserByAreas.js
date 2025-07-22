import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import { getUserByAreas } from "../../../redux/thunks/dashboard";

const UserByAreas = () => {
  const dispatch = useDispatch();
  const { userByAreas } = useSelector((state) => state.dashboardReducer);

  useEffect(() => {
    dispatch(getUserByAreas());
  }, [dispatch]);
  return (
    <React.Fragment>
      <div className="card-title-group">
        <div className="card-title card-title-sm">
          <h6 className="title">Users by Areas</h6>
        </div>
        {/* <UncontrolledDropdown>
          <DropdownToggle className="dropdown-indicator btn btn-sm btn-outline-light btn-white">
            {mapState} Days
          </DropdownToggle>
          <DropdownMenu end className="dropdown-menu-xs">
            <ul className="link-list-opt no-bdr">
              <li className={mapState === "7" ? "active" : ""}>
                <DropdownItem
                  tag="a"
                  href="#dropdownitem"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setMapState("7");
                  }}
                >
                  <span>7 Days</span>
                </DropdownItem>
              </li>
              <li className={mapState === "15" ? "active" : ""}>
                <DropdownItem
                  tag="a"
                  href="#dropdownitem"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setMapState("15");
                  }}
                >
                  <span>15 Days</span>
                </DropdownItem>
              </li>
              <li className={mapState === "30" ? "active" : ""}>
                <DropdownItem
                  tag="a"
                  href="#dropdownitem"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setMapState("30");
                  }}
                >
                  <span>30 Days</span>
                </DropdownItem>
              </li>
            </ul>
          </DropdownMenu>
        </UncontrolledDropdown> */}
      </div>
      {userByAreas?.length > 0 ? (
        <div className="analytics-map">
          <table className="analytics-map-data-list mt-4">
            <thead>
              <tr>
                <th>Area</th>
                <th>Customers</th>
                <th style={{ textAlign: "right" }}>Paid Amount</th>
                <th style={{ textAlign: "right" }}>Paid Weight</th>
              </tr>
            </thead>
            <tbody>
              {userByAreas?.map((item) => {
                return (
                  <tr className="analytics-map-data">
                    <td className="country">{item?.area}</td>
                    <td style={{ textAlign: "center" }}>{item?.customers}</td>
                    <td style={{ textAlign: "right" }}>
                      {item?.amount ? <CurrencyDisplay value={item?.amount}/> : <CurrencyDisplay value={0}/>}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {item?.weight ? (item?.weight) : (0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <h4>No records found</h4>
      )}
    </React.Fragment>
  );
};
export default UserByAreas;
