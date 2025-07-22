import React, { useEffect, useRef, useState } from "react";
import { Card } from "reactstrap";
import { Block, Icon } from "../../../components/Component";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import sdslogo from "../../../images/sdslogo.jpg";
import SchemeAbstractTable from "../../../components/reports-print/SchemeAbstractTable";
import styled from "styled-components";
import moment from "moment";

export const Styles = styled.div`
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

const SchemeAbstractPrint = () => {
  // const columns = location?.state?.columns;
  // const data = location?.state?.data;
  // const companyName = location?.state?.company_name;
  // const modewiseData = location?.state?.modewiseData;
  // const tableRef = useRef();
  // const componentRef = useRef();

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyMobile, setCompanyMobile] = useState("");
  const [startDate, SetStartDate] = useState();
  const [endDate, SetEndDate] = useState();
  const [modewiseData, setModewiseData] = useState([]);
  const componentRef = useRef();
  const tableRef = useRef();

  // console.log(columns);
  // console.log(data);

  useEffect(() => {
    const schemeAbstractData = JSON.parse(localStorage.getItem("schemeAbstractData"));
    if (schemeAbstractData) {
      setColumns(schemeAbstractData.columns);
      setData(schemeAbstractData.data);
      setCompanyName(schemeAbstractData.company_name);
      setCompanyAddress(schemeAbstractData.company_address);
      setCompanyMobile(schemeAbstractData.comapny_mobile);
      SetStartDate(schemeAbstractData.fromDate);
      SetEndDate(schemeAbstractData.toDate);
      setModewiseData(schemeAbstractData.modewiseData);
    }
    const printStyle = document.createElement("style");
    printStyle.innerHTML = `
   
      @page {
        size: Legal landscape; /* Set the paper size to Legal (8.5 x 14 inches) */
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
  // }, [columns, data]);

  return (
    <body className="bg-white">
      <Head title="Invoice Print"></Head>
      <Content>
        <Block>
          <div>
            <div>
              {/* <Button
                size="lg"
                color="primary"
                outline
                className="btn-icon btn-white btn-dim"
                onClick={() => window.print()}
              >
                <Icon name="printer-fill"></Icon>
              </Button> */}
            </div>
            <div ref={componentRef}>
              <div className="invoice-brand text-center">
                <img src={sdslogo} alt="" style={{ height: "157px", width: "150px" }} />
              </div>
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
                    <h6 className=" text-sm">Scheme Abstract</h6>
                  </div>

                  <div className="card-inner">
                    <div className="mt-6">
                      <SchemeAbstractTable
                        ref={tableRef}
                        modeWiseCollectionReportList={modewiseData}
                        schemeAbstractReportList={data}
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

export default SchemeAbstractPrint;
