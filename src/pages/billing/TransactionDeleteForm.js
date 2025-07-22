import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import { toastfunc, toastsuccess } from "../../components/sds-toast-style/toast-style";
import Content from "../../layout/content/Content";
import {
  PreviewCard,
  SaveButton,
} from "../../components/Component";
import {
  Col,
  Row,
} from "../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { deleteTransaction} from "../../redux/thunks/billing";


const TransactionDeleteForm = () => {
  const location = useLocation();
  const {
    register,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading: issubmitting,
  } = useSelector((state) => state.billingReducer);
  
  const updateOption = {
    UpdateTag: { label: "Billing", stock_transfer_edit: 1 },
    UpdateNonTag: { label: "Issue Receipt", stock_transfer_edit: 2 },
  };
    const handleChange = (field, value) => {
    setStockTransferEdit(value);
    console.log(value);
  };
    const [StockTransferEdit, setStockTransferEdit] = useState(1);
  



  const form_submit = async (data, actionType) => {
    console.log("data", data);
    let assignData = []
    try {
      let response = await dispatch(deleteTransaction({"transaction_type":StockTransferEdit})).unwrap();
      toastsuccess(response.data.message)
      reset_form();
    } catch (error) {
      let message = error?.response?.data?.message;
      toastfunc(message);
    }
    

  };



  const reset_form = async () => {
    reset("");
  };



  return (
    <React.Fragment>
      <Head title="Jewel Not Deliver" />
      <Content>
        <PreviewCard className="h-100">

          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb></ModifiedBreadcrumb>
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">

            </Col>
          </Row>


          <div className="custom-grid">
            <Row className="g-3 align-center form-control-sm">
              <Col md={4}>
                <div className="custom-grid">
                  {" "}
                  <div className="form-label">Choose Transaction Type </div>
                  <div
                    className=""
                    style={{ maxHeight: "500px", overflowY: "auto" }}
                  >
                    <ul className="custom-control-group custom-control-vertical w-100">
                      {Object.entries(updateOption)?.map(([key, option]) => (
                        <li key={key}>
                          <div className="custom-control custom-control-sm custom-radio custom-control-pro">
                            <input
                              type="radio"
                              className="custom-control-input"
                              name="stock_transfer_edit"
                              id={key}
                              checked={
                                option.stock_transfer_edit === StockTransferEdit
                                  ? true
                                  : false
                              }
                              {...register(key, { required: false })}
                              onChange={() => {
                                handleChange(key, option.stock_transfer_edit);
                              }}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={key}
                            >
                              <span>{option.label}</span>
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Col>
               <Col md={4}>
               <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="danger"
                  onClick={form_submit}
                >Delete</SaveButton>
                </Col>

           
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default TransactionDeleteForm;
