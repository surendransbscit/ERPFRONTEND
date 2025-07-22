import React, { useEffect, useState } from "react";
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
  createBankDeposit,
  getBankDepositById,
  updateBankDepositById,
  getCashBalance
} from "../../../redux/thunks/retailMaster";
import { toastfunc, toastsuccess } from "../../../components/sds-toast-style/toast-style";
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
import { useBranches,useBanks } from "../../../components/filters/filterHooks";
import { BranchDropdown,SelectDropdown } from "../../../components/filters/retailFilters";
import getCurrencySymbol from "../../../components/common/moneyFormat/currencySymbol";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";

const BankDepositForm = () => {
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
  const { isLoading: issubmitting, isError,bankDepositInfo,cashBalanceInfo } = useSelector(
    (state) => state.bankDepositReducer
  );
  const { userInfo } = useSelector((state) => state.authUserReducer);


  const [bank, setBank] = useState();
  const [branch, setBranch] = useState();
  const [amount, setAmount] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);

  const { branches } = useBranches();
  const { banks } = useBanks();

  const postData = async () => {
    const adddata = {
      bank: bank,
      branch: branch,
      amount: amount,
    };
    try {
      await dispatch(createBankDeposit(adddata));
      toastsuccess("Bank Deposit is Saved Successfully");
      navigate(`${process.env.PUBLIC_URL}/master/bank_deposit/list`);
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
      bank: bank,
      branch: branch,
      amount: amount,
    };
    try {
      await dispatch(createBank(adddata));
      toastsuccess("Bank Deposit is Saved Successfully");
      reset();
      setBank();
      setBranch(); 
      setAmount(0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getBankDepositById(id));
  }, [dispatch, id]);

  useEffect(() => {
    console.log("cashBalanceInfo", cashBalanceInfo);
    cashBalanceInfo?.cash_balance !== undefined && setCashBalance(cashBalanceInfo.cash_balance);
  }, [cashBalanceInfo]);

  useEffect(() => {
    bankDepositInfo != undefined &&
      ( setBank(bankDepositInfo.bank),
      setBranch(bankDepositInfo.branch),
      setAmount(bankDepositInfo.amount),
      getCashBalanceDetails(bankDepositInfo.branch),
        reset());
  }, [bankDepositInfo, reset]);

  const putData = async () => {
    const adddata = {
      bank: bank,
      branch: branch,
      amount: amount,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateBankDepositById(reduxData));
      toastsuccess("Bank Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/bank_deposit/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/bank_deposit/list`);
    }
  }, [add, id, navigate]);

  const getCashBalanceDetails = (branch) => {
    dispatch(getCashBalance(branch));
  }

  return (
    <React.Fragment>
      <Head title={title ? title : "Bank Deposit"} />
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
                  {issubmitting ? "Saving" : "Save & Close"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/master/bank_deposit/list`)
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
                    navigate(`${process.env.PUBLIC_URL}/master/bank_deposit/list`)
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="custom-grid">
          <Row md={12} className="form-group row g-4">
            <Col lg="12">  <label className="form-label" htmlFor="bankName"> Cash-In-Hand : <CurrencyDisplay value={cashBalance} />  </label></Col>
          </Row>
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
                  <SelectDropdown
                    register={register}
                    id={"selectBank"}
                    data={banks}
                    selectedValue={bank}
                    onChangeEvent={(value) => {
                      setBank(value);
                      clearErrors("selectBank");
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectBank && "Bank is Required"}
                    valueField = "pk_id"
                    labelField = "bank_name"
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="branch">
                    Branch <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <BranchDropdown
                    register={register}
                    id={"branch"}
                    branches={branches}
                    selectedBranch={branch}
                    onBranchChange={(value) => {
                      setBranch(value);
                      clearErrors("branch");
                      getCashBalanceDetails(value);
                    }}
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.branch && "Branch is Required"}
                  />
                </div>
              </Col>
            </Row>


            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="accNumber">
                    Deposit Amount <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <NumberInputField
                    placeholder="Deposit Amount"
                    id={"depositAmount"}
                    value={amount}
                    isRequired={true}
                    register={register}
                    reqValueError={"This field is required"}
                    SetValue={(value) => {
                      if (cashBalance >= value) {
                        setAmount(value);
                        clearErrors("depositAmount");
                      }else{
                        setAmount(cashBalance);
                        clearErrors("depositAmount");
                        toastfunc("Deposit Amount should be less than Cash Balance");
                      }

                    }}
                    message={
                      errors.depositAmount && " Deposit Amount is required"
                    }
                  />
                </div>
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default BankDepositForm;
