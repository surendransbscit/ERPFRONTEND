import React, { useEffect } from "react";
import { Card, CardTitle } from "reactstrap";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faUser, faIndianRupeeSign, faBalanceScale, faGift } from "@fortawesome/free-solid-svg-icons";
import { getMaturedUnclaimedChits } from "../../../redux/thunks/dashboard";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { useNavigate } from "react-router";

const MaturedUnClaimed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { maturedAndUnclaimedList } = useSelector((state) => state.dashboardReducer);
  useEffect(() => {
    dispatch(getMaturedUnclaimedChits());
  }, [dispatch]);
  return (
    <Card className="h-100 shadow-sm border-0" 
    // style={{ width: "18rem", borderRadius: "10px", background: "#f9f9f9" }}
    >
      <div className="card-inner border-bottom p-4 d-flex justify-content-between align-items-center bg-secondary text-white rounded-top">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Matured & Unclaimed
            </h6>
          </CardTitle>
        </div>
      </div>

      {/* <div className="d-flex">
                <div className="chart-container"> 
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: 10, label: 'Accounts' },
                                    { id: 1, value: 15, label: 'Amount' },
                                    { id: 2, value: 20, label: 'Weight' },
                                    { id: 3, value: 30, label: 'Bonus' },
                                ],
                            },
                        ]}
                        width={280}
                        height={150}
                    />
                </div>


            </div> */}
      <div style={{ maxHeight: "300px", overflowY: "auto" ,cursor:"pointer"}}
      onClick={() => {
        navigate(
          {
            pathname: `${process.env?.PUBLIC_URL}/crm/dashboard/reports/maturedunclaimed`,
          },
          {
            state: {
              days: 1,
            },
          }
        );
      }}
      >
        <div className="card-inner p-2">
          <ul className="list-unstyled mb-0">
            <li className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faUser} className="me-2 text-primary" style={{ fontSize: "1.2rem" }} />
                <span>No of Accounts</span>
              </div>
              <span className="fw-bold">{maturedAndUnclaimedList?.accounts}</span>
            </li>
            <li className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faIndianRupeeSign} className="me-2 text-success" style={{ fontSize: "1.2rem" }} />
                <span>Amount</span>
              </div>
              <span className="fw-bold">{formatCurrencyInINR(maturedAndUnclaimedList?.amount)}</span>
            </li>
            <li className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faBalanceScale} className="me-2 text-warning" style={{ fontSize: "1.2rem" }} />
                <span>Weight</span>
              </div>
              <span className="fw-bold">{maturedAndUnclaimedList?.weight}</span>
            </li>
            <li className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faGift} className="me-2 text-danger" style={{ fontSize: "1.2rem" }} />
                <span>Bonus</span>
              </div>
              <span className="fw-bold">{maturedAndUnclaimedList?.bonus}</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default MaturedUnClaimed;
