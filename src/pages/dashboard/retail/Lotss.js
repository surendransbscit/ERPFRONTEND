import "../crm/Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../components/Component";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from "reactstrap";
import { getLot } from "../../../redux/thunks/retailDashboard";
import { useNavigate } from "react-router";

const Lotss = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { lotDashList } = useSelector((state) => state.retailDashboardReducer);

  const [days, SetDays] = useState("4");
  useEffect(() => {
    dispatch(getLot({ view: days }));
  }, [dispatch, days]);

  // console.log(lotDashList);
   let total_rec_pcs = 0;
   let total_rec_wt = 0;
   let total_tag_pcs = 0;
   let total_tag_wt = 0;
   let total_bal_pcs = 0;
   let total_bal_wt = 0;

  return (
    <Card className="shadow-sm">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-warning text-white rounded-top"
      
      >
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Lots
            </h6>
          </CardTitle>
        </div>
        <div className="card-tools">
          <div className="card-tools">
            <UncontrolledDropdown>
              <DropdownToggle
                tag="a"
                href="#toggle"
                onClick={(ev) => ev.preventDefault()}
                className="dropdown-toggle btn btn-icon btn-trigger"
              >
                <Icon name="more-h text-white" />
              </DropdownToggle>
              <DropdownMenu end className="dropdown-menu-sm">
                <ul className="link-list-opt no-bdr">
                    <li className={days == "4" ? "active" : ""}>
                                                          <DropdownItem
                                                              tag="a"
                                                              href="#dropdown"
                                                              onClick={(ev) => {
                                                                  ev.preventDefault();
                                                                  SetDays("4");
                                                              }}
                                                          >
                                                              <span>Today</span>
                                                          </DropdownItem>
                                                      </li>
                                                      <li className={days == "5" ? "active" : ""}>
                                                          <DropdownItem
                                                              tag="a"
                                                              href="#dropdown"
                                                              onClick={(ev) => {
                                                                  ev.preventDefault();
                                                                  SetDays("5");
                                                              }}
                                                          >
                                                              <span>Yesterday</span>
                                                          </DropdownItem>
                                                      </li>
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
        </div>
      </div>
      <div style={{ maxHeight: "300px", overflowY: "auto", cursor:"pointer" }}>
      <Table bordered className="text-center">
        <thead>
          {/* <tr>
            <th colSpan="1"></th>
            <th colSpan="2">Gold</th>
            <th colSpan="2">Silver</th>
          </tr>
          <tr>
            <th></th>
            <th>Pcs</th>
            <th>Weight</th>
            <th>Pcs</th>
            <th>Weight</th>
          </tr> */}
                    <tr>
                        <th className="text-left">#</th>
                        <th className="text-right">Rec Pcs</th>
                        <th className="text-right">Rec Wt</th>
                        <th className="text-right">Tagged Pcs</th>
                        <th className="text-right">Tagged Wt</th>
                        <th className="text-right">Bal Pcs</th>
                        <th className="text-right">Bal Wt</th>
                    </tr>
        </thead>
        <tbody>
        {lotDashList?.length > 0 ? (
                        <>
           
          {lotDashList.map((row, index) => {
            total_rec_pcs += parseFloat(row.rev_pieces)
            total_rec_wt += parseFloat(row.rev_weight)
            total_tag_pcs += parseFloat(row.tag_pieces)
            total_tag_wt += parseFloat(row.tag_weight)
            total_bal_pcs += parseFloat(row.balance_pcs)
            total_bal_wt += parseFloat(row.balance_gwt)

            return (
              <tr key={index} onClick={() => {
                navigate(
                  {
                    pathname: `${process.env?.PUBLIC_URL}/retail/dashboard/reports/lot`,
                  },
                  {
                    state: {
                      days: days,
                      type:row.id_metal
                    },
                  }
                );
              }}>
                <td  className="text-left" >{row.metal_name}</td>
                <td  className="text-right" >{row.rev_pieces}</td>
                <td  className="text-right">{parseFloat(row.rev_weight).toFixed(3)}</td>
                <td className="text-right">{row.tag_pieces}</td>
                <td className="text-right">{parseFloat(row.tag_weight).toFixed(3)}</td>
                <td  className="text-right">{parseFloat(row.balance_pcs).toFixed(0)}</td>
                <td  className="text-right">{ parseFloat(row.balance_gwt).toFixed(3)}</td>
              </tr>
            )})}
            
            <tr className="bold" >
              <td  className="text-left " >Total</td>
              <td  className="text-right" >{total_rec_pcs}</td>
              <td  className="text-right" >{parseFloat(total_rec_wt).toFixed(3)}</td>
              <td  className="text-right" >{total_tag_pcs}</td>
              <td  className="text-right" >{parseFloat(total_tag_wt).toFixed(3)}</td>
              <td  className="text-right" >{total_bal_pcs}</td>
              <td  className="text-right" >{parseFloat(total_bal_wt).toFixed(3)}</td>

            </tr>

            
             </>
                    ) : (
                        <tr>
                           
                            <td colSpan="7" className="text-center">
                                <h4 style={{ marginTop: "10px", marginBottom: "10px" }}>No record found</h4>
                            </td>
                        </tr>
                    )}
        </tbody>
      </Table>
      </div>
    </Card>
  );
};

export default Lotss;

const data = [
  { label: "Received", gold: { pcs: 2, weight: "150.000" }, silver: { pcs: 2, weight: "150.000" } },
  { label: "Created", gold: { pcs: 2, weight: "2,000.000" }, silver: { pcs: 2, weight: "2,000.000" } },
  { label: "Pending", gold: { pcs: 5, weight: "4.000" }, silver: { pcs: 5, weight: "4.000" } }
];
