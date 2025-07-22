import React, { useEffect, useState } from "react";
import { matcherData } from "./MenuReduxMatcher";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Block, Icon, PreviewCard, SaveButton, TooltipComponent, UserAvatar } from "../../components/Component";
import { Table } from "../../components/sds-table/ReactTable";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { Badge, Button, Card, Col, Label, Row } from "reactstrap";
import queryString from "query-string";
import { useSchemes, useProducts } from "../../components/filters/filterHooks";
import moment from "moment";
import styled from "styled-components";
import ReportFilterComponent from "../reports/ReportFilterComponent";
import { useForm } from "react-hook-form";
import DeleteModal from "../../components/modals/DeleteModal";
import CancelModel from "../../components/modals/CancelModel";
import { toastfunc, toastsuccess } from "../../components/sds-toast-style/toast-style";
import axios from "axios";
import { printPayment } from "../../redux/thunks/payment";
import secureLocalStorage from "react-secure-storage";
import PreviewImagesModal from "../../components/modals/PreviewImagesModal";
import FilterSidebar from "../../components/sidebar/FilterSidebar";
import { getCustomerImportantDatesList } from "../../redux/thunks/dashboard";
import UserIcon from "../../images/user.png";

export const Styles = styled.div`
  padding: 2vh 0.75vw;
  table {
    width: 100%;
    border-spacing: 0;
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
      margin: 0;
      padding: 0px 5px;
      border-bottom: 1px solid #e1e1e1;
      border-right: 0px solid black;
      font-size: medium;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

const CustomerImportantDateListing = () => {
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pathName = location?.pathname;
  const day_value = location?.state?.day_value;
  const day_name = location?.state?.day_name;
  // const [page, SetPage] = useState(1);
  // const { pagePermission } = useSelector((state) => state.coreCompReducer);
  // const [itemPerPage, SetItemPerPage] = useState(50);
  // const paginate = (pageNumber) => SetPage(pageNumber);
  const { customerImportantDatesList, isLoading } = useSelector((state) => state.dashboardReducer);

  const columns = [
    { accessor: "sno", Header: "S.No", text_align: "center" },
    { accessor: "name", Header: "Name", text_align: "center" },
    { accessor: "birthday", Header: "Birthday", text_align: "center" },
    { accessor: "wedding", Header: "Wedding", text_align: "center" },
  ];

  // const listingColumns = columns?.map((col) => {
  //   if (col.accessor === "sno") {
  //     return {
  //       ...col,
  //       Cell: ({ cell }) => customerImportantDatesList?.length - cell.row.index,
  //     };
  //   }
  //   if (col.accessor === "name") {
  //     return {
  //       ...col,
  //       Cell: (cell) => (
  //         <div
  //           onClick={() => {
  //             navigate(
  //               {
  //                 pathname: `${process.env.PUBLIC_URL}/master/customer/edit`,
  //               },
  //               {
  //                 state: {
  //                   id: cell.row.original.cus_id,
  //                 },
  //               }
  //             );
  //           }}
  //         >
  //           {cell.row.original.name}
  //         </div>
  //       ),
  //     };
  //   }
  //   return col;
  // });

  useEffect(() => {
    dispatch(getCustomerImportantDatesList({ value: parseInt(day_value) }));
  }, [day_value, dispatch]);

  useEffect(() => {
    if (day_value === undefined) {
      navigate(`${process.env.PUBLIC_URL}/crm/dashboard`);
    }
  }, [day_value, navigate]);
  return (
    <React.Fragment>
      <Head title={day_name ? `${day_name} customer's personal landmark` : "Customer's Personal Landmark"}></Head>
      {/* {pagePermission?.view && ( */}
      <Content>
        <Block>
          {/* <Card className="card-bordered card-preview">
            <Styles>
              <Table
                itemPerPage={itemPerPage}
                SetItemPerPage={SetItemPerPage}
                loading={isLoading}
                showPagination={false}
                columns={listingColumns ? listingColumns : []}
                data={customerImportantDatesList ? customerImportantDatesList : []}
                pageTitle={day_name}
                is_filter_req={false}
                isTotalReq={false}
                allowAdd={false}
                addButtonDisable={false}
                isAddReq={false}
                addPageURL={false}
                isGrouping={false}
                groupingColumns={[]}
              />
            </Styles>
          </Card> */}
          <Card className="card-bordered card-preview">
            <PreviewCard className="h-100 form-control-sm">
              <Row lg={12} className={"form-control-sm"} style={{ marginTop: "0px", marginBottom: "12px" }}>
                <Col md={7}>
                  <div style={{ marginTop: "10px" }}>
                    <h6>Customer Details</h6>
                  </div>
                </Col>
              </Row>
              {customerImportantDatesList?.map((item, idx) => {
                return (
                  <div className="custom-grid mb-3" key={idx}>
                    <Row lg={12} className={"form-control-sm"}>
                      <Col md={4}>
                        <div className="">
                          <Row className="form-group row g-4">
                            <Col lg="4">
                              <div className="form-group">
                                <label className="form-label font-weight-bolder "> Name :</label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-control-wrap">
                                <div>{item?.name}</div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col lg="4">
                              <div className="form-group">
                                <label className="form-label">Mobile :</label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-control-wrap">
                                <div>{item?.mobile}</div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col lg="4">
                              <div className="form-group">
                                <label className="form-label">DOB :</label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-control-wrap">
                                <div>{item?.birthday}</div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col lg="4">
                              <div className="form-group">
                                <label className="form-label">Email :</label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-control-wrap">
                                <div>{item?.email}</div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col lg="4">
                              <div className="form-group">
                                <label className="form-label">City :</label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-control-wrap">
                                <div>{item?.city}</div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="">
                          <Row className="form-group row g-4">
                            <Col lg="5">
                              <div className="form-group">
                                <label className="form-label">Area :</label>
                              </div>
                            </Col>
                            <Col lg="4">
                              <div>{item.area}</div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col lg="5">
                              <div className="form-group">
                                <label className="form-label">Total Acc :</label>
                              </div>
                            </Col>
                            <Col lg="4">
                              <div>
                                <div>{item?.total_accounts}</div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col lg="5">
                              <div className="form-group">
                                <label className="form-label">Date of Wed :</label>
                              </div>
                            </Col>
                            <Col lg="4">
                              <div>{item?.wedding}</div>
                            </Col>
                          </Row>

                          <Row className="form-group row g-4">
                            <Col lg="5">
                              <div className="form-group">
                                <label className="form-label">Credit Pending :</label>
                              </div>
                            </Col>
                            <Col lg="4">
                              <div>44000</div>
                            </Col>
                          </Row>

                          <Row className="form-group row g-4">
                            <Col lg="5">
                              <div className="form-group">
                                <label className="form-label">Advance Pending :</label>
                              </div>
                            </Col>
                            <Col lg="4">
                              <div>74000</div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="">
                          <Row className="form-group row g-4">
                            <Col lg="4">
                              <div className="form-group">
                                <label className="form-label" htmlFor="profimage">
                                  Profile Image :
                                </label>
                              </div>
                            </Col>
                            <Col lg="4">
                              <div className="profile-image">
                                {/* {paymentHistoryList?.customer?.cus_img ? (
                          <div className="img-wrap">
                            <img for="imageUpload" src={paymentHistoryList?.customer?.cus_img} alt="Profile" />
                          </div>
                        ) : ( */}
                                <Col lg="4">
                                  {item?.image == null ? (
                                    <Label for="imageUpload">
                                      <UserAvatar image={UserIcon} className="xl" />
                                    </Label>
                                  ) : (
                                    <Label for="imageUpload">
                                      <UserAvatar image={item?.image} className="xl" />
                                    </Label>
                                  )}
                                </Col>

                                {/* )} */}
                              </div>
                            </Col>
                          </Row>
                        </div>
                        <Row className="form-group row g-4">
                          <Col md={2} className="flex"></Col>
                          <Col md={6} className="flex mt-5">
                            <div className="form-group action_button " style={{ display: "flex" }}>
                              <SaveButton
                                size="md"
                                color="primary"
                                // onClick={handleSubmit(savedata)}
                              >
                                Send Wish
                              </SaveButton>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                );
              })}
            </PreviewCard>
          </Card>
        </Block>
      </Content>
      {/* )} */}
    </React.Fragment>
  );
};

export default CustomerImportantDateListing;
