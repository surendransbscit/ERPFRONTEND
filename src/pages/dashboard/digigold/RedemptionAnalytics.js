import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { LineChart } from '@mui/x-charts/LineChart';

const RedemptionAnalytics = () => {
  // Chart dataset
  const dataset = [
    { x: 0, value: 100 },
    { x: 1, value: 102 },
    { x: 2, value: 108 },
    { x: 3, value: 115 },
    { x: 4, value: 125 },
    { x: 5, value: 135 },
    { x: 6, value: 150 },
    { x: 7, value: 165 },
    { x: 8, value: 180 },
    { x: 9, value: 195 },
    { x: 10, value: 210 },
  ];

  return (
    <Card className="shadow-sm border-0">
      <CardBody>
        <CardTitle tag="h6" className="mb-1">
          Redemption Analytics
        </CardTitle>
        <div className="text-muted small mb-2">
          Redeemed Before vs After Maturity
        </div>
        <LineChart
          dataset={dataset}
          xAxis={[{ dataKey: 'x', label: '', tickLabelStyle: { display: 'none' } }]}
          series={[{ dataKey: 'value', label: '', color: '#205493' }]}
          height={200}
        />
      </CardBody>
    </Card>
  );
};

export default RedemptionAnalytics;
