import React from "react";
import { Col, Icon, Row } from "../../Component";
import { Button, FormGroup, Nav, NavItem, TabContent, TabPane } from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";

const PaymentComponent = ({
  paymentModes,
  checkAmount,
  toggleIconTab,
  SetTabName,
  activeIconTab,
  payAmount,
  SetCardType,
  cardType,
  cardTypeArr,
  SetCardTypeValue,
  NBtypes,
  cardName,
  SetCardName,
  cardNumber,
  SetCardNumber,
  approvalNumber,
  SetApprovalNumber,
  bankName,
  SetBankName,
  bankList,
  SetBankNameValue,
  NBType,
  SetNBType,
  SetNBTypeValue,
  deviceType,
  SetDeviceType,
  paymentDevices,
  isSavePaymentDisabled,
  addpaymentDetails,
  paymentModeDetails,
  deleteItem,
}) => {
  return (
    <Row className="mt-4">
      <Col lg="12">
        {/* <Card> */}
        <Nav tabs>
          {paymentModes?.map((item, idx) => {
            return (
              <>
                <NavItem key={idx}>
                  <NavLink
                    style={{
                      cursor: "pointer",
                    }}
                    tag="a"
                    className={classnames({
                      active: activeIconTab === item.id_mode,
                    })}
                    onClick={(ev) => {
                      ev.preventDefault();
                      toggleIconTab(item.id_mode);
                      SetTabName(item.mode_name);
                    }}
                  >
                    {item.mode_name}
                  </NavLink>
                </NavItem>
              </>
            );
          })}
        </Nav>

        {paymentModes?.map((item, idx) => {
          return (
            <TabContent key={idx} activeTab={activeIconTab}>
              <TabPane tabId={item?.id_mode}>
                <div className="gy-3">
                  <Row className="g-3">
                    <Col lg="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor={`${activeIconTab}payAmount`}>
                          Amount
                        </label>
                        <div className="form-control-wrap">
                          <input
                            // {...register1(`${activeIconTab}payAmount`, {
                            //   required: {
                            //     value: true,
                            //     message: "Amount is required",
                            //   },
                            // })}
                            name={`${activeIconTab}payAmount`}
                            value={payAmount}
                            onChange={(e) => {
                              checkAmount(e.target.value);
                            }}
                            className=" form-control"
                            placeholder="Enter Amount"
                            type="text"
                          />
                          {/* {errors1?.[`${activeIconTab}payAmount`] && (
                        <span className="invalid">This field is required</span>
                      )} */}
                        </div>
                      </div>
                    </Col>
                    {item?.card_name_visibility && (
                      <Col lg="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor={`${activeIconTab}cardType`}>
                            Card Type
                          </label>
                          <div className="form-control-wrap">
                            <select
                              className="form-control form-select"
                              // id={`${activeIconTab}cardType`}
                              // {...register1(`${activeIconTab}cardType`, {
                              //   required: item?.card_name_visibility,
                              // })}
                              value={cardType}
                              onChange={(e) => {
                                SetCardType(e.target.value);
                              }}
                              placeholder="Card Type"
                            >
                              <option label="Select Card Type" value=""></option>
                              {cardTypeArr?.map((item, index) => (
                                <option onClick={() => SetCardTypeValue(item?.label)} key={index} value={item?.value}>
                                  {item?.label}
                                </option>
                              ))}
                            </select>
                            {/* {errors1?.[`${activeIconTab}cardType`] && (
                          <span className="invalid">This field is required</span>
                        )} */}
                          </div>
                        </div>
                      </Col>
                    )}

                    {item?.card_name_visibility && (
                      <Col lg="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor={`${activeIconTab}cardName`}>
                            Card Holder Name
                          </label>
                          <div className="form-control-wrap">
                            <input
                              // {...register1(`${activeIconTab}cardName`, {
                              //   required: {
                              //     value: item?.card_name_visibility,
                              //     message: "Holder name is required",
                              //   },
                              // })}
                              name={`${activeIconTab}cardName`}
                              value={cardName}
                              onChange={(e) => SetCardName(e.target.value)}
                              className="form-control"
                              placeholder="Enter Card Holder Name"
                              type="text"
                            />
                            {/* {errors1?.[`${activeIconTab}cardName`] && (
                          <span className="invalid">This field is required</span>
                        )} */}
                          </div>
                        </div>
                      </Col>
                    )}

                    {item?.card_no_visibility && (
                      <Col lg="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor={`${activeIconTab}cardNum`}>
                            Card Number
                          </label>
                          <div className="form-control-wrap">
                            <input
                              // {...register1(`${activeIconTab}cardNum`, {
                              //   required: {
                              //     value: item?.card_no_visibility,
                              //     message: "Card Number is required",
                              //   },
                              // })}
                              name={`${activeIconTab}cardNum`}
                              value={cardNumber}
                              onChange={(e) => SetCardNumber(e.target.value)}
                              className="form-control"
                              placeholder="Enter Card Number"
                              type="text"
                            />
                            {/* {errors1?.[`${activeIconTab}cardNum`] && (
                          <span className="invalid">This field is required</span>
                        )} */}
                          </div>
                        </div>
                      </Col>
                    )}

                    {item?.approval_no_visibility && (
                      <Col lg="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor={`${activeIconTab}approvalNumber`}>
                            Approval Number
                          </label>
                          <div className="form-control-wrap">
                            <input
                              // {...register1(`${activeIconTab}approvalNumber`, {
                              //   required: {
                              //     value: item?.approval_no_visibility,
                              //     message: "Approval Number is required",
                              //   },
                              // })}
                              name={`${activeIconTab}approvalNumber`}
                              value={approvalNumber}
                              onChange={(e) => SetApprovalNumber(e.target.value)}
                              className="form-control"
                              placeholder="Enter Approval Number"
                              type="text"
                            />
                            {/* {errors1?.[`${activeIconTab}approvalNumber`] && (
                          <span className="invalid">This field is required</span>
                        )} */}
                          </div>
                        </div>
                      </Col>
                    )}

                    {item.bank_visibility && (
                      <Col lg="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor={`${activeIconTab}bankName`}>
                            Bank
                          </label>
                          <div className="form-control-wrap">
                            <select
                              className="form-control form-select"
                              id={`${activeIconTab}bankName`}
                              // {...register1(`${activeIconTab}bankName`, {
                              //   required: item.bank_visibility,
                              // })}
                              value={bankName}
                              onChange={(e) => {
                                SetBankName(e.target.value);
                              }}
                            >
                              <option label="Select Bank" value=""></option>
                              {bankList?.rows?.map((item, index) => (
                                <option
                                  onClick={() => SetBankNameValue(item?.bank_name)}
                                  key={index}
                                  value={item?.id_bank}
                                >
                                  {item?.bank_name}
                                </option>
                              ))}
                            </select>
                            {/* {errors1?.[`${activeIconTab}bankName`] && (
                          <span className="invalid">This field is required</span>
                        )} */}
                          </div>
                        </div>
                      </Col>
                    )}

                    {item?.nb_type_visibility && (
                      <Col lg="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor={`${activeIconTab}NBType`}>
                            Net Banking Type
                          </label>
                          <div className="form-control-wrap">
                            <select
                              className="form-control form-select"
                              id={`${activeIconTab}NBType`}
                              // {...register1(`${activeIconTab}NBType`, {
                              //   required: item?.nb_type_visibility,
                              // })}
                              value={NBType}
                              onChange={(e) => {
                                SetNBType(e.target.value);
                              }}
                            >
                              <option label="Select NB type" value=""></option>
                              {NBtypes?.map((item, index) => (
                                <option onClick={() => SetNBTypeValue(item?.name)} key={index} value={item?.id}>
                                  {item?.name}
                                </option>
                              ))}
                            </select>
                            {/* {errors1?.[`${activeIconTab}NBType`] && (
                          <span className="invalid">This field is required</span>
                        )} */}
                          </div>
                        </div>
                      </Col>
                    )}

                    {item?.device_type_visibility && (
                      <Col lg="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor={`${activeIconTab}deviceType`}>
                            Device Type
                          </label>
                          <div className="form-control-wrap">
                            <select
                              className="form-control form-select"
                              id={`${activeIconTab}deviceType`}
                              // {...register1(`${activeIconTab}deviceType`, {
                              //   required: item?.device_type_visibility,
                              // })}
                              value={deviceType}
                              onChange={(e) => {
                                SetDeviceType(e.target.value);
                              }}
                            >
                              <option label="Select Device Type" value=""></option>
                              {paymentDevices?.map((item, index) => (
                                <option
                                  onClick={() => SetDeviceType(item?.device_name)}
                                  key={index}
                                  value={item?.id_device}
                                >
                                  {item?.device_name}
                                </option>
                              ))}
                            </select>
                            {/* {errors1?.[`${activeIconTab}deviceType`] && (
                          <span className="invalid">This field is required</span>
                        )} */}
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <FormGroup className="mt-2 form-group">
                      <Button
                        disabled={isSavePaymentDisabled}
                        color="primary"
                        size="md"
                        onClick={() => addpaymentDetails()}
                      >
                        Add
                      </Button>
                    </FormGroup>
                  </div>
                </div>
              </TabPane>
            </TabContent>
          );
        })}
        {/* </Card> */}

        {paymentModeDetails?.length != 0 && (
          <div className={"table-responsive overflow-x-auto"}>
            <table
              className="table"
              style={{
                width: "100%",
                border: "solid #00000009",
                marginTop: "15px",
              }}
            >
              <thead className="tb-odr-head">
                <tr>
                  <th style={{ width: "2rem" }} className="p-1 text-capitalize">
                    Action{" "}
                  </th>
                  <th style={{ width: "4rem" }} className="p-1 text-capitalize">
                    S.no
                  </th>
                  <th style={{ width: "4rem" }} className="p-1 text-capitalize">
                    Payment mode
                  </th>

                  <th style={{ width: "4rem" }} className="p-1 text-capitalize">
                    Amount
                  </th>

                  <th style={{ width: "4rem" }} className="p-1 text-capitalize">
                    Card Type
                  </th>
                  <th style={{ width: "4rem" }} className="p-1 text-capitalize">
                    Card Name
                  </th>
                  <th style={{ width: "4rem" }} className="p-1 text-capitalize">
                    Card Number
                  </th>
                  <th style={{ width: "4rem" }} className="p-1 text-capitalize">
                    Approval Number
                  </th>
                  <th style={{ width: "4rem" }} className="p-1 text-capitalize">
                    Bank Name
                  </th>
                  <th style={{ width: "4rem" }} className="p-1 text-capitalize">
                    Net Banking Type
                  </th>
                  <th style={{ width: "4rem" }} className="p-1 text-capitalize">
                    Device Type
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: "serif" }}>
                {paymentModeDetails?.map((obj, idx) => {
                  return (
                    <tr key={obj.id}>
                      <td className="flex">
                        {" "}
                        <div>
                          <Button color="primary" onClick={() => deleteItem(obj?.id)} size="sm">
                            <Icon name="trash-fill"></Icon>
                          </Button>
                        </div>
                      </td>
                      <td className="!plb-1"> {obj?.id != null ? idx + 1 : "-"} </td>
                      <td className="!plb-1"> {obj?.payment_mode_value != null ? obj?.payment_mode_value : "-"} </td>

                      <td className="!plb-1"> {obj?.payment_amount != null ? obj?.payment_amount : "-"} </td>
                      <td className="!plb-1"> {obj?.card_type != null ? obj?.card_type_value : "-"} </td>
                      <td className="!plb-1"> {obj?.card_holder != null ? obj?.card_holder : "-"} </td>

                      <td className="!plb-1"> {obj?.card_no != null ? obj?.card_no : "-"} </td>

                      <td className="!plb-1"> {obj?.payment_ref_number != null ? obj?.payment_ref_number : "-"} </td>
                      <td className="!plb-1"> {obj?.id_bank != null ? obj?.id_bank_value : "-"} </td>
                      <td className="!plb-1"> {obj?.NB_type != null ? obj?.NB_type_value : "-"} </td>
                      <td className="!plb-1"> {obj?.id_pay_device != null ? obj?.pay_device_value : "-"} </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default PaymentComponent;
