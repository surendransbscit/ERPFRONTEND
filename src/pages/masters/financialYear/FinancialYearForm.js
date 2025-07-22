import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
  DateInputField,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createFinancialYear,
  getFinancialYearById,
  updateFinancialYearById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Icon,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import moment from "moment";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const FinancialYearForm = () => {
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
    (state) => state.financialYearReducer
  );
  const { financialYearInfo } = useSelector(
    (state) => state.financialYearReducer
  );

  const [fin_year_name, setFinYearName] = useState();
  const [fin_year_code, setFinYearCode] = useState();
  const [fin_year_from, setFinYearFrom] = useState(new Date());
  const [fin_year_to, setFinYearTo] = useState(new Date());
  // const [active, setActive] = useState(true);
  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      fin_year_name,
      fin_year_code,
      fin_year_from: moment(fin_year_from).format("YYYY-MM-DD"),
      fin_year_to: moment(fin_year_to).format("YYYY-MM-DD"),
      // fin_status: active,
    };
    try {
      await dispatch(createFinancialYear(adddata)).unwrap();
      toastsuccess("Financial year " + fin_year_name + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/financialyear/list`);
    } catch (error) {
      console.error(error);
    }

    // await dispatch(createFinancialYear(adddata));
    // if (isError === false) {
    //   toastsuccess(fin_year_name + " Added successfully");
    //   navigate(`${process.env.PUBLIC_URL}/master/financialyear/list`);
    // }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      fin_year_name,
      fin_year_code,
      fin_year_from: moment(fin_year_from).format("YYYY-MM-DD"),
      fin_year_to: moment(fin_year_to).format("YYYY-MM-DD"),
      // fin_status: active,
    };
    try {
      await dispatch(createFinancialYear(adddata)).unwrap();
      toastsuccess("financial Year Added successfully");
      setFinYearCode("");
      setFinYearName("");
      setFinYearFrom(new Date());
      setFinYearTo(new Date());
      // setActive(true);
    } catch (error) {
      console.error(error);
    }

    // await dispatch(createFinancialYear(adddata));
    // if (isError === false) {
    //   toastsuccess("financial Year Added successfully");
    //   setFinYearCode("");
    //   setFinYearName("");
    //   setFinYearFrom(new Date());
    //   setFinYearTo(new Date());
    //   setActive(true);
    // }
  };

  useEffect(() => {
    id !== undefined && dispatch(getFinancialYearById(id));
  }, [dispatch, id]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    financialYearInfo != undefined &&
      (setFinYearName(financialYearInfo?.fin_year_name),
        setFinYearCode(financialYearInfo?.fin_year_code),
        setFinYearFrom(moment(financialYearInfo?.fin_year_from).toDate()),
        setFinYearTo(moment(financialYearInfo?.fin_year_to).toDate()),
        // setActive(financialYearInfo?.fin_status),
        reset());
  }, [financialYearInfo, reset]);

  const putData = async () => {
    const adddata = {
      fin_year_name,
      fin_year_code,
      fin_year_from: moment(fin_year_from).format("YYYY-MM-DD"),
      fin_year_to: moment(fin_year_to).format("YYYY-MM-DD"),
      // fin_status: active,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateFinancialYearById(reduxData)).unwrap();
      toastsuccess("Financial Year Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/financialyear/list`);
    } catch (error) {
      console.error(error);
    }

    // await dispatch(updateFinancialYearById(reduxData));
    // if (isError === false) {
    //   toastsuccess("Financial Year Edited successfully");
    //   navigate(`${process.env.PUBLIC_URL}/master/financialyear/list`);
    // }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/financialyear/list`);
    }
  }, [add, id, navigate]);

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (id !== undefined) {
      handleSubmit(putData)();
    } else {
      handleSubmit(postData)();
    }
  },{
    enableOnFormTags: true, // Enable hotkeys inside input fields
    preventDefault: true, // Prevent default browser Save
  });


  return (
    <React.Fragment>
      <Head title={title ? title : "Financial Year"} />
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
                {/* <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(postAndCreateNew)}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton> */}
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(postData)}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>
                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/master/financialyear/list`
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
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>
                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/master/financialyear/list`
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
                  <label className="form-label" htmlFor="site-name">
                    Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"fin_year_name"}
                    placeholder="Financial Year Name"
                    value={fin_year_name}
                    SetValue={(value) => {
                      setFinYearName(transformWord(value));
                      clearErrors("fin_year_name");
                    }}
                    message={
                      errors.fin_year_name && " financial yr name is Required"
                    }
                  />
                </div>
              </Col>

              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="pincode">
                    Code <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <TextInputField
                  register={register}
                  isRequired={true}
                  id={"fin_year_code"}
                  placeholder="Financial Year Code"
                  value={fin_year_code}
                  SetValue={(value) => {
                    setFinYearCode(value);
                    clearErrors("fin_year_code");
                  }}
                  message={
                    errors.fin_year_code && " financial yr code is Required"
                  }
                />
              </Col>

              {/* <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="active">
                    Active
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <SwitchInputField
                  register={register}
                  id={"active"}
                  checked={active}
                  SetValue={setActive}
                  name={"active"}
                />
              </Col> */}
            </Row>


            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="fromdate">
                    From Date
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <DateInputField
                  id={"fin_year_from"}
                  maxDate={new Date()}
                  showYearDropdown={true}
                  showMonthDropdown={true}
                  selected={fin_year_from}
                  SetValue={setFinYearFrom}
                />
              </Col>

              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="todate">
                    To Date
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <DateInputField
                  maxDate={new Date()}
                  showYearDropdown={true}
                  showMonthDropdown={true}
                  id={"fin_year_to"}
                  selected={fin_year_to}
                  SetValue={setFinYearTo}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default FinancialYearForm;
