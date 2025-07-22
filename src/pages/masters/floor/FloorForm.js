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
    createFloor,
    getFloorById,
    updateFloorById,
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
import { getAccessBranches } from "../../../redux/thunks/coreComponent";
import { BranchDropdown } from "../../../components/filters/retailFilters";
import { useHotkeys } from "react-hotkeys-hook";

const FloorForm = () => {
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
        (state) => state.floorReducer
    );
    const { floorInfo } = useSelector((state) => state.floorReducer);
    const { branches } = useBranches();

    const [name, setName] = useState();
    const [active, setActive] = useState(true);
    const [branch, SetBranch] = useState();

    const postData = async () => {
        const adddata = {
            floor_name: name,
            id_branch: branch,
            is_active: active,
        };
        try {
            await dispatch(createFloor(adddata)).unwrap();
            toastsuccess(name + " Added successfully");
            navigate(`${process.env.PUBLIC_URL}/master/floor/list`);
        } catch (error) {
            console.error(error);
        }

    };

    const postAndCreateNew = async () => {
        const adddata = {
            floor_name: name,
            id_branch: branch,
            is_active: active,
        };

        await dispatch(createFloor(adddata));
        if (isError === false) {
            toastsuccess("Floor Added successfully");
            setName("");
            SetBranch("");
            setActive(true);
        }
    };

    useEffect(() => {
        id !== undefined && dispatch(getFloorById(id));
    }, [dispatch, id]);

    useEffect(() => {
        floorInfo != undefined &&
            (
                setName(floorInfo?.floor_name),
                SetBranch(floorInfo?.id_branch),
                setActive(floorInfo?.is_active),
                reset());
    }, [floorInfo, reset]);

    const putData = async () => {
        const adddata = {
            floor_name: name,
            id_branch: branch,
            is_active: active,
        };
        const reduxData = {
            id: id,
            putData: adddata,
        };

        await dispatch(updateFloorById(reduxData));
        if (isError === false) {
            toastsuccess("Floor Edited successfully");
            navigate(`${process.env.PUBLIC_URL}/master/floor/list`);
        }
    };

    useEffect(() => {
        dispatch(getAccessBranches());
    }, [dispatch]);

    useEffect(() => {
        if (add === undefined && id === undefined) {
            navigate(`${process.env.PUBLIC_URL}/master/floor/list`);
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
            <Head title={title ? title : "Floor"} />
            <Content>
                <PreviewCard className="h-100">
                    <Row
                        lg={12}
                        className={"form-control-sm"}
                        style={{ marginTop: "10px" }}
                    >
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
                                    {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                                </SaveButton>

                                <CancelButton
                                    disabled={issubmitting}
                                    color="danger"
                                    size="md"
                                    onClick={() =>
                                        navigate(`${process.env.PUBLIC_URL}/master/floor/list`)
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
                                        navigate(`${process.env.PUBLIC_URL}/master/floor/list`)
                                    }
                                >
                                    Cancel
                                </CancelButton>
                            </Col>
                        )}
                    </Row>
                    <div className="custom-grid">
                        <Row md={12} className="form-group row g-4">
                            <Col md="1">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="branch">
                                        Branch
                                        <IsRequired />
                                    </label>
                                </div>
                            </Col>
                            <Col md="3">
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
                                        placeholder="Floor Name"
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

export default FloorForm;
