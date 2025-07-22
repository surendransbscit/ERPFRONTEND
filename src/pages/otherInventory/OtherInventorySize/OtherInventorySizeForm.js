import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { PreviewCard, SaveButton, CancelButton, SwitchInputField } from "../../../components/Component";
import { Col, Row, TextInputField } from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import { useForm } from "react-hook-form";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { createOtherInventorySize, getOtherInventorySizeById } from "../../../redux/thunks/otherInventory";
import { updateOtherInventorySizeById } from "../../../redux/thunks/otherInventory";


const OtherInventorySizeForm = () => {
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
    (state) => state.otherInventorySizeReducer
  );
  const { otherInventorySizeInfo } = useSelector((state) => state.otherInventorySizeReducer);

  const [size, setSize] = useState();
  const [sizeValue, setSizeValue] = useState();
  const [active, setActive] = useState(true);

  const postData = async () => {
    const adddata = {
      name: size,
      value: sizeValue,
      active
    };
    try {
      await dispatch(createOtherInventorySize(adddata)).unwrap();
      toastsuccess(size + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/other_inventory/size/list`);
    } catch (error) {
      console.error(error);
    }
  };
  const postAndCreateNew = async () => {
    const adddata = {
      name: size,
      value: sizeValue,
      active

    };

    await dispatch(createOtherInventorySize(adddata));
    if (isError === false) {
      toastsuccess("size Added successfully");
      setSize("");
      setSizeValue("");
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getOtherInventorySizeById(id));
  }, [dispatch, id]);

  useEffect(() => {
    otherInventorySizeInfo != undefined &&
      (
        setSize(otherInventorySizeInfo?.name),
        setSizeValue(otherInventorySizeInfo?.value),
        setActive(otherInventorySizeInfo?.active),
        reset());
  }, [otherInventorySizeInfo, reset]);

  const putData = async () => {
    const adddata = {
      name: size,
      value: sizeValue,
      active
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    await dispatch(updateOtherInventorySizeById(reduxData));
    if (isError === false) {
      toastsuccess("size Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/other_inventory/size/list`);
    }
  };
  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/other_inventory/size/list`);
    }
  }, [add, id, navigate]);

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (id !== undefined) {
      handleSubmit(putData)();
    } else {
      handleSubmit(postData)();
    }
  });

  return (
    <React.Fragment>
      <Head title="Size" />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={1}></Col>
            {add !== undefined && (
              <Col md={6} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) => postAndCreateNew(data, "saveAndNew"))}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) => postData(data, "saveAndClose"))}
                >
                  {issubmitting ? "Saving" : "Save & Close[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/other_inventory/size/list`)}
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={6} className="text-right flex">
                <SaveButton disabled={issubmitting} size="md" color="primary" onClick={handleSubmit(putData)}>
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/other_inventory/size/list`)}
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="size">
                    Size Name
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"size"}
                    placeholder="Size Name"
                    value={size}
                    SetValue={(value) => {
                      setSize(value);
                      clearErrors("size");
                    }}
                    message={errors.size && "size name is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="sizeValue">
                    Value
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"sizeValue"}
                    placeholder="Item Name"
                    value={sizeValue}
                    SetValue={(value) => {
                      setSizeValue(value);
                      clearErrors("sizeValue");
                    }}
                    message={errors.sizeValue && "value is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
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

export default OtherInventorySizeForm;