import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Card, CardTitle, Table } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import "./Dashboard.css";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { getCustomerImportantDates } from "../../../redux/thunks/dashboard";
import { useNavigate } from "react-router";

const Birthdays = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customerImportantDates } = useSelector((state) => state.dashboardReducer);

  useEffect(() => {
    dispatch(getCustomerImportantDates());
  }, [dispatch]);

  return (
    <Card className="shadow-sm border-0">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-info text-white rounded-top">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Customer's Personal Landmark
            </h6>
          </CardTitle>
        </div>
      </div>
      <div style={{ overflowY: "auto" }}>
        <Table className="mb-0">
          <thead>
            <tr>
              <th className="text-left"></th>
              <th className="text-center">Birthdays</th>
              <th className="text-center">Wedding Anniversaries</th>
            </tr>
          </thead>
          <tbody>
            {customerImportantDates?.length > 0 ? (
              <>
                {customerImportantDates?.map((item, idx) => (
                  <tr
                    style={{ cursor: "pointer" }}
                    key={idx}
                    onClick={() => {
                      navigate(
                        {
                          pathname: `${process.env.PUBLIC_URL}/customer/important_dates/list`,
                        },
                        {
                          state: {
                            day_value: item?.value,
                            day_name: item.name,
                          },
                        }
                      );
                    }}
                  >
                    <td className="text-left">{item.name}</td>
                    <td className="text-center text-info">{item.birthday}</td>
                    <td className="text-center text-warning">{item.wedding}</td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td></td>
                <td colSpan="4" className="text-center">
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

export default Birthdays;
