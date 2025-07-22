/* eslint-disable no-unused-expressions */
import React, { useEffect, useState, useContext} from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import { BlockTitle, CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createContainer,
  deleteContainerPdfs,
  getContainerById,
  updateContainerById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, NumberInputField, Row, SwitchInputField, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { BranchDropdown } from "../../../components/filters/retailFilters";
import { useBranches } from "../../../components/filters/filterHooks";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const ContainerMasterForm = () => {
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
  const { isLoading: issubmitting, isError } = useSelector((state) => state.containerReducer);
  const { containerInfo } = useSelector((state) => state.containerReducer);

  const [container_name, setContainerName] = useState();
  const [sku_id, setSkuID] = useState();
  const [description, setDescription] = useState();
  const [weight, setWeight] = useState();
  const [active, setActive] = useState(true);
  const [idBranch, setIdBranch] = useState("");
  const { transformWord } = useContext(WordTransformerContext);

  const { branches } = useBranches();

  const postData = async () => {
    const adddata = {
      container_name,
      sku_id,
      description,
      weight,
      is_active: active,
      branch: idBranch,
    };
    // try {
    //     await dispatch(createContainer(adddata)).unwrap();
    //     // toastsuccess(container_name + " Added successfully");
    //     console.log(adddata.data.pdf_url);
    //     navigate(`${process.env.PUBLIC_URL}/master/container/list`);
    //     window.open(adddata.data.pdf_url, "_blank");
    try {
      let response = "";
      response = await dispatch(createContainer(adddata)).unwrap();
        navigate(`${process.env.PUBLIC_URL}/master/container/list`);
        window.open(response?.data?.pdf_url, "_blank");
    //   const pdfUrl = response?.data?.pdf_url;

    //   const pdfWindow = window.open(pdfUrl, "_blank");

    //   const checkWindowClosed = setInterval(() => {
    //     if (pdfWindow.closed) {
    //       clearInterval(checkWindowClosed);

    //       dispatch(deleteContainerPdfs());
    //     }
    //   }, 1000);

    //   navigate(`${process.env.PUBLIC_URL}/master/container/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getContainerById(id));
  }, [dispatch, id]);

  useEffect(() => {
    containerInfo != undefined &&
      (setContainerName(containerInfo?.container_name),
      setSkuID(containerInfo?.sku_id),
      setDescription(containerInfo?.description),
      setWeight(containerInfo?.weight),
      setActive(containerInfo?.is_active),
      setIdBranch(containerInfo?.branch),
      reset());
  }, [containerInfo, reset]);

  const putData = async () => {
    const adddata = {
      container_name,
      sku_id,
      description,
      weight,
      is_active: active,
      branch: idBranch,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    await dispatch(updateContainerById(reduxData));
    if (isError === false) {
      toastsuccess("container Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/container/list`);
    }
  };

  useEffect(() => {
      if (add === undefined && id === undefined) {
          navigate(`${process.env.PUBLIC_URL}/master/container/list`);
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
      <Head title={title ? title : "Container"} />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb/>
            </Col>
            <Col md={2}></Col>
            {add !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) => postData(data, "saveAndNew"))}
                >
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>
                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/container/list`)}
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
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/master/container/list`)}
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
                    Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"container_name"}
                    placeholder="Container Name"
                    value={container_name}
                    SetValue={(value) => {
                      setContainerName(transformWord(value));
                      clearErrors("container_name");
                    }}
                    message={errors.container_name && " container name is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    SKU ID <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"sku_id"}
                    placeholder="SKU ID"
                    value={sku_id}
                    SetValue={(value) => {
                      setSkuID(value);
                      clearErrors("sku_id");
                    }}
                    message={errors.sku_id && " sku id is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Weight <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"weight"}
                    placeholder="Container Weight"
                    value={weight}
                    SetValue={(value) => {
                      setWeight(value);
                      clearErrors("weight");
                    }}
                    message={errors.weight && " weight is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="description">
                    Description
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={false}
                    id={"description"}
                    placeholder="Description"
                    value={description}
                    SetValue={(value) => {
                      setDescription(value);
                      clearErrors("");
                    }}
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

export default ContainerMasterForm;
