import React from "react";
import { Block, ReactDataTable } from "../../components/Component";
import Content from "../../layout/content/Content";

function LotList() {
  const columns = [
    {
      name: "sno",
      selector: (row) => row.sno,
      sortable: false,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      right: true,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      right: true,
    },
    {
      name: "Gross Weight",
      selector: (row) => row.gross_wt,
      sortable: true,
      right: true,
    },
    {
      name: "Less Weight",
      selector: (row) => row.gross_wt,
      sortable: true,
      right: true,
    },
    {
      name: "Net Weight",
      selector: (row) => row.gross_wt,
      sortable: true,
      right: true,
    },
    {
      name: "Dia Weight",
      selector: (row) => row.gross_wt,
      sortable: true,
      right: true,
    },
    {
      name: "Stone Weight",
      selector: (row) => row.gross_wt,
      sortable: true,
      right: true,
    },
  ];

  const data = [
    {
      sno: "1",
      product: "chain",
      design: "chain",
      sub_design: "chain",
      amount: "6500.00",
      gross_wt: "45.321",
    },
    {
      sno: "2",
      product: "chain",
      design: "chain",
      amount: "4500.00",
      sub_design: "chain",
      gross_wt: "43.999",
    },
    {
      sno: "3",
      product: "chain",
      design: "chain",
      sub_design: "chain",
      amount: "4500.00",
      gross_wt: "30.000",
    },
    {
      sno: "4",
      product: "chain",
      design: "chain",
      sub_design: "chain",
      amount: "4500.00",
      gross_wt: "30.000",
    },
    {
      sno: "5",
      product: "chain",
      design: "chain",
      sub_design: "chain",
      amount: "4500.00",
      gross_wt: "30.000",
    },
    {
      sno: "6",
      product: "chain",
      design: "long chain",
      sub_design: "bombay chain",
      amount: "4500.00",
      gross_wt: "30.000",
    },
    {
      sno: "7",
      product: "chain",
      design: "long chain",
      sub_design: "bombay chain",
      amount: "4500.00",
      gross_wt: "30.000",
    },
    {
      sno: "8",
      product: "chain",
      design: "long chain",
      sub_design: "bombay chain",
      amount: "4500.00",
      gross_wt: "30.000",
    },
    {
      sno: "9",
      product: "chain",
      design: "long chain",
      sub_design: "bombay chain",
      amount: "4500.00",
      gross_wt: "30.000",
    },
    {
      sno: "9",
      product: "chain",
      design: "long chain",
      sub_design: "bombay chain",
      amount: "4500.00",
      gross_wt: "30.000",
    },
    {
      sno: "9",
      product: "chain",
      design: "long chain",
      sub_design: "bombay chain",
      amount: "4500.00",
      gross_wt: "30.000",
    },
    {
      sno: "9",
      product: "chain",
      design: "long chain",
      sub_design: "bombay chain",
      amount: "4500.00",
      gross_wt: "30.000",
    },

    {
      sno: "9",
      product: "chain",
      design: "long chain",
      sub_design: "bombay chain",
      amount: "4500.00",
      gross_wt: "30.000",
    },
  ];

  return (
    <Content>
      <Block>
        <ReactDataTable
          columns={columns}
          data={data}
          selectableRows={false}
          pagination={true}
          expandableRows
          actions={true}
          fixedHeader={true}
        />
      </Block>
    </Content>
  );
}

export default LotList;
