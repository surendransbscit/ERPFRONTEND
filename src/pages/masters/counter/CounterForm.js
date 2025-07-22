/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
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
    createCounter,
    getCounterById,
    getFloorOptions,
    updateCounterById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
    Col,
    Row,
    SwitchInputField,
    TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { BranchDropdown } from "../../../components/filters/retailFilters";
import { useBranches } from "../../../components/filters/filterHooks";
import { useHotkeys } from "react-hotkeys-hook";


const CounterForm = () => {
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
        (state) => state.counterReducer
    );
    const { counterInfo } = useSelector((state) => state.counterReducer);
    const { floorOptions } = useSelector((state) => state.floorReducer);

    console.log(floorOptions);

    const { branches } = useBranches();
    const [branch, SetBranch] = useState();

    const [name, setName] = useState();
    const [floor, setFloor] = useState();
    const [active, setActive] = useState(true);
    const [filteredFloorOptions, setFilteredFloorOptions] = useState(floorOptions);

    useEffect(() => {
        if (branch) {
            const filtered = floorOptions?.filter((item) => item?.id_branch === branch);
            setFilteredFloorOptions(filtered);
        } else {
            setFilteredFloorOptions(floorOptions);
        }
    }, [branch, floorOptions]);

    const postData = async () => {
        const adddata = {
            counter_name: name,
            id_floor: floor,
            is_active: active,
        };
        try {
            await dispatch(createCounter(adddata)).unwrap();
            toastsuccess(name + " Added successfully");
            navigate(`${process.env.PUBLIC_URL}/master/counter/list`);
        } catch (error) {
            console.error(error);
        }

    };

    const postAndCreateNew = async () => {
        const adddata = {
            counter_name: name,
            id_floor: floor,
            is_active: active,
        };

        try {
            await dispatch(createCounter(adddata)).unwrap();
            toastsuccess("Floor Added successfully");
            setName("");
            setFloor("");
            setActive(true);
        } catch (error) {
            console.error(error);
        }

        // await dispatch(createCounter(adddata));
        // if (isError === false) {
        //     toastsuccess("Floor Added successfully");
        //     setName("");
        //     setFloor("");            
        //     setActive(true);
        // }
    };

    useEffect(() => {
        id !== undefined && dispatch(getCounterById(id));
    }, [dispatch, id]);

    useEffect(() => {
        counterInfo != undefined &&
            (
                setName(counterInfo?.counter_name),
                setFloor(counterInfo?.id_floor),
                setActive(counterInfo?.is_active),
                reset());
    }, [counterInfo, reset]);

    const putData = async () => {
        const adddata = {
            counter_name: name,
            id_floor: floor,
            is_active: active,
        };
        const reduxData = {
            id: id,
            putData: adddata,
        };
        try {
            await dispatch(updateCounterById(reduxData)).unwrap();
            toastsuccess("Counter Edited successfully");
            navigate(`${process.env.PUBLIC_URL}/master/counter/list`);
        } catch (error) {
            console.error(error);
        }
        // await dispatch(updateCounterById(reduxData));
        // if (isError === false) {
        //     toastsuccess("Counter Edited successfully");
        //     navigate(`${process.env.PUBLIC_URL}/master/counter/list`);
        // }
    };

    useEffect(() => {
        dispatch(getFloorOptions());
    }, [dispatch]);

    useEffect(() => {
        if (add === undefined && id === undefined) {
            navigate(`${process.env.PUBLIC_URL}/master/counter/list`);
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
            <Head title={title ? title : "Counter"} />
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
                                        navigate(`${process.env.PUBLIC_URL}/master/counter/list`)
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
                                        navigate(`${process.env.PUBLIC_URL}/master/counter/list`)
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
                                    <label className="form-label" htmlFor="scheme">
                                        Branch
                                        <IsRequired />
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
                                        onBranchChange={SetBranch}
                                        isRequired={true}
                                        clearErrors={clearErrors}
                                        setValue={setValue}
                                        message={errors.branch && "Branch is Required"}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row md={12} className="form-group row g-4">
                            <Col md="1">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="floor">
                                        Floor
                                        <IsRequired />
                                    </label>
                                </div>
                            </Col>
                            <Col md="3">
                                <div className="form-group">
                                    <div className="form-control-wrap">
                                        <div className="form-control-select">
                                            <select
                                                className="form-control form-select"
                                                id="floor"
                                                {...register("floor", {
                                                    required: true,
                                                })}
                                                value={floor}
                                                onChange={(e) => {
                                                    setFloor(e.target.value);
                                                }}
                                                placeholder="Floor"
                                            >
                                                <option label="Select Floor" value=""></option>
                                                {filteredFloorOptions?.map((item, index) => (
                                                    <option key={index} value={item?.id_floor}>
                                                        {item.floor_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors?.floor && (
                                                <span className="invalid">This field is required</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
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
                                        placeholder="Counter Name"
                                        value={name}
                                        SetValue={(value) => {
                                            setName(value);
                                            clearErrors("name");
                                        }}
                                        message={errors.name && " name is Required"}
                                    />
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

export default CounterForm;
