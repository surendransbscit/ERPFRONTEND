import "../crm/Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../components/Component";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from "reactstrap";
import { getCashAbstractReport } from "../../../redux/thunks/reports";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";


const CashAbstract = () => {
  const dispatch = useDispatch();
  const { cashAbstractReportList } = useSelector((state) => state.reportReducer);

  const [days, SetDays] = useState("4");

  const { accessBranches } = useSelector((state) => state.coreCompReducer);

  function getDate(value) {
    const now = new Date();  // Get the current date
    let startDate = new Date(now);  // Default to the current date
    let endDate = new Date(now);    // Default to the current date for the end date

    // THIS WEEK
    if (value === 2) {
      // Start of this week (Monday)
      startDate.setDate(now.getDate() - now.getDay() + 1);
      // End of this week (Sunday)
      endDate.setDate(startDate.getDate() + 6);

      // LAST MONTH
    } else if (value === 3) {
      // First day of the current month
      const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      // Last day of the previous month
      const lastDayOfLastMonth = new Date(firstDayOfCurrentMonth);
      lastDayOfLastMonth.setDate(0);  // Set to last day of previous month
      // Start of last month
      startDate = new Date(lastDayOfLastMonth.getFullYear(), lastDayOfLastMonth.getMonth(), 1);
      // End of last month
      endDate = lastDayOfLastMonth;

      // Default: THIS MONTH
    } else if (value === 4) {  // TODAY
      startDate = new Date(now);
      endDate = new Date(now);
    } else if (value === 5) {  // YESTERDAY
      startDate.setDate(now.getDate() - 1);
      endDate.setDate(now.getDate() - 1);
    } else {
      // Start of this month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      // End of this month
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Return the dates as strings in YYYY-MM-DD format
    return {
      from_date: startDate.toISOString().split('T')[0],
      to_date: endDate.toISOString().split('T')[0]
    };
  }



  useEffect(() => {
    let date = getDate(parseInt(days));
    let branch = accessBranches?.map((item) => item.id_branch);
    let postData = { ...date, id_branch: branch }
    dispatch(getCashAbstractReport(postData));
  }, [dispatch, days]);

  return (
    <Card className="shadow-sm">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-warning text-white rounded-top">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Cash Abstract
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

      <Table className="text-center">
        {/* <thead>
           <tr>
            <th className="text-left">#</th>
            <th className="text-right">Amount</th>
          </tr> 
        </thead> */}
        <tbody>
          {cashAbstractReportList?.sales_summary?.length > 0 && cashAbstractReportList?.sales_summary.map((item, rowIndex) => (
            <tr key={rowIndex} >

              <td style={{ "textAlign": "left" }}>{item.lable}</td>

              <td style={{ "textAlign": "right" }}>{<CurrencyDisplay value={item.value} />}</td>


            </tr>
          ))}

          {cashAbstractReportList?.sales_summary?.length > 0 &&
            <tr style={{ fontWeight: 'bold' }}>

              <td style={{ "textAlign": "left" }}>TOTAL</td>

              <td style={{ "textAlign": "right" }} >{<CurrencyDisplay value={cashAbstractReportList?.total_sale_inward} />}</td>

            </tr>
          }



          {cashAbstractReportList?.payment_summary?.length > 0 && cashAbstractReportList?.payment_summary.map((item, rowIndex) => (
            <tr key={rowIndex} >

              <td style={{ "textAlign": "left" }}>{item.lable}</td>

              <td style={{ "textAlign": "right" }}>{<CurrencyDisplay value={item.value} />}</td>

            </tr>
          ))}



          {cashAbstractReportList?.payment_summary?.length > 0 &&
            <tr style={{ fontWeight: 'bold' }}>

              <td style={{ "textAlign": "left" }}>TOTAL</td>

              <td style={{ "textAlign": "right" }} ><CurrencyDisplay value={cashAbstractReportList?.total_payment} /></td>

            </tr>
          }
        </tbody>
      </Table>
    </Card>
  );
};

export default CashAbstract;


