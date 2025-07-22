import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, CardTitle, Table } from "reactstrap";
import "../crm/Dashboard.css"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";

const VirtualSalesTag = () => {
    return (
        <Card className="shadow-sm" style={{ marginTop: "3px" }}>
            <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-secondary text-white rounded-top">
                <div className="card-title-group">
                    <CardTitle>
                        <h6 className="title mb-0">
                            <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                            Virtual Tag Sales
                        </h6>
                    </CardTitle>
                </div>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th className="text-left">#</th>
                        <th className="text-center">Pcs</th>
                        <th className="text-right">weight</th>
                    </tr>
                </thead>
                <tbody>
                    {trafficData?.map((item) => (
                        <tr key={item.id}>
                            <td className="text-left">{item.name}</td>
                            <td className="text-center text-info">{item.pcs}</td>
                            <td className="text-center text-warning">{item.weight}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card >
    );
};

export default VirtualSalesTag;

export const trafficData = [
    {
        id: 1,
        name: "Home",
        weight: "213",
        pcs: "39",
    },
    {
        id: 2,
        name: "Partly",
        weight: "213",
        pcs: "39",
    },
];
