import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import { BlockTitle, CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { createArea, createProfession, getAreaById, getProfessionById, updateAreaById, updateProfessionById } from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, NumberInputField, Row, SwitchInputField, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const ProfessionForm = () => {
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
    const { isLoading: issubmitting, isError } = useSelector((state) => state.professionReducer);
    const { professionInfo } = useSelector((state) => state.professionReducer);

    const [profession_name, setProfessionName] = useState();
    const [is_default, setIsDefault] = useState(false);
    const [active, setActive] = useState(true);
    const { transformWord } = useContext(WordTransformerContext);

    const postData = async () => {
        const adddata = {
            profession_name,
            is_active: active,
        };
        try {
            await dispatch(createProfession(adddata)).unwrap();
            toastsuccess(profession_name + " Added successfully");
            navigate(`${process.env.PUBLIC_URL}/master/profession/list`);
        } catch (error) {
            console.error(error);
        }
    };

    const postAndCreateNew = async () => {
        const adddata = {
            profession_name,
            is_active: active,
        };
        await dispatch(createProfession(adddata));
        if (isError === false) {
            toastsuccess("profession Added successfully");
            setProfessionName("");
            setIsDefault(false);
            setActive(true);
        }
    };

    useEffect(() => {
        id !== undefined && dispatch(getProfessionById(id));
    }, [dispatch, id]);

    useEffect(() => {
        professionInfo != undefined &&
            (setProfessionName(professionInfo?.profession_name),
                setActive(professionInfo?.is_active),
                reset());
    }, [professionInfo, reset]);

    const putData = async () => {
        const adddata = {
            profession_name,
            is_active: active,
        };
        const reduxData = {
            id: id,
            putData: adddata,
        };
        await dispatch(updateProfessionById(reduxData));
        if (isError === false) {
            toastsuccess("profession Edited successfully");
            navigate(`${process.env.PUBLIC_URL}/master/profession/list`);
        }
    };

    useEffect(() => {
        if (add === undefined && id === undefined) {
            navigate(`${process.env.PUBLIC_URL}/master/profession/list`);
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
            <Head title={title ? title : "Profession"} />
            <Content>
                <PreviewCard className="h-100">
                    <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
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
                                    onClick={handleSubmit((data) => postAndCreateNew(data, "saveAndNew"))}
                                >
                                    {issubmitting ? "Saving" : "Save & New "}
                                </SaveButton>

                                <SaveButton
                                    disabled={issubmitting}
                                    size="md"
                                    color="primary"
                                    onClick={handleSubmit((data) => postData(data, "saveAndClose"))}
                                >
                                    {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                                </SaveButton>

                                <CancelButton
                                    disabled={issubmitting}
                                    color="danger"
                                    size="md"
                                    onClick={() => navigate(`${process.env.PUBLIC_URL}/master/profession/list`)}
                                >
                                    Cancel
                                </CancelButton>
                            </Col>
                        )}
                        {id !== undefined && (
                            <Col md={5} className="text-right flex">
                                <SaveButton disabled={issubmitting} size="md" color="primary" onClick={handleSubmit(putData)}>
                                    {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                                </SaveButton>

                                <CancelButton
                                    disabled={issubmitting}
                                    color="danger"
                                    size="md"
                                    onClick={() => navigate(`${process.env.PUBLIC_URL}/master/profession/list`)}
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
                                        id={"profession_name"}
                                        placeholder="Profession Name"
                                        value={profession_name}
                                        SetValue={(value) => {
                                            setProfessionName(transformWord(value));
                                            clearErrors("profession_name");
                                        }}
                                        message={errors.profession_name && " Profession name is Required"}
                                    />
                                </div>
                            </Col>
                        </Row>

                        {/* <Row md={12} className="form-group row g-4">
                            <Col lg="1">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="is_default">
                                        Is Default
                                    </label>
                                </div>
                            </Col>
                            <Col lg="3">
                                <SwitchInputField
                                    register={register}
                                    id={"is_default"}
                                    checked={is_default}
                                    SetValue={setIsDefault}
                                    name={"is_default"}
                                />
                            </Col>
                        </Row> */}
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

export default ProfessionForm;
