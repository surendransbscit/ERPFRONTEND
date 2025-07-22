import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createStockIssueType,
  getStockIssueTypeById,
  updateStockIssueTypeById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Icon,
  NumberInputField,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const StockIssueTypeForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.stockIssueTypeReducer
  );
  const { stockIssueTypeInfo } = useSelector(
    (state) => state.stockIssueTypeReducer
  );

  const [name, setName] = useState();
  const [active, setActive] = useState(true);

  const { transformWord } = useContext(WordTransformerContext);
  const [reduce, setReduce] = useState(1);

  const postData = async () => {
    const adddata = {
      name,
      is_active: active,
      reduce_in_stock: reduce,
    };
    try {
      await dispatch(createStockIssueType(adddata)).unwrap();
      toastsuccess(name + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/stockissuetype/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      name,
      is_active: active,
      reduce_stock: reduce,
    };

    await dispatch(createStockIssueType(adddata));
    if (isError === false) {
      toastsuccess("Stock Type  Added successfully");
      setName("");
      setActive(true);
      setReduce(1);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getStockIssueTypeById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (stockIssueTypeInfo != undefined && stockIssueTypeInfo != null) {
      setName(stockIssueTypeInfo?.name);
      setActive(stockIssueTypeInfo?.is_active);
      setReduce(stockIssueTypeInfo?.reduce_in_stock === false ? 0 : 1);
      reset();
    }
  }, [stockIssueTypeInfo, reset]);

  const putData = async () => {
    const adddata = {
      name,
      is_active: active,
      reduce_in_stock: reduce,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateStockIssueTypeById(reduxData)).unwrap();
      toastsuccess("pay device Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/stockissuetype/list`);
    } catch (error) {
      console.error(error);
    }

    // await dispatch(updateStockIssueTypeById(reduxData));
    // if (isError === false) {
    //   toastsuccess("pay device Edited successfully");
    //   navigate(`${process.env.PUBLIC_URL}/master/stockissuetype/list`);
    // }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/stockissuetype/list`);
    }
  }, [add, id, navigate]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        if (id !== undefined) {
          handleSubmit(putData)();
        } else {
          handleSubmit(postData)();
        }
      }, 0); // <-- Slight delay after blur
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  return (
    <React.Fragment>
      <Head title={title ? title : "Stock Issue Type"} />
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
            {add !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postAndCreateNew(data, "saveAndNew")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postData(data, "saveAndClose")
                  )}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/master/stockissuetype/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(putData)}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/master/stockissuetype/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"name"}
                    placeholder="Stock Issue Name"
                    value={name}
                    SetValue={(value) => {
                      setName(transformWord(value));
                      clearErrors("name");
                    }}
                    message={errors.name && "Stock Issue name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col md="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="reduce">
                    Reduce Stock
                  </label>
                </div>
              </Col>

              <Col lg="3">
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="reduce_yes"
                          type="radio"
                          name={"reduce"}
                          value={1}
                          className="custom-control-input"
                          checked={reduce == 1}
                          onChange={(e) => {
                            setReduce(1);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="reduce_yes"
                        >
                          Yes
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="reduce_no"
                          type="radio"
                          value={0}
                          name={"reduce"}
                          className="custom-control-input "
                          checked={reduce == 0}
                          onChange={(e) => {
                            setReduce(0);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="reduce_no"
                        >
                          No
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="active">
                    Active
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SwitchInputField
                  register={register}
                  id={"active"}
                  checked={active}
                  SetValue={setActive}
                  name={"active"}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default StockIssueTypeForm;
