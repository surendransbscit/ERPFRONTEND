import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createBank,
  getBankById,
  updateBankById,
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
import { useBranches } from "../../../components/filters/filterHooks";
import { BranchDropdown } from "../../../components/filters/retailFilters";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const BankForm = () => {
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
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.bankReducer
  );
  const { bankInfo } = useSelector((state) => state.bankReducer);

  const [bankName, setBankName] = useState();
  const [accName, setAccName] = useState();
  const [accNumber, setAccNumber] = useState();
  const [ifsc_code, setIfscCode] = useState();
  const [upi_id, setUpiId] = useState();
  const [accType, setAccType] = useState("1");
  const [idBranch, setIdBranch] = useState("");

  const { branches } = useBranches();

  const [isActive, setActive] = useState(true);

  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      bank_name: bankName,
      acc_name: accName,
      acc_number: accNumber,
      is_active: isActive,
      ifsc_code,
      upi_id,
      acc_type: accType,
      branch: idBranch,
    };
    try {
      await dispatch(createBank(adddata));
      toastsuccess(bankName + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/bank/list`);
    } catch (error) {
      console.error(error);
    }
  };

  let data = location?.pathname.split("/");
  data[0] = "Home";
  const pathnames = location.pathname.split("/").filter((x) => x);
  const breadoptions = data?.map((obj, i) => {
    const container = {};
    container.name = obj;
    if (data[i] == "Home") {
      container.link = `/`;
    } else {
      container.link = pathnames.slice(0, i).join("/");
    }

    return container;
  });

  const postAndCreateNew = async () => {
    const adddata = {
      bank_name: bankName,
      acc_name: accName,
      acc_number: accNumber,
      is_active: isActive,
      ifsc_code,
      upi_id,
      acc_type: accType,
      branch: idBranch,
    };
    try {
      await dispatch(createBank(adddata));
      toastsuccess(bankName + " Added successfully");
      setBankName("");
      setAccName("");
      setAccNumber("");
      setActive(true);
      setIfscCode();
      setUpiId();
      setAccType("1");
      setIdBranch();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getBankById(id));
  }, [dispatch, id]);

  useEffect(() => {
    bankInfo != undefined &&
      (setBankName(bankInfo?.bank_name),
        setAccName(bankInfo?.acc_name),
        setAccNumber(bankInfo?.acc_number),
        setActive(bankInfo?.is_active),
        setIfscCode(bankInfo?.ifsc_code),
        setUpiId(bankInfo?.upi_id),
        setAccType(bankInfo?.acc_type),
        reset());
  }, [bankInfo, reset]);

  const putData = async () => {
    const adddata = {
      bank_name: bankName,
      acc_name: accName,
      acc_number: accNumber,
      is_active: isActive,
      ifsc_code,
      upi_id,
      acc_type: accType,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateBankById(reduxData));
      toastsuccess("Bank Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/bank/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/bank/list`);
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
      <Head title={title ? title : "Bank"} />
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
                    navigate(`${process.env.PUBLIC_URL}/master/bank/list`)
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
                    navigate(`${process.env.PUBLIC_URL}/master/bank/list`)
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
                  <label className="form-label" htmlFor="bankName">
                    Bank <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"bankName"}
                    placeholder="Bank Name"
                    value={bankName}
                    SetValue={(value) => {
                      setBankName(transformWord(value));
                      clearErrors("bankName");
                    }}
                    message={errors.bankName && " Bank name is required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="accName">
                    Acc <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"accName"}
                    placeholder="Acc Name"
                    value={accName}
                    SetValue={(value) => {
                      setAccName(transformWord(value));
                      clearErrors("accName");
                    }}
                    message={errors.accName && " Acc name is required"}
                  />
                </div>
              </Col>
            </Row>


            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="accNumber">
                    Acc Num <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    placeholder="Bank Account Number"
                    id={"accNumber"}
                    value={accNumber}
                    isRequired={true}
                    register={register}
                    reqValueError={"This field is required"}
                    SetValue={(value) => {
                      setAccNumber(value);
                      clearErrors("accNumber");
                    }}
                    message={
                      errors.accNumber && " Bank account number is required"
                    }
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="ifsc_code">
                    IFSC <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"ifsc_code"}
                    placeholder="Ifsc Code"
                    value={ifsc_code}
                    SetValue={(value) => {
                      setIfscCode(value);
                      clearErrors("ifsc_code");
                    }}
                    message={errors.ifsc_code && "Ifsc Code is required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="upi_id">
                    UPI <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"upi_id"}
                    placeholder="UPI"
                    value={upi_id}
                    SetValue={(value) => {
                      setUpiId(value);
                      clearErrors("upi_id");
                    }}
                    message={errors.upi_id && "Upi is required"}
                  />
                </div>
              </Col>
            </Row>
            <Row className="form-group row g-4">
              <Col md="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="accType">
                    Acc Type
                  </label>
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="savings"
                          type="radio"
                          name={"accType"}
                          value={"1"}
                          className="custom-control-input"
                          checked={accType == "1"}
                          onChange={(e) => {
                            setAccType(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="savings">
                          Savings
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="current"
                          type="radio"
                          value={"2"}
                          name={"accType"}
                          className="custom-control-input "
                          checked={accType == "2"}
                          onChange={(e) => {
                            setAccType(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="current">
                          Current Account
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
                  <label className="form-label" htmlFor="isActive">
                    Active
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SwitchInputField
                  register={register}
                  id={"isActive"}
                  checked={isActive}
                  SetValue={setActive}
                  name={"isActive"}
                />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default BankForm;
