import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, CardTitle, Table } from "reactstrap";
import "../crm/Dashboard.css"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";

const GreenTag = () => {
    return (
        <Card className="shadow-sm">
            <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-warning text-white rounded-top">
                <div className="card-title-group">
                    <CardTitle>
                        <h6 className="title mb-0">
                            <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                            Green Tag
                        </h6>
                    </CardTitle>
                </div>
                <div className="card-tools">
                    <button className="btn btn-sm btn-light">View All</button>
                </div>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th className="text-left">#</th>
                        <th className="text-center">Tags</th>
                        <th className="text-right">Weight</th>
                        <th className="text-right">Amount</th>
                        <th className="text-right">Incentive</th>
                    </tr>
                </thead>
                <tbody>
                    {trafficData?.map((item) => (
                        <tr key={item.id}>
                            <td className="text-left">{item.name}</td>
                            <td className="text-center text-info">{item.tags}</td>
                            <td className="text-center text-warning">{item.weight}</td>
                            <td className="text-right text-warning">{item.amt}</td>
                            <td className="text-right text-warning">{item.incentive}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card >
    );
};

export default GreenTag;

export const trafficData = [
    {
        id: 1,
        name: "Gold",
        tags: "213",
        weight: "3420",
        amt: "156000",
        incentive: "329",
    },
    {
        id: 2,
        name: "Silver",
        tags: "213",
        weight: "3420",
        amt: "156000",
        incentive: "329",
    },
    {
        id: 3,
        name: "Diamond",
        tags: "213",
        weight: "3420",
        amt: "156000",
        incentive: "329",
    },
    {
        id: 4,
        name: "MRP",
        tags: "213",
        weight: "3420",
        amt: "156000",
        incentive: "329",
    },
    {
        id: 5,
        name: "Total",
        tags: "213",
        weight: "3420",
        amt: "156000",
        incentive: "329",
    },
];
