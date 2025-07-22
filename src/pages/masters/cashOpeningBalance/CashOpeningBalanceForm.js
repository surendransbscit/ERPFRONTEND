/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import { BlockTitle, CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    createCashOpeningBalance,
    getCashOpeningBalanceById,
    updateCashOpeningBalanceById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, NumberInputField, Row, SwitchInputField, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { BranchDropdown } from "../../../components/filters/retailFilters";
import { useBranches } from "../../../components/filters/filterHooks";

const CashOpeningBalanceForm = () => {
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
    const { isLoading: issubmitting, isError } = useSelector((state) => state.cashOpeningBalanceReducer);
    const { cashOpeningBalanceInfo } = useSelector((state) => state.cashOpeningBalanceReducer);

    const [amount, setAmount] = useState();
    const [idBranch, setIdBranch] = useState("");

    const { branches } = useBranches();

    const postData = async () => {
        const adddata = {
            amount,
            branch: idBranch,
        };
        try {
            await dispatch(createCashOpeningBalance(adddata)).unwrap();
            toastsuccess("Cash Opening Balance Added successfully");
            navigate(`${process.env.PUBLIC_URL}/master/cashopeningbalance/list`);
        } catch (error) {
            console.error(error);
        }
    };


    const postAndCreateNew = async () => {
        const adddata = {
            amount,
            branch: idBranch,
        };
        await dispatch(createCashOpeningBalance(adddata));
        if (isError === false) {
            toastsuccess("Cash Opening Balance Added successfully");
            setAmount("");
            setIdBranch("");
        }
    };

    useEffect(() => {
        id !== undefined && dispatch(getCashOpeningBalanceById(id));
    }, [dispatch, id]);

    useEffect(() => {
        cashOpeningBalanceInfo != undefined &&
            (setAmount(cashOpeningBalanceInfo?.amount),
                setIdBranch(cashOpeningBalanceInfo?.branch),
                reset());
    }, [cashOpeningBalanceInfo, reset]);

    const putData = async () => {
        const adddata = {
            amount,
            branch: idBranch,
        };
        const reduxData = {
            id: id,
            putData: adddata,
        };
        await dispatch(updateCashOpeningBalanceById(reduxData));
        if (isError === false) {
            toastsuccess("container Edited successfully");
            navigate(`${process.env.PUBLIC_URL}/master/cashopeningbalance/list`);
        }
    };

    useEffect(() => {
        if (add === undefined && id === undefined) {
            navigate(`${process.env.PUBLIC_URL}/master/cashopeningbalance/list`);
        }
    }, [add, id, navigate]);

    return (
        <React.Fragment>
            <Head title={title ? title : "Cash Opening Balance"} />
            <Content>
                <PreviewCard className="h-100">
                    <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
                        <Col md={5}>
                            <ModifiedBreadcrumb />
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
                                    onClick={() => navigate(`${process.env.PUBLIC_URL}/master/cashopeningbalance/list`)}
                                >
                                    Cancel
                                </CancelButton>
                            </Col>
                        )}
                        {id !== undefined && (
                            <Col md={5} className="text-right flex">
                                <SaveButton disabled={issubmitting} size="md" color="primary" onClick={handleSubmit(putData)}>
                                    {issubmitting ? "Saving" : "Save"}
                                </SaveButton>

                                <CancelButton
                                    disabled={issubmitting}
                                    color="danger"
                                    size="md"
                                    onClick={() => navigate(`${process.env.PUBLIC_URL}/master/cashopeningbalance/list`)}
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
                                    <label className="form-label" htmlFor="branch">
                                        Branch
                                        <IsRequired />
                                    </label>
                                </div>
                            </Col>
                            <Col lg="3">
                                <div className="form-group">
                                    <BranchDropdown
                                        register={register}
                                        id={"idBranch"}
                                        branches={branches}
                                        selectedBranch={idBranch}
                                        onBranchChange={(value) => {
                                            setIdBranch(value);
                                        }}
                                        isRequired={true}
                                        clearErrors={clearErrors}
                                        setValue={setValue}
                                        message={errors.idBranch && "Branch is Required"}
                                    ></BranchDropdown>
                                </div>
                            </Col>
                        </Row>

                        <Row md={12} className="form-group row g-4">
                            <Col lg="1">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="site-name">
                                        Amount <IsRequired />
                                    </label>
                                </div>
                            </Col>
                            <Col lg="3">
                                <div className="form-group">
                                    <TextInputField
                                        register={register}
                                        isRequired={true}
                                        id={"amount"}
                                        placeholder="Amount"
                                        value={amount}
                                        SetValue={(value) => {
                                            setAmount(value);
                                            clearErrors("amount");
                                        }}
                                        message={errors.amount && "Amount is Required"}
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

export default CashOpeningBalanceForm;
