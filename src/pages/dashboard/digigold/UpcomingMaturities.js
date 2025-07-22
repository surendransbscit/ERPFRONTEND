import React, { useEffect } from "react";
import { Card, CardBody, CardHeader, Table } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUpcomingMaturies } from "../../../redux/thunks/digiGoldDashboard";

const UpcomingMaturities = () => {
  const dispatch = useDispatch();
  const { upcomingMaturitiesList } = useSelector(
    (state) => state.digigoldDashboardReducer
  );

  useEffect(() => {
    dispatch(getUpcomingMaturies());
  }, [dispatch]);
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-white border-bottom fw-bold">
        Upcoming Maturity Summary
      </CardHeader>
      <CardBody className="p-0">
        <div style={{ maxHeight: "231px", overflowY: "auto" }}>
          <Table responsive borderless className="mb-0 text-nowrap">
            <thead className="table-light">
              <tr>
                <th>Period</th>
                <th>Customers Maturing</th>
                <th>Gold Bonus</th>
                <th>Silver Bonus</th>
              </tr>
            </thead>
            <tbody>
              {upcomingMaturitiesList?.data?.length > 0 ? (
                <>
                  {upcomingMaturitiesList?.data?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.period}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.customers_maturing}
                      </td>

                      <td style={{ textAlign: "right" }}>
                        {parseFloat(item.total_gold_bonus).toFixed(3)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {parseFloat(item.total_silver_bonus).toFixed(3)}
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

export default UpcomingMaturities;
