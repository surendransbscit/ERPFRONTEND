import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getSchemeSlabWiseAccounts } from "../../../redux/thunks/digiGoldDashboard";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { Icon } from "../../../components/Component";

const userData = [
  { userId: 1042, scherrDays: "45", benefit: "1–76" },
  { userId: 2378, scherrDays: "76–150", benefit: "151–225" },
  { userId: 3166, scherrDays: "151–225", benefit: "0,2.5" },
  { userId: 4289, scherrDays: "435", benefit: "3.5" },
  { userId: 5203, scherrDays: "270", benefit: "3,5" },
];

const UserBenefitTable = () => {
  const dispatch = useDispatch();
  const { schemeSlabWiseAccounts } = useSelector(
    (state) => state.digigoldDashboardReducer
  );
  const [metalType, setMetalType] = useState(1);
  useEffect(() => {
    dispatch(getSchemeSlabWiseAccounts({metalType}));
  }, [dispatch, metalType]);

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-white border-bottom fw-bold">
        User Benefit Tracking
        {/* <div className="d-flex justify-content-end px-2 "> */}
          <UncontrolledDropdown className="flex justify-content-end">
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
                {[
                  { label: "Gold", key: 1 },
                  { label: "Silver", key: 2 },
                ].map((item) => (
                  <li
                    className={metalType === item.key ? "active" : ""}
                    key={item.key}
                  >
                    <DropdownItem
                      tag="a"
                      href="#dropdown"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setMetalType(item.key);
                      }}
                    >
                      <span>{item.label}</span>
                    </DropdownItem>
                  </li>
                ))}
              </ul>
            </DropdownMenu>
          </UncontrolledDropdown>
        {/* </div> */}
      </CardHeader>

      <CardBody className="p-0">
        <div style={{ maxHeight: "231px", overflowY: "auto" }}>
          <Table responsive borderless className="mb-0 text-nowrap">
            <thead className="table-light">
              <tr>
                <th>Scheme</th>
                <th>Slab</th>
                <th>Accounts</th>
                <th>Benefit Amount</th>
                <th>Benefit Weight</th>
              </tr>
            </thead>
            <tbody>
              {schemeSlabWiseAccounts?.length > 0 ? (
                <>
                  {schemeSlabWiseAccounts?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.scheme_name}</td>
                      <td>{item.slab}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.account_count}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {formatCurrencyInINR(item?.bonus_amount)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {parseFloat(item.bonus_weight).toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>No Data Found</tr>
              )}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default UserBenefitTable;
