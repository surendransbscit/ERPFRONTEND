import React, { useEffect, useRef, useState } from "react";
import { Block, Icon } from "../../../components/Component";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import sdslogo from "../../../images/sdslogo.jpg";
import CashAbstractTable from "../../../components/reports-print/CashAbstractTable";
import { Card } from "reactstrap";
import styled from "styled-components";
import moment from "moment";

const Styles = styled.div`
  padding: 2vh 0.75vw;
  .table-wrapper {
    overflow-x: auto; /* Enable horizontal scrolling */
    width: 100%;
  }
  table {
    width: 100%;
    min-width: 1000px; /* Ensures scrolling on smaller screens */
    border-spacing: 2px;
    border: 1px solid #e1e1e1;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      border-bottom: 1px solid #e1e1e1;
    }
  }
`;

const CashAbstractPrint = () => {
  // const location = useLocation();
  // const columns = location?.state?.columns;
  // const data = location?.state?.data;
  // const tableRef = useRef();
  // const companyName = location?.state?.company_name;

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyMobile, setCompanyMobile] = useState("");
  const [startDate, SetStartDate] = useState();
  const [endDate, SetEndDate] = useState();
  const componentRef = useRef();
  const tableRef = useRef();

  const calculateTotal = (field, data) => {
    return data.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  useEffect(() => {
    const cashAbstractData = JSON.parse(localStorage.getItem("cashAbstractData"));
    if (cashAbstractData) {
      setColumns(cashAbstractData.columns);
      setData(cashAbstractData.data);
      setCompanyName(cashAbstractData.company_name);
      setCompanyAddress(cashAbstractData.company_address);
      setCompanyMobile(cashAbstractData.comapny_mobile);
      SetStartDate(cashAbstractData.fromDate);
      SetEndDate(cashAbstractData.toDate);
    }

    const printStyle = document.createElement("style");
    printStyle.innerHTML = `
      @page {
        size: A4 landscape; /* Set the paper size to Legal (8.5 x 14 inches) */
      }
    
  `;
    document.head.appendChild(printStyle);

    setTimeout(() => window.print(), 500);

    return () => {
      document.head.removeChild(printStyle);
    };
  }, []);

  // useEffect(() => {
  //   setTimeout(() => window.print(), 500);
  // }, [columns, data, tableRef.current]);

  return (
    <body className="bg-white">
      <Head title="Invoice Print"></Head>
      <Content>
        <Block>
          <div>
            {/* <div className="invoice-action">
              <Button
                size="lg"
                color="primary"
                outline
                className="btn-icon btn-white btn-dim"
                onClick={() => window.print()}
              >
                <Icon name="printer-fill"></Icon>
              </Button>
            </div> */}
            <div>
              {/* <div className="text-center">
                <img src={sdslogo} alt="" style={{ height: "157px", width: "150px" }} />
              </div> */}
              {/* <div className="text-center mb-4">
                <h6 className="text-sm">{companyName}</h6>
              </div> */}
              <div className="text-center ">
                <h4 className=" text-sm">{companyName}</h4>
                <div className="invoice-contact-info" style={{ marginBottom: "10px" }}>
                  <ul className="list-plain">
                    <li>
                      <Icon name="map-pin-fill"></Icon>
                      <span>{companyAddress}</span>
                    </li>
                    <li>
                      <Icon name="call-fill"></Icon>
                      <span>{companyMobile}</span>
                    </li>
                  </ul>
                  <span>Date</span>&nbsp;:&nbsp;{moment(startDate).format("DD.MM.YYYY")}
                  <span> - {moment(endDate).format("DD.MM.YYYY")}</span>
                </div>
              </div>
              <Card className="card-bordered card-preview ">
                <Styles>
                  <div className="text-center ">
                    {/* <h4 className=" text-sm">Shiningdawn Solutions</h4>
                    <div className="invoice-contact-info">
                      <ul className="list-plain">
                        <li>
                          <Icon name="map-pin-fill"></Icon>
                          <span>
                            Coimbatore
                          </span>
                        </li>
                        <li>
                          <Icon name="call-fill"></Icon>
                          <span>9087654321</span>
                        </li>
                      </ul>
                      <span>Date</span>&nbsp;:&nbsp;20.08.2024<span>- 25.10.2024</span>
                    </div> */}
                    <h6 className=" text-sm">Cash Abstract</h6>
                  </div>
                  <div className="card-inner">
                    <div className="mt-6 invoice-bills">
                      <CashAbstractTable
                        ref={tableRef}
                        calculateTotal={calculateTotal}
                        cashAbstractReportList={data}
                        columns={columns}
                      />
                    </div>
                  </div>
                </Styles>
              </Card>
            </div>
          </div>
        </Block>
      </Content>
    </body>
  );
};

export default CashAbstractPrint;
