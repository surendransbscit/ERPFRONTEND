/* eslint-disable no-unused-expressions */
import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
    CancelButton,
    NumberInputField,
    PreviewCard,
    SaveButton,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    createDepositMaster,
    getDepositMasterById,
    updateDepositMasterById,
} from "../../../redux/thunks/retailMaster";
import { toastfunc, toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {Col,Row,TextInputField,Icon} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { v4 as uuid } from "uuid";
import { Button } from "reactstrap";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const DepositMasterForm = () => {
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
        (state) => state.depositMasterReducer
    );
    const { depositMasterInfo } = useSelector((state) => state.depositMasterReducer);

    const [scheme, setScheme] = useState();
    const [code, setCode] = useState();
    const [type, setType] = useState(1);
    const [payable_type, setPayableType] = useState(1);
    const [interest, setInterest] = useState(1);
    const [interest_percentage, setInterestPercentage] = useState(0);
    const [maturityInDays, SetMaturityInDays] = useState();
    const [interest_type, setInterestType] = useState(1);
    const [interestDays, setInterestDays] = useState([]);

    const { transformWord } = useContext(WordTransformerContext);

    useEffect(() => {
        if (interestDays?.length == 0) {
            addInterestDetails();
        }
    }, [interestDays]);

    const addInterestDetails = () => {
        setInterestDays([
            ...interestDays,
            {
                from_days: "",
                to_days: "",
                interest_percentage: "",
            },
        ]);
    };

    const handleDelete = (index) => {
        const updatedFormData = [...interestDays];
        updatedFormData.splice(index, 1);
        setInterestDays(updatedFormData);
      };

    const postData = async () => {
        const adddata = {
            interest_details : interestDays,
            scheme: scheme,
            code,
            type: parseInt(type),
            maturity_in_days: parseInt(maturityInDays),
            payable_type: parseInt(payable_type),
            interest: parseInt(interest),
            interest_percentage:parseFloat(interest_percentage),
            interest_type: parseInt(interest_type)
        };
        try {
            if(id===undefined){
                await dispatch(createDepositMaster(adddata)).unwrap();
                toastsuccess("Deposit Added successfully");
            }else{
                const reduxData = {
                    id: id,
                    putData: adddata,
                };
                await dispatch(updateDepositMasterById(reduxData)).unwrap();
                toastsuccess("Deposit Edited successfully");
            }
            
            navigate(`${process.env.PUBLIC_URL}/master/depositmaster/list`);
        } catch (error) {
            console.error(error);
        }

    };


    useEffect(() => {
        id !== undefined && dispatch(getDepositMasterById(id));
    }, [dispatch, id]);

    useEffect(() => {
        depositMasterInfo != undefined &&
            (
                setCode(depositMasterInfo?.code),
                setScheme(depositMasterInfo?.scheme),
                setType(depositMasterInfo?.type),
                setPayableType(depositMasterInfo?.payable_type),
                setInterest(depositMasterInfo?.interest),
                setInterestPercentage(depositMasterInfo?.interest_percentage),
                setInterestType(depositMasterInfo?.interest_type),
                setInterestDays(depositMasterInfo?.deposit_master_settings),
                SetMaturityInDays(depositMasterInfo?.maturity_in_days),
                reset()
            );
    }, [depositMasterInfo, reset]);

    useEffect(() => {
        if (add === undefined && id === undefined) {
            navigate(`${process.env.PUBLIC_URL}/master/depositmaster/list`);
        }
    }, [add, id, navigate]);

    const handleFormChange = (rowIndex, fieldName, value) => {
        if(fieldName==='interest_percentage'){
            if(parseFloat(value) > 100){
                toastfunc("Percentage should not greater than 0");
                value = 0;
            }
        }
        setInterestDays((prevData) => {
            const updatedData = prevData.map((row, index) =>
                index === rowIndex ? { ...row, [fieldName]: value } : row
            );
            return updatedData;
        });
    };
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
            <Head title={title ? title : "Deposit Master"} />
            <Content>
                <PreviewCard className="h-100">
                    <Row
                        lg={12}
                        className={"form-control-sm"}
                        style={{ marginTop: "10px" }}
                    >
                        <Col md={5}>
                            <ModifiedBreadcrumb/>
                        </Col>
                        <Col md={2}></Col>
                            <Col md={5} className="text-right flex">
                                <SaveButton
                                    disabled={issubmitting}
                                    size="md"
                                    color="primary"
                                    onClick={handleSubmit((data) =>
                                        postData(data, "save")
                                    )}
                                >
                                    {issubmitting ? "Saving" : "Save"}
                                </SaveButton>
                        
                                <CancelButton
                                    disabled={issubmitting}
                                    color="danger"
                                    size="md"
                                    onClick={() =>
                                        navigate(`${process.env.PUBLIC_URL}/master/depositmaster/list`)
                                    }
                                >
                                    Cancel
                                </CancelButton>
                            </Col>
                      
                    </Row>
                    <div className="custom-grid">
                        <Row md={12} className="form-group row g-4">
                            <Col lg="2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="scheme">
                                        Scheme
                                        <IsRequired />
                                    </label>
                                </div>
                            </Col>
                            <Col lg="3">
                                <div className="form-group">
                                    <TextInputField
                                        register={register}
                                        placeholder="Name"
                                        id={"scheme"}
                                        value={scheme}
                                        isRequired={true}
                                        type={"text"}
                                        setValue={setValue}
                                        SetValue={(value) => {
                                            setScheme(transformWord(value));
                                            clearErrors("scheme");
                                        }}
                                        message={errors.scheme && "Scheme is Required"}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row md={12} className="form-group row g-4">
                            <Col lg="2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="code">
                                        Code <IsRequired />
                                    </label>
                                </div>
                            </Col>
                            <Col lg="3">
                                <div className="form-group">
                                    <TextInputField
                                        register={register}
                                        isRequired={true}
                                        id={"code"}
                                        placeholder="code"
                                        value={code}
                                        SetValue={(value) => {
                                            setCode(value);
                                            clearErrors("code");
                                        }}
                                        message={errors.code && " code is Required"}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row md={12} className="form-group row g-4">
                            <Col md="2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="site-name">
                                        Type<IsRequired />
                                    </label>
                                </div>
                            </Col>
                            <Col lg="3">
                                <ul className="custom-control-group g-3 align-center flex-wrap">
                                    <li>
                                        <div className="custom-control custom-control-sm  custom-radio">
                                            <input
                                                id="amount_type"
                                                type="radio"
                                                value={1}
                                                name={"amount_type"}
                                                className="custom-control-input "
                                                checked={type == 1 ? true : false}
                                                onChange={(e) => {
                                                    setType(1);
                                                }}
                                            />
                                            <label className="custom-control-label" htmlFor="amount_type">
                                                Amount
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="custom-control custom-control-sm custom-radio">
                                            <input
                                                id="weight_type"
                                                type="radio"
                                                name={"weight_type"}
                                                value={2}
                                                className="custom-control-input"
                                                checked={type == 2 ? true : false}
                                                onChange={(e) => {
                                                    setType(2);
                                                }}
                                            />
                                            <label className="custom-control-label" htmlFor="weight_type">
                                                Weight
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="custom-control custom-control-sm  custom-radio">
                                            <input
                                                id="both_type"
                                                type="radio"
                                                value={3}
                                                name={"both_type"}
                                                className="custom-control-input "
                                                checked={type == 3 ? true : false}
                                                onChange={(e) => {
                                                    setType(3);
                                                }}
                                            />
                                            <label className="custom-control-label" htmlFor="both_type">
                                                Both
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </Col>
                        </Row>

                        <Row md={12} className="form-group row g-4">
                            <Col md="2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="site-name">
                                        Payable Type<IsRequired />
                                    </label>
                                </div>
                            </Col>
                            <Col lg="3">
                                <ul className="custom-control-group g-3 align-center flex-wrap">
                                    <li>
                                        <div className="custom-control custom-control-sm  custom-radio">
                                            <input
                                                id="payable_type_fixed"
                                                type="radio"
                                                value={1}
                                                name={"payable_type_fixed"}
                                                className="custom-control-input "
                                                checked={payable_type == 1 ? true : false}
                                                onChange={(e) => {
                                                    setPayableType(1);
                                                }}
                                            />
                                            <label className="custom-control-label" htmlFor="payable_type_fixed">
                                                Fixed
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="custom-control custom-control-sm custom-radio">
                                            <input
                                                id="payable_type_flexiable"
                                                type="radio"
                                                name={"payable_type_flexiable"}
                                                value={2}
                                                className="custom-control-input"
                                                checked={payable_type == 2 ? true : false}
                                                onChange={(e) => {
                                                    setPayableType(2);
                                                }}
                                            />
                                            <label className="custom-control-label" htmlFor="payable_type_flexiable">
                                                Flexible
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </Col>
                        </Row>

                        <Row md={12} className="form-group row g-4">
                            <Col md="2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="interest">
                                        Interest<IsRequired />
                                    </label>
                                </div>
                            </Col>
                            <Col lg="3">
                                <ul className="custom-control-group g-3 align-center flex-wrap">
                                    <li>
                                        <div className="custom-control custom-control-sm  custom-radio">
                                            <input
                                                id="interest_yes"
                                                type="radio"
                                                value={1}
                                                name={"interest_yes"}
                                                className="custom-control-input "
                                                checked={interest == 1 ? true : false}
                                                onChange={(e) => {
                                                    setInterest(1);
                                                }}
                                            />
                                            <label className="custom-control-label" htmlFor="interest_yes">
                                                Yes
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="custom-control custom-control-sm custom-radio">
                                            <input
                                                id="interest_no"
                                                type="radio"
                                                name={"interest_no"}
                                                value={2}
                                                className="custom-control-input"
                                                checked={interest == 2 ? true : false}
                                                onChange={(e) => {
                                                    setInterest(2);
                                                }}
                                            />
                                            <label className="custom-control-label" htmlFor="interest_no">
                                                No
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                        {interest == 1 && (
                            <Row md={12} className="form-group row g-4">
                                <Col md="2">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="interest_typeF">
                                            Interest Type<IsRequired />
                                        </label>
                                    </div>
                                </Col>
                                <Col lg="3">
                                    <ul className="custom-control-group g-3 align-center flex-wrap">
                                        <li>
                                            <div className="custom-control custom-control-sm  custom-radio">
                                                <input
                                                    id="interest_type_fixed"
                                                    type="radio"
                                                    value={1}
                                                    name={"interest_type_fixed"}
                                                    className="custom-control-input "
                                                    checked={interest_type == 1 ? true : false}
                                                    onChange={(e) => {
                                                        setInterestType(1);
                                                    }}
                                                />
                                                <label className="custom-control-label" htmlFor="interest_type_fixed">
                                                    Fixed
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="custom-control custom-control-sm custom-radio">
                                                <input
                                                    id="interest_type_time_period"
                                                    type="radio"
                                                    name={"interest_type_time_period"}
                                                    value={2}
                                                    className="custom-control-input"
                                                    checked={interest_type == 2 ? true : false}
                                                    onChange={(e) => {
                                                        setInterestType(2);
                                                    }}
                                                />
                                                <label className="custom-control-label" htmlFor="interest_type_time_period">
                                                    Time period
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                        )}

                        <Row md={12} className="form-group row g-4">
                            <Col lg="2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="maturityInDays">
                                        Maturity in Days
                                    </label>
                                </div>
                            </Col>
                            <Col lg="3">
                                <div className="form-group">
                                    <NumberInputField
                                        placeholder="Maturity Days"
                                        id={"maturityInDays"}
                                        value={maturityInDays}
                                        isRequired={true}
                                        register={register}
                                        reqValueError={"This field is required"}
                                        SetValue={(value) => {
                                            SetMaturityInDays(value);
                                            clearErrors("maturityInDays");
                                        }}
                                        message={errors.maturityInDays && "Maturity Days is Required"}
                                    />
                                
                                </div>
                            </Col>
                        </Row>
                        <Row md={12} className="form-group row g-4">
                            <Col lg="2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="tax_percentage">
                                        Interset Percentage
                                    </label>
                                </div>
                            </Col>
                            <Col lg="3">
                                <div className="form-group">
                                    <NumberInputField
                                        placeholder="Interset Percentage"
                                        id={"interest_percentage"}
                                        value={interest_percentage}
                                        isRequired={(parseInt(interest)===1 && interest_type===1  ?  true: false)}
                                        register={register}
                                        reqValueError={"This field is required"}
                                        max={100}
                                        setValue={setValue}
                                        SetValue={(value) => {
                                            setInterestPercentage(value);
                                            clearErrors("interest_percentage");
                                        }}
                                        message={errors.interest_percentage && "Interset percentage is Required"}
                                    />
                                </div>
                            </Col>
                        </Row>

                        {interest_type == 2 && (
                            <Row md={12} className="form-group row g-4">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>S.NO</th>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>Interset %</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {interestDays?.map((obj, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <input
                                                                {...register(`from_days${index}`)}
                                                                type="number"
                                                                name="from_days"
                                                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                                                placeholder="From"
                                                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                                value={obj?.from_days}
                                                                onChange={(e) => handleFormChange(index, "from_days", e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                {...register(`to_days${index}`)}
                                                                type="number"
                                                                name="to_days"
                                                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                                                placeholder="To"
                                                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                                value={obj?.to_days}
                                                                onChange={(e) => handleFormChange(index, "to_days", e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                {...register(`interest_percentage${index}`)}
                                                                type="number"
                                                                name="interest_percentage"
                                                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                                                placeholder="Interset"
                                                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                                value={obj?.interest_percentage}
                                                                onChange={(e) => handleFormChange(index, "interest_percentage", e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            {index == interestDays?.length - 1 && (
                                                                <Button
                                                                    color="primary"
                                                                    size="sm"
                                                                    className="btn-icon btn-white btn-dim"
                                                                    onClick={() => addInterestDetails()}
                                                                >
                                                                    <Icon name="plus" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                color="primary"
                                                                size="sm"
                                                                className="btn-icon btn-white btn-dim"
                                                                onClick={() => handleDelete(index)}
                                                            >
                                                                <Icon name="trash-fill" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </Row>
                        )}




                    </div>
                </PreviewCard>
            </Content>
        </React.Fragment>
    );
};

export default DepositMasterForm;
